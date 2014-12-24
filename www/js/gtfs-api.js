/*global Framework7, Dom7 */

(function (Framework7, $$) {
	'use strict';

	var urls = [
		'http://localhost:9000/api'
	], req, gtfsapi;

	req = function (path, success, error, retry) {
		retry = retry || 0;
		return $$.ajax({
			url: urls[retry % urls.length] + path,
			success: success,
			error: function (xhr) {
				if (retry < urls.length - 1) {
					req(path, success, error, retry += 1);
				} else {
					error(xhr);
				}
			}
		});
	};

  gtfsapi = {

		urls: urls,

    routes: function (success, error) {
      return req('/agencies/RER/routes', success, error);
    },

    stops: function (success, error) {
      return req('/agencies/RER/stops', success, error);
    }
	};

	window.gtfsapi = gtfsapi;

}(Framework7, Dom7));
