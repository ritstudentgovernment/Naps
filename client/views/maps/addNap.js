////////////////////////////////////////////////////////////////////////////////
///                   addNap.js
///
///Author   : Omar De La Hoz (oed7416@rit.edu)
///Description  : Javascript file for addNap template.
///Date Created : 09/27/16
///updated      : 11/01/16
////////////////////////////////////////////////////////////////////////////////

Template.addNap.events({
  'click #geoLoc' : function(e){
    e.preventDefault();

    //WARNING: Requires SSL certificate for location to work on mobile.
    window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
  }
});


/**
 * Sets the current location coordinates to the fields
 * and adds marker to map.
 * @param  position Users current position.
 */
function locationSuccess(position){

  var coordinates = position.coords;
  $('input[name=lat]').val(coordinates.latitude);
  $('input[name=lng]').val(coordinates.longitude);

  if(previewMarker[0]){
    previewMarker[0].setPosition({ lat: coordinates.latitude, lng: coordinates.longitude });
  }
  else{

    var marker = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: { lat: coordinates.latitude, lng: coordinates.longitude },
          icon: Session.get("previewImage"),
          map: GoogleMaps.maps.napMap.instance
    });

    google.maps.event.addListener(marker, 'dragend');
    previewMarker[0] = marker;
  }
}


/**
 * Prints the error to console if something went
 * wrong when getting the users location.
 * @param  err  Error message.
 */
function locationError(err){

  console.log("Oops! There was an error", err);
}