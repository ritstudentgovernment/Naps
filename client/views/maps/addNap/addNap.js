////////////////////////////////////////////////////////////////////////////////
///                   addNap.js
///
///Author   : Omar De La Hoz (oed7416@rit.edu)
///Description  : Javascript file for addNap template.
///Date Created : 09/27/16
///updated      : 01/27/17
////////////////////////////////////////////////////////////////////////////////
///


/**
 * Executed on view created.
 * Subsribes to the spot_type collection
 */
Template.addNap.onCreated(function() {
  
  Meteor.subscribe('spot_types');
});


Template.addNap.helpers({
  'types': function() {

    var types = Spot_types.find().fetch();

    var typeNames = [];

    for(var i = 0; i < types.length; i++){

      typeNames.push({value: types[i].name, label: types[i].name});
    }

    return typeNames;
  }
});


Template.addNap.events({
  'click #geoLoc' : function(e){
    e.preventDefault();

    //WARNING: Requires SSL certificate for location to work on mobile.
    window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError);

  },
  'click #loadModal': function(){

    GoogleMaps.ready('napMap', function(map) {

      var allowedBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(43.08138,-77.68277),
        new google.maps.LatLng(43.087664,-77.666849)
      );

      //Check for dragging map off campus
      google.maps.event.addListener(map.instance, 'bounds_changed', function() {

        if (allowedBounds.contains(map.instance.getCenter())) return;

        // Out of bounds - Move the map back within the bounds
        var c = map.instance.getCenter(),
          x = c.lng(),
          y = c.lat(),
          maxX = allowedBounds.getNorthEast().lng(),
          maxY = allowedBounds.getNorthEast().lat(),
          minX = allowedBounds.getSouthWest().lng(),
          minY = allowedBounds.getSouthWest().lat();

        if (x < minX) x = minX;
        if (x > maxX) x = maxX;
        if (y < minY) y = minY;
        if (y > maxY) y = maxY;
        map.instance.setCenter(new google.maps.LatLng(y, x));
      });

      // Respond to user clicks only of there is a marker.
      google.maps.event.addListener(map.instance, 'click', function(event) {
        
        if(previewMarker[0]){

          previewMarker[0].setPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        }
      });
    });

    // Get current location when user opes modal and focus on it.
    if(!previewMarker[0]){

      // Request current position.
      window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
    }
  },
  'click #setLoc': function(){

    // Get coordinates of preview marker.
    var coordinates = previewMarker[0].getPosition();

    // Update the fields of latitude and longitude.
    $('input[name=lat]').val(coordinates.lat());
    $('input[name=lng]').val(coordinates.lng());

    // Close modal and throw success message.
    throwError("Location has been set.");
    $('.close').click();
  },
  'click #cancel': function(){

    if(previewMarker[0]){

      previewMarker[0].setMap(null);
      delete previewMarker[0];
      $('.close').click();
    }
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

  var map_instance = GoogleMaps.maps.napMap ? GoogleMaps.maps.napMap.instance : GoogleMaps.maps.pickerMap.instance;

  if(previewMarker[0]){
    previewMarker[0].setPosition({ lat: coordinates.latitude, lng: coordinates.longitude });
  }
  else{

    var marker = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: { lat: coordinates.latitude, lng: coordinates.longitude },
          icon: previewimage,
          map: map_instance
    });

    google.maps.event.addListener(marker, 'dragend');
    previewMarker[0] = marker;
  } 

  // Pan map to current location.
  map_instance.panTo({lat: coordinates.latitude, lng: coordinates.longitude});
}


/**
 * Prints the error to console if something went
 * wrong when getting the users location.
 * @param  err  Error message.
 */
function locationError(err){

  console.log("Oops! There was an error", err);
}