/**
 * filename: buildings.js
 * description: RIT Buildings collection.
 * created on: 02/01/17
 * created by: Omar De La Hoz (oed7416@rit.edu)
 */


Buildings = new Mongo.Collection('buildings');

Buildings.attachSchema( new SimpleSchema({

	name: {
		label: "Building name",
		type: String,
		optional: false
	},
	abbreviation: {
		label: "Abbreviation",
		type: String,
		optional: false
	}
}));
