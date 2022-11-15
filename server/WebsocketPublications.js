
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import moment from 'moment';
import { get } from 'lodash';

import SimpleSchema from 'simpl-schema';
import { BaseSchema, DomainResourceSchema } from 'meteor/clinical:hl7-resource-datatypes';
import { OAuthClients, UdapCertificates} from 'meteor/clinical:hl7-fhir-data-infrastructure'

import { AccountsServer } from '@accounts/server';
// import { wrapMeteorServer } from '@accounts/meteor-adapter';


// TODO:  this could use a lot of improvement; but how?
// republish the NPM package?
// incorporate into base build?

// if((!get(Meteor.server.method_handlers, 'jsaccounts/validateLogout')) && (!get(Meteor.server.method_handlers, 'jsaccounts/validateLogin'))){
//     wrapMeteorServer(Meteor, AccountsServer);
// }



import base64url from 'base64-url';

import { 
    FhirUtilities, 
    AllergyIntolerances, 
    AuditEvents, 
    Bundles, 
    CodeSystems, 
    Conditions, 
    Consents, 
    Communications, 
    CommunicationRequests, 
    CarePlans, 
    CareTeams, 
    Claims,
    Devices, 
    DocumentReferences, 
    Encounters, 
    Endpoints, 
    HealthcareServices, 
    Immunizations, 
    InsurancePlans,
    Locations,  
    Medications, 
    Measures,
    MeasureReports,
    Networks,
    Observations, 
    Organizations, 
    OrganizationAffiliations, 
    Patients, 
    Practitioners, 
    PractitionerRoles, 
    Procedures, 
    Provenances, 
    Questionnaires, 
    QuestionnaireResponses, 
    Restrictions,
    SearchParameters, 
    StructureDefinitions, 
    Subscriptions,
    Tasks, 
    ValueSets,
    VerificationResults,
    ServerStats    
} from 'meteor/clinical:hl7-fhir-data-infrastructure';


let collectionNames = [
        "AllergyIntolerances",
        "AuditEvents",
        "Bundles",
        "CodeSystems",
        "Conditions",
        "Consents",
        "Communications",
        "CommunicationRequests",
        "CarePlans",
        "CareTeams",
        "Claims",
        "Devices",
        "DiagnosticReports",
        "DocumentReferences",
        "Encounters",
        "Endpoints",
        "ExplanationOfBenefits",
        "HealthcareServices",
        "Immunizations",
        "InsurancePlans",
        "Locations",
        "Medications",
        "Measure",
        "MeasureReports",
        "Networks",
        "OAuthClients",  // probably a security hole; should remove so it doesnt wind up on client
        "Observations",
        "Organizations",
        "OrganizationAffiliations",
        "Patients",
        "Practitioners",
        "PractitionerRoles",
        "Procedures",
        "Provenances",
        "Questionnaires",
        "QuestionnaireResponses",
        "Restrictions",
        "SearchParameters",
        "StructureDefinitions",
        "Subscriptions",
        "Tasks",
        "ValueSets",
        "VerificationResults",
        "UdapCertificates"
    ];

let Collections = {
    AllergyIntolerances: AllergyIntolerances,
    AuditEvents: AuditEvents,
    Bundles: Bundles,
    CodeSystems: CodeSystems,
    Conditions: Conditions,
    Consents: Consents,
    Communications: Communications,
    CommunicationRequests: CommunicationRequests,
    CarePlans: CarePlans,
    CareTeams: CareTeams,
    Claims: Claims,
    Devices: Devices,
    DiagnosticReports: DiagnosticReports,
    DocumentReferences: DocumentReferences,
    Encounters: Encounters,
    Endpoints: Endpoints,
    HealthcareServices: HealthcareServices,
    ExplanationOfBenefits: ExplanationOfBenefits,
    Immunizations: Immunizations,
    InsurancePlans: InsurancePlans,
    Locations: Locations,
    Medications: Medications,
    Measures: Measures,
    MeasureReports: MeasureReports,
    Networks: Networks,
    OAuthClients: OAuthClients,
    Observations: Observations,
    Organizations: Organizations,
    OrganizationAffiliations: OrganizationAffiliations,
    Patients: Patients,
    Practitioners: Practitioners,
    PractitionerRoles: PractitionerRoles,
    Procedures: Procedures,
    Provenances: Provenances,
    Questionnaires: Questionnaires,
    QuestionnaireResponses: QuestionnaireResponses,
    Restrictions: Restrictions,
    SearchParameters: SearchParameters,
    StructureDefinitions: StructureDefinitions,
    Subscriptions: Subscriptions,
    Tasks: Tasks,
    ValueSets: ValueSets,
    VerificationResults: VerificationResults,
    UdapCertificates: UdapCertificates
};

