

$(document).ready(function() {
	$('#patient-reports').click(function() {
		window.location = window.location.protocol + '//' + window.location.host + '/users/profile/patients/reports';
	});

	$('#patient-regimens').click(function() {
		window.location = window.location.protocol + '//' + window.location.host + window.location.pathname +  '/regimens';
	});


});
