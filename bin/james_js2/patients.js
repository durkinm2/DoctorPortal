$(document).ready(function() {
	$('#table-patient-instances tbody').click(function() { // user clicked a patient instance
		window.location = window.location.protocol + '//' + window.location.host + '/html/patientProfile.html';
	});
})