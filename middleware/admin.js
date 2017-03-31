var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function admindb(req, res, next){
passport.use('admin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},

function(username, password, done) {
  pg.connect(process.env.DATABASE_URL, function(err, client, next) {
    if (err) {
      return console.error("Unable to connect to database");
    }
    console.log("Connected to database");
      client.query('SELECT * FROM admins WHERE username = $1', [username], function(err, result) {
      // Release client back to pool
      next();

      if (err) {
        console.log("Database error");
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
    client.query('SELECT id, username FROM admins WHERE id = $1', [id], function(err, result) {
      next();
      // Return the user
      if (result) {
        return done(null, result.rows[0]);
      }
      return done(null, false);
    });
  });
});
}
