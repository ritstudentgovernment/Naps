
var hooksObject = {
  // Called when any submit operation succeeds
  onSuccess: function(formType, result) {
    //Remove Preview Marker
    previewMarker[0].setMap(null);
    google.maps.event.clearInstanceListeners(previewMarker[0]);
    delete previewMarker[0];
    //Throw success message
    throwError("Tree Added!");
    //Set the adding tree session to false
    Session.set('addingTree',false);
    //Set the selected tree to the added tree
    var tree = Trees.findOne(result);
    Session.set('selectedTree', tree);
    //if on mobile add page go back to map
    if(routeUtils.testRoutes('addTree')){
        Router.go('/');
    }
  },

  // Called when any submit operation fails
  onError: function(formType, error) {
    throwError("Error: " + error);
  }
};

AutoForm.hooks({
  treeForm: hooksObject
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
