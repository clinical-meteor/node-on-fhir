// category, value, unit, name, userId
// 'Weight', '60', 'kg', 'Jane Doe', '123456789',


module.exports = {
  url: 'http://localhost:3000/medicationStatements',
  commands: [{

    verifyElements: function() {
      return this
        .waitForElementPresent('#medicationStatementsPage', 10000)
        .verify.elementPresent('#medicationStatementsTable');
    },
    verifyEmptyList: function() {
      return this
        .verify.elementNotPresent('#medicationStatementsTable .medicationStatementRow:nth-child(1)');
    },
    verifyMedicationStatementListCard: function() {
      return this
        .verify.elementPresent('#medicationStatementsTable')
        .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(1)')
        .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(1) .medication')
        // .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(1) .effectiveDateTime')
        .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(1) .dateAsserted')
        .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(1) .informationSource')
        .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(1) .subject')
        // .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(1) .taken')
        .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(1) .reason')
        // .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(1) .dosage');
      },
    selectNewMedicationStatementTab: function() {
      return this
        .verify.elementPresent('#medicationStatementsPageTabs')
        .verify.elementPresent('#medicationStatementsPageTabs .newMedicationStatementTab')
        .click("#medicationStatementsPageTabs .newMedicationStatementTab");
    },
    verifyNewMedicationStatementCard: function() {
      return this
        .verify.elementPresent('#medicationStatementsPage .medicationStatementDetail')
        .verify.elementPresent('#medicationStatementsPage .medicationStatementDetail input[name="dateAsserted"]')
        .verify.elementPresent('#medicationStatementsPage .medicationStatementDetail input[name="subjectDisplay"]')
        .verify.elementPresent('#medicationStatementsPage .medicationStatementDetail input[name="subjectReference"]')
        .verify.elementPresent('#medicationStatementsPage .medicationStatementDetail input[name="informationSourceDisplay"]')
        .verify.elementPresent('#medicationStatementsPage .medicationStatementDetail input[name="informationSourceReference"]')
        .verify.elementPresent('#medicationStatementsPage .medicationStatementDetail input[name="reasonCodeDisplay"]')
        .verify.elementPresent('#medicationStatementsPage .medicationStatementDetail input[name="reasonCode"]')
        // .verify.elementPresent('#medicationStatementsPage .medicationStatementDetail input[name="taken"]')
        // .verify.elementPresent('#medicationStatementsPage .medicationStatementDetail input[name="effectiveDateTime"]')
        .verify.elementPresent('#medicationStatementsPage .medicationStatementDetail input[name="medicationDisplay"]')
        .verify.elementPresent('#medicationStatementsPage .medicationStatementDetail input[name="medicationReference"]')
        .verify.elementPresent('#medicationStatementsPage .medicationStatementDetail textarea[name="clinicalNote"]');
      },

    // 'Self McSelf', 'self/123', 'Jane Doe', 'jdoe/4343', 'Headache', 'ache333', 'y', 'Tylenol PM', 'med123', 'Cluster headache.  Ouch!', '#newMedicationStatement'
    // subjectDisplay, subjectReference, informationSourceDisplay, informationSourceReference, reasonCodeDisplay, reasonCode, taken, medicationDisplay, medicationReference, clinicalNote, pageElement
    verifyMedicationStatementDetails: function(subjectDisplay, subjectReference, informationSourceDisplay, informationSourceReference, reasonCodeDisplay, reasonCode, taken, medicationDisplay, medicationReference, clinicalNote) {
      this
        .waitForElementPresent('#medicationStatementDetails', 5000);

      if (subjectDisplay) {
        this.verify.attributeEquals('#medicationStatementsPage .medicationStatementDetail input[name="subjectDisplay"]', 'value', subjectDisplay);
      }
      if (subjectReference) {
        this.verify.attributeEquals('#medicationStatementsPage .medicationStatementDetail input[name="subjectReference"]', 'value', subjectReference);
      }
      if (informationSourceDisplay) {
        this.verify.attributeEquals('#medicationStatementsPage .medicationStatementDetail input[name="informationSourceDisplay"]', 'value', informationSourceDisplay);
      }
      if (informationSourceReference) {
        this.verify.attributeEquals('#medicationStatementsPage .medicationStatementDetail input[name="informationSourceReference"]', 'value', informationSourceReference);
      }
      if (reasonCodeDisplay) {
        this.verify.attributeEquals('#medicationStatementsPage .medicationStatementDetail input[name="reasonCodeDisplay"]', 'value', reasonCodeDisplay);
      }
      if (reasonCode) {
        this.verify.attributeEquals('#medicationStatementsPage .medicationStatementDetail input[name="reasonCode"]', 'value', reasonCode);
      }
      // if (taken) {
      //   this.verify.attributeEquals('#medicationStatementsPage .medicationStatementDetail input[name="taken"]', 'value', taken);
      // }
      if (medicationDisplay) {
        this.verify.attributeEquals('#medicationStatementsPage .medicationStatementDetail input[name="medicationDisplay"]', 'value', medicationDisplay);
      }
      if (medicationReference) {
        this.verify.attributeEquals('#medicationStatementsPage .medicationStatementDetail input[name="medicationReference"]', 'value', medicationReference);
      }
      if (clinicalNote) {
        this.verify.attributeEquals('#medicationStatementsPage .medicationStatementDetail textarea[name="clinicalNote"]', 'value', clinicalNote);
      }
      return this;
    },

    // 1, 'Tylenol PM', null, null, 'Self McSelf', 'Jane Doe', 'y', 'Headache', null
    listContainsMedicationStatement: function (index, medication, effectiveDateTime, dateAsserted, subject, informationSource, taken, reason, dosage){
      this
        .verify.elementPresent('#medicationStatementsTable')
        .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ')')
        .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ') .medication')
        // .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ') .effectiveDateTime')
        .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ') .dateAsserted')
        .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ') .informationSource')
        .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ') .subject')
        // .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ') .taken')
        .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ') .reason');
        // .verify.elementPresent('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ') .dosage');        
        

      if (medication) {
        this.verify.containsText('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ') .medication', medication);
      }
      // if (effectiveDateTime) {
      //   this.verify.containsText('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ') .effectiveDateTime', effectiveDateTime);
      // }
      // if (dateAsserted) {
      //   this.verify.containsText('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ') .dateAsserted', dateAsserted);
      // }
      if (informationSource) {
        this.verify.containsText('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ') .informationSource', informationSource);
      }
      if (subject) {
        this.verify.containsText('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ') .subject', subject);
      }
      // if (taken) {
      //   this.verify.containsText('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ') .taken', taken);
      // }
      if (reason) {
        this.verify.containsText('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ') .reason', reason);
      }
      // if (dosage) {
      //   this.verify.containsText('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ') .dosage', dosage);
      // }
      return this;
    },
    selectListTab: function(){
      return this.click('#medicationStatementsPage .medicationStatementListTab');
    },
    displayListCard: function(){
      return this.click('#medicationStatementsPage .medicationStatementListTab');
    },
    displayNewMedicationStatementCard: function(){
      return this.click('#medicationStatementsPage .newMedicationStatementTab');
    },
    displayMedicationStatementDetails: function(){
      return this.click('#medicationStatementsPage .medicationStatementDetailsTab');
    },
    selectMedicationStatement: function(index){
      return this.click('#medicationStatementsTable .medicationStatementRow:nth-child(' + index + ')');
    },

    // 'Self McSelf', 'self/123', 'Jane Doe', 'jdoe/4343', 'Headache', 'ache333', 'y', 'Tylenol PM', 'med123', 'Cluster headache.  Ouch!', '#newMedicationStatement'
    upsertMedicationStatement: function(subjectDisplay, subjectReference, informationSourceDisplay, informationSourceReference, reasonCodeDisplay, reasonCode, taken, medicationDisplay, medicationReference, clinicalNote, pageElement) {

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
      if (informationSourceDisplay) {
        var informationSourceDisplayArray = informationSourceDisplay.split('');
        for (var j = 0; j < informationSourceDisplayArray.length; j++) {
          this.setValue(pageElement + ' input[name="informationSourceDisplay"]', informationSourceDisplayArray[j]);
        }
      }
      if (informationSourceReference) {
        var informationSourceReferenceArray = informationSourceReference.split('');
        for (var l = 0; l < informationSourceReferenceArray.length; l++) {
          this.setValue(pageElement + ' input[name="informationSourceReference"]', informationSourceReferenceArray[l]);
        }
      }
      if (reasonCodeDisplay) {
        var reasonCodeDisplayArray = reasonCodeDisplay.split('');
        for (var m = 0; m < reasonCodeDisplayArray.length; m++) {
          this.setValue(pageElement + ' input[name="reasonCodeDisplay"]', reasonCodeDisplayArray[m]);
        }
      }
      if (reasonCode) {
        var reasonCodeArray = reasonCode.split('');
        for (var m = 0; m < reasonCodeArray.length; m++) {
          this.setValue(pageElement + ' input[name="reasonCode"]', reasonCodeArray[m]);
        }
      }

      // if (taken) {
      //   var takenArray = taken.split('');
      //   for (var m = 0; m < takenArray.length; m++) {
      //     this.setValue(pageElement + ' input[name="taken"]', takenArray[m]);
      //   }
      // }
      if (medicationDisplay) {
        var medicationDisplayArray = medicationDisplay.split('');
        for (var m = 0; m < medicationDisplayArray.length; m++) {
          this.setValue(pageElement + ' input[name="medicationDisplay"]', medicationDisplayArray[m]);
        }
      }
      if (medicationReference) {
        var medicationReferenceArray = medicationReference.split('');
        for (var m = 0; m < medicationReferenceArray.length; m++) {
          this.setValue(pageElement + ' input[name="medicationReference"]', medicationReferenceArray[m]);
        }
      }
      if (clinicalNote) {
        var clinicalNoteArray = clinicalNote.split('');
        for (var m = 0; m < clinicalNoteArray.length; m++) {
          this.setValue(pageElement + ' textarea[name="clinicalNote"]', clinicalNoteArray[m]);
        }
      }

      return this;
    },
    saveMedicationStatement: function(){
      return this.verify.elementPresent('#saveMedicationStatementButton').click('#saveMedicationStatementButton');
    }
  }],
  elements: {}
};
