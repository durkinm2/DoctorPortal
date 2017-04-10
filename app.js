var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
dotenv.load();

var massive = require("massive");
var routes = require('./routes/index');
var users = require('./routes/users');

var connectionString = process.env.DATABASE_URL + "?ssl=true";
//var connectionString = process.env.DATABASE_URL;
var massiveInstance = massive.connectSync({connectionString : connectionString});

var app = express();

require('dotenv').load();

var session = require('express-session');
var bcrypt = require('bcryptjs');
var pg = require('pg').native;

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use( new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},

function(username, password, done) {
  pg.connect(process.env.DATABASE_URL, function(err, client, next) {
    if (err) {
      return console.error("Unable to connect to database");
    }
    console.log("Connected to database");
      client.query('SELECT * FROM users WHERE username = $1', [username], function(err, result) {
      // Release client back to pool
      next();

      if (err) {
        console.log("Database error");
        return done(err);
      }
      if (!result.rows[0].acct_active) {
        console.log("Account not activated");
        return done(err);
      }
      if (result.rows.length > 0) {
        var matched = bcrypt.compareSync(password, result.rows[0].password);
        if (matched) {
          console.log("Successful login");
          return done(null, result.rows[0]);
        }
      }

      console.log("Bad username or password");
      return done(null, false);
    });

  });
}));


// Store user information into session
passport.serializeUser(function(user, done) {

  return done(null, user.id);
});

// Get user information out of session
passport.deserializeUser(function(id, done) {
  pg.connect(process.env.DATABASE_URL, function(err, client, next) {
    client.query('SELECT id, username FROM users WHERE id = $1', [id], function(err, result) {
      next();
      // Return the user
      if (result) {
        return done(null, result.rows[0]);
      }
      return done(null, false);
    });
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  proxy: true,
  secret: 'web-portal',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: app.get('env') === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);

app.set('db', massiveInstance);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.layout = 'error';
  err.status = 404;

  next(err);
});

// app.use(function(req, res, next) {
//   var err = new Error('Unauthorized');
//   err.status = 403;
//   err.layout = 'error403';
//
//   next(err);
// });

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render(err.layout, {
      layout: err.layout,
      message: err.message,
      error: err,
      type: err.status
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render(err.layout, {
    layout: err.layout,
    message: err.message,
    error: err,
    type: err.status
  });
});
module.exports = app;
