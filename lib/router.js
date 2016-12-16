/**
 * filename: router.js
 * description: URL Router for Naps
 * creator: Omar De La Hoz (omardlhz)
 * created on: 09/17/16
 * updated on: 12/06/16
 */

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


  //  Triggered when logo button is clicked.
  this.route('index', {
    path: '/',
    template: 'mapMain',
    waitOn: function () {
      return Meteor.subscribe('naps');
    },
    onBeforeAction:function(){

      // Hide sidebar if any.
      Session.set('addingNap', undefined);
      $('#closePanel').removeClass('toggled');
      $('#sidebar-wrapper').removeClass('toggled');
      $('#bottombar-wrapper').removeClass('toggle-bottom');
      $('#map').removeClass('map-toggle');

      this.next();
    }
  });

  
  //  Triggered when 'Add Entry' is pressed.
  this.route('addingNap', {
    template: 'mapMain',

    waitOn: function () {
      return Meteor.subscribe('naps');
    },
    onRun:function(){

        console.log("here");
        // Set addingNap to true (non-reactive).
        Session.set("addingNap", true);
    },
    onAfterAction:function(){

      // Show side panel to add entry.
      setTimeout(function(){
        $('#sidebar-wrapper').addClass('toggled').one();
        $('#closePanel').addClass('toggled');
      }, 0);
    }
  });


  //  Triggered when adding Nap on mobile.
  this.route('addNap', {
      path: '/addNap',
      template: 'addNapPage',
      waitOn: function (){
          return Meteor.subscribe('naps');
      }
  });


  //  Route to edit a Nap.
  this.route('editNap/:napId', {
    path: '/editNap/:napId',
    template: 'editNap',
    waitOn: function(){
      return Meteor.subscribe('naps');
    },
    data: function() {
      return Naps.findOne(this.params.napId);
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

  this.route('/nap/:napId',{
    template: 'focusNap',
    path: '/nap/:napId',
    waitOn: function(){

      return Meteor.subscribe('naps');

    },
    data: function(){
      Session.set('selectedNap', Naps.findOne(this.params.napId));
    }
  });

  this.route('unsubscribe/:id',{
    template: 'unsubEmail',
    waitOn: function(){
      return Meteor.subscribe('unsubUser', this.params.id), Meteor.subscribe('naps');
    },
    onRun: function(){
      Meteor.call('unsubscribe', this.params.id);
    }
  });
  
});