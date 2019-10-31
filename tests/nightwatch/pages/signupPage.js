let port = 3000;
if(process.env.PORT){
  port = process.env.PORT;
}

module.exports = {
  url: 'http://localhost:' + port + '/signup',
  commands: [{
    fillOutSignupPage: function(givenName, familyName, emailAddress, password, accessCode, client) {
      this
        .verify.elementPresent("#signupPage")
        .verify.elementPresent('input[name="givenName"]')
        .verify.elementPresent('input[name="familyName"]')
        .verify.elementPresent('input[name="emailAddress"]')
        .verify.elementPresent('input[name="password"]')
        .verify.elementPresent('input[name="accessCode"]')

        .clearValue('input[name="givenName"]')
        .clearValue('input[name="familyName"]')
        .clearValue('input[name="emailAddress"]')
        .clearValue('input[name="password"]')
        .clearValue('input[name="accessCode"]')

        .setValue('input[name="givenName"]', givenName)
        .setValue('input[name="familyName"]', familyName)
        .setValue('input[name="emailAddress"]', emailAddress)
        .setValue('input[name="password"]', password);

      if (accessCode) {
        this.setValue('input[name="accessCode"]', accessCode);
      }
      return this;
    },
    signup: function(){
      return this
        .verify.elementPresent('#signupButton')
        .click('#signupButton');
    },
    clear: function() {
      return this
        .clearValue('input[name="givenName"]')
        .clearValue('input[name="familyName"]')
        .clearValue('input[name="emailAddress"]')
        .clearValue('input[name="password"]');
    },
    // refactor to
    verifyElements: function() {
      return this
        .verify.elementPresent('#addPostCard textarea')
        .verify.elementPresent('#weblogPage')
        .verify.elementPresent('#addPostCard')
        .verify.elementPresent('#addPostButton');
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
