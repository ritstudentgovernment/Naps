Handlebars.registerHelper('sections', function () {
  return Meteor.users.getSections(this.esUser);
});

Handlebars.registerHelper('absolutePathFor', function (routeName, id) {
  return Meteor.absoluteUrl([routeName, id].join("/"));
});
