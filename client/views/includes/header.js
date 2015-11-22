Template.header.helpers({
  privilegedRoles: function () {
    return Roles.getRolesForUser(Meteor.user());
  }
});

Template.header.events({
  'click #addTree':function(){
    Session.set('addingTree', true);
    $('#sidebar-wrapper').addClass('toggled');
    $('#closePanel').addClass('toggled');
  }
})
