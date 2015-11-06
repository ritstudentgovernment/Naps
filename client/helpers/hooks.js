var hooksObject = {

  // Called when any submit operation succeeds
  onSuccess: function(formType, result) {
    throwError("Success!");
    Session.set('addingTree',false);
    Session.set('coord', undefined);

  },

  // Called when any submit operation fails
  onError: function(formType, error) {
    throwError("Error: " + error);
  }
};

AutoForm.hooks({
  treeForm: hooksObject
});
