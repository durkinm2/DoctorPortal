
// var currPatientRegimens;


var test4;
var test5;
var currentRegimenStartDate;
var isEditingRegimen;
var editingIndex;
var pathname = window.location.pathname.split('/');
var path_id = pathname[4]; // gets patient id from url

var test6;
var test7;
var totalcards;

// init request handling for select patient profile (loads the regimen data)



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


// function refreshRegimens(url){
// 	$.getJSON(url, function(data) {
// 		if (data.regimens) {
//     	card_id=(data.regimens.id);
//     	console.log(card_id);
//
// 		}
// 	})
// }

// .................................................................................................. //


// ........................... methods for displaying each dynamic component ........................ //


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

	var curr_datetimeslot_container_index = 1; // start at 1 to skip the 'replicate' button
	var curr_datetimeslot_container;

	var curr_date = newStartDate.clone();

	while (curr_date.diff(newEndDate, 'days') <= 0) { // <= 0 in order to include end date

		if (curr_datetimeslot_container_index === 8) {
			var prev_date = curr_date.clone().subtract(1, 'days');
			if ( (prev_date.startOf('day') < moment().startOf('day')) || (prev_date.startOf('day') - moment().startOf('day') === 0 && moment().get('hour') > 22)) {
				// disable datetimeslot containers of previous dates
				$(curr_week_schema).find('.replicate-week').addClass('past-week').prop('disabled', true);
			}
			curr_week_schema_index += 1;
			if (week_schema_container.children().length === curr_week_schema_index) {
				week_schema_container.append(createWeekSchema());
			}

			curr_week_schema = week_schema_container.children('.regimen-modal-weekschema')[curr_week_schema_index];
			curr_datetimeslot_container_index = 1;
		}

		curr_datetimeslot_container = $(curr_week_schema).children()[curr_datetimeslot_container_index];

		$(curr_datetimeslot_container).addClass('date-active');
		$($(curr_datetimeslot_container).children()[0]).text(curr_date.format('MM/DD/YYYY'));

		if (curr_date.startOf('day') < moment().startOf('day') || (curr_date.startOf('day') - moment().startOf('day') === 0 && moment().get('hour') > 22)) {
			// disable datetimeslot containers of previous dates
			$(curr_datetimeslot_container).find('*').prop('disabled', true);
		}

		if (different_startDate) $(curr_datetimeslot_container).children('.regimen-modal-timeslot-container').empty();

		curr_date = curr_date.clone().add(1, 'days');
		curr_datetimeslot_container_index += 1;

	}

	// wipe extra days from a previously longer date span
	while (curr_datetimeslot_container_index < $(curr_week_schema).children().length) {
		curr_datetimeslot_container = $(curr_week_schema).children()[curr_datetimeslot_container_index];
		if ($(curr_datetimeslot_container).hasClass('date-active')) {
			$(curr_datetimeslot_container).removeClass('date-active');
			$($(curr_datetimeslot_container).children()[0]).text('');
			$(curr_datetimeslot_container).children('.regimen-modal-timeslot-container').empty();
		}
		curr_datetimeslot_container_index += 1;
	}

	if (curr_week_schema_index+1 < $(week_schema_container).children().length) {
		$(week_schema_container).children().slice(curr_week_schema_index+1).detach();
	}
}

