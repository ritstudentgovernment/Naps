Template.afCheckbox_tag.events({
  'click .btn': function (e, template) {
    this.value = !this.value;
    $("input[name=" + this.name + "]").prop("checked", this.value);
    $(e.target).blur();
  }
});

Template.afCheckbox_tag.rendered = function () {
  $(this.firstNode).parent().css("display", "inline-block");
  $(this.firstNode).parent().css("margin-bottom", "4px");
};
