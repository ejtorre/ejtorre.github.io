(function() {
	function parseQueryString(query) {
		var vars = query.split("&");
		var query_string = {};
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			var key = decodeURIComponent(pair[0]);
			var value = decodeURIComponent(pair[1]);
			// If first entry with this name
			if (typeof query_string[key] === "undefined") {
				query_string[key] = decodeURIComponent(value);
			// If second entry with this name
			}
			else if (typeof query_string[key] === "string") {
				var arr = [query_string[key], decodeURIComponent(value)];
				query_string[key] = arr;
			// If third or later entry with this name
			} else {
				query_string[key].push(decodeURIComponent(value));
			}
		}
		return query_string;
	}
	function getUrlQueryStringParameters() {
		var query = window.location.search.substring(1);
		return parseQueryString(query);
	}
	function printUrlQueryStringParameters() {
		var urlVariables = getUrlQueryStringParameters();
		if ( !(Object.keys(urlVariables).length === 0 && urlVariables.constructor === Object) ) {
			var newList = document.createElement("ul");
			for (const [key, value] of Object.entries(urlVariables)) {
				newListItem = document.createElement("li");
				newListItem.innerHTML = "<strong>" + key + "</strong>:" + value;
				newList.appendChild(newListItem);
			}
			pageQueryParamsElem = document.getElementById('url-query-parameters').appendChild(newList);
		}
		else {
			document.getElementById('url-query-parameters').innerHTML = "<h2>No query parameters</h2>";
		}
	}
	printUrlQueryStringParameters();

})();