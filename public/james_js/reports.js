/**
 * reports.js - Formats and displays the response data for a patients
 * regimen using BootstrapTable and Chart.js
 * @author - James Salvatore
 */
 var pathname = window.location.pathname.split('/');
 var path_id = pathname[4];

require(['/dist/js/chart/Chart.js']); // load Chart.js library (awesome looking doughnut chart)

/**
 * @param  {Object} - Event for when a regimen instance (to get the report of) is clicked
 * Hides the regimens overview and displays the report for the corresponding regimen
 * that was selected.
 */
function hideReportsOverivew(event) {
	var regimenToReport;

	if ($(event.currentTarget).hasClass('regimen-past')) regimenToReport = patientRegimens_past[$('.regimen-past').index(this)];
	else regimenToReport = patientRegimens_current[$('.regimen-current').index(this)];

	$('#reports-overview').fadeOut(500, function() {
		$('#table-current-report').bootstrapTable();
		$('#table-current-report').empty();
		loadSelectedReport(regimenToReport);
	});
}

/**
 * @param  {Object} - Regimen to show the report of
 * Loads and formats the response data of the selected regimen into a bootstrap table
 * and creates a chart based on the analytics of that response data (response type counts).
 */
function loadSelectedReport(regimen) {

	$('#report-medname').html('Medication: ' + regimen.med_name);
	$('#report-startdate').html('Start Date:&nbsp;&nbsp;' + regimen.start_date);
	$('#report-enddate').html('End Date:&nbsp;&nbsp;&nbsp;&nbsp;' + regimen.end_date);

	var date_responses = [];
	var header = $('<thead>');
	var header_row = $('<tr>');
	var header_cols = "";

	var response_type_counts = [0,0,0,0];

	var max_response_len = 0;

	// create all table headers, and determine max-length date_time_combo
	for (key in regimen.responses) {
		if (!regimen.responses.hasOwnProperty(key)) return;

		var date = key;
		date_responses.push(regimen.responses[date]);
		if (regimen.responses[date].length > max_response_len) max_response_len = regimen.responses[date].length;

		header_cols += '<th class="cell-fixedwidth" data-field="id" data-sortable="true">' + date + '</th>';

	}

	header_row.append(header_cols);
	header.append(header_row);
	$('#table-current-report').append(header);

	// load rows into bootstrap table
	var body = $('<tbody>');
	for (var i = 0; i < max_response_len; i++) {
		var body_row = $('<tr>');
		var body_data = "";

		// process date_time_combos one at a time based on remaining depth, produces a vertically displayed table (descending),
		// also capture repsonse type counts for chart dataset
		for (var j = 0; j < date_responses.length; j++) {
			if (date_responses[j].length !== 0) {
				var curr_response = date_responses[j].shift().split('-');
				if (curr_response.length === 2) { // miss temporary or miss permanent

					if (curr_response[1] === 'MISST') response_type_counts[2]++;
					else response_type_counts[3]++;

					body_data += '<td class="response response-' + curr_response[1].toLowerCase() + '">' + curr_response[1] + ' | ' + curr_response[0] + '</td>';

				} else if (curr_response.length === 3) { // yes or no

					if (curr_response[2] === 'YES') response_type_counts[0]++;
					else response_type_counts[1]++;

					body_data += '<td class="response response-' + curr_response[2].toLowerCase() + '">' + curr_response[2] + ' | ' + curr_response[0] + ' | ' + curr_response[1] +  '</td>';

				} else { // date & time hasnt occured yet (response TBD)
					body_data += '<td>' + curr_response[0] + '</td>';
				}
			} else body_data += '<td></td>'; // there still exits more data at further depths for other dates, so just make the cell blank
		}

		body_row.append(body_data);
		body.append(body_row);
	}

	$('#table-current-report').append(body);

	// remove unwanted css attributes from this bootstrap table (instead of modifying bootstrap-table.css)
	$('.fixed-table-container').css('border', 'none');
	$('.fixed-table-container').css('border-radius', 'none');
	$('.fixed-table-container').css('-webkit-border-radius', 'none');
	$('.fixed-table-container').css('-moz-border-radius', 'none');

	// build doughnut chart using Chart.js to display distribution of response types
	var chart = $('#chart-current-report');
	var data = { // data for chart
		labels: [
			"Yes",
			"No",
			"Miss (Temporary)",
			"Miss (Permanent)"
		],
		datasets: [
			{
				data: response_type_counts,
				backgroundColor: [
					"#5CB85C",
					"#F0AD53",
					"#A5A5A5",
					"#D9534F"
				],
				hoverBackgroundColor: [
					"#5CB85C",
					"#F0AD53",
					"#A5A5A5",
					"#D9534F"
				]
			}]
	};

	$('#regimen-report-container').fadeIn(500, function() {
		var responseChart = new Chart(chart, { // create chart
			type: 'doughnut',
			data: data
		});
	});

	$($('.report-chart-container')[0]).height($($('.report-table-container')[0]).height()); // set height of chart to height of table

}

/**
 * @param  {Object} - Event for when the 'Export As' dropdown is changed
 * Updates the dropdown when a new 'Export As' option is selected.
 */
function handler_exportTypeSelected(event) {
	$('#dropdown-export-type').html($(event.currentTarget).html());
}

/**
 * Exports the data from the bootstrap table based upon the selected format.
 */
function exportTable() { // export the table data based on selected option
	var exportType = $('#dropdown-export-type').html().toLowerCase();
	var exportOptions = new Object();

	if (exportType === 'excel (xlsx)') exportType = 'xlsx';
	else if (exportType === 'pdf') {
		exportOptions['jspdf'] =
			{format: 'bestfit',
			  margins: {left: 20, right: 10, top: 20, bottom: 20},
			  autotable: {styles: {fillColor: 'inherit',
								   textColor: 'inherit'},
						  tableWidth: 'wrap'}
			}
	}

	exportOptions['type'] = exportType;

	$('#table-current-report').tableExport(exportOptions);
}

/**
 * Animated left-scrolling when the 'Left' button is clicked.
 */
function handler_scrollLeft() { // horizontal scroll buttons for table
	var scrollableTable = $('.fixed-table-body')[0];
	$(scrollableTable).animate({scrollLeft: $(scrollableTable).scrollLeft() - 400});
}

/**
 * Animated right-scrolling when the 'Right' button is clicked.
 */
function handler_scrollRight() {
	var scrollableTable = $('.fixed-table-body')[0];
	$(scrollableTable).animate({scrollLeft: $(scrollableTable).scrollLeft() + 400});
}


$(document).on('click', '.card-regimen-instance', hideReportsOverivew);
$('.dropdown-item').on('click', handler_exportTypeSelected);
$('#export-table').on('click', exportTable);
$('#table-scroll-left').on('click', handler_scrollLeft);
$('#table-scroll-right').on('click', handler_scrollRight);
$('#return-to-overview').on('click', function() {location.reload();}); // simply refresh page when 'Back to Reports Overview' is clicked

loadRegimensRequest('/users/api/regimens/' + path_id, false);
