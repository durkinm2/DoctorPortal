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

/* GET users listing. */
router.get('/login', ensureLoggedOut,
  function(req, res){
    res.render('login', {layout:null});
  });

router.post('/login', function(req, res, next){
  // This is where authentication happens

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      console.log("err", err);
       return next(err);
     }
    // Redirect if it fails
      if (!user) {
         return res.redirect('/login');
       }
        req.logIn(user, function(err) {
        if (err) {
           return next(err);
         }
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


function ensureLoggedOut(req, res, next) {
  if (!req.user){
    next();
  } else if (req.user.role_id === 1) {
    res.redirect('/admin');
  } else if (req.user.role_id === 2) {
    res.redirect('/profile');
  } else {
    res.sendStatus(500);
  }
}

function andRestrictTo(role) {
return function(req, res, next) {
  if(!req.user){res.redirect('/');}
    else if (roleType === role) {
      console.log(roleType);
      next();
    } else {
      console.log(req.user,"error", role);
      next(new Error('Unauthorized'));
    }
  }
}

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

router.get('/profile/medibase',andRestrictTo(2),
    function(req, res, next){
      res.render('medibase', { title: 'Medibase', user: req.user});
  });
/*-------------------patients API---------------------------*/
router.get('/api/patients', andRestrictTo(2), db2.getAllPatients);
router.get('/api/regimens/:pat_id',andRestrictTo(2), db2.getAllRegimens);
router.get('/api/doctors', andRestrictTo(1), db2.getAllDoctors);
router.post('/api/status/:doc_id', andRestrictTo(1), db2.updateDoctorStatus);
router.post('/api/regimen/:pat_id',andRestrictTo(2), db2.deleteRegimen);
router.post('/api/regimens/:pat_id', andRestrictTo(2),db2.upsertRegimen);
router.post('/api/regimenz/:pat_id', andRestrictTo(2), db2.upsertRegimen);
router.get('/api/regimen/:pat_id',andRestrictTo(2),db2.upsertRegimen);

router.get('/profile/patients',andRestrictTo(2),
  function(req, res, next){
  req.app.get('db').patients.find(
    function(err, result){
      if (err) {
      return next(err);
      }
      res.render('patients', { title: 'Patients', user: req.user });
    });
});

router.get('/profile/patients/:pat_id',andRestrictTo(2), db2.getSinglePatient);

router.get('/profile/patients/:pat_id/regimens',andRestrictTo(2), function(req, res, next){
  res.render('regimens', { title: 'Regimens', user: req.user });
});
router.get('/profile/patients/:pat_id/reports', andRestrictTo(2),function(req, res, next){
  res.render('reports', { title: 'Reports'});
});

module.exports = router;
