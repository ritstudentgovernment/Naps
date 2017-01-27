Template.admin.events({
  'submit #users': function(e) {
    e.preventDefault();

    var username,
        usernameDOM = $(event.target).find('[name=username]'),
        role = $(event.target).find('[name=role]').val(),
        action = $(event.target).find('[name=action]').val();

    if (action === "add") {
      username = usernameDOM.val();
    }
    if (action === "remove") {
      username = this.username;
    }

    Meteor.call('editUserRole', username, role, action, function (error) {
      if (action === "add")
          usernameDOM.val("");
      if (error) {
        GAnalytics.event("account", "edit", error.reason);
        throwError(error.reason);
      } else {
        GAnalytics.event("account", "edit");
      }
    });
  },
  'submit #types': function(e) {
    e.preventDefault();
    e.stopPropagation();

    var typeNameDOM = $(event.target).find('[name=type]');
    var typeName =  $(event.target).find('[name=type]').val();
    var action = $(event.target).find('[name=action]').val();

    Meteor.call('editTypes', typeName, action, function(error){

      if(error){

        throwError(error.reason);
      }
      else{

        if(action === "add"){

          typeNameDOM.val("");
        }
      }
    });
  }
});