// console.log('Collections.Organizations', Collections.Organizations)
// console.log('Collections.UdapCertificates', Collections.UdapCertificates)


function setCollectionDefaultQuery(collectionName, subscriptionRecord){
    let defaultQuery;

    switch (collectionName) {
        case "Organizations":
            defaultQuery = {$and: [{name: {$exists: true}}, {address: {$exists: true}}]}
            break;
        case "Locations":
            defaultQuery = {$and: [{name: {$exists: true}}, {address: {$exists: true}}]}
            break;
        default:
            defaultQuery = {};
            break;
    }

    if(get(subscriptionRecord, 'criteria')){
        let criteriaString = get(subscriptionRecord, 'criteria');
        let criteriaJson = JSON.parse(criteriaString);
        // console.log('criteriaJson', criteriaJson);

        if(typeof criteriaJson === "object"){
            Object.assign(defaultQuery, criteriaJson);
        }
    }
    
    return defaultQuery
}


Meteor.startup(function(){
    console.log("Checking on Publications...");

    if(get(Meteor, 'settings.private.fhir.autoGenerateSubscriptionConfigs')){
        console.log('Auto-generating subscription records.');
    
        let collectionArray = Collections;
        if(Array.isArray(get(Meteor, 'settings.private.fhir.autoGenerateSubscriptionConfigs'))){
            collectionArray = get(Meteor, 'settings.private.fhir.autoGenerateSubscriptionConfigs');
            console.log('Auto-generation from configuration found in settings file.');
        } else {
            console.log('No collections specified.  Auto-generating publications for default collections (Argonaut).');
        }

        Object.keys(collectionArray).forEach(function(collectionName){
            let newSubscription = {
                "resourceType": "Subscription",
                "meta": {
                    "lastUpdated": new Date()
                },
                "status": "active",
                "criteria": "{}",
                "channel": {
                    "type": "websocket",
                    "endpoint": collectionName
                }
            }

            if(!Subscriptions.findOne({'channel.endpoint': collectionName})){
                Subscriptions.insert(newSubscription);
            }
        })
    };

    // this only runs once
    // how do we rerun subscriptions when they are updated?  
    Subscriptions.after.insert(function (userId, newSubscription) {

        process.env.DEBUG && console.log("---------------------------------------------------")
        process.env.DEBUG && console.log('Subscriptions.after.insert ')
        process.env.TRACE && console.log(newSubscription)
        process.env.TRACE && console.log("")

        // ********** if websockets **********
        if(get(newSubscription, 'channel.type') === "websocket"){
            let subscriptionEndpoint = get(newSubscription, 'channel.endpoint');
            if(Collections[subscriptionEndpoint]){
                Meteor.publish(subscriptionEndpoint, function(){
                    process.env.TRACE && console.log('>>>>>> ' + subscriptionEndpoint +  '.pubication.this.userId: ' + this.userId)               
                    if(this.userId){
                        defaultOptions.fields = {}
                    }         
                    return Collections[subscriptionEndpoint].find(defaultQuery, defaultOptions).forEach(function(record){
                        if(get(record, 'meta.security[0].display') !== "restricted"){
                            return record;
                        }
                    });
                });        
                    
            }
        }

        // ********** if REST **********
        if(get(newSubscription, 'channel.type') === "rest-hook"){
            // insert onAfter hook
            let subscriptionEndpoint = get(newSubscription, 'channel.endpoint');

            let urlComponentsArray = subscriptionEndpoint.split("/");
            let resourceName = urlComponentsArray[urlComponentsArray.length - 1];

            let collectionName = FhirUtilities.pluralizeResourceName(resourceName);
            Collections[collectionName].after.insert(function (userId, doc) {

                process.env.DEBUG && console.log("---------------------------------------------------")
                process.env.DEBUG && console.log(collectionName + '.after.insert ')
                process.env.DEBUG && console.log('Relay URL:  ')
                process.env.TRACE && console.log(doc)
                process.env.TRACE && console.log("")

                // build URL string
                if(doc.status === "draft"){
                    doc.status = "active";
                }

                let subscriptionUrl = new URL(subscriptionEndpoint); 
                let absoluteUrl = new URL(Meteor.absoluteUrl());
                
                if(subscriptionUrl.host !== absoluteUrl.host){
                    HTTP.put(subscriptionEndpoint + "/" + get(doc, 'id'), {
                        data: doc
                    })    
                }
            
                return doc;
            });
            Collections[collectionName].after.update(function (userId, doc) {
                //   // HIPAA Audit Log
                process.env.DEBUG && console.log("---------------------------------------------------")
                process.env.DEBUG && console.log(collectionName + '.after.update ')
                process.env.DEBUG && console.log('Relay URL:  ')
                process.env.TRACE && console.log(doc)
                process.env.TRACE && console.log("")

            
                if(doc.status === "draft"){
                    doc.status = "active";
                }

                let subscriptionUrl = new URL(subscriptionEndpoint); 
                let absoluteUrl = new URL(Meteor.absoluteUrl());

                // patch ???
                if(subscriptionUrl.host !== absoluteUrl.host){
                    HTTP.put(subscriptionEndpoint + "/" + get(doc, 'id'), {
                        data: doc
                    })    
                }

                return doc;
            });
        }

        return newSubscription;
    });



    let defaultQuery = {};
    let defaultOptions = {
        limit: get(Meteor, 'settings.private.fhir.publicationLimit', 1000)
    }
    if(get(Meteor, 'settings.private.enableAccessRestrictions')){
        defaultOptions.fields = {
            address: 0,
            access_token: 0,
            access_token_created_at: 0,
            client_secret: 0,
            authorization_code: 0
        };
    }

    // query the server for current subscriptions (based on userId)
    // for each resource type in list
    // publish a collection based on the specified FHIR Subscription record        
    if(get(Meteor, 'settings.private.fhir.autopublishSubscriptions')){
        Object.keys(Collections).forEach(function(collectionName){        
            if(Collections[collectionName]){
                console.log("Autopublishing DDP cursor for " + collectionName);
                
                let defaultQuery = setCollectionDefaultQuery(collectionName);

                Meteor.publish(collectionName, function(){           
                    process.env.TRACE && console.log('>>>>>> Autopublishing the ' + collectionName + ' collection.  this.userId: ' + this.userId)               
                    if(this.userId){
                        defaultOptions.fields = {}
                    }         
                    return Collections[collectionName].find(defaultQuery, defaultOptions).forEach(function(record){
                        if(get(record, 'meta.security[0].display') !== "restricted"){
                            return record;
                        }
                    });
                });        
                
            } else {
                console.log(collectionName + " not found.")
            }
        });     
    } else {
        console.log("Publications count: " + Subscriptions.find().count())
        Subscriptions.find().forEach(function(subscriptionRecord){

            // ********** if websockets **********
            if(get(subscriptionRecord, 'channel.type') === "websocket"){
                let collectionName = get(subscriptionRecord, 'channel.endpoint');
                if(Collections[collectionName]){
                    console.log("Publishing DDP cursor for " + collectionName + " websockets subscription (DDP).");

                    let defaultQuery = setCollectionDefaultQuery(collectionName, subscriptionRecord);
                    // process.env.DEBUG && console.log('defaultQuery', defaultQuery);

                    Meteor.publish(collectionName, function(){
                        process.env.TRACE && console.log('>>>>>> Subscription API publication:  ' + collectionName + '  -  this.userId:    ' + this.userId);               

                        if(this.userId){
                            defaultOptions.fields = {}
                        }         

                        return Collections[collectionName].find(defaultQuery, defaultOptions).forEach(function(record){
                            if(get(record, 'meta.security[0].display') !== "restricted"){
                                return record;
                            }
                        });
                    });        
                }
            }


            // ********** if REST **********
            if(get(subscriptionRecord, 'channel.type') === "rest-hook"){

                // insert onAfter hook
                let subscriptionEndpoint = get(subscriptionRecord, 'channel.endpoint');

                let urlComponentsArray = subscriptionEndpoint.split("/");
                let resourceName = urlComponentsArray[urlComponentsArray.length - 1];

                let collectionName = FhirUtilities.pluralizeResourceName(resourceName);

                if(Collections[collectionName]){
                    // insert onAfter hook
                    Collections[collectionName].after.insert(function (userId, doc) {

                        process.env.DEBUG && console.log("---------------------------------------------------")
                        process.env.DEBUG && console.log(collectionName + '.after.insert ')
                        process.env.DEBUG && console.log('Relay URL:  ' + subscriptionEndpoint)
                        process.env.TRACE && console.log(doc)
                        process.env.TRACE && console.log("")

                        // build URL string
                        if(doc.status === "draft"){
                            doc.status = "active";
                        }

                        let subscriptionUrl = new URL(subscriptionEndpoint); 
                        let absoluteUrl = new URL(Meteor.absoluteUrl());

                        if(subscriptionUrl.host !== absoluteUrl.host){
                            let relayEndpoint = subscriptionEndpoint + "/" + get(doc, 'id')
                            process.env.DEBUG && console.log('Relay Endpoint:  ' + relayEndpoint)

                            let httpHeaders = { "headers": {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                            }};

                            if(get(Meteor, 'settings.private.fhir.backendServices.basicAuthToken')){
                                httpHeaders["Authorization"] = "Basic " + base64url.encode(get(Meteor, 'settings.private.fhir.backendServices.basicAuthToken')) + "==";
                            } else {
                    
                                // TODO:  add OAuthClients SMART on FHIR connectivity
                    
                                // TODO:  add JWT access
                    
                                // TODO:  add UDAP connection
                            }
                            process.env.DEBUG && console.log('httpHeaders', httpHeaders);


                            HTTP.put(relayEndpoint, {
                                headers: httpHeaders,
                                data: doc
                            }, function(error, result){
                                if(error){console.log('error', error)}
                                if(result){console.log('result', result)}
                            })    
                        }              
                    
                        return doc;
                    });
                    Collections[collectionName].after.update(function (userId, doc) {
                        //   // HIPAA Audit Log
                        process.env.DEBUG && console.log("---------------------------------------------------")
                        process.env.DEBUG && console.log(collectionName + '.after.update ')
                        process.env.DEBUG && console.log('Relay URL:  ' + subscriptionEndpoint)
                        process.env.TRACE && console.log(doc)
                        process.env.TRACE && console.log("")

                    
                        if(doc.status === "draft"){
                            doc.status = "active";
                        }

                        let subscriptionUrl = new URL(subscriptionEndpoint); 
                        let absoluteUrl = new URL(Meteor.absoluteUrl());

                        if(subscriptionUrl.host !== absoluteUrl.host){
                            HTTP.put(subscriptionEndpoint + "/" + get(doc, 'id'), {
                                data: doc
                            }, function(error, result){
                                if(error){console.log('error', error)}
                                if(result){console.log('result', result)}
                            })    
                        }               
                    
                        return doc;
                    });
                } 
            }
        });

    }  
    
    
})