Template.welcomeView.events({
	'click #startNap': function() {
		
		Meteor.call("firstLogin", Meteor.user()._id);
	}
});