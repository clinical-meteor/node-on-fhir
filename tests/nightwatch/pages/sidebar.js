module.exports = {
  commands: [{
    selectLink: function(elementId) {
      return this
        .verify.elementPresent(elementId)
        .click(elementId);
    }
  }],
  elements: {}
};
