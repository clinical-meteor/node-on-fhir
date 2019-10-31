module.exports = {
  url: 'http://localhost:3000',
  commands: [{
    navigateToIndexPage: function(elementPath, welcomePage, client){
      this
        .waitForElementPresent(welcomePage, 5000)
        .verify.elementPresent('#sidebarToggleButton')
          .click('#sidebarToggleButton')
        .waitForElementPresent(elementPath, 1000);

      client
        .pause(1000) 
        .click(elementPath)
        .pause(2000) 

      return this.waitForElementPresent('#indexPage', 3000)
    },
    navigateToFhirIndexPage: function(elementPath, welcomePage, client){
      this
        .waitForElementPresent(welcomePage, 5000)
        .verify.elementPresent('#sidebarToggleButton')
          .click('#sidebarToggleButton')
        .waitForElementPresent(elementPath, 1000);

      client
        .pause(1000) 
        .click(elementPath)
        .pause(2000) 

      return this.waitForElementPresent('#fhirResourcesIndexPage', 3000)
    },
    confirmUsername: function(userName){
      return this
        .waitForElementPresent('#authenticatedUsername', 1000)
        .verify.containsText('#authenticatedUsername', userName); 
    },
    selectAllergyIntolerancesTile: function() {
      return this
        .verify.elementPresent('#allergyIntoleranceTile')
        .click('#allergyIntoleranceTile');
    },
    selectConditionsTile: function() {
      return this
        .verify.elementPresent('#conditionsTile')
        .click('#conditionsTile');
    },
    selectDevicesTile: function() {
      return this
        .verify.elementPresent('#devicesTile')
        .click('#devicesTile');
    },
    selectDiagnosticReportsTile: function() {
      return this
        .verify.elementPresent('#diagnosticReportsTile')
        .click('#diagnosticReportsTile');
    },
    selectGoalsTile: function() {
      return this
        .verify.elementPresent('#goalsTile')
        .click('#goalsTile');
    },
    selectImmunizationsTile: function() {
      return this
        .verify.elementPresent('#immunizationsTile')
        .click('#immunizationsTile');
    },

    selectObservationsTile: function() {
      return this
        .verify.elementPresent('#observationsTile')
        .click('#observationsTile');
    },
    selectMedicationsTile: function() {
      return this
        .verify.elementPresent('#medicationsTile')
        .click('#medicationsTile');
    },
    selectMedicationStatementsTile: function() {
      return this
        .verify.elementPresent('#medicationStatementsTile')
        .click('#medicationStatementsTile');
    },
    selectRiskAssessmentsTile: function() {
      return this
        .verify.elementPresent('#riskAssessmentsTile')
        .click('#riskAssessmentsTile');
    },
    selectLocationsTile: function() {
      return this
        .verify.elementPresent('#locationsTile')
        .click('#locationsTile');
    },
    selectOrganizationsTile: function() {
      return this
        .verify.elementPresent('#organizationsTile')
        .click('#organizationsTile');
    },
    selectPatientsTile: function() {
      return this
        .verify.elementPresent('#patientsTile')
        .click('#patientsTile');
    },
    selectPractitionersTile: function() {
      return this
        .verify.elementPresent('#practitionersTile')
        .click('#practitionersTile');
    },
    selectProceduresTile: function() {
      return this
        .verify.elementPresent('#proceduresTile')
        .click('#proceduresTile');
    }        
  }],
  elements: {
    indexPage: {
      selector: '#indexPage'
    }
  }
};
