/**
 * regimenLoader.js - Loads the regimens for a particular patient.
 * @author - James Salvatore
 */

var patientRegimens_current; // current (in-progress) regimens
var patientRegimens_past; // past (completed) regimens
var card_id;

/**
 * @param  {String} - URL endpoint to fetch patient JSON data (regimen) from
 * Init request handling for select patient profile (loads the regimen data).
 *
 * NOTE: This script is shared by both regimens.html and reports.html
 */
 function loadRegimensRequest(url) {
 	$('#regimen-statustext-current').html('<i class="fa fa-refresh fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span>');
 	$('#regimen-statustext-past').html('<i class="fa fa-refresh fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span>');

 	$.getJSON(url, function(data) {
 		if (data.regimens) {
     	card_id=(data.regimens);
 			console.log(data.regimens);
       displayRegimens(data.regimens);
 		}
 	})
 	.fail(function(event) {
 		if (event.status === 404) {
 			$('#regimen-statustext-current').html('<i class="fa fa-ban" aria-hidden="true"></i> An error has occurred, please refresh the page.');
 			$('#regimen-statustext-past').html('<i class="fa fa-ban" aria-hidden="true"></i> An error has occurred, please refresh the page.');
 		}
 	});

 }

/**
 * @param  {Object} - Regimen JSON to insert a bootstrap card for
 * Inserts a regimen card to it's appropriate sub-section (past or current) on the UI.
 */
function insertRegimenCard(regimen) {
	var regimen_card;
console.log(regimen);
  	if (new Date(regimen.card.end_date).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)) {
  		regimen_card = createRegimenCard_current(regimen.card);
  		$('#regimen-row-current').append(regimen_card);
  		if (!patientRegimens_current) patientRegimens_current = [];

  		patientRegimens_current.push(regimen);

  	}
	else {
		regimen_card = createRegimenCard_past(regimen.card);
		$('#regimen-row-past').append(regimen_card);
		if (!patientRegimens_past) patientRegimens_past = [];
  		patientRegimens_past.push(regimen);
	}
}

/**
* @param  {Object} regimen - The regimen JSON to create the card for
* Creates a Bootstrap card containing the medication name,
* start date and end date for a past (completed) regimen.
*/
function createRegimenCard_past(regimen) {
	var regimenCard =
		'<div class="card card-regimen-instance card-clickable regimen-past">'
		+ '<div class="card-block">'
			+ '<h3 class="card-title pb-2">' + regimen.med_name + '</h3>' + '<hr>'
			+ '<p>' + 'End Date: ' + regimen.end_date + '</p>'
		' + </div>'
	  + '</div>';

	  // wrap the card in a bootstrap col (size 4)
	  var bootstrap_cardwrapper =
	 	'<div class="col-sm-4 mb-4">'
	 		+ regimenCard;
	  + '</div>';

	return bootstrap_cardwrapper;
}

/**
* @param  {Object} regimen - The regimen JSON to create the card for
* Creates a Bootstrap card containing the medication name,
* start date and end date for a current (in-progress) regimen.
*/
function createRegimenCard_current(regimen) {
	var regimenCard =
		'<div class="card card-regimen-instance card-clickable regimen-current">'
		+ '<a href="#" class="delete-regimen"></a>'
		+ '<div class="card-block">'
			+ '<h3 class="card-title pb-2">' + regimen.med_name + '</h3>' + '<hr>'
			+ '<p>' + 'Start Date: ' + regimen.start_date + '</p>'
			+ '<p>' + '&nbspEnd Date: ' + regimen.end_date;
		' + </div>'
	  + '</div>';

	 var bootstrap_cardwrapper =
	 	'<div class="col-sm-4 mb-4">'
	 		+ regimenCard;
	  + '</div>';


	return bootstrap_cardwrapper;
}

/**
 * @param  {Array<Object>} - Collection of regimen JSON objects
 * Displays each regimen for a given patient.
 */
 function displayRegimens(regimens) {
 	$('#regimen-statustext-current').html('<i class="fa fa-ban" aria-hidden="true"></i> Nothing to show.');
 	$('#regimen-statustext-past').html('<i class="fa fa-ban" aria-hidden="true"></i> Nothing to show.');

 	patientRegimens_current = null;
 	patientRegimens_past = null;

 	$('.regimen-current').parent().remove();
 	$('.regimen-past').parent().remove();

 	regimens.sort(function(a, b){
 		return a.id > b.id;
 	});

 	for (var i = 0; i < regimens.length; i++) {

 		insertRegimenCard(regimens[i]);

 	}
	if (patientRegimens_past) $('#regimen-statustext-past').hide();
	if( patientRegimens_current) $('#regimen-statustext-current').hide();

 }
