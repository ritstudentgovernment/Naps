previewMarker = [];

Template.mapMain.events({
  'click #closeSide':function(){
    //Close navbars
    $('#closePanel').removeClass('toggled');
    $('#sidebar-wrapper').removeClass('toggled');
    $('#bottombar-wrapper').removeClass('toggle-bottom');
    $('#map').removeClass('map-toggle');
    //Remove session variables
    Session.set('addingTree', undefined);
    Session.set('selectedTree', undefined);
  }
});


Template.mapMain.helpers({
    exampleMapOptions: function() {
      // Make sure the maps API has loaded
      if (GoogleMaps.loaded()) {
        // Map initialization options
        return {
          center: new google.maps.LatLng(43.0832, -77.6778),
          zoom: 16,
          mapTypeControl: true,
          mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.TOP_RIGHT
          },
        };
      }
    },
    selectedTree: function(){
      return Session.get('selectedTree');
    },
    addingTree: function(){
      return Session.get('addingTree');
    }
});

Meteor.startup(function() {
  GoogleMaps.load();
});

Template.mapMain.onCreated(function() {

  GoogleMaps.ready('treeMap', function(map) {

    var allowedBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(43.076, -77.691),
      new google.maps.LatLng(43.094, -77.651));

    //Check for dragging map outside campus
    google.maps.event.addListener(map.instance, 'dragend', function() {

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


   // Limit the zoom level
  google.maps.event.addListener(map.instance, 'zoom_changed', function() {
    if (map.instance.getZoom() < 15) map.instance.setZoom(15);
  });


  google.maps.event.addListener(map.instance, 'click', function(event) {
    if(Session.get('addingTree')){
      $('input[name=lat]').val(event.latLng.lat());
      $('input[name=lng]').val(event.latLng.lng());

      if(previewMarker[0]){
        previewMarker[0].setPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      }else{
        var marker = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: event.latLng,
          map: map.instance
        });
        google.maps.event.addListener(marker, 'dragend', function(event){
          $('input[name=lat]').val(event.latLng.lat());
          $('input[name=lng]').val(event.latLng.lng());
        });
        previewMarker[0] = marker;
      }


    }
  });

  var image = {
    url: '/treemarker.png',
    size: new google.maps.Size(2000, 3000),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 35)
  };

  // The code shown below goes here
  var markers = {};
  Trees.find().observe({
    added: function(document) {
      // Create a marker for this document
      var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(document.lat, document.lng),
        map: map.instance,
        icon: image,
        //Store the document id
        id: document._id
      });
      var infowindow = new google.maps.InfoWindow({
        content: document.contentString
      });
      google.maps.event.addListener(marker, 'click', function() {
        Session.set('addingTree', undefined);
        //Set the session variable with the selected tree
        Session.set('selectedTree', document);
        //Get the number of tree of this type on campus
        $('#sidebar-wrapper').addClass('toggled');
        $('#closePanel').addClass('toggled');
        $('#bottombar-wrapper').addClass('toggle-bottom');
        $('#map').addClass('map-toggle');
      });

      // Store this marker instance within the markers object.
      markers[document._id] = marker;
    },
    changed: function(newDocument, oldDocument) {
      markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
    },
    removed: function(oldDocument) {
      // Remove the marker from the map
      markers[oldDocument._id].setMap(null);

      // Clear the event listener
      google.maps.event.clearInstanceListeners(
        markers[oldDocument._id]);

      // Remove the reference to this marker instance
      delete markers[oldDocument._id];
    }
  });
  });
});
