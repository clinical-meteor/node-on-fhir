import { Meteor } from 'meteor/meteor';

import { get, concat } from 'lodash';
import { Conditions, Encounters, Claims, DiagnosticReports, DocumentReferences, Immunizations, Procedures, Medications, MedicationRequests, MedicationAdministrations, Patients, Bundles, ExplanationOfBenefits, Locations } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import { Session } from 'meteor/session';


Helpers = {
  parseResourcesIntoStrings: async function(bundle){
    let parsedBundle;
    if(typeof bundle === "string"){
      parsedBundle = JSON.parse(bundle);
    } else if (typeof bundle === "object"){
      parsedBundle = bundle;
    }

    let relayUrl = get(Meteor, 'settings.public.interfaces.fhirServer.channel.endpoint', "")
    
    await Meteor.call('proxyBundleToString', relayUrl, parsedBundle, function(error, result){
      if(error){
        console.error('error', error)
      }
      if(result){
        console.log('result', result)

        Session.set('textNormalForm', get(result, 'data.text'));

        // let newResource;
        // if(get(result, 'data.text')){
        //   newResource = get(resource, 'resource')
        //   newResource.text = {
        //     div: get(result, 'data.text')
        //   };
        //   Session.set('textNormalForm', JSON.stringify(newResource, null, 2));
        // } else if(get(result, 'data.text.div')){
        //   newResource = get(resource, 'resource')
        //   newResource.text = {
        //     div: get(result, 'data.text.div')
        //   };
        //   Session.set('textNormalForm', JSON.stringify(newResource, null, 2));
        // }
      }
    })
  },
  createNarrativeSummary: function(ndjsonString){

    let relayUrl = get(Meteor, 'settings.public.interfaces.fhirServer.channel.endpoint', "")

    relayUrl = "http://tiresias:8081/tostring";

    console.log('Initiating Python pipeline');
    console.log(ndjsonString);
    console.log("Relay URL: " + JSON.stringify(relayUrl))
    
    Meteor.call('proxyToString', relayUrl, ndjsonString, function(error, result){
      if(error){
        console.error('error', error)
      }
      if(result){
        console.log('result', result)

        if(get(result, 'data.text')){
          Session.set('textNormalForm', result.data.text);
        } else if(get(result, 'data.text.div')){
          Session.set('textNormalForm', result.data.text.div);
        }
      }
    })
  },
  selectMedicalHistory: function(){
    console.log('selectMedicalHistory')

    let medicalHistory = {
      resourceType: "Bundle",
      type: "transaction",
      entry: []
    }

    let conditions = Conditions.find().map(function(condition){
      delete condition._id;
      delete condition._document;

      let entry = {
        resource: condition
      }
      return entry;
    });

    // let claims = Claims.find().map(function(claim){
    //   delete claim._id;
    //   delete claim._document;

    //   let entry = {
    //     resource: claim
    //   }
    //   return entry;
    // });

    let encounters = Encounters.find().map(function(encounter){
      delete encounter._id;
      delete encounter._document;

      let entry = {
        resource: encounter
      }
      return entry;
    });

    // let diagnosticReports = DiagnosticReports.find().map(function(diagnosticReport){
    //   delete diagnosticReport._id;
    //   delete diagnosticReport._document;

    //   let entry = {
    //     resource: diagnosticReport
    //   }
    //   return entry;
    // });

    // let documentReferences = DocumentReferences.find().map(function(documentReference){
    //   delete documentReference._id;
    //   delete documentReference._document;

    //   let entry = {
    //     resource: documentReference
    //   }
    //   return entry;
    // });

    // let medicationRequests = MedicationRequests.find().map(function(medicationRequest){
    //   delete medicationRequest._id;
    //   delete medicationRequest._document;

    //   let entry = {
    //     resource: medicationRequest
    //   }
    //   return entry;
    // });

    // let medications = Medications.find().map(function(medication){
    //   delete medication._id;
    //   delete medication._document;
    //   let entry = {
    //     resource: medication
    //   }
    //   return entry;
    // });

    // let medicationAdministrations = MedicationAdministrations.find().map(function(medicationAdministrations){
    //   delete medicationAdministrations._id;
    //   delete medicationAdministrations._document;

    //   let entry = {
    //     resource: medicationAdministrations
    //   }
    //   return entry;
    // });

    let immunizations = Immunizations.find().map(function(immunization){
      delete immunization._id;
      delete immunization._document;

      let entry = {
        resource: immunization
      }
      return entry;
    });      

    let patients = Patients.find().map(function(patient){
      delete patient._id;
      delete patient._document;
      let entry = {
        resource: patient
      }
      return entry;
    });
    let procedures = Procedures.find().map(function(procedure){
      delete procedure._id;
      delete procedure._document;

      let entry = {
        resource: procedure
      }
      return entry;
    });


    console.log('conditions.length', conditions.length)
    console.log('procedures.length', procedures.length)
    // console.log('medications.length', medications.length)
    console.log('patients.length', patients.length)

    medicalHistory.entry = concat(medicalHistory.entry, conditions);
    // medicalHistory.entry = concat(medicalHistory.entry, claims);
    // medicalHistory.entry = concat(medicalHistory.entry, encounters);
    // medicalHistory.entry = concat(medicalHistory.entry, diagnosticReports);
    // medicalHistory.entry = concat(medicalHistory.entry, documentReferences);
    medicalHistory.entry = concat(medicalHistory.entry, immunizations);
    // medicalHistory.entry = concat(medicalHistory.entry, medications);
    // medicalHistory.entry = concat(medicalHistory.entry, medicationRequests);
    // medicalHistory.entry = concat(medicalHistory.entry, medicationAdministrations);
    medicalHistory.entry = concat(medicalHistory.entry, patients);
    medicalHistory.entry = concat(medicalHistory.entry, procedures);

    // kludgy, but it gets the job done
    medicalHistory.total = medicalHistory.entry.length;
    console.log('medicalHistory', medicalHistory)

    Session.set('exportBuffer', medicalHistory);
  },
  ingestQuestionnaire: function(record){
    console.log("Ingesting questionnaire...", record);
    
    if(get(record, 'resourceType') === "Bundle"){
      if(Array.isArray(get(record, 'entry'))){
        record.entry.forEach(function(entry){
          if(get(entry, 'resource.resourceType') === "Questionnaire"){
            Questionnaires.upsert({id: get(entry, 'resource.id')}, {$set: get(entry, 'resource')}, {filter: false, validate: false}, function(){});                              
          }
        });
      }

    } else if(get(record, 'resourceType') === "Questionnaire"){
      Questionnaires.upsert({id: get(record, 'id')}, {$set: record}, {filter: false, validate: false}, function(){});                          
    }
  }
}

export default Helpers;