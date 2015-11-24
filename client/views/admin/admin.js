Template.admin.events({
  'submit form': function(e) {
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
  }
});
