Naps = new Mongo.Collection('naps');

Naps.attachSchema( new SimpleSchema({

	latitude: {
		label: "Latitude",
		type: String,
		optional: false
	},
	longitude: {
		label: "Longitude",
		type: String,
		optional: false
	},
	size: {
		label: "Size",
		type: String,
		optional: true
	},
	spot_type: {
		label: "Spot Type",
		type: String,
		optional: false
	},
	qlvl: {
		label: "Quiet Level",
		type: Number,
		optional: false; 
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
	picture: {
		type: String,
		optional: true
	}
}));

Naps.allow({
	insert: function () { return Meteor.user(); },
  	update: function (userId) { return Roles.userIsInRole(userId, ['admin']); },
  	remove: function (userId) { return Roles.userIsInRole(userId, ['admin']); },
});

NapsFS = new FS.Collection('napsFS', {
	stores: [new FS.Store.FileSystem('napsFS')]
});

NapsFS.allow({
	insert:   function (userId, file) { return true; },
	update:   function (userId, file) { return true; },
  	download: function () {return true; }
});

if (Meteor.isServer) {
	Meteor.methods({
		insertCSVData: function(parses) {

			//Precheck data for entries without required data
      		//Don't insert nap if found.
      		for(var i = 0; i < parses.length; i++){

      			var napspot = parses[i];
      			if(!(napspot.SpotType && napspot.QuietLevel && napspot.Latitude && napspot.Longitude)){
      				
      				//Return true for the error and with error message
      				throw new Meteor.Error(500, 'Nap Spot not added. All Entries must have a Spot Type, Quiet Level, Latitude and Longitude attribute.');
      				return;
      			}
      		}

      		for(var i = 0; i < parses.length; i++){
      			var napspot = parses[i];

      			var payload = {

      				latitude: napspot.Latitude;
      				longitude: napspot.Longitude;
      				size: napspot.Size;
      				spot_type: napspot.SpotType;
      				qlvl: napspot.QuietLevel;
      				notes: napspot.Notes;

      			}
      			Naps.insert(payload);
      		}
		}
	});
}