Template.focusNap.onRendered(function(){

	if(Session.get("selectedNap")){
		
		var lat = parseFloat(Session.get("selectedNap").lat);
		var lng = parseFloat(Session.get("selectedNap").lng);

		GoogleMaps.ready('napMap', function(map) {

			map.instance.panTo({lat: lat, lng: lng});

		});

		$('#sidebar-wrapper').addClass('toggled');
	    $('#closePanel').addClass('toggled');
	    $('#bottombar-wrapper').addClass('toggle-bottom');
	    $('#map').addClass('map-toggle');

	}
	else{

		throwError("Nap Spot not found.");

	}

});