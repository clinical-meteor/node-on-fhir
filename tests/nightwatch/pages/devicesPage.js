// category, value, unit, name, userId
// 'Weight', '60', 'kg', 'Jane Doe', '123456789',


module.exports = {
  url: 'http://localhost:3000/devices',
  commands: [{

    verifyElements: function() {
      return this
        .waitForElementPresent('#devicesPage', 10000)
        .verify.elementPresent('#devicesTable');
    },
    verifyEmptyList: function() {
      return this
        .verify.elementNotPresent('#devicesTable .deviceRow:nth-child(1)');
    },
    verifyDeviceListCard: function() {
      return this
        .verify.elementPresent('#devicesTable')
        .verify.elementPresent('#devicesTable .deviceRow:nth-child(1)')
        .verify.elementPresent('#devicesTable .deviceRow:nth-child(1) .deviceType')
        .verify.elementPresent('#devicesTable .deviceRow:nth-child(1) .manufacturer')
        .verify.elementPresent('#devicesTable .deviceRow:nth-child(1) .deviceModel')
        .verify.elementPresent('#devicesTable .deviceRow:nth-child(1) .serialNumber');
    },
    selectNewDeviceTab: function() {
      return this
        .verify.elementPresent('#devicesPageTabs')
        .verify.elementPresent('#devicesPageTabs .newDeviceTab')
        .click("#devicesPageTabs .newDeviceTab");
    },
    verifyNewDeviceCard: function() {
      return this
        .verify.elementPresent('#devicesPage .deviceDetail')
        .verify.elementPresent('#devicesPage .deviceDetail input[name="deviceType"]')
        .verify.elementPresent('#devicesPage .deviceDetail input[name="manufacturer"]')
        .verify.elementPresent('#devicesPage .deviceDetail input[name="deviceModel"]')
        .verify.elementPresent('#devicesPage .deviceDetail input[name="serialNumber"]');
    },
    verifyDeviceDetails: function(deviceType, manufacturer, deviceModel, serialNumber) {
      this
        .waitForElementPresent('#deviceDetails', 5000);

      if (deviceType) {
        this.verify.attributeEquals('#devicesPage .deviceDetail  input[name="deviceType"]', 'value', deviceType);
      }
      if (manufacturer) {
        this.verify.attributeEquals('#devicesPage .deviceDetail  input[name="manufacturer"]', 'value', manufacturer);
      }
      if (deviceModel) {
        this.verify.attributeEquals('#devicesPage .deviceDetail  input[name="deviceModel"]', 'value', deviceModel);
      }
      if (serialNumber) {
        this.verify.attributeEquals('#devicesPage .deviceDetail  input[name="serialNumber"]', 'value', serialNumber);
      }
      return this;
    },
    listContainsDevice: function (index, deviceType, manufacturer, deviceModel, serialNumber){
      this
        .verify.elementPresent('#devicesTable')
        .verify.elementPresent('#devicesTable .deviceRow:nth-child(' + index + ')')
        .verify.elementPresent('#devicesTable .deviceRow:nth-child(' + index + ') .deviceType')
        .verify.elementPresent('#devicesTable .deviceRow:nth-child(' + index + ') .manufacturer')
        .verify.elementPresent('#devicesTable .deviceRow:nth-child(' + index + ') .deviceModel')
        .verify.elementPresent('#devicesTable .deviceRow:nth-child(' + index + ') .serialNumber');

      if (deviceType) {
        this.verify.containsText('#devicesTable .deviceRow:nth-child(' + index + ') .deviceType', deviceType);
      }
      if (manufacturer) {
        this.verify.containsText('#devicesTable .deviceRow:nth-child(' + index + ') .manufacturer', manufacturer);
      }
      if (deviceModel) {
        this.verify.containsText('#devicesTable .deviceRow:nth-child(' + index + ') .deviceModel', deviceModel);
      }
      if (serialNumber) {
        this.verify.containsText('#devicesTable .deviceRow:nth-child(' + index + ') .serialNumber', serialNumber);
      }
      return this;
    },
    selectListTab: function(){
      return this.click('#devicesPage .deviceListTab');
    },
    displayListCard: function(){
      return this.click('#devicesPage .deviceListTab');
    },
    displayNewDeviceCard: function(){
      return this.click('#devicesPage .newDeviceTab');
    },
    displayDeviceDetails: function(){
      return this.click('#devicesPage .deviceDetailsTab');
    },
    selectDevice: function(index){
      return this.click('#devicesTable .deviceRow:nth-child(' + index + ')');
    },
    upsertDevice: function(deviceType, manufacturer, deviceModel, serialNumber, pageElement) {
      if (deviceType) {
        var deviceTypeArray = deviceType.split('');
        for (var i = 0; i < deviceTypeArray.length; i++) {
          this.setValue(pageElement + ' input[name="deviceType"]', deviceTypeArray[i]);
        }
      }
      if (manufacturer) {
        var manufacturerArray = manufacturer.split('');
        for (var k = 0; k < manufacturerArray.length; k++) {
          this.setValue(pageElement + ' input[name="manufacturer"]', manufacturerArray[k]);
        }
      }
      if (deviceModel) {
        var deviceModelArray = deviceModel.split('');
        for (var j = 0; j < deviceModelArray.length; j++) {
          this.setValue(pageElement + ' input[name="deviceModel"]', deviceModelArray[j]);
        }
      }
      if (serialNumber) {
        var serialNumberArray = serialNumber.split('');
        for (var l = 0; l < serialNumberArray.length; l++) {
          this.setValue(pageElement + ' input[name="serialNumber"]', serialNumberArray[l]);
        }
      }

      return this;
    },
    saveDevice: function(){
      return this.verify.elementPresent('#saveDeviceButton').click('#saveDeviceButton');
    }
  }],
  elements: {}
};
