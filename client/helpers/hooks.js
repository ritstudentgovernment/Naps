
var hooksObject = {
  // Called when any submit operation succeeds
  // 
  onSuccess: function(formType, result) {

    if(formType == "insert"){

      //Remove Preview Marker
      if(previewMarker.length != 0){

        previewMarker[0].setMap(null);
        google.maps.event.clearInstanceListeners(previewMarker[0]);
        delete previewMarker[0];

      }

      //Change url to the index.
      history.pushState({}, null, '/');

      if(Roles.userIsInRole(Meteor.userId(), ['reviewer','admin'])){

        //Throw success message
        Session.set('addingNap', false);
        throwError("Your Nap Spot was successfully added.");
      }
      else{

        //Throw success message
        throwError("Your Nap Spot was received and will be reviewed soon!");
        var email = Meteor.user().username + "@rit.edu";
        var nap = Naps.findOne(result);
        var napLink = Meteor.absoluteUrl() + 'nap/' + result;

        var emailData = {
          name: Meteor.user().username,
          spot_type: nap.spot_type,
          lat: nap.lat,
          lng: nap.lng,
          size: nap.size,
          qlvl: nap.qlvl,
          notes: nap.notes,
          napLink: napLink,
          staticKey: Meteor.settings.public.STATICKEY,
          creatorId: nap.creatorId,
          logoLink: Meteor.absoluteUrl() + 'sglogo.png',
          unsubLink: Meteor.absoluteUrl() + 'unsubscribe/' + Meteor.user()._id,
        };

        Meteor.call('emailUser', email, emailData, "napAdded");

      }

      //Set the adding nap session to false
      Session.set('addingNap', false);

      //Set the selected nap to the added nap
      var nap = Naps.findOne(result);
      Session.set('selectedNap', nap);

    }
    else if(formType == "update"){

      //Throw success message
      throwError("Your Nap Spot was successfully updated.");
      
      //Set the editing nap session to false
      Session.set('editingNap',false);

      //Set the selected nap to the edited nap
      var nap = Naps.findOne(this.docId);
      Session.set('selectedNap', nap);

    }
      
    //if on mobile add page go back to map
    if(routeUtils.testRoutes('addNap')){

      Router.go('/');
    }
  },

  // Called when any submit operation fails
  onError: function(formType, error) {
    throwError("Error: " + error);
  }
};

AutoForm.hooks({
  napForm: hooksObject
});

var routeUtils = {
  context: function() {
    return Router.current();
  },
  regex: function(expression) {
    return new RegExp(expression, 'i');
  },
  testRoutes: function(routeNames) {
    var reg = this.regex(routeNames);
    return this.context() && reg.test(this.context().route.getName());
  }
};
