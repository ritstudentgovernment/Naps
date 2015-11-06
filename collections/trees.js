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
  }
}));

Trees.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});
