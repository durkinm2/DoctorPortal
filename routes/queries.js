var promise = require('bluebird');
var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp(process.env.DATABASE_URL + "?ssl=true");

// add query functions
function getAllPatients(req, res, next) {
  var docid = (req.user.id);
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

 function getSinglePatient(req, res, next){
  var patid = parseInt(req.params.pat_id);
  var docid = parseInt(req.user.id);

  req.app.get('db').patients.find(patid, function(err,result) {
    if(err) {
      console.log("Error finding patient "+patid+" in database: "+err);
      res.sendStatus(500);
    } else {
      console.log(result.contact);
      console.log(JSON.stringify(result.contact));
      console.log(result.contact[1]);
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
};


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

function getAllRegimens(req, res, next) {
  var patid = parseInt(req.params.pat_id);
  var docid = parseInt(req.user.id);
  db.any('select card, id from regimens where doc_id = $1 and pat_id = $2', [docid, patid])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          regimens: data,
          message: 'Retrieved ALL Regimens for Patient'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function upsertRegimen(req, res, next){
<<<<<<< HEAD
  var card= req.body.regimen;
  var pat = parseInt(req.params.pat_id);
  var card_id = req.body.test2;
  console.log(card_id,"cardid", card);

  if (card_id) {
=======
  var card = req.body.regimen;
  var pat = parseInt(req.params.pat_id);
  var card_id = req.body.test2;

console.log(req.body);

  if (card_id){
>>>>>>> first commit
    req.app.get('db').regimens.update({id: card_id, card: card}, function(err, result){
      if (err) {
        console.log("Could not update card");
      } else {
        console.log("Card successfully updated");
<<<<<<< HEAD
      }
    });
  }
// if creating card
  else {
=======
        res.json(result);
      }
    });
// if creating card
}  else {
>>>>>>> first commit
    req.app.get('db').regimens.save({doc_id: req.user.id, pat_id: pat, card: card}, function(err, result){
      if (err) {
        console.log("Could not create card");
      } else {
        console.log("Card successfully created");
<<<<<<< HEAD
              console.log("after", result, card);
              res.json(result);
=======
              console.log("after", result);
              res.json(result);
            card_id=result.id;
>>>>>>> first commit
      }
    });
  }

<<<<<<< HEAD

}
=======
  }


>>>>>>> first commit

function updateDoctorStatus(req, res, next) {
  var docid = parseInt(req.user.id);
  var status;
  db.none('update users set acct_active=$1 where id=$2', [status, docid])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Changed activation status'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

<<<<<<< HEAD
=======
// function deleteRegimen(req, res, next) {
//
//
//
// }

>>>>>>> first commit

module.exports = {
  getAllPatients: getAllPatients,
  getSinglePatient: getSinglePatient,
  getAllDoctors: getAllDoctors,
  getAllRegimens: getAllRegimens,
  upsertRegimen: upsertRegimen,
  updateDoctorStatus: updateDoctorStatus
};
