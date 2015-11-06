// Site-wide, global information, including denormalized data.

Singleton = new Mongo.Collection('singleton');

Singleton.schema = new SimpleSchema({
  evaluationCount: {
    type: Number,
    autoform: {
      type: "hidden"
    }
  },
  evaluationTermFriendlyName: {
    type: String,
    label: "Current Evaluation Term Friendly Name. Used for display only. For example, enter 'Spring 2015'.",
    autoform: {
      placeholder: "Spring 2015"
    }
  },
  evaluationTerm: {
    type: Number,
    label: "Current Evaluation Term. Users need to evaluate 2 courses from this term to view evaluation data.",
    autoform: {
      placeholder: "20145"
    }
  },
  nextEvaluationTermFriendlyName: {
    type: String,
    label: "Next Evaluation Term Friendly Name. Used for display only. For example, enter 'Fall 2015'.",
    autoform: {
      placeholder: "Spring 2015"
    }
  },
  nextEvaluationTerm: {
    type: Number,
    label: "Next Evaluation Term. Used to show next term's instructors/courses on a given course/instructor page, respectively.",
    autoform: {
      placeholder: "20151"
    }
  },
  version: {
    type: String,
    autoform: {
      type: "hidden"
    }
  }
});

Singleton.attachSchema(Singleton.schema);

Singleton.allow({
  // No inserts allowed on a singleton.
  insert: function (userId, singleton) {
    return false;
  },
  update: function (userId, document, fieldNames, modifier) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  // No removals allowed on a singleton.
  remove: function (userId, singleton) {
    return false;
  }
});
