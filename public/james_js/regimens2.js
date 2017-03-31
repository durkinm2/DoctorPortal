var url = '/users/api/regimens';
// var currPatientRegimens;

var patientRegimens_current;
var patientRegimens_past;

var currentRegimenStartDate;
var isEditingRegimen;
var editingIndex;

// init request handling for select patient profile (loads the regimen data)
function loadRegimensRequest(url) {
	console.log('wooooooooooooooooooosdfsdfsfsdf');

	//$('#regimen-statustext-current')('<i class="fa fa-refresh fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span>');
	//$('#regimen-statustext-past')('<i class="fa fa-refresh fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span>');

	$.getJSON(url, function(data) {
		if (data.regimens) { // will use better 'check' technique once database requests are working
			displayRegimens(data.regimens);
		}
	})
	.fail(function(event) {
		if (event.status === 404) {
	//		$('#regimen-statustext-current')('<i class="fa fa-ban" aria-hidden="true"></i> An error has occurred, please refresh the page.');
		//	$('#regimen-statustext-past')('<i class="fa fa-ban" aria-hidden="true"></i> An error has occurred, please refresh the page.');
		}
	});

}

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
	 	'<div class="col-sm-4 mb-4">'
	 		+ regimenCard;
	  + '</div>';

	return bootstrap_cardwrapper;
}

function createRegimenCard_current(regimen) {
	var regimenCard =
		'<div class="card card-regimen-instance card-clickable regimen-current">'
		+ '<a href="#" class="close-thik"></a>'
		+ '<div class="card-block">'
			+ '<h3 class="card-title pb-2">' + regimen.med_name + '</h3>' + '<hr>'
			+ '<p>' + 'Start Date: ' + regimen.start_date + '</p>'
			+ '<p>' + '&nbspEnd Date: ' + regimen.end_date;
		' + </div>'
	  + '</div>';

	 var bootstrap_cardwrapper =
	 	'<div class="col-sm-4 mb-4">'
	 		+ regimenCard;
	  + '</div>';


	return bootstrap_cardwrapper;
}

function createTimeslot() {
	var timeslot =
	'<div class="btn-group mb-1 regimen-modal-timeslot-grp">'
	+ '<input class="form-control form-control-sm regimen-modal-timeslot" type="text">'
	+ '<span class="regimen-modal-timeslot-delete"><i class="fa fa-times" aria-hidden="true"></i></span>'
  + '</div>';

	return timeslot;
}

function createWeekSchema() {
	var weekSchema =
	    '<div class="row seven-cols regimen-modal-weekschema mb-1">'
	    + '<div class="col-sm-12 regimen-modal-replicate-container mt-1">'
	    	+ '<label class="regimen-modal-switch">'
	    		+ '<input class="replicate-week" type="checkbox">'
	    		+ '<div class="slider round"></div>'
	    	+ '</label>'
	    	+ '<label class="regimen-modal-replicate-label ml-2">Replicate Week</label>'
	    + '</div>'
        + '<div class="col">'
        	+ '<label class="form-control mb-1 regimen-modal-datelabel" type="text" readonly></label>'
	        + '<button class="btn btn-primary btn-sm btn-addtime btn-block mb-1"><i class="fa fa-plus"></i> Time</button>'
	        + '<div class="regimen-modal-timeslot-container"></div>'
        + '</div>'
        + '<div class="col">'
          	+ '<label class="form-control mb-1 regimen-modal-datelabel" type="text" readonly></label>'
          	+ '<button class="btn btn-primary btn-sm btn-addtime btn-block mb-1"><i class="fa fa-plus"></i> Time</button>'
          	+ '<div class="regimen-modal-timeslot-container"></div>'
        + '</div>'
        + '<div class="col">'
          	+ '<label class="form-control mb-1 regimen-modal-datelabel" type="text" readonly></label>'
          	+ '<button class="btn btn-primary btn-sm btn-addtime btn-block mb-1"><i class="fa fa-plus"></i> Time</button>'
          	+ '<div class="regimen-modal-timeslot-container"></div>'
        + '</div>'
        + '<div class="col">'
          	+ '<label class="form-control mb-1 regimen-modal-datelabel" type="text" readonly></label>'
          	+ '<button class="btn btn-primary btn-sm btn-addtime btn-block mb-1"><i class="fa fa-plus"></i> Time</button>'
          	+ '<div class="regimen-modal-timeslot-container"></div>'
        + '</div>'
        + '<div class="col">'
          	+ '<label class="form-control mb-1 regimen-modal-datelabel" type="text" readonly></label>'
          	+ '<button class="btn btn-primary btn-sm btn-addtime btn-block mb-1"><i class="fa fa-plus"></i> Time</button>'
          	+ '<div class="regimen-modal-timeslot-container"></div>'
        + '</div>'
        + '<div class="col">'
          	+ '<label class="form-control mb-1 regimen-modal-datelabel" type="text" readonly></label>'
          	+ '<button class="btn btn-primary btn-sm btn-addtime btn-block mb-1"><i class="fa fa-plus"></i> Time</button>'
          	+ '<div class="regimen-modal-timeslot-container"></div>'
        + '</div>'
        + '<div class="col">'
          	+ '<label class="form-control mb-1 regimen-modal-datelabel" type="text" readonly></label>'
          	+ '<button class="btn btn-primary btn-sm btn-addtime btn-block mb-1"><i class="fa fa-plus"></i> Time</button>'
          	+ '<div class="regimen-modal-timeslot-container"></div>'
        + '</div>'
      + '</div>';

      return weekSchema;
}

