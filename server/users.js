Meteor.users.attachSchema(new SimpleSchema({
  "evaluationCounts.$.term": {
    type: Number
  },
  "evaluationCounts.$.count": {
    type: Number
  },
  "identity.name": {
    type: String,
    optional: true
  },
  "identity.firstName": {
    type: String,
    optional: true
  },
  "identity.lastName": {
    type: String,
    optional: true
  },
  sectionIds: {
    type: [String],
    defaultValue: [],
    optional: true
  },
  // from meteor packages
  username: {
    type: String
  },
  createdAt: {
    type: Date,
    optional: true
  },
  roles: {
    type: [String],
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  }
}));

Meteor.users.getESEmail = function (esUser) {
  var regex = /[a-zA-Z0-9]+/;
  var matches = regex.exec(esUser._id);
  return matches && matches[0] ? matches[0] + "@rit.edu" : "";
}

// This function excludes resuscitations (e.g., section CHMG-141-02R2-s).
Meteor.users.getSections = function (esUser) {
  var sections = [],
      regex = /rit-section-(\d+)-(\w+-\d+-\w?\d+L?\d?)-s/;
  if (esUser && esUser._source) {
    _.each(esUser._source.groups, function (group) {
      var matches = regex.exec(group);
      if (matches && matches[1] && matches[2]) {
        var termCode = Meteor.getStdTermCode(matches[1]);
        /*
         * First attempt to match to find an exact match course.
         */
        var section = Sections.findOne({term: termCode, courseNum: matches[2]});
        /*
         * If an exact match cannot be found, fall back on a regular expression
         * to more loosely match the appropriate section a student is enrolled
         * in, due to data format integration issues between the
         * `ELASTICSEARCH_ENDPOINT` and `COURSEDATA_ENDPOINT`.
         */
        if (!section) {
          var sectionRegex = matches[2].split("-").join("").split("").join(".*");
          section = Sections.findOne({term: termCode, courseNum: {$regex: sectionRegex}});
        }
        if (section) {
          sections.push(section);
        }
      }
    });
  }
  return sections;
}

Meteor.users.getESUser = function (username) {
  return Async.runSync(function (done) {
    HTTP.post(Meteor.settings.ELASTICSEARCH_ENDPOINT, {
      timeout: 1 * 60 * 1000, // 1 Minute
      data: {
        "query": {
          "query_string": {
            "query": username
          }
        }
      }
    }, function (error, result) {
      if (error) {
        done(error, "An error occured accessing Elastic Search");
      } else {
        done(null, result.data.hits.hits[0]);
      }
    });
  }).result;
}
