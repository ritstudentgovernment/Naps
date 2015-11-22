Template.sidenav.helpers({
  'treeCount':function(s){
    return Trees.find({species:s}).count();
  }
})
