Template.globalSettings.helpers({
  schema: function () {
    return Singleton.schema;
  },
  singletonDoc: function () {
    return Singleton.findOne();
  }
});
