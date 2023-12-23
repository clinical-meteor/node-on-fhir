import { Meteor } from 'meteor/meteor';
import { AccountsServer } from '@accounts/server';
import { wrapMeteorServer } from '@accounts/meteor-adapter';
import { Mongo } from '@accounts/mongo';

import { HTTP } from 'meteor/http';
import { get, has, set } from 'lodash';

import { check } from 'meteor/check';
import sanitize from 'mongo-sanitize';

import { parseRpcAuthorization } from './main';
import { accountsServer } from './AccountsServer';

 wrapMeteorServer(Meteor, accountsServer);

//  import { 
//   AllergyIntolerances,
//   Bundles,
//   CarePlans,
//   Conditions,
//   Communications,
//   CommunicationRequests,
//   CommunicationResponses,
//   Devices,
//   Encounters, 
//   Immunizations,
//   Lists,
//   Locations,
//   Medications,
//   MedicationOrders,
//   MedicationStatements,
//   MessageHeaders,
//   Measures,
//   MeasureReports,
//   Organizations,
//   Observations, 
//   Patients,
//   Procedures,
//   Questionnaires,
//   QuestionnaireResponses,
//   Tasks,
//   FhirUtilities
// } from 'meteor/clinical:hl7-fhir-data-infrastructure';


//---------------------------------------------------------------------------
// Collections

// this is a little hacky, but it works to access our collections.
// we use to use Mongo.Collection.get(collectionName), but in Meteor 1.3, it was deprecated
// we then started using window[collectionName], but that only works on the client
// so we now take the window and 

let Collections = {};

if(Meteor.isClient){
  Collections = window;
}
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
  Collections.Immunizations = Immunizations;
  Collections.Lists = Lists;
  Collections.Locations = Locations;
  Collections.Medications = Medications;
  Collections.MedicationOrders = MedicationOrders;
  Collections.MedicationStatements = MedicationStatements;
  Collections.MessageHeaders = MessageHeaders;
  Collections.Measures = Measures;
  Collections.MeasureReports = MeasureReports;
  Collections.Organizations = Organizations;
  Collections.Observations = Observations;
  Collections.Patients = Patients;
  Collections.Procedures = Procedures;
  Collections.Questionnaires = Questionnaires;
  Collections.QuestionnaireResponses = QuestionnaireResponses;
  Collections.Tasks = Tasks;
}

 import { 
  AllergyIntolerances,
  Bundles,
  CarePlans,
  Conditions,
  Communications,
  CommunicationRequests,
  CommunicationResponses,
  Devices,
  Encounters, 
  Immunizations,
  Lists,
  Locations,
  Medications,
  MedicationOrders,
  MedicationStatements,
  MessageHeaders,
  Measures,
  MeasureReports,
  Organizations,
  Observations, 
  Patients,
  Procedures,
  Questionnaires,
  QuestionnaireResponses,
  Tasks,
  FhirUtilities
} from 'meteor/clinical:hl7-fhir-data-infrastructure';


//---------------------------------------------------------------------------
// Collections

// this is a little hacky, but it works to access our collections.
// we use to use Mongo.Collection.get(collectionName), but in Meteor 1.3, it was deprecated
// we then started using window[collectionName], but that only works on the client
// so we now take the window and 

// let Collections = {};

// if(Meteor.isClient){
//   Collections = window;
// }
// if(Meteor.isServer){
//   Collections.AllergyIntolerances = AllergyIntolerances;
//   Collections.Bundles = Bundles;
//   Collections.CarePlans = CarePlans;
//   Collections.Conditions = Conditions;
//   Collections.Communications = Communications;
//   Collections.CommunicationRequests = CommunicationRequests;
//   Collections.CommunicationResponses = CommunicationResponses;
//   Collections.Devices = Devices;  
//   Collections.Encounters = Encounters;
//   Collections.Immunizations = Immunizations;
//   Collections.Lists = Lists;
//   Collections.Locations = Locations;
//   Collections.Medications = Medications;
//   Collections.MedicationOrders = MedicationOrders;
//   Collections.MedicationStatements = MedicationStatements;
//   Collections.MessageHeaders = MessageHeaders;
//   Collections.Measures = Measures;
//   Collections.MeasureReports = MeasureReports;
//   Collections.Organizations = Organizations;
//   Collections.Observations = Observations;
//   Collections.Patients = Patients;
//   Collections.Procedures = Procedures;
//   Collections.Questionnaires = Questionnaires;
//   Collections.QuestionnaireResponses = QuestionnaireResponses;
//   Collections.Tasks = Tasks;
// }


Meteor.methods({
  // query data from a fhirUrl endpoint
  queryEndpoint: async function(fhirUrl, httpAccessToken, meteorSessionToken){
    check(fhirUrl, String);
    // check(httpAccessToken, String);

    let isAuthorized = await parseRpcAuthorization(meteorSessionToken);
    process.env.DEBUG_ACCOUNTS && console.log('isAuthorized', isAuthorized)

    if(isAuthorized){
      // check(fhirUrl, String)
      // check(httpAccessToken, Match.Maybe(String));
  
      if(get(Meteor, 'settings.private.proxyServerEnabled')){
  
        console.log('ProxyServer: Query Endpoint: ', fhirUrl)
        process.env.DEBUG && console.log('httpAccessToken:    ', httpAccessToken)
  
        let httpHeaders = { headers: {
            'Accept': ['application/json', 'application/fhir+json'],
            'Access-Control-Allow-Origin': '*'          
        }}

        if(get(Meteor, 'settings.private.fhir.fhirServer.auth.bearerToken')){
            httpAccessToken = get(Meteor, 'settings.private.fhir.fhirServer.auth.bearerToken');
        }

        if(httpAccessToken){
            httpHeaders.headers["Authorization"] = 'Bearer ' + httpAccessToken;
        }

        process.env.DEBUG && console.log('httpHeaders', httpHeaders)

        return await HTTP.get(fhirUrl, httpHeaders);

      } else {
        console.log('==========================================')
        console.log('ProxyServer:  Proxy server disabled.  Please check the Meteor.settings file.')
        console.log('Meteor.settings.private.proxyServerEnabled')
        
        return "ProxyServer:  Proxy server disabled."
      }
    } else {
      console.log('ProxyServer:  Unauthorized request.')   
      return "ProxyServer:  Unauthorized request." 
    }
  },
  // relay the payload to the specified fhirUrl using a POST operation
  postRelay: async function(fhirUrl, options, meteorSessionToken){
    check(fhirUrl, String);
    check(options, Object);

    console.log('Relaying a message...');
    let isAuthorized = await parseRpcAuthorization(meteorSessionToken);
    if(isAuthorized){
      if(get(Meteor, 'settings.private.proxyServerEnabled')){

        console.log('Relay Endpoint: ', fhirUrl);
  
        let self = this;
  
        let queryResult;
        let httpHeaders = { headers: {
            'Content-Type': 'application/fhir+json',
            'Access-Control-Allow-Origin': '*'          
        }}
  
        if(get(Meteor, 'settings.private.interfaces.fhirServer.auth.bearerToken')){
          httpHeaders.headers["Authorization"] = 'Bearer ' + get(Meteor, 'settings.private.interfaces.fhirServer.auth.bearerToken');
        }
  
        console.log('httpHeaders', httpHeaders)
  
        return await HTTP.post(fhirUrl, {
          headers: httpHeaders,
          data: options.payload
        }, function(error, result){
          if(error){
            console.error('error', error);
          }
          if(result){
            console.log('result', result);
            return result;
          }
        });
      } else {
          console.log('==========================================')
          console.log('*** Proxy server disabled *** ')
  
          return "Proxy server disabled."
      }  
    }
  },
  // insert a FHIR bundle into the data warehouse (i.e. proxy it to the Mongo database)
  insertBundleIntoWarehouse: async function(proxiedInsertRequest, meteorSessionToken){
    check(proxiedInsertRequest, Object);

    process.env.TRACE && console.log('proxiedInsertRequest', proxiedInsertRequest)
    process.env.TRACE && console.log('meteorSessionToken', meteorSessionToken)

    let isAuthorized = await parseRpcAuthorization(meteorSessionToken);
    if(get(Meteor, 'settings.private.accessControl.enableUnsafeProxy')) {
      isAuthorized = true;
    }
    if(isAuthorized){      
      if(get(proxiedInsertRequest, 'resourceType') === "Bundle"){
        console.log('Received a Bundle to proxy insert.')
        if(Array.isArray(proxiedInsertRequest.entry)){
          // looping through each of the Bundle entries
          proxiedInsertRequest.entry.forEach(function(proxyInsertEntry){
            if(get(proxyInsertEntry, 'resource')){
              // we are running this, assuming that PubSub is in place and synchronizing data cursors
              console.log('ProxyInsert - Received a proxy request for a ' + get(proxyInsertEntry, 'resource.resourceType'))
  
              let response = false;
              // console.log('Collections', Collections)
              
              // console.log('FhirUtilities.pluralizeResourceName: ' + FhirUtilities.pluralizeResourceName(get(proxyInsertEntry, 'resource.resourceType')))
              // the cursor appears to exist
              let collectionName = FhirUtilities.pluralizeResourceName(get(proxyInsertEntry, 'resource.resourceType'))
              if(typeof Collections[collectionName] === "object"){
  
                
                let sanitizedResourceId = sanitize(proxyInsertEntry.resource._id);

                if(get(proxyInsertEntry.resource, 'resourceType') === "Patient"){
                  console.log(FhirUtilities.assembleName(get(proxyInsertEntry.resource, 'name[0]')))
                  set(proxyInsertEntry.resource, 'name[0].text', FhirUtilities.assembleName(get(proxyInsertEntry.resource, 'name[0]')));
                }

                
                // there doesnt seem to be a pre-existing record
                if(!Collections[FhirUtilities.pluralizeResourceName(get(proxyInsertEntry, 'resource.resourceType'))].findOne({_id: sanitizedResourceId })){
                  console.log('Couldnt find record.  Inserting.')
  
                  // lets try to insert the record
                  response = Collections[FhirUtilities.pluralizeResourceName(get(proxyInsertEntry, 'resource.resourceType'))].insert(proxyInsertEntry.resource, {validate: false, filter: false}, function(error){
                    if(error) {
                      console.log('window(FhirUtilities.pluralizeResourceName(resource.resourceType)).insert.error', error)
                    }                    
                  });   
                } else {
                  console.log('Found a pre-existing copy of the record.  Thats weird and probably shouldnt be happening.');
                }  
              } else {
                console.log(collectionName + ' cursor doesnt appear to exist');
              }
  
              return response;  
            } else {
              console.log('Received a request for a proxy insert, but no FHIR resource was attached to the received parameters object!');
            }
          })
        } else {
          console.log("Bundle does not seem to have an array of entries.")
        }

        if(accessToken){
            httpHeaders.headers["Authorization"] = 'Bearer ' + accessToken;
        }

        console.log('httpHeaders', httpHeaders)

        return await HTTP.get(fhirUrl, httpHeaders);

      } else {
        // just a single resource, no need to loop through anything

        let resourceToParse;
        let resourceType = "";
        if(get(proxiedInsertRequest, 'resource.resourceType')){
          resourceType = get(proxiedInsertRequest, 'resource.resourceType');
          resourceToParse = get(proxiedInsertRequest, 'resource');
        } else if(get(proxiedInsertRequest, 'resourceType')){
          resourceType = get(proxiedInsertRequest, 'resourceType');
          resourceToParse = proxiedInsertRequest;
        }
  
        let collectionName = FhirUtilities.pluralizeResourceName(resourceType)
        if(typeof Collections[collectionName] === "object"){
  
          // there doesnt seem to be a pre-existing record
          if(!Collections[FhirUtilities.pluralizeResourceName(resourceType)].findOne({_id: sanitize(get(resourceToParse, '_id'))})){
            process.env.DEBUG && console.log('Couldnt find record; add a ' + FhirUtilities.pluralizeResourceName(resourceType) + ' to the database.')
  
            // lets try to insert the record
            response = Collections[FhirUtilities.pluralizeResourceName(resourceType)].insert(resourceToParse, {validate: false, filter: false}, function(error){
              if(error) {
                process.env.TRACE && console.log('window(FhirUtilities.pluralizeResourceName(resource.resourceType)).insert.error', error)
              }                    
            });   
          } else {
            process.env.DEBUG && console.log('ProxyServer: Found a pre-existing copy of the record.  Thats weird and probably shouldnt be happening.');
            return 'ProxyServer: Found a pre-existing copy of the record.  Thats weird and probably shouldnt be happening.';
          }  
        } else {
          process.env.DEBUG && console.log('ProxyServer: ' + collectionName + ' cursor doesnt appear to exist');
          return 'ProxyServer: ' + collectionName + ' cursor doesnt appear to exist';
        }
      }        
    }
  },
  // insert a FHIR resource into the data warehouse (i.e. proxy it to the Mongo database)
  insertResourceIntoWarehouse: async function(proxiedInsertRequest, meteorSessionToken){
    check(proxiedInsertRequest, Object);

    let isAuthorized = await parseRpcAuthorization(meteorSessionToken);
    if(get(Meteor, 'settings.private.accessControl.enableUnsafeProxy')) {
      isAuthorized = true;
    }
    if(isAuthorized){
      if(proxiedInsertRequest){
        // we are running this, assuming that PubSub is in place and synchronizing data cursors
        process.env.DEBUG && console.log('ProxyInsert - Received a proxiedInsertRequest to add to the distributed database.', proxiedInsertRequest)
          
        let response = false;
        // console.log('Collections', Collections)

        // console.log('FhirUtilities.pluralizeResourceName: ' + FhirUtilities.pluralizeResourceName(get(proxiedInsertRequest, 'resource.resourceType')))
        // the cursor appears to exist
        if(typeof Collections[FhirUtilities.pluralizeResourceName(get(proxiedInsertRequest, 'resourceType'))] === "object"){

          // there doesnt seem to be a pre-existing record
          if(!Collections[FhirUtilities.pluralizeResourceName(get(proxiedInsertRequest, 'resourceType'))].findOne({_id: sanitize(proxiedInsertRequest._id)})){
            process.env.DEBUG && console.log('Couldnt find record; attempting to add one to the database.')

            // lets try to insert the record
            response = Collections[FhirUtilities.pluralizeResourceName(get(proxiedInsertRequest, 'resourceType'))].insert(proxiedInsertRequest, {validate: false, filter: false}, function(error){
              if(error) {
                process.env.TRACE && console.log('window(FhirUtilities.pluralizeResourceName(resourceType)).insert.error', error)
              }                    
            });   
          } else {
            process.env.DEBUG && console.log('Found a pre-existing copy of the record.  Thats weird and probably shouldnt be happening.');
            return 'Found a pre-existing copy of the record.  Thats weird and probably shouldnt be happening.';
          }  
        } else {
          process.env.DEBUG && console.log('Cursor doesnt appear to exist');
          return 'Cursor doesnt appear to exist';
        }

        return response;
      } else {
        process.env.DEBUG && console.log('ProxyServer: Received a request for a proxy insert, but received no FHIR resource!');
        return 'ProxyServer: Received a request for a proxy insert, but received no FHIR resource!'
      }
    }
  }
});
