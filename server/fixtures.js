Meteor.startup(function() {
  // Initialize admin user
  if (Meteor.users.find().count() === 0) {
    var adminUser = Meteor.users.insert({
      username: "sgweb",
      identity: {
        name: "Peter Mikitsh",
        firstName: "Peter",
        lastName: "Mikitsh"
      },
      evaluationCounts: [],
      sectionIds: []
    });
    Roles.addUsersToRoles(adminUser, ['admin']);
  }
});
