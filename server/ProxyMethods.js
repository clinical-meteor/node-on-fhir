import { Meteor } from 'meteor/meteor';
import { AccountsServer } from '@accounts/server';
import { wrapMeteorServer } from '@accounts/meteor-adapter';

import { HTTP } from 'meteor/http';
import { get } from 'lodash';

import { check } from 'meteor/check';
import sanitize from 'mongo-sanitize';

// AccountsServer.config({}); // Config your accounts server
// if((!get(Meteor.server.method_handlers, 'jsaccounts/validateLogout')) && (!get(Meteor.server.method_handlers, 'jsaccounts/validateLogin'))){
//   wrapMeteorServer(Meteor, AccountsServer);
// }

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


Meteor.methods({
  // query data from a fhirUrl endpoint
  queryEndpoint: async function(fhirUrl, accessToken){
    check(fhirUrl, String);
    check(accessToken, String);

    if(this.userId){
      // check(fhirUrl, String)
      // check(accessToken, Match.Maybe(String));
  
      if(get(Meteor, 'settings.private.proxyServerEnabled')){
  
        console.log('Query Endpoint: ', fhirUrl)
        console.log('AccessToken:    ', accessToken)
  
        let httpHeaders = { headers: {
            'Accept': ['application/json', 'application/fhir+json'],
            'Access-Control-Allow-Origin': '*'          
        }}

        if(get(Meteor, 'settings.private.fhir.fhirServer.auth.bearerToken')){
            accessToken = get(Meteor, 'settings.private.fhir.fhirServer.auth.bearerToken');
        }

        if(accessToken){
            httpHeaders.headers["Authorization"] = 'Bearer ' + accessToken;
        }

        console.log('httpHeaders', httpHeaders)

        return await HTTP.get(fhirUrl, httpHeaders);

      } else {
          console.log('==========================================')
          console.log('ProxyServer:  Disabled.  Please check the Meteor.settings file.')    

          return "Proxy server disabled."
      }
    } else {
      console.log('ProxyServer:  Unauthorized request.')   
      return "Unauthorized." 
    }

  },
  // relay the payload to the specified fhirUrl using a POST operation
  postRelay: async function(fhirUrl, options){
    check(fhirUrl, String);
    check(options, Object);

    console.log('Relaying a message...');

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
          console.log('error', error);
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
  },
  // insert a FHIR bundle into the data warehouse (i.e. proxy it to the Mongo database)
  insertBundleIntoWarehouse: function(proxiedInsertRequest){
    check(proxiedInsertRequest, Object);

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
            if(typeof Collections[FhirUtilities.pluralizeResourceName(get(proxyInsertEntry, 'resource.resourceType'))] === "object"){

              let cleanedId = sanitize(proxyInsertEntry.resource._id);
              // there doesnt seem to be a pre-existing record
              if(!Collections[FhirUtilities.pluralizeResourceName(get(proxyInsertEntry, 'resource.resourceType'))].findOne({_id: cleanedId})){
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
              console.log('Cursor doesnt appear to exist');
            }

            return response;  
          } else {
            console.log('Received a request for a proxy insert, but no FHIR resource was attached to the received parameters object!');
          }
        })
      } else {
        console.log("Bundle does not seem to have an array of entries.")
      }
    } else {
      // just a single resource, no need to loop through anything

      if(typeof Collections[FhirUtilities.pluralizeResourceName(get(proxiedInsertRequest, 'resource.resourceType'))] === "object"){

        // there doesnt seem to be a pre-existing record
        if(!Collections[FhirUtilities.pluralizeResourceName(get(proxiedInsertRequest, 'resource.resourceType'))].findOne({_id: sanitize(proxiedInsertRequest.resource._id)})){
          console.log('Couldnt find record; add a ' + FhirUtilities.pluralizeResourceName(get(proxiedInsertRequest, 'resource.resourceType')) + ' to the database.')

          // lets try to insert the record
          response = Collections[FhirUtilities.pluralizeResourceName(get(proxiedInsertRequest, 'resource.resourceType'))].insert(proxiedInsertRequest.resource, {validate: false, filter: false}, function(error){
            if(error) {
              console.log('window(FhirUtilities.pluralizeResourceName(resource.resourceType)).insert.error', error)
            }                    
          });   
        } else {
          console.log('Found a pre-existing copy of the record.  Thats weird and probably shouldnt be happening.');
        }  
      } else {
        console.log('Cursor doesnt appear to exist');
      }
    }    
  },
  // insert a FHIR resource into the data warehouse (i.e. proxy it to the Mongo database)
  insertResourceIntoWarehouse: function(proxiedInsertRequest){
    check(proxiedInsertRequest, Object);

    if (get(Meteor, 'settings.private.allowUnsafeProxy')) {
      if(proxiedInsertRequest){
        // we are running this, assuming that PubSub is in place and synchronizing data cursors
        console.log('ProxyInsert - Received a proxiedInsertRequest to add to the distributed database.', proxiedInsertRequest)
          
        let response = false;
        // console.log('Collections', Collections)

        // console.log('FhirUtilities.pluralizeResourceName: ' + FhirUtilities.pluralizeResourceName(get(proxiedInsertRequest, 'resource.resourceType')))
        // the cursor appears to exist
        if(typeof Collections[FhirUtilities.pluralizeResourceName(get(proxiedInsertRequest, 'resourceType'))] === "object"){

          let cleanedId = sanitize(proxiedInsertRequest._id);
          // there doesnt seem to be a pre-existing record
          if(!Collections[FhirUtilities.pluralizeResourceName(get(proxiedInsertRequest, 'resourceType'))].findOne({_id: cleanedId})){
            console.log('Couldnt find record; attempting to add one to the database.')

            // lets try to insert the record
            response = Collections[FhirUtilities.pluralizeResourceName(get(proxiedInsertRequest, 'resourceType'))].insert(proxiedInsertRequest, {validate: false, filter: false}, function(error){
              if(error) {
                console.log('window(FhirUtilities.pluralizeResourceName(resourceType)).insert.error', error)
              }                    
            });   
          } else {
            console.log('Found a pre-existing copy of the record.  Thats weird and probably shouldnt be happening.');
          }  
        } else {
          console.log('Cursor doesnt appear to exist');
        }

        return response;
      } else {
        console.log('Received a request for a proxy insert, but received no FHIR resource!');
      }
    } else {
      console.log('Received a request for a proxy insert, but user was not logged in!');
      return "User not logged in!"
    }
  }
});
