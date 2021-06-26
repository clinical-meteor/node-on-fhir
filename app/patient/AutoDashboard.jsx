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

import { CarePlans, CareTeams, Encounters, Procedures, Conditions, Immunizations, ImmunizationsTable, Observations, Locations, CarePlansTable, CareTeamsTable, LocationsTable, EncountersTable, ProceduresTable, ConditionsTable, ObservationsTable } from 'meteor/clinical:hl7-fhir-data-infrastructure';
import { get } from 'lodash';

import PatientCard from './PatientCard';

function DynamicSpacer(props){
    return <br className="dynamicSpacer" style={{height: '40px'}}/>;
}
  
export function AutoDashboard(props){

    const client = useContext(FhirClientContext);

    let chartWidth = (window.innerWidth - 240) / 3;

    let data = {
        encounters: [],
        procedures: [],
        conditions: [],
        observations: [],
        locations: [],
        immunizations: [],
        selectedPatientId: '',
        selectedPatient: null,
        patients: [],
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
    if(Locations){
        data.locations = useTracker(function(){
            return Locations.find().fetch()
        }, [])   
    }
    if(Immunizations){
        data.immunizations = useTracker(function(){
            return Immunizations.find().fetch()
        }, [])   
    }




    function fetchPatientData(ehrLaunchCapabilities) {

        if(client){
            const observationQuery = new URLSearchParams();
            // observationQuery.set("code", "http://loinc.org|55284-4");
            if(client.patient){
                observationQuery.set("patient", client.patient);

                if(client.patient.id){
                    observationQuery.set("patient", client.patient.id);
                }    
            }
            observationQuery.set("category", "vital-signs");
            
            console.log('Observation Query', observationQuery);
    
            let observationUrl = 'Observation?' + observationQuery.toString();
            console.log('observationUrl', observationUrl);
    
            try {
                if(ehrLaunchCapabilities.Observation === true){
                    client.request(observationUrl, { pageLimit: 0, flat: true }).then(bpObservations => {
                        if(bpObservations){
                            const bpMap = {
                                systolic: [],
                                diastolic: []
                            };
                            console.log('PatientAutoDashboard.observations', bpObservations)
                            bpObservations.forEach(observation => {
                                Observations.upsert({id: observation.id}, {$set: observation}, {validate: false, filter: false});
                                if(Array.isArray(observation.component)){
                                    observation.component.forEach(c => {
                                        const code = client.getPath(c, "code.coding.0.code");
                                        if (code === "8480-6") {
                                            bpMap.systolic.push({
                                                x: new Date(observation.effectiveDateTime),
                                                y: c.valueQuantity.value
                                            });
                                        } else if (code === "8462-4") {
                                            bpMap.diastolic.push({
                                                x: new Date(observation.effectiveDateTime),
                                                y: c.valueQuantity.value
                                            });
                                        }
                                    });
                
                                }
                            });
                            bpMap.systolic.sort((a, b) => a.x - b.x);
                            bpMap.diastolic.sort((a, b) => a.x - b.x);
            
                            console.log('PatientAutoDashboard.bpMap', bpMap)
                            this.renderChart(bpMap);
                        }
                    });
                }

    
                if(ehrLaunchCapabilities.Encounter === true){
                    const encounterQuery = new URLSearchParams();
                    encounterQuery.set("patient", client.patient.id);
                    console.log('Encounter Query', encounterQuery);
        
                    let encounterUrl = 'Encounter?' + encounterQuery.toString()
                    console.log('encounterUrl', encounterUrl);
        
                    client.request(encounterUrl, { pageLimit: 0, flat: true }).then(encounters => {
                            const bpMap = {
                                systolic: [],
                                diastolic: []
                            };
                            if(encounters){
                                console.log('PatientAutoDashboard.encounters', encounters)
                                encounters.forEach(encounter => {
                                    Encounters.upsert({id: encounter.id}, {$set: encounter}, {validate: false, filter: false});                    
                                });    
                            }
                        });
                }

                if(ehrLaunchCapabilities.Condition === true){
                    const conditionQuery = new URLSearchParams();
                    conditionQuery.set("patient", client.patient.id);
                    console.log('Condition Query', conditionQuery);
        
                    let conditionUrl = 'Condition?' + conditionQuery.toString()
                    console.log('conditionUrl', conditionUrl);
        
                    client.request(conditionUrl, { pageLimit: 0, flat: true}).then(conditions => {
                            if(conditions){
                                console.log('PatientAutoDashboard.conditions', conditions)
                                conditions.forEach(condition => {
                                    Conditions.upsert({id: condition.id}, {$set: condition}, {validate: false, filter: false});                    
                                });    
                            }
                        });
                }

                if(ehrLaunchCapabilities.Procedure === true){
                    const procedureQuery = new URLSearchParams();
                    procedureQuery.set("patient", client.patient.id);
                    console.log('Procedure Query', procedureQuery);
        
                    let procedureUrl = 'Procedure?' + procedureQuery
                    console.log('procedureUrl', procedureUrl);
        
                    client.request(procedureUrl, { pageLimit: 0, flat: true }).then(procedures => {
                            if(procedures){
                                console.log('PatientAutoDashboard.procedures', procedures)
                                procedures.forEach(procedure => {
                                    Procedures.upsert({id: procedure.id}, {$set: procedure}, {validate: false, filter: false});                    
                                });    
                            }
                        });
                }

                if(ehrLaunchCapabilities.Immunization === true){
                    const immunizationQuery = new URLSearchParams();
                    immunizationQuery.set("patient", client.patient.id);
                    console.log('Immunization Query', immunizationQuery);
        
                    let immunizationUrl = 'Immunization?' + immunizationQuery
                    console.log('immunizationUrl', immunizationUrl);
        
                    client.request(immunizationUrl, {
                            pageLimit: 0,
                            flat: true
                        }).then(immunizations => {
                            if(immunizations){
                                console.log('PatientAutoDashboard.immunizations', immunizations)
                                immunizations.forEach(procedure => {
                                    Immunizations.upsert({id: procedure.id}, {$set: procedure}, {validate: false, filter: false});                    
                                });    
                            }
                        });
                }

                if(ehrLaunchCapabilities.MedicationOrder === true){
                    const medicationOrderQuery = new URLSearchParams();
                    medicationOrderQuery.set("patient", client.patient.id);
                    console.log('MedicationOrder Query', medicationOrderQuery);
        
                    let medicationOrderUrl = 'MedicationOrder?' + medicationOrderQuery
                    console.log('medicationOrderUrl', medicationOrderUrl);
        
                    client.request(medicationOrderUrl, {
                        pageLimit: 0,
                        flat: true
                    }).then(medicationOrders => {
                        if(medicationOrders){
                            console.log('PatientAutoDashboard.medicationOrders', medicationOrders)
                            medicationOrders.forEach(procedure => {
                                MedicationOrders.upsert({id: procedure.id}, {$set: procedure}, {validate: false, filter: false});                    
                            });    
                        }
                    });
                }

                if(ehrLaunchCapabilities.MedicationRequest === true){
                    const medicationRequestQuery = new URLSearchParams();
                    medicationRequestQuery.set("patient", client.patient.id);
                    console.log('MedicationRequest Query', medicationRequestQuery);
        
                    let medicationRequestUrl = 'MedicationRequest?' + medicationRequestQuery
                    console.log('medicationRequestUrl', medicationRequestUrl);
        
                    client.request(medicationRequestUrl, {
                            pageLimit: 0,
                            flat: true
                        }).then(medicationRequests => {
                            if(medicationRequests){
                                console.log('PatientAutoDashboard.medicationRequests', medicationRequests)
                                medicationRequests.forEach(procedure => {
                                    MedicationRequests.upsert({id: procedure.id}, {$set: procedure}, {validate: false, filter: false});                    
                                });    
                            }
                        });
                }




    
            } catch (error) {
                alert("We had an error fetching data.", error)
            }
        }
    }
    function renderChart({ systolic, diastolic }) {
        this.chart = new ChartJS("myChart", {
            type: "line",
            data: {
                datasets: [
                    {
                        label: "Systolic",
                        data: systolic,
                        borderWidth: 2,
                        borderColor: "rgba(200, 0, 127, 1)",
                        fill: false,
                        cubicInterpolationMode: "monotone"
                    },
                    {
                        label: "Diastolic",
                        data: diastolic,
                        borderWidth: 2,
                        borderColor: "rgba(0, 127, 255, 1)",
                        fill: false,
                        cubicInterpolationMode: "monotone"
                    }
                ]
            },

            options: {
                responsive: false,
                scales: {
                    yAxes: [
                        {
                            offset: true,
                            ticks: {
                                beginAtZero: true,
                                min: 0,
                                max: 200,
                                stepSize: 20
                            }
                        }
                    ],
                    xAxes: [
                        {
                            type: "time"
                        }
                    ]
                },
                title: {
                    text: "Blood Preasure",
                    display: true,
                    fontSize: 20
                }
            }
        });
    }
    function shouldComponentUpdate() {
        return false;
    }
    // function componentWillUnmount() {
    //     this.chart && this.chart.destroy();
    // }

    useEffect(function(){
        console.log('AutoDashboard.useEffect()');


        let fhirclientState = Session.get('fhirclient.state');

        if(fhirclientState){
            console.log('fhirclientState', fhirclientState)
            let patientUrl = "";
            let accessToken = "";

            accessToken = fhirclientState.access_token;
            patientUrl = fhirclientState.serverUrl + "/Patient";

            console.log('Query Endpoint: ', patientUrl)
            console.log('AccessToken:    ', accessToken)
      
            var httpHeaders = { headers: {
                'Accept': ['application/json', 'application/fhir+json'],
                'Access-Control-Allow-Origin': '*'          
            }}
    
            if(get(Meteor, 'settings.private.fhir.fhirServer.auth.bearerToken')){
                accessToken = get(Meteor, 'settings.private.fhir.fhirServer.auth.bearerToken');
            }
    
            if(accessToken){
                httpHeaders.headers["Authorization"] = 'Bearer ' + accessToken;
            }
    
            console.log('patientUrl.httpHeaders', httpHeaders)    
        }

        console.log('AutoDashboard finished mounting into render tree.', get(window, '__PRELOADED_STATE__.url'));

        let metadataRoute = "";
        if(get(window, '__PRELOADED_STATE__.url.query.iss')){
            metadataRoute = get(window, '__PRELOADED_STATE__.url.query.iss');

        } else if (get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl') && get(window, '__PRELOADED_STATE__.url.query.code')){
            // SMART HEALTH IT DEBUGING 
            metadataRoute = get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl') + get(window, '__PRELOADED_STATE__.url.query.code') + "/fhir/metadata"
        } 

        if(metadataRoute){            
            console.log('Checking the metadata route: ' + metadataRoute);
                
            HTTP.get(metadataRoute, {headers: {
                "Accept": "application/json+fhir"
              }}, function(error, conformanceStatement){
                let parsedCapabilityStatement = JSON.parse(get(conformanceStatement, "content"))
                console.log('Received a conformance statement for the server received via iss URL parameter.', parsedCapabilityStatement);
        
                let ehrLaunchCapabilities = FhirUtilities.parseCapabilityStatement(parsedCapabilityStatement);
                console.log("Result of parsing through the CapabilityStatement.  These are the ResourceTypes we can search for", ehrLaunchCapabilities);
                Session.set('ehrLaunchCapabilities', ehrLaunchCapabilities)
    
                fetchPatientData(ehrLaunchCapabilities);
              })    
        }    

        return function(){
            console.log('useEffect().destroy()')
            // chart.destroy()
        };
      }, []);


    

    let patientIntake = <Grid container style={{marginTop: '20px'}}>
        <Grid item md={4} style={{paddingRight: '10px'}}>
            <CardHeader title="Who?" />
            <PatientCard patient={data.selectedPatient} />
            <DynamicSpacer />
            <StyledCard scrollable >
                <CardHeader title={data.locations.length + " Care Teams"} />
                <CardContent>
                    <CareTeamsTable
                        locations={data.locations}
                        count={data.locations.length}
                    />
                </CardContent>                    
            </StyledCard>
            <DynamicSpacer />
            <CardHeader title="Where?" />
            <StyledCard scrollable >
                <CardHeader title={data.encounters.length + " Encounters"} />
                <CardContent>
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
            </StyledCard>
            <DynamicSpacer />
            <StyledCard scrollable >
                <CardHeader title={data.locations.length + " Locations"} />
                <CardContent>
                    <LocationsTable
                        locations={data.locations}
                        count={data.locations.length}
                    />
                </CardContent>                    
            </StyledCard>
            
        </Grid>
        <Grid item md={4} style={{paddingRight: '10px', paddingLeft: '10px'}}>
            <CardHeader title="What?" />
            <StyledCard scrollable >
                <CardHeader title={data.conditions.length + " Conditions"} />
                <CardContent>
                    <ConditionsTable
                        conditions={data.conditions}
                        hideCheckbox={true}
                        hideActionIcons={true}
                        hidePatientName={true}
                        hidePatientReference={true}
                        hideAsserterName={true}
                        hideEvidence={true}
                        hideCategory={false}
                        hideBarcode={true}
                        hideDates={false}
                        count={data.conditions.length}
                    />                                        
                </CardContent>                    
            </StyledCard>                
            <DynamicSpacer />
            <StyledCard scrollable >
                <CardHeader title={data.immunizations.length + " Immunizations"} />
                <CardContent>
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
            </StyledCard>                
            <DynamicSpacer />
            <StyledCard scrollable>
                <CardHeader title={data.procedures.length + " Procedures"} />
                <CardContent>
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
            </StyledCard>                
        </Grid>
        <Grid item md={4} style={{paddingLeft: '10px'}}>
            <CardHeader title="How?" />
            <StyledCard scrollable >
                <CardHeader title={data.locations.length + " Care Plans"} />
                <CardContent>
                    <CarePlansTable
                        locations={data.locations}
                        count={data.locations.length}
                    />
                </CardContent>                    
            </StyledCard>
            <DynamicSpacer />
            
            <StyledCard scrollable >
                <CardHeader title={data.observations.length + " Observations"} />
                <CardContent>
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
                        multiComponentValues={true}

                        count={data.observations.length}
                    />                                                                                                           
                </CardContent>                    
            </StyledCard>  
        </Grid>
    </Grid>

    let patientChart = <Grid container style={{marginTop: '20px'}} justify="center">
        <Grid item md={4} style={{paddingRight: '10px', paddingLeft: '10px'}}>
            <PatientCard patient={data.selectedPatient} />
            <DynamicSpacer />
            <StyledCard scrollable >
                <CardHeader title={data.encounters.length + " Encounters"} />
                <CardContent>
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
            </StyledCard>
            <DynamicSpacer />
            <StyledCard scrollable >
                <CardHeader title={data.conditions.length + " Conditions"} />
                <CardContent>
                    <ConditionsTable
                        conditions={data.conditions}
                        hideCheckbox={true}
                        hideActionIcons={true}
                        hidePatientName={true}
                        hidePatientReference={true}
                        hideAsserterName={true}
                        hideEvidence={true}
                        hideCategory={false}
                        hideBarcode={true}
                        hideDates={false}
                        count={data.conditions.length}
                    />                                        
                </CardContent>                    
            </StyledCard>                
            <DynamicSpacer />
            <StyledCard scrollable >
                <CardHeader title={data.immunizations.length + " Immunizations"} />
                <CardContent>
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
            </StyledCard>                
            <DynamicSpacer />
            <StyledCard scrollable>
                <CardHeader title={data.procedures.length + " Procedures"} />
                <CardContent>
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
            </StyledCard>                
            <DynamicSpacer />            
            <StyledCard scrollable >
                <CardHeader title={data.observations.length + " Observations"} />
                <CardContent>
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
                        multiComponentValues={true}

                        count={data.observations.length}
                    />                                                                                                           
                </CardContent>                    
            </StyledCard>  
        </Grid>        
    </Grid>

    let autoDashboardContent = patientIntake;

    switch (data.quickchartTabIndex) {
        case 0:
            autoDashboardContent = patientIntake;
            break;
        case 1:
            autoDashboardContent = patientChart;
            break;
    }

    return (
       autoDashboardContent
    )
}

export default AutoDashboard;