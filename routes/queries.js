var promise = require('bluebird');
var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp(process.env.DATABASE_URL + "?ssl=true");

// Gets all patients belonging to a doctor
function getAllPatients(req, res, next) {
  var docid = (req.user.id);
  db.any('select * from patients where doc_id = $1', docid)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL Patients'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// Gets a single patient when there is a valid patient ID in the URL
function getSinglePatient(req, res, next){
  var patid = parseInt(req.params.pat_id);
  var docid = parseInt(req.user.id);

  req.app.get('db').patients.find(patid, function(err,result) {
    if(!result) {
      console.log("Error finding patient "+patid+" in database: "+err);
      res.status(500).send;
    } else {
      console.log(result);
      res.render('patientProfile', {
        title: 'Patient Profile',
        user: req.user,
        pat_id: patid,
        fname: result.fname,
        lname: result.lname,
        email: result.contact[0],
        phone: result.contact[1],
        address: result.contact[2]
      });
      }
  });
}

// Gets all doctors for an admin profile
function getAllDoctors(req, res, next) {
  db.any('select acct_active, active, fname, lname, id, username from users')
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

// Gets all regimens for a single patient
function getAllRegimens(req, res, next) {
  var patid = parseInt(req.params.pat_id);
  var docid = parseInt(req.user.id);
  db.any('select card, id from regimens where doc_id = $1 and pat_id = $2', [docid, patid])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          regimens: data,
          message: 'Retrieved ALL Regimens for Patient ' + patid
        });
    })
    .catch(function (err) {
      res.status(500);
      //return next(err);
    });
}

// Creates a new regimen or updates an existing one
function upsertRegimen(req, res, next){
  var card = req.body.regimen;
  var pat = parseInt(req.params.pat_id);
  var card_id = req.body.test2;

// if updating a card
  if (card_id) {
    req.app.get('db').regimens.update({id: card_id, card: card}, function(err, result){
      if (err) {
        console.log("Could not update card");
      } else {
        console.log("Card successfully updated");
        res.json(result);
      }
    });
// if creating a card
  } else {
    req.app.get('db').regimens.save({doc_id: req.user.id, pat_id: pat, card: card}, function(err, result){
      if (err) {
        console.log("Could not create card");
      } else {
        console.log("Card successfully created");
        res.json(result);
      }
    });
  }
}

// Deletes an existing current regimen
function deleteRegimen(req, res, next) {
  var card = req.body.regimen;
  var card_id = req.body.test3;

  req.app.get('db').regimens.destroy({id: card_id}, function(err, result){
    //Array containing the destroyed record is returned
    if (err) {
      console.log("Could not delete card");
    } else{
      console.log("Card successfully deleted");
      res.json(result);
    }
  });

}

// Enables or disables a doctor's account
function updateDoctorStatus(req, res, next) {
  var docid = parseInt(req.body.acct);
  var newStatus = req.body.option;

  db.none('update users set acct_active=$1 where id=$2', [newStatus, docid])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Changed activation status to ' + newStatus
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


function getRegimens(req, res, next) {
  var patid = parseInt(req.params.pat_id);

  console.log("api get success");
  db.any('select card, id from regimens where pat_id = $1', patid)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          regimens: data,
          message: 'Retrieved ALL Regimens for Patient ' + patid
        });
    })
    .catch(function (err) {
      res.status(500);
      //return next(err);
    });
}

function sendResponse(req, res, next) {

var card = req.body.regimen;
var pat = parseInt(req.params.pat_id);
var card_id = req.body.test2;
//var response = req.body.responses;

// if updating card
if (card_id) {
  req.app.get('db').regimens.update({id: card_id, card: card}, function(err, result){
    if (err) {
      console.log("Could not update card");
    } else {
      console.log("Card successfully updated");
      res.json(result);
    }
  });
} else {
  console.log("Error sending response");
  
}
// if creating card

// else {
//   req.app.get('db').regimens.save({doc_id: req.user.id, pat_id: pat, card: card}, function(err, result){
//     if (err) {
//       console.log("Could not create card");
//     } else {
//       console.log("Card successfully created");
//       res.json(result);
//     }
//   });
// }
}


module.exports = {
  getAllPatients: getAllPatients,
  getSinglePatient: getSinglePatient,
  getAllDoctors: getAllDoctors,
  getAllRegimens: getAllRegimens,
  upsertRegimen: upsertRegimen,
  updateDoctorStatus: updateDoctorStatus,
  deleteRegimen: deleteRegimen,
  getRegimens: getRegimens,
  sendResponse: sendResponse

};
