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

Handlebars.registerHelper('isActiveRoute', function(route) {
  return routeUtils.testRoutes(route) ? 'active' : '';
});

Handlebars.registerHelper('session', function (input) {
  return Session.get(input);
});

Handlebars.registerHelper('pluralize', function (term, count) {
  return count == 1 ? term : term + "s";
});

Handlebars.registerHelper('breaklines', function (text) {
  if (!text) { return ""; }
  text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
  return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('singleton', function () {
  return Singleton.findOne();
});

Handlebars.registerHelper('or', function (a, b) {
  return a ? a : b;
});

Handlebars.registerHelper('gte', function (a, b) {
  return a >= b;
});

Handlebars.registerHelper('eq', function (a, b) {
  return a == b;
});

function getEvaluationObject () {
  var singleton = Singleton.findOne();
  return _.find(Meteor.user().evaluationCounts,
    function (evaluationCount) {
      return evaluationCount.term == singleton.evaluationTerm;
    }
  );
};

Handlebars.registerHelper('moreReviewsNeeded', function () {
  var evaluationObj = getEvaluationObject();
  if (evaluationObj) {
    return evaluationObj.count < 2;
  } else {
    return true;
  }
});
