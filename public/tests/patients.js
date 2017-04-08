var express = require('express');
var router = express.Router();
var pg = require('pg').native;
var pgp = require('pg-promise')();

/* GET home page. */
router.get('/', function(req, response, next) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT username FROM users', function(err, result) {
      done();
      if (err) {
        response.json(err);
      } else {
      //  console.log("resultttttzzz",result.rows);

        response.json(result.rows);
      }
    });
  });
});

module.exports = router;
