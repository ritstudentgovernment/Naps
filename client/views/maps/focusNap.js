Template.focusNap.onRendered(function(){

	if(Session.get("selectedNap")){

		var lat = parseFloat(Session.get("selectedNap").lat);
		var lng = parseFloat(Session.get("selectedNap").lng);

		$('#sidebar-wrapper').addClass('toggled');
	    $('#closePanel').addClass('toggled');
	    $('#bottombar-wrapper').addClass('toggle-bottom');
	    $('#map').addClass('map-toggle');

	}
	else{

		throwError("Nap Spot not found.");

	}

});