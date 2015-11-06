Meteor.publish('markers', function (courseParentNum) {
  return Markers.find();
});

Meteor.publish('trees', function (courseParentNum) {
  return Trees.find();
});

Meteor.publish('course', function (courseParentNum) {
  return Courses.find({courseParentNum: courseParentNum});
});

Meteor.publish('courseSections', function (courseParentNum) {
  return Sections.find({courseParentNum: courseParentNum});
});

Meteor.publish('instructor', function (name) {
  return Instructors.find({name: name});
});

Meteor.publish('instructorSections', function (name) {
  return Sections.find(
    {
      instructor: name,
      term: {$in: [Singleton.findOne().evaluationTerm, Singleton.findOne().nextEvaluationTerm]}
    },
    {fields: {
      title: 1,
      courseParentNum: 1,
      instructor: 1,
      term: 1
    }
  });
})

Meteor.publish('jobs', function () {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Jobs.find();
  } else {
    this.ready();
  }
});

Meteor.publish('dataFeedJobs', function () {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return DataFeedJobs.find();
  } else {
    this.ready();
  }
});

Meteor.publish('sections', function () {
  return Sections.find();
});

Meteor.publish('sectionById', function (id) {
  return Sections.find({id: id});
});

Meteor.publish('sectionByCourseId', function(id) {
  return Sections.find({courseId: id});
})

Meteor.publish('mySections', function () {
  if (this.userId) {
    var sectionIds = Meteor.users.findOne(this.userId).sectionIds;
    return Sections.find({_id: {$in: sectionIds}, term: Singleton.findOne().evaluationTerm});
  } else {
    this.ready();
  }
});

Meteor.publish('myEvaluations', function () {
  if (this.userId) {
    return Evaluations.find({userId: this.userId}, {fields: {
      "courseNum": 1,
      "term": 1,
      "userId": 1
    }});
  } else {
    this.ready();
  }
});

Meteor.publish('singleton', function () {
  return Singleton.find();
});

Meteor.publish('courseEvaluations', function (courseParentNum) {
  if (this.userId) {
    if (Roles.userIsInRole(this.userId, 'admin') || !Evaluations.moreReviewsNeeded(this.userId)) {
      return Evaluations.find({courseParentNum: courseParentNum}, {
        fields: {
          "attendance": 1,
          "enrollment": 1,
          "expensive": 1,
          "groupWork": 1,
          "highValue": 1,
          "recommendCourse": 1,
          "textbook": 1,
          "textbookOld": 1,
          "courseComments": 1,
          "courseCommentsUpvotes": 1,
          "courseCommentsDownvotes": 1,
          "courseCommentsHidden": 1,
          "createdAt": 1
        }
      });
    } else {
      this.ready();
    }
  } else {
    this.ready();
  }
});

Meteor.publish('instructorEvaluations', function (instructorName) {
  if (this.userId) {
    if (Roles.userIsInRole(this.userId, 'admin') || !Evaluations.moreReviewsNeeded(this.userId)) {
      return Evaluations.find({instructorName: instructorName}, {
        fields: {
          "clarity": 1,
          "effectiveness": 1,
          "helpfulness": 1,
          "organization": 1,
          "positivity": 1,
          "responsiveness": 1,
          "supportiveness": 1,
          "instructorComments": 1,
          "instructorCommentsUpvotes": 1,
          "instructorCommentsDownvotes": 1,
          "instructorCommentsHidden": 1,
          "createdAt": 1
        }
      });
    } else {
      this.ready();
    }
  } else {
    this.ready();
  }
});

// Expose individual users' objects
Meteor.publish(null, function() {
  return Meteor.users.find(this.userId, {fields: {
    evaluationCounts: 1,
    identity: 1,
    sectionIds: 1,
  }});
});
