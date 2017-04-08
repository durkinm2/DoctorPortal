/**
 * admin.js - Allows administrative accounts to activate or deactivate
 * a doctors Hospital account for use with the Web Portal.
 * @author - James Salvatore
 */


var doctorAccounts;		 // loaded doctor accounts
var currSelectedAccount; // currently selected account instance

/**
* Sets the currSelectedAccount to the row (account) that was clicked.
* {Object} event - Click event
* {Object} row - The account object that was selected
*/
function handler_rowClick(event, row) {
	console.log(row);
	currSelectedAccount = row; // account row clicked
	$('#editAccount-modal').modal('toggle');
	$('#account-status-dropdown').html(currSelectedAccount.acct_active);
}

/**
* Sets the dropdown text after a dropdown option has been selected.
* {Object} event - Click event
*/
function handler_statusSelected(event) {
	$('#account-status-dropdown').html($(event.currentTarget).html()); // status selected from dropdown
}

/**
* Saves the account status changes that were made when 'Save' is clicked in the modal.
*/
function saveAccountChanges() { // save button clicked in modal
	editAccount();
}

function loadTableData(accounts) {
	var rows = [];
	for (var i = 0; i < accounts.length; i++){
var currAccount = accounts[i];
		rows.push({
			id: currAccount.id,
			username: currAccount.username,
			acct_active: (currAccount.acct_active ? 'Active' : 'Not Active'),
			fname: currAccount.fname,
			lname: currAccount.lname,
			active: currAccount.active

		});
	}
		return rows;

}

/**
* Loads the data for all doctor accounts registered in the 'Hopspital' database.
* {String} url - JSON url containing each of the account objects
*/
function loadDoctorAccounts(url) {
	$.getJSON(url, function(data) {
console.log(data);
		if (data.data) {
			doctorAccounts = data.data;
			$('#table-account-instances').bootstrapTable('load',loadTableData(doctorAccounts)); // load data from url into the table
		}
	})
	.fail(function(event) {
		if (event.status === 404) {
			console.log('failed to load data');
		}
	});
}

/**
* Wipes the currently selected doctor account after the modal is closed.
*/
function handler_modalClose() {
	currSelectedAccount = null; // wipe the currently selected account
}

function sameAccounts(a, b) {
	if (a.acct_active === b.acct_active &&
	    a.active === b.active &&
		  a.fname === b.fname &&
		  a.id === b.id &&
		  a.lname === b.lname &&
		  a.username === b.username) return true;

			return false;
}

function updateStatus(accountToChange, option) {
	$.ajax({
		type: "POST",
		//dataType: 'json',
		data: {option : option, acct : accountToChange.id},
		url: '/users/api/status/' + accountToChange.id,
		success: function (data) {
		loadDoctorAccounts('/users/api/doctors');
		console.log("Ajax updated status", data);
		console.log(doctorAccounts)
	},
	error: function(err) {
		console.log("error", err);
	}
	});
}

/**
* Updates the account status of an account IF a change was actually made.
*/
function editAccount() {
	var selectedOption = $('#account-status-dropdown').html() === "Active" ? true : false;
	var currSelectedAccountClone = jQuery.extend(true, {}, currSelectedAccount);
	currSelectedAccountClone['acct_active'] = !selectedOption;
	console.log(currSelectedAccountClone);
	for (var i = 0; i < doctorAccounts.length; i++) {
		console.log(doctorAccounts[i]);
		if (sameAccounts(doctorAccounts[i], currSelectedAccountClone)) {
			console.log('found a match');
			if (doctorAccounts[i].acct_active != selectedOption) { // update the account status of an account (if it was changed)
				console.log('status needs to be changed');

				updateStatus(doctorAccounts[i], selectedOption);
				// database call here to apply changes
				// add a callback method to the database calling function, would look like this:

				// calback:
					// re-populate doctorAccounts after database updates and re-pulls newest changes
					// then refresh the table (already done below)
					// $('#table-account-instances').bootstrapTable('refreshOptions', doctorAccounts);
					// $('#table-account-instances').bootstrapTable('refresh', doctorAccounts);
			}

			$('#editAccount-modal').modal('toggle');
			return;
		}
	}
}


// Load the data set on page-load (to be changed with an actual database function / url)
$(document).ready(function() {
	loadDoctorAccounts('/users/api/doctors');
});

// UI handlers
$('#table-account-instances').on('click-row.bs.table', function(event, row) {handler_rowClick(event, row)});
$('.dropdown-item').on('click', handler_statusSelected);

$('#modal-accountstatus-save').on('click', editAccount);
$('#editAccount-modal').on('hidden.bs.modal', handler_modalClose);
