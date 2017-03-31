/**
* medibase.js - Handles openFDA API interaction for the MediBase page.
* @author - James Salvatore
*/


// Set listener for 'Search' button on script load.
$(document).ready(function() {
	$('#query-search').click(function() {searchMediBase()});
});


// FIELDS //
var API_KEY = "GimZmhY0YQaNK2BpmGRcmpOZ3Eod3HMzyOhUll3k";
var currentResults;


/**
* Removes all current search query results from page.
*/
function clearResults() {
	$('.card-query-result').each(function() {
		this.remove();
	});
}

/**
* Constructs Bootstrap Cards for each of the query results.
* {Object} result - Current Result Object for display on page.
*/
function createResultCard(result) {
	var brandName = result.openfda.brand_name ? result.openfda.brand_name : 'None';
	var substanceName = result.openfda.substance_name ? result.openfda.substance_name : 'None';
	var manufacturerName = result.openfda.manufacturer_name ? result.openfda.manufacturer_name : 'None';

	var resultCard = '<div class="card card-clickable card-query-result text-left"><div class="card-block"><h5 class="card-title">' + brandName
	+ '</h5><p>Substance: ' + substanceName + '</p><p>Manufacturer: ' + manufacturerName + '</p></div></div>';

	return resultCard;
}

/**
* Displays all of the results from the current query.
* {Object} data - Collection of result objects returned from the query
*/
function displayQueryResults(data) {
	$('#query-results-label').show();
	$('#query-statustext').hide();
	for (var i = 0; i < currentResults.length; i++) {
		var resultCard = createResultCard(currentResults[i]);
		$('#results-container').append(resultCard);
	}
	$('.card-query-result').click(function(){
		$('#query-modal').modal();
		var query_index = $('.card-query-result').index(this);
		showResultContent(currentResults[query_index]);
	});
}

/**
* Gets the currently entered limit for use with the query url.
* If the entered limit is not valid (too large, non-numeric format),
* the corresponding error label is displayed.
*/
function getLimitCount() {
	var resultLimit = $('#query-results-limit').val();

	if (resultLimit.match(/[a-z]/i)) {
		$('#query-results-limit-label').html('Invalid limit value').show();
		return;
	}
	if (parseInt(resultLimit)) {
		if (resultLimit > 100) {
			$('#query-results-limit-label').html('Maximum limit: 100').show();
			return;
		}
		if ($('#query-results-limit-label').is(':visible')) $('#query-results-limit-label').hide();
		return "&limit=" + resultLimit.toString();
	} else {
		$('#query-results-limit-label').html('Invalid limit value').show();
		return;
	}
}

/**
* Adds all of the entered fields from the input menu into the API query url.
*/
function getURLAddons() {
	var count_queryCriteria = 0;
	var url_query_addons = '';

	$('.query-input').each(function() {
		if (this.value !== '') {
			if (count_queryCriteria > 0) url_query_addons += "+AND+";
			url_query_addons += "openfda." + this.name + ":" + this.value;
			count_queryCriteria ++;
		}
	});

	return url_query_addons;
}

/**
* Creates the JSON request to the openFDA API based on user's search criteria.
* {String} url - Query URL made for request with the openFDA API
*/
function openFDARequest(url) {
	$('#query-statustext').html('<i class="fa fa-refresh fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span>');
	console.log(url);
	$.getJSON(url, function(data) {
		console.log('rad');
		console.log(data);
		currentResults = data.results;
		clearResults();
		displayQueryResults(data);
	})
	.fail(function(event) {
		if (event.status == 404) {
			clearResults();
			$('#query-results-label').hide();
			$('#query-statustext').html('<i class="fa fa-ban" aria-hidden="true"></i> No Results Found');
			$('#query-statustext').show();
		}
	});
}

/**
* Searches the medical database of openFDA API once the 'Search' button is clicked
*/
function searchMediBase() {
	var url = "https://api.fda.gov/drug/label.json?search=";
	var urlAddons = getURLAddons();

	if (urlAddons !== '') { // atleast 1 field to search
		url += urlAddons;
		var urlLimt = getLimitCount();
		if (urlLimt) {
			url += urlLimt;
			openFDARequest(url);
		}
	}
}

/**
* Shows a modal window with the info. of the currently selected query result.
*/
function showResultContent(result) {
	if (result.openfda.brand_name) $('#query-modal-label').html(result.openfda.brand_name);

	if (result.purpose) {
		var purposeStrList = result.purpose[0].split(' ');
		if (purposeStrList[0].toLowerCase() == 'purpose') {
			purposeStrList[0] = '';
			purposeStrList[1] = purposeStrList[1].charAt(0).toUpperCase() + purposeStrList[1].slice(1);
		}
		$('#query-result-purpose').html('<b>Purpose: </b>' + purposeStrList.join(' '));
	}

	if (result.indications_and_usage) {
		var usageStrList = result.indications_and_usage[0].split(' ');
		if (usageStrList[0].toLowerCase() == 'uses') {
			usageStrList[0] = '';
			usageStrList[1] = usageStrList[1].charAt(0).toUpperCase() + usageStrList[1].slice(1);
		}
		$('#query-result-usage').html('<b>Usage: </b>' + usageStrList.join(' '));
	}

	if (result.openfda.manufacturer_name) $('#query-result-manufacturer').html('<b>Manufacturer: </b>' + result.openfda.manufacturer_name);
	if (result.openfda.substance_name) $('#query-result-substance').html('<b>Substance: </b>' + result.openfda.substance_name);
	if (result.openfda.manufacturer_name) $('#query-result-manufacturer').html('<b>Manufacturer: </b>' + result.openfda.manufacturer_name);

	if (result.openfda.product_type) $('#query-result-type').html('<b>Product Type: </b>' + result.openfda.product_type);
	if (result.openfda.route) $('#query-result-route').html('<b>Route: </b>' + result.openfda.route);
	if (result.openfda.product_ndc) $('#query-result-prodndc').html('<b>Product NDC: </b>' + result.openfda.product_ndc);
}
