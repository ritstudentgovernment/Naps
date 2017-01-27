/**
 * filename: spot_types.js
 * description: Spot type collection for dropdown.
 * author: Omar De La Hoz (oed7416@rit.edu)
 * created on: 01/26/17
 */

Spot_types = new Mongo.Collection('spot_types');

Markers.attachSchema( new SimpleSchema({

	name: {
		type: String,
		optional: false
	}
}));

Meteor.methods({
	'editTypes': function(typeName, action) {
		
		if(action === "add"){

			var exists = Spot_types.findOne({name: typeName});

			if(!exists){

				Spot_types.insert({name: typeName});
			}
			else{

				throw new Meteor.Error(403, "Spot type already exists.");
			}
		}
		else if(action === "remove"){

			var naps = Naps.find({spot_type: typeName}).count();

			if(naps > 0){

				throw new Meteor.Error(403, "There exists one or more nap(s) with this type.");
			}

			var spotId = Spot_types.findOne({name: typeName});
			Spot_types.remove(spotId);
		}
	}
});