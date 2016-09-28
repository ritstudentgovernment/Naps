Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function () {
    return Meteor.subscribe('singleton');
  },
  onRun: function () {
    GAnalytics.pageview(Router.current().url);
    this.next();
  },
  onAfterAction: function () {
    if (Errors.find().fetch().length > 0) {
      $('#errorModal').modal('show');
    }
  }
});

Router.map(function() {
  this.route('index', {
    path: '/',
    template: 'mapMain',
    waitOn: function () {
      return Meteor.subscribe('naps');
    },
    onBeforeAction:function(){
      Session.set('addingNap', undefined);
      this.next();
    }
  });

  this.route('addNap', {
      path: '/addNap',
      template: 'addNapPage',
      waitOn: function (){
          return Meteor.subscribe('naps');
      }
  });

  //static routes
  this.route('about', {
    path: '/about',
    template: 'aboutTemplate',
    data: function () {
      return {
        subtemplate: 'about'
      };
    }
  });

  this.route('policies', {
    path: '/about/policies',
    template: 'aboutTemplate',
    data: function () {
      return {
        subtemplate: 'policies'
      };
    }
  });

  this.route('privacy', {
    path: '/about/privacy',
    template: 'aboutTemplate',
    data: function () {
      return {
        subtemplate: 'privacy'
      };
    }
  });

  this.route('technology', {
    path: '/about/technology',
    template: 'aboutTemplate',
    data: function () {
      return {
        subtemplate: 'technology'
      };
    }
  });

  this.route('admin',{
    path: '/admin',
    template: 'admin',
    waitOn: function() {
      return [Meteor.subscribe('revUsers')];
    },
    data: function(){
      return {admins: Meteor.users.find({roles: {$in: ['admin']}}).fetch(),
              revs: Meteor.users.find({roles: {$in: ['reviewer']}}).fetch()};
    }
  });

  this.route('uploadCSV',{
    path: '/uploadCSV',
    template: 'uploadCSV'
  });

  this.route('review',{
    path: '/review',
    template: 'review'
  });
  
});
