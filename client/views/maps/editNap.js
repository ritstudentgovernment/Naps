Template.editNap.events({
  'click #geoLoc' : function(e){
    e.preventDefault();
    Location.locate(function(pos){
       $('input[name=lat]').val(pos.latitude);
       $('input[name=lng]').val(pos.longitude);

       var napId = Session.get('editingNap')._id;

       markers[napId].setPosition({ lat: pos.latitude, lng: pos.longitude });

    }, function(err){
       console.log("Oops! There was an error", err);
    });
  }
});