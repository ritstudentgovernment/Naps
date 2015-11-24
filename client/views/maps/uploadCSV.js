Template.uploadCSV.events({
  'click #upload':function(){
    var file = $('#csvFile')[0].files[0];
    if(file){
      Papa.parse(file, {
        header:true,
        complete: function(results) {
          Session.set("csvResults", results.data);
        }
      });
    }else{
      throwError("You must choose a file!");
    }

  },
  'click #submitTrees':function(){
    var parses = Session.get('csvResults');
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
    throwError("Trees Added to the Map!");
    Session.set('csvResults', undefined);
  }

});
