Template.mobileTree.helpers({
  'treeCount':function(s){
    return Trees.find({species:s}).count();
  }
})
