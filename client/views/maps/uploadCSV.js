Template.uploadCSV.events({
  'click #upload':function(){
    var file = $('#csvFile')[0].files[0];
    if(file){
      Papa.parse(file, {
        header:true,
        complete: function(results) {
          Session.set("csvResults", results.data);
        }
      });
    }else{
      throwError("You must choose a file!");
    }

  },
  'click #submitTrees':function(){
    var parses = Session.get('csvResults');
    Meteor.call('insertCSVData', parses, function(error){
      if(error){
        throwError(error.reason);
      }else{
        throwError("Trees Successfuly Added!");
        Session.set('csvResults', undefined);
      }
    });
  }

});
