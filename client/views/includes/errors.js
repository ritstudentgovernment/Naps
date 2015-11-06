// Local (client-only) collection
Errors = new Mongo.Collection(null);

throwError = function (message) {
  Errors.remove({});
  Errors.insert({message: message});
};

Template.errors.helpers({
  errors: function() {
    return Errors.find().fetch();
  }
});

Template.errors.events({
  'hidden.bs.modal': function (e, template) {
    Errors.remove({});
  }
});
