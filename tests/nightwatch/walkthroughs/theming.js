// add tests to this file using the Nightwatch.js API
// http://nightwatchjs.org/api


// All right, you mutinous, computerized, disloyal half-breed - we'll see about you deserting my ship.

module.exports = {
  tags: ['theming'],
  before: function(client){
    client
      .url("http://localhost:3000").pause(3000);
  },
  'Inverted text > title text is white': function (client) {
    client
      .waitForElementPresent('#signinPage .page-header', 5000)
      .verify.cssProperty('#signinPage .page-header', "color", "rgba(255, 255, 255, 1)");
  },
  'Regular theme > header and footer use white paper': function (client) {
    client
      .waitForElementPresent('#appHeader', 5000)
      .verify.cssProperty('#appHeader', "background-color", "rgba(255, 255, 255, 1)")

      .waitForElementPresent('#appFooter', 5000)
      .verify.cssProperty('#appFooter', "background-color", "rgba(255, 255, 255, 1)");
  },
  'Header and footer opacity are set to 0.95 by default': function (client) {
    client
      .waitForElementPresent('#appHeader', 5000)
      .verify.cssProperty('#appHeader', "opacity", "0.95")

      .waitForElementPresent('#appFooter', 5000)
      .verify.cssProperty('#appFooter', "opacity", "0.95");
  },
  'Header and footer opacity can be changed': function (client) {
    client
      .waitForElementPresent('#appHeader', 5000)
      .verify.cssProperty('#appHeader', "opacity", "0.95")

      .executeAsync(function(){
        Session.set('globalOpacity', 0.8);
      })

      .waitForElementPresent('#appHeader', 5000)
      .verify.cssProperty('#appHeader', "opacity", "0.8");
  },
  'Fin': function (client) {
    client.end();
  }
};
