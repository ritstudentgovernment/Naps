Template.addTree.events({
  'click #geoLoc' : function(e){
    e.preventDefault();
    Location.locate(function(pos){
       console.log("Got a position!", pos);
       $('input[name=lat]').val(pos.latitude);
       $('input[name=lng]').val(pos.longitude);
    }, function(err){
       console.log("Oops! There was an error", err);
    });
  }
});
