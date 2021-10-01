// https://www.npmjs.com/package/react-dropzone-component
// http://www.dropzonejs.com/

import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import MedicalRecordsExporter from './MedicalRecordsExporter';

import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import { 
  Button,
  Card,
  Checkbox,
  CardActions,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TableContainer,
  TablePagination,
  IconButton,
  FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPageIcon
} from '@material-ui/core';


import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';

import { Icon } from 'react-icons-kit'
import {ic_share} from 'react-icons-kit/md/ic_share'
import {ic_link} from 'react-icons-kit/md/ic_link'
import {ic_wifi_tethering} from 'react-icons-kit/md/ic_wifi_tethering'

import { get } from 'lodash';

let supportedResources = [
  "AllergyIntolerance",
  "Appointment",
  "Bundle",
  "CarePlan",
  "Claim",
  "Condition",
  "Consent",
  "Contract",
  "Communication",
  "CommunicationRequest",
  "CommunicationResponse",
  "ClinicalImpression",
  "ClinicalDocument",
  "Device",
  "DiagnosticReport",
  "DocumentReference",
  "Endpoint",
  "Encounter",
  "ExplanationOfBenefit",
  "FamilyMemberHistory",
  "Goal",
  "Immunization",
  "ImagingStudy",
  "List",
  "Location",
  "Measure",
  "MeasureReport",
  "Medication",
  "MedicationOrder",
  "MedicationStatement",
  "MessageHeader",
  "Observation",
  "Organization",
  "Patient",
  "Person",
  "Practitioner",
  "Procedure",
  "ProcedureRequest",
  "Questionnaire",
  "QuestionnaireResponse",
  "RelatedPerson",
  "RiskAssessment",
  "Schedule",
  "ServiceRequest",
  "Sequence",
  "Task",
  "ValueSet"
]

let importToggles = {
  importsAll: true,
  AllergyIntolerance: true,
  Appointment: true,
  Bundle: true,
  CarePlan: true,          
  CareTeam: true,
  Claim: true,
  Condition: true,
  Consent: true,
  Contract: true,
  Communication: true,
  CommunicationRequest: true,
  CommunicationResponse: true,
  ClinicalImpression: true,
  ClinicalDocument: true,
  Device: true,
  DiagnosticReport: true,
  DocumentReference: true,
  Endpoint: true,
  Encounter: true,
  ExplanationOfBenefit: true,
  FamilyMemberHistory: true,
  Goal: true,
  Immunization: true,
  ImagingStudy: true,
  List: true,
  Location: true,
  Measure: true,
  MeasureReport: true,
  Medication: true,
  MedicationOrder: true,
  MedicationStatement: true,
  MessageHeader: true,
  Observation: true,
  Organization: true,
  Patient: true,
  Person: true,
  Practitioner: true,
  Procedure: true,
  ProcedureRequest: true,
  Questionnaire: true,
  QuestionnaireResponse: true,
  RelatedPerson: true,
  RiskAssessment: true,
  Schedule: true,
  ServiceRequest: true,
  Sequence: true,
  Task: true,
  ValueSet: true,
  zero: true
}
let exportToggles = {
  exportsAll: false,
  AllergyIntolerance: false,
  Appointment: false,
  Bundle: false,       
  CarePlan: false,   
  CareTeam: true,
  Claim: false,       
  ClinicalDocument: false,
  Condition: false,
  Consent: false,
  Contract: false,
  Communication: false,
  CommunicationRequest: false,
  CommunicationResponse: false,
  ClinicalImpression: false,
  Device: false,
  DiagnosticReport: false,
  DocumentReference: false,
  Endpoint: false,       
  Encounter: false,      
  ExplanationOfBenefit: false,
  FamilyMemberHistory: false,
  Goal: false,
  Immunization: false,
  ImagingStudy: false,
  List: false,
  Location: false,
  Measure: false,
  MeasureReport: false,
  Medication: false,
  MedicationOrder: false,
  MedicationStatement: false,
  MessageHeader: false,
  Observation: false,
  Organization: false,
  Patient: false,
  Person: false,
  Practitioner: false,
  Procedure: false,
  ProcedureRequest: false,
  Questionnaire: false,
  QuestionnaireResponse: false,
  RelatedPerson: false,
  RiskAssessment: false,
  Schedule: false,
  ServiceRequest: false,
  Sequence: false,
  Task: false,
  ValueSet: false,
  zero: false
}

if(Meteor.isClient){
  Session.setDefault('toggleImportStates', importToggles);
  Session.setDefault('toggleExportStates', exportToggles);
  Session.setDefault('datalakeStats', false);  

  Meteor.call('getServerStats', function(error, result){
    if(result){
      Session.set('datalakeStats', result);
    }
  });
}


export function CollectionManagement(props){



  let data = {
    user: {
      isAdmin: false
    },
    collections: {
      checkedImports: importToggles,  
      checkedExports: exportToggles,
      preview: {},
      client: {
        AllergyIntolerance: 0,
        Bundle: 0,
        Appointment: 0,
        CarePlan: 0,       
        CareTeam: 0,   
        Claim: 0,
        Condition: 0,
        Communication: 0,
        CommunicationRequest: 0,
        CommunicationResponse: 0,
        Consent: 0,
        Contract: 0,
        ClinicalImpression: 0,
        ClinicalDocument: 0,
        Device: 0,
        DiagnosticReport: 0,
        DocumentReference: 0,
        Endpoint: 0,
        Encounter: 0,
        ExplanationOfBenefit: 0,
        FamilyMemberHistory: 0,
        Goal: 0,
        Immunization: 0,
        ImagingStudy: 0,
        List: 0,
        Location: 0,
        Medication: 0,
        MedicationOrder: 0,
        MedicationStatement: 0,
        MessageHeader: 0,
        Observation: 0,
        Organization: 0,
        Patient: 0,
        Person: 0,
        Practitioner: 0,
        Procedure: 0,
        ProcedureRequest: 0,
        Questionnaire: 0,
        QuestionnaireResponse: 0,
        RelatedPerson: 0,
        RiskAssessment: 0,
        Schedule: 0,
        ServiceRequest: 0,
        Sequence: 0,
        ValueSet: 0,
        zero: 0
      },
      localClient: {
        AllergyIntolerance: 0,
        Bundle: 0,
        Appointment: 0,
        CarePlan: 0,   
        CareTeam: 0,       
        Claim: 0,
        Condition: 0,
        Communication: 0,
        CommunicationRequest: 0,
        CommunicationResponse: 0,
        Consent: 0,
        Contract: 0,
        ClinicalImpression: 0,
        ClinicalDocument: 0,
        Device: 0,
        DiagnosticReport: 0,
        DocumentReference: 0,
        Endpoint: 0,
        Encounter: 0,
        ExplanationOfBenefit: 0,
        FamilyMemberHistory: 0,
        Goal: 0,
        Immunization: 0,
        ImagingStudy: 0,
        List: 0,
        Location: 0,
        Medication: 0,
        MedicationOrder: 0,
        MedicationStatement: 0,
        MessageHeader: 0,
        Observation: 0,
        Organization: 0,
        Patient: 0,
        Person: 0,
        Practitioner: 0,
        Procedure: 0,
        ProcedureRequest: 0,
        Questionnaire: 0,
        QuestionnaireResponse: 0,
        RelatedPerson: 0,
        RiskAssessment: 0,
        Schedule: 0,
        ServiceRequest: 0,
        Sequence: 0,
        ValueSet: 0,
        zero: 0
      },
      datalake: {
        AllergyIntolerance: 0,
        Appointment: 0,
        Bundle: 0,
        CarePlan: 0,         
        CareTeam: 0, 
        Claim: 0,
        ClinicalImpression: 0,
        ClinicalDocument: 0,
        Condition: 0,
        Consent: 0,
        Contract: 0,
        Communication: 0,
        CommunicationRequest: 0,
        CommunicationResponse: 0,
        Device: 0,
        DiagnosticReport: 0,
        DocumentReference: 0,
        Endpoint: 0,
        Encounter: 0,
        ExplanationOfBenefit: 0,
        FamilyMemberHistory: 0,
        Goal: 0,
        Immunization: 0,
        ImagingStudy: 0,
        List: 0,
        Location: 0,
        Medication: 0,
        MedicationOrder: 0,
        MedicationStatement: 0,
        MessageHeader: 0,
        Observation: 0,
        Organization: 0,
        Patient: 0,
        Practitioner: 0,
        Procedure: 0,
        ProcedureRequest: 0,
        Person: 0,
        Questionnaire: 0,
        QuestionnaireResponse: 0,
        RelatedPerson: 0,
        RiskAssessment: 0,
        Location: 0,
        Schedule: 0,
        ServiceRequest: 0,
        Sequence: 0,
        ValueSet: 0,
        zero: 0
      },
      pubsub: {
        AllergyIntolerance: false,
        Appointment: false,
        Bundle: false,
        CarePlan: false,    
        CareTeam: false,      
        Claim: false,
        ClinicalDocument: false,
        Condition: false,
        Consent: false,
        Contract: false,
        Communication: false,
        CommunicationRequest: false,
        CommunicationResponse: false,
        Device: false,
        DiagnosticReport: false,
        DocumentReference: false,
        Encounter: false,
        Endpoint: false,
        ExplanationOfBenefit: false,
        FamilyMemberHistory: false,
        Goal: false,
        Immunization: false,
        ImagingStudy: false,
        List: false,
        Location: false,
        Medication: false,
        MedicationOrder: false,
        MedicationStatement: false,
        MessageHeader: false,
        Observation: false,
        Organization: false,
        Patient: false,
        Practitioner: false,
        Procedure: false,
        ProcedureRequest: false,
        Person: false,
        Questionnaire: false,
        QuestionnaireResponse: false,
        RelatedPerson: false,
        RiskAssessment: false,
        Location: false,
        Schedule: false,
        ServiceRequest: false,
        Sequence: false,
        ValueSet: false
      }
    }
  };

  data.collections.checkedImports = useTracker(function(){
    return Session.get('toggleImportStates');
  }, [])
  data.collections.checkedExports = useTracker(function(){
    return Session.get('toggleExportStates');
  }, [])
  data.collections.datalake = useTracker(function(){
    return Session.get('datalakeStats');
  }, [])



  if(props.preview){
    Object.keys(props.preview).forEach(function(key){
      data.collections.preview[key] = props.preview[key];
    })

    logger.debug('CollectionManagement.data.collections.preview', data.collections.preview)
  }

  //------------------------------------------------------------
  // TODO: Refactor using the following

  let collectionManagementQuery = {};

  if(props.selectedPatientId){
    collectionManagementQuery["subject.reference"] = "urn:uuid:" + props.selectedPatientId
  }
  supportedResources.forEach(function(resourceName){
    if(typeof window[FhirUtilities.pluralizeResourceName(resourceName)] === "object"){
      data.collections.client[resourceName] = window[FhirUtilities.pluralizeResourceName(resourceName)].find(collectionManagementQuery).count();
      data.collections.localClient[resourceName] = window[FhirUtilities.pluralizeResourceName(resourceName)]._collection.find(collectionManagementQuery).count();

      if(Meteor.default_connection){
        Object.keys( Meteor.default_connection._subscriptions).forEach(function(key) {
          if(Meteor.default_connection._subscriptions[key]){
            var record = Meteor.default_connection._subscriptions[key];          
            if(record.name === FhirUtilities.pluralizeResourceName(resourceName)){
              data.collections.pubsub[resourceName] = true;
            }  
          }
        });
      }
    }
  });

  // console.log('ImportPage.CollectionManagement.data', data)

  // let user = Meteor.user();
  // if (user && user.roles) {
  //   user.roles.forEach(function(role){
  //     if (role === "sysadmin") {
  //       data.user.isAdmin = true;
  //     } else if (role === "practitioner") {
  //       data.user.isPractitioner = true;
  //     } else if (role === "patient") {
  //       data.user.isPatient = true;
  //     }
  //   });
  // }

  logger.trace('CollectionManagement.data', data)

  function setToggleImportState(collection, isInputChecked){
    let toggleStates = Session.get('toggleImportStates');
    toggleStates[collection] = isInputChecked;
    Session.set('toggleImportStates', toggleStates);
  }
  function setToggleExportState(collection, isInputChecked){
    let toggleExportStates = Session.get('toggleExportStates');
    toggleExportStates[collection] = isInputChecked;
    console.log('toggleExportStates', toggleExportStates)
    Session.set('toggleExportStates', toggleExportStates);
  }
  function toggleAllImports(event, isInputChecked){
    console.log('toggleAllImports', isInputChecked, get(this, 'data.collections.checkedImports.importsAll'));

    setToggleImportState('importsAll', isInputChecked)
    setToggleImportState('AllergyIntolerance', isInputChecked)
    setToggleImportState('Appointment', isInputChecked)
    setToggleImportState('Bundle', isInputChecked)
    setToggleImportState('CarePlan', isInputChecked)
    setToggleImportState('CareTeam', isInputChecked)
    setToggleImportState('Claim', isInputChecked)
    setToggleImportState('ClinicalDocument', isInputChecked)
    setToggleImportState('Condition', isInputChecked)
    setToggleImportState('Consent', isInputChecked)
    setToggleImportState('Contract', isInputChecked)
    setToggleImportState('Communication', isInputChecked)
    setToggleImportState('CommunicationResponse', isInputChecked)
    setToggleImportState('CommunicationRequest', isInputChecked)
    setToggleImportState('ClinicalImpression', isInputChecked)
    setToggleImportState('Device', isInputChecked)
    setToggleImportState('DiagnosticReport', isInputChecked)
    setToggleImportState('DocumentReference', isInputChecked)
    setToggleImportState('Endpoint', isInputChecked)
    setToggleImportState('Encounter', isInputChecked)
    setToggleImportState('ExplanationOfBenefit', isInputChecked)
    setToggleImportState('FamilyMemberHistory', isInputChecked)
    setToggleImportState('Goal', isInputChecked)
    setToggleImportState('Immunization', isInputChecked)
    setToggleImportState('ImagingStudy', isInputChecked)
    setToggleImportState('List', isInputChecked)
    setToggleImportState('Location', isInputChecked)
    setToggleImportState('Measure', isInputChecked)
    setToggleImportState('MeasureReport', isInputChecked)
    setToggleImportState('Medication', isInputChecked)
    setToggleImportState('MedicationOrder', isInputChecked)
    setToggleImportState('MedicationStatement', isInputChecked)
    setToggleImportState('MessageHeader', isInputChecked)
    setToggleImportState('Observation', isInputChecked)
    setToggleImportState('Organization', isInputChecked)
    setToggleImportState('Patient', isInputChecked)
    setToggleImportState('Person', isInputChecked)
    setToggleImportState('Practitioner', isInputChecked)
    setToggleImportState('Procedure', isInputChecked)
    setToggleImportState('ProcedureRequest', isInputChecked)
    setToggleImportState('Questionnaire', isInputChecked)
    setToggleImportState('QuestionnaireResponse', isInputChecked)
    setToggleImportState('RelatedPerson', isInputChecked)
    setToggleImportState('RiskAssessment', isInputChecked)
    setToggleImportState('Schedule', isInputChecked)
    setToggleImportState('ServiceRequest', isInputChecked)
    setToggleImportState('Sequence', isInputChecked)
    setToggleImportState('Task', isInputChecked)
    setToggleImportState('ValueSet', isInputChecked);

    //------------------------------------------------------------
    // TODO: Refactor using the following

    // setToggleImportState(resourceName, isInputChecked);

  }
  function toggleAllergies(event, isInputChecked){    
    setToggleImportState('AllergyIntolerance', isInputChecked)
  };
  function toggleAppointments(event, isInputChecked){    
    setToggleImportState('Appointment', isInputChecked)
  };
  function toggleBundles(event, isInputChecked){    
    setToggleImportState('Bundle', isInputChecked)
  };
  function toggleCarePlans(event, isInputChecked){    
    setToggleImportState('CarePlan', isInputChecked)
  };
  function toggleCareTeams(event, isInputChecked){    
    setToggleImportState('CareTeam', isInputChecked)
  };
  function toggleClaims(event, isInputChecked){    
    setToggleImportState('Claim', isInputChecked)
  };
  function toggleClinicalDocuments(event, isInputChecked){    
    setToggleImportState('ClinicalDocument', isInputChecked)
  };
  function toggleConditions(event, isInputChecked){    
    setToggleImportState('Condition', isInputChecked)
  };
  function toggleConsents(event, isInputChecked){    
    setToggleImportState('Consent', isInputChecked)
  };
  function toggleContracts(event, isInputChecked){    
    setToggleImportState('Contract', isInputChecked)
  };
  function toggleCommunications(event, isInputChecked){    
    setToggleImportState('Communication', isInputChecked)
  };
  function toggleCommunicationResponses(event, isInputChecked){    
    setToggleImportState('CommunicationResponse', isInputChecked)
  };
  function toggleCommunicationRequests(event, isInputChecked){    
    setToggleImportState('CommunicationRequest', isInputChecked)
  };
  function toggleClinicalImpressions(event, isInputChecked){    
    setToggleImportState('ClinicalImpression', isInputChecked)
  };
  function toggleDevices(event, isInputChecked){    
    setToggleImportState('Device', isInputChecked)
  };
  function toggleDiagnosticReports(event, isInputChecked){    
    setToggleImportState('DiagnosticReport', isInputChecked)
  };
    function toggleDocumentReferences(event, isInputChecked){    
    setToggleImportState('DocumentReference', isInputChecked)
  };
  function toggleEncounters(event, isInputChecked){    
    setToggleImportState('Encounter', isInputChecked)
  };
  function toggleEndpoints(event, isInputChecked){    
    setToggleImportState('Endpoint', isInputChecked)
  };
  function toggleExplanationOfBenefit(event, isInputChecked){    
    setToggleImportState('ExplanationOfBenefit', isInputChecked)
  };
  function toggleFamilyMemberHistories(event, isInputChecked){    
    setToggleImportState('FamilyMemberHistory', isInputChecked)
  };
  function toggleGoals(event, isInputChecked){
    setToggleImportState('Goal', isInputChecked)
  };
  function toggleImmunizations(event, isInputChecked){
    setToggleImportState('Immunization', isInputChecked)
  };
  function toggleImmagingStudies(event, isInputChecked){    
    setToggleImportState('ImagingStudy', isInputChecked)
  };
  function toggleLists(event, isInputChecked){
    setToggleImportState('List', isInputChecked)
  };
  function toggleLocations(event, isInputChecked){
    setToggleImportState('Location', isInputChecked)
  };
  function toggleMeasures(event, isInputChecked){    
    setToggleImportState('Measure', isInputChecked)
  };
  function toggleMeasureReports(event, isInputChecked){    
    setToggleImportState('MeasureReport', isInputChecked)
  };
  function toggleMedications(event, isInputChecked){    
    setToggleImportState('Medication', isInputChecked)
  };
  function toggleMedicationOrders(event, isInputChecked){    
    setToggleImportState('MedicationOrder', isInputChecked)
  };
  function toggleMedicationStatements(event, isInputChecked){    
    setToggleImportState('MedicationStatement', isInputChecked)
  };
  function toggleMessageHeaders(event, isInputChecked){    
    setToggleImportState('MessageHeader', isInputChecked)
  };
  function toggleObservations(event, isInputChecked){    
    setToggleImportState('Observation', isInputChecked)
  };
  function toggleOrganizations(event, isInputChecked){    
    setToggleImportState('Organization', isInputChecked)
  };
  function togglePatients(event, isInputChecked){    
    setToggleImportState('Patient', isInputChecked)
  };
  function togglePersons(event, isInputChecked){    
    setToggleImportState('Person', isInputChecked)
  };
  function togglePractitioners(event, isInputChecked){    
    setToggleImportState('Practitioner', isInputChecked)
  };
  function toggleProcedures(event, isInputChecked){    
    setToggleImportState('Procedure', isInputChecked)
  };
  function toggleProcedureRequests(event, isInputChecked){    
    setToggleImportState('ProcedureRequest', isInputChecked)
  };
  function toggleQuestionnaires(event, isInputChecked){    
    setToggleImportState('Questionnaire', isInputChecked)
  };
  function toggleQuestionnaireResponses(event, isInputChecked){    
    setToggleImportState('QuestionnaireResponse', isInputChecked)
  };
  function toggleRelatedPersons(event, isInputChecked){    
    setToggleImportState('RelatedPerson', isInputChecked)
  };
  function toggleRiskAssessments(event, isInputChecked){    
    setToggleImportState('RiskAssessment', isInputChecked)
  };
  function toggleSchedules(event, isInputChecked){    
    setToggleImportState('Schedule', isInputChecked)
  };
  function toggleServiceRequests(event, isInputChecked){    
    setToggleImportState('ServiceRequest', isInputChecked)
  };
  function toggleSequences(event, isInputChecked){    
    setToggleImportState('Sequence', isInputChecked)
  };
  function toggleTasks(event, isInputChecked){    
    setToggleImportState('Task', isInputChecked)
  };
  function toggleValueSets(event, isInputChecked){    
    setToggleImportState('ValueSet', isInputChecked)
  };

  //------------------------------------------------------------
  // TODO: Refactor using the following

  // toggleImportState(event, isInputChecked, resourceName){    
  //   setToggleImportState(resourceName, isInputChecked)
  // };


  function toggleAllExports(event, isInputChecked){
    console.log('toggleAllExports', isInputChecked, get(this, 'data.collections.checkedExports.exportsAll'));

    setToggleExportState('exportsAll', isInputChecked)
    setToggleExportState('AllergyIntolerance', isInputChecked)
    setToggleExportState('Appointment', isInputChecked)
    setToggleExportState('Bundle', isInputChecked)
    setToggleExportState('CarePlan', isInputChecked)
    setToggleExportState('CareTeam', isInputChecked)
    setToggleExportState('Claim', isInputChecked)
    setToggleExportState('ClinicalDocument', isInputChecked)
    setToggleExportState('Condition', isInputChecked)
    setToggleExportState('Consent', isInputChecked)
    setToggleExportState('Contract', isInputChecked)
    setToggleExportState('Communication', isInputChecked)
    setToggleExportState('CommunicationResponse', isInputChecked)
    setToggleExportState('CommunicationRequest', isInputChecked)
    setToggleExportState('ClinicalImpression', isInputChecked)
    setToggleExportState('Device', isInputChecked)
    setToggleExportState('DiagnosticReport', isInputChecked)
    setToggleExportState('DocumentReference', isInputChecked)
    setToggleExportState('Encounter', isInputChecked)
    setToggleExportState('Endpoint', isInputChecked)
    setToggleExportState('ExplanationOfBenefit', isInputChecked)
    setToggleExportState('FamilyMemberHistory', isInputChecked)
    setToggleExportState('Goal', isInputChecked)
    setToggleExportState('Immunization', isInputChecked)
    setToggleExportState('ImagingStudy', isInputChecked)
    setToggleExportState('List', isInputChecked)
    setToggleExportState('Location', isInputChecked)
    setToggleExportState('Measure', isInputChecked)
    setToggleExportState('MeasureReport', isInputChecked)
    setToggleExportState('Medication', isInputChecked)
    setToggleExportState('MedicationOrder', isInputChecked)
    setToggleExportState('MedicationStatement', isInputChecked)
    setToggleExportState('MessageHeader', isInputChecked)
    setToggleExportState('Observation', isInputChecked)
    setToggleExportState('Organization', isInputChecked)
    setToggleExportState('Patient', isInputChecked)
    setToggleExportState('Person', isInputChecked)
    setToggleExportState('Practitioner', isInputChecked)
    setToggleExportState('Procedure', isInputChecked)
    setToggleExportState('ProcedureRequest', isInputChecked)
    setToggleExportState('Questionnaire', isInputChecked)
    setToggleExportState('QuestionnaireResponse', isInputChecked)
    setToggleExportState('RelatedPerson', isInputChecked)
    setToggleExportState('RiskAssessment', isInputChecked)
    setToggleExportState('Schedule', isInputChecked)
    setToggleExportState('ServiceRequest', isInputChecked)
    setToggleExportState('Sequence', isInputChecked)
    setToggleExportState('Task', isInputChecked)
    setToggleExportState('ValueSet', isInputChecked)

    //------------------------------------------------------------
    // TODO: Refactor using the following

    // setToggleImportState(resourceName, isInputChecked);

  }
  function toggleAllergiesExport(event, isInputChecked){    
    setToggleExportState('AllergyIntolerance', isInputChecked)
  };
  function toggleAppointmentsExport(event, isInputChecked){    
    setToggleExportState('Appointment', isInputChecked)
  };
  function toggleBundlesExport(event, isInputChecked){    
    // alert('toggleBundlesExport: ' + isInputChecked)
    setToggleExportState('Bundle', isInputChecked)
  };
  function toggleCarePlansExport(event, isInputChecked){    
    setToggleExportState('CarePlan', isInputChecked)
  };
  function toggleCareTeamsExport(event, isInputChecked){    
    setToggleExportState('CareTeam', isInputChecked)
  };
  function toggleClaimsExport(event, isInputChecked){    
    setToggleExportState('Claim', isInputChecked)
  };
  function toggleClinicalDocumentsExport(event, isInputChecked){    
    setToggleExportState('ClinicalDocument', isInputChecked)
  };
  function toggleConditionsExport(event, isInputChecked){    
    setToggleExportState('Condition', isInputChecked)
  };
  function toggleConsentsExport(event, isInputChecked){    
    setToggleExportState('Consent', isInputChecked)
  };
  function toggleContractsExport(event, isInputChecked){    
    setToggleExportState('Contract', isInputChecked)
  };
  function toggleCommunicationsExport(event, isInputChecked){    
    setToggleExportState('Communication', isInputChecked)
  };
  function toggleCommunicationResponsesExport(event, isInputChecked){    
    setToggleExportState('CommunicationResponse', isInputChecked)
  };
  function toggleCommunicationRequestsExport(event, isInputChecked){    
    setToggleExportState('CommunicationRequest', isInputChecked)
  };
  function toggleClinicalImpressionsExport(event, isInputChecked){    
    setToggleExportState('ClinicalImpression', isInputChecked)
  };
  function toggleDevicesExport(event, isInputChecked){    
    setToggleExportState('Device', isInputChecked)
  };
  function toggleDiagnosticReportsExport(event, isInputChecked){    
    setToggleExportState('DiagnosticReport', isInputChecked)
  };
    function toggleDocumentReferencesExport(event, isInputChecked){    
    setToggleExportState('DocumentReference', isInputChecked)
  };
  function toggleEncountersExport(event, isInputChecked){    
    setToggleExportState('Encounter', isInputChecked)
  };
  function toggleEndpointsExport(event, isInputChecked){    
    setToggleExportState('Endpoint', isInputChecked)
  };
  function toggleExplanationOfBenefitsExport(event, isInputChecked){    
    setToggleExportState('ExplanationOfBenefit', isInputChecked)
  };
  function toggleFamilyMemberHistoriesExport(event, isInputChecked){    
    setToggleExportState('FamilyMemberHistory', isInputChecked)
  };
  function toggleGoalsExport(event, isInputChecked){
    setToggleExportState('Goal', isInputChecked)
  };
  function toggleImmunizationsExport(event, isInputChecked){
    setToggleExportState('Immunization', isInputChecked)
  };
  function toggleImagingStudiesExport(event, isInputChecked){    
    setToggleExportState('ImagingStudy', isInputChecked)
  };
  function toggleListsExport(event, isInputChecked){
    setToggleExportState('List', isInputChecked)
  };
  function toggleLocationsExport(event, isInputChecked){
    setToggleExportState('Location', isInputChecked)
  };
  function toggleMeasuresExport(event, isInputChecked){    
    setToggleExportState('Measure', isInputChecked)
  };
  function toggleMeasureReportsExport(event, isInputChecked){    
    setToggleExportState('MeasureReport', isInputChecked)
  };
  function toggleMedicationsExport(event, isInputChecked){    
    setToggleExportState('Medication', isInputChecked)
  };
  function toggleMedicationOrdersExport(event, isInputChecked){
    setToggleExportState('MedicationOrder', isInputChecked)
  }
  function toggleMedicationStatementsExport(event, isInputChecked){
    setToggleExportState('MedicationStatement', isInputChecked)
  }
  function toggleMessageHeadersExport(event, isInputChecked){    
    setToggleExportState('MessageHeader', isInputChecked)
  };
  function toggleObservationsExport(event, isInputChecked){    
    setToggleExportState('Observation', isInputChecked)
  };
  function toggleOrganizationsExport(event, isInputChecked){    
    setToggleExportState('Organization', isInputChecked)
  };
  function togglePatientsExport(event, isInputChecked){    
    setToggleExportState('Patient', isInputChecked)
  };
  function togglePersonsExport(event, isInputChecked){    
    setToggleExportState('Person', isInputChecked)
  };
  function togglePractitionersExport(event, isInputChecked){    
    setToggleExportState('Practitioner', isInputChecked)
  };
  function toggleProceduresExport(event, isInputChecked){    
    setToggleExportState('Procedure', isInputChecked)
  };
  function toggleProcedureRequestsExport(event, isInputChecked){    
    setToggleExportState('ProcedureRequest', isInputChecked)
  };
  function toggleQuestionnairesExport(event, isInputChecked){    
    setToggleExportState('Questionnaire', isInputChecked)
  };
  function toggleQuestionnaireResponsesExport(event, isInputChecked){    
    setToggleExportState('QuestionnaireResponse', isInputChecked)
  };
  function toggleRelatedPersonsExport(event, isInputChecked){    
    setToggleExportState('RelatedPerson', isInputChecked)
  };
  function toggleRiskAssessmentsExport(event, isInputChecked){    
    setToggleExportState('RiskAssessment', isInputChecked)
  };
  function toggleSchedulesExport(event, isInputChecked){    
    setToggleExportState('Schedule', isInputChecked)
  };
  function toggleServiceRequestsExport(event, isInputChecked){    
    setToggleExportState('ServiceRequest', isInputChecked)
  };
  function toggleSequencesExport(event, isInputChecked){    
    setToggleExportState('Sequence', isInputChecked)
  };
  function toggleTasksExport(event, isInputChecked){    
    setToggleExportState('Task', isInputChecked)
  };
  function toggleValueSetsExport(event, isInputChecked){    
    setToggleExportState('ValueSet', isInputChecked)
  };

  //------------------------------------------------------------
  // TODO: Refactor using the following

  // toggleExportState(event, isInputChecked, resourceName){    
  //   setToggleExportState(resourceName, isInputChecked)
  // };

  function singularizeResourceName(resourceTypeString){
    var singularized = '';
    switch (resourceTypeString) {
      case 'Binaries':          
        singularized = 'Binary';
        break;
      case 'Libraries':      
        singularized = 'Library';
        break;
      case 'SupplyDeliveries':      
        singularized = 'SupplyDelivery';
        break;
      case 'ImagingStudies':      
        singularized = 'ImagingStudy';
        break;        
      case 'FamilyMemberHistories':      
        singularized = 'FamilyMemberHistory';
        break;        
      case 'ResearchStudies':      
        singularized = 'ResearchStudy';
        break;        
      default:
        singularized = resourceTypeString.substring(0, resourceTypeString.length - 1)
        break;
    }

    return singularized;
  }
  function exportCollection(collectionName, exportFileType){
    console.log('Exporting the ' + collectionName + ' collection.')

    let self = this;

    let fileData;
    let collectionExportFileExtension = get(Meteor, 'settings.public.defaults.exportFile.collectionExportFileExtension', 'json');

    switch (collectionExportFileExtension) {
      case "csv":
        fileData = MedicalRecordsExporter.exportCsv(collectionName);
        break;    
      case "application/csv":
        fileData = MedicalRecordsExporter.exportCsv(collectionName);
        break;    
      default:
        fileData = MedicalRecordsExporter.exportJson(collectionName);
        break;
    }

    // var dataString = 'data:text/csv;charset=utf-8,' + encodeURIComponent(JSON.stringify(fileData, null, 2));  
    var dataString = 'data:text/csv;charset=utf-8,' + encodeURIComponent(fileData);  
    var downloadAnchorElement = document.getElementById('downloadAnchorElement');
    if(downloadAnchorElement){
      downloadAnchorElement.setAttribute("href", dataString );
  
      downloadAnchorElement.setAttribute("download", collectionName + ".csv");
      downloadAnchorElement.click();
      // window.open('data:text/csv;charset=utf-8,' + escape(continuityOfCareDoc), '_self');    
    } else {
      console.log('Couldnt find anchor element.')
    }

  }
  function importCollection(collectionName){
    console.log('Exporting the ' + collectionName + ' collection.')

  }
  function dropCollection(resourceType){
    let collectionName = FhirUtilities.pluralizeResourceName(resourceType);

    console.log('Dropping the local ' + collectionName + ' collection.')

    if(Meteor.isClient){
      if(typeof window[collectionName] === "object"){
        window[collectionName].find().forEach(function(record){
          window[collectionName].remove({_id: record._id});
        });  
      }
    }
  }
  function drawPubSubIcon(subSubExists){
      return <Checkbox checked={subSubExists} />;
  }
  function renderIcon(resourceType){
    if(props.displayIcons){
        
      import { Icon } from 'react-icons-kit'
      import {fire} from 'react-icons-kit/icomoon/fire'
      import {ic_warning} from 'react-icons-kit/md/ic_warning'
      import {envelopeO} from 'react-icons-kit/fa/envelopeO' // Correspondence 
      import {ic_devices} from 'react-icons-kit/md/ic_devices';
      import {userMd} from 'react-icons-kit/fa/userMd'
      import {users} from 'react-icons-kit/fa/users'
      import {ic_question_answer} from 'react-icons-kit/md/ic_question_answer'      
      import {ic_transfer_within_a_station} from 'react-icons-kit/md/ic_transfer_within_a_station' // Encounters 
      import {ic_local_pharmacy} from 'react-icons-kit/md/ic_local_pharmacy'  // Medication, MedicationStatement, MedicationOrder  
      import {heartbeat} from 'react-icons-kit/fa/heartbeat' // Condition
      import {erlenmeyerFlask} from 'react-icons-kit/ionicons/erlenmeyerFlask' // Substance  
      import {hospitalO} from 'react-icons-kit/fa/hospitalO' // Hospital  
      import {bath} from 'react-icons-kit/fa/bath'  // Procedure  
      import {suitcase} from 'react-icons-kit/fa/suitcase' // Bundle
      import {notepad} from 'react-icons-kit/ikons/notepad'  // CarePlan ?
      import {iosPulseStrong} from 'react-icons-kit/ionicons/iosPulseStrong' // Pulse, Condition  
      import {location} from 'react-icons-kit/typicons/location' // Location
      import {eyedropper} from 'react-icons-kit/fa/eyedropper'
      import {dashboard} from 'react-icons-kit/fa/dashboard' //Dashboard
      import {list} from 'react-icons-kit/fa/list' //Dashboard
      import {addressCardO} from 'react-icons-kit/fa/addressCardO'  // Address Card  
      import {mapO} from 'react-icons-kit/fa/mapO'
      import {map} from 'react-icons-kit/fa/map'

      let iconToRender;

      switch (resourceType) {
        case "AllergyIntolerance":
          iconToRender = <Icon icon={ic_warning} />
          break;
        case "CarePlan":
          iconToRender = <Icon icon={notepad} />
          break;
        case "Condition":
          iconToRender = <Icon icon={heartbeat} />
          break;
        case "Device":
          iconToRender = <Icon icon={ic_devices} />
          break;
        case "DiagnosticReport":
          iconToRender = <Icon icon={notepad} />
          break;
        case "Encounter":
          iconToRender = <Icon icon={ic_transfer_within_a_station} />
          break;
        case "Immunization":
          iconToRender = <Icon icon={eyedropper} />
          break;
        case "Medication":
          iconToRender = <Icon icon={ic_local_pharmacy} />
          break;
        case "MedicationStatement":
          iconToRender = <Icon icon={ic_local_pharmacy} />
          break;
        case "Observation":
          iconToRender = <Icon icon={iosPulseStrong} />
          break;
        case "Patient":
          iconToRender = <Icon icon={users} />
          break;    
        case "Procedure":
          iconToRender = <Icon icon={bath} />
          break;    
      }

      return(
        <TableCell className="importAll">{iconToRender}</TableCell>
      )  
    }
  }
  function renderImportCheckmark(onChangeMethod, resourceShorthand){
    // console.log('renderImportCheckmark', resourceShorthand)
    if(props.displayImportCheckmarks){
      let checkedValue = false;
      if(get(this, 'data.collections.checkedImports')){
        checkedValue = data.collections.checkedImports[FhirUtilities.pluralizeResourceName(resourceShorthand)];
      }
      // console.log('renderImportCheckmark.checkedValue', checkedValue)
  
      return(
        <TableCell className="importAll"><Checkbox onChange={onChangeMethod} checked={checkedValue} /></TableCell>
      )  
    }
  }
  function renderExportCheckmark(onChangeMethod, resourceShorthand){    
    // console.log('renderExportCheckmark', resourceShorthand)

    if(props.displayExportCheckmarks){
      let checkedValue = false;
      if(get(data, 'collections.checkedExports')){
        checkedValue = get(data, "collections.checkedExports." + resourceShorthand);
      }
      // console.log('renderExportCheckmark.checkedValue', checkedValue)
      return(
        <TableCell className="exportAll"><Checkbox onChange={onChangeMethod} checked={checkedValue} /></TableCell>
      )  
    }
  }
  function renderDropButton(resourceType, resourceShorthand){
    if(props.displayDropButton){

      let cellStyle = {
        cursor: 'pointer',
        color: 'black'
      }
      if(get(data, 'collections.pubsub') && get(data, "collections.pubsub." + resourceShorthand)){
        if(data.collections.pubsub[resourceType] === true){
          cellStyle.color = 'lightgray';
        }
      }

      return(
        <TableCell className="dropButton" style={cellStyle} onClick={dropCollection.bind(this, resourceType)} >Drop</TableCell>
      )  
    }
  }
  function renderPreview(collectionName){
    if(props.displayPreview){
      let displayText = 0;
      if(get(data, 'collections.preview') && data.collections.preview[collectionName]){
        displayText = data.collections.preview[collectionName];
      }

      return(
        <TableCell className="dropButton" style={{cursor: 'pointer'}}>{displayText}</TableCell>
      )  
    }
  }
  function renderClientCount(collectionName){
    if(props.displayClientCount){
      let displayText = 0;
      if(get(data, 'collections.client') && data.collections.client[collectionName]){
        displayText = data.collections.client[collectionName];
      }

      return(
        <TableCell className="clientCount" style={{cursor: 'pointer'}}>{displayText}</TableCell>
      )  
    }
  }
  function renderLocalClientCount(collectionName){
    if(props.displayLocalClientCount){
      let displayText = 0;
      if(get(data, 'collections.localClient') && data.collections.localClient[collectionName]){
        displayText = data.collections.localClient[collectionName];
      }

      return(
        <TableCell className="localClientCount" style={{cursor: 'pointer'}}>{displayText}</TableCell>
      )  
    }
  }
  function renderPubSub(resourceType){
    if(props.displayPubSubEnabled){

      let icon;      
      if(get(data, 'collections.pubsub') && data.collections.pubsub[resourceType]){
        if(data.collections.pubsub[resourceType] === true){
          icon = <Icon icon={ic_wifi_tethering} style={{fontSize: '120%'}} />
        }
      }

      return(
        <TableCell className="pubSub" style={{cursor: 'pointer'}}>
          { icon }
        </TableCell>
      )  
    }
  }
  function renderPubSubHeader(){
    if(props.displayPubSubEnabled){
      return(
        <TableCell className="pubSub">PubSub</TableCell>
      )  
    }
  }
  function renderExportButton(collectionName){
    if(props.displayExportButton){
      return(
        <TableCell className="exportButton" style={{cursor: 'pointer'}} onClick={exportCollection.bind(this, collectionName)}>Export</TableCell>
      )  
    }
  }
  function renderImportButton(collectionName){
    if(props.displayImportButton){
      return(
        <TableCell className="importButton" style={{cursor: 'pointer'}} onClick={importCollection.bind(this, collectionName)}>Import</TableCell>
      )  
    }
  }
  function renderPreviewHeader(){
    if(props.displayPreview){
      return(
        <TableCell className="preview">Preview</TableCell>
      )  
    }
  }
  function renderClientCountHeader(){
    if(props.displayClientCount){
      return(
        <TableCell className="clientCount">Client #</TableCell>
      )  
    }
  }
  function renderLocalClientCountHeader(){
    if(props.displayLocalClientCount){
      return(
        <TableCell className="localClientCount">Local Client #</TableCell>
      )  
    }
  }
  function renderDropButtonHeader(){
    if(props.displayDropButton){
      return(
        <TableCell className="dropButton">Drop</TableCell>
      )  
    }
  }
  function renderExportButtonHeader(){
    if(props.displayExportButton){
      return(
        <TableCell className="exportButton">Export</TableCell>
      )  
    }
  }
  function renderImportButtonHeader(){
    if(props.displayImportButton){
      return(
        <TableCell className="importButton">Import</TableCell>
      )  
    }
  }
  function renderIconHeader(){
    if(props.displayIcons){
      return(
        <TableCell className="icon"></TableCell>
      )  
    }
  }
  function renderImportCheckmarkHeader(){
    if(props.displayImportCheckmarks){
      let dChecked = get(this, 'data.collections.checkedImports.importsAll', false)
      return(
        <TableCell className="importAll"><Checkbox onChange={toggleAllImports.bind(this)} checked={dChecked} /></TableCell>
      )  
    }
  }
  function renderExportCheckmarkHeader(){
    if(props.displayExportCheckmarks){
      let exportsAllChecked = get(this, 'data.collections.checkedExports.exportsAll', false)
      return(
        <TableCell className="exportAll"><Checkbox onChange={toggleAllExports.bind(this)} checked={exportsAllChecked} /></TableCell>
      )  
    }
  }
  
  function determineRowVisible(resourceName){
    //console.log('determineRowVisible', props, resourceName)
    let allowed = false;
    switch (props.mode) {
      case 'import':
        allowed = true;
        break;
      case 'export':        
        if(data.collections.client[resourceName] > 0){
          allowed = true;
        }
        break;
      case 'specific':        
        // we want specific resource types (that may be scanned and inbound)
        if(Array.isArray(props.resourceTypes)){
          if(props.resourceTypes.includes(resourceName)){
            allowed = true;
          }          
        }
        break;
      case 'additive':        
        // we want specific resource types (that may be scanned and inbound)        
        if(Array.isArray(props.resourceTypes)){
          if(props.resourceTypes.includes(resourceName)){
            allowed = true;
          }          
        }   
        if(data.collections.client[resourceName] > 0){
          allowed = true;
        }
        break;        
      default:
        allowed = true;
        break;
    }
    return allowed;
  }
  function initializeCollection(collection){
    console.log("initializeCollection", collection);

    if (confirm('Are you sure?')) {
      if(collection === "Lists"){
        Meteor.call('initializeChecklilsts', function(error, result){
          if(result){
            console.log('result', result)
          }
        });

      }
    }
    
  }
  function callMethod(signature){
    console.log("callMethod", signature);

      if (confirm('Are you sure?')) {
        Meteor.call(signature, function(error, result){
          Meteor.call('getServerStats', function(error, result){
            if(result){
              Session.set('datalakeStats', result);
            }
          });
        });
      }
  }


  let shouldDisplayNoDataRow = true;

  let allergyIntolerancesRow;
  if(determineRowVisible("AllergyIntolerance")){
    shouldDisplayNoDataRow = false;
    allergyIntolerancesRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("AllergyIntolerance") }
      { renderImportCheckmark(toggleAllergies.bind(this), 'AllergyIntolerance') }
      { renderImportButton('AllergyIntolerances')} 
      <TableCell className="collection">Allergy Intolerance</TableCell>
      { renderPreview('AllergyIntolerance')} 
      { renderClientCount('AllergyIntolerance')} 
      { renderLocalClientCount('AllergyIntolerance')} 
      { renderPubSub('AllergyIntolerance')} 
      { renderDropButton('AllergyIntolerance')} 
      { renderExportButton('AllergyIntolerances')} 
      { renderExportCheckmark(toggleAllergiesExport.bind(this), 'AllergyIntolerance') }
    </TableRow>
  }

  let appointmentsRow;
  if(determineRowVisible("Appointment")){
    shouldDisplayNoDataRow = false;
    appointmentsRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("Appointment") }
      { renderImportCheckmark(toggleAppointments.bind(this), 'Appointment') }
      { renderImportButton('Appointments')} 
      <TableCell className="collection">Appointments</TableCell>
      { renderPreview('Appointment')} 
      { renderClientCount('Appointment')} 
      { renderLocalClientCount('Appointment')} 
      { renderPubSub('Appointment')} 
      { renderDropButton('Appointment')} 
      { renderExportButton('Appointments')} 
      { renderExportCheckmark(toggleAppointmentsExport.bind(this), 'Appointment') }
    </TableRow>
  }

  let bundlesRow;
  if(determineRowVisible("Bundle")){
    shouldDisplayNoDataRow = false;
    bundlesRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("Bundle") }
      { renderImportCheckmark(toggleBundles.bind(this), 'Bundle') }
      { renderImportButton('Bundles')} 
      <TableCell className="collection">Bundles</TableCell>
      { renderPreview('Bundle')} 
      { renderClientCount('Bundle')} 
      { renderLocalClientCount('Bundle')} 
      { renderPubSub('Bundle')} 
      { renderDropButton('Bundle')} 
      { renderExportButton('Bundles')} 
      { renderExportCheckmark(toggleBundlesExport.bind(this), 'Bundle') }
    </TableRow>
  }

  let carePlansRow;
  if(determineRowVisible("CarePlan")){
    shouldDisplayNoDataRow = false;
    carePlansRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("CarePlan") }
      { renderImportCheckmark(toggleCarePlans.bind(this), 'CarePlan') }
      { renderImportButton('CarePlans')} 
      <TableCell className="collection">Care Plans</TableCell>
      { renderPreview('CarePlan')} 
      { renderClientCount('CarePlan')} 
      { renderLocalClientCount('CarePlan')} 
      { renderPubSub('CarePlan')}       
      { renderDropButton('CarePlan')} 
      { renderExportButton('CarePlans')} 
      { renderExportCheckmark(toggleCarePlansExport.bind(this), 'CarePlan') }
    </TableRow>
  }

  let careTeamsRow;
  if(determineRowVisible("CareTeam")){
    shouldDisplayNoDataRow = false;
    careTeamsRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("CareTeam") }
      { renderImportCheckmark(toggleCareTeams.bind(this), 'CareTeam') }
      { renderImportButton('CareTeams')} 
      <TableCell className="collection">Care Plans</TableCell>
      { renderPreview('CareTeam')} 
      { renderClientCount('CareTeam')} 
      { renderLocalClientCount('CareTeam')} 
      { renderPubSub('CareTeam')}       
      { renderDropButton('CareTeam')} 
      { renderExportButton('CareTeams')} 
      { renderExportCheckmark(toggleCareTeamsExport.bind(this), 'CareTeam') }
    </TableRow>
  }

  let claimsRow;
  if(determineRowVisible("Claim")){
    shouldDisplayNoDataRow = false;
      claimsRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("Claim") }
      { renderImportCheckmark(toggleClaims.bind(this), 'Claim') }
      { renderImportButton('Claims')} 
      <TableCell className="collection">Claims</TableCell>
      { renderPreview('Claim')} 
      { renderClientCount('Claim')} 
      { renderLocalClientCount('Claim')} 
      { renderPubSub('Claim')}       
      { renderDropButton('Claim')} 
      { renderExportButton('Claims')} 
      { renderExportCheckmark(toggleClaimsExport.bind(this), 'Claim') }
    </TableRow>
  }

  let clinicalDocumentsRow;
  if(determineRowVisible("ClinicalDocument")){
    shouldDisplayNoDataRow = false;
    clinicalDocumentsRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("ClinicalDocument") }
      { renderImportCheckmark(toggleClinicalDocuments.bind(this), 'ClinicalDocument') }
      { renderImportButton('ClinicalDocuments')} 
      <TableCell className="collection">Clinical Documents</TableCell>
      { renderPreview('ClinicalDocument')} 
      { renderClientCount('ClinicalDocument')} 
      { renderLocalClientCount('ClinicalDocument')} 
      { renderPubSub('ClinicalDocument')} 
      { renderDropButton('ClinicalDocument')} 
      { renderExportButton('ClinicalDocuments')} 
      { renderExportCheckmark(toggleClinicalDocumentsExport.bind(this), 'ClinicalDocument') }
    </TableRow>
  }

  let clinicalImpressionsRow;
  if(determineRowVisible("ClinicalImpression")){
    shouldDisplayNoDataRow = false;
    clinicalImpressionsRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("ClinicalImpression") }
      { renderImportCheckmark(toggleClinicalImpressions.bind(this), 'ClinicalImpression') }
      { renderImportButton('ClinicalImpressions')} 
      <TableCell className="collection">Clinical Impressions</TableCell>
      { renderPreview('ClinicalImpression')} 
      { renderClientCount('ClinicalImpression')} 
      { renderLocalClientCount('ClinicalImpression')} 
      { renderPubSub('ClinicalImpression')} 
      { renderDropButton('ClinicalImpression')} 
      { renderExportButton('ClinicalImpressions')} 
      { renderExportCheckmark(toggleClinicalImpressionsExport.bind(this), 'ClinicalImpression') }
    </TableRow>
  }

  let conditionsRow;
  if(determineRowVisible("Condition")){
    shouldDisplayNoDataRow = false;
    conditionsRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("Condition") }
      { renderImportCheckmark(toggleConditions.bind(this), 'Condition') }
      { renderImportButton('Conditions')} 
      <TableCell className="collection">Conditions</TableCell>
      { renderPreview('Condition')} 
      { renderClientCount('Condition')} 
      { renderLocalClientCount('Condition')} 
      { renderPubSub('Condition')} 
      { renderDropButton('Condition')} 
      { renderExportButton('Conditions')} 
      { renderExportCheckmark(toggleConditionsExport.bind(this), 'Condition') }
    </TableRow>
  }

  let consentsRow;
  if(determineRowVisible("Consent")){
    shouldDisplayNoDataRow = false;
    consentsRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("Consent") }
      { renderImportCheckmark(toggleConsents.bind(this), 'Consent') }
      { renderImportButton('Consents')} 
      <TableCell className="collection">Consents</TableCell>
      { renderPreview('Consent')} 
      { renderClientCount('Consent')} 
      { renderLocalClientCount('Consent')} 
      { renderPubSub('Consent')} 
      { renderDropButton('Consent')} 
      { renderExportButton('Consents')} 
      { renderExportCheckmark(toggleConsentsExport.bind(this), 'Consent') }
    </TableRow>
  }

  let contractsRow;
  if(determineRowVisible("Contract")){
    shouldDisplayNoDataRow = false;
    contractsRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("Contract") }
      { renderImportCheckmark(toggleContracts.bind(this), 'Contract') }
      { renderImportButton('Contracts')} 
      <TableCell className="collection">Contracts</TableCell>
      { renderPreview('Contract')} 
      { renderClientCount('Contract')} 
      { renderLocalClientCount('Contract')} 
      { renderPubSub('Contract')}       
      { renderDropButton('Contract')} 
      { renderExportButton('Contracts')} 
      { renderExportCheckmark(toggleContractsExport.bind(this), 'Contract') }
    </TableRow>
  }

  let communicationsRow;
  if(determineRowVisible("Communication")){
    shouldDisplayNoDataRow = false;
    communicationsRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("Communication") }
      { renderImportCheckmark(toggleCommunications.bind(this), 'Communication') }
      { renderImportButton('Communications')} 
      <TableCell className="collection">Communications</TableCell>
      { renderPreview('Communication')} 
      { renderClientCount('Communication')} 
      { renderLocalClientCount('Communication')} 
      { renderPubSub('Communication')} 
      { renderDropButton('Communication')} 
      { renderExportButton('Communications')} 
      { renderExportCheckmark(toggleCommunicationsExport.bind(this), 'Communication') }
    </TableRow>
  }

  let communicationResponsesRow;
  if(determineRowVisible("CommunicationResponse")){
    shouldDisplayNoDataRow = false;
    communicationResponsesRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("CommunicationResponse") }
      { renderImportCheckmark(toggleCommunications.bind(this), 'CommunicationResponse') }
      { renderImportButton('CommunicationResponses')} 
      <TableCell className="collection">Communication Responses</TableCell>
      { renderPreview('CommunicationResponse')} 
      { renderClientCount('CommunicationResponse')} 
      { renderLocalClientCount('CommunicationResponse')} 
      { renderPubSub('CommunicationResponse')} 
      { renderDropButton('CommunicationResponse')} 
      { renderExportButton('CommunicationResponses')} 
      { renderExportCheckmark(toggleCommunicationResponsesExport.bind(this), 'CommunicationResponse') }
    </TableRow>
  }

  let communicationRequestsRow;
  if(determineRowVisible("CommunicationRequest")){
    shouldDisplayNoDataRow = false;
    communicationRequestsRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("CommunicationRequest") }
      { renderImportCheckmark(toggleCommunications.bind(this), 'CommunicationRequest') }
      { renderImportButton('CommunicationRequests')} 
      <TableCell className="collection">Communication Requests</TableCell>
      { renderPreview('CommunicationRequest')} 
      { renderClientCount('CommunicationRequest')} 
      { renderLocalClientCount('CommunicationRequest')} 
      { renderPubSub('CommunicationRequest')} 
      { renderDropButton('CommunicationRequest')} 
      { renderExportButton('CommunicationRequests')} 
      { renderExportCheckmark(toggleCommunicationRequestsExport.bind(this), 'CommunicationRequest') }
    </TableRow>
  }

  let devicesRow;
  if(determineRowVisible("Device")){
    shouldDisplayNoDataRow = false;
    devicesRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("Device") }
      { renderImportCheckmark(toggleDevices.bind(this), 'Device') }
      { renderImportButton('Devices')} 
      <TableCell className="collection">Devices</TableCell>
      { renderPreview('Device')} 
      { renderClientCount('Device')} 
      { renderLocalClientCount('Device')} 
      { renderPubSub('Device')} 
      { renderDropButton('Device')} 
      { renderExportButton('Devices')} 
      { renderExportCheckmark(toggleDevicesExport.bind(this), 'Device') }
    </TableRow>
  }

  let diagnosticReportsRow;
  if(determineRowVisible("DiagnosticReport")){
    shouldDisplayNoDataRow = false;
    diagnosticReportsRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("DiagnosticReport") }
      { renderImportCheckmark(toggleDiagnosticReports.bind(this), 'DiagnosticReport') }
      { renderImportButton('DiagnosticReports')} 
      <TableCell className="collection">Diagnostic Reports</TableCell>
      { renderPreview('DiagnosticReport')} 
      { renderClientCount('DiagnosticReport')} 
      { renderLocalClientCount('DiagnosticReport')} 
      { renderPubSub('DiagnosticReport')} 
      { renderDropButton('DiagnosticReport')} 
      { renderExportButton('DiagnosticReports')} 
      { renderExportCheckmark(toggleDiagnosticReportsExport.bind(this), 'DiagnosticReport') }
    </TableRow>
  }

  let documentReferencesRow;
  if(determineRowVisible("DocumentReference")){
    shouldDisplayNoDataRow = false;
    documentReferencesRow = <TableRow className='dataManagementRow' hover={true}>
      { renderImportCheckmark(toggleDocumentReferences.bind(this), 'DocumentReference') }
      { renderImportButton('DocumentReferences')} 
      <TableCell className="collection">Document Reference</TableCell>
      { renderPreview('DocumentReference')} 
      { renderClientCount('DocumentReference')} 
      { renderLocalClientCount('DocumentReference')} 
      { renderPubSub('DocumentReference')} 
      { renderDropButton('DocumentReference')} 
      { renderExportButton('DocumentReferences')} 
      { renderExportCheckmark(toggleDocumentReferencesExport.bind(this), 'DocumentReference') }
    </TableRow>
  }

  let encountersRow;
  if(determineRowVisible("Encounter")){
    shouldDisplayNoDataRow = false;
    encountersRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("Encounter") }
      { renderImportCheckmark(toggleEncounters.bind(this), 'Encounter') }
      { renderImportButton('Encounters')} 
      <TableCell className="collection">Encounters</TableCell>
      { renderPreview('Encounter')} 
      { renderClientCount('Encounter')} 
      { renderLocalClientCount('Encounter')} 
      { renderPubSub('Encounter')} 
      { renderDropButton('Encounter')} 
      { renderExportButton('Encounters')} 
      { renderExportCheckmark(toggleEncountersExport.bind(this), 'Encounter') }
    </TableRow>
  }

  let endpointsRow;
  if(determineRowVisible("Endpoint")){
    shouldDisplayNoDataRow = false;
    endpointsRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("Endpoint") }
      { renderImportCheckmark(toggleDevices.bind(this), 'Endpoint') }
      { renderImportButton('Endpoints')}       
      <TableCell className="collection">Endpoint</TableCell>
      { renderPreview('Endpoint')} 
      { renderClientCount('Endpoint')} 
      { renderLocalClientCount('Endpoint')} 
      { renderPubSub('Endpoint')} 
      { renderDropButton('Endpoint')} 
      { renderExportButton('Endpoints')} 
      { renderExportCheckmark(toggleEndpointsExport.bind(this), 'Endpoint') }
    </TableRow>
  }

  let explanationOfBenefitsRow;
  if(determineRowVisible("ExplanationOfBenefit")){
    shouldDisplayNoDataRow = false;
    explanationOfBenefitsRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("ExplanationOfBenefit") }
      { renderImportCheckmark(toggleDevices.bind(this), 'ExplanationOfBenefit') }
      { renderImportButton('ExplanationOfBenefits')} 
      <TableCell className="collection">Explanation Of Benefit</TableCell>
      { renderPreview('ExplanationOfBenefit')} 
      { renderClientCount('ExplanationOfBenefit')} 
      { renderLocalClientCount('ExplanationOfBenefit')} 
      { renderPubSub('ExplanationOfBenefit')} 
      { renderDropButton('ExplanationOfBenefit')} 
      { renderExportButton('ExplanationOfBenefits')} 
      { renderExportCheckmark(toggleExplanationOfBenefitsExport.bind(this), 'ExplanationOfBenefit') }
    </TableRow>
  }

  let familyMemberHistoriesRow;
  if(determineRowVisible("FamilyMemberHistory")){
    shouldDisplayNoDataRow = false;
    familyMemberHistoriesRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("FamilyMemberHistory") }
      { renderImportCheckmark(toggleFamilyMemberHistories.bind(this), 'FamilyMemberHistory') }
      { renderImportButton('FamlyMemberHistories')} 
      <TableCell className="collection">Famly Member Histories</TableCell>
      { renderPreview('FamilyMemberHistory')} 
      { renderClientCount('FamilyMemberHistory')} 
      { renderLocalClientCount('FamilyMemberHistory')} 
      { renderPubSub('FamilyMemberHistory')} 
      { renderDropButton('FamilyMemberHistory')} 
      { renderExportButton('FamilyMemberHistories')} 
      { renderExportCheckmark(toggleFamilyMemberHistoriesExport.bind(this), 'FamilyMemberHistory') }
    </TableRow>
  }

  let goalsRow;
  if(determineRowVisible("Goal")){
    shouldDisplayNoDataRow = false;
    goalsRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("Goal") }
      { renderImportCheckmark(toggleGoals.bind(this), 'Goal') }
      { renderImportButton('Goals')} 
      <TableCell className="collection">Goals</TableCell>
      { renderPreview('Goal')} 
      { renderClientCount('Goal')} 
      { renderLocalClientCount('Goal')} 
      { renderPubSub('Goal')} 
      { renderDropButton('Goal')} 
      { renderExportButton('Goals')} 
      { renderExportCheckmark(toggleGoalsExport.bind(this), 'Goal') }
    </TableRow>
  }

  let immunizationsRow;
  if(determineRowVisible("Immunization")){
    shouldDisplayNoDataRow = false;
    immunizationsRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("Immunization") }
      { renderImportCheckmark(toggleImmunizations.bind(this), 'Immunization') }
      { renderImportButton('Immunizations')} 
      <TableCell className="collection">Immunizations</TableCell>
      { renderPreview('Immunization')} 
      { renderClientCount('Immunization')} 
      { renderLocalClientCount('Immunization')} 
      { renderPubSub('Immunization')} 
      { renderDropButton('Immunization')} 
      { renderExportButton('Immunizations')} 
      { renderExportCheckmark(toggleImmunizationsExport.bind(this), 'Immunization') }
    </TableRow>
  }

  let imagingStudiesRow;
  if(determineRowVisible("ImagingStudy")){
    shouldDisplayNoDataRow = false;
    imagingStudiesRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("ImagingStudy") }
      { renderImportCheckmark(toggleImmagingStudies.bind(this), 'ImagingStudy') }
      { renderImportButton('ImagingStudies')} 
      <TableCell className="collection">ImagingStudies</TableCell>
      { renderPreview('ImagingStudy')} 
      { renderClientCount('ImagingStudy')} 
      { renderLocalClientCount('ImagingStudy')} 
      { renderPubSub('ImagingStudy')} 
      { renderDropButton('ImagingStudy')} 
      { renderExportButton('ImagingStudies')} 
      { renderExportCheckmark(toggleImagingStudiesExport.bind(this), 'ImagingStudy') }
    </TableRow> 
  }

  let listsRow;
  if(determineRowVisible("List")){
    shouldDisplayNoDataRow = false;
    listsRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("List") }
      { renderImportCheckmark(toggleLists.bind(this), 'List') }
      { renderImportButton('Lists')} 
      <TableCell className="collection">Lists</TableCell>
      { renderPreview('List')} 
      { renderClientCount('List')} 
      { renderLocalClientCount('List')} 
      { renderPubSub('List')} 
      { renderDropButton('List')} 
      { renderExportButton('Lists')} 
      { renderExportCheckmark(toggleListsExport.bind(this), 'List') }
    </TableRow>
  }

  let locationsRow;
  if(determineRowVisible("Location")){
    shouldDisplayNoDataRow = false;
    locationsRow = <TableRow className='dataManagementRow' hover={true}>
      { renderIcon("Location") }
      { renderImportCheckmark(toggleLocations.bind(this), 'Location') }
      { renderImportButton('Locations')} 
      <TableCell className="collection">Locations</TableCell>
      { renderPreview('Location')} 
      { renderClientCount('Location')} 
      { renderLocalClientCount('Location')} 
      { renderPubSub('Location')} 
      { renderDropButton('Location')} 
      { renderExportButton('Locations')} 
      { renderExportCheckmark(toggleLocationsExport.bind(this), 'Location') }
    </TableRow>
  }

  let measuresRow;
  if(determineRowVisible("Measure")){
    shouldDisplayNoDataRow = false;
    measuresRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("Measure") }
      { renderImportCheckmark(toggleMeasures.bind(this), 'Measure') }
      { renderImportButton('Measures')} 
      <TableCell className="collection">Measures</TableCell>
      { renderPreview('Measure')} 
      { renderClientCount('Measure')} 
      { renderLocalClientCount('Measure')} 
      { renderPubSub('Measure')} 
      { renderDropButton('Measure')} 
      { renderExportButton('Measures')} 
      { renderExportCheckmark(toggleMeasuresExport.bind(this), 'Measure') }
    </TableRow>
  }

  let measureReportsRow;
  if(determineRowVisible("MeasureReport")){
    shouldDisplayNoDataRow = false;
    measureReportsRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("MeasureReport") }
      { renderImportCheckmark(toggleMeasureReports.bind(this), 'MeasureReport') }
      { renderImportButton('MeasureReports')} 
      <TableCell className="collection">MeasureReports</TableCell>
      { renderPreview('MeasureReport')} 
      { renderClientCount('MeasureReport')} 
      { renderLocalClientCount('MeasureReport')} 
      { renderPubSub('MeasureReport')} 
      { renderDropButton('MeasureReport')} 
      { renderExportButton('MeasureReports')} 
      { renderExportCheckmark(toggleMeasureReportsExport.bind(this), 'MeasureReport') }
    </TableRow>
  }

  let medicationsRow;
  if(determineRowVisible("Medication")){
    shouldDisplayNoDataRow = false;
    medicationsRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("Medication") }
      { renderImportCheckmark(toggleMedications.bind(this), 'Medication') }
      { renderImportButton('Medications')} 
      <TableCell className="collection">Medications</TableCell>
      { renderPreview('Medication')} 
      { renderClientCount('Medication')} 
      { renderLocalClientCount('Medication')} 
      { renderPubSub('Medication')} 
      { renderDropButton('Medication')} 
      { renderExportButton('Medications')} 
      { renderExportCheckmark(toggleMedicationsExport.bind(this), 'Medication') }
    </TableRow>
  }

  let medicationOrdersRow;
  if(determineRowVisible("MedicationOrder")){
    shouldDisplayNoDataRow = false;
    medicationOrdersRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("MedicationOrder") }
      { renderImportCheckmark(toggleMedicationOrders.bind(this), 'MedicationOrder') }
      { renderImportButton('MedicationOrders')} 
      <TableCell className="collection">MedicationOrders</TableCell>
      { renderPreview('MedicationOrder')} 
      { renderClientCount('MedicationOrder')} 
      { renderLocalClientCount('MedicationOrder')} 
      { renderPubSub('MedicationOrder')}       
      { renderDropButton('MedicationOrder')} 
      { renderExportButton('MedicationOrders')} 
      { renderExportCheckmark(toggleMedicationOrdersExport.bind(this), 'MedicationOrder') }
    </TableRow>
  }

  let medicationStatementsRow;
  if(determineRowVisible("MedicationStatement")){
    shouldDisplayNoDataRow = false;
    medicationStatementsRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("MedicationStatement") }
      { renderImportCheckmark(toggleMedicationStatements.bind(this), 'MedicationStatement') }
      { renderImportButton('MedicationStatements')} 
      <TableCell className="collection">MedicationStatements</TableCell>
      { renderPreview('MedicationStatement')} 
      { renderClientCount('MedicationStatement')} 
      { renderLocalClientCount('MedicationStatement')} 
      { renderPubSub('MedicationStatement')} 
      { renderDropButton('MedicationStatement')} 
      { renderExportButton('MedicationStatements')} 
      { renderExportCheckmark(toggleMedicationStatementsExport.bind(this), 'MedicationStatement') }
    </TableRow>
  }

  let messageHeadersRow;
  if(determineRowVisible("MessageHeader")){
    shouldDisplayNoDataRow = false;
    messageHeadersRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("MessageHeader") }
      { renderImportCheckmark(toggleMessageHeaders.bind(this), 'MessageHeader') }
      { renderImportButton('MessageHeaders')} 
      <TableCell className="collection">Message Headers</TableCell>
      { renderPreview('MessageHeader')} 
      { renderClientCount('MessageHeader')} 
      { renderLocalClientCount('MessageHeader')} 
      { renderPubSub('MessageHeader')} 
      { renderDropButton('MessageHeader')} 
      { renderExportButton('MessageHeaders')} 
      { renderExportCheckmark(toggleMessageHeadersExport.bind(this), 'MessageHeader') }
    </TableRow>
  }

  let observationsRow;
  if(determineRowVisible("Observation")){
    shouldDisplayNoDataRow = false;
    observationsRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("Observation") }
      { renderImportCheckmark(toggleObservations.bind(this), 'Observation') }
      { renderImportButton('Observations')} 
      <TableCell className="collection">Observations</TableCell>
      { renderPreview('Observation')} 
      { renderClientCount('Observation')} 
      { renderLocalClientCount('Observation')} 
      { renderPubSub('Observation')} 
      { renderDropButton('Observation')} 
      { renderExportButton('Observations')} 
      { renderExportCheckmark(toggleObservationsExport.bind(this), 'Observation') }
    </TableRow>
  }

  let organizationsRow;
  if(determineRowVisible("Organization")){
    shouldDisplayNoDataRow = false;
    organizationsRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("Organization") }
      { renderImportCheckmark(toggleOrganizations.bind(this), 'Organization') }
      { renderImportButton('Organizations')} 
      <TableCell className="collection">Organizations</TableCell>
      { renderPreview('Organization')} 
      { renderClientCount('Organization')} 
      { renderLocalClientCount('Organization')} 
      { renderPubSub('Organization')} 
      { renderDropButton('Organization')} 
      { renderExportButton('Organizations')} 
      { renderExportCheckmark(toggleOrganizationsExport.bind(this), 'Organization') }
    </TableRow>
  }

  let patientsRow;
  if(determineRowVisible("Patient")){
    shouldDisplayNoDataRow = false;
    patientsRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("Patient") }
      { renderImportCheckmark(togglePatients.bind(this), 'Patient') }
      { renderImportButton('Patients')} 
      <TableCell className="collection">Patients</TableCell>
      { renderPreview('Patient')} 
      { renderClientCount('Patient')} 
      { renderLocalClientCount('Patient')} 
      { renderPubSub('Patient')} 
      { renderDropButton('Patient')} 
      { renderExportButton('Patients')} 
      { renderExportCheckmark(togglePatientsExport.bind(this), 'Patient') }
    </TableRow>
  }

  let personsRow;
  if(determineRowVisible("Person")){
    shouldDisplayNoDataRow = false;
    personsRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("Person") }
      { renderImportCheckmark(togglePersons.bind(this), 'Person') }
      { renderImportButton('Persons')} 
      <TableCell className="collection">Persons</TableCell>
      { renderPreview('Person')} 
      { renderClientCount('Person')} 
      { renderLocalClientCount('Person')} 
      { renderPubSub('Person')} 
      { renderDropButton('Person')} 
      { renderExportButton('Persons')} 
      { renderExportCheckmark(togglePersonsExport.bind(this), 'Person') }
    </TableRow>
  }

  let practitionersRow;
  if(determineRowVisible("Practitioner")){
    shouldDisplayNoDataRow = false;
    practitionersRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("Practitioner") }
      { renderImportCheckmark(togglePractitioners.bind(this), 'Practitioner') }
      { renderImportButton('Practitioners')} 
      <TableCell className="collection">Practitioners</TableCell>
      { renderPreview('Practitioner')} 
      { renderClientCount('Practitioner')} 
      { renderLocalClientCount('Practitioner')} 
      { renderPubSub('Practitioner')} 
      { renderDropButton('Practitioner')} 
      { renderExportButton('Practitioners')} 
      { renderExportCheckmark(togglePractitionersExport.bind(this), 'Practitioner') }
    </TableRow>
  }

  let proceduresRow;
  if(determineRowVisible("Procedure")){
    shouldDisplayNoDataRow = false;
    proceduresRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("Procedure") }
      { renderImportCheckmark(toggleProcedures.bind(this), 'Procedure') }
      { renderImportButton('Procedures')} 
      <TableCell className="collection">Procedures</TableCell>
      { renderPreview('Procedure')} 
      { renderClientCount('Procedure')} 
      { renderLocalClientCount('Procedure')} 
      { renderPubSub('Procedure')} 
      { renderDropButton('Procedure')} 
      { renderExportButton('Procedures')} 
      { renderExportCheckmark(toggleProceduresExport.bind(this), 'Procedure') }
    </TableRow>
  }

  let procedureRequetsRow;
  if(determineRowVisible("ProcedureRequets")){
    shouldDisplayNoDataRow = false;
    procedureRequetsRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("ProcedureRequest") }
      { renderImportCheckmark(toggleProcedureRequests.bind(this), 'ProcedureRequest') }
      { renderImportButton('ProcedureRequests')} 
      <TableCell className="collection">ProcedureRequests</TableCell>
      { renderPreview('ProcedureRequest')} 
      { renderClientCount('ProcedureRequest')} 
      { renderLocalClientCount('ProcedureRequest')} 
      { renderPubSub('ProcedureRequest')} 
      { renderDropButton('ProcedureRequest')} 
      { renderExportButton('ProcedureRequests')} 
      { renderExportCheckmark(toggleProcedureRequestsExport.bind(this), 'ProcedureRequest') }
    </TableRow>
  }

  let questionnairesRow;
  if(determineRowVisible("Questionnaire")){
    shouldDisplayNoDataRow = false;
    questionnairesRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("Questionnaire") }
      { renderImportCheckmark(toggleQuestionnaires.bind(this), 'Questionnaire') }
      { renderImportButton('Questionnaires')} 
      <TableCell className="collection">Questionnaires</TableCell>
      { renderPreview('Questionnaire')} 
      { renderClientCount('Questionnaire')} 
      { renderLocalClientCount('Questionnaire')} 
      { renderPubSub('Questionnaire')} 
      { renderDropButton('Questionnaire')} 
      { renderExportButton('Questionnaires')} 
      { renderExportCheckmark(toggleQuestionnairesExport.bind(this), 'Questionnaire') }
    </TableRow>
  }

  let questionnaireResponsesRow;
  if(determineRowVisible("QuestionnaireResponse")){
    shouldDisplayNoDataRow = false;
    questionnaireResponsesRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("QuestionnaireResponse") }
      { renderImportCheckmark(toggleQuestionnaires.bind(this), 'QuestionnaireResponse') }
      { renderImportButton('QuestionnaireResponses')} 
      <TableCell className="collection">Questionnaire Responses</TableCell>
      { renderPreview('QuestionnaireResponse')} 
      { renderClientCount('QuestionnaireResponse')} 
      { renderLocalClientCount('QuestionnaireResponse')} 
      { renderPubSub('QuestionnaireResponse')} 
      { renderDropButton('QuestionnaireResponse')} 
      { renderExportButton('QuestionnaireResponses')} 
      { renderExportCheckmark(toggleQuestionnaireResponsesExport.bind(this), 'QuestionnaireResponse') }
    </TableRow>
  }

  let relatedPersonsRow;
  if(determineRowVisible("RelatedPerson")){
    shouldDisplayNoDataRow = false;
    relatedPersonsRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("RelatedPerson") }
      { renderImportCheckmark(toggleRelatedPersons.bind(this), 'RelatedPerson') }
      { renderImportButton('RelatedPersons')} 
      <TableCell className="collection">Related Persons</TableCell>
      { renderPreview('RelatedPerson')} 
      { renderClientCount('RelatedPerson')} 
      { renderLocalClientCount('RelatedPerson')} 
      { renderPubSub('RelatedPerson')} 
      { renderDropButton('RelatedPerson')} 
      { renderExportButton('RelatedPersons')} 
      { renderExportCheckmark(toggleRelatedPersonsExport.bind(this), 'RelatedPerson') }
    </TableRow>
  }

  let riskAssessmentsRow;
  if(determineRowVisible("RiskAssessment")){
    shouldDisplayNoDataRow = false;
    riskAssessmentsRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("RiskAssessment") }
      { renderImportCheckmark(toggleRiskAssessments.bind(this), 'RiskAssessment') }
      { renderImportButton('RiskAssessments')} 
      <TableCell className="collection">Risk Assessments</TableCell>
      { renderPreview('RiskAssessment')} 
      { renderClientCount('RiskAssessment')} 
      { renderLocalClientCount('RiskAssessment')} 
      { renderPubSub('RiskAssessment')} 
      { renderDropButton('RiskAssessment')} 
      { renderExportButton('RiskAssessments')} 
      { renderExportCheckmark(toggleRiskAssessmentsExport.bind(this), 'RiskAssessment') }
    </TableRow>
  }

  let schedulesRow;
  if(determineRowVisible("Schedule")){
    shouldDisplayNoDataRow = false;
    schedulesRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("Schedule") }
      { renderImportCheckmark(toggleSchedules.bind(this), 'Schedule') }
      { renderImportButton('Schedules')} 
      <TableCell className="collection">Schedules</TableCell>
      { renderPreview('Schedule')} 
      { renderClientCount('Schedule')} 
      { renderLocalClientCount('Schedule')} 
      { renderPubSub('Schedule')} 
      { renderDropButton('Schedule')} 
      { renderExportButton('Schedules')} 
      { renderExportCheckmark(toggleSchedulesExport.bind(this), 'Schedule') }
    </TableRow>
  }

  let serviceRequestsRow;
  if(determineRowVisible("ServiceRequest")){
    shouldDisplayNoDataRow = false;
    serviceRequestsRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("ServiceRequest") }
      { renderImportCheckmark(toggleServiceRequests.bind(this), 'ServiceRequest') }
      { renderImportButton('ServiceRequests')} 
      <TableCell className="collection">Service Requests</TableCell>
      { renderPreview('ServiceRequest')} 
      { renderClientCount('ServiceRequest')} 
      { renderLocalClientCount('ServiceRequest')} 
      { renderPubSub('ServiceRequest')} 
      { renderDropButton('ServiceRequest')} 
      { renderExportButton('ServiceRequests')} 
      { renderExportCheckmark(toggleServiceRequestsExport.bind(this), 'ServiceRequest') }
    </TableRow>
  }

  let sequencesRow;
  if(determineRowVisible("Sequence")){
    shouldDisplayNoDataRow = false;
    sequencesRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("Sequence") }
      { renderImportCheckmark(toggleSequences.bind(this), 'Sequence') }
      { renderImportButton('Sequences')} 
      <TableCell className="collection">Sequences</TableCell>
      { renderPreview('Sequence')} 
      { renderClientCount('Sequence')} 
      { renderLocalClientCount('Sequence')} 
      { renderPubSub('Sequence')} 
      { renderDropButton('Sequence')} 
      { renderExportButton('Sequences')} 
      { renderExportCheckmark(toggleSequencesExport.bind(this), 'Sequence') }
    </TableRow>     
  }

  let tasksRow;
  if(determineRowVisible("Task")){
    shouldDisplayNoDataRow = false;
    tasksRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("Task") }
      { renderImportCheckmark(toggleTasks.bind(this), 'Task') }
      { renderImportButton('Tasks')} 
      <TableCell className="collection">Tasks</TableCell>
      { renderPreview('Task')} 
      { renderClientCount('Task')} 
      { renderLocalClientCount('Task')} 
      { renderPubSub('Task')} 
      { renderDropButton('Task')} 
      { renderExportButton('Tasks')} 
      { renderExportCheckmark(toggleTasksExport.bind(this), 'Task') }
    </TableRow>     
  }

  let valueSetsRow;
  if(determineRowVisible("ValueSet")){
    shouldDisplayNoDataRow = false;
    valueSetsRow = <TableRow className='dataManagementRow'  hover={true}>
      { renderIcon("ValueSet") }
      { renderImportCheckmark(toggleValueSets.bind(this), 'ValueSet') }
      { renderImportButton('ValueSets')} 
      <TableCell className="collection">Value Sets</TableCell>
      { renderPreview('ValueSet')} 
      { renderClientCount('ValueSet')} 
      { renderLocalClientCount('ValueSet')} 
      { renderPubSub('ValueSet')} 
      { renderDropButton('ValueSet')} 
      { renderExportButton('ValueSets')} 
      { renderExportCheckmark(toggleValueSetsExport.bind(this), 'ValueSet') }
    </TableRow>     
  }

  let contentToRender;
  if(shouldDisplayNoDataRow){
    contentToRender = <div className="helveticas" style={{textAlign: 'center', padding: '40px', width: '100%'}}>
        <h2 className="helveticas" style={{margin: '10px'}}>{props.noDataMessage}</h2>
        <h4 className="helveticas"> Maybe try importing data instead?</h4>
      </div>          
  } else {
    contentToRender = <Table id="collectionManagementTable"  size={props.tableSize} aria-label="a data management table" >
      <TableHead>
        <TableRow>
          { renderIconHeader() }
          { renderImportCheckmarkHeader()}             
          { renderImportButtonHeader()} 
          <TableCell className="collection">Collection</TableCell>
          { renderPreviewHeader()} 
          { renderClientCountHeader()} 
          { renderLocalClientCountHeader()} 
          { renderPubSubHeader()}           
          { renderDropButtonHeader()} 
          { renderExportButtonHeader()} 
          { renderExportCheckmarkHeader()}
        </TableRow>
      </TableHead>
      <TableBody>
        
        { allergyIntolerancesRow }
        { appointmentsRow }
        { bundlesRow }
        { carePlansRow } 
        { careTeamsRow }
        { claimsRow }
        { clinicalDocumentsRow }
        { clinicalImpressionsRow }
        { conditionsRow }
        { consentsRow }
        { contractsRow }
        { communicationsRow } 
        { communicationResponsesRow } 
        { communicationRequestsRow } 
        { devicesRow }
        { diagnosticReportsRow }
        { documentReferencesRow }
        { encountersRow }
        { endpointsRow }
        { explanationOfBenefitsRow }
        { familyMemberHistoriesRow }
        { goalsRow }
        { immunizationsRow }
        { imagingStudiesRow }
        { listsRow } 
        { locationsRow }
        { measuresRow }
        { measureReportsRow }
        { medicationsRow }
        { medicationOrdersRow }
        { medicationStatementsRow }
        { messageHeadersRow }
        { observationsRow }
        { organizationsRow }
        { patientsRow }
        { personsRow }
        { practitionersRow }
        { proceduresRow }
        { procedureRequetsRow }
        { questionnairesRow }
        { questionnaireResponsesRow }
        { relatedPersonsRow }
        { riskAssessmentsRow }
        { schedulesRow }
        { serviceRequestsRow }
        { sequencesRow }              
        { tasksRow }  
        { valueSetsRow }            
      </TableBody>
    </Table>
  }



  return(
    <div style={props.style} >
      { contentToRender }
    </div>
  );

}



CollectionManagement.propTypes = {
  displayIcons: PropTypes.bool,
  displayImportCheckmarks: PropTypes.bool,
  displayExportCheckmarks: PropTypes.bool,
  displayPubSubEnabled: PropTypes.bool,
  displayClientCount: PropTypes.bool,
  displayLocalClientCount: PropTypes.bool,
  displayServerCount: PropTypes.bool,
  displayInit: PropTypes.bool,
  displayDrop: PropTypes.bool,
  displaySync: PropTypes.bool,
  displayImportButton: PropTypes.bool,
  displayExportButton: PropTypes.bool,
  displayDropButton: PropTypes.bool,
  displayPreview: PropTypes.bool,
  mode: PropTypes.string,
  exportFileType: PropTypes.string,
  resourceTypes: PropTypes.array,
  noDataMessage: PropTypes.string,
  preview: PropTypes.object,
  selectedPatientId: PropTypes.string,
  tableSize: PropTypes.string
}
CollectionManagement.defaultProps = {
  displayIcons: false,
  displayImportCheckmarks: false,
  displayExportCheckmarks: true,
  displayPubSubEnabled: false,
  displayClientCount: true,
  displayLocalClientCount: false,
  displayServerCount: false,
  displayInit: false,
  displayDrop: false,
  displaySync: false,
  displayImportButton: false,
  displayExportButton: true,
  displayDropButton: false,
  displayPreview: false,
  selectedPatientId: '',
  resourceTypes: ["AllergyIntolerance", "CarePlan", "Condition", "Immunization", "Medication", "MedicationStatement", "Patient", "Procedure"],
  mode: 'all',  // all, import, export, specific, additive
  exportFileType: 'json', // json, geojson, fhir, csv
  noDataMessage: "No data found.",
  preview: {},
  tableSize: 'small'
}

export default CollectionManagement;
