previewMarker = [];

Template.mapMain.events({
  'click #closeSide':function(){
    //Close navbars
    $('#closePanel').removeClass('toggled');
    $('#sidebar-wrapper').removeClass('toggled');
    $('#bottombar-wrapper').removeClass('toggle-bottom');
    $('#map').removeClass('map-toggle');
    //Remove session variables
    Session.set('addingNap', undefined);
    Session.set('selectedNap', undefined);
    Session.set('editingNap', undefined);

    if(previewMarker.length != 0){

      previewMarker[0].setMap(null);
      previewMarker = [];

    }

  }
});


Template.mapMain.helpers({
    selectedNap: function(){
      return Session.get('selectedNap');
    },
    addingNap: function(){
      return Session.get('addingNap');
    },
    editingNap: function(){
      return Session.get('editingNap');
    }
});

Meteor.startup(function() {
  GoogleMaps.load();
});

Template.mapMain.onCreated(function() {

  GoogleMaps.ready('napMap', function(map) {

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
    if(Session.get('addingNap')){
      $('input[name=lat]').val(event.latLng.lat());
      $('input[name=lng]').val(event.latLng.lng());

      if(previewMarker[0]){
        previewMarker[0].setPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      }else{
        var marker = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: event.latLng,
          icon: previewimage,
          map: map.instance
        });
        google.maps.event.addListener(marker, 'dragend', function(event){
          $('input[name=lat]').val(event.latLng.lat());
          $('input[name=lng]').val(event.latLng.lng());
        });
        previewMarker[0] = marker;
      }
    }
    else if(Session.get('editingNap')){
      $('input[name=lat]').val(event.latLng.lat());
      $('input[name=lng]').val(event.latLng.lng());
      markers[Session.get('editingNap')._id].setPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    }
  });

  var image = {
    url: '/napmarker.png',
    size: new google.maps.Size(2000, 3000),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 35)
  };

  var previewimage = {
    url: '/previewmarker.png',
    size: new google.maps.Size(2000, 3000),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 35)
  };

  var reviewimage = {
    url: '/reviewmarker.png',
    size: new google.maps.Size(2000, 3000),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 35)
  };


  // The code shown below goes here
  var markers = {};
  Naps.find().observe({
    added: function(document) {

      if(document.approved || Roles.userIsInRole(Meteor.user(), ['admin'])){
        var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(document.lat, document.lng),
        map: map.instance,
        icon: reviewimage,
        //Store the document id
        id: document._id
      });
      if(document.approved){
        marker.setIcon(image);
      }
      var infowindow = new google.maps.InfoWindow({
        content: document.contentString
      });
      google.maps.event.addListener(marker, 'click', function() {
        Session.set('addingNap', undefined);
        Session.set('editingNap', undefined);
        //Set the session variable with the selected nap
        Session.set('selectedNap', document);
        //Get the number of nap spots of this type on campus
        $('#sidebar-wrapper').addClass('toggled');
        $('#closePanel').addClass('toggled');
        $('#bottombar-wrapper').addClass('toggle-bottom');
        $('#map').addClass('map-toggle');
      });

      // Store this marker instance within the markers object.
      markers[document._id] = marker;
      }
    },
    changed: function(newDocument, oldDocument) {
      
      if(newDocument.approved){
        markers[newDocument._id].setIcon(image);
      }
      else{
        markers[newDocument._id].setIcon(reviewimage);
      }

      google.maps.event.addListener(markers[newDocument._id], 'click', function() {
        Session.set('addingNap', undefined);
        Session.set('editingNap', undefined);
        //Set the session variable with the selected nap
        Session.set('selectedNap', newDocument);
        //Get the number of nap spots of this type on campus
        $('#sidebar-wrapper').addClass('toggled');
        $('#closePanel').addClass('toggled');
        $('#bottombar-wrapper').addClass('toggle-bottom');
        $('#map').addClass('map-toggle');
      });

      Session.set('selectedNap', newDocument);

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
