
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';


import moment from 'moment';
import { get } from 'lodash';

import { FhirUtilities, Locations } from 'meteor/clinical:hl7-fhir-data-infrastructure';

if(Meteor.isClient){
  ImportCursor = new Mongo.Collection('ImportCursor', {connection: null});
  ExportCursor = new Mongo.Collection('ExportCursor', {connection: null});
  HealthKitImport = new Mongo.Collection('HealthKitImport', {connection: null});
}

