// yes, yes... this is a Class component, instead of a Pure Function
// TODO:  refactor into a <PatientDataQuery /> pure function with hooks, effect, and context

import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';
import { useLocation, useParams, useHistory } from "react-router-dom";

import React from "react";
import ChartJS from "chart.js";

import { FhirClientContext } from "../FhirClientContext";
import PatientCard from "./PatientCard";

import { StyledCard } from 'material-fhir-ui';

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

export class Dashboard extends React.Component {
    static contextType = FhirClientContext;
    getMeteorData() {
        let data = {
            selectedPatientId: Session.get('selectedPatientId'),
            selectedPatient: Session.get('selectedPatient'),

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


        if(data.selectedPatientId){            
            data.encounterQuery['subject.reference'] = 'Patient/' + data.selectedPatientId;
            data.conditionQuery['subject.reference'] = 'Patient/' + data.selectedPatientId;
            data.immunizationQuery['patient.reference'] = 'Patient/' + data.selectedPatientId;
            data.medicationOrderQuery['subject.reference'] = 'Patient/' + data.selectedPatientId;
            data.medicationRequestQuery['subject.reference'] = 'Patient/' + data.selectedPatientId;
            data.medicationStatementQuery['subject.reference'] = 'Patient/' + data.selectedPatientId;
            data.observationQuery['subject.reference'] = 'Patient/' + data.selectedPatientId;
            data.procedureQuery['subject.reference'] = 'Patient/' + data.selectedPatientId;
        }

        if(Conditions){
            data.conditions = Conditions.find(data.conditionQuery).fetch()
            data.conditionsCount = Conditions.find(data.conditionQuery).count()
        }
        if(Encounters){
            data.encounters = Encounters.find(data.encounterQuery).fetch()
            data.encountersCount = Encounters.find(data.encounterQuery).count()
        }
        if(Immunizations){
            data.immunizations = Immunizations.find(data.immunizationQuery).fetch()
            data.immunizationsCount = Immunizations.find(data.immunizationQuery).count()
        }
        if(Locations){
            data.locations = Locations.find().fetch()
            data.locationsCount = Locations.find().count()
        }
        if(MedicationOrders){
            data.medicationOrders = MedicationOrders.find(data.medicationOrderQuery).fetch()
            data.medicationOrdersCount = MedicationOrders.find(data.medicationOrderQuery).count()
        }
        if(MedicationRequests){
            data.medicationRequests = MedicationRequests.find(data.medicationRequestQuery).fetch()
            data.medicationRequestsCount = MedicationRequests.find(data.medicationRequestQuery).count()
        }
        if(MedicationStatements){
            data.medicationStatements = MedicationStatements.find(data.medicationStatementQuery).fetch()
            data.medicationStatementsCount = MedicationStatements.find(data.medicationStatementQuery).count()
        }
        if(Observations){
            data.observations = Observations.find(data.observationQuery).fetch()
            data.observationsCount = Observations.find(data.observationQuery).count()
            
            Observations.find(data.observationQuery).forEach(function(observation){
                if(get(observation, "code.coding.0.code") === data.graphDataCode && get(observation, "valueQuantity.value")){
                    data.graphData.lineA.push({
                        x: new Date(get(observation, "effectiveDateTime")),
                        y: get(observation, "valueQuantity.value")
                    })
                }
            })

            data.graphData.lineA.sort((a, b) => a.x - b.x);
            // data.graphData.lineB.sort((a, b) => a.x - b.x);
        }
        if(Procedures){
            data.procedures = Procedures.find(data.procedureQuery).fetch()
            data.proceduresCount = Procedures.find(data.procedureQuery).count()
        }

        if(data.graphData.lineA.length > 0){
            this.renderChart(data.graphData);
        }

        console.log('Dashboard.data', data)
        return data;
    }
    renderChart({ lineA, lineB }) {
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
                    text: this.data.graphTitle,
                    display: true,
                    fontSize: 20
                }
            }
        });
    }
    componentWillUnmount() {
        if(this.chart){
            this.chart.destroy();
        }        
    }
    render() {
        let chartWidth = (window.innerWidth - 240) / 3;

        let displayNoDataCard = true;
        let displayNoChartingCard = true;

        let self = this;
        
        let locationCard = [];
        if(this.data.locationsCount > 0){
            displayNoDataCard = false;
            locationCard.push(<StyledCard scrollable >
                <CardHeader title={this.data.locationsCount + " Locations"} />
                <CardContent>
                    <LocationsTable
                        locations={this.data.locations}
                        count={this.data.locationsCount}
                    />
                </CardContent>                    
            </StyledCard>);
            locationCard.push(<DynamicSpacer height={40} />);
        }

        let conditionCard = [];
        if(this.data.conditionsCount > 0){
            displayNoDataCard = false;
            conditionCard.push(<StyledCard scrollable >
                <CardHeader title={this.data.conditionsCount + " Conditions"} />
                <CardContent>
                    <ConditionsTable
                        conditions={this.data.conditions}
                        displayCheckboxes={false}
                        displayActionIcons={false}
                        displayPatientReference={false}
                        displayPatientName={false}
                        displayAsserterName={false}
                        displayEvidence={false}
                        count={this.data.conditionsCount}
                    />                                        
                </CardContent>                    
            </StyledCard>);
            conditionCard.push(<DynamicSpacer height={40} />);
        }

        let procedureCard = [];
        if(this.data.proceduresCount > 0){
            displayNoDataCard = false;
            procedureCard.push(<StyledCard scrollable>
                <CardHeader title={this.data.proceduresCount + " Procedures"} />
                <CardContent>
                    <ProceduresTable 
                        procedures={this.data.procedures}
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
                        count={this.data.proceduresCount}
                    />                                                                                                           
                </CardContent>                    
            </StyledCard>);
            procedureCard.push(<DynamicSpacer height={40} />);
        }

        let encounterCard = [];
        if(this.data.encountersCount > 0){
            displayNoDataCard = false;
            encounterCard.push(<StyledCard scrollable >
                <CardHeader title={this.data.encountersCount + " Encounters"} />
                <CardContent>
                    <EncountersTable
                        encounters={this.data.encounters}
                        hideCheckboxes={true}
                        hideActionIcons={true}
                        hideSubjects={true}
                        hideType={true}
                        hideHistory={true}
                        hideEndDateTime={true}
                        count={this.data.encountersCount}
                    />
                </CardContent>                    
            </StyledCard>);
            encounterCard.push(<DynamicSpacer height={40} />);
        }


        let immunizationCard = [];
        if(this.data.immunizationsCount > 0){
            displayNoDataCard = false;
            immunizationCard.push(<StyledCard scrollable >
                <CardHeader title={this.data.immunizationsCount + " Immunizations"} />
                <CardContent>
                    <ImmunizationsTable
                        immunizations={this.data.immunizations }   
                        hideCheckbox={true}
                        hideActionIcons={true}
                        hideIdentifier={true}
                        hidePerformer={true}
                        hidePatient={true}
                        count={this.data.immunizationsCount}
                    />                                        
                </CardContent>                    
            </StyledCard>);
            immunizationCard.push(<DynamicSpacer height={40} />);
        }

        let medicationCard = [];
        if(this.data.medicationsCount > 0){
            displayNoDataCard = false;
            medicationCard.push(<StyledCard scrollable >
                <CardHeader title={this.data.medicationOrdersCount + " Medication Orders"} />
                <CardContent>
                    <MedicationOrdersTable
                        medicationOrders={this.data.medicationOrders}                                
                        count={this.data.medicationOrdersCount}
                    />                                        
                </CardContent>                    
            </StyledCard>)
            medicationCard.push(<DynamicSpacer height={40} />);
        }

        let medicationRequestCard = [];
        if(this.data.medicationRequestsCount > 0){
            displayNoDataCard = false;
            medicationRequestCard.push(<StyledCard scrollable>
                <CardHeader title={this.data.medicationRequestsCount + " Medication Requests"} />
                <CardContent>
                    <MedicationRequestsTable
                        medicationRequests={this.data.medicationRequests}     
                        hideCheckbox={true}           
                        hideActionIcons={true}               
                        hideIdentifier={true}
                        hidePatient={true}
                        hideDosageInstructions={true}
                        hideBarcode={true}
                        count={this.data.medicationRequestsCount}
                    />                                        
                </CardContent>                    
            </StyledCard>)
            medicationRequestCard.push(<DynamicSpacer height={40} />);
        }


        let medicationStatementCard = [];
        if(this.data.medicationStatementsCount > 0){
            displayNoDataCard = false;
            medicationStatementCard.push(<StyledCard scrollable>
                <CardHeader title={this.data.medicationStatementsCount + " Medication Statements"} />
                <CardContent>
                    <MedicationStatementsTable
                        medicationStatements={this.data.medicationStatements}    
                        hideCheckbox={true}            
                        hideActionIcons={true}      
                        hideIdentifier={true}          
                        count={this.data.medicationStatementsCount}
                    />                                        
                </CardContent>                    
            </StyledCard>)
            medicationStatementCard.push(<DynamicSpacer height={40} />);
        }

        let observationCard = [];
        let bloodPressureChart = [];
        if(this.data.observationsCount > 0){
            displayNoDataCard = false;
            displayNoChartingCard = false;
            observationCard.push(<StyledCard scrollable >
                <CardHeader title={this.data.observationsCount + " Observations"} />
                <CardContent>
                    <ObservationsTable 
                        observations={this.data.observations}
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
                        count={this.data.observationsCount}
                    />                                                                                                           
                </CardContent>                    
            </StyledCard>)
            observationCard.push(<DynamicSpacer height={40} />);

            bloodPressureChart.push(<StyledCard scrollable>
                <CardHeader title={this.data.graphTitle} />
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
                        patient={this.data.selectedPatient} 
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
}
ReactMixin(Dashboard.prototype, ReactMeteorData);
export default Dashboard;