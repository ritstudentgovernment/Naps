Markers = new Mongo.Collection('markers');

Markers.attachSchema( new SimpleSchema({
  lat: {
    type: String
  },
  lng: {
    type: String
  },
  contentString:{
    type: String
  }

}));

Meteor.methods({
  'addMarker': function(payload){
    Markers.insert({lat: payload.lat, lng: payload.lng, contentString: payload.contentString});
  }
})
