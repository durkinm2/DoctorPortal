$(document).ready(function() {
	$('#action-patients').click(function(){
		window.location = window.location.protocol + '//' + window.location.host + '/users/profile/patients';
	});
	$('#action-medibase').click(function(){
		window.location = window.location.protocol + '//' + window.location.host + '/users/profile/medibase';
	});
});
