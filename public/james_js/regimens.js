$(document).ready(function() {
	$('.regimen-instance').click(function() { // user clicked a schedule instance (can edit it)

		$('#editRegimen-datepicker').datepicker({ // add datepicker to the modal
				autoclose: true
		});

		$('#editRegimen-modal').modal('show');
		
		$('#editRegimen-modal').keyup(function(e) { // close the datepicker if esc was pressed when modal was focused (otherwise datepicke wont close)
			if (e.keyCode === 27) {
				$('#editRegimen-datepicker').val('');
				$('#editRegimen-datepicker').datepicker("hide");
			}
		});
	});
});