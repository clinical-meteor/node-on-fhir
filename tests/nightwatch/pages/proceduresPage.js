// category, value, unit, name, userId
// 'Weight', '60', 'kg', 'Jane Doe', '123456789',




module.exports = {
  url: 'http://localhost:3000/procedures',
  commands: [{

    verifyElements: function() {
      return this
        .waitForElementPresent('#proceduresPage', 10000)
        .verify.elementPresent('#proceduresTable');
    },
    verifyEmptyList: function() {
      return this
        .verify.elementNotPresent('#proceduresTable .procedureRow:nth-child(1)');
    },
    verifyProcedureListCard: function() {
      return this
        .verify.elementPresent('#proceduresTable')
        .verify.elementPresent('#proceduresTable .procedureRow:nth-child(1)')
        .verify.elementPresent('#proceduresTable .procedureRow:nth-child(1) .identifier')
        .verify.elementPresent('#proceduresTable .procedureRow:nth-child(1) .categoryDisplay')
        .verify.elementPresent('#proceduresTable .procedureRow:nth-child(1) .procedureCodeDisplay')
        .verify.elementPresent('#proceduresTable .procedureRow:nth-child(1) .procedureCode')
        .verify.elementPresent('#proceduresTable .procedureRow:nth-child(1) .subjectDisplay')
        .verify.elementPresent('#proceduresTable .procedureRow:nth-child(1) .performerDisplay')
        .verify.elementPresent('#proceduresTable .procedureRow:nth-child(1) .bodySiteDisplay')
        // .verify.elementPresent('#proceduresTable .procedureRow:nth-child(1) .notesCount');
      },
    selectNewProcedureTab: function() {
      return this
        .verify.elementPresent('#proceduresPageTabs')
        .verify.elementPresent('#proceduresPageTabs .newProcedureTab')
        .click("#proceduresPageTabs .newProcedureTab");
    },
    verifyNewProcedureCard: function() {
      return this
        .verify.elementPresent('#proceduresPage .procedureDetail')
        .verify.elementPresent('#proceduresPage .procedureDetail input[name="identifier"]')
        .verify.elementPresent('#proceduresPage .procedureDetail input[name="categoryCode"]')
        .verify.elementPresent('#proceduresPage .procedureDetail input[name="categoryDisplay"]')
        .verify.elementPresent('#proceduresPage .procedureDetail input[name="procedureCode"]')
        .verify.elementPresent('#proceduresPage .procedureDetail input[name="procedureCodeDisplay"]')
        .verify.elementPresent('#proceduresPage .procedureDetail input[name="bodySiteDisplay"]')
        .verify.elementPresent('#proceduresPage .procedureDetail input[name="bodySiteReference"]')
        .verify.elementPresent('#proceduresPage .procedureDetail input[name="performedDateTime"]')
        // .verify.elementPresent('#proceduresPage .procedureDetail input[name="performedDate"]')
        // .verify.elementPresent('#proceduresPage .procedureDetail input[name="performedTime"]')
        .verify.elementPresent('#proceduresPage .procedureDetail input[name="performerDisplay"]')
        .verify.elementPresent('#proceduresPage .procedureDetail input[name="performerReference"]')
        .verify.elementPresent('#proceduresPage .procedureDetail input[name="subjectDisplay"]')
        .verify.elementPresent('#proceduresPage .procedureDetail input[name="subjectReference"]')
        .verify.elementPresent('#proceduresPage .procedureDetail input[name="noteTime"]')
        // .verify.elementPresent('#proceduresPage .procedureDetail textarea[name="noteText"]');
      },
    verifyProcedureDetails: function(data) {
      this
        .waitForElementPresent('#procedureDetails', 5000);

      if (data.identifier) {
        this.verify.attributeEquals('#proceduresPage .procedureDetail input[name="identifier"]', 'value', data.identifier);
      }
      if (data.categoryCode) {
        this.verify.attributeEquals('#proceduresPage .procedureDetail input[name="categoryCode"]', 'value', data.categoryCode);
      }
      if (data.categoryDisplay) {
        this.verify.attributeEquals('#proceduresPage .procedureDetail input[name="categoryDisplay"]', 'value', data.categoryDisplay);
      }      
      if (data.procedureCode) {
        this.verify.attributeEquals('#proceduresPage .procedureDetail input[name="procedureCode"]', 'value', data.procedureCode);
      }      
      if (data.procedureCodeDisplay) {
        this.verify.attributeEquals('#proceduresPage .procedureDetail input[name="procedureCodeDisplay"]', 'value', data.procedureCodeDisplay);
      }   
      
      if (data.bodySiteDisplay) {
        this.verify.attributeEquals('#proceduresPage .procedureDetail input[name="bodySiteDisplay"]', 'value', data.bodySiteDisplay);
      }      
      if (data.bodySiteReference) {
        this.verify.attributeEquals('#proceduresPage .procedureDetail input[name="bodySiteReference"]', 'value', data.bodySiteReference);
      }      

      if (data.performerDisplay) {
        this.verify.attributeEquals('#proceduresPage .procedureDetail input[name="performerDisplay"]', 'value', data.performerDisplay);
      }      
      if (data.performerReference) {
        this.verify.attributeEquals('#proceduresPage .procedureDetail input[name="performerReference"]', 'value', data.performerReference);
      }    

      if (data.subjectDisplay) {
        this.verify.attributeEquals('#proceduresPage .procedureDetail input[name="subjectDisplay"]', 'value', data.subjectDisplay);
      }      
      if (data.subjectReference) {
        this.verify.attributeEquals('#proceduresPage .procedureDetail input[name="subjectReference"]', 'value', data.subjectReference);
      } 

      if (data.noteTime) {
        this.verify.attributeEquals('#proceduresPage .procedureDetail input[name="noteTime"]', 'value', data.noteTime);
      }      
      // if (data.noteText) {
      //   this.verify.attributeEquals('#proceduresPage .procedureDetail textarea[name="noteText"]', 'value', data.noteText);
      // } 

      return this;
    },
    listContainsProcedure: function (index, data){
      this
        .verify.elementPresent('#proceduresTable')
        .verify.elementPresent('#proceduresTable .procedureRow:nth-child(' + index + ')')
        .verify.elementPresent('#proceduresTable .procedureRow:nth-child(1) .identifier')
        .verify.elementPresent('#proceduresTable .procedureRow:nth-child(1) .categoryDisplay')
        .verify.elementPresent('#proceduresTable .procedureRow:nth-child(1) .procedureCodeDisplay')
        .verify.elementPresent('#proceduresTable .procedureRow:nth-child(1) .procedureCode')
        .verify.elementPresent('#proceduresTable .procedureRow:nth-child(1) .subjectDisplay')
        .verify.elementPresent('#proceduresTable .procedureRow:nth-child(1) .performerDisplay')
        .verify.elementPresent('#proceduresTable .procedureRow:nth-child(1) .bodySiteDisplay')
        .verify.elementPresent('#proceduresTable .procedureRow:nth-child(1) .notesCount');
        
      if (data.identifier) {
        this.verify.containsText('#proceduresTable .procedureRow:nth-child(' + index + ') .identifier', data.identifier);
      }
      if (data.categoryDisplay) {
        this.verify.containsText('#proceduresTable .procedureRow:nth-child(' + index + ') .categoryDisplay', data.categoryDisplay);
      }
      if (data.procedureCodeDisplay) {
        this.verify.containsText('#proceduresTable .procedureRow:nth-child(' + index + ') .procedureCodeDisplay', data.procedureCodeDisplay);
      }
      if (data.procedureCode) {
        this.verify.containsText('#proceduresTable .procedureRow:nth-child(' + index + ') .procedureCode', data.procedureCode);
      }
      if (data.subjectDisplay) {
        this.verify.containsText('#proceduresTable .procedureRow:nth-child(' + index + ') .subjectDisplay', data.subjectDisplay);
      }
      if (data.performerDisplay) {
        this.verify.containsText('#proceduresTable .procedureRow:nth-child(' + index + ') .performerDisplay', data.performerDisplay);
      }
      if (data.bodySiteDisplay) {
        this.verify.containsText('#proceduresTable .procedureRow:nth-child(' + index + ') .bodySiteDisplay', data.bodySiteDisplay);
      }
      if (data.notesCount) {
        this.verify.containsText('#proceduresTable .procedureRow:nth-child(' + index + ') .notesCount', data.notesCount);
      }

      return this;
    },
    selectListTab: function(){
      return this.click('#proceduresPage .procedureListTab');
    },
    displayListCard: function(){
      return this.click('#proceduresPage .procedureListTab');
    },
    displayNewProcedureCard: function(){
      return this.click('#proceduresPage .newProcedureTab');
    },
    displayProcedureDetails: function(){
      return this.click('#proceduresPage .procedureDetailsTab');
    },
    selectProcedure: function(index){
      return this.click('#proceduresTable .procedureRow:nth-child(' + index + ')');
    },
    upsertProcedure: function(data, pageElement) {
      if (data.identifier) {
        var identifierArray = data.identifier.split('');
        for (var i = 0; i < identifierArray.length; i++) {
          this.setValue(pageElement + ' input[name="identifier"]', identifierArray[i]);
        }
      }
      if (data.categoryCode) {
        var categoryCodeArray = data.categoryCode.split('');
        for (var k = 0; k < categoryCodeArray.length; k++) {
          this.setValue(pageElement + ' input[name="categoryCode"]', categoryCodeArray[k]);
        }
      }
      if (data.categoryDisplay) {
        var categoryDisplayArray = data.categoryDisplay.split('');
        for (var k = 0; k < categoryDisplayArray.length; k++) {
          this.setValue(pageElement + ' input[name="categoryDisplay"]', categoryDisplayArray[k]);
        }
      }

      if (data.procedureCode) {
        var procedureCodeArray = data.procedureCode.split('');
        for (var k = 0; k < procedureCodeArray.length; k++) {
          this.setValue(pageElement + ' input[name="procedureCode"]', procedureCodeArray[k]);
        }
      }
      if (data.procedureCodeDisplay) {
        var procedureCodeDisplayArray = data.procedureCodeDisplay.split('');
        for (var k = 0; k < procedureCodeDisplayArray.length; k++) {
          this.setValue(pageElement + ' input[name="procedureCodeDisplay"]', procedureCodeDisplayArray[k]);
        }
      } 
      
      if (data.bodySiteDisplay) {
        var bodySiteDisplayArray = data.bodySiteDisplay.split('');
        for (var k = 0; k < bodySiteDisplayArray.length; k++) {
          this.setValue(pageElement + ' input[name="bodySiteDisplay"]', bodySiteDisplayArray[k]);
        }
      }       
      if (data.bodySiteReference) {
        var bodySiteReferenceArray = data.bodySiteReference.split('');
        for (var k = 0; k < bodySiteReferenceArray.length; k++) {
          this.setValue(pageElement + ' input[name="bodySiteReference"]', bodySiteReferenceArray[k]);
        }
      } 

      if (data.performerDisplay) {
        var performerDisplayArray = data.performerDisplay.split('');
        for (var k = 0; k < performerDisplayArray.length; k++) {
          this.setValue(pageElement + ' input[name="performerDisplay"]', performerDisplayArray[k]);
        }
      } 
      if (data.performerReference) {
        var performerReferenceArray = data.performerReference.split('');
        for (var k = 0; k < performerReferenceArray.length; k++) {
          this.setValue(pageElement + ' input[name="performerReference"]', performerReferenceArray[k]);
        }
      }       

      if (data.subjectDisplay) {
        var subjectDisplayArray = data.subjectDisplay.split('');
        for (var k = 0; k < subjectDisplayArray.length; k++) {
          this.setValue(pageElement + ' input[name="subjectDisplay"]', subjectDisplayArray[k]);
        }
      } 
      if (data.subjectReference) {
        var subjectReferenceArray = data.subjectReference.split('');
        for (var k = 0; k < subjectReferenceArray.length; k++) {
          this.setValue(pageElement + ' input[name="subjectReference"]', subjectReferenceArray[k]);
        }
      }   

      if (data.noteTime) {
        var noteTimeArray = data.noteTime.split('');
        for (var k = 0; k < noteTimeArray.length; k++) {
          this.setValue(pageElement + ' input[name="noteTime"]', noteTimeArray[k]);
        }
      } 
      // if (data.noteText) {
      //   var noteTextArray = data.noteText.split('');
      //   for (var k = 0; k < noteTextArray.length; k++) {
      //     this.setValue(pageElement + ' textarea[name="noteText"]', noteTextArray[k]);
      //   }
      // }        

      return this;
    },
    saveProcedure: function(){
      return this.verify.elementPresent('#saveProcedureButton').click('#saveProcedureButton');
    }
  }],
  elements: {}
};
