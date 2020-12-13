import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Tasks, ValueSets } from 'meteor/clinical:hl7-fhir-data-infrastructure';

if(Meteor.isClient){
  console.log('Subscribing to FHIR cursors via websockets.');

  Meteor.subscribe('Tasks');
  Meteor.subscribe('ValueSets');
}


if(Meteor.isServer){
  console.log('Publishing FHIR cursors over websockets.');

  Meteor.publish('Tasks', function(){
    return Tasks.find();
  });   
  
  Meteor.publish('ValueSets', function(){
    return ValueSets.find();
  });     
}
