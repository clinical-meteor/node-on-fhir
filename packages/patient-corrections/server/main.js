

import { UsCoreMethods } from 'meteor/symptomatic:fhir-uscore';
import { Meteor } from 'meteor/meteor';
import { Compositions, DocumentReferences, Tasks, ValueSets } from 'meteor/clinical:hl7-fhir-data-infrastructure';
import { Mongo } from 'meteor/mongo';
import {TasksDedulpicated} from '../lib/Collections'


import { get, set, cloneDeep } from 'lodash';
import hipaaBusinessStatuses from '../examples/ValueSet.hipaa-http-business-status-mapping';
import sampleDocumentReference from '../examples/DocumentReference.generic';
import consultNote from '../examples/Composition.ConsultNote';

Meteor.startup(function(){
    console.log('Initializing records for Patient Corrections server.', 
        ValueSets.find().count(),
        DocumentReferences.find().count(),
        Compositions.find().count()
    )
    if(ValueSets.find().count() === 0){
        console.log('Initializing ValueSets')
        ValueSets.insert(hipaaBusinessStatuses, {filter: false, validate: false})
        DocumentReferences.insert(sampleDocumentReference, {filter: false, validate: false})
        UsCoreMethods.initializeValueSets();        
    }
    if(DocumentReferences.find().count() === 0){
        console.log('Initializing DocumentReferences');
        DocumentReferences.insert(sampleDocumentReference, {filter: false, validate: false})
    }    
    if(Compositions.find().count() === 0){
        console.log('Initializing Compositions');
        Compositions.insert(consultNote, {filter: false, validate: false})
    }    
})


Meteor.startup(function(){
    Tasks.before.insert(function (userId, doc) {
        process.env.DEBUG && console.log('Tasks.before.insert')
        process.env.DEBUG && console.log('# previous files with this Task.id: ' + Tasks.find({id: doc.id}))
    
    
        if(Tasks.find({id: doc.id})){
            console.log('Updating meta.versionId: ' + Tasks.find({id: doc.id}).count() + 1)        
            set(doc, 'meta.versionId', Tasks.find({id: doc.id}).count() + 1);
        } else {
            set(doc, 'meta.versionId', 1);
        }
    });
    Tasks.after.insert(function (userId, doc) {
        process.env.DEBUG && console.log('Tasks.after.insert')
        process.env.TRACE && console.log('Tasks.after.insert', TasksDeduplicated)

        let clonedDoc = cloneDeep(doc);

        let foundOne = TasksDeduplicated.findOne({'id': doc.id});
        process.env.DEBUG && console.log('foundOne', foundOne)
    
        if(foundOne){
            process.env.DEBUG && console.log('Found a record with this id and version already');
            process.env.TRACE && console.log('clonedDoc', clonedDoc);
            delete clonedDoc._id;

            TasksDeduplicated.update({id: doc.id}, clonedDoc);        
        } else {
            TasksDeduplicated.insert(clonedDoc)
        }
    });
})
