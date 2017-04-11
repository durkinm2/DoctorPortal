var express = require('express');
var router = express.Router();

// Sets login page as landing page
router.get('/', function(req, res, next) {
  res.redirect('/users/login');
});

module.exports = router;
