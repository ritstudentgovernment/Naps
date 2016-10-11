Template.sidenav.helpers({
  'napCount':function(s){
    return Naps.find({spot_type:s}).count();
  },
  'ownPending':function(approved){
    return !approved && Meteor.user()._id;
  }
});

Template.sidenav.events({
  'click #edit':function(e){
    var id = e.target.getAttribute('napid');
    Session.set('selectedNap', false);
    Session.set('editingNap', Naps.findOne(id));
  },
  'click #remove':function(e){
    var id = e.target.getAttribute('napid');
    var nap = Naps.findOne(id);
    var napLink = Meteor.absoluteUrl() + 'nap/' + id;

    //Create the email data.
    var emailData = {
      spot_type: nap.spot_type,
      lat: nap.lat,
      lng: nap.lng,
      size: nap.size,
      qlvl: nap.qlvl,
      notes: nap.notes,
      napLink: napLink,
      staticKey: Meteor.settings.public.STATICKEY,
      creatorId: nap.creatorId,
      logoLink: Meteor.absoluteUrl() + 'sglogo.png'
    };

    Meteor.call('emailUser', null, emailData, "napDenied");

    Naps.remove(id);
    $('#closePanel').removeClass('toggled');
    $('#sidebar-wrapper').removeClass('toggled');
    $('#bottombar-wrapper').removeClass('toggle-bottom');
    $('#map').removeClass('map-toggle');

    throwError("Nap Spot was succesfully denied.");
  },
  'click #approve':function(e){
    var id = e.target.getAttribute('napid');
    Naps.update({ _id: id}, {$set: {approved: true}});
    var nap = Naps.findOne(id);
    var napLink = Meteor.absoluteUrl() + 'nap/' + id;

    //Create the email data.
    var emailData = {
      spot_type: nap.spot_type,
      lat: nap.lat,
      lng: nap.lng,
      size: nap.size,
      qlvl: nap.qlvl,
      notes: nap.notes,
      napLink: napLink,
      staticKey: Meteor.settings.public.STATICKEY,
      creatorId: nap.creatorId,
      logoLink: Meteor.absoluteUrl() + 'sglogo.png'
    };

    Meteor.call('emailUser', null, emailData, "napApproved");

    $('#closePanel').removeClass('toggled');
    $('#sidebar-wrapper').removeClass('toggled');
    $('#bottombar-wrapper').removeClass('toggle-bottom');
    $('#map').removeClass('map-toggle');

    throwError("Nap Spot was succesfully approved.");
  }
});