var $table = $('#table');

$(function () {
  	$table.on('click-row.bs.table', function (e, row, $element) {
    		$('.success').removeClass('success');
    		$($element).addClass('success');
  	});
    $('#button').click(function () {
    		alert('Selected name: ' + getSelectedRow().name);
    });
});

function getSelectedRow() {
    var index = $table.find('tr.success').data('index');
    return $table.bootstrapTable('getData')[index];
}

$(document).ready(function() {
	$('#table-patient-instances tbody').click(function() { // user clicked a patient instance
		window.location = window.location.protocol + '//' + window.location.host + '/users/profile/patientProfile';
	});
})
/*db.patients.find({doc_id: req.user.id}, function(err,result){

});*/
