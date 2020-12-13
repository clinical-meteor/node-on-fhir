

import { UsCoreMethods } from 'meteor/symptomatic:fhir-uscore';
import { Meteor } from 'meteor/meteor';
import { ValueSets } from 'meteor/clinical:hl7-fhir-data-infrastructure';

Meteor.startup(function(){
    if(ValueSets.find().count() === 0){
        UsCoreMethods.initializeValueSets()
    }    
})