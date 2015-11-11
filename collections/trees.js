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
    defaultValue: "Not Listed."
  },
  height: {
    label: "Estimated Height",
    type: String,
    optional: true,
    defaultValue: "Not Listed."
  },
  species: {
    label: "Species",
    type: String,
    optional: false
  },
  notes: {
    label: "Notes",
    type: String,
    optional: true,
    defaultValue: "No Notes."
  },
  picture:{
    type: String,
    optional: true
  }
}));

Trees.allow({
  insert: function () { return Meteor.user(); },
  update: function () { Roles.userIsInRole(Meteor.user(), ['admin']); },
  remove: function () { Roles.userIsInRole(Meteor.user(), ['admin']); }
});

TreesFS = new FS.Collection('treesFS', {
  stores: [new FS.Store.FileSystem('treesFS')]
});

TreesFS.allow({
  insert:   function (userId, file) { return true; },
  update:   function (userId, file) { return true; },
  download: function () {return true; }
});
