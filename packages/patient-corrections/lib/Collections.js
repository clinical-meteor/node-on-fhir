import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


// import BaseModel from '../BaseModel';
// import SimpleSchema from 'simpl-schema';
// import { BaseSchema, DomainResourceSchema, HumanNameSchema, IdentifierSchema, ContactPointSchema, AddressSchema, ReferenceSchema, SignatureSchema } from 'meteor/clinical:hl7-resource-datatypes';


import { Conditions, Communications, CommunicationRequests, DocumentReferences, Observations, Patients, Tasks, ValueSets } from 'meteor/clinical:hl7-fhir-data-infrastructure';

TasksDeduplicated = new Mongo.Collection('TasksDeduplicated');

if(Meteor.isClient){
  console.log('Subscribing to FHIR cursors via websockets.');

  Meteor.subscribe('Conditions');
  Meteor.subscribe('Communications');
  Meteor.subscribe('CommunicationRequests');
  Meteor.subscribe('DocumentReferences');
  Meteor.subscribe('Tasks');
  Meteor.subscribe('TasksDeduplicated');
  Meteor.subscribe('Observations');
  Meteor.subscribe('Patients');
  Meteor.subscribe('ValueSets');
}


if(Meteor.isServer){
  console.log('Publishing FHIR cursors over websockets.');

  Meteor.publish('Conditions', function(){
    return Conditions.find();
  }); 
  Meteor.publish('Communications', function(){
    return Communications.find();
  }); 
  Meteor.publish('CommunicationRequests', function(){
    return CommunicationRequests.find();
  }); 
  Meteor.publish('DocumentReferences', function(){
    return DocumentReferences.find();
  }); 

  Meteor.publish('Observations', function(){
    return Observations.find();
  }); 

  Meteor.publish('Patients', function(){
    return Patients.find();
  });   

  Meteor.publish('Tasks', function(){
    return Tasks.find();
  });   
  Meteor.publish('TasksDeduplicated', function(){
    return TasksDeduplicated.find();
  });   
  
  Meteor.publish('ValueSets', function(){
    return ValueSets.find();
  });     
}

export default TasksDeduplicated;