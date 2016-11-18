Meteor.startup(function() {
  
  // Initialize admin user
  if (Meteor.users.find().count() === 0) {
    var adminUser = Meteor.users.insert({
      username: "oed7416",
      identity: {
        name: "Omar De La Hoz",
        firstName: "Omar",
        lastName: "De La Hoz",
      },
      evaluationCounts: [],
      sectionIds: []
    });
    Roles.addUsersToRoles(adminUser, ['admin']);
  }
});