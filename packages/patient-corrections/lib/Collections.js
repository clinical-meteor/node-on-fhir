import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Tasks } from 'meteor/clinical:hl7-fhir-data-infrastructure';

if(Meteor.isClient){
  console.log('Subscribing to FHIR cursors via websockets.');

  Meteor.subscribe('Tasks');
}


if(Meteor.isServer){
  console.log('Publishing FHIR cursors over websockets.');

  Meteor.publish('Tasks', function(){
    return Tasks.find();
  });     
}
