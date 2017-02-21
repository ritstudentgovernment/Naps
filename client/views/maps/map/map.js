previewMarker = [];
markers = {};


Template.mapMain.events({
  'click #closeSide':function(){

    //Close navbars
    $('#closePanel').removeClass('toggled');
    $('#sidebar-wrapper').removeClass('toggled');
    $('#bottombar-wrapper').removeClass('toggle-bottom');
    $('#map').removeClass('map-toggle');

    // Remove session variables
    Session.set('addingNap', undefined);
    Session.set('selectedNap', undefined);

    // Move marker back to its original position.
    if(Session.get("editingNap")){
      var id = Session.get("editingNap")._id;
      var nap = Naps.findOne(id);

      markers[id].setPosition({lat: parseFloat(nap.lat), lng: parseFloat(nap.lng)});
      Session.set('editingNap', undefined);
    }

    // Delete the preview marker.
    if(previewMarker.length){

      previewMarker[0].setMap(null);
      previewMarker = [];

    }

    // Destroy pickerMap.
    if(GoogleMaps.maps.pickerMap){
      google.maps.event.clearInstanceListeners(window);
      google.maps.event.clearInstanceListeners(document);
      google.maps.event.clearInstanceListeners(GoogleMaps.maps.pickerMap.instance);
      $("mapModal").detach();
    }
    
    //Change url to the index.
    history.replaceState({}, null, '/');
  },
  'click #closeImg':function(){
    $('#map').show();
    Session.set('previewImg', false);
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
    },
    previewImg: function(){
      return Session.get('previewImg');
    }
});


// Start the Map on meteor startup.
Meteor.startup(function() {
  GoogleMaps.load({key: Meteor.settings.public.MAPSKEY});
});


/**
 * Creates a marker and adds it to the map.
 * @param  Object document a Nap object.
 */
function createMarker(document){

  if(document.approved || document.creatorId === Meteor.userId() || Roles.userIsInRole(Meteor.user(), ['admin','reviewer'])){

    var marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(document.lat, document.lng),
      map: GoogleMaps.maps.napMap.instance,
      icon: reviewimage,
      //Store the document id
      id: document._id
    });

    if(document.approved && document.designated){

      marker.setOptions({ optimized: false });
      marker.setOptions({zIndex: 99999999});
      marker.setIcon(Session.get("Image"));  
    }
    else if(document.approved){

      marker.setIcon(Session.get("publicImage"));
    }

    var infowindow = new google.maps.InfoWindow({
        content: document.contentString
    });

    google.maps.event.addListener(marker, 'click', function() {

      Session.set('addingNap', undefined);
      Session.set('editingNap', undefined);

      //Set the session variable with the selected nap
      Session.set('selectedNap', document);

      //Set url to the selectedNap.
      history.pushState({}, null, '/nap/' + document._id);

      //Focus selected nap.
      GoogleMaps.maps.napMap.instance.panTo(new google.maps.LatLng(document.lat, document.lng));

      //Get the number of nap spots of this type on campus
      $('#sidebar-wrapper').addClass('toggled');
      $('#closePanel').addClass('toggled');
      $('#bottombar-wrapper').addClass('toggle-bottom');
      $('#map').addClass('map-toggle');
    });

    // Store this marker instance within the markers object.
    markers[document._id] = marker;
  }
}


/**
 * Deletes all markers from map.
 */
function deleteMarkers(){

  for(var id in markers){

    markers[id].setMap(null);
    google.maps.event.clearInstanceListeners(markers[id]);
    delete markers[id];
  }
}


Template.mapMain.onCreated(function() {

  GoogleMaps.ready('napMap', function(map) {

    var allowedBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(43.08138,-77.68277),
      new google.maps.LatLng(43.087664,-77.666849)
    );

    //Check for dragging map outside campus
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
        }
        else{

          var marker = new google.maps.Marker({
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: event.latLng,
            icon: previewimage,
            map: map.instance
          });

          google.maps.event.addListener(marker, 'bounds_changed', function(event){
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
      url: '/designated_marker.png',
      size: new google.maps.Size(200, 200),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(15, 35),
      scaledSize: new google.maps.Size(30, 35)
    };

    Session.set("Image", image);

    var previewimage = {
      url: '/preview_marker.png',
      size: new google.maps.Size(200, 200),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(15, 35),
      scaledSize: new google.maps.Size(30, 35)
    };

    Session.set("previewImage", previewimage);


    reviewimage = {
      url: '/review_marker.png',
      size: new google.maps.Size(200, 200),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(15, 35),
      scaledSize: new google.maps.Size(30, 35)
    };

    Session.set("reviewImage", reviewimage);


    publicimage = {
      url: '/public_marker.png',
      size: new google.maps.Size(200, 200),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(15, 35),
      scaledSize: new google.maps.Size(30, 35)
    }

    Session.set("publicImage", publicimage);


    Naps.find().observe({
      added: function(document) {

      	if(GoogleMaps.maps.napMap){
      		
      		createMarker(document);
      	}

      },
      changed: function(newDocument, oldDocument) {

        if(newDocument.approved && newDocument.designated){

          markers[newDocument._id].setOptions({ optimized: false });
          markers[newDocument._id].setOptions({zIndex: 99999999});
          markers[newDocument._id].setIcon(image);
        }
        else if(newDocument.approved){

          markers[newDocument._id].setIcon(publicimage);
        }
        else{

          markers[newDocument._id].setIcon(reviewimage);
        }

        google.maps.event.clearListeners(markers[newDocument._id], 'click');

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


        markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
      },
      removed: function(oldDocument) {

        // If there's a marker with the oldDocuments id, delete it.
        if(markers[oldDocument._id]){

          // Remove the marker from the map
          markers[oldDocument._id].setMap(null);

          // Clear the event listener
          google.maps.event.clearInstanceListeners(markers[oldDocument._id]);
          
          // Remove the reference to this marker instance
          delete markers[oldDocument._id];
        }
      }
    });
  });
});


//Trigger user change.
var oldUser = undefined;

Tracker.autorun(function(){

  var newUser = Meteor.user();

  //Check if user logged in or out.
  if(oldUser === null && newUser || newUser === null && oldUser && GoogleMaps.maps.napMap){

    deleteMarkers();
    var naps = Naps.find().fetch();

    for(var i = 0; i < naps.length; i++){

      var nap = naps[i];

      createMarker(nap);      
    }
    
  }

  oldUser = Meteor.user();
});
