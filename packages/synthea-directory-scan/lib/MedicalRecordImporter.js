import { get, has } from 'lodash';
import { Meteor } from 'meteor/meteor';


// import AllergyIntolerances from './schemas/AllergyIntolerances';
// import Conditions from './schemas/Conditions';
// // import Claims from './schemas/Claims';
// import DiagnosticReports from './schemas/DiagnosticReports';
// import Encounters from './schemas/Encounters';
// // import ExplanationOfBenefits from './schemas/ExplanationOfBenefits';
// import Immunizations from './schemas/Immunizations';
// import Medications from './schemas/Medications';
// import MedicationOrders from './schemas/MedicationOrders';
// import MedicationStatements from './schemas/MedicationStatements';
// import Observations from './schemas/Observations';
// import Patients from './schemas/Patients';
// import Procedures from './schemas/Procedures';
// import ValueSets from './schemas/ValueSets';

import { AllergyIntolerances, CarePlans, Claims, Conditions, Devices, DiagnosticReports, Encounters, ExplanationOfBenefits, Immunizations, Medications, MedicationStatements, Observations, Patients, Procedures } from 'meteor/clinical:hl7-fhir-data-infrastructure';


// import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';

//---------------------------------------------------------------------------
// Collections

// this is a little hacky, but it works to access our collections.
// we use to use Mongo.Collection.get(collectionName), but in Meteor 1.3, it was deprecated
// we then started using window[collectionName], but that only works on the client
// so we now take the window and 

let Collections;

if(Meteor.isClient){
  Collections = window;
}
if(Meteor.isServer){
  Collections = {};
  Collections.AllergyIntolerances = AllergyIntolerances;
  Collections.Conditions = Conditions;
  Collections.CarePlans = CarePlans;
  Collections.Devices = Devices;
  Collections.Claims = Claims;
  Collections.DiagnosticReports = DiagnosticReports;
  Collections.Encounters = Encounters;
  Collections.ExplanationOfBenefits = ExplanationOfBenefits;
  Collections.Immunizations = Immunizations;
  Collections.Medications = Medications;
  Collections.MedicationOrders = MedicationOrders;
  Collections.MedicationStatements = MedicationStatements;
  Collections.Observations = Observations;
  Collections.Patients = Patients;
  Collections.Procedures = Procedures;
  Collections.ValueSets = ValueSets;
}



//---------------------------------------------------------------------------
// Main Application  

MedicalRecordImporter = {
  pluralizeResourceName: function(resourceType){
    var pluralized = '';
    switch (resourceType) {
      case 'Binary':          
        pluralized = 'Binaries';
        break;
      case 'Library':      
        pluralized = 'Libraries';
        break;
      case 'SupplyDelivery':      
        pluralized = 'SupplyDeliveries';
        break;
      case 'ImagingStudy':      
        pluralized = 'ImagingStudies';
        break;        
      case 'FamilyMemberHistory':      
        pluralized = 'FamilyMemberHistories';
        break;        
      case 'ResearchStudy':      
        pluralized = 'ResearchStudies';
        break;        
      default:
        pluralized = resourceType + 's';
        break;
    }

    return pluralized;
  },
  importBundle: function(dataContent, collectionRoot){    
    console.log('MedicalRecordImporter.importBundle()');
    // console.log('dataContent', dataContent);

    let self = this;

    let parsedResults = {};

    if(typeof dataContent === "string"){
      parsedResults = JSON.parse(dataContent);
    } else if(has(dataContent, 'content')){
      if(typeof dataContent.content === "string"){
        parsedResults = JSON.parse(dataContent.content);
      } else {
        parsedResults = dataContent.content;
      }
    } else {
      parsedResults = dataContent;
    }


    if(get(parsedResults, 'resourceType') === "Bundle"){
      console.log('Found a FHIR bundle! There appear to be ' + parsedResults.entry.length + ' resources in the bundle.  Attempting import...')

      // as a Bundle, we know it's going to have an entries array
      // so, we're going to loop through each entry, looking for it's resources
      if(Array.isArray(parsedResults.entry)){
        parsedResults.entry.forEach(function(entry){          
          if(get(entry, 'resource.resourceType')){
            // console.log('Found a ' + get(entry, 'resource.resourceType'));

            var newRecord = entry.resource;
            // console.log('newRecord', newRecord)
  
            if(!newRecord.id){
              if(newRecord._id){
                newRecord.id = entry.resource._id;
              } else {
                let newId = Random.id();
                newRecord.id = newId;
                newRecord._id = newId;
              }
            }
            //console.log("Collections", JSON.stringify(Collections))
            let collectionName = self.pluralizeResourceName(get(entry, 'resource.resourceType'))            

            // console.log('collectionName', collectionName)
            
              if(Collections[collectionName]){
                //console.log('Collections[collectionName]', Collections[collectionName])
                
                if(!Collections[collectionName].findOne({_id: newRecord._id})){                  
                  //console.log('Couldnt find record; attempting to insert.')
                  let newRecordId = Collections[collectionName].insert(newRecord, function(error, newRecordId){
                    if(error) {
                      console.log('window(self.pluralizeResourceName(entry.resource.resourceType))._collection.insert.error', error)
                    }
                    if(newRecordId){
                      console.log('New ' + get(entry, 'resource.resourceType') + ' record created: ' + newRecordId)
                    }
                  });   
                }  
              }  

          }
        })
      }
    }

  
    return true
  }
}

export default MedicalRecordImporter;