////////////////////////////////////////////////////////////////////////////////
///                   sendEmail.js
///
///Author:       Omar De La Hoz
///Description:  Send email to users and moderators.
///Date Created: 10/11/16 
///updated:      10/28/16
////////////////////////////////////////////////////////////////////////////////

Meteor.methods({
emailUser: function(email, emailData, actionType){

  //Compile the HTML tmeplates.
  SSR.compileTemplate('newNap', Assets.getText('newNap.html'));
  SSR.compileTemplate('approveNap', Assets.getText('approveNap.html'));
  SSR.compileTemplate('denyNap', Assets.getText('denyNap.html'));
  SSR.compileTemplate('reviewNap', Assets.getText('reviewNap.html'));

  //Get the Nap creator.
  var creator = Meteor.users.findOne({"_id": emailData.creatorId});

  //Generate email creator unsub link.
  email = creator.username + "@rit.edu";
  emailData.name = creator.username;
  emailData.likesEmail = creator.likesEmail;
  emailData.unsubLink = Meteor.absoluteUrl() + 'unsubscribe/' + creator._id;
  emailData.back_img = Meteor.absoluteUrl() + 'back_img.png';
  console.log(emailData.back_img);

  // Send email depending on action type.
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
  else if(actionType == "napApproved" && emailData.likesEmail){

    Email.send({
      to: email,
      from: "sgnoreply@rit.edu",
      subject: "Nap Spot approved.",
      html: SSR.render('approveNap', emailData),
    });
  }
  else if(actionType == "napDenied" && emailData.likesEmail){

    Email.send({
      to: email,
      from: "sgnoreply@rit.edu",
      subject: "Nap Spot denied.",
      html: SSR.render('denyNap', emailData),
    });
  }
},
unsubscribe: function(id){
  Meteor.users.update({_id: String(id)}, {$set : {likesEmail: false}});
}
});