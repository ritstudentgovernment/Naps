Template.sidenav.helpers({
  'treeCount':function(s){
    return Trees.find({species:s}).count();
  }
})

Template.sidenav.events({
  'click #remove':function(e){
    var id = e.target.getAttribute('treeid');
    Trees.remove(id);
    $('#closePanel').removeClass('toggled');
    $('#sidebar-wrapper').removeClass('toggled');
    $('#bottombar-wrapper').removeClass('toggle-bottom');
    $('#map').removeClass('map-toggle');
  }
});
