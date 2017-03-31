var doctorAccounts;		 // loaded doctor accounts
var currSelectedAccount; // currently selected account instance

/**
* Sets the currSelectedAccount to the row (account) that was clicked.
* {Object} event - Click event
* {Object} row - The account object that was selected
*/
function handler_rowClick(event, row) {
	currSelectedAccount = row; // account row clicked
	$('#editAccount-modal').modal('toggle');
	$('#account-status-dropdown').html(currSelectedAccount.account_active);
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

/**
* Loads the data for all doctor accounts registered in the 'Hopspital' database.
* {String} url - JSON url containing each of the account objects
*/
function loadDoctorAccounts(url) {
	$.getJSON(url, function(data) {
		if (data.accounts) {
			doctorAccounts = data.accounts;
			$('#table-account-instances').bootstrapTable('load', doctorAccounts); // load data from url into the table
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

/**
* Updates the account status of an account IF a change was actually made.
*/
function editAccount() {
	var selectedOption = $('#account-status-dropdown').html();
	for (var i = 0; i < doctorAccounts.length; i++) {
		if (doctorAccounts[i] === currSelectedAccount) {
			if (doctorAccounts[i].account_active != selectedOption) { // update the account status of an account (if it was changed)
				doctorAccounts[i].account_active = selectedOption;

				// database call here to apply changes
				// add a callback method to the database calling function, would look like this:
				// calback:
					// re-populate doctorAccounts after database updates and re-pulls newest changes
					// then refresh the table (already done below)
					$.ajax
					({
						type: "POST",
						dataType: 'json',
						data: newStatus,
						url: '/api/status/' + row.id,
						success: function () {
						console.log("Thanks!");
						}
					});
					$('#table-account-instances').bootstrapTable('refreshOptions', doctorAccounts);
					$('#table-account-instances').bootstrapTable('refresh', doctorAccounts);
			}

			$('#editAccount-modal').modal('toggle');
			return;
		}
	}
}


// Load the data set on page-load (to be changed with an actual database function / url)
$(document).ready(function() {
	loadDoctorAccounts('../tests/doctor_accounts_test1.json');
});

// UI handlers
$('#table-account-instances').on('click-row.bs.table', function(event, row) {handler_rowClick(event, row)});
$('.dropdown-item').on('click', handler_statusSelected);

$('#modal-accountstatus-save').on('click', editAccount);
$('#editAccount-modal').on('hidden.bs.modal', handler_modalClose);
