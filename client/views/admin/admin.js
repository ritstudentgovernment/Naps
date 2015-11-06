var pages = [{
  route: "jobs",
  label: "Email Campaigns"
},
{
  route: "datafeed",
  label: "Data Feed"
},
{
  route: "globalSettings",
  label: "Global Settings"
}];

Template.admin.helpers({
  pages: function () {
    return pages;
  },
  currentRouteName: function () {
    var currentRoute = Router.current().route.getName();
    return (currentRoute == "admin") ? pages[0].route : currentRoute;
  } 
});