function insertRegimenCard(regimen) {
	var regimen_card;

  	if (new Date(regimen.end_date) > new Date()) {
  		regimen_card = createRegimenCard_current(regimen);
  		$('#regimen-row-current').append(regimen_card);
  		if (!patientRegimens_current) patientRegimens_current = [];
  		patientRegimens_current.push(regimen);

  	}
	else {
		regimen_card = createRegimenCard_past(regimen);
		$('#regimen-row-past').append(regimen_card);
		if (!patientRegimens_past) patientRegimens_past = [];
  		patientRegimens_past.push(regimen);
	}


}
// .................................................................................................. //


// ........................... methods for displaying each dynamic component ........................ //
function displayRegimens(regimens) {
	$('#regimen-statustext-current').hide();
	$('#regimen-statustext-past').hide();
	for (var i = 0; i < regimens.length; i++) {
		insertRegimenCard(regimens[i]);
	}
}

function displayDateContainers(newStartDate, newEndDate) {

	if (!currentRegimenStartDate) currentRegimenStartDate = newStartDate.format('MM/DD/YYYY'); // set it the first time

	var week_schema_container = $('#regimen-modal-weekschema-container');
	var different_startDate = false;
	var no_init_schemas = false;

	if ($(week_schema_container).children().length === 0) {
		no_init_schemas = true;
		week_schema_container.append(createWeekSchema());
	}

	else if (newStartDate.format('MM/DD/YYYY') !== currentRegimenStartDate) {
		different_startDate = true;
		currentRegimenStartDate = newStartDate.format('MM/DD/YYYY');
	}

	var curr_week_schema_index = 0;
	var curr_week_schema = week_schema_container.children('.regimen-modal-weekschema')[0]; // init schema

	var curr_timeslot_container_index = 1; // start at 1 to skip the 'replicate' button
	var curr_timeslot_container;

	var curr_date = newStartDate.clone();

	while (curr_date.diff(newEndDate, 'days') <= 0) { // <= 0 in order to include end date

		if (curr_timeslot_container_index === 8) {
			curr_week_schema_index += 1;
			if (week_schema_container.children().length === curr_week_schema_index) week_schema_container.append(createWeekSchema());

			curr_week_schema = week_schema_container.children('.regimen-modal-weekschema')[curr_week_schema_index];
			curr_timeslot_container_index = 1;
		}

		curr_timeslot_container = $(curr_week_schema).children()[curr_timeslot_container_index];
		$(curr_timeslot_container).addClass('date-active');
		$($(curr_timeslot_container).children()[0]).text(curr_date.format('MM/DD/YYYY'));

		if (different_startDate) $(curr_timeslot_container).children('.regimen-modal-timeslot-container').empty();

		curr_date = curr_date.clone().add(1, 'days');
		curr_timeslot_container_index += 1;

	}

	// wipe extra days from a previously longer date span
	while (curr_timeslot_container_index < $(curr_week_schema).children().length) {
		curr_timeslot_container = $(curr_week_schema).children()[curr_timeslot_container_index];
		if ($(curr_timeslot_container).hasClass('date-active')) {
			$(curr_timeslot_container).removeClass('date-active');
			$($(curr_timeslot_container).children()[0]).text('');
			$(curr_timeslot_container).children('.regimen-modal-timeslot-container').empty();
		}
		curr_timeslot_container_index += 1;
	}

	if (curr_week_schema_index+1 < $(week_schema_container).children().length) {
		$(week_schema_container).children().slice(curr_week_schema_index+1).detach();
	}
}

function displayLoadedTimeslots(date_time_combos) {
	var loaded_dates = $('#regimen-modal-weekschema-container').find('.date-active');
	var curr_combo_index = 0;

	// for (var i = 0; i < loaded_dates.length; i++) {
	// 	if (curr_combo_index === date_time_combos.length) return;

	// 	var curr_date_combo = date_time_combos[curr_combo_index].split(' ');
	// 	var curr_date_container = loaded_dates[i];

	// 	if ($($(curr_date_container).children()[0]).text() === curr_date_combo[0]) {
	// 		var curr_timeslot_container = $(loaded_dates[i]).children()[2];

	// 		for (var j = 1; j < curr_date_combo.length; j++) {
	// 			$(curr_timeslot_container).append(createTimeslot());

	// 			var new_timeslot = $(curr_timeslot_container).children().last();
	// 			var new_timeslot_input = $(new_timeslot).children()[0];

	// 			$(new_timeslot_input).timepicker();
	// 			$(new_timeslot_input).val(curr_date_combo[j]);
	// 		}
	// 		curr_combo_index += 1;
	// 	}
	// }

	for (var i = 0; i < loaded_dates.length; i++) { // access each date container
		var curr_date_container = loaded_dates[i];

		for (var key in date_time_combos) {
			if (!date_time_combos.hasOwnProperty(key)) continue;

			var curr_date = key; // date
			var curr_date_timeslots = date_time_combos[curr_date]; // array of timeslots

			if ($($(curr_date_container).children()[0]).text() === curr_date) { // add date text to container
				var curr_timeslot_container = $(loaded_dates[i]).children()[2];

				for (var j = 0; j < curr_date_timeslots.length; j++) { // add all timeslots to the date's timeslot container
					$(curr_timeslot_container).append(createTimeslot());

					var new_timeslot = $(curr_timeslot_container).children().last();
					var new_timeslot_input = $(new_timeslot).children()[0];

					$(new_timeslot_input).timepicker();
					$(new_timeslot_input).val(curr_date_timeslots[j]);
				}

			}
		}
	}

}
// .................................................................................................. //


// ..................................... regimen saving and loading ................................. //
function loadSelectedRegimen(selectedRegimen, alreadyEnded) {

	var datepicker_start_input = $($('#regimen-datepicker-startdate').children()[0]); // input fields
	var datepicker_end_input = $($('#regimen-datepicker-enddate').children()[0]);

	var start_date_wrapper = moment(new Date(selectedRegimen.start_date));
	var end_date_wrapper = moment(new Date(selectedRegimen.end_date));
	var now = moment();

	$('#medication-name').val(selectedRegimen.med_name);

	displayDateContainers(start_date_wrapper, end_date_wrapper);
	displayLoadedTimeslots(selectedRegimen.date_time_combos);

	if (!alreadyEnded) {
		isEditingRegimen = true;
		$($('.modal-content')[0]).find('*').prop('disabled', false);
		$('#regimen-datepicker-enddate').datepicker('setDate', selectedRegimen.end_date);

		if (start_date_wrapper.diff(now, 'days') < 0) { // start date has already passed, disable it to prevent edits
			datepicker_start_input.attr('placeholder', selectedRegimen.start_date);
			datepicker_start_input.prop('disabled', true);
		}
		else $('#regimen-datepicker-startdate').datepicker('setDate', selectedRegimen.start_date);
	}
	else {
		isEditingRegimen = false;
		$($('.modal-content')[0]).find('*').prop('disabled', true);
		datepicker_end_input.attr('placeholder', selectedRegimen.end_date);
		datepicker_start_input.attr('placeholder', selectedRegimen.start_date);
	}

	showModal();
}

function saveRegimen() {
	var med_name = $('#medication-name').val();

	var start_date = $('#regimen-datepicker-startdate').datepicker('getDate');
	var end_date = $('#regimen-datepicker-enddate').datepicker('getDate');

	var datepicker_start_input = $($('#regimen-datepicker-startdate').children()[0]);
	if (datepicker_start_input.prop('disabled')) start_date = datepicker_start_input.attr('placeholder');

	var start_date_wrapper = moment(new Date(start_date));
	var end_date_wrapper = moment(new Date(end_date));

	var selected_dates = $('#regimen-modal-weekschema-container').find('.date-active');

	// ensure all required fields are filled out
	if (med_name === '') {
		updateWarningLabel($('#medication-name'), 'Medication name required');
		return;
	}

	if (selected_dates.length === 0 || end_date_wrapper.diff(start_date_wrapper, 'days') < 0) {
		updateWarningLabel($('#regimen-modal-weekschema-container'), 'Please select two valid dates');
		return;
	}

	if ($(selected_dates).find('.regimen-modal-timeslot').length === 0) {
		updateWarningLabel($('#regimen-modal-weekschema-container'), 'Please create a timeslot');
		return;
	}
	// end fields check

	var date_time_combos = new Object();

	for (var i = 0; i < selected_dates.length; i++) {
		var times = $(selected_dates[i]).find('.regimen-modal-timeslot');
		var curr_date = $($(selected_dates[i]).children()[0]).text();
		var curr_timeslots = [];

		for (var j = 0; j < times.length; j++) {
			if (times[j].value !== '') curr_timeslots.push(times[j].value);
			else {
				updateWarningLabel($('#regimen-modal-weekschema-container'), 'One or more invalid timeslots');
				return;
			}
		}

		date_time_combos[curr_date] = curr_timeslots;
	}

	med_name = med_name.charAt(0).toUpperCase() + med_name.slice(1);

	var regimen = {
		med_name : med_name,
		start_date : start_date_wrapper.format('MM/DD/YYYY'),
		end_date : end_date_wrapper.format('MM/DD/YYYY'),
		date_time_combos : date_time_combos
	}

	if (isEditingRegimen) {
		patientRegimens_current[editingIndex] = regimen;
		updateRegimenCard(editingIndex, regimen.med_name, regimen.start_date);
	} else {
		patientRegimens_current.push(regimen);
		insertRegimenCard(regimen)
	}

	$('#regimen-modal').modal('toggle');

	// need to send this back to database

}
// .................................................................................................. //


// ............................................ modal control ....................................... //
function showModal() {

	$('#regimen-modal').modal('toggle');

	$('.regimen-datepicker').on('changeDate',
		function() {
			// $(this).datepicker('hide'); // override for autoclose:true (doesnt work for some reason)

			var start_date = $('#regimen-datepicker-startdate').datepicker('getDate');
			var end_date = $('#regimen-datepicker-enddate').datepicker('getDate');

			var datepicker_start_input = $($('#regimen-datepicker-startdate').children()[0]);
			if (datepicker_start_input.prop('disabled')) start_date = datepicker_start_input.attr('placeholder');

			if (start_date && end_date) {
				var start_date_wrapper = moment(new Date(start_date));
				var end_date_wrapper = moment(new Date(end_date));
				displayDateContainers(start_date_wrapper, end_date_wrapper);
			}
		}
	);
}

function wipeRegimenModal() {

	var datepicker_start_input = $($('#regimen-datepicker-startdate').children()[0]); // input fields
	var datepicker_end_input = $($('#regimen-datepicker-enddate').children()[0]);

	if (datepicker_start_input.prop('disabled')) datepicker_start_input.prop('disabled', false);
	if (datepicker_end_input.prop('disabled')) datepicker_end_input.prop('disabled', false);

	if (datepicker_start_input.attr('placeholder') !== 'Select Date') datepicker_start_input.attr('placeholder', 'Select Date');
	if (datepicker_end_input.attr('placeholder') !== 'Select Date') datepicker_end_input.attr('placeholder', 'Select Date');

	$('#regimen-datepicker-startdate').datepicker('setDate', null);
	$('#regimen-datepicker-enddate').datepicker('setDate', null);

	$('#regimen-modal-weekschema-container').empty();

	$('#medication-name').val('');

	if (isEditingRegimen) {
		isEditingRegimen = false;
		editingIndex = null;
	}

	if (currentRegimenStartDate) currentRegimenStartDate = null;
}
// .................................................................................................. //



// .......................................... update methods ........................................ //
function updateWarningLabel(component, warning_text) {
	if ($(component).next().hasClass('regimen-modal-warninglabel')) {
		if (!warning_text) $(component).next().remove();
	} else {
		if (warning_text) {
			var warning_label = '<small class="regimen-modal-warninglabel">' + warning_text + '</small>';
			$(warning_label).insertAfter(component);
		}
	}
}

function updateReplication(replicate_checkbox) {
	if ($(replicate_checkbox).is(':checked')) {
		$(replicate_checkbox).prop('checked', true).change();
	}
}

function updateRegimenCard(cardIndex, med_name, start_date) {
	var regimen_card = $('.regimen-current').get(cardIndex);
	var card_components = $(regimen_card).children()[0];
	$($(card_components).children()[0])(med_name);
	$($(card_components).children()[2])(start_date);
}
// .................................................................................................. //


// ............................... handler methods (click, change, etc) ............................. //

// add time button was clicked (+ Time)
function handler_addtime_click(event) {
	event.preventDefault(); // prevent button from redirecting

	var schema_replicate_checkbox = $($(event.currentTarget).parent().siblings()[0]).find('.replicate-week');
	var schema_curr_day_elems = $(event.currentTarget).parent().children(); // gets all-inclusive siblings list
	var selected_date = schema_curr_day_elems[0];

	if ($(selected_date).parent().hasClass('date-active')) {
		var timeslot_container = schema_curr_day_elems[2];
		var timeslot_count = $(timeslot_container).children().length;

		if (timeslot_count < 10) {

			$(timeslot_container).append(createTimeslot());

			var new_timeslot = $(timeslot_container).children().last();
			var new_timeslot_input = $(new_timeslot).children()[0];

			$(new_timeslot_input).timepicker();

			var now = moment();

			if ($(selected_date).text() === now.format('MM/DD/YYYY')) {
				var hour_upperbound = now.get('hour') + 1 // skip to the next hour
				var day_period = hour_upperbound >= 12 ? 'pm' : 'am';

				$(new_timeslot_input).timepicker('option', {
					'disableTimeRanges' : [['12am', hour_upperbound.toString() + day_period]] // needs to be a nested array
				});
			}

			updateReplication(schema_replicate_checkbox);

		} else {
			updateWarningLabel(timeslot_container, 'Max Slots: 10');
		}
	}
}

function handler_addtime_focusout(event) {
	event.preventDefault(); // prevent button from redirecting

	var timeslot_container = $(event.currentTarget).siblings('.regimen-modal-timeslot-container')[0];
	updateWarningLabel(timeslot_container, null);
}

// a regimen instance on UI was clicked
function handler_regimen_click(event) {
	console.log(event);

	if ($(event.currentTarget).hasClass('regimen-current')) {
		if (event.target.className === 'close-thik') {
			var close_index = $(event.currentTarget).index();
			patientRegimens_current.splice(close_index, close_index + 1); // remove the regimen instance
			$($('.regimen-current')[close_index]).parent().remove(); // remove card from page

			// send the new regimens to database

			return;
		}
		editingIndex = $('.regimen-current').index(event.currentTarget);
		console.log(patientRegimens_current[editingIndex]);
		loadSelectedRegimen(patientRegimens_current[editingIndex], false);
	} else if ($(event.currentTarget).hasClass('regimen-past')) {
		editingIndex = $('.regimen-past').index(event.currentTarget);
		console.log(patientRegimens_past[editingIndex]);
		loadSelectedRegimen(patientRegimens_past[editingIndex], true);
	}

}

// replicate week was checked
function handler_replicateweek_change(event) {
	event.preventDefault(); // prevent button from redirecting

	var selected_schema_index = $('.regimen-modal-weekschema').index($(event.currentTarget).parent().parent().parent());
	var selected_schema = $('.regimen-modal-weekschema').get(selected_schema_index);
	var selected_schema_timeslots = $(selected_schema).find('.regimen-modal-timeslot-container');
	var timeslot_container_replacements = $(selected_schema_timeslots).clone();
	var week_schemas_remaining = $('.regimen-modal-weekschema').slice(selected_schema_index+1); // start is inclusive, so add 1 to skip current
	var disable_remainingschemas = false;

	if ($(event.currentTarget).is(':checked')) disable_remainingschemas = true;

	else {
		$('.regimen-modal-weekschema *').prop('disabled', false);
		$(event.currentTarget).attr('checked', false);
		$(timeslot_container_replacements).empty();
	}

	for (var i = 0; i < week_schemas_remaining.length; i++) {
		var curr_schema = week_schemas_remaining[i];
		var curr_schema_timeslot_containers = $(curr_schema).find('.regimen-modal-timeslot-container');

		for (var j = 0; j < $(curr_schema).children('.date-active').length; j++) {
			var curr_timeslot_container = curr_schema_timeslot_containers[j];
			var curr_replacement = $(timeslot_container_replacements[j]).clone();
			$(curr_timeslot_container).replaceWith(curr_replacement);
		}

		if (disable_remainingschemas) $(curr_schema).find('*').prop('disabled', true);

	}
}

function handler_timeslot_change(event) {
	var schema_replicate_checkbox = $(event.currentTarget).parent().parent().parent().siblings().find('.replicate-week');
	updateReplication(schema_replicate_checkbox);
}

function handler_timeslotgrp_mouseenter(event) {
	var timeSlotComponents = $(event.currentTarget).children();
	if (!$(timeSlotComponents[0]).is(':disabled')) {
		if ($(timeSlotComponents[0]).hasClass('regimen-modal-timeslot')) $(timeSlotComponents[0]).css({'border-top-right-radius': 0,'border-bottom-right-radius': 0});
		if (timeSlotComponents[1].className == 'regimen-modal-timeslot-delete') $(timeSlotComponents[1]).show();
	}
}

function handler_timeslotgrp_mouseleave(event) {
	var timeSlotComponents = $(event.currentTarget).children();
	if (!$(timeSlotComponents[0]).is(':disabled')) {
		if ($(timeSlotComponents[0]).hasClass('regimen-modal-timeslot')) $(timeSlotComponents[0]).removeAttr('style');
		if (timeSlotComponents[1].className == 'regimen-modal-timeslot-delete') $(timeSlotComponents[1]).hide();
	}
}

function handler_timeslotdelete_click(event) {
	var curr_timeslot_component_grp = $(event.currentTarget).parent()[0];
	var curr_timeslot_container = $(curr_timeslot_component_grp).parent();
	var schema_replicate_checkbox = $($(event.currentTarget).parent().parent().parent().siblings()[0]).find('.replicate-week');

	updateWarningLabel(curr_timeslot_container, null);

	$(curr_timeslot_component_grp).remove();

	updateReplication(schema_replicate_checkbox);
}

function handler_close_click(event) {
	console.log('clicked an x');

	var cardIndex = $('.close-thik').index(event.currentTarget);
	$($('.regimen-current')[cardIndex]).remove();

}
// .................................................................................................. //

$(document).ready(function() {

	loadRegimensRequest('/users/api/regimens');
	console.log('woooooooooooooooooweeeee1');

	// try and load datepickers only once, and just use changedate to mess with vals
	$('#regimen-datepicker-startdate').datepicker({
		startDate: '0',
		autoclose: true
	});

	$('#regimen-datepicker-enddate').datepicker({
		startDate: '0',
		autoclose: true
	});

	// need to bind event listeners using $(document).on selector for dynamically generated elements
	// (cant do it normally after DOM already loaded)
	$(document).on('click', '.card-regimen-instance', handler_regimen_click);
	$(document).on('change', '.replicate-week', handler_replicateweek_change);
	$(document).on('click', '.btn-addtime', handler_addtime_click);
	$(document).on('change', '.regimen-modal-timeslot', handler_timeslot_change);
	$(document).on('focusout', '.btn-addtime', handler_addtime_focusout);

	$(document).on('click', '.close-thik', handler_regimen_click);

													  // dont have a seperate handler function for 1-liner functions
	$(document).on('focusout', '#regimen-modal-save', function() {updateWarningLabel($('#regimen-modal-weekschema-container'), null);});
	$(document).on('mouseenter', '.regimen-modal-timeslot-grp', handler_timeslotgrp_mouseenter);
	$(document).on('mouseleave', '.regimen-modal-timeslot-grp', handler_timeslotgrp_mouseleave);
	$(document).on('click', '.regimen-modal-timeslot-delete', handler_timeslotdelete_click);

													  // dont have a seperate handler function for 1-liner functions
	$('#medication-name').on('focusin', function() {if ($(this).next().hasClass('regimen-modal-warninglabel')) $(this).next().remove();})
	$('#regimen-modal').on('hidden.bs.modal', wipeRegimenModal);
	$('#create-new-regimen').click(showModal);
	$('#regimen-modal-save').click(saveRegimen);
});
