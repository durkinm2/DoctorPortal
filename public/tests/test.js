var express = require('express');
var pg = require('pg').native;

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