function displayLoadedTimeslots(date_time_combos) {
	var loaded_dates = $('#regimen-modal-weekschema-container').find('.date-active');
	var curr_combo_index = 0;

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
					var new_timeslot_deletebtn = $(new_timeslot).children()[1];

					$(new_timeslot_input).timepicker();
					$(new_timeslot_input).val(curr_date_timeslots[j]);

					var now = new Date();
					var timeslot_date = new Date(curr_date);

					if (timeslot_date.toDateString() === now.toDateString()) {
						var curr_timeslot_split = curr_date_timeslots[j].split(':');

						var hour = parseInt(curr_timeslot_split[0]);
						var minutes = parseInt(curr_timeslot_split[1].substring(0,2));
						var period = curr_timeslot_split[1].substring(2,4);

						if (period === 'am' && hour === 12) hour = 0;
						else if (period === 'pm' && hour !== 12) hour += 12;

						if (timeslot_date.setHours(hour, minutes) < now) {
							$(new_timeslot_input).prop('disabled', true);
						} else {
							var hour_upperbound = moment(now).get('hour') + 1 // skip to the next hour
							var day_period = hour_upperbound >= 12 ? 'pm' : 'am';

							$(new_timeslot_input).timepicker('option', {
								'disableTimeRanges' : [['12am', hour_upperbound.toString() + day_period]] // needs to be a nested array
							});
						}
					}
				}

				// re-disable datecontainer newely added contents (timeslots)
				if (new Date(curr_date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) {
					$(curr_date_container).find('*').prop('disabled', true);
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
	$('#dosage-instructions').val(selectedRegimen.dosage_instructions);

	$($('#regimen-modal .modal-content')[0]).find('*').prop('disabled', false);

	displayDateContainers(start_date_wrapper, end_date_wrapper);
	displayLoadedTimeslots(selectedRegimen.date_time_combos);

	if (!alreadyEnded) {
		isEditingRegimen = true;

		$('#regimen-datepicker-enddate').datepicker('setDate', selectedRegimen.end_date);

		if (start_date_wrapper.diff(now, 'days') < 0) { // start date has already passed, disable it to prevent edits
			datepicker_start_input.attr('placeholder', selectedRegimen.start_date);
			datepicker_start_input.prop('disabled', true);
		}
		else $('#regimen-datepicker-startdate').datepicker('setDate', selectedRegimen.start_date);
	}
	else {
		isEditingRegimen = false;
		$($('#regimen-modal .modal-content')[0]).find('*').prop('disabled', true);
		datepicker_end_input.attr('placeholder', selectedRegimen.end_date);
		datepicker_start_input.attr('placeholder', selectedRegimen.start_date);
	}

	showModal();
}

function saveRegimen() {

	var med_name = $('#medication-name').val();

	var dosage_instructions = $('#dosage-instructions').val();

	console.log(dosage_instructions);
	console.log(typeof(dosage_instructions));

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
			if (isValidTimeslot(times[j].value)) curr_timeslots.push(times[j].value);
			else {
				updateWarningLabel($('#regimen-modal-weekschema-container'), 'One or more invalid timeslots');
				return;
			}
		}

		date_time_combos[curr_date] = curr_timeslots;
	}

	med_name = med_name.charAt(0).toUpperCase() + med_name.slice(1);
	var test2;


	var regimen = {
		med_name : med_name,
		start_date : start_date_wrapper.format('MM/DD/YYYY'),
		end_date : end_date_wrapper.format('MM/DD/YYYY'),
		date_time_combos : date_time_combos,
		dosage_instructions: dosage_instructions,
	}




	$('#regimen-modal').modal('toggle');

// if(card_id.id) {
// 	test2 = patientRegimens_current[card_id].id;
//
// }
if(isEditingRegimen){
		test2 = patientRegimens_current[editingIndex].id;
}

var reggie = JSON.stringify(regimen);
// POST request to create or update card


	console.log(test2);
	$.ajax
	({
	    type: "POST",
	    dataType: 'json',
	    data: {test2 : test2, regimen : reggie},
	    url: '/users/api/regimenz/' + path_id ,
	    success: function (data) {
	    console.log("Thanks!", data);
			test2 = data.id;
			loadRegimensRequest('/users/api/regimens/' + path_id );

		}
	});

}

function isValidTimeslot(timeslotStr) {

	if (timeslotStr === '') return false;
	if (timeslotStr.length > 7 || timeslotStr.length < 6) return false;

	var timeslotStr_split = timeslotStr.split(':');

	var hour = parseInt(timeslotStr_split[0]);
	var minutes = parseInt(timeslotStr_split[1].substring(0,2));
	var period = timeslotStr_split[1].substring(2,4);

	if ((isNaN(hour) || isNaN(minutes)) || (period !== 'am' && period !== 'pm')) return false;
	if (parseInt(hour) < 0 || parseInt(hour) > 12 || parseInt(minutes) < 0 || parseInt(minutes) > 59) return false;

	return true;


}
// .................................................................................................. //


// ............................................ modal control ....................................... //
function showModal() {

	$('#regimen-modal').modal('toggle');

	$('.regimen-datepicker').on('changeDate',
		function() {
			// $(this).datepicker('hide'); // override for autoclose:true (doesnt work for some reason)

			$('.replicate-week').each(function() {
				if ($(this).is(':checked')) $(this).prop('checked', false).change();
			});

			var start_date = $('#regimen-datepicker-startdate').datepicker('getDate');
			var end_date = $('#regimen-datepicker-enddate').datepicker('getDate');

			var datepicker_start_input = $($('#regimen-datepicker-startdate').children()[0]);
			if (datepicker_start_input.prop('disabled')) start_date = datepicker_start_input.attr('placeholder');

			if (start_date && end_date) {
				var start_date_wrapper = moment(new Date(start_date));
				var end_date_wrapper = moment(new Date(end_date));

				if ($($('#regimen-modal .form-group')[1]).is(':hidden')) {
					$($('#regimen-modal .form-group')[1]).show();
					$($('#regimen-modal .form-group')[2]).show();
				}

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

function updateRegimenCard(cardIndex, med_name, start_date, end_date) {
	var regimen_card = $('.regimen-current').get(cardIndex);
	var card_components = $(regimen_card).children()[1];
	$($(card_components).children()[0]).html(med_name);
	$($(card_components).children()[2]).html('Start Date: ' + start_date);
	$($(card_components).children()[3]).html('&nbspEnd Date: ' + end_date);

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
      console.log(new_timeslot);
      console.log(new_timeslot_input);

			$(new_timeslot_input).timepicker();

			var now = moment();

			if ($(selected_date).text() === now.format('MM/DD/YYYY')) {
				var hour_upperbound = now.get('hour') + 1 // skip to the next hour
				var day_period = hour_upperbound >= 12 ? 'pm' : 'am';

				$(new_timeslot_input).timepicker('option', {
					'disableTimeRanges' : [['12am', hour_upperbound.toString() + day_period]] // needs to be a nested array
				});
			}

			updateReplication($('.regimen-modal-timeslot-container').index(timeslot_container), schema_replicate_checkbox)

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

	if ($(event.currentTarget).hasClass('regimen-current')) {
		if (event.target.className === 'delete-regimen') {
			var reg_index = $('.regimen-current').index(event.currentTarget);

			$('#delete-modal').modal('show');
			$('#delete-modal .modal-body:first').html('<p><b>Name:</b> ' + patientRegimens_current[reg_index].card.med_name + '</p>' +
													  '<p><b>Start Date:</b> ' + patientRegimens_current[reg_index].card.start_date + '</p>' +
													  '<p><b>End Date:</b>   ' + patientRegimens_current[reg_index].card.end_date + '</p>');
			$('#delete-modal-delete').on('click', function() {
				$('#delete-modal').modal('hide');
				var test3 = patientRegimens_current[reg_index].id;
				var byereg = JSON.stringify(patientRegimens_current[reg_index]);

				$($('.regimen-current')[reg_index]).parent().remove(); // remove card from page

				patientRegimens_current.splice(reg_index, 1); // remove the regimen instance
				if (patientRegimens_current.length === 0) {
					$('#regimen-statustext-current').html('<i class="fa fa-ban" aria-hidden="true"></i> Nothing to show.');
					$('#regimen-statustext-current').show();
				}
				console.log("testdelete", card_id[reg_index].id);


				$.ajax
				({
						type: "POST",
						dataType: 'json',
						data: {test3 : test3, regimen : byereg},
						url: '/users/api/regimen/' + path_id,
						success: function (data) {
						console.log("Ajax delete sent!", data);
						}
				});
				$(this).unbind('click');
			});

			return;
		}

		editingIndex = $('.regimen-current').index(event.currentTarget);
		loadSelectedRegimen(patientRegimens_current[editingIndex].card, false);
	} else if ($(event.currentTarget).hasClass('regimen-past')) {
		editingIndex = $('.regimen-past').index(event.currentTarget);
		loadSelectedRegimen(patientRegimens_past[editingIndex].card, true);
	}

	if ($($('#regimen-modal .form-group')[1]).is(':hidden')) {
		$($('#regimen-modal .form-group')[1]).show();
		$($('#regimen-modal .form-group')[2]).show();
	}

}

// replicate week was checked
function handler_replicateweek_change(event) {
	event.preventDefault(); // prevent button from redirecting
	if (!$(event.currentTarget).is(':checked')) {
		$('.replicate-week').not('.past-week').prop('disabled', false);
		return;
	}
	else {
		$('.replicate-week').not(event.currentTarget).prop('disabled', true);
	}
	var selected_schema_index = $('.regimen-modal-weekschema').index($(event.currentTarget).parent().parent().parent());
	var selected_schema = $('.regimen-modal-weekschema').get(selected_schema_index);
	var selected_schema_timeslots = $(selected_schema).find('.regimen-modal-timeslot-container');
	var timeslot_container_replacements = $(selected_schema_timeslots).clone();

	$(timeslot_container_replacements).find('*').prop('disabled', false);
	var week_schemas_remaining = $('.regimen-modal-weekschema').slice(selected_schema_index+1); // start is inclusive, so add 1 to skip current

	for (var i = 0; i < week_schemas_remaining.length; i++) {
		var curr_schema = week_schemas_remaining[i];
		var curr_schema_timeslot_containers = $(curr_schema).find('.regimen-modal-timeslot-container');

		for (var j = 0; j < $(curr_schema).children('.date-active').length; j++) {
			var curr_timeslot_container = curr_schema_timeslot_containers[j];
			var curr_replacement = $(timeslot_container_replacements[j]).clone();
			$(curr_replacement).children().each(function() {$($(this).children()[0]).timepicker();});
			$(curr_timeslot_container).replaceWith(curr_replacement);
			$(curr_timeslot_container).prop('disabled', false);
		}
	}
}

function updateReplication(timeslotIndex, replicateCheckbox) {

	if ($(replicateCheckbox).is(':checked')) {
		var timeslots = $('.regimen-modal-timeslot-container');
		var activedates = $('.date-active');
		console.log(activedates);
		console.log(timeslots);
		for (var i = timeslotIndex+7; i <= activedates.length-1 && i <= timeslots.length - 1; i+=7) {
			var currentReplacement = $(timeslots[timeslotIndex]).clone();
			$($('.regimen-modal-timeslot-container')[i]).replaceWith(currentReplacement);
		}
	}

}

function handler_timeslot_change(event) {
	var schema_replicate_checkbox = $(event.currentTarget).parent().parent().parent().siblings().find('.replicate-week');
	var timeslotIndex = $('.regimen-modal-timeslot-container').index($(event.currentTarget).parent().parent());

	updateReplication(timeslotIndex, schema_replicate_checkbox);
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

	updateReplication($('.regimen-modal-timeslot-container').index(curr_timeslot_container), schema_replicate_checkbox);
}

function handler_regimen_hover(event, hideDeleteButton) {
	var reg_index = $('.regimen-current').index(event.currentTarget);
	if (hideDeleteButton) $($('.delete-regimen')[reg_index]).hide();
	else $($('.delete-regimen')[reg_index]).show();
}
// .................................................................................................. //

$(document).ready(function() {
//	loadRegimensRequest('	https://www.doctorportal.solutions/users/api/response/' + path_id );

  loadRegimensRequest('/users/api/regimens/' + path_id );
	//refreshRegimens('/users/api/regimens/' + path_id);
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

	$(document).on('mouseenter', '.regimen-current', function(event) {handler_regimen_hover(event, false)});
	$(document).on('mouseleave', '.regimen-current', function(event) {handler_regimen_hover(event, true)});

	$(document).on('click', '.delete-regimen', handler_regimen_click);

													  // dont have a seperate handler function for 1-liner functions
	$(document).on('focusout', '#regimen-modal-save', function() {updateWarningLabel($('#regimen-modal-weekschema-container'), null);});
	$(document).on('mouseenter', '.regimen-modal-timeslot-grp', handler_timeslotgrp_mouseenter);
	$(document).on('mouseleave', '.regimen-modal-timeslot-grp', handler_timeslotgrp_mouseleave);
	$(document).on('click', '.regimen-modal-timeslot-delete', handler_timeslotdelete_click);

													  // dont have a seperate handler function for 1-liner functions
	$('#medication-name').on('focusin', function() {if ($(this).next().hasClass('regimen-modal-warninglabel')) $(this).next().remove();})
	$('#regimen-modal').on('hidden.bs.modal', wipeRegimenModal);
	$('#create-new-regimen').click(function() {
		$($('#regimen-modal .modal-content')[0]).find('*').prop('disabled', false);

		$($('#regimen-modal .form-group')[1]).hide();
		$($('#regimen-modal .form-group')[2]).hide();
		showModal();
	});
	$('#regimen-modal-save').click(saveRegimen);
});
