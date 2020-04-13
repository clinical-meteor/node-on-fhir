// yes, yes... this is a Class component, instead of a Pure Function
// TODO:  refactor into a <PatientDataQuery /> pure function with hooks, effect, and context

import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';


import React from "react";
import ChartJS from "chart.js";
import { FhirClientContext } from "../FhirClientContext";

import { StyledCard } from 'material-fhir-ui';

import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';

import { Encounters, Procedures, Conditions, Observations, Locations, LocationsTable, EncountersTable, ProceduresTable, ConditionsTable, ObservationsTable } from 'meteor/clinical:hl7-fhir-data-infrastructure';


function DynamicSpacer(props){
    return <br className="dynamicSpacer" style={{height: '40px'}}/>;
}
  

export class Dashboard extends React.Component {
    static contextType = FhirClientContext;
    getMeteorData() {
        let data = {
            encounters: [],
            procedures: [],
            conditions: [],
            observations: [],
            locations: [],
            encountersCount: 0,
            proceduresCount: 0,
            conditionsCount: 0,
            observationsCount: 0,
            locationsCount: 0
        }

        if(Encounters){
            data.encounters = Encounters.find().fetch()
            data.encountersCount = Encounters.find().count()
        }
        if(Conditions){
            data.conditions = Conditions.find().fetch()
            data.conditionsCount = Conditions.find().count()
        }
        if(Procedures){
            data.procedures = Procedures.find().fetch()
            data.proceduresCount = Procedures.find().count()
        }
        if(Observations){
            data.observations = Observations.find().fetch()
            data.observationsCount = Observations.find().count()
        }
        if(Locations){
            data.locations = Locations.find().fetch()
            data.locationsCount = Locations.find().count()
        }
        return data;
    }
    loadData() {
        const client = this.context.client;

        const observationQuery = new URLSearchParams();
        observationQuery.set("code", "http://loinc.org|55284-4");
        observationQuery.set("subject", client.patient.id);
        console.log('Observation Query', observationQuery);

        let observationUrl = 'Observation?' + observationQuery.toString();
        console.log('observationUrl', observationUrl);

        try {
            client.request(observationUrl, {
                pageLimit: 0,
                flat: true
            }).then(bpObservations => {
                const bpMap = {
                    systolic: [],
                    diastolic: []
                };
                console.log('PatientDashboard.observations', bpObservations)
                bpObservations.forEach(observation => {
                    Observations.upsert({id: observation.id}, {$set: observation});

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
                });
                bpMap.systolic.sort((a, b) => a.x - b.x);
                bpMap.diastolic.sort((a, b) => a.x - b.x);

                console.log('PatientDashboard.bpMap', bpMap)
                this.renderChart(bpMap);
            });


            const encounterQuery = new URLSearchParams();
            encounterQuery.set("subject", client.patient.id);
            console.log('Encounter Query', encounterQuery);

            let encounterUrl = 'Encounter?' + encounterQuery.toString()
            console.log('encounterUrl', encounterUrl);

            client.request(encounterUrl, {
                    pageLimit: 0,
                    flat: true
                }).then(encounters => {
                    const bpMap = {
                        systolic: [],
                        diastolic: []
                    };
                    console.log('PatientDashboard.encounters', encounters)
                    encounters.forEach(encounter => {
                        Encounters.upsert({id: encounter.id}, {$set: encounter});                    
                    });
                });

            const conditionQuery = new URLSearchParams();
            conditionQuery.set("subject", client.patient.id);
            console.log('Condition Query', conditionQuery);

            let conditionUrl = 'Condition?' + conditionQuery.toString()
            console.log('conditionUrl', conditionUrl);

            client.request(conditionUrl, {
                    pageLimit: 0,
                    flat: true
                }).then(conditions => {
                    const bpMap = {
                        systolic: [],
                        diastolic: []
                    };
                    console.log('PatientDashboard.conditions', conditions)
                    conditions.forEach(condition => {
                        Conditions.upsert({id: condition.id}, {$set: condition});                    
                    });
                });

            const procedureQuery = new URLSearchParams();
            procedureQuery.set("subject", client.patient.id);
            console.log('Procedure Query', procedureQuery);

            let procedureUrl = 'Procedure?' + procedureQuery
            console.log('procedureUrl', procedureUrl);

            client.request(procedureUrl, {
                    pageLimit: 0,
                    flat: true
                }).then(procedures => {
                    const bpMap = {
                        systolic: [],
                        diastolic: []
                    };
                    console.log('PatientDashboard.procedures', procedures)
                    procedures.forEach(procedure => {
                        Procedures.upsert({id: procedure.id}, {$set: procedure});                    
                    });
                });

        } catch (error) {
            alert("We had an error fetching data.", error)
        }


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
    shouldComponentUpdate() {
        return false;
    }
    componentWillUnmount() {
        this.chart && this.chart.destroy();
    }
    componentDidMount() {
        this.loadData();
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
                                hideSubjects={true}
                                hideType={true}
                                hideHistory={true}
                                hideEndDateTime={true}
                                count={this.data.encountersCount}
                            />
                        </CardContent>                    
                    </StyledCard>
                    <DynamicSpacer />
                    <StyledCard scrollable >
                        <CardHeader title={this.data.locationsCount + " Locations"} />
                        <CardContent>
                            <LocationsTable
                                locations={this.data.locations}
                                count={this.data.locationsCount}
                            />
                        </CardContent>                    
                    </StyledCard>
                </Grid>
                <Grid item md={4} style={{paddingRight: '10px', paddingLeft: '10px'}}>
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
                    <DynamicSpacer />
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
                                count={this.data.proceduresCount}
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
                    <DynamicSpacer />
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