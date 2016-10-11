Meteor.methods({
emailUser: function(email, emailData, actionType){

  SSR.compileTemplate('newNap', Assets.getText('newNap.html'));
  SSR.compileTemplate('approveNap', Assets.getText('approveNap.html'));
  SSR.compileTemplate('reviewNap', Assets.getText('reviewNap.html'));

  var creator = Meteor.users.findOne({"_id": emailData.creatorId});

  email = creator.username + "@rit.edu";
  emailData.name = creator.username;
  emailData.likesEmail = creator.likesEmail;
  emailData.unsubLink = Meteor.absoluteUrl() + 'unsubscribe/' + creator._id;

  if(actionType == "napAdded"){

    if(emailData.likesEmail){

      Email.send({
        to: email,
        from: "sgnoreply@rit.edu",
        subject: "New Nap Created",
        html: SSR.render('newNap', emailData),
      });

    }

    var reviewers = Meteor.users.find({roles: {$in: ['admin','reviewer']}, likesEmail: true}, {fields: {'username':1}}).fetch()
    for(var i = 0; i < reviewers.length; i++){

      //Construct link for reviewer unsubscribe.
      var link = emailData.unsubLink;
      link = link.substring(0, link.lastIndexOf('/') + 1);
      link += reviewers[i]._id;

      emailData.unsubLink = link;

      Email.send({
        to: reviewers[i].username += "@rit.edu",
        from: "sgnoreply@rit.edu",
        subject: "New Nap Created",
        html: SSR.render('reviewNap', emailData),
      });
    }
  }
  else if(actionType == "napApproved"){

    if(emailData.likesEmail){
      Email.send({
        to: email,
        from: "sgnoreply@rit.edu",
        subject: "Nap Spot approved.",
        html: SSR.render('approveNap', emailData),
      });
    }
  }
},
unsubscribe: function(id){
  Meteor.users.update({_id: String(id)}, {$set : {likesEmail: false}});
}
});