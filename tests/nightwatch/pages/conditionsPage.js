// category, value, unit, name, userId
// 'Weight', '60', 'kg', 'Jane Doe', '123456789',




module.exports = {
  url: 'http://localhost:3000/conditions',
  commands: [{

    verifyElements: function() {
      return this
        .waitForElementPresent('#conditionsPage', 10000)
        .verify.elementPresent('#conditionsTable');
    },
    verifyEmptyList: function() {
      return this
        .verify.elementNotPresent('#conditionsTable .conditionRow:nth-child(1)');
    },
    verifyConditionListCard: function() {
      return this
        .verify.elementPresent('#conditionsTable')
        .verify.elementPresent('#conditionsTable .conditionRow:nth-child(1)')
        .verify.elementPresent('#conditionsTable .conditionRow:nth-child(1) .clinicalStatus')
        .verify.elementPresent('#conditionsTable .conditionRow:nth-child(1) .snomedCode')
        .verify.elementPresent('#conditionsTable .conditionRow:nth-child(1) .snomedDisplay');
    },
    selectNewConditionTab: function() {
      return this
        .verify.elementPresent('#conditionsPageTabs')
        .verify.elementPresent('#newConditionTab');
    },
    verifyNewConditionCard: function() {
      return this
        .verify.elementPresent('#newCondition')
        .verify.elementPresent('#newCondition input[name="patientDisplay"]')
        .verify.elementPresent('#newCondition input[name="asserterDisplay"]')
        .verify.elementPresent('#newCondition input[name="clinicalStatus"]')
        .verify.elementPresent('#newCondition input[name="snomedCode"]')
        .verify.elementPresent('#newCondition input[name="snomedDisplay"]');
    },
    verifyConditionDetails: function(patientDisplay, asserterDisplay, clinicalStatus, snomedCode, snomedDisplay, evidenceDisplay) {
      this
        .waitForElementPresent('#conditionDetails', 5000);

      if (patientDisplay) {
        this.verify.attributeEquals('#conditionsPage .conditionDetail  input[name="patientDisplay"]', 'value', patientDisplay);
      }
      if (asserterDisplay) {
        this.verify.attributeEquals('#conditionsPage .conditionDetail  input[name="asserterDisplay"]', 'value', asserterDisplay);
      }
      if (clinicalStatus) {
        this.verify.attributeEquals('#conditionsPage .conditionDetail  input[name="clinicalStatus"]', 'value', clinicalStatus);
      }
      if (snomedCode) {
        this.verify.attributeEquals('#conditionsPage .conditionDetail  input[name="snomedCode"]', 'value', snomedCode);
      }
      if (snomedDisplay) {
        this.verify.attributeEquals('#conditionsPage .conditionDetail  input[name="snomedDisplay"]', 'value', snomedDisplay);
      }
      // if (evidenceDisplay) {
      //   this.verify.attributeEquals('#conditionsPage .conditionDetail  input[name="evidenceDisplay"]', 'value', evidenceDisplay);
      // }
      return this;
    },
    listContainsCondition: function (index, patientDisplay, asserterDisplay, clinicalStatus, snomedCode, snomedDisplay, evidenceDisplay){
      this
        .verify.elementPresent('#conditionsTable')
        .verify.elementPresent('#conditionsTable .conditionRow:nth-child(' + index + ')')
        // .verify.elementPresent('#conditionsTable .conditionRow:nth-child(' + index + ') .patientDisplay')
        // .verify.elementPresent('#conditionsTable .conditionRow:nth-child(' + index + ') .asserterDisplay')
        .verify.elementPresent('#conditionsTable .conditionRow:nth-child(' + index + ') .clinicalStatus')
        .verify.elementPresent('#conditionsTable .conditionRow:nth-child(' + index + ') .snomedCode')
        .verify.elementPresent('#conditionsTable .conditionRow:nth-child(' + index + ') .snomedDisplay')
        // .verify.elementPresent('#conditionsTable .conditionRow:nth-child(' + index + ') .evidenceDisplay');

      // if (patientDisplay) {
      //   this.verify.containsText('#conditionsTable .conditionRow:nth-child(' + index + ') .patientDisplay', patientDisplay);
      // }
      // if (asserterDisplay) {
      //   this.verify.containsText('#conditionsTable .conditionRow:nth-child(' + index + ') .asserterDisplay', asserterDisplay);
      // }
      if (clinicalStatus) {
        this.verify.containsText('#conditionsTable .conditionRow:nth-child(' + index + ') .clinicalStatus', clinicalStatus);
      }
      if (snomedCode) {
        this.verify.containsText('#conditionsTable .conditionRow:nth-child(' + index + ') .snomedCode', snomedCode);
      }
      if (snomedDisplay) {
        this.verify.containsText('#conditionsTable .conditionRow:nth-child(' + index + ') .snomedDisplay', snomedDisplay);
      }
      // if (evidenceDisplay) {
      //   this.verify.containsText('#conditionsTable .conditionRow:nth-child(' + index + ') .evidenceDisplay', evidenceDisplay);
      // }
      return this;
    },
    selectListTab: function(){
      return this.click('#conditionListTab');
    },
    displayListCard: function(){
      return this.click('#conditionListTab');
    },
    displayNewConditionCard: function(){
      return this.click('#newConditionTab');
    },
    displayConditionDetails: function(){
      return this.click('#conditionDetailsTab');
    },
    selectCondition: function(index){
      return this.click('#conditionsTable .conditionRow:nth-child(' + index + ')');
    },
    upsertCondition: function(patientDisplay, asserterDisplay, clinicalStatus, snomedCode, snomedDisplay, evidenceDisplay, pageElement) {
      if (patientDisplay) {
        var patientDisplayArray = patientDisplay.split('');
        for (var i = 0; i < patientDisplayArray.length; i++) {
          this.setValue(pageElement + ' input[name="patientDisplay"]', patientDisplayArray[i]);
        }
      }
      if (asserterDisplay) {
        var asserterDisplayArray = asserterDisplay.split('');
        for (var k = 0; k < asserterDisplayArray.length; k++) {
          this.setValue(pageElement + ' input[name="asserterDisplay"]', asserterDisplayArray[k]);
        }
      }
      if (clinicalStatus) {
        var clinicalStatusArray = clinicalStatus.split('');
        for (var j = 0; j < clinicalStatusArray.length; j++) {
          this.setValue(pageElement + ' input[name="clinicalStatus"]', clinicalStatusArray[j]);
        }
      }
      if (snomedCode) {
        var snomedCodeArray = snomedCode.split('');
        for (var l = 0; l < snomedCodeArray.length; l++) {
          this.setValue(pageElement + ' input[name="snomedCode"]', snomedCodeArray[l]);
        }
      }
      if (snomedDisplay) {
        var snomedDisplayArray = snomedDisplay.split('');
        for (var l = 0; l < snomedDisplayArray.length; l++) {
          this.setValue(pageElement + ' input[name="snomedDisplay"]', snomedDisplayArray[l]);
        }
      }
      // if (evidenceDisplay) {
      //   var evidenceDisplayArray = evidenceDisplay.split('');
      //   for (var l = 0; l < evidenceDisplayArray.length; l++) {
      //     this.setValue(pageElement + ' input[name="evidenceDisplay"]', evidenceDisplayArray[l]);
      //   }
      // }

      return this;
    },
    saveCondition: function(){
      return this.verify.elementPresent('#saveConditionButton').click('#saveConditionButton');
    }
  }],
  elements: {}
};
