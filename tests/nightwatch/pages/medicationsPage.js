// category, value, unit, name, userId
// 'Weight', '60', 'kg', 'Jane Doe', '123456789',


module.exports = {
  url: 'http://localhost:3000/medications',
  commands: [{

    verifyElements: function() {
      return this
        .waitForElementPresent('#medicationsPage', 10000)
        .verify.elementPresent('#medicationsTable');
    },
    verifyEmptyList: function() {
      return this
        .verify.elementNotPresent('#medicationsTable .medicationRow:nth-child(1)');
    },
    verifyMedicationListCard: function() {
      return this
        .verify.elementPresent('#medicationsTable')
        .verify.elementPresent('#medicationsTable .medicationRow:nth-child(1)')
        .verify.elementPresent('#medicationsTable .medicationRow:nth-child(1) .name')
        .verify.elementPresent('#medicationsTable .medicationRow:nth-child(1) .manufacturer')
        .verify.elementPresent('#medicationsTable .medicationRow:nth-child(1) .form')
        .verify.elementPresent('#medicationsTable .medicationRow:nth-child(1) .activeIngredient');
    },
    selectNewMedicationTab: function() {
      return this
        .verify.elementPresent('#medicationsPageTabs')
        .verify.elementPresent('#medicationsPageTabs .newMedicationTab')
        .click("#medicationsPageTabs .newMedicationTab");
    },
    verifyNewMedicationCard: function() {
      return this
        .verify.elementPresent('#medicationsPage .medicationDetail')
        .verify.elementPresent('#medicationsPage .medicationDetail input[name="name"]')
        .verify.elementPresent('#medicationsPage .medicationDetail input[name="manufacturer"]')
        .verify.elementPresent('#medicationsPage .medicationDetail input[name="form"]')
        .verify.elementPresent('#medicationsPage .medicationDetail input[name="activeIngredient"]')
        .verify.elementPresent('#medicationsPage .medicationDetail input[name="amount"]')
        .verify.elementPresent('#medicationsPage .medicationDetail input[name="code"]');
    },
    verifyMedicationDetails: function(name, manufacturer, form, activeIngredient, amount, code) {
      this
        .waitForElementPresent('#medicationDetails', 5000);

      if (name) {
        this.verify.attributeEquals('#medicationsPage .medicationDetail  input[name="name"]', 'value', name);
      }
      if (manufacturer) {
        this.verify.attributeEquals('#medicationsPage .medicationDetail  input[name="manufacturer"]', 'value', manufacturer);
      }
      if (form) {
        this.verify.attributeEquals('#medicationsPage .medicationDetail  input[name="form"]', 'value', form);
      }
      if (activeIngredient) {
        this.verify.attributeEquals('#medicationsPage .medicationDetail  input[name="activeIngredient"]', 'value', activeIngredient);
      }
      if (amount) {
        this.verify.attributeEquals('#medicationsPage .medicationDetail  input[name="amount"]', 'value', amount);
      }
      if (code) {
        this.verify.attributeEquals('#medicationsPage .medicationDetail  input[name="code"]', 'value', code);
      }
      return this;
    },
    listContainsMedication: function (index, name, manufacturer, form, activeIngredient){
      this
        .verify.elementPresent('#medicationsTable')
        .verify.elementPresent('#medicationsTable .medicationRow:nth-child(' + index + ')')
        .verify.elementPresent('#medicationsTable .medicationRow:nth-child(' + index + ') .name')
        .verify.elementPresent('#medicationsTable .medicationRow:nth-child(' + index + ') .manufacturer')
        .verify.elementPresent('#medicationsTable .medicationRow:nth-child(' + index + ') .form')
        .verify.elementPresent('#medicationsTable .medicationRow:nth-child(' + index + ') .activeIngredient');

      if (name) {
        this.verify.containsText('#medicationsTable .medicationRow:nth-child(' + index + ') .name', name);
      }
      if (manufacturer) {
        this.verify.containsText('#medicationsTable .medicationRow:nth-child(' + index + ') .manufacturer', manufacturer);
      }
      if (form) {
        this.verify.containsText('#medicationsTable .medicationRow:nth-child(' + index + ') .form', form);
      }
      if (activeIngredient) {
        this.verify.containsText('#medicationsTable .medicationRow:nth-child(' + index + ') .activeIngredient', activeIngredient);
      }
      return this;
    },
    selectListTab: function(){
      return this.click('#medicationsPage .medicationListTab');
    },
    displayListCard: function(){
      return this.click('#medicationsPage .medicationListTab');
    },
    displayNewMedicationCard: function(){
      return this.click('#medicationsPage .newMedicationTab');
    },
    displayMedicationDetails: function(){
      return this.click('#medicationsPage .medicationDetailsTab');
    },
    selectMedication: function(index){
      return this.click('#medicationsTable .medicationRow:nth-child(' + index + ')');
    },
    upsertMedication: function(name, manufacturer, form, activeIngredient, amount, code, pageElement) {
      if (name) {
        var nameArray = name.split('');
        for (var i = 0; i < nameArray.length; i++) {
          this.setValue(pageElement + ' input[name="name"]', nameArray[i]);
        }
      }
      if (manufacturer) {
        var manufacturerArray = manufacturer.split('');
        for (var k = 0; k < manufacturerArray.length; k++) {
          this.setValue(pageElement + ' input[name="manufacturer"]', manufacturerArray[k]);
        }
      }
      if (form) {
        var formArray = form.split('');
        for (var j = 0; j < formArray.length; j++) {
          this.setValue(pageElement + ' input[name="form"]', formArray[j]);
        }
      }
      if (activeIngredient) {
        var activeIngredientArray = activeIngredient.split('');
        for (var l = 0; l < activeIngredientArray.length; l++) {
          this.setValue(pageElement + ' input[name="activeIngredient"]', activeIngredientArray[l]);
        }
      }
      if (amount) {
        var amountArray = amount.split('');
        for (var m = 0; m < amountArray.length; m++) {
          this.setValue(pageElement + ' input[name="amount"]', amountArray[m]);
        }
      }
      if (code) {
        var codeArray = code.split('');
        for (var m = 0; m < codeArray.length; m++) {
          this.setValue(pageElement + ' input[name="code"]', codeArray[m]);
        }
      }
      return this;
    },
    saveMedication: function(){
      return this.verify.elementPresent('#saveMedicationButton').click('#saveMedicationButton');
    }
  }],
  elements: {}
};
