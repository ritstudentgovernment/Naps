
var hooksObject = {

  // Called when any submit operation succeeds
  onSuccess: function(formType, result) {
    throwError("Tree Added!");
    Session.set('addingTree',false);
    var tree = Trees.findOne(result);
    Session.set('selectedTree', tree);
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
