var express = require('express');
var router = express.Router();
var passport = require('passport');
var pg = require('pg').native;
var bcrypt = require('bcryptjs');
var massive = require("massive");

var connectionString = process.env.DATABASE_URL || "postgres://postgres:admin1@localhost/mirror";
var db = massive.connectSync({connectionString : connectionString});
var db2 = require('./queries');

/* GET users listing. */
router.get('/login',
  function(req, res){
    res.render('login', {layout:null});
  });

router.post('/login',
  // This is where authentication happens
  passport.authenticate('local', { failureRedirect: 'login' }),
  function(req, res,next) {

  // Authorization for type admin or user
      if(req.user.role == 'administrator'){
        res.redirect('admin');
      }
      else{
        res.redirect('profile');
      }
  });
router.get('/logout',
    function(req, res){
      req.logout();
      res.redirect('/');
    });
router.get('/', function(req, res, next) {
    res.redirect('login');
  });

    function isAdmin(req, res, next) {
      if (req.user){
        next();
      } else {
        res.redirect('login');
      }
    }

router.get('/admin',
  isAdmin,
    function (req, res) {
      //console.log(req.user.user_type);
  res.render('admin', {user: req.user, layout: 'adminLayout'});
  router.get('/api/doctors', db2.getAllDoctors);
    });

  function loggedIn(req, res, next) {
    if (req.user) {
  //    console.log(1111, req.user.id);
      next();
    } else {
      res.redirect('login');
    }
  }
router.get('/profile',
  loggedIn,
    function(req, res){
    res.render('profile', { user: req.user });
  });
router.get('/profile/reports', function(req, res, next){
  res.render('reports', {title: 'Reports'});
});

router.get('/profile/patientProfile', function(req, res, next){
  res.render('patientProfile', {title: 'Dashboard'});
});
router.get('/api/patients', db2.getAllPatients);
router.get('/api/patients/:pat_id', db2.getSinglePatient);

router.get('/profile/regimens', function(req, res, next){
  res.render('regimens', { title: 'Regimens' });
});

router.get('/profile/patients', function(req, res, next){
  db.patients.find(1,function(err,res){
      console.log("lalala", res);
      });
    res.render('patients', { title: 'Patients'});

});

router.get('/profile/medibase', function(req, res, next){
  res.render('medibase', { title: 'Medibase'});
});

module.exports = router;
