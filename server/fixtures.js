Meteor.startup(function() {
  // Initialize admin user
  if (Meteor.users.find().count() === 0) {
    var adminUser = Meteor.users.insert({
      username: "sgweb",
      identity: {
        name: "James Reilly",
        firstName: "James",
        lastName: "Reilly",
      },
      evaluationCounts: [],
      sectionIds: []
    });
    Roles.addUsersToRoles(adminUser, ['reviewer']);

  }
});