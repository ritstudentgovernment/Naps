Template.sidenav.helpers({
  'napCount':function(s){
    return Naps.find({spot_type:s}).count();
  }
})

Template.sidenav.events({
  'click #remove':function(e){
    var id = e.target.getAttribute('napid');
    Naps.remove(id);
    $('#closePanel').removeClass('toggled');
    $('#sidebar-wrapper').removeClass('toggled');
    $('#bottombar-wrapper').removeClass('toggle-bottom');
    $('#map').removeClass('map-toggle');
  }
});
