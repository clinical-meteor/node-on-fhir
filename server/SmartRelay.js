import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { FhirUtilities } from 'fhir-starter';

import { get, set, unset, has, pick, cloneDeep } from 'lodash';
import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import { CarePlans, CareTeams, Consents, Conditions, Encounters, Goals, Immunizations, Observations, Patients, Procedures, Practitioners, QuestionnaireResponses, Tasks } from 'meteor/clinical:hl7-fhir-data-infrastructure';
import { HipaaLogger } from 'meteor/clinical:hipaa-logger';
import moment from 'moment';
import sanitize from 'mongo-sanitize';

const smart = require("fhirclient");
const Session = require("./Session");

import { oauth2 as SMART } from "fhirclient";

// var session = require('express-session');


///------------------------------------------------------------------------------------
"CarePlan", "Condition", "Goal", "Immunization", "Observation", "Procedure"
let Collections = {};

Collections.CarePlans = CarePlans;
Collections.Conditions = Conditions;
Collections.Consents = Consents;
Collections.Encounters = Encounters;
Collections.Goals = Goals;
Collections.Immunizations = Immunizations;
Collections.Observations = Observations;
Collections.Patients = Patients;
Collections.Procedures = Procedures;
Collections.QuestionnaireResponses = QuestionnaireResponses;

///------------------------------------------------------------------------------------


// This is our storage factory function. It will be called with request and response and is
// expected to return a storage object that implements the basic storage interface found at
// https://github.com/smart-on-fhir/client-js/blob/master/src/ServerStorage.js
function getStorage({ request, response }) {
    const session = Session.fromRequest(request) || new Session();
    response.setHeader("Set-Cookie", session.cookie);
    return session;
}

// Just a simple function to reply back with some data (the current patient if
// we know who he is, or all patients otherwise
async function smartHandler(client, res) {
    const data = await (client.patient.id
        ? client.patient.read()
        : client.request("Patient"));
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify(data, null, 4));
}

// JsonRoutes.setResponseHeaders({
//     "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
//     "Access-Control-Allow-Header": "*",
//     "Access-Control-Allow-Origin": "*"
// })

JsonRoutes.add('get', '/node-launch', function (req, res, next) {
    console.log('SmartRelay: GET /node-launch req.headers', req.headers);
    console.log('SmartRelay: GET /node-launch req.query', req.query);
    console.log('SmartRelay: GET /node-launch req.params', req.params);
    console.log('SmartRelay: GET /node-launch req.body', req.body);

    let interceptedReq = cloneDeep(req);
    set(interceptedReq, 'headers.Access-Control-Allow-Origin', '*')
    set(interceptedReq, 'headers.access-control-allow-origin', '*')

    if(get(interceptedReq, 'headers.x-forwarded-host') === "localhost:3000"){
        set(interceptedReq, 'headers.x-forwarded-host', 'localhost')
    }
    if(get(interceptedReq, 'headers.host') === "localhost:3000"){
        set(interceptedReq, 'headers.host', 'localhost')
    }
    if(get(interceptedReq, 'headers.origin') === "http://localhost:3000"){
        set(interceptedReq, 'headers.origin', 'http://localhost')
    }

    unset(interceptedReq, 'headers.x-forwarded-host');
    unset(interceptedReq, 'headers.x-forwarded-proto');
    unset(interceptedReq, 'headers.x-forwarded-port');
    unset(interceptedReq, 'headers.x-forwarded-for');
    unset(interceptedReq, 'headers.referer');

    console.log('interceptedReq', interceptedReq.headers);

    let smartConfig = {
        "client_id": get(req.query, "client_id"),
        "scope": get(req.query, "scope"),
        "redirect_uri": get(req.query, "redirect_uri"),
        "iss": get(req.query, "iss"),
        "response_type": "code"
    }

    console.log('SmartRelay.smartConfig', smartConfig)

    smart(interceptedReq, res, getStorage).authorize(smartConfig);
});


JsonRoutes.add('get', '/node-provider-launch', function (req, res, next) {
    console.log('SmartRelay: GET /node-provider-launch');

    process.env.DEBUG && console.log('SmartRelay: GET /node-provider-launch req.headers', req.headers);
    process.env.DEBUG && console.log('SmartRelay: GET /node-provider-launch req.query', req.query);
    process.env.DEBUG && console.log('SmartRelay: GET /node-provider-launch req.params', req.params);
    process.env.DEBUG && console.log('SmartRelay: GET /node-provider-launch req.body', req.body);

    let interceptedReq = cloneDeep(req);
    set(interceptedReq, 'headers.Access-Control-Allow-Origin', '*')
    set(interceptedReq, 'headers.access-control-allow-origin', '*')

    if(get(interceptedReq, 'headers.x-forwarded-host') === "localhost:3000"){
        set(interceptedReq, 'headers.x-forwarded-host', 'localhost')
    }
    if(get(interceptedReq, 'headers.host') === "localhost:3000"){
        set(interceptedReq, 'headers.host', 'localhost')
    }
    if(get(interceptedReq, 'headers.origin') === "http://localhost:3000"){
        set(interceptedReq, 'headers.origin', 'http://localhost')
    }

    unset(interceptedReq, 'headers.x-forwarded-host');
    unset(interceptedReq, 'headers.x-forwarded-proto');
    unset(interceptedReq, 'headers.x-forwarded-port');
    unset(interceptedReq, 'headers.x-forwarded-for');
    unset(interceptedReq, 'headers.referer');

    process.env.DEBUG && console.log('interceptedReq', interceptedReq.headers);

    let smartConfig = {
        "response_type": "code"
    }

    if(Array.isArray(get(Meteor, 'settings.public.smartOnFhir'))){
      Meteor.settings.public.smartOnFhir.forEach(function(config){
        if((config.iss === get(req.query, "iss")) && (config.launchContext === "Provider")){
            Object.assign(smartConfig, config);
        }
      })
    }

    Object.assign(smartConfig, req.query);

    console.log('SmartRelay.smartConfig', smartConfig)

    smart(interceptedReq, res, getStorage).authorize(smartConfig);
});


// oops; need to remove
// refactor to /node-provider-launch
JsonRoutes.add('get', '/node-practitioner-launch', function (req, res, next) {
    console.log('SmartRelay: GET /node-practitioner-launch');
    console.log('NOTICE:  This route is being deprecated; please migrate to /node-provider-launch instead');

    let interceptedReq = cloneDeep(req);
    set(interceptedReq, 'headers.Access-Control-Allow-Origin', '*')
    set(interceptedReq, 'headers.access-control-allow-origin', '*')

    if(get(interceptedReq, 'headers.x-forwarded-host') === "localhost:3000"){
        set(interceptedReq, 'headers.x-forwarded-host', 'localhost')
    }
    if(get(interceptedReq, 'headers.host') === "localhost:3000"){
        set(interceptedReq, 'headers.host', 'localhost')
    }
    if(get(interceptedReq, 'headers.origin') === "http://localhost:3000"){
        set(interceptedReq, 'headers.origin', 'http://localhost')
    }

    unset(interceptedReq, 'headers.x-forwarded-host');
    unset(interceptedReq, 'headers.x-forwarded-proto');
    unset(interceptedReq, 'headers.x-forwarded-port');
    unset(interceptedReq, 'headers.x-forwarded-for');
    unset(interceptedReq, 'headers.referer');

    console.log('interceptedReq', interceptedReq.headers);

    let smartConfig = {
        "response_type": "code"
    }

    if(Array.isArray(get(Meteor, 'settings.public.smartOnFhir'))){
      Meteor.settings.public.smartOnFhir.forEach(function(config){
        if((config.iss === get(req.query, "iss")) && (config.launchContext === "Provider")){
            Object.assign(smartConfig, config);
        }
      })
    }

    Object.assign(smartConfig, req.query);

    console.log('SmartRelay.smartConfig', smartConfig)

    smart(interceptedReq, res, getStorage).authorize(smartConfig);
});



