module.exports = {
  url: 'http://localhost:3000/organizations',
  commands: [{

    verifyElements: function() {
      return this
        .verify.elementPresent('#organizationsPage')
        .verify.elementPresent('#organizationsTable');
    },
    verifyEmptyList: function() {
      return this
        .verify.elementNotPresent('#organizationsTable .organizationRow:nth-child(1)');
    },
    verifyOrganizationListCard: function() {
      return this
        .verify.elementPresent('#organizationsTable')
        .verify.elementPresent('#organizationsTable .organizationRow:nth-child(1)')
        .verify.elementPresent('#organizationsTable .organizationRow:nth-child(1) .name');
    },
    selectNewOrganizationTab: function() {
      return this
        .verify.elementPresent('#organizationsPageTabs')
        .verify.elementPresent('#organizationsPageTabs .newOrganizationTab')
        .click("#organizationsPageTabs .newOrganizationTab");
    },
    verifyNewOrganizationCard: function() {
      return this
        .verify.elementPresent('#organizationsPage .organizationDetail')
        .verify.elementPresent('#organizationsPage .organizationDetail input[name="name"]')
        .verify.elementPresent('#organizationsPage .organizationDetail input[name="phone"]')
        .verify.elementPresent('#organizationsPage .organizationDetail input[name="email"]')
        .verify.elementPresent('#organizationsPage .organizationDetail input[name="identifier"]')
    },
    verifyOrganizationDetails: function(name, phone, email, identifier) {
      this
        .waitForElementPresent('#organizationDetails', 5000)
        .waitForElementPresent('#organizationDetails input[name="name"]', 5000);

      if (name) {
        this.verify.attributeEquals('#organizationsPage .organizationDetail  input[name="name"]', 'value', name);
      }
      if (phone) {
        this.verify.attributeEquals('#organizationsPage .organizationDetail  input[name="phone"]', 'value', phone);
      }
      if (email) {
        this.verify.attributeEquals('#organizationsPage .organizationDetail  input[name="email"]', 'value', email);
      }
      if (identifier) {
        this.verify.attributeEquals('#organizationsPage .organizationDetail  input[name="identifier"]', 'value', identifier);
      }
      return this;
    },
    listContainsOrganization: function (index, name) {
      this
        .verify.elementPresent('#organizationsTable')
        .verify.elementPresent('#organizationsTable .organizationRow:nth-child(' + index + ')')
        .verify.elementPresent('#organizationsTable .organizationRow:nth-child(' + index + ') .name');

      if (name) {
        this.verify.containsText('#organizationsTable .organizationRow:nth-child(' + index + ') .name', name);
      }
      return this;
    },
    selectListTab: function(){
      return this.click('#organizationsPage .organizationListTab');
    },
    displayListCard: function(){
      return this.click('#organizationsPage .organizationListTab');
    },
    displayNewOrganizationCard: function(){
      return this.click('#organizationsPage .newOrganizationTab');
    },
    displayOrganizationDetails: function(){
      return this.click('#organizationsPage .organizationDetailsTab');
    },
    selectOrganization: function(index){
      return this.click('#organizationsTable .organizationRow:nth-child(' + index + ')');
    },
    upsertOrganization: function(name, phone, email, identifier, pageElement) {
      if (name) {
        var nameArray = name.split('');
        for (var i = 0; i < nameArray.length; i++) {
          this.setValue(pageElement + ' input[name="name"]', nameArray[i]);
        }
          // this.setValue(pageElement + ' input[name="name"]', name);
      }
      if (phone) {
        // var phoneArray = phone.split('');
        // for (var l = 0; l < phoneArray.length; l++) {
        //   this.setValue(pageElement + ' input[name="phone"]', phoneArray[l]);
        // }
          this.setValue(pageElement + ' input[name="phone"]', phone);
      }
      if (email) {
        // var emailArray = email.split('');
        // for (var m = 0; m < emailArray.length; m++) {
        //   this.setValue(pageElement + ' input[name="email"]', emailArray[m]);
        // }
          this.setValue(pageElement + ' input[name="email"]', email);
      }
      if (identifier) {
        // var identifierArray = identifier.split('');
        // for (var j = 0; j < identifierArray.length; j++) {
        //   this.setValue(pageElement + ' input[name="identifier"]', identifierArray[j]);
        // }
          this.setValue(pageElement + ' input[name="identifier"]', identifier);
      }
      return this;
    },
    saveOrganization: function(){
      return this.verify.elementPresent('#saveOrganizationButton').click('#saveOrganizationButton');
    }
  }],
  elements: {}
};
