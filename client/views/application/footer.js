Template.footer.helpers({
  'copyrightYear': function () {
    return new Date().getFullYear();
  },
  'singleton': function () {
    return Singleton.findOne();
  }
});
