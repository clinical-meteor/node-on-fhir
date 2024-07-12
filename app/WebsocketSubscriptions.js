import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import moment from 'moment';
import { get } from 'lodash';

import SimpleSchema from 'simpl-schema';
import { BaseSchema, DomainResourceSchema } from 'meteor/clinical:hl7-resource-datatypes';
import { InboundRequests, UdapCertificates, OAuthClients } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import base64url from 'base64-url';
import { message } from './Logger';

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
        message.trace('criteriaJson', criteriaJson);

        if(typeof criteriaJson === "object"){
            Object.assign(defaultQuery, criteriaJson);
        }
    }

    return defaultQuery
}


// Autosubscription
Meteor.startup(function(){
    if(get(Meteor, 'settings.public.fhirAutoSubscribe')){

        // should we iterate through Meteor.settings.private.fhir.rest here?
        Object.keys(Collections).forEach(function(collectionName){
            console.info("Autosubscribing to the " + collectionName + " data channel.")
            Meteor.subscribe(collectionName);    
        });
    }
    if(get(Meteor, 'settings.public.fhirSubscribeToSubscriptions')){
        // query the server for current subscriptions (based on userId)
        // for each resource type in list
        // subscribe to a DDS pubsub based on the FHIR Subscription record
        console.log("Subscriptions count: " + Subscriptions.find().count())
        Subscriptions.find().forEach(function(subscriptionRecord){
            console.info("Subscribing to " + collectionName + " DDP cursor.");
            Meteor.subscribe(get(subscriptionRecord, 'channel.endpoint'));
        });
    }
})
