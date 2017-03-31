$(document).ready(function() {
	loadRegimensRequest('../tests/sample_regimens.json', false);
});



// ..................... HTML element creation & insertion methods for dynamic elements ..................... //
function createRegimenCard_past(regimen) {
	// dont check for empty fields, would never exist when created initially
	var regimenCard =
		'<div class="card card-regimen-instance card-clickable regimen-past">'
		+ '<div class="card-block">'
			+ '<h3 class="card-title pb-2">' + regimen.med_name + '</h3>' + '<hr>'
			+ '<p>' + 'End Date: ' + regimen.end_date + '</p>'
		' + </div>'
	  + '</div>';

	  var bootstrap_cardwrapper =
	 	'<div class="col-sm-3 mb-4">'
	 		+ regimenCard;
	  + '</div>';

	return bootstrap_cardwrapper;
}

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
	 	'<div class="col-sm-3 mb-4">'
	 		+ regimenCard;
	  + '</div>';


	return bootstrap_cardwrapper;
}


function hideReportsOverivew(event) {
	var regimenToReport;

	if ($(event.currentTarget).hasClass('regimen-past')) regimenToReport = patientRegimens_past[$('.regimen-past').index(this)];
	else regimenToReport = patientRegimens_current[$('.regimen-current').index(this)];

	$('#reports-overview').fadeOut(500, function() {
		// $('#reports-overview').empty(); // clear contents (will be refreshed via database pull when going back)
		loadSelectedReport(regimenToReport);
	});
}

function loadSelectedReport(regimen) {
	console.log(regimen);

}

function createReportTable() {
	var ok =
		'<div class="report-f">'
}


$(document).on('click', '.card-regimen-instance', hideReportsOverivew);
