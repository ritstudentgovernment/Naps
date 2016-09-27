
var hooksObject = {
  // Called when any submit operation succeeds
  // 
  onSuccess: function(formType, result) {
    //Remove Preview Marker
    previewMarker[0].setMap(null);
    google.maps.event.clearInstanceListeners(previewMarker[0]);
    delete previewMarker[0];
    //Throw success message
    throwError("Your Nap Spot was received and will be reviewed soon!");
    //Set the adding nap session to false
    Session.set('addingNap',false);
    //Set the selected nap to the added nap
    var nap = Naps.findOne(result);
    Session.set('selectedNap', nap);
    //if on mobile add page go back to map
    if(routeUtils.testRoutes('addNap')){
        Router.go('/');
    }
  },

  // Called when any submit operation fails
  onError: function(formType, error) {
    throwError("Error: " + error);
  }
};

AutoForm.hooks({
  napForm: hooksObject
});

var routeUtils = {
  context: function() {
    return Router.current();
  },
  regex: function(expression) {
    return new RegExp(expression, 'i');
  },
  testRoutes: function(routeNames) {
    var reg = this.regex(routeNames);
    return this.context() && reg.test(this.context().route.getName());
  }
};
