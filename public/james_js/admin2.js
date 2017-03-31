var $table = $('#table-account-instances');
var doc_id;
$(document).ready(function() {


			$table.on('click-row.bs.table', function (e, row, $element) {
 doc_id = row.id;
 var status;
 console.log(row);


		$('#editAccount-modal').modal('show');


		console.log("tesrowid", doc_id, row.id);

		$('#select-active').click(function(e) {
 			status = 'true';
		});
		$('#select-nonactive').click(function(e) {
 			status = 'false';
		});

		var newStatus = {doc_id : doc_id, status : status};

		$('#save-account-status').click(function(e){

			$.ajax
			({
				type: "POST",
				dataType: 'json',
				data: newStatus,
				url: '/api/status/' + row.id ,
				success: function () {
				console.log("Thanks!");
				}
			});

		});

});
});
