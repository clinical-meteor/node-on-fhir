
let port = 3000;
if(process.env.PORT){
  port = process.env.PORT;
}

module.exports = {
  url: 'http://localhost:' + port + '/signin',
  commands: [{
  fillOutSigninPage: function(email, password) {
    return this
      .verify.elementPresent("#signinPage")
      .verify.elementPresent('input[name="emailAddress"]')
      .verify.elementPresent('input[name="password"]')

      .clearValue('input[name="emailAddress"]')
      .clearValue('input[name="password"]')

      .setValue('input[name="emailAddress"]', email)
      .setValue('input[name="password"]', password);
  },
  signin: function(){
    return this
      .waitForElementPresent('#signinButton', 3000)
      .click("#signinButton");
  },
  clear: function() {
    return this
      .waitForElementVisible('@emailInput')
      .clearValue('@emailInput')
      .clearValue('@passInput')
      .waitForElementVisible('@signinButton')
      .click('@signinButton')
  }
}],
  elements: {
    emailInput: {
      selector: 'input[type=text]'
    },
    passInput: {
      selector: 'input[name=password]'
    },
    signinButton: {
      selector: 'button[type=submit]'
    }
  }
};
