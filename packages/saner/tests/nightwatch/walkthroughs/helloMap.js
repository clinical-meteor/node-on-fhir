// add tests to this file using the Nightwatch.js API
// http://nightwatchjs.org/api


// All right, you mutinous, computerized, disloyal half-breed - we'll see about you deserting my ship.

module.exports = {
  tags: ['circle', 'hello'],
  before: function(client){
    client
      .url("http://localhost:3000/map").pause(12000);
  },
  'Body exists': function (client) {
    client
      .verify.elementPresent('body')
  },
  'Map exists': function (client) {
    client
      .waitForElementPresent('#mapsPage', 10000)
  },
  'Fin': function (client) {
    client
      .end();
  }

};
