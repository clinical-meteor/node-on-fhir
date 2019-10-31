// category, value, unit, name, userId
// 'Weight', '60', 'kg', 'Jane Doe', '123456789',




module.exports = {
  url: 'http://localhost:3000/diagnosticReports',
  commands: [{

    verifyElements: function() {
      return this
        .waitForElementPresent('#diagnosticReportsPage', 10000)
        .verify.elementPresent('#diagnosticReportsTable');
    },
    verifyEmptyList: function() {
      return this
        .verify.elementNotPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(1)');
    },
    verifyDiagnosticReportListCard: function() {
      return this
        .verify.elementPresent('#diagnosticReportsTable')
        .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(1)')
        .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(1) .subjectDisplay')
        .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(1) .code')
        .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(1) .status')
        .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(1) .issued')
        .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(1) .performerDisplay')
        .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(1) .identifier')
        // .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(1) .effectiveDateTime')
        .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(1) .category');
      },
    selectNewDiagnosticReportTab: function() {
      return this
        .verify.elementPresent('#diagnosticReportsPageTabs')
        .verify.elementPresent('#diagnosticReportsPageTabs .newDiagnosticReportTab')
        .click("#diagnosticReportsPageTabs .newDiagnosticReportTab");
    },
    verifyNewDiagnosticReportCard: function() {
      return this
        .verify.elementPresent('#diagnosticReportsPage .diagnosticReportDetail')
        .verify.elementPresent('#diagnosticReportsPage .diagnosticReportDetail input[name="subjectDisplay"]')
        .verify.elementPresent('#diagnosticReportsPage .diagnosticReportDetail input[name="subjectReference"]')
        .verify.elementPresent('#diagnosticReportsPage .diagnosticReportDetail input[name="code"]')
        .verify.elementPresent('#diagnosticReportsPage .diagnosticReportDetail input[name="status"]')
        // .verify.elementPresent('#diagnosticReportsPage .diagnosticReportDetail input[name="issued"]')
        .verify.elementPresent('#diagnosticReportsPage .diagnosticReportDetail input[name="performerDisplay"]')
        .verify.elementPresent('#diagnosticReportsPage .diagnosticReportDetail input[name="performerReference"]')
        .verify.elementPresent('#diagnosticReportsPage .diagnosticReportDetail input[name="identifier"]')
        .verify.elementPresent('#diagnosticReportsPage .diagnosticReportDetail input[name="category"]')
        .verify.elementPresent('#diagnosticReportsPage .diagnosticReportDetail input[name="effectiveDate"]')
        .verify.elementPresent('#diagnosticReportsPage .diagnosticReportDetail textarea[name="conclusion"]');
      },
    verifyDiagnosticReportDetails: function(subjectDisplay, subjectReference, code, status, issued, performerDisplay, performerReference, identifier, category, effectiveDate, conclusion) {
      this
        .waitForElementPresent('#diagnosticReportDetails', 5000);

      if (subjectDisplay) {
        this.verify.attributeEquals('#diagnosticReportsPage .diagnosticReportDetail  input[name="subjectDisplay"]', 'value', subjectDisplay);
      }
      if (subjectReference) {
        this.verify.attributeEquals('#diagnosticReportsPage .diagnosticReportDetail  input[name="subjectReference"]', 'value', subjectReference);
      }
      if (code) {
        this.verify.attributeEquals('#diagnosticReportsPage .diagnosticReportDetail  input[name="code"]', 'value', code);
      }
      if (status) {
        this.verify.attributeEquals('#diagnosticReportsPage .diagnosticReportDetail  input[name="status"]', 'value', status);
      }
      // if (issued) {
      //   this.verify.attributeEquals('#diagnosticReportsPage .diagnosticReportDetail  input[name="issued"]', 'value', issued);
      // }
      if (performerDisplay) {
        this.verify.attributeEquals('#diagnosticReportsPage .diagnosticReportDetail  input[name="performerDisplay"]', 'value', performerDisplay);
      }
      if (performerReference) {
        this.verify.attributeEquals('#diagnosticReportsPage .diagnosticReportDetail  input[name="performerReference"]', 'value', performerReference);
      }
      if (identifier) {
        this.verify.attributeEquals('#diagnosticReportsPage .diagnosticReportDetail  input[name="identifier"]', 'value', identifier);
      }
      if (category) {
        this.verify.attributeEquals('#diagnosticReportsPage .diagnosticReportDetail  input[name="category"]', 'value', category);
      }
      // if (effectiveDate) {
      //   this.verify.attributeEquals('#diagnosticReportsPage .diagnosticReportDetail  input[name="effectiveDate"]', 'value', effectiveDate);
      // }
      if (conclusion) {
        this.verify.attributeEquals('#diagnosticReportsPage .diagnosticReportDetail  textarea[name="conclusion"]', 'value', conclusion);
      }
      return this;
    },
    listContainsDiagnosticReport: function (index, subjectDisplay, subjectReference, code, status, issued, performerDisplay, performerReference, identifier, category, effectiveDate, conclusion){
      this
        .verify.elementPresent('#diagnosticReportsTable')
        .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ')')
        .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .subjectDisplay')
        // .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .subjectReference')
        .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .code')
        .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .status')
        .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .issued')
        .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .performerDisplay')
        // .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .performerReference')
        .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .identifier')
        .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .category')
        // .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .effectiveDateTime');
        // .verify.elementPresent('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .conclusion');      

      if (subjectDisplay) {
        this.verify.containsText('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .subjectDisplay', subjectDisplay);
      }
      // if (subjectReference) {
      //   this.verify.containsText('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .subjectReference', subjectReference);
      // }
      if (code) {
        this.verify.containsText('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .code', code);
      }
      if (status) {
        this.verify.containsText('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .status', status);
      }
      // if (issued) {
      //   this.verify.containsText('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .issued', issued);
      // }
      if (performerDisplay) {
        this.verify.containsText('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .performerDisplay', performerDisplay);
      }
      // if (performerReference) {
      //   this.verify.containsText('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .performerReference', performerReference);
      // }
      if (identifier) {
        this.verify.containsText('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .identifier', identifier);
      }
      if (category) {
        this.verify.containsText('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .category', category);
      }
      // if (effectiveDate) {
      //   this.verify.containsText('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .effectiveDate', effectiveDate);
      // }
      // if (conclusion) {
      //   this.verify.containsText('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ') .conclusion', performerDisplay);
      // }
      return this;
    },
    selectListTab: function(){
      return this.click('#diagnosticReportsPage .diagnosticReportListTab');
    },
    displayListCard: function(){
      return this.click('#diagnosticReportsPage .diagnosticReportListTab');
    },
    displayNewDiagnosticReportCard: function(){
      return this.click('#diagnosticReportsPage .newDiagnosticReportTab');
    },
    displayDiagnosticReportDetails: function(){
      return this.click('#diagnosticReportsPage .diagnosticReportDetailsTab');
    },
    selectDiagnosticReport: function(index){
      return this.click('#diagnosticReportsTable .diagnosticReportRow:nth-child(' + index + ')');
    },    

    upsertDiagnosticReport: function(subjectDisplay, subjectReference, code, status, issued, performerDisplay, performerReference, identifier, category, effectiveDate, conclusion, pageElement, client) {
      if (subjectDisplay) {
        var subjectDisplayArray = subjectDisplay.split('');
        for (var i = 0; i < subjectDisplayArray.length; i++) {
          this.setValue(pageElement + ' input[name="subjectDisplay"]', subjectDisplayArray[i]);
        }
      }
      if (subjectReference) {
        var subjectReferenceArray = subjectReference.split('');
        for (var k = 0; k < subjectReferenceArray.length; k++) {
          this.setValue(pageElement + ' input[name="subjectReference"]', subjectReferenceArray[k]);
        }
      }
      if (code) {
        var codeArray = code.split('');
        for (var j = 0; j < codeArray.length; j++) {
          this.setValue(pageElement + ' input[name="code"]', codeArray[j]);
        }
      }
      if (status) {
        var statusArray = status.split('');
        for (var l = 0; l < statusArray.length; l++) {
          client.pause(200);
          this.setValue(pageElement + ' input[name="status"]', statusArray[l]);
        }
      }
      // if (issued) {
      //   var issuedArray = issued.split('');
      //   for (var l = 0; l < issuedArray.length; l++) {
      //     this.setValue(pageElement + ' input[name="issued"]', issuedArray[l]);
      //   }
      // }
      if (performerDisplay) {
        var performerDisplayArray = performerDisplay.split('');
        for (var l = 0; l < performerDisplayArray.length; l++) {
          this.setValue(pageElement + ' input[name="performerDisplay"]', performerDisplayArray[l]);
        }
      }


      if (performerReference) {
        var performerReferenceArray = performerReference.split('');
        for (var l = 0; l < performerReferenceArray.length; l++) {
          this.setValue(pageElement + ' input[name="performerReference"]', performerReferenceArray[l]);
        }
      }
      if (identifier) {
        var identifierArray = identifier.split('');
        for (var l = 0; l < identifierArray.length; l++) {
          this.setValue(pageElement + ' input[name="identifier"]', identifierArray[l]);
        }
      }
      if (category) {
        var categoryArray = category.split('');
        for (var l = 0; l < categoryArray.length; l++) {
          this.setValue(pageElement + ' input[name="category"]', categoryArray[l]);
        }
      }
      // if (effectiveDate) {
      //   var effectiveDateArray = effectiveDate.split('');
      //   for (var l = 0; l < effectiveDateArray.length; l++) {
      //     this.setValue(pageElement + ' input[name="effectiveDate"]', effectiveDateArray[l]);
      //   }
      // }
      if (conclusion) {
        var conclusionArray = conclusion.split('');
        for (var l = 0; l < conclusionArray.length; l++) {
          this.setValue(pageElement + ' textarea[name="conclusion"]', conclusionArray[l]);
        }
      }
      
      return this;
    },
    saveDiagnosticReport: function(){
      return this.verify.elementPresent('#saveDiagnosticReportButton').click('#saveDiagnosticReportButton');
    }
  }],
  elements: {}
};
