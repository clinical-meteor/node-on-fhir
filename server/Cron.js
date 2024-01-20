
import { SyncedCron } from 'meteor/littledata:synced-cron';

import moment from 'moment';
import { Meteor } from 'meteor/meteor';

import { get, has } from 'lodash';


import { 
  AllergyIntolerances,
  Bundles,
  CarePlans,
  Conditions,
  Communications,
  CommunicationRequests,
  Devices,
  Encounters, 
  Endpoints,
  HealthcareServices,
  Immunizations,
  InsurancePlans,
  Lists,
  Locations,
  Medications,
  MedicationOrders,
  MedicationStatements,
  MessageHeaders,
  Measures,
  MeasureReports,
  OrganizationAffiliations,
  Organizations,
  Observations, 
  Patients,
  Practitioners,
  PractitionerRoles,
  Procedures,
  Questionnaires,
  QuestionnaireResponses,
  Tasks,
  ServerStats,
  FhirUtilities
} from 'meteor/clinical:hl7-fhir-data-infrastructure';


//---------------------------------------------------------------------------
// Collections

// this is a little hacky, but it works to access our collections.
// we use to use Mongo.Collection.get(collectionName), but in Meteor 1.3, it was deprecated
// we then started using window[collectionName], but that only works on the client
// so we now take the window and 

let Collections = {};

if(Meteor.isServer){
  Collections.AllergyIntolerances = AllergyIntolerances;
  Collections.Bundles = Bundles;
  Collections.CarePlans = CarePlans;
  Collections.Conditions = Conditions;
  Collections.Communications = Communications;
  Collections.CommunicationRequests = CommunicationRequests;
  Collections.CommunicationResponses = CommunicationResponses;
  Collections.Devices = Devices;  
  Collections.Encounters = Encounters;
  Collections.Endpoints = Endpoints;
  Collections.HealthcareServices = HealthcareServices;
  Collections.Immunizations = Immunizations;
  Collections.InsurancePlans = InsurancePlans;
  Collections.Lists = Lists;
  Collections.Locations = Locations;
  Collections.Medications = Medications;
  Collections.MedicationOrders = MedicationOrders;
  Collections.MedicationStatements = MedicationStatements;
  Collections.MessageHeaders = MessageHeaders;
  Collections.Measures = Measures;
  Collections.MeasureReports = MeasureReports;
  Collections.OrganizationAffiliations = OrganizationAffiliations;
  Collections.Organizations = Organizations;
  Collections.Observations = Observations;
  Collections.Patients = Patients;
  Collections.Practitioners = Practitioners;
  Collections.PractitionerRoles = PractitionerRoles;
  Collections.Procedures = Procedures;
  Collections.Questionnaires = Questionnaires;
  Collections.QuestionnaireResponses = QuestionnaireResponses;
  Collections.Tasks = Tasks;
  Collections.ServerStats = ServerStats;
}

Meteor.startup(function(){
  if(get(Meteor, 'settings.private.enableCronAutomation')){
    console.log("Starting the TaskManager....")
    SyncedCron.start();
  }
  if(get(Meteor, 'settings.private.enableTaskManager')){
    SyncedCron.add({
      name: 'TaskManager Monitor',
      schedule: function(parser) {
        return parser.text('every 1 minute');
      },
      job: function() {
          console.log('TaskManager!  ' + Tasks.find().count() + ' tasks in the Task collection.')     
      }
    });
  } 
  if(get(Meteor, 'settings.private.enableServerStats')){
    SyncedCron.add({
      name: 'Server Stats Generator',
      schedule: function(parser) {
        return parser.text('every 5 minute');
      },
      job: function() {
          console.log('Generating server stats!')   
          
          let restEndpoints = get(Meteor, "settings.private.fhir.rest")
          process.env.TRACE &&  console.log('restEndpoints', restEndpoints)

          let serverStats = {
            "referenceType": "ServerStats",
            "timestamp": new moment()
          }
          
          Object.keys(restEndpoints).forEach(function(key){
            // console.log('key', FhirUtilities.pluralizeResourceName(key))
            if(typeof Collections[FhirUtilities.pluralizeResourceName(key)] !== "undefined"){
              // console.log('Collections[key]', Collections[FhirUtilities.pluralizeResourceName(key)].find().count())
              serverStats[FhirUtilities.pluralizeResourceName(key)] = Collections[FhirUtilities.pluralizeResourceName(key)].find().count()
            }
          })

          // console.log('Generating server stats: ')
          // console.log(serverStats)

          ServerStats.insert(serverStats)
      }
    });
  }   
})