JsonRoutes.add('post', '/node-launch', function (req, res, next) {
    console.log('SmartRelay: POST /node-launch', req.headers);
    console.log('SmartRelay: POST /node-launch', req.query);
    console.log('SmartRelay: POST /node-launch', req.params);
    console.log('SmartRelay: POST /node-launch', req.body);

    let interceptedReq = cloneDeep(req);
    set(interceptedReq, 'headers.Access-Control-Allow-Origin', '*')
    set(interceptedReq, 'headers.access-control-allow-origin', '*')

    if(get(interceptedReq, 'headers.x-forwarded-host') === "localhost:3000"){
        set(interceptedReq, 'headers.x-forwarded-host', 'localhost')
    }
    if(get(interceptedReq, 'headers.host') === "localhost:3000"){
        set(interceptedReq, 'headers.host', 'localhost')
    }
    if(get(interceptedReq, 'headers.origin') === "http://localhost:3000"){
        set(interceptedReq, 'headers.origin', 'http://localhost')
    }

    unset(interceptedReq, 'headers.x-forwarded-host');
    unset(interceptedReq, 'headers.x-forwarded-proto');
    unset(interceptedReq, 'headers.x-forwarded-port');
    unset(interceptedReq, 'headers.x-forwarded-for');
    unset(interceptedReq, 'headers.referer');

    console.log('interceptedReq', interceptedReq.headers);

    // res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    // res.setHeader("Access-Control-Allow-Headers", "*");
    // res.setHeader("Access-Control-Allow-Origin", "*");

    smart(interceptedReq, res, getStorage).authorize({
        "client_id": get(req.body, "clientId"),
        "scope": get(req.body, "scope"),
        "redirect_uri": get(req.body, "redirectUri"),
        "iss": get(req.body, "iss")
    });
});


function precheckThenCreateRecord(record, resourceType){
    console.log('Prechecking record', record);
    let cleanedId = sanitize(get(record, 'data.id'));
    if(!Collections[FhirUtilities.pluralizeResourceName(resourceType)].findOne({id: cleanedId})){
        console.log(resourceType + ' not found.  Creating a new record.....')        
        Collections[FhirUtilities.pluralizeResourceName(resourceType)].insert(record, get(Meteor, 'settings.private.fhir.schemaValidation', {validate: false, filter: false}), function(err, result){
            if(err){console.log('err', err)}
            if(result){console.log('result', result)}
        });
    } else {
        console.log(resourceType + ' already exists.')        
    }
}
function parseBundleIntoCollection(bundle, resourceType){
    if(get(bundle, 'resourceType') === "Bundle"){
        console.log('Received a Bundle.  Parsing it for records to put into the ' + FhirUtilities.pluralizeResourceName(resourceType) + ' collection.');
        console.log('Checking that the ' + FhirUtilities.pluralizeResourceName(resourceType) + ' collection exists: ' + typeof Collections[FhirUtilities.pluralizeResourceName(resourceType)]);
        if(Array.isArray(bundle.entry)){
            bundle.entry.forEach(function(entry){
                if(get(entry.resource, 'verificationStatus.text') !== "Entered in Error"){     
                    let cleanedId = sanitize(get(entry.resource, 'id'));
                    if(Collections[FhirUtilities.pluralizeResourceName(resourceType)].findOne({id: cleanedId})){
                        console.log(resourceType + ' already exists.')        
                    } else {
                        Collections[FhirUtilities.pluralizeResourceName(resourceType)].insert(entry.resource, get(Meteor, 'settings.private.fhir.schemaValidation', {validate: false, filter: false}), function(err, result){
                            if(err){console.log('err', err)}
                            if(result){
                                console.log(resourceType + ' not found.  Creating it.  New record id: ' + result)     
                            }
                        });                    
                    }    
                } else {
                    console.log(resourceType + ' appears to be Entered in Error.  Skipping.')     
                }
            })
        }
        
    }
}


