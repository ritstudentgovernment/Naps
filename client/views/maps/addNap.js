Template.addNap.events({
  'click #geoLoc' : function(e){
    e.preventDefault();
    Location.locate(function(pos){
       $('input[name=lat]').val(pos.latitude);
       $('input[name=lng]').val(pos.longitude);
    }, function(err){
       console.log("Oops! There was an error", err);
    });
  }
});
