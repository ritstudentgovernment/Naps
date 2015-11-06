Template.datafeed.helpers({
  jobs: function () {
    return DataFeedJobs.find({}, {sort: {created: -1}}).fetch();
  }
});

Template.aboutDataFeeds.helpers({
  schema: function () {
    return DataFeedJobs.schema;
  }
});
