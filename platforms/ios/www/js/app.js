/*global Framework7, Dom7, Template7, moment, gtfsapi */

(function (Framework7, $$, T7, moment, gtfsapi) {
	'use strict';

	// Helpers
	T7.registerHelper('time_ago', function (time) {
		return moment.unix(time).fromNow();
	});
	T7.registerHelper('array_length', function (arr) {
		return arr ? arr.length : 0;
	});
	T7.registerHelper('pluralize', function (arr, options) {
		return (arr.length === 1) ? options.hash.single : arr.length + " " + options.hash.multiple;
	});

	// Init App
	var app = new Framework7({
		modalTitle: 'gtfs-mobile-app',
    swipePanel: 'left',
    animateNavBackIcon: true,
		precompileTemplates: true,
		template7Pages: true,
		router: true
	});

	// Update data
	function updateStations(stations) {
		app.template7Data.stations = stations;
		$$('.page[data-page="index"] .page-content .list-block').html(T7.templates.stationsTemplate(stations));
	}
	// Fetch Stations
	function getStations() {
		var results = JSON.parse(window.localStorage.getItem('stops')) || [];

		if (results.length === 0) {
			gtfsapi.stops(function (data) {
        results = JSON.parse(data);
        // Update local storage data
        window.localStorage.setItem('stops', JSON.stringify(results));
        // PTR Done
        app.pullToRefreshDone();

        // Clear searchbar
        $$('.searchbar-input input')[0].value = '';
        // Update T7 data and render home page stations
        updateStations(results);
			}, function (xhr) {
        console.error("Status: " + xhr.status + " - Response: " + xhr.responseText);
      });
		} else {
			// Update T7 data and render home page stations
			updateStations(results);
		}
		return results;
	}

	// Update stations on PTR
	$$('.pull-to-refresh-content').on('refresh', function () {
		getStations();
	});

	// Get and parse stations on app load
	getStations();

	// Export app to global
	window.app = app;

}(Framework7, Dom7, Template7, moment, gtfsapi));
