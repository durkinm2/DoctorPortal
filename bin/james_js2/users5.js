var express = require('express');
var router = express.Router();
var app = express();
var passport = require('passport');
var db2 = require('./queries');
var db = app.get('db');
// var user = app.get('')
var deasync = require('deasync');
//var user = roles;
var roleType;
var roleid;

/* GET users listing. */
router.get('/login',
  function(req, res){
    res.render('login', {layout:null});
  });

router.post('/login',
  // This is where authentication happens

  passport.authenticate('local', { failureRedirect: 'login' }),function (req, res, next) {
    roleid = parseInt(req.user.role_id);

   req.app.get('db').roles.findOne({role_name : "admin"},
     function(err, result) {
       console.log(result);
       roleType = parseInt(result.role_id);
     });
     console.log(roleType);
     console.log(roleid,roleType);
     console.log("fresh",req.fresh);
     console.log(req.user);
     if (roleid !== roleType){
       console.log('isprofile');
       res.redirect('profile');
     } else if (roleid == roleType){
       console.log("isadmin");
       res.redirect('admin');
     } else{
       console.log("low");
       res.sendStatus(500);

     }

    }

 );

router.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

router.get('/',
  function(req, res, next) {
    res.redirect('/');
  });

function isAdmin(req, res, next) {
   if (req.user && roleid == roleType){
    next();
  }  else {
      res.redirect('/');
    }
  }

router.get('/admin', isAdmin,
  function(req, res) {
      res.render('admin', {user: req.user, layout: 'adminLayout'});
  });

function isDoctor(req, res, next) {
  if (req.user && roleid !== roleType){
    next();
  } else {
    res.redirect('/');
  }
}


router.all('/profile/*', isDoctor);
//admin.all('/', isAdmin);
router.get('/profile', isDoctor,
  function(req, res){
      res.render('profile', { title: 'Home', user: req.user });
  });

router.get('/profile/medibase',
    function(req, res, next){
      res.render('medibase', { title: 'Medibase', user: req.user});
  });
/*-------------------patients API---------------------------*/
router.get('/api/patients', isDoctor, db2.getAllPatients);
router.get('/api/regimens/:pat_id', isDoctor, db2.getAllRegimens);
router.get('/api/doctors', isAdmin, db2.getAllDoctors);
router.post('/api/status/:doc_id', isAdmin, db2.updateDoctorStatus);
router.post('/api/regimen/:pat_id', isDoctor, db2.deleteRegimen);
//router.post('/api/regimens/:pat_id', isDoctor, db2.upsertRegimen);
router.post('/api/regimenz/:pat_id', isDoctor, db2.upsertRegimen);
// router.get('/api/regimen/:pat_id', isDoctor, db2.upsertRegimen);

router.get('/profile/patients',
  function(req, res, next){
  req.app.get('db').patients.find(
    function(err, result){
      if (err) {
      return next(err);
      }
      res.render('patients', { title: 'Patients', user: req.user });
    });
});

router.get('/profile/patients/:pat_id', db2.getSinglePatient);

router.get('/profile/patients/:pat_id/regimens', function(req, res, next){
  res.render('regimens', { title: 'Regimens', user: req.user });
});
router.get('/profile/patients/:pat_id/reports', function(req, res, next){
  res.render('reports', { title: 'Reports'});
});


module.exports = router;
