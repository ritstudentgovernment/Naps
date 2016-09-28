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

Handlebars.registerHelper('napURL', function (id) {
  var img = NapsFS.findOne(id);
  return img ? img.url() : "";
});

Handlebars.registerHelper('canReview', function () {
  if(Roles.userIsInRole(Meteor.userId(), ['reviewer','admin'])){
    return true;
  }
  else{
    return false;
  }
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

Handlebars.registerHelper('exampleMapOptions', function(){
  // Make sure the maps API has loaded
      if (GoogleMaps.loaded()) {
        // Map initialization options
        return {
          center: new google.maps.LatLng(43.0832, -77.6778),
          zoom: 16,
          mapTypeControl: true,
          mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.TOP_RIGHT
          },
        };
      }
});
