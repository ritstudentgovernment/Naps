Template.mapMain.events({
  'click #closeSide':function(){
    $('#sidebar-wrapper').removeClass('toggled');
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

    google.maps.event.addListener(map.instance, 'click', function(event) {
      if(Session.get('addingTree')){
        var payload = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        }
        $('input[name=lat]').val(event.latLng.lat());
        $('input[name=lng]').val(event.latLng.lng());
      }
    });


    // The code shown below goes here
    var markers = {};
    Trees.find().observe({
      added: function(document) {
        // Create a marker for this document
        var marker = new google.maps.Marker({
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.lat, document.lng),
          map: map.instance,

          // We store the document _id on the marker in order
          // to update the document within the 'dragend' event below.
          id: document._id
        });
        var infowindow = new google.maps.InfoWindow({
          content: document.contentString
        });
        google.maps.event.addListener(marker, 'click', function() {
          Session.set('selectedTree', document);
          $('#sidebar-wrapper').addClass('toggled');
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
