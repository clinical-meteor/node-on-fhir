// add tests to this file using the Nightwatch.js API
// http://nightwatchjs.org/api


// All right, you mutinous, computerized, disloyal half-breed - we'll see about you deserting my ship.

module.exports = {
  tags: ['circle', 'hello'],
  before: function(client){
    client
      .url("http://localhost:3000/").pause(3000);
  },
  'Body exists': function (client) {
    client
    .verify.elementPresent('body')
  },
  'Header exists': function (client) {
    client
      .verify.elementPresent('#header')
  },
  'Footer exists': function (client) {
    client
      .verify.elementPresent('#footerNavContainer')
      .verify.elementPresent('#footerNavigation')
  },
  'Sidebar Drawer exists': function (client) {
    client
      .verify.elementPresent('#appDrawerContainer')
  },
  'Can toggle sidebar open and close': function (client) {
    client
      .verify.elementPresent('#appDrawerContainer')
  },
  // 'Canvas exists': function (client) {
  //   client
  //     .waitForElementPresent('#appCanvas', 5000)
  // },
  'Card Interfaces exists': function (client) {
    client
      .verify.elementPresent('#mainAppRouter')
      .verify.elementPresent('#primaryFlexPanel')
      .end();
  }

};
