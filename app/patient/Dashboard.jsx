// yes, yes... this is a Class component, instead of a Pure Function
// TODO:  refactor into a <PatientDataQuery /> pure function with hooks, effect, and context

import { useTracker } from 'meteor/react-meteor-data';
import { useLocation, useParams, useHistory } from "react-router-dom";

import React from "react";
import ChartJS from "chart.js";

import { FhirClientContext } from "../FhirClientContext";
import PatientCard from "./PatientCard";

import { StyledCard } from 'material-fhir-ui';

import Card from '@material-ui/core/CardContent';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';

import { Session } from 'meteor/session';

import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import { 
    DynamicSpacer, 

    Conditions,
    Devices,
    Encounters, 
    Locations,
    Immunizations,
    Medications,
    MedicationOrders,
    MedicationRequests,
    MedicationStatements, 
    Observations,
    Procedures,
  
    ConditionsTable,
    EncountersTable,
    DevicesTable,
    LocationsTable,
    ImmunizationsTable,
    MedicationsTable,
    MedicationOrdersTable,
    MedicationRequestsTable,
    MedicationStatementsTable, 
    ObservationsTable,
    ProceduresTable
} from 'meteor/clinical:hl7-fhir-data-infrastructure';
import { get } from 'lodash';

if(Meteor.isClient){
    Session.setDefault('selectedObservationType', 'No Selected Observation')
    Session.setDefault('selectedObservationCode', false)        
}

export function Dashboard(props){
    let data = {
        selectedPatientId: '',
        selectedPatient: null,

        conditions: [],
        encounters: [],
        immunizations: [],
        locations: [],
        medicationOrders: [],
        medicationRequests: [],
        medicationStatements: [],
        procedures: [],
        observations: [],

        conditionsCount: 0,
        encountersCount: 0,
        immunizationsCount: 0,
        locationsCount: 0,
        medicationOrdersCount: 0,
        medicationRequestsCount: 0,
        medicationStatementsCount: 0,
        observationsCount: 0,
        proceduresCount: 0,

        conditionQuery: {},
        encounterQuery: {},
        immunizationQuery: {},
        medicationOrderQuery: {},
        medicationRequestQuery: {},
        medicationStatementQuery: {},
        observationQuery: {},
        procedureQuery: {},

        graphTitle: Session.get('selectedObservationType'),
        graphDataCode: Session.get('selectedObservationCode'),
        graphData: {
            lineA: [],
            lineB: []
        }
    }

    data.selectedPatientId = useTracker(function(){
        return Session.get('selectedPatientId');
      }, [])
      data.selectedPatient = useTracker(function(){
        return Patients.findOne({_id: Session.get('selectedPatientId')});
      }, [])
      data.patients = useTracker(function(){
        return Patients.find().fetch();
      }, [])


    if(data.selectedPatientId){            
        data.conditionQuery['subject.reference'] = 'Patient/' + data.selectedPatientId;
        data.encounterQuery['subject.reference'] = 'Patient/' + data.selectedPatientId;
        data.immunizationQuery['patient.reference'] = 'Patient/' + data.selectedPatientId;
        data.medicationOrderQuery['subject.reference'] = 'Patient/' + data.selectedPatientId;
        data.medicationRequestQuery['subject.reference'] = 'Patient/' + data.selectedPatientId;
        data.medicationStatementQuery['subject.reference'] = 'Patient/' + data.selectedPatientId;
        data.observationQuery['subject.reference'] = 'Patient/' + data.selectedPatientId;
        data.procedureQuery['subject.reference'] = 'Patient/' + data.selectedPatientId;
    }

    if(Conditions){
        data.conditions = useTracker(function(){
            return Conditions.find(data.conditionQuery).fetch()
        }, [])    
    }
    if(Encounters){
        data.encounters = useTracker(function(){
            return Encounters.find(data.encounterQuery).fetch()
        }, [])    
    }
    if(Immunizations){
        data.immunizations = useTracker(function(){
            return Immunizations.find(data.immunizationQuery).fetch()
        }, [])    
    }
    if(Locations){
        data.locations = useTracker(function(){
            return Locations.find().fetch()
        }, [])    
    }
    if(MedicationOrders){
        data.medicationOrders = useTracker(function(){
            return MedicationOrders.find(data.medicationOrderQuery).fetch()
        }, [])   
    }
    if(MedicationRequests){
        data.medicationRequests = useTracker(function(){
            return MedicationRequests.find(data.medicationRequestQuery).fetch()
        }, [])   
    }
    if(MedicationStatements){
        data.medicationStatements = useTracker(function(){
            return MedicationStatements.find(data.medicationStatementQuery).fetch()
        }, [])   
    }
    if(Observations){
        data.observations = useTracker(function(){
            return Observations.find(data.observationQuery).fetch()
        }, [])   

        data.graphData.lineA = useTracker(function(){
            return Observations.find(data.observationQuery).map(function(observation){
                if(get(observation, "code.coding.0.code") === data.graphDataCode && get(observation, "valueQuantity.value")){
                    return {
                        x: new Date(get(observation, "effectiveDateTime")),
                        y: get(observation, "valueQuantity.value")
                    }
                }
            })
        }, [])   


        data.graphData.lineA.sort((a, b) => a.x - b.x);        
    }
    if(Procedures){
        data.procedures = useTracker(function(){
            return Procedures.find(data.procedureQuery).fetch()
        }, [])   
    }

    if(data.graphData.lineA.length > 0){
        renderChart(data.graphData);
    }



    function cleanup() {
        if(chart){
            chart.destroy();
        }        
    }
    function renderChart({ lineA, lineB }) {
        this.chart = new ChartJS("myChart", {
            type: "line",
            data: {
                datasets: [
                    {
                        label: "Systolic",
                        data: lineA,
                        borderWidth: 2,
                        borderColor: "rgba(200, 0, 127, 1)",
                        fill: false,
                        cubicInterpolationMode: "monotone"
                    },
                    {
                        label: "Diastolic",
                        data: lineB,
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
                    text: data.graphTitle,
                    display: true,
                    fontSize: 20
                }
            }
        });
    }


    let chartWidth = (window.innerWidth - 240) / 3;

    let displayNoDataCard = true;
    let displayNoChartingCard = true;

    let self = this;
    
    let noPatientSelectedCard = <StyledCard style={{minHeight: '200px', marginBottom: '40px'}} disabled>
        <CardContent style={{fontSize: '100%', paddingBottom: '28px', paddingTop: '50px', textAlign: 'center'}}>
        <CardHeader 
            title="Cohort data available."
            subheader="Please select a patient."
            style={{fontSize: '100%', whiteSpace: 'nowrap'}} />            
        </CardContent>
    </StyledCard>

    let locationCard = [];
    if(data.locationsCount > 0){
        displayNoDataCard = false;
        if(data.selectedPatient){
            locationCard.push(<StyledCard scrollable >
                <CardHeader title={data.locationsCount + " Locations"} />
                <CardContent>
                    <LocationsTable
                        locations={data.locations}
                        count={data.locationsCount}
                    />
                </CardContent>                    
            </StyledCard>);
            locationCard.push(<DynamicSpacer height={40} />);    
        } else {
            locationCard.push(noPatientSelectedCard);
            locationCard.push(<DynamicSpacer height={40} />);
        }
    }

    let conditionCard = [];
    if(data.conditionsCount > 0){
        displayNoDataCard = false;
        if(data.selectedPatient){
            conditionCard.push(<StyledCard scrollable >
                <CardHeader title={data.conditionsCount + " Conditions"} />
                <CardContent>
                    <ConditionsTable
                        conditions={data.conditions}
                        displayCheckboxes={false}
                        displayActionIcons={false}
                        displayPatientReference={false}
                        displayPatientName={false}
                        displayAsserterName={false}
                        displayEvidence={false}
                        count={data.conditionsCount}
                    />                                        
                </CardContent>                    
            </StyledCard>);
            conditionCard.push(<DynamicSpacer height={40} />);
        } else {
            conditionCard.push(noPatientSelectedCard);
            conditionCard.push(<DynamicSpacer height={40} />);
        }
    }

    let procedureCard = [];
    if(data.proceduresCount > 0){
        displayNoDataCard = false;
        if(data.selectedPatient){
            procedureCard.push(<StyledCard scrollable>
                <CardHeader title={data.proceduresCount + " Procedures"} />
                <CardContent>
                    <ProceduresTable 
                        procedures={data.procedures}
                        hideCheckboxes={true}
                        hideActionIcons={true}
                        hideIdentifier={true}
                        hideCategory={true}
                        hideSubject={true}
                        hideBodySite={true}
                        hidePerformedDateEnd={true}
                        hideSubjectReference={true}
                        hideBarcode={true}
                        hideNotes={true}
                        count={data.proceduresCount}
                    />                                                                                                           
                </CardContent>                    
            </StyledCard>);
            procedureCard.push(<DynamicSpacer height={40} />);
        } else {
            procedureCard.push(noPatientSelectedCard);
            procedureCard.push(<DynamicSpacer height={40} />);
        }
        
    }

    let encounterCard = [];
    if(data.encountersCount > 0){
        displayNoDataCard = false;
        if(data.selectedPatient){
            encounterCard.push(<StyledCard scrollable >
                <CardHeader title={data.encountersCount + " Encounters"} />
                <CardContent>
                    <EncountersTable
                        encounters={data.encounters}
                        hideCheckboxes={true}
                        hideActionIcons={true}
                        hideSubjects={true}
                        hideType={true}
                        hideHistory={true}
                        hideEndDateTime={true}
                        count={data.encountersCount}
                    />
                </CardContent>                    
            </StyledCard>);
            encounterCard.push(<DynamicSpacer height={40} />);
        } else {
            encounterCard.push(noPatientSelectedCard);
            encounterCard.push(<DynamicSpacer height={40} />);
        }            
    }


    let immunizationCard = [];
    if(data.immunizationsCount > 0){
        displayNoDataCard = false;
        if(data.selectedPatient){
            immunizationCard.push(<StyledCard scrollable >
                <CardHeader title={data.immunizationsCount + " Immunizations"} />
                <CardContent>
                    <ImmunizationsTable
                        immunizations={data.immunizations }   
                        hideCheckbox={true}
                        hideActionIcons={true}
                        hideIdentifier={true}
                        hidePerformer={true}
                        hidePatient={true}
                        count={data.immunizationsCount}
                    />                                        
                </CardContent>                    
            </StyledCard>);
            immunizationCard.push(<DynamicSpacer height={40} />);
        } else {
            immunizationCard.push(noPatientSelectedCard);
            immunizationCard.push(<DynamicSpacer height={40} />);
        }
    }

    let medicationCard = [];
    if(data.medicationsCount > 0){
        displayNoDataCard = false;
        if(data.selectedPatient){
            medicationCard.push(<StyledCard scrollable >
                <CardHeader title={data.medicationOrdersCount + " Medication Orders"} />
                <CardContent>
                    <MedicationOrdersTable
                        medicationOrders={data.medicationOrders}                                
                        count={data.medicationOrdersCount}
                    />                                        
                </CardContent>                    
            </StyledCard>)
            medicationCard.push(<DynamicSpacer height={40} />);    
        } else {
            medicationCard.push(noPatientSelectedCard);
            medicationCard.push(<DynamicSpacer height={40} />);
        }
    }

    let medicationRequestCard = [];
    if(data.medicationRequestsCount > 0){
        displayNoDataCard = false;
        if(data.selectedPatient){
            medicationRequestCard.push(<StyledCard scrollable>
                <CardHeader title={data.medicationRequestsCount + " Medication Requests"} />
                <CardContent>
                    <MedicationRequestsTable
                        medicationRequests={data.medicationRequests}     
                        hideCheckbox={true}           
                        hideActionIcons={true}               
                        hideIdentifier={true}
                        hidePatient={true}
                        hideDosageInstructions={true}
                        hideBarcode={true}
                        count={data.medicationRequestsCount}
                    />                                        
                </CardContent>                    
            </StyledCard>)
            medicationRequestCard.push(<DynamicSpacer height={40} />);
        } else {
            medicationRequestCard.push(noPatientSelectedCard);
            medicationRequestCard.push(<DynamicSpacer height={40} />);
        }

    }


    let medicationStatementCard = [];
    if(data.medicationStatementsCount > 0){
        displayNoDataCard = false;
        if(data.selectedPatient){
            medicationStatementCard.push(<StyledCard scrollable>
                <CardHeader title={data.medicationStatementsCount + " Medication Statements"} />
                <CardContent>
                    <MedicationStatementsTable
                        medicationStatements={data.medicationStatements}    
                        hideCheckbox={true}            
                        hideActionIcons={true}      
                        hideIdentifier={true}          
                        count={data.medicationStatementsCount}
                    />                                        
                </CardContent>                    
            </StyledCard>)
            medicationStatementCard.push(<DynamicSpacer height={40} />);
        } else {
            medicationStatementCard.push(noPatientSelectedCard);
            medicationStatementCard.push(<DynamicSpacer height={40} />);
        }

    }

    let observationCard = [];
    let bloodPressureChart = [];
    if(data.observationsCount > 0){
        displayNoDataCard = false;
        displayNoChartingCard = false;
        if(data.selectedPatient){
            observationCard.push(<StyledCard scrollable >
                <CardHeader title={data.observationsCount + " Observations"} />
                <CardContent>
                    <ObservationsTable 
                        observations={data.observations}
                        hideCheckboxes={true}
                        hideActionIcons={true}
                        hideSubject={true}
                        hideDevices={true}
                        hideValue={false}
                        hideBarcodes={true}
                        hideDenominator={true}
                        hideNumerator={true}
                        multiComponentValues={true}
                        onRowClick={function(id){
                            let selectedObservation = Observations.findOne({id: id})
                            console.log('ObservationTable.onRowClick.selectedObservation', selectedObservation)

                            if(self.chart){
                                self.chart.destroy();
                            }   

                            Session.set('selectedObservationType', get(selectedObservation, 'code.coding[0].display'))
                            Session.set('selectedObservationCode', get(selectedObservation, 'code.coding[0].code'))
                        }}
                        count={data.observationsCount}
                    />                                                                                                           
                </CardContent>                    
            </StyledCard>)
            observationCard.push(<DynamicSpacer height={40} />);
        } else {
            observationCard.push(noPatientSelectedCard);
            observationCard.push(<DynamicSpacer height={40} />);
        }
        

        bloodPressureChart.push(<StyledCard scrollable>
            <CardHeader title={data.graphTitle} />
            <CardContent>
                <canvas id="myChart" width={chartWidth} height="400" />
            </CardContent>                    
        </StyledCard>)
        bloodPressureChart.push(<DynamicSpacer height={40} />);
    }

    let noDataCard;
    if(displayNoDataCard){
      noDataCard = <StyledCard style={{minHeight: '200px', marginBottom: '40px'}} disabled>
        <CardContent style={{fontSize: '100%', paddingBottom: '28px', paddingTop: '50px', textAlign: 'center'}}>
          <CardHeader 
            title="Patient Data Not Found"       
            subheader="Unable to build chart.  Please query the FHIR server for patient data."
            style={{fontSize: '100%', whiteSpace: 'nowrap'}} />
              
        </CardContent>
      </StyledCard>
    }

    let noChartingCard;
    if(displayNoChartingCard){
        noChartingCard = <StyledCard style={{minHeight: '200px', marginBottom: '40px'}} disabled>
        <CardContent style={{fontSize: '100%', paddingBottom: '28px', paddingTop: '50px', textAlign: 'center'}}>
          <CardHeader 
            title="Cannot Render Graphs and Charts"       
            subheader="No data to render graphs with."
            style={{fontSize: '100%', whiteSpace: 'nowrap'}} />
        </CardContent>
      </StyledCard>
    }

    return (
        <Grid container style={{marginTop: '20px'}}>
            <Grid item lg={3} style={{paddingRight: '10px'}}>
                <PatientCard 
                    patient={data.selectedPatient} 
                    displayName={false}
                />
                <DynamicSpacer height={40} />
                { locationCard }  
            </Grid>
            <Grid item lg={6} style={{paddingRight: '10px', paddingLeft: '10px', paddingBottom: '80px'}}>
                { conditionCard }                
                { encounterCard }
                { procedureCard }  
                { immunizationCard }
                { medicationCard }
                { medicationRequestCard }
                { medicationStatementCard }
                { observationCard }  
                { noDataCard }                            
            </Grid>
            <Grid item lg={3} style={{paddingLeft: '10px'}}>
                { bloodPressureChart }                    
                { noChartingCard }
            </Grid>
        </Grid>
    )
}



export default Dashboard;