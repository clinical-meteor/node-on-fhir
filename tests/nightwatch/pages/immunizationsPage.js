// category, value, unit, name, userId
// 'Weight', '60', 'kg', 'Jane Doe', '123456789',




module.exports = {
  url: 'http://localhost:3000/immunizations',
  commands: [{

    verifyElements: function() {
      return this
        .waitForElementPresent('#immunizationsPage', 10000)
        .verify.elementPresent('#immunizationsTable');
    },
    verifyEmptyList: function() {
      return this
        .verify.elementNotPresent('#immunizationsTable .immunizationRow:nth-child(1)');
    },
    verifyImmunizationList: function() {
      return this
        .verify.elementPresent('#immunizationsTable')
        .verify.elementPresent('#immunizationsTable .immunizationRow:nth-child(1)')
        .verify.elementPresent('#immunizationsTable .immunizationRow:nth-child(1) .identifier')
        .verify.elementPresent('#immunizationsTable .immunizationRow:nth-child(1) .vaccineCode')
        .verify.elementPresent('#immunizationsTable .immunizationRow:nth-child(1) .status')
        .verify.elementPresent('#immunizationsTable .immunizationRow:nth-child(1) .patient')
        .verify.elementPresent('#immunizationsTable .immunizationRow:nth-child(1) .performer')
    },
    selectNewImmunizationTab: function() {
      return this
        .verify.elementPresent('#immunizationsPageTabs')
        .verify.elementPresent('#immunizationsPageTabs .newImmunizationTab')
        .click("#immunizationsPageTabs .newImmunizationTab");
    },
    verifyNewImmunizationCard: function() {
      return this
        .verify.elementPresent('#immunizationsPage .immunizationDetail')
        .verify.elementPresent('#immunizationsPage .immunizationDetail input[name="identifier"]')
        .verify.elementPresent('#immunizationsPage .immunizationDetail input[name="vaccineCode"]')
        .verify.elementPresent('#immunizationsPage .immunizationDetail input[name="status"]')
        .verify.elementPresent('#immunizationsPage .immunizationDetail input[name="patientDisplay"]')
        .verify.elementPresent('#immunizationsPage .immunizationDetail input[name="performerDisplay"]')
    },
    verifyImmunizationDetails: function(identifier, vaccineCode, status, patient, performer) {
      this
        .waitForElementPresent('#immunizationDetails', 5000);

      if (identifier) {
        this.verify.attributeEquals('#immunizationsPage .immunizationDetail  input[name="identifier"]', 'value', identifier);
      }
      if (vaccineCode) {
        this.verify.attributeEquals('#immunizationsPage .immunizationDetail  input[name="vaccineCode"]', 'value', vaccineCode);
      }

      if (status) {
        this.verify.attributeEquals('#immunizationsPage .immunizationDetail  input[name="status"]', 'value', status);
      }
      if (patient) {
        this.verify.attributeEquals('#immunizationsPage .immunizationDetail  input[name="patientDisplay"]', 'value', patient);
      }
      if (performer) {
        this.verify.attributeEquals('#immunizationsPage .immunizationDetail  input[name="performerDisplay"]', 'value', performer);
      }
      return this;
    },
    listContainsImmunization: function (index, identifier, vaccineCode, status, patient, performer){
      this
        .verify.elementPresent('#immunizationsTable')
        .verify.elementPresent('#immunizationsTable .immunizationRow:nth-child(' + index + ')')
        .verify.elementPresent('#immunizationsTable .immunizationRow:nth-child(' + index + ') .identifier')
        .verify.elementPresent('#immunizationsTable .immunizationRow:nth-child(' + index + ') .vaccineCode')
        .verify.elementPresent('#immunizationsTable .immunizationRow:nth-child(' + index + ') .status')
        .verify.elementPresent('#immunizationsTable .immunizationRow:nth-child(' + index + ') .patient')
        .verify.elementPresent('#immunizationsTable .immunizationRow:nth-child(' + index + ') .performer')

      if (identifier) {
        this.verify.containsText('#immunizationsTable .immunizationRow:nth-child(' + index + ') .identifier', identifier);
      }
      if (vaccineCode) {
        this.verify.containsText('#immunizationsTable .immunizationRow:nth-child(' + index + ') .vaccineCode', vaccineCode);
      }
      if (status) {
        this.verify.containsText('#immunizationsTable .immunizationRow:nth-child(' + index + ') .status', status);
      }
      if (patient) {
        this.verify.containsText('#immunizationsTable .immunizationRow:nth-child(' + index + ') .patient', patient);
      }
      if (performer) {
        this.verify.containsText('#immunizationsTable .immunizationRow:nth-child(' + index + ') .performer', performer);
      }
      return this;
    },
    selectListTab: function(){
      return this.click('#immunizationsPage .immunizationListTab');
    },
    displayListCard: function(){
      return this.click('#immunizationsPage .immunizationListTab');
    },
    displayNewImmunizationCard: function(){
      return this.click('#immunizationsPage .newImmunizationTab');
    },
    displayImmunizationDetails: function(){
      return this.click('#immunizationsPage .immunizationDetailsTab');
    },
    selectImmunization: function(index){
      return this.click('#immunizationsTable .immunizationRow:nth-child(' + index + ')');
    },
    upsertImmunization: function(identifier, vaccineCode, status, patient, performer, pageElement) {
      if (identifier) {
        var identifierArray = identifier.split('');
        for (var i = 0; i < identifierArray.length; i++) {
          this.setValue(pageElement + ' input[name="identifier"]', identifierArray[i]);
        }
      }
      if (vaccineCode) {
        var vaccineCodeArray = vaccineCode.split('');
        for (var j = 0; j < vaccineCodeArray.length; j++) {
          this.setValue(pageElement + ' input[name="vaccineCode"]', vaccineCodeArray[j]);
        }
      }
      if (status) {
        var statusArray = status.split('');
        for (var k = 0; k < statusArray.length; k++) {
          this.setValue(pageElement + ' input[name="status"]', statusArray[k]);
        }
      }
      if (patient) {
        var patientArray = patient.split('');
        for (var k = 0; k < patientArray.length; k++) {
          this.setValue(pageElement + ' input[name="patientDisplay"]', patientArray[k]);
        }
      }
      if (performer) {
        var performerArray = performer.split('');
        for (var k = 0; k < performerArray.length; k++) {
          this.setValue(pageElement + ' input[name="performerDisplay"]', performerArray[k]);
        }
      }

      return this;
    },
    saveImmunization: function(){
      return this.verify.elementPresent('#saveImmunizationButton').click('#saveImmunizationButton');
    }
  }],
  elements: {}
};
