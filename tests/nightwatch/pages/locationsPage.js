module.exports = {
  url: 'http://localhost:3000/locations',
  commands: [{

    verifyElements: function() {
      return this
        .verify.elementPresent('#locationsPage')
        .verify.elementPresent('#locationsTable');
    },
    verifyEmptyList: function() {
      return this
        .verify.elementNotPresent('#locationsTable .locationRow:nth-child(1)');
    },
    verifyLocationListCard: function() {
      return this
        .verify.elementPresent('#locationsTable')
        .verify.elementPresent('#locationsTable .locationRow:nth-child(1)')
        .verify.elementPresent('#locationsTable .locationRow:nth-child(1) .name');
    },
    selectNewLocationTab: function() {
      return this
        .verify.elementPresent('#locationsPageTabs')
        .verify.elementPresent('#locationsPageTabs .newLocationTab')
        .click("#locationsPageTabs .newLocationTab");
    },
    verifyNewLocationCard: function() {
      return this
        .verify.elementPresent('#locationsPage .locationDetail')
        .verify.elementPresent('#locationsPage .locationDetail input[name="name"]')
        .verify.elementPresent('#locationsPage .locationDetail input[name="latitude"]')
        .verify.elementPresent('#locationsPage .locationDetail input[name="longitude"]')
        .verify.elementPresent('#locationsPage .locationDetail input[name="altitude"]')
    },
    verifyLocationDetails: function(name, latitude, longitude, altitude, qualificationId) {
      this
        .waitForElementPresent('#locationDetails', 5000)
        .waitForElementPresent('#locationDetails input[name="name"]', 5000);

      if (name) {
        this.verify.attributeEquals('#locationsPage .locationDetail  input[name="name"]', 'value', name.toString());
      }
      if (latitude) {
        this.verify.attributeEquals('#locationsPage .locationDetail  input[name="latitude"]', 'value', latitude.toString());
      }
      if (longitude) {
        this.verify.attributeEquals('#locationsPage .locationDetail  input[name="longitude"]', 'value', longitude.toString());
      }
      if (altitude) {
        this.verify.attributeEquals('#locationsPage .locationDetail  input[name="altitude"]', 'value', altitude.toString());
      }
      return this;
    },
    listContainsLocation: function (index, name) {
      this
        .verify.elementPresent('#locationsTable')
        .verify.elementPresent('#locationsTable .locationRow:nth-child(' + index + ')')
        .verify.elementPresent('#locationsTable .locationRow:nth-child(' + index + ') .name');

      if (name) {
        this.verify.containsText('#locationsTable .locationRow:nth-child(' + index + ') .name', name);
      }
      return this;
    },
    selectListTab: function(){
      return this.click('#locationsPage .locationListTab');
    },
    displayListCard: function(){
      return this.click('#locationsPage .locationListTab');
    },
    displayNewLocationCard: function(){
      return this.click('#locationsPage .newLocationTab');
    },
    displayLocationDetails: function(){
      return this.click('#locationsPage .locationDetailsTab');
    },
    selectLocation: function(index){
      return this.click('#locationsTable .locationRow:nth-child(' + index + ')');
    },
    upsertLocation: function(name, latitude, longitude, altitude, pageElement) {
      if (name) {
        var nameArray = name.split('');
        for (var i = 0; i < nameArray.length; i++) {
          this.setValue(pageElement + ' input[name="name"]', nameArray[i]);
        }
      }
      if (latitude) {
        // var latitudeArray = latitude.split('');
        // for (var l = 0; l < latitudeArray.length; l++) {
        //   this.setValue(pageElement + ' input[name="latitude"]', latitudeArray[l]);
        // }
        this.setValue(pageElement + ' input[name="latitude"]', latitude);
      }
      if (longitude) {
        // var longitudeArray = longitude.split('');
        // for (var m = 0; m < longitudeArray.length; m++) {
        //   this.setValue(pageElement + ' input[name="longitude"]', longitudeArray[m]);
        // }
        this.setValue(pageElement + ' input[name="longitude"]', longitude);
      }
      if (altitude) {
        // var altitudeArray = altitude.split('');
        // for (var j = 0; j < altitudeArray.length; j++) {
        //   this.setValue(pageElement + ' input[name="altitude"]', altitudeArray[j]);
        // }
        this.setValue(pageElement + ' input[name="altitude"]', altitude);
      }
      return this;
    },
    saveLocation: function(){
      return this.verify.elementPresent('#saveLocationButton').click('#saveLocationButton');
    }
  }],
  elements: {}
};
