module.exports = {
  url: 'http://localhost:3000/patients',
  commands: [{

    verifyElements: function() {
      return this
        .verify.elementPresent('#patientsPage')
        .verify.elementPresent('#patientsTable');
    },
    verifyEmptyList: function() {
      return this
        .verify.elementNotPresent('#patientsTable .patientRow:nth-child(1)');
    },
    verifyPatientListCard: function() {
      return this
        .verify.elementPresent('#patientsTable')
        .verify.elementPresent('#patientsTable .patientRow:nth-child(1)')
        .verify.elementPresent('#patientsTable .patientRow:nth-child(1) .name')
        // .verify.elementPresent('#patientsTable .patientRow:nth-child(1) .avatar');
    },
    selectNewPatientTab: function() {
      return this
        .verify.elementPresent('#patientsPageTabs')
        .verify.elementPresent('#patientsPageTabs .newPatientTab')
        .click("#patientsPageTabs .newPatientTab");
    },
    verifyNewPatientCard: function() {
      return this
        .verify.elementPresent('#patientsPage .patientDetail')
        .verify.elementPresent('#patientsPage .patientDetail input[name="identifier"]')
        .verify.elementPresent('#patientsPage .patientDetail input[name="prefix"]')
        .verify.elementPresent('#patientsPage .patientDetail input[name="family"]')
        .verify.elementPresent('#patientsPage .patientDetail input[name="given"]')
        .verify.elementPresent('#patientsPage .patientDetail input[name="suffix"]')
        .verify.elementPresent('#patientsPage .patientDetail input[name="maritalStatus"]')
        .verify.elementPresent('#patientsPage .patientDetail input[name="gender"]')
        .verify.elementPresent('#patientsPage .patientDetail input[name="photo"]')
        .verify.elementPresent('#patientsPage .patientDetail input[name="species"]')
        .verify.elementPresent('#patientsPage .patientDetail input[name="language"]')
        .verify.elementPresent('#patientsPage .patientDetail input[name="birthDate"]');
    },
    verifyPatientDetails: function(given, family, gender, birthdate, photo) {
      this
        .waitForElementPresent('#patientDetails', 5000);

      if (family) {
        this.verify.attributeEquals('#patientsPage .patientDetail  input[name="family"]', 'value', family);
      }
      if (given) {
        this.verify.attributeEquals('#patientsPage .patientDetail  input[name="given"]', 'value', given);
      }
      if (gender) {
        this.verify.attributeEquals('#patientsPage .patientDetail  input[name="gender"]', 'value', gender);
      }
      if (birthdate) {
        this.verify.attributeEquals('#patientsPage .patientDetail  input[name="birthDate"]', 'value', birthdate);
      }
      if (photo) {
        this.verify.attributeEquals('#patientsPage .patientDetail  input[name="photo"]', 'value', photo);
      }
      return this;
    },
    listContainsPatient: function (index, name, gender, birthdate) {
      this
        .verify.elementPresent('#patientsTable')
        .verify.elementPresent('#patientsTable .patientRow:nth-child(' + index + ')')
        .verify.elementPresent('#patientsTable .patientRow:nth-child(' + index + ') .name');

      if (name) {
        this.verify.containsText('#patientsTable .patientRow:nth-child(' + index + ') .name', name);
      }
      if (gender) {
        this.verify.containsText('#patientsTable .patientRow:nth-child(' + index + ') .gender', gender);
      }
      if (birthdate) {
        this.verify.containsText('#patientsTable .patientRow:nth-child(' + index + ') .birthDate', birthdate);
      }
      return this;
    },
    selectListTab: function(){
      return this.click('#patientsPage .patientListTab');
    },
    displayPatientDetails: function(){
      return this.click('#patientsPage .patientDetailsTab');
    },
    selectPatient: function(index){
      return this
        .verify.elementPresent('#patientsTable')
        .click('#patientsTable .patientRow:nth-child(' + index + ')');
    },
    upsertPatient: function(given, family, gender, birthdate, photo, pageElement, client) {
      if (family) {
        var familyArray = family.split('');
        for (var i = 0; i < familyArray.length; i++) {
          this.setValue(pageElement + ' input[name="family"]', familyArray[i]);
        }
      }
      if (given) {
        var givenArray = given.split('');
        for (var i = 0; i < givenArray.length; i++) {
          this.setValue(pageElement + ' input[name="given"]', givenArray[i]);
        }
      }
      if (gender) {
        var genderArray = gender.split('');
        for (var j = 0; j < genderArray.length; j++) {
          this.setValue(pageElement + ' input[name="gender"]', genderArray[j]);
        }
      }
      if (birthdate) {
        var birthdateArray = birthdate.split('-');
        this.setValue(pageElement + ' input[name="birthDate"]', birthdateArray[1]);
        client.pause(2000);
        this.setValue(pageElement + ' input[name="birthDate"]', birthdateArray[2]);
        client.pause(2000);
        this.setValue(pageElement + ' input[name="birthDate"]', birthdateArray[0]);
      }
      if (photo) {
        var photoArray = photo.split('');
        for (var l = 0; l < photoArray.length; l++) {
          this.setValue(pageElement + ' input[name="photo"]', photoArray[l]);
        }
      }
      return this;
    },
    savePatient: function(){
      return this.verify.elementPresent('#savePatientButton').click('#savePatientButton');
    }
  }],
  elements: {}
};
