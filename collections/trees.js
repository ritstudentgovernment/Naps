Trees = new Mongo.Collection('trees');

Trees.attachSchema( new SimpleSchema({
  lat: {
    label: "Latitude",
    type: String,
    optional: false
  },
  lng: {
    label: "Longitude",
    type: String,
    optional: false
  },
  diameter: {
    label: "Diameter",
    type: String,
    optional: true,
    autoValue: function(){
      if(!this.isSet){
        return 'None Listed'
      }
    }
  },
  height: {
    label: "Estimated Height",
    type: String,
    optional: true,
    autoValue: function(){
      if(!this.isSet){
        return 'None Listed'
      }
    }
  },
  species: {
    label: "Species",
    type: String,
    optional: false,
  },
  notes: {
    label: "Notes",
    type: String,
    optional: true,
    autoValue: function(){
      if(!this.isSet){
        return 'None Listed'
      }
    }
  },
  picture:{
    type: String,
    optional: true
  }
}));

Trees.allow({
  insert: function () { return Meteor.user(); },
  update: function (userId) { return Roles.userIsInRole(userId, ['admin']); },
  remove: function (userId) { return Roles.userIsInRole(userId, ['admin']); },
});

TreesFS = new FS.Collection('treesFS', {
  stores: [new FS.Store.FileSystem('treesFS')]
});

TreesFS.allow({
  insert:   function (userId, file) { return true; },
  update:   function (userId, file) { return true; },
  download: function () {return true; }
});

if (Meteor.isServer) {
  Meteor.methods({
    insertCSVData: function(parses) {
      //Precheck data for entries without required data
      //DOn't insert in one is found
      for(var i = 0; i < parses.length; i++){
        var tree = parses[i];
        if(!(tree.Species && tree.Latitude && tree.Longitude)){
          //Return true for the error and with error message
          throw new Meteor.Error( 500, 'Trees not added. All Entries must have a Species, Latitude, Longitude attribute.' );
          return;
        }
      }

      for(var i = 0; i < parses.length; i++){
        var tree = parses[i];
        var payload = {
          lat: tree.Latitude,
          lng: tree.Longitude,
          diameter: tree.Diameter,
          height: tree.Height,
          species: tree.Species,
          notes: tree.Notes
        }
        Trees.insert(payload);
      }
    }
  });
}