JsonRoutes.add('get', '/node-fhir-receiver', function (req, res, next) {
    console.log('SmartRelay: GET /node-fhir-receiver', req.headers);
    console.log('SmartRelay: GET /node-fhir-receiver', req.query);
    console.log('SmartRelay: GET /node-fhir-receiver', req.params);
    console.log('SmartRelay: GET /node-fhir-receiver', req.body);

    let interceptedReq = cloneDeep(req);
    set(interceptedReq, 'headers.Access-Control-Allow-Origin', '*');
    set(interceptedReq, 'headers.access-control-allow-origin', '*');

    if(get(interceptedReq, 'headers.x-forwarded-host') === "localhost:3000"){
        set(interceptedReq, 'headers.x-forwarded-host', 'localhost')
    }
    if(get(interceptedReq, 'headers.host') === "localhost:3000"){
        set(interceptedReq, 'headers.host', 'localhost')
    }
    if(get(interceptedReq, 'headers.origin') === "http://localhost:3000"){
        set(interceptedReq, 'headers.origin', 'http://localhost')
    }

    let relaySearchParams = new URLSearchParams(req.query);
    console.log('relaySearchParams', relaySearchParams.toString())

    
    console.log('Fetching patient protected health information....')
    smart(interceptedReq, res, getStorage).ready()
        .then(async function(client){
            console.log('===========================================================');
            console.log('SMART FETCH');
            console.log('')

            relaySearchParams.set('patientId', client.getPatientId())

            let redirectUrl = Meteor.absoluteUrl() + 'patient-chart?' + relaySearchParams.toString();
            console.log('SmartRelay.redirectUrl', redirectUrl)

            res.setHeader('Location', redirectUrl);
            res.setHeader('Access-Control-Allow-Origin', '*');

            let selectedPatient = await client.request("Patient/" + client.getPatientId());  


            JsonRoutes.sendResult(res, {
                code: 302,
                data: selectedPatient
            });

            // let metadataUrl = get(client.getState(), 'serverUrl') + "/metadata?_format=json";
            // console.log('SmartRelay.fetchingPHI.metadataUrl:   ', metadataUrl);
            // console.log('SmartRelay.fetchingPHI.accessToken: ', client.getState("tokenResponse.access_token"));

            // var httpHeaders = { headers: {
            //     'Accept': "application/json,application/fhir+json",
            //     "Authorization": "Bearer " + client.getState("tokenResponse.access_token")
            // }}

            // console.log('SmartRelay.fetchingPHI.httpHeaders:   ', httpHeaders);

            // if(client.getState("tokenResponse.access_token")){
            //     if(metadataUrl){            
            //         HTTP.get(metadataUrl, httpHeaders, function(error, conformanceStatement){
            //             let parsedCapabilityStatement = JSON.parse(get(conformanceStatement, "content"))
            //             console.log('Received a conformance statement for the server received via iss URL parameter.', parsedCapabilityStatement);

            //             let ehrLaunchCapabilities = FhirUtilities.parseCapabilityStatement(parsedCapabilityStatement);
            //             console.log("Result of parsing through the CapabilityStatement.  These are the ResourceTypes we can search for", ehrLaunchCapabilities);                    
            //         })
            //     }
            // }
            

            // you can try enabling the other observation categories
            // but its not clear if Epic/Cerner support them
            // cerner is pretty permissive on any of them, and just returns null values
            // but epic will error out the entire query
            // https://www.hl7.org/fhir/valueset-observation-category.html
            return {
                patient: selectedPatient,
                carePlans: await client.request("CarePlan?patient=Patient/" + client.getPatientId() + "&category=38717003"),
                diagnosises: await client.request("Condition?subject=Patient/" + client.getPatientId() + "&category=encounter-diagnosis"),
                problemlist: await client.request("Condition?subject=Patient/" + client.getPatientId() + "&category=problem-list-item"),
                // consents: await client.request("Consent?patient=Patient/" + client.getPatientId() + "&status=active"),
                encounters: await client.request("Encounter?subject=Patient/" + client.getPatientId()),
                goals: await client.request("Goal?patient=Patient/" + client.getPatientId()),
                immunizations: await client.request("Immunization?patient=Patient/" + client.getPatientId()),
                vitals: await client.request("Observation?subject=Patient/" + client.getPatientId() + '&category=vital-signs'),
                socialhistory: await client.request("Observation?subject=Patient/" + client.getPatientId() + '&category=social-history'),
                // exams: await client.request("Observation?subject=Patient/" + client.getPatientId() + '&category=exam'),
                // surveys: await client.request("Observation?subject=Patient/" + client.getPatientId() + '&category=survey'),
                // therapies: await client.request("Observation?subject=Patient/" + client.getPatientId() + '&category=therapy'),
                // activities: await client.request("Observation?subject=Patient/" + client.getPatientId() + '&category=activity'),
                procedures: await client.request("Procedure?patient=Patient/" + client.getPatientId())
            }
        })
        .then(function(json){
            console.log('json', json)

            console.log('-----------------------------------------------------------');
            console.log('')

            console.log('SmartRelay: POST /node-launch req,headers', get(json.req, "headers"));
            console.log('SmartRelay: POST /node-launch req.query', get(json.req, "query"));

            if(get(json.patient, 'resourceType') === "Patient"){
                console.log('Received a Patient')
                let cleanedPatientId = sanitize(get(json.patient, 'id'))
                if(!Patients.findOne({id: cleanedPatientId})){
                    console.log('Patient not found.  Inserting a new patient.....')        
                    Patients.insert(json.patient, get(Meteor, 'settings.private.fhir.schemaValidation', {validate: false, filter: false}), function(err, result){
                        if(err){console.log('err', err)}
                        if(result){console.log('result', result)}
                    });                    
                } else {
                    console.log('Patient already exists.')        
                }
            }



            parseBundleIntoCollection(json.carePlans, "CarePlan");
            parseBundleIntoCollection(json.diagnosises, "Condition");
            parseBundleIntoCollection(json.problemlist, "Condition");
            // parseBundleIntoCollection(json.consents, "Consent");  // practitioners only ?!
            parseBundleIntoCollection(json.encounters, "Encounter");
            parseBundleIntoCollection(json.goals, "Goal");
            parseBundleIntoCollection(json.immunizations, "Immunization");
            parseBundleIntoCollection(json.vitals, "Observation");
            parseBundleIntoCollection(json.socialhistory, "Observation");
            // parseBundleIntoCollection(json.exams, "Observation");
            // parseBundleIntoCollection(json.surveys, "Observation");
            // parseBundleIntoCollection(json.therapies, "Observation");
            // parseBundleIntoCollection(json.activities, "Observation");
            parseBundleIntoCollection(json.procedures, "Procedure");

        })
        .then(function(json){
            console.log('Fin')
        })
        .catch(function(json){
            console.log('Something went wrong', json)

            // res.setHeader('Location', Meteor.absoluteUrl() + 'patient-chart');
            // JsonRoutes.sendResult(res, {
            //     code: 302
            // });
        });


    // // let redirectHeaders = { 'content-type': 'application/json', 'authorization': `Bearer ${token}`, 'cache-control': 'no-cache', 'Location': '/patient-chart'};
    // // res.setHeader("Access-Control-Allow-Origin", "*");

    // res.setHeader('Location', Meteor.absoluteUrl() + 'patient-chart');

    // JsonRoutes.sendResult(res, {
    //     code: 302,
    //     data: 'foo'
    // });
});

