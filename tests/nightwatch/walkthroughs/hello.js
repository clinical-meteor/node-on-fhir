// add tests to this file using the Nightwatch.js API
// http://nightwatchjs.org/api


// All right, you mutinous, computerized, disloyal half-breed - we'll see about you deserting my ship.

module.exports = {
  tags: ['circle', 'hello'],
  before: function(client){
    client
      .url("http://localhost:3000/landing-page").pause(3000);
  },
  'Body exists': function (client) {
    client
      .verify.elementPresent('body')
      .end();
  }
};
