// yes, yes... this is a Class component, instead of a Pure Function
// TODO:  refactor into a <PatientDataQuery /> pure function with hooks, effect, and context

import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';
import { useLocation, useParams, useHistory } from "react-router-dom";

import React from "react";
import ChartJS from "chart.js";
import { FhirClientContext } from "../FhirClientContext";

import { StyledCard } from 'material-fhir-ui';

import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';

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



export class Dashboard extends React.Component {
    static contextType = FhirClientContext;
    getMeteorData() {
        let data = {
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
        }

        let conditionQuery = {};
        let encounterQuery = {};
        let immunizationQuery = {};        
        let medicationOrderQuery = {};
        let medicationRequestQuery = {};
        let medicationStatementQuery = {};
        let observationQuery = {};
        let procedureQuery = {};

        if(Session.get('selectedPatientId')){
            encounterQuery.subject = {
                reference: 'Patient/' + Session.get('selectedPatientId')
            }
            conditionQuery.subject = {
                reference: 'Patient/' + Session.get('selectedPatientId')
            }
            immunizationQuery.subject = {
                reference: 'Patient/' + Session.get('selectedPatientId')
            }
            medicationOrderQuery.subject = {
                reference: 'Patient/' + Session.get('selectedPatientId')
            }
            medicationRequestQuery.subject = {
                reference: 'Patient/' + Session.get('selectedPatientId')
            }
            medicationStatementQuery.subject = {
                reference: 'Patient/' + Session.get('selectedPatientId')
            }
            observationQuery.subject = {
                reference: 'Patient/' + Session.get('selectedPatientId')
            }
            procedureQuery.subject = {
                reference: 'Patient/' + Session.get('selectedPatientId')
            }
        }

        if(Conditions){
            data.conditions = Conditions.find(conditionQuery).fetch()
            data.conditionsCount = Conditions.find(conditionQuery).count()
        }
        if(Encounters){
            data.encounters = Encounters.find(encounterQuery).fetch()
            data.encountersCount = Encounters.find(encounterQuery).count()
        }
        if(Immunizations){
            data.immunizations = Immunizations.find(immunizationQuery).fetch()
            data.immunizationsCount = Immunizations.find(immunizationQuery).count()
        }
        if(Locations){
            data.locations = Locations.find().fetch()
            data.locationsCount = Locations.find().count()
        }
        if(MedicationOrders){
            data.medicationOrders = MedicationOrders.find().fetch()
            data.medicationOrdersCount = MedicationOrders.find().count()
        }
        if(MedicationRequests){
            data.medicationRequests = MedicationRequests.find().fetch()
            data.medicationRequestsCount = MedicationRequests.find().count()
        }
        if(MedicationStatements){
            data.medicationStatements = MedicationStatements.find().fetch()
            data.medicationStatementsCount = MedicationStatements.find().count()
        }
        if(Observations){
            data.observations = Observations.find().fetch()
            data.observationsCount = Observations.find().count()
        }
        if(Procedures){
            data.procedures = Procedures.find().fetch()
            data.proceduresCount = Procedures.find().count()
        }

        return data;
    }
    renderChart({ systolic, diastolic }) {
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
    render() {
        let chartWidth = (window.innerWidth - 240) / 3;

        return (
            <Grid container style={{marginTop: '20px'}}>
                <Grid item md={4} style={{paddingRight: '10px'}}>
                    <StyledCard scrollable >
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
                    </StyledCard>
                    <DynamicSpacer height={40} />
                    <StyledCard scrollable >
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
                    </StyledCard>                
                    <DynamicSpacer height={40} />
                    <StyledCard scrollable>
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
                    </StyledCard>  
                    {/* <StyledCard scrollable >
                        <CardHeader title={this.data.locationsCount + " Locations"} />
                        <CardContent>
                            <LocationsTable
                                locations={this.data.locations}
                                count={this.data.locationsCount}
                            />
                        </CardContent>                    
                    </StyledCard> */}
                </Grid>
                <Grid item md={4} style={{paddingRight: '10px', paddingLeft: '10px'}}>
                    <StyledCard scrollable >
                        <CardHeader title={this.data.immunizationsCount + " Immunizations"} />
                        <CardContent>
                            <ImmunizationsTable
                                immunizations={this.data.immunizations }                                
                                count={this.data.immunizationsCount}
                            />                                        
                        </CardContent>                    
                    </StyledCard>                
                    <DynamicSpacer height={40} />
                    <StyledCard scrollable >
                        <CardHeader title={this.data.medicationOrdersCount + " Medication Orders"} />
                        <CardContent>
                            <MedicationOrdersTable
                                medicationOrders={this.data.medicationOrders}                                
                                count={this.data.medicationOrdersCount}
                            />                                        
                        </CardContent>                    
                    </StyledCard>                
                    <DynamicSpacer height={40} />
                    <StyledCard scrollable>
                        <CardHeader title={this.data.medicationRequestsCount + " Medication Requests"} />
                        <CardContent>
                            <MedicationRequestsTable
                                medicationRequests={this.data.medicationRequests}                                
                                count={this.data.medicationRequestsCount}
                            />                                        
                        </CardContent>                    
                    </StyledCard>       
                </Grid>
                <Grid item md={4} style={{paddingLeft: '10px'}}>
                    <StyledCard scrollable>
                        <CardHeader title="Blood Pressure History" />
                        <CardContent>
                            <canvas id="myChart" width={chartWidth} height="400" />
                        </CardContent>                    
                    </StyledCard>
                    <DynamicSpacer height={40} />
                    <StyledCard scrollable >
                        <CardHeader title={this.data.observationsCount + " Observations"} />
                        <CardContent>
                            <ObservationsTable 
                                observations={this.data.observations}
                                hideCheckboxes={true}
                                hideActionIcons={true}
                                hideSubject={true}
                                hideDevices={true}
                                hideValue={true}
                                hideBarcodes={true}
                                hideDenominator={false}
                                hideNumerator={false}

                                count={this.data.observationsCount}
                            />                                                                                                           
                        </CardContent>                    
                    </StyledCard>  
                </Grid>
            </Grid>
        )
    }
}
ReactMixin(Dashboard.prototype, ReactMeteorData);
export default Dashboard;