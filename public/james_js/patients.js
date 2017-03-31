var $table = $('#table-patient-instances');


$(document).ready(function () {

	$table.on('click-row.bs.table', function (e, row, $element) {
		 window.location = window.location.protocol + '//' + window.location.host + '/users/profile/patients/'+ row.pat_id;

 });

});
