var express = require('express');
var router = express.Router();
var app = express();
var passport = require('passport');
var db2 = require('./queries');
var db = app.get('db');
var deasync = require('deasync');
var connectRoles = require('connect-roles');
var roleType;
var roleid;

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });



/* GET users listing. */
router.get('/login', ensureLoggedOut,
  function(req, res){
    res.render('login', {layout:null});
  });

router.post('/login', function(req, res, next){
/* This is where authentication happens
 * If authentication fails, remains on login page
 * If authentication succeeds, gets role type for authorization purposes
 */
  passport.authenticate('local', function(err, user, info) {
    if (err) {
       console.log("err", err);
       return next(err);
     }
    if (!user) {
       return res.redirect('/login');
     }
// method of authorization subject to change, works fine though
    req.logIn(user, function(err) {
       if (err) return next(err);
       if (user.role_id === 1){
         roleType = user.role_id;
         return res.redirect('admin');
       } else {
         roleType = user.role_id;
         return res.redirect('profile');
       }
      });
    })(req, res, next);
  });

router.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

router.get('/',
  function(req, res, next) {
    res.redirect('/');
  });

// Prevents access to login page if already logged in
function ensureLoggedOut(req, res, next) {
  if (!req.user){
    next();
  } else if (roleType === 1) {
    res.redirect('admin');
  } else if (roleType === 2) {
    res.redirect('profile');
  } else {
    res.sendStatus(500);
  }
}

// Callback to authorize a route by role
function andRestrictTo(role) {
  return function(req, res, next) {
    if(!req.user) {
      res.redirect('/');
    } else if (roleType === role) {
      next();
    } else {
    //  next(new Error('Unauthorized'));
    res.render('error403', {message: "Unauthorized", type : 403, layout : 'error403'});
  }
  }
}

// Routes

// router.all('/admin/*', andRestrictTo("administrator"));
router.get('/admin', andRestrictTo(1),
  function(req, res) {
      res.render('admin', {user: req.user, layout: 'adminLayout'});
  });

//router.all('/profile/*', andRestrictTo(2));
router.get('/profile', andRestrictTo(2),
  function(req, res) {
      res.render('profile', { title: 'Home', user: req.user });
  });

router.get('/profile/medibase', andRestrictTo(2),
  function(req, res, next){
      res.render('medibase', { title: 'Medibase', user: req.user});
  });

router.get('/profile/patients', andRestrictTo(2),
  function(req, res, next){
    req.app.get('db').patients.find(
      function(err, result){
        if (err) {
          return next(err);
        }
        res.render('patients', { title: 'Patients', user: req.user });
      });
  });

router.get('/profile/patients/:pat_id', andRestrictTo(2), db2.getSinglePatient);

router.get('/profile/patients/:pat_id/regimens', andRestrictTo(2),
  function(req, res, next){
    res.render('regimens', { title: 'Regimens', user: req.user });
});

router.get('/profile/patients/:pat_id/reports', andRestrictTo(2),
  function(req, res, next){
    res.render('reports', { title: 'Reports', user: req.user });
});

/*----------------------- API ---------------------------*/
router.get('/api/patients', andRestrictTo(2), db2.getAllPatients);
router.get('/api/regimens/:pat_id',andRestrictTo(2), db2.getAllRegimens);
router.get('/api/doctors', andRestrictTo(1), db2.getAllDoctors);
router.post('/api/status/:doc_id', andRestrictTo(1), db2.updateDoctorStatus);
router.post('/api/regimen/:pat_id', andRestrictTo(2), db2.deleteRegimen);
router.post('/api/regimens/:pat_id', andRestrictTo(2),db2.upsertRegimen);
router.post('/api/regimenz/:pat_id', andRestrictTo(2), db2.upsertRegimen);
router.get('/api/regimen/:pat_id', andRestrictTo(2), db2.upsertRegimen);
router.get('/api/response/:pat_id', db2.getRegimens);
router.post('/api/respond/:pat_id', db2.sendResponse);

module.exports = router;
