Template.jobs.helpers({
  jobs: function () {
    return Jobs.find({}, {sort: {created: -1}}).fetch();
  }
});

Template.aboutJobs.events({
  'submit form': function (event, template) {
    event.preventDefault();
    if (confirm("Are you sure? This will kick off an e-mail to 15,000+ students.")) {
      Meteor.call('sendEmail', function () {});
    }
  }
});

Template.job.events({
  'submit form': function (event, template) {
    event.preventDefault();
    if (confirm("Are you sure? If this job is currently running, it will be ended prematurely.")) {
      Meteor.call('deleteJob', this._id, function () {});
    }
  }
});

Template.job.helpers({
  jobLogTime: function (date) {
    return new moment(date).format('MMMM Do YYYY, h:mm:ss a');
  }
});
