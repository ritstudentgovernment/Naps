/**
 * filename: buildingList.js
 * description: Gets list of buildings from RIT Maps API.
 * created by: Omar De La Hoz (oed7416@rit.edu)
 * created on: 02/01/17
 */

Meteor.methods({
	'buildingList': function() {

		var mapsURL = "https://maps.rit.edu/proxySearch/?show=all&q=*&wt=json&indent=off&sort=name+asc&fq=tag:%22Academic+Building%22&fl=abbreviation,name&start=0&rows=1000"

		HTTP.get(mapsURL, null, function(error, result){

			if(error){

				throw new Meteor.Error("Error", "Something went wrong.");
			}
			else{

				var result = JSON.parse(result.content);
				var buildingDocs = result.response.docs;

				for(var i = 0; i < buildingDocs.length; i++){

					var query = {abbreviation: buildingDocs[i].abbreviation};

					Buildings.upsert(query, {$set: query, $setOnInsert: {name: buildingDocs[i].name}});
				}
			}
		});
	}	
});