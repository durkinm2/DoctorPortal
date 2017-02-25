var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp(process.env.DATABASE_URL);

// add query functions
function getAllPatients(req, res, next) {
  var docid = (req.user.id);
//  console.log("meeeeeppmomomomomopopo", req.patients.id);
  db.any('select * from patients where doc_id = $1', docid)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL patients'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSinglePatient(req, res, next) {
//  var docid = parseInt(req.params.id);
  var patid = (req.params.id);
  db.one('select * from patients where pat_id = $1', patid)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE patient'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getAllDoctors(req, res, next) {
  db.any('select * from users')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL Doctors'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}
/*
function createPatient(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
      'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one puppy'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}*/

module.exports = {
  getAllPatients: getAllPatients,
  getSinglePatient: getSinglePatient,
  getAllDoctors: getAllDoctors
};
