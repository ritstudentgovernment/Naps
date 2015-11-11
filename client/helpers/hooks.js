
var hooksObject = {

  // Called when any submit operation succeeds
  onSuccess: function(formType, result) {
    throwError("Tree Added!");
    Session.set('addingTree',false);
    var tree = Trees.findOne(result);
    Session.set('selectedTree', tree);
  },

  // Called when any submit operation fails
  onError: function(formType, error) {
    throwError("Error: " + error);
  }
};

AutoForm.hooks({
  treeForm: hooksObject
});
