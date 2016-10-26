////////////////////////////////////////////////////////////////////////////////
///                                     naps.js
///
///Author       : Omar De La Hoz (oed7416@rit.edu)
///Description  : Collection for nap objects.
///Date Created : 09/21/16
///updated      : 10/25/16
////////////////////////////////////////////////////////////////////////////////

Naps = new Mongo.Collection('naps');

Naps.attachSchema( new SimpleSchema({

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
		optional: false 
	},
	notes: {
		label: "Notes",
		type: String,
		optional: true
	},
	picture: {
		type: String,
		optional: true
	},
	approved:{
		type: Boolean,
		optional: false,
		autoValue: function(){
			if(Roles.userIsInRole(Meteor.userId(), ['admin','reviewer'])){

				return true;

			}
			else{
				return false;
			}
		}
	},
	creatorId: {
		type: String,
		max: 50
	}
}));

Naps.allow({
	insert: function () { return Meteor.user(); },
  	update: function (userId) { return Roles.userIsInRole(userId, ['admin','reviewer']); },
  	remove: function (userId, doc) { return Roles.userIsInRole(userId, ['admin','reviewer']); },
});

NapsFS = new FS.Collection('napsFS', {
	stores: [new FS.Store.FileSystem('napsFS', {
		transformWrite: function(fileObj, readStream, writeStream) {
			// Depends on GraphicsMagick.
			gm(readStream, fileObj.name).resize(300, 300).autoOrient().stream().pipe(writeStream);
		}
	})]
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

      				lat: napspot.Latitude,
      				lng: napspot.Longitude,
      				size: napspot.Size,
      				spot_type: napspot.SpotType,
      				qlvl: napspot.QuietLevel,
      				notes: napspot.Notes,

      			}
      			Naps.insert(payload);
      		}
		}
	});
}