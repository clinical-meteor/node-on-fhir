// yes, yes... this is a Class component, instead of a Pure Function
// TODO:  refactor into a <PatientDataQuery /> pure function with hooks, effect, and context


import { useLocation, useParams, useHistory } from "react-router-dom";

import React, {useEffect, useContext} from "react";
import ChartJS from "chart.js";
import { FhirClientContext } from "../FhirClientContext";

import { StyledCard, PageCanvas, DynamicSpacer, FhirUtilities } from 'fhir-starter';

import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';

import { useTracker } from 'meteor/react-meteor-data';

import { Consents, CarePlans, CareTeams, Encounters, Procedures, Conditions, Immunizations, ImmunizationsTable, Observations, Locations, Questionnaires, QuestionnaireResponses, CarePlansTable, CareTeamsTable, LocationsTable, EncountersTable, ProceduresTable, ConditionsTable, ObservationsTable, ConsentsTable, QuestionnairesTable, QuestionnaireResponsesTable } from 'meteor/clinical:hl7-fhir-data-infrastructure';
import { get } from 'lodash';

import PatientCard from './PatientCard';




export function AutoDashboard(props){

    const client = useContext(FhirClientContext);

    let chartWidth = (window.innerWidth - 240) / 3;

    let data = {
        careTeams: [],
        carePlans: [],
        encounters: [],
        procedures: [],
        conditions: [],
        consents: [],
        observations: [],
        locations: [],
        immunizations: [],
        selectedPatientId: '',
        selectedPatient: null,
        patients: [],
        questionnaires: [],
        questionnaireResponses: [],
        quickchartTabIndex: 0,
        basicQuery: {}
    }

    data.selectedPatientId = useTracker(function(){
        return Session.get('selectedPatientId');
    }, []);
    data.selectedPatient = useTracker(function(){
        if(Session.get('selectedPatientId')){
            return Patients.findOne({id: Session.get('selectedPatientId')});
        } else if(get(Session.get('currentUser'), 'patientId')){
            return Patients.findOne({id: get(Session.get('currentUser'), 'patientId')});
        }   
    }, []);
    data.patients = useTracker(function(){
        return Patients.find().fetch();
    }, []);

    data.quickchartTabIndex = useTracker(function(){
        return Session.get('quickchartTabIndex')
    }, []);

    data.careTeamTabIndex = useTracker(function(){
        return Session.get('careTeamTabIndex')
    }, []);
    data.carePlanTabIndex = useTracker(function(){
        return Session.get('carePlanTabIndex')
    }, []);

    console.log('Autodashboard.data.selectedPatientId', data.selectedPatientId)


    // function FhirUtilities.addPatientFilterToQuery(patientId){
    //     let newQUery = {};

    //     if(patientId){
    //         newQUery = {$or: [
    //             {"patient.reference": "Patient/" + patientId},
    //             {"patient.reference": "urn:uuid:Patient/" + patientId},
    //             {"patient.reference": { $regex: ".*Patient/" + patientId}}, 
    //             {"subject.reference": { $regex: ".*Patient/" + patientId}}  
    //         ]}      
    //     } else {
    //         newQUery = {$or: [
    //             {"patient.reference": "Patient/anybody"},
    //             {"patient.reference": "urn:uuid:Patient/anybody"},
    //             {"patient.reference": { $regex: ".*Patient/anybody"}}, 
    //             {"subject.reference": { $regex: ".*Patient/anybody"}}  
    //           ]}
    //     }

    //     return newQUery
    // }

    data.basicQuery = useTracker(function(){
        return FhirUtilities.addPatientFilterToQuery(Session.get('selectedPatientId'));
    }, []);
    
    
    


    console.log('Autodashboard.basicQuery', data.basicQuery)

    if(CareTeams){
        data.careTeams = useTracker(function(){
            return CareTeams.find(FhirUtilities.addPatientFilterToQuery(Session.get('selectedPatientId'))).fetch()
        }, [])    
    }
    if(CarePlans){
        data.carePlans = useTracker(function(){
            return CarePlans.find(FhirUtilities.addPatientFilterToQuery(Session.get('selectedPatientId'))).fetch()
        }, [])    
    }
    if(Consents){
        data.consents = useTracker(function(){
            return Consents.find(FhirUtilities.addPatientFilterToQuery(Session.get('selectedPatientId'))).fetch()
        }, [])    
    }
    if(Conditions){
        data.conditions = useTracker(function(){
            return Conditions.find(FhirUtilities.addPatientFilterToQuery(Session.get('selectedPatientId'))).fetch()
        }, [])    
    }
    if(Encounters){
        data.encounters = useTracker(function(){
            return Encounters.find(FhirUtilities.addPatientFilterToQuery(Session.get('selectedPatientId'))).fetch()
        }, [])   
    }
    if(Immunizations){
        data.immunizations = useTracker(function(){
            return Immunizations.find(FhirUtilities.addPatientFilterToQuery(Session.get('selectedPatientId'))).fetch()
        }, [])   
    }
    if(Locations){
        data.locations = useTracker(function(){
            return Locations.find().fetch()
        }, [])   
    }
    if(Procedures){
        data.procedures = useTracker(function(){
            return Procedures.find(FhirUtilities.addPatientFilterToQuery(Session.get('selectedPatientId'))).fetch()
        }, [])   
    }
    if(Observations){
        data.observations = useTracker(function(){
            return Observations.find(FhirUtilities.addPatientFilterToQuery(Session.get('selectedPatientId'))).fetch()
        }, [])   
    }

    if(Questionnaires){
        data.questionnaires = useTracker(function(){
            return Questionnaires.find().fetch()
        }, [])   
    }
    if(QuestionnaireResponses){
        data.questionnaireResponses = useTracker(function(){
            return QuestionnaireResponses.find(FhirUtilities.addPatientFilterToQuery(Session.get('selectedPatientId'))).fetch()
        }, [])   
    }

    console.log('AutoDashboard.data', data);



    let useLocationSearch = useLocation().search;

    let isMobile = false
    if(window.innerWidth < 920){
        isMobile = true;
    }

    let careTeamContent;
    if(data.careTeams.length > 0){
        careTeamContent = <CardContent>
            <CareTeamsTable
                careTeams={data.careTeams}
                hideCategory={true}
                hideIdentifier={true}
                count={data.careTeams.length}
            />
        </CardContent>
    }
    let carePlansContent;
    if(data.carePlans.length > 0){
        carePlansContent = <CardContent>
            <CarePlansTable
                locations={data.locations}
                count={data.locations.length}
            />
        </CardContent>                    
    }

    let consentContent;
    if(data.consents.length > 0){
        consentContent = <CardContent>
            <ConsentsTable
                hideDates={true}
                hidePeriodStart={true}
                hidePeriodEnd={true}
                hideOrganization={true}
                hideCategory={true}
                hidePatientName={isMobile}
                consents={data.consents}
                count={data.consents.length}
            />
        </CardContent> 
    }

    let encountersContent;
    if(data.encounters.length > 0){
        encountersContent = <CardContent>
            <EncountersTable
                encounters={data.encounters}
                hideCheckboxes={true}
                hideActionIcons={true}
                hideSubjects={true}
                hideType={false}
                hideTypeCode={false}
                hideReason={isMobile}
                hideReasonCode={isMobile}
                hideHistory={true}
                hideEndDateTime={true}
                count={data.encounters.length}
            />
        </CardContent> 
    }
    let conditionsContent;
    if(data.conditions.length > 0){
        conditionsContent = <CardContent>
            <ConditionsTable
                conditions={data.conditions}
                hideCheckbox={true}
                hideActionIcons={true}
                hidePatientName={true}
                hidePatientReference={true}
                hideAsserterName={true}
                hideEvidence={true}
                hideBarcode={true}
                hideDates={false}
                count={data.conditions.length}
            />                                        
        </CardContent>                    
    }
    let locationsContent;
    if(data.locations.length > 0){
        locationsContent = <CardContent>
            <LocationsTable
                locations={data.locations}
                count={data.locations.length}
            />
        </CardContent>                    
    }
    let immunizationsContent;
    if(data.immunizations.length > 0){
        immunizationsContent = <CardContent>
            <ImmunizationsTable
                immunizations={data.immunizations}
                hideCheckbox={true}
                hideIdentifier={true}
                hideActionIcons={true}
                hidePatient={true}
                hidePerformer={true}
                hideVaccineCode={false}
                hideVaccineCodeText={false}
                count={data.immunizations.length}
            />                                        
        </CardContent> 
    }
    let observationsContent;
    if(data.observations.length > 0){
        observationsContent = <CardContent>
            <ObservationsTable 
                observations={data.observations}
                hideCheckbox={true}
                hideActionIcons={true}
                hideSubject={true}
                hideDevices={true}
                hideValue={false}
                hideBarcode={true}
                hideDenominator={true}
                hideNumerator={true}
                multiline={true}
                multiComponentValues={true}
                hideSubjectReference={true}
                count={data.observations.length}
            />                                                                                                           
        </CardContent>                    
    }
    let proceduresContent;
    if(data.procedures.length > 0){
        proceduresContent = <CardContent>
            <ProceduresTable 
                procedures={data.procedures}
                hideCheckbox={true}
                hideActionIcons={true}
                hideIdentifier={true}
                hideCategory={true}
                hideSubject={true}
                hideBodySite={true}
                hideCode={isMobile}
                hidePerformer={isMobile}
                hidePerformedDateEnd={true}
                hideSubjectReference={true}
                hideNotes={isMobile}
                hideBarcode={true}
                count={data.procedures.length}
            />                                                                                                           
        </CardContent>                    
    }


    let questionnairesContent;
    if(data.questionnaires.length > 0){
        questionnairesContent = <CardContent>
            <QuestionnairesTable
                questionnaires={data.questionnaires}
                count={data.questionnaires.length}
                hideSubject={isMobile}
                hideSubjectReference={isMobile}
                hideIdentifier={true}
            />
        </CardContent>                    
    }

    let questionnaireResponsesContent;
    if(data.questionnaireResponses.length > 0){
        questionnaireResponsesContent = <CardContent>
            <QuestionnaireResponsesTable
                questionnaireResponses={data.questionnaireResponses}
                count={data.questionnaireResponses.length}
                hideCheckbox={true}
                hideActionIcons={true}
                hideIdentifier={true}
                hideSourceReference={isMobile}
                hideSo
            />
        </CardContent>
    }

    let leftColumnStyle = {
        paddingRight: '10px'
    }
    let centerColumnStyle = {
        paddingRight: '10px', 
        paddingLeft: '10px'
    }
    let rightColumnStyle = {
        paddingLeft: '10px',
        marginBottom: '84px'
    }

    if(window.innerWidth < 768){
        leftColumnStyle.paddingRight = '0px'
        centerColumnStyle.paddingRight = '0px'
        centerColumnStyle.paddingLeft = '0px'
        rightColumnStyle.paddingLeft = '0px'
    }
    
    let patientIntakeLayout = <Grid container justify="center" style={{marginTop: '20px', marginBottom: '84px'}}>
        <Grid item xs={12} md={4} style={leftColumnStyle}>
            <CardHeader title="Who?" />
            <PatientCard patient={data.selectedPatient} showBarcode={true} />
            <DynamicSpacer />
            <StyledCard scrollable >
                <CardHeader title={data.careTeams.length + " Care Teams"} />
                { careTeamContent }          
            </StyledCard>
            <DynamicSpacer />
            <StyledCard scrollable >
                <CardHeader title={data.consents.length + " Consents"} />
                { consentContent }  
            </StyledCard>
            <DynamicSpacer />
            <CardHeader title="Where?" />
            <StyledCard scrollable >
                <CardHeader title={data.encounters.length + " Encounters"} />
                {encountersContent}               
            </StyledCard>
            <DynamicSpacer />
            <StyledCard scrollable >
                <CardHeader title={data.locations.length + " Locations"} />
                {locationsContent}                
            </StyledCard>            
        </Grid>
        <Grid item xs={12} md={4} style={centerColumnStyle}>
            <CardHeader title="What?" />
            <StyledCard scrollable >
                <CardHeader title={data.conditions.length + " Conditions"} />
                {conditionsContent}
            </StyledCard>                
            <DynamicSpacer />
            <StyledCard scrollable >
                <CardHeader title={data.immunizations.length + " Immunizations"} />
                {immunizationsContent}
            </StyledCard>                
            <DynamicSpacer />
            <StyledCard scrollable>
                <CardHeader title={data.procedures.length + " Procedures"} />
                {proceduresContent}                
            </StyledCard>                
        </Grid>
        <Grid item xs={12} md={4} style={rightColumnStyle}>
            <CardHeader title="How?" />
            <StyledCard scrollable >
                <CardHeader title={data.locations.length + " Care Plans"} />
                {carePlansContent}                
            </StyledCard>
            <DynamicSpacer />
            
            <StyledCard scrollable >
                <CardHeader title={data.observations.length + " Observations"} />
                {observationsContent}                
            </StyledCard>  

            <DynamicSpacer />
            <StyledCard scrollable >
                <CardHeader title={data.questionnaires.length + " Questionnaires"} />
                {questionnairesContent}                
            </StyledCard>
            <DynamicSpacer />
            <StyledCard scrollable >
                <CardHeader title={data.questionnaireResponses.length + " Questionnaire Responses"} />
                {questionnaireResponsesContent}                   
            </StyledCard>

        </Grid>
    </Grid>

    let patientChartLayout = <Grid container style={{marginTop: '20px', paddingBottom: '84px'}} justify="center">
        <Grid item xs={12} sm={12} md={12} lg={6}>
            <PatientCard patient={data.selectedPatient} />
            <DynamicSpacer />
            <StyledCard scrollable >
                <CardHeader title={data.encounters.length + " Encounters"} />
               {encountersContent}                                
            </StyledCard>
            <DynamicSpacer />
            <StyledCard scrollable >
                <CardHeader title={data.conditions.length + " Conditions"} />
                {conditionsContent}                
            </StyledCard>                
            <DynamicSpacer />
            <StyledCard scrollable >
                <CardHeader title={data.immunizations.length + " Immunizations"} />
                {immunizationsContent}                   
            </StyledCard>                
            <DynamicSpacer />
            <StyledCard scrollable>
                <CardHeader title={data.procedures.length + " Procedures"} />
                {proceduresContent}                            
            </StyledCard>                
            <DynamicSpacer />            
            <StyledCard scrollable >
                <CardHeader title={data.observations.length + " Observations"} />
                {observationsContent}                        
            </StyledCard>  
            <DynamicSpacer />
            <StyledCard scrollable >
                <CardHeader title={data.questionnaireResponses.length + " Questionnaire Responses"} />
                {questionnaireResponsesContent}                 
            </StyledCard>
        </Grid>        
    </Grid>

    let autoDashboardContent = patientIntakeLayout;

    switch (data.quickchartTabIndex) {
        case 0:
            autoDashboardContent = patientChartLayout;
            break;
        case 1:
            autoDashboardContent = patientIntakeLayout;
            break;
    }

    return (
       autoDashboardContent
    )
}

export default AutoDashboard;