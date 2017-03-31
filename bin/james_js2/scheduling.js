$(document).ready(function() {
	$('#table-schedule-instances tr').click(function() { // user clicked a schedule instance (can edit it)

		$('#editSchedule-datepicker').datepicker({ // add datepicker to the modal
				autoclose: true
		});

		$('#editSchedule-modal').modal('show');
		
		$('#editSchedule-modal').keyup(function(e) { // close the datepicker if esc was pressed when modal was focused (otherwise datepicke wont close)
			if (e.keyCode === 27) {
				$('#editSchedule-datepicker').val('');
				$('#editSchedule-datepicker').datepicker("hide");
			}
		});
	});
});