// category, value, unit, name, userId
// 'Weight', '60', 'kg', 'Jane Doe', '123456789',




module.exports = {
  url: 'http://localhost:3000/allergyIntolerances',
  commands: [{

    verifyElements: function() {
      return this
        .waitForElementPresent('#allergyIntolerancesPage', 10000)
        .verify.elementPresent('#allergyIntolerancesTable');
    },
    verifyEmptyList: function() {
      return this
        .verify.elementNotPresent('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(1)');
    },
    verifyAllergyIntolerancesListCard: function() {
      return this
        .verify.elementPresent('#allergyIntolerancesTable')
        .verify.elementPresent('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(1)')
        .verify.elementPresent('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(1) .identifier')
        .verify.elementPresent('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(1) .verificationStatus')
        .verify.elementPresent('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(1) .clinicalStatus')
        .verify.elementPresent('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(1) .type')
        .verify.elementPresent('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(1) .category');
        // .verify.elementPresent('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(1) .patientDisplay');
    },
    selectNewAllergyIntoleranceTab: function() {
      return this
        .verify.elementPresent('#allergyIntolerancesPageTabs')
        .verify.elementPresent('#allergyIntolerancesPageTabs .newAllergyIntoleranceTab')
        .click("#allergyIntolerancesPageTabs .newAllergyIntoleranceTab");
    },
    verifyNewAllergyIntoleranceCard: function() {
      return this
        .verify.elementPresent('#allergyIntolerancesPage .allergyIntoleranceDetail')
        .verify.elementPresent('#allergyIntolerancesPage .allergyIntoleranceDetail input[name="identifier"]')
        .verify.elementPresent('#allergyIntolerancesPage .allergyIntoleranceDetail #clinicalStatusInput')
        .verify.elementPresent('#allergyIntolerancesPage .allergyIntoleranceDetail #verificationStatusInput')
        .verify.elementPresent('#allergyIntolerancesPage .allergyIntoleranceDetail #typeInput')
        .verify.elementPresent('#allergyIntolerancesPage .allergyIntoleranceDetail #categoryInput')
        .verify.elementPresent('#allergyIntolerancesPage .allergyIntoleranceDetail input[name="patientDisplay"]')
        .verify.elementPresent('#allergyIntolerancesPage .allergyIntoleranceDetail input[name="recorderDisplay"]')
        .verify.elementPresent('#allergyIntolerancesPage .allergyIntoleranceDetail #criticalityInput');
    },
    verifyAllergyIntoleranceDetails: function(identifier, verificationStatus, clinicalStatus, type, category, reaction, patientDisplay) {
      this
        .waitForElementPresent('#allergyIntoleranceDetails', 5000);

      if (identifier) {
        this.verify.attributeEquals('#allergyIntolerancesPage .allergyIntoleranceDetail  input[name="identifier"]', 'value', identifier);
      }
      // if (verificationStatus) {
      //   this.verify.attributeEquals('#allergyIntolerancesPage .allergyIntoleranceDetail  input[name="verificationStatus"]', 'value', verificationStatus);
      // }
      // if (clinicalStatus) {
      //   this.verify.attributeEquals('#allergyIntolerancesPage .allergyIntoleranceDetail  input[name="clinicalStatus"]', 'value', clinicalStatus);
      // }
      // if (type) {
      //   this.verify.attributeEquals('#allergyIntolerancesPage .allergyIntoleranceDetail  input[name="type"]', 'value', type);
      // }
      // if (category) {
      //   this.verify.attributeEquals('#allergyIntolerancesPage .allergyIntoleranceDetail  input[name="category"]', 'value', category);
      // }
      if (reaction) {
        this.verify.attributeEquals('#allergyIntolerancesPage .allergyIntoleranceDetail  input[name="reaction"]', 'value', reaction);
      }
      if (patientDisplay) {
        this.verify.attributeEquals('#allergyIntolerancesPage .allergyIntoleranceDetail  input[name="patientDisplay"]', 'value', patientDisplay);
      }
      return this;
    },
    listContainsAllergyIntolerances: function (index, identifier, verificationStatus, clinicalStatus, type, category, reaction, patientDisplay){
      this
        .verify.elementPresent('#allergyIntolerancesTable')
        .verify.elementPresent('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(' + index + ')')
        .verify.elementPresent('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(' + index + ') .identifier')
        // .verify.elementPresent('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(' + index + ') .verificationStatus')
        // .verify.elementPresent('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(' + index + ') .clinicalStatus')
        // .verify.elementPresent('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(' + index + ') .type')
        // .verify.elementPresent('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(' + index + ') .category')
        .verify.elementPresent('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(' + index + ') .reaction')
        // .verify.elementPresent('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(' + index + ') .patientDisplay');

      if (identifier) {
        this.verify.containsText('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(' + index + ') .identifier', identifier);
      }
      // if (verificationStatus) {
      //   this.verify.containsText('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(' + index + ') .verificationStatus', verificationStatus);
      // }
      // if (clinicalStatus) {
      //   this.verify.containsText('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(' + index + ') .clinicalStatus', clinicalStatus);
      // }
      // if (type) {
      //   this.verify.containsText('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(' + index + ') .type', type);
      // }
      // if (category) {
      //   this.verify.containsText('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(' + index + ') .category', category);
      // }
      if (reaction) {
        this.verify.containsText('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(' + index + ') .reaction', reaction);
      }
      // if (patientDisplay) {
      //   this.verify.containsText('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(' + index + ') .patientDisplay', patientDisplay);
      // }
      return this;
    },
    selectListTab: function(){
      return this.click('#allergyIntolerancesPage .allergyIntoleranceListTab');
    },
    displayListCard: function(){
      return this.click('#allergyIntolerancesPage .allergyIntoleranceListTab');
    },
    displayNewAllergyIntolerancesCard: function(){
      return this.click('#allergyIntolerancesPage .newAllergyIntoleranceTab');
    },
    displayAllergyIntolerancesDetails: function(){
      return this.click('#allergyIntolerancesPage .allergyIntoleranceDetailsTab');
    },
    selectAllergyIntolerances: function(index){
      return this.click('#allergyIntolerancesTable .allergyIntoleranceRow:nth-child(' + index + ')');
    },
    upsertAllergyIntolerance: function(identifier, reaction, verificationStatus, clinicalStatus, type, category, patientDisplay, pageElement) {
      if (identifier) {
        var identifierArray = identifier.split('');
        for (var i = 0; i < identifierArray.length; i++) {
          this.setValue(pageElement + ' input[name="identifier"]', identifierArray[i]);
        }
      }
      // if (verificationStatus) {
      //   var verificationStatusArray = verificationStatus.split('');
      //   for (var k = 0; k < verificationStatusArray.length; k++) {
      //     this.setValue(pageElement + ' input[name="verificationStatus"]', verificationStatusArray[k]);
      //   }
      // }
      // if (clinicalStatus) {
      //   var clinicalStatusArray = clinicalStatus.split('');
      //   for (var j = 0; j < clinicalStatusArray.length; j++) {
      //     this.setValue(pageElement + ' input[name="clinicalStatus"]', clinicalStatusArray[j]);
      //   }
      // }
      // if (type) {
      //   var typeArray = type.split('');
      //   for (var l = 0; l < typeArray.length; l++) {
      //     this.setValue(pageElement + ' input[name="type"]', typeArray[l]);
      //   }
      // }
      // if (category) {
      //   var categoryArray = category.split('');
      //   for (var l = 0; l < categoryArray.length; l++) {
      //     this.setValue(pageElement + ' input[name="category"]', categoryArray[l]);
      //   }
      // }
      if (reaction) {
        var reactionArray = reaction.split('');
        for (var l = 0; l < reactionArray.length; l++) {
          this.setValue(pageElement + ' input[name="reaction"]', reactionArray[l]);
        }
      }
      if (patientDisplay) {
        var patientDisplayArray = patientDisplay.split('');
        for (var l = 0; l < patientDisplayArray.length; l++) {
          this.setValue(pageElement + ' input[name="patientDisplay"]', patientDisplayArray[l]);
        }
      }
      // if (recorderDisplay) {
      //   var recorderDisplayArray = recorderDisplay.split('');
      //   for (var l = 0; l < recorderDisplayArray.length; l++) {
      //     this.setValue(pageElement + ' input[name="recorderDisplay"]', recorderDisplayArray[l]);
      //   }
      // }

      return this;
    },
    saveAllergyIntolerances: function(){
      return this.verify.elementPresent('#saveAllergyIntolerancesButton').click('#saveAllergyIntolerancesButton');
    }
  }],
  elements: {}
};
