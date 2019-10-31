module.exports = {
  url: 'http://localhost:3000/practitioners',
  commands: [{

    verifyElements: function() {
      return this
        .verify.elementPresent('#practitionersPage')
        .verify.elementPresent('#practitionersTable');
    },
    verifyEmptyList: function() {
      return this
        .verify.elementNotPresent('#practitionersTable .practitionerRow:nth-child(1)');
    },
    verifyPractitionerListCard: function() {
      return this
        .verify.elementPresent('#practitionersTable')
        .verify.elementPresent('#practitionersTable .practitionerRow:nth-child(1)')
        .verify.elementPresent('#practitionersTable .practitionerRow:nth-child(1) .name');
    },
    selectNewPractitionerTab: function() {
      return this
        .verify.elementPresent('#practitionersPageTabs')
        .verify.elementPresent('#practitionersPageTabs .newPractitionerTab')
        .click("#practitionersPageTabs .newPractitionerTab");
    },
    verifyNewPractitionerCard: function() {
      return this
        .verify.elementPresent('#practitionersPage .practitionerDetail')
        .verify.elementPresent('#practitionersPage .practitionerDetail input[name="name"]')
        .verify.elementPresent('#practitionersPage .practitionerDetail input[name="email"]')
        .verify.elementPresent('#practitionersPage .practitionerDetail input[name="phone"]')
        .verify.elementPresent('#practitionersPage .practitionerDetail input[name="qualificationIssuer"]')
        .verify.elementPresent('#practitionersPage .practitionerDetail input[name="qualificationCode"]')
        .verify.elementPresent('#practitionersPage .practitionerDetail input[name="qualificationStart"]')
        .verify.elementPresent('#practitionersPage .practitionerDetail input[name="qualificationEnd"]');
    },
    verifyPractitionerDetails: function(name, email, phone, qualificationIssuer, qualificationCode) {
      this
        .waitForElementPresent('#practitionerDetails', 5000)
        .waitForElementPresent('#practitionerDetails input[name="name"]', 5000);

      if (name) {
        this.verify.attributeEquals('#practitionersPage .practitionerDetail  input[name="name"]', 'value', name);
      }
      if (email) {
        this.verify.attributeEquals('#practitionersPage .practitionerDetail  input[name="email"]', 'value', email);
      }
      if (phone) {
        this.verify.attributeEquals('#practitionersPage .practitionerDetail  input[name="phone"]', 'value', phone);
      }
      if (qualificationIssuer) {
        this.verify.attributeEquals('#practitionersPage .practitionerDetail  input[name="qualificationIssuer"]', 'value', qualificationIssuer);
      }
      if (qualificationCode) {
        this.verify.attributeEquals('#practitionersPage .practitionerDetail  input[name="qualificationCode"]', 'value', qualificationCode);
      }
      return this;
    },
    listContainsPractitioner: function (index, name) {
      this
        .verify.elementPresent('#practitionersTable')
        .verify.elementPresent('#practitionersTable .practitionerRow:nth-child(' + index + ')')
        .verify.elementPresent('#practitionersTable .practitionerRow:nth-child(' + index + ') .name');

      if (name) {
        this.verify.containsText('#practitionersTable .practitionerRow:nth-child(' + index + ') .name', name);
      }
      return this;
    },
    selectListTab: function(){
      return this.click('#practitionersPage .practitionerListTab');
    },
    displayListCard: function(){
      return this.click('#practitionersPage .practitionerListTab');
    },
    displayNewPractitionerCard: function(){
      return this.click('#practitionersPage .newPractitionerTab');
    },
    displayPractitionerDetails: function(){
      return this.click('#practitionersPage .practitionerDetailsTab');
    },
    selectPractitioner: function(index){
      return this.click('#practitionersTable .practitionerRow:nth-child(' + index + ')');
    },
    upsertPractitioner: function(name, email, phone, qualificationIssuer, qualificationCode, pageElement) {
      if (name) {
        var nameArray = name.split('');
        for (var i = 0; i < nameArray.length; i++) {
          this.setValue(pageElement + ' input[name="name"]', nameArray[i]);
        }
      }
      if (email) {
        var emailArray = email.split('');
        for (var l = 0; l < emailArray.length; l++) {
          this.setValue(pageElement + ' input[name="email"]', emailArray[l]);
        }
      }
      if (phone) {
        var phoneArray = phone.split('');
        for (var m = 0; m < phoneArray.length; m++) {
          this.setValue(pageElement + ' input[name="phone"]', phoneArray[m]);
        }
      }
      if (qualificationIssuer) {
        var qualificationIssuerArray = qualificationIssuer.split('');
        for (var j = 0; j < qualificationIssuerArray.length; j++) {
          this.setValue(pageElement + ' input[name="qualificationIssuer"]', qualificationIssuerArray[j]);
        }
      }
      if (qualificationCode) {
        var qualificationCodeArray = qualificationCode.split('');
        for (var k = 0; k < qualificationCodeArray.length; k++) {
          this.setValue(pageElement + ' input[name="qualificationCode"]', qualificationCodeArray[k]);
        }
      }
      return this;
    },
    savePractitioner: function(){
      return this.verify.elementPresent('#savePractitionerButton').click('#savePractitionerButton');
    }
  }],
  elements: {}
};
