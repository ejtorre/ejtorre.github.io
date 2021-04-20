(function() {
	function getQueryVariable(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (pair[0] === variable) {
				return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
			}
		}
	}
	function Get(url){
		var Httpreq = new XMLHttpRequest(); // a new request
		Httpreq.open("GET",url,false);
		Httpreq.send(null);
		return Httpreq.responseText;
}
	function writeTableData(data) {
		props = document.getElementById('id-props');
		props.innerHTML = "<ul class = 'properties-list'>" +
			"<li><strong>Subject: </strong>" + data.Subject + "</li>" +
			"<li><strong>Id: </strong>" + data.DataId + "</li>" +
			"<li><strong>Source: </strong>" + data.Source + "</li>" +
			"<li><strong>Dataset: </strong>" + data.Dataset + "</li>" +
			"<li><strong>Subject notes: </strong>" + data.SubjectNotes + "</li>" +
			"<li><strong>Subject geographical specific notes: </strong>" + data.SubjectNotesSeriesSpecific + "</li>" +
			"<li><strong>Geography: </strong>" + data.Geography + "</li>" +
			"<li><strong>Units: </strong>" + data.Units + "</li>" +
			"<li><strong>Scale: </strong>" + data.Scale + "</li>"
			"</ul>"
		table = document.getElementById('id-table-data');
		for ( i = 0 ; i < data.Data.length; i++ ) {
			var row = table.insertRow(-1);
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			cell1.innerHTML = data.Data[i].TimePeriod;
			cell2.innerHTML = data.Data[i].Value;
		}
	}
	var searchTerm = getQueryVariable('ts');
	if (searchTerm) {
		var json_obj = JSON.parse(Get("/assets/data/imf/weo/" + searchTerm + ".json"));
		writeTableData(json_obj)
	}
	else {
	}
})();