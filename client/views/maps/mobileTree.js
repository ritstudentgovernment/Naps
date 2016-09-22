Template.mobileNap.helpers({
  'napCount':function(s){
    return Naps.find({spot_type:s}).count();
  }
})
