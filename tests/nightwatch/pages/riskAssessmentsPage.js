// category, value, unit, name, userId
// 'Weight', '60', 'kg', 'Jane Doe', '123456789',


module.exports = {
  url: 'http://localhost:3000/riskAssessments',
  commands: [{

    verifyElements: function() {
      return this
        .waitForElementPresent('#riskAssessmentsPage', 10000)
        .verify.elementPresent('#riskAssessmentsTable');
    },
    verifyEmptyList: function() {
      return this
        .verify.elementNotPresent('#riskAssessmentsTable .riskAssessmentRow:nth-child(1)');
    },
    verifyRiskAssessmentListCard: function() {
      return this
        .verify.elementPresent('#riskAssessmentsTable')
        .verify.elementPresent('#riskAssessmentsTable .riskAssessmentRow:nth-child(1)')
        .verify.elementPresent('#riskAssessmentsTable .riskAssessmentRow:nth-child(1) .subjectDisplay')
        .verify.elementPresent('#riskAssessmentsTable .riskAssessmentRow:nth-child(1) .conditionDisplay')
        .verify.elementPresent('#riskAssessmentsTable .riskAssessmentRow:nth-child(1) .performerDisplay')
        .verify.elementPresent('#riskAssessmentsTable .riskAssessmentRow:nth-child(1) .predictionOutcome')
        .verify.elementPresent('#riskAssessmentsTable .riskAssessmentRow:nth-child(1) .probabilityDecimal');
    },
    selectNewRiskAssessmentTab: function() {
      return this
        .verify.elementPresent('#riskAssessmentsPageTabs')
        .verify.elementPresent('#riskAssessmentsPageTabs .newRiskAssessmentTab')
        .click("#riskAssessmentsPageTabs .newRiskAssessmentTab");
    },
    verifyNewRiskAssessmentCard: function() {
      return this
        .verify.elementPresent('#riskAssessmentsPage .riskAssessmentDetail')
        .verify.elementPresent('#riskAssessmentsPage .riskAssessmentDetail input[name="subjectDisplay"]')
        .verify.elementPresent('#riskAssessmentsPage .riskAssessmentDetail input[name="conditionDisplay"]')
        .verify.elementPresent('#riskAssessmentsPage .riskAssessmentDetail input[name="performerDisplay"]')
        .verify.elementPresent('#riskAssessmentsPage .riskAssessmentDetail input[name="predictionOutcome"]')
        .verify.elementPresent('#riskAssessmentsPage .riskAssessmentDetail input[name="probabilityDecimal"]');
    },
    verifyRiskAssessmentDetails: function(subjectDisplay, conditionDisplay, performerDisplay, predictionOutcome, probabilityDecimal) {
      this
        .waitForElementPresent('#riskAssessmentDetails', 5000);

      if (subjectDisplay) {
        this.verify.attributeEquals('#riskAssessmentsPage .riskAssessmentDetail  input[name="subjectDisplay"]', 'value', subjectDisplay);
      }
      if (conditionDisplay) {
        this.verify.attributeEquals('#riskAssessmentsPage .riskAssessmentDetail  input[name="conditionDisplay"]', 'value', conditionDisplay);
      }
      if (performerDisplay) {
        this.verify.attributeEquals('#riskAssessmentsPage .riskAssessmentDetail  input[name="performerDisplay"]', 'value', performerDisplay);
      }
      if (predictionOutcome) {
        this.verify.attributeEquals('#riskAssessmentsPage .riskAssessmentDetail  input[name="predictionOutcome"]', 'value', predictionOutcome);
      }
      if (probabilityDecimal) {
        this.verify.attributeEquals('#riskAssessmentsPage .riskAssessmentDetail  input[name="probabilityDecimal"]', 'value', probabilityDecimal);
      }
      return this;
    },
    listContainsRiskAssessment: function (index, subjectDisplay, conditionDisplay, performerDisplay, predictionOutcome, probabilityDecimal){
      this
        .verify.elementPresent('#riskAssessmentsTable')
        .verify.elementPresent('#riskAssessmentsTable .riskAssessmentRow:nth-child(' + index + ')')
        .verify.elementPresent('#riskAssessmentsTable .riskAssessmentRow:nth-child(' + index + ') .subjectDisplay')
        .verify.elementPresent('#riskAssessmentsTable .riskAssessmentRow:nth-child(' + index + ') .conditionDisplay')
        .verify.elementPresent('#riskAssessmentsTable .riskAssessmentRow:nth-child(' + index + ') .performerDisplay')
        .verify.elementPresent('#riskAssessmentsTable .riskAssessmentRow:nth-child(' + index + ') .predictionOutcome')
        .verify.elementPresent('#riskAssessmentsTable .riskAssessmentRow:nth-child(' + index + ') .probabilityDecimal');

      if (subjectDisplay) {
        this.verify.containsText('#riskAssessmentsTable .riskAssessmentRow:nth-child(' + index + ') .subjectDisplay', subjectDisplay);
      }
      if (conditionDisplay) {
        this.verify.containsText('#riskAssessmentsTable .riskAssessmentRow:nth-child(' + index + ') .conditionDisplay', conditionDisplay);
      }
      if (performerDisplay) {
        this.verify.containsText('#riskAssessmentsTable .riskAssessmentRow:nth-child(' + index + ') .performerDisplay', performerDisplay);
      }
      if (predictionOutcome) {
        this.verify.containsText('#riskAssessmentsTable .riskAssessmentRow:nth-child(' + index + ') .predictionOutcome', predictionOutcome);
      }
      if (probabilityDecimal) {
        this.verify.containsText('#riskAssessmentsTable .riskAssessmentRow:nth-child(' + index + ') .probabilityDecimal', probabilityDecimal);
      }
      return this;
    },
    selectListTab: function(){
      return this.click('#riskAssessmentsPage .riskAssessmentListTab');
    },
    displayListCard: function(){
      return this.click('#riskAssessmentsPage .riskAssessmentListTab');
    },
    displayNewRiskAssessmentCard: function(){
      return this.click('#riskAssessmentsPage .newRiskAssessmentTab');
    },
    displayRiskAssessmentDetails: function(){
      return this.click('#riskAssessmentsPage .riskAssessmentDetailsTab');
    },
    selectRiskAssessment: function(index){
      return this.click('#riskAssessmentsTable .riskAssessmentRow:nth-child(' + index + ')');
    },
    upsertRiskAssessment: function(subjectDisplay, conditionDisplay, performerDisplay, predictionOutcome, probabilityDecimal, pageElement) {
      if (subjectDisplay) {
        var subjectDisplayArray = subjectDisplay.split('');
        for (var i = 0; i < subjectDisplayArray.length; i++) {
          this.setValue(pageElement + ' input[name="subjectDisplay"]', subjectDisplayArray[i]);
        }
      }
      if (conditionDisplay) {
        var conditionDisplayArray = conditionDisplay.split('');
        for (var k = 0; k < conditionDisplayArray.length; k++) {
          this.setValue(pageElement + ' input[name="conditionDisplay"]', conditionDisplayArray[k]);
        }
      }
      if (performerDisplay) {
        var performerDisplayArray = performerDisplay.split('');
        for (var j = 0; j < performerDisplayArray.length; j++) {
          this.setValue(pageElement + ' input[name="performerDisplay"]', performerDisplayArray[j]);
        }
      }
      if (predictionOutcome) {
        var predictionOutcomeArray = predictionOutcome.split('');
        for (var l = 0; l < predictionOutcomeArray.length; l++) {
          this.setValue(pageElement + ' input[name="predictionOutcome"]', predictionOutcomeArray[l]);
        }
      }
      if (probabilityDecimal) {
        var probabilityDecimalArray = probabilityDecimal.split('');
        for (var m = 0; m < probabilityDecimalArray.length; m++) {
          this.setValue(pageElement + ' input[name="probabilityDecimal"]', probabilityDecimalArray[m]);
        }
      }

      return this;
    },
    saveRiskAssessment: function(){
      return this.verify.elementPresent('#saveRiskAssessmentButton').click('#saveRiskAssessmentButton');
    }
  }],
  elements: {}
};
