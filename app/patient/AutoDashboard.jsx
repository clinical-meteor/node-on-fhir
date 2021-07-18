// yes, yes... this is a Class component, instead of a Pure Function
// TODO:  refactor into a <PatientDataQuery /> pure function with hooks, effect, and context


import { useLocation, useParams, useHistory } from "react-router-dom";

import React, {useEffect, useContext} from "react";
import ChartJS from "chart.js";
import { FhirClientContext } from "../FhirClientContext";

import { StyledCard } from 'fhir-starter';

import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';

import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';
import { useTracker } from 'meteor/react-meteor-data';

import { Consents, CarePlans, CareTeams, Encounters, Procedures, Conditions, Immunizations, ImmunizationsTable, Observations, Locations, Questionnaires, QuestionnaireResponses, CarePlansTable, CareTeamsTable, LocationsTable, EncountersTable, ProceduresTable, ConditionsTable, ObservationsTable, ConsentsTable, QuestionnairesTable, QuestionnaireResponsesTable } from 'meteor/clinical:hl7-fhir-data-infrastructure';
import { get } from 'lodash';

import PatientCard from './PatientCard';

function DynamicSpacer(props){
    return <br className="dynamicSpacer" style={{height: '40px'}}/>;
}
  
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
        quickchartTabIndex: 0
    }

    data.selectedPatientId = useTracker(function(){
        return Session.get('selectedPatientId');
    }, []);
    data.selectedPatient = useTracker(function(){
        return Session.get('selectedPatient');
        // return Patients.findOne({_id: Session.get('selectedPatientId')});
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



    if(CareTeams){
        data.careTeams = useTracker(function(){
            return CareTeams.find().fetch()
        }, [])    
    }
    if(CarePlans){
        data.carePlans = useTracker(function(){
            return CarePlans.find().fetch()
        }, [])    
    }
    if(Consents){
        data.consents = useTracker(function(){
            return Consents.find().fetch()
        }, [])    
    }
    if(Conditions){
        data.conditions = useTracker(function(){
            return Conditions.find().fetch()
        }, [])    
    }
    if(Encounters){
        data.encounters = useTracker(function(){
            return Encounters.find().fetch()
        }, [])   
    }
    if(Immunizations){
        data.immunizations = useTracker(function(){
            return Immunizations.find().fetch()
        }, [])   
    }
    if(Locations){
        data.locations = useTracker(function(){
            return Locations.find().fetch()
        }, [])   
    }
    if(Procedures){
        data.procedures = useTracker(function(){
            return Procedures.find().fetch()
        }, [])   
    }
    if(Observations){
        data.observations = useTracker(function(){
            return Observations.find().fetch()
        }, [])   
    }

    if(Questionnaires){
        data.questionnaires = useTracker(function(){
            return Questionnaires.find().fetch()
        }, [])   
    }
    if(QuestionnaireResponses){
        data.questionnaireResponses = useTracker(function(){
            return QuestionnaireResponses.find().fetch()
        }, [])   
    }




    let useLocationSearch = useLocation().search;


    let displayPatient = {};
    if(typeof data.selectedPatient === "object"){
        displayPatient = data.selectedPatient
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
                hideEndDateTime={true}
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
                hideType={true}
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
                hidePerformedDateEnd={true}
                hideSubjectReference={true}
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
    
    let patientIntakeLayout = <Grid container justify="center" style={{marginTop: '20px'}}>
        <Grid item xs={12} md={4} style={leftColumnStyle}>
            <CardHeader title="Who?" />
            <PatientCard patient={displayPatient} />
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

    let patientChartLayout = <Grid container style={{marginTop: '20px'}} justify="center">
        <Grid item xs={12} md={4}>
            <PatientCard patient={displayPatient} />
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
            autoDashboardContent = patientIntakeLayout;
            break;
        case 1:
            autoDashboardContent = patientChartLayout;
            break;
    }

    return (
       autoDashboardContent
    )
}

export default AutoDashboard;