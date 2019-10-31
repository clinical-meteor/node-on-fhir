// category, value, unit, name, userId
// 'Weight', '60', 'kg', 'Jane Doe', '123456789',


module.exports = {
  url: 'http://localhost:3000/observations',
  commands: [{

    verifyElements: function() {
      return this
        .waitForElementPresent('#observationsPage', 5000)
        .verify.elementPresent('#observationsTable');
    },
    verifyEmptyList: function() {
      return this
        .verify.elementNotPresent('#observationsTable .observationRow:nth-child(1)');
    },
    verifyObservationListCard: function() {
      return this
        .verify.elementPresent('#observationsTable')
        .verify.elementPresent('#observationsTable .observationRow:nth-child(1)')
        // .verify.elementPresent('#observationsTable .observationRow:nth-child(1) .name')
        // .verify.elementPresent('#observationsTable .observationRow:nth-child(1) .value')
        // .verify.elementPresent('#observationsTable .observationRow:nth-child(1) .unit')
        .verify.elementPresent('#observationsTable .observationRow:nth-child(1) .date');
    },
    selectNewObservationTab: function() {
      return this
        .verify.elementPresent('#observationsPageTabs')
        .verify.elementPresent('#observationsPageTabs .newObservationTab')
        .click("#observationsPageTabs .newObservationTab");
    },
    verifyNewObservationCard: function() {
      return this
        .verify.elementPresent('#observationsPage .observationDetail')
        .verify.elementPresent('#observationsPage .observationDetail input[name="category"]')
        .verify.elementPresent('#observationsPage .observationDetail input[name="valueQuantity.comparator"]')
        .verify.elementPresent('#observationsPage .observationDetail input[name="valueQuantity.value"]')
        .verify.elementPresent('#observationsPage .observationDetail input[name="valueQuantity.unit"]')
        .verify.elementPresent('#observationsPage .observationDetail input[name="status"]')
        .verify.elementPresent('#observationsPage .observationDetail input[name="deviceDisplay"]')
        .verify.elementPresent('#observationsPage .observationDetail input[name="deviceReference"]')
        .verify.elementPresent('#observationsPage .observationDetail input[name="subjectDisplay"]')
        .verify.elementPresent('#observationsPage .observationDetail input[name="subjectReference"]');
    },
    verifyObservationDetails: function(category, value, unit, name, userId) {
      this
        .waitForElementPresent('#observationDetails', 5000);

      if (category) {
        this.verify.attributeEquals('#observationsPage .observationDetail  input[name="category"]', 'value', category);
      }
      if (value) {
        this.verify.attributeEquals('#observationsPage .observationDetail  input[name="valueQuantity.value"]', 'value', value);
      }
      if (unit) {
        this.verify.attributeEquals('#observationsPage .observationDetail  input[name="valueQuantity.unit"]', 'value', unit);
      }
      if (name) {
        this.verify.attributeEquals('#observationsPage .observationDetail  input[name="subjectDisplay"]', 'value', name);
      }
      if (userId) {
        this.verify.attributeEquals('#observationsPage .observationDetail  input[name="subjectReference"]', 'value', userId);
      }
      return this;
    },
    listContainsObservation: function (index, category, value, unit, name, userId) {
      this
        .verify.elementPresent('#observationsTable')
        .verify.elementPresent('#observationsTable .observationRow:nth-child(' + index + ')')
        .verify.elementPresent('#observationsTable .observationRow:nth-child(' + index + ') .category')
        // .verify.elementPresent('#observationsTable .observationRow:nth-child(' + index + ') .value')
        // .verify.elementPresent('#observationsTable .observationRow:nth-child(' + index + ') .unit')
        // .verify.elementPresent('#observationsTable .observationRow:nth-child(' + index + ') .name');

      if (category) {
        this.verify.containsText('#observationsTable .observationRow:nth-child(' + index + ') .category', category);
      }
      // if (value) {
      //   this.verify.containsText('#observationsTable .observationRow:nth-child(' + index + ') .value', value);
      // }
      // if (unit) {
      //   this.verify.containsText('#observationsTable .observationRow:nth-child(' + index + ') .unit', unit);
      // }
      // if (name) {
      //   this.verify.containsText('#observationsTable .observationRow:nth-child(' + index + ') .name', name);
      // }
      return this;
    },
    selectListTab: function(){
      return this.click('#observationsPage .observationListTab');
    },
    displayListCard: function(){
      return this.click('#observationsPage .observationListTab');
    },
    displayNewObservationCard: function(){
      return this.click('#observationsPage .newObservationTab');
    },
    displayObservationDetails: function(){
      return this.click('#observationsPage .observationDetailsTab');
    },
    selectObservation: function(index){
      return this.click('#observationsTable .observationRow:nth-child(' + index + ')');
    },
    upsertObservation: function(category, value, unit, name, userId, pageElement) {
      if (category) {
        var categoryArray = category.split('');
        for (var i = 0; i < categoryArray.length; i++) {
          this.setValue(pageElement + ' input[name="category"]', categoryArray[i]);
        }
      }
      if (value) {
        var valueArray = value.split('');
        for (var k = 0; k < valueArray.length; k++) {
          this.setValue(pageElement + ' input[name="valueQuantity.value"]', valueArray[k]);
        }
      }
      if (unit) {
        var unitArray = unit.split('');
        for (var j = 0; j < unitArray.length; j++) {
          this.setValue(pageElement + ' input[name="valueQuantity.unit"]', unitArray[j]);
        }
      }
      if (name) {
        var nameArray = name.split('');
        for (var l = 0; l < nameArray.length; l++) {
          this.setValue(pageElement + ' input[name="subjectDisplay"]', nameArray[l]);
        }
      }
      if (userId) {
        var userIdArray = userId.split('');
        for (var m = 0; m < userIdArray.length; m++) {
          this.setValue(pageElement + ' input[name="subjectReference"]', userIdArray[m]);
        }
      }

      return this;
    },
    saveObservation: function(){
      return this.verify.elementPresent('#updateObservationButton').click('#updateObservationButton');
    }
  }],
  elements: {}
};
