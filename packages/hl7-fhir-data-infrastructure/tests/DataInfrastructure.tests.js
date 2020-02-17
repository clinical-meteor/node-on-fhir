import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { chai } from 'meteor/practicalmeteor:chai';
import { expect } from 'meteor/practicalmeteor:chai';

describe('clinical:hl7-fhir-data-infrastructure', function () {
  beforeEach(function () {
    //console.log('beforeEach');
  });
  afterEach(function () {
    //console.log('afterEach');
  });
  it('Bundles cursor should exist globally', function () {
    expect(Bundles).to.exist;
  });
  it('Encounters cursor should exist globally', function () {
    expect(Encounters).to.exist;
  });
  it('Patients cursor should exist globally', function () {
    expect(Patients).to.exist;
  });
});