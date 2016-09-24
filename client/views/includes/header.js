Template.header.helpers({
  privilegedRoles: function () {
    return Roles.getRolesForUser(Meteor.user());
  }
});

Template.header.events({
  'click #addNap':function(){
    Session.set('addingNap', true);
    $('#sidebar-wrapper').addClass('toggled');
    $('#closePanel').addClass('toggled');
  },
  'click #review':function(){
  	Session.set('reviewNap', true);
    $('#sidebar-wrapper').addClass('toggled');
    $('#closePanel').addClass('toggled');
  }
})
