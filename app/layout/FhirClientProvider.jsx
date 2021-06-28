import React, { useState, useEffect } from 'react';

import { oauth2 as SMART } from "fhirclient";
import { FhirClientContext } from "../FhirClientContext";

import { 
  CardHeader,
  CardContent,
  Grid
} from '@material-ui/core';
import { PageCanvas, StyledCard } from 'fhir-starter';
import { get } from 'lodash';

import { Icon } from 'react-icons-kit'
import { warning } from 'react-icons-kit/fa/warning'

import { Session } from 'meteor/session';
import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import { Patients, Encounters, Procedures, Conditions, Immunizations, ImmunizationsTable, Observations, Locations, LocationsTable, EncountersTable, ProceduresTable, ConditionsTable, ObservationsTable } from 'meteor/clinical:hl7-fhir-data-infrastructure';


// EHR
// https://code.cerner.com/developer/smart-on-fhir/apps/5ce489fc-fec1-46be-856a-8d7ed58e6b5b

// Launch Page
// http://localhost:3000/launcher?iss=https%3A%2F%2Ffhir-ehr-code.cerner.com%2Fr4%2Fec2458f2-1e24-41c8-b71b-0e701af7583d&launch=1b00ff1d-6861-4634-9786-bd6f74154fc4

// QuickChart
// http://localhost:3000/patient-quickchart?code=dd0035ef-ff08-485d-8346-34b1f223df3e&state=pvuBDItbfFVZm2u3

// Umable To Connect
// http://localhost:3000/patient-quickchart



// Epic Provider R4 Launch Page
// http://localhost:3000/launcher?iss=https%3A%2F%2Ffhir.epic.com%2Finterconnect-fhir-oauth%2Fapi%2FFHIR%2FR4&launch=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1cm46b2lkOmZoaXIiLCJjbGllbnRfaWQiOiI2NDFmOGIzZS05Yjk3LTRiOTgtYWM0ZC01NGJlYmU1OTc5YjAiLCJlcGljLmVjaSI6InVybjplcGljOk9wZW4uRXBpYy1jdXJyZW50IiwiZXBpYy5tZXRhZGF0YSI6IlZ5UVFmX3pwNXNfYVNRNTQydDFVTG5JcFlYZzI3YkhNRjBvaFJWUFVYX1dvbmktdzFqWVgzdU5MR1JwQ2ItYmtYWTNweUo0LS1YNW5YR0pyUWI2RXFQMHVXTmNMa2laZFJHWGpHQWpfUmdjbk04WWlkYWNsSWRuMlJIZVNNZFE1IiwiZXBpYy50b2tlbnR5cGUiOiJsYXVuY2giLCJleHAiOjE2MjQ2OTI5NTIsImlhdCI6MTYyNDY5MjY1MiwiaXNzIjoidXJuOm9pZDpmaGlyIiwianRpIjoiZTNjMTNhMTItYWRmMS00ZDVkLWE2NjItODFiZjVjNDk1YzA0IiwibmJmIjoxNjI0NjkyNjUyLCJzdWIiOiJldk5wLUtoWXdPT3FBWm4xcFoyZW51QTMifQ.mB5pSId3lRxo7I03U1WavPWoxBHso2b3jVaAm-qf8CLt20ufmSGlwbCw3LSKXWJxKC68U_hso4Kj_kDuZto89LaZ_8g-1LH5VO21Pgd3-tjMqSZ_8Kb_Fx1cqHZ4KFftpjAvhxh_8kXXmXERxrgVRNgxBIz5EH8tKUMWNaqDaRH9l_I8ESFXkzgEC3JOJK-m8LalKlEM2lv6t-N0HK-a8kKoSUObZP39qqe65Dhz8o51CjdFinxk-HXI9bbsCipFqaF4bCaCpDNxTnTPiyrDrb1SGKkI0S-BIhAiVs-afqFkbXYF_0z-KRb--PKguZC5gfdACLgBTXBL3RhOfJDKKg
// http://localhost:3000/launcher?iss=https%3A%2F%2Ffhir.epic.com%2Finterconnect-fhir-oauth%2Fapi%2FFHIR%2FR4&launch=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1cm46b2lkOmZoaXIiLCJjbGllbnRfaWQiOiI2NDFmOGIzZS05Yjk3LTRiOTgtYWM0ZC01NGJlYmU1OTc5YjAiLCJlcGljLmVjaSI6InVybjplcGljOk9wZW4uRXBpYy1jdXJyZW50IiwiZXBpYy5tZXRhZGF0YSI6Ii00SGRQREdJLUhIYnZjSGU4dEVWY1o0aDMyV2picjhiSlh2OXRobnJnY0V5TWFHR3NwSndENERyYUxGc0cwNnJWcFN0MEpMS2I0X3pEdEc1UDM0LWNUTDJaaTRqLVA4N0VzYW0tcHAwNU50MUtMbFdMdTJ1cHBlMHJRYTFyVUVtIiwiZXBpYy50b2tlbnR5cGUiOiJsYXVuY2giLCJleHAiOjE2MjQ2OTMwMjAsImlhdCI6MTYyNDY5MjcyMCwiaXNzIjoidXJuOm9pZDpmaGlyIiwianRpIjoiNDIzYjJlZGQtOWE0Zi00ZjkyLTkxM2QtNTM1YWI1YjM0Y2M0IiwibmJmIjoxNjI0NjkyNzIwLCJzdWIiOiJldk5wLUtoWXdPT3FBWm4xcFoyZW51QTMifQ.FyZHYwHdYzXccFPJp6fNcl4CQ1-q6lvUfo2jfxI2nX1FmemPszmYOBV4ifHyRBgg92wfz1gFZU9y2tTDH1p6yVVIj73mQat9zYSJ4qQgkIeogXz1KUk-hO86oHG-iN9h_lq_rZee67Hvf4csd6XsDSvHHuw5uAW2hJwHpt5RPxtLVjlpr-8caZ4AJTIBdJyxx8MKVG1WE7Vz8-ShE7_xVKjNPSmL-wOWx7AK0E-zDD5fjhNIwrI9C_G6kJysbHDEdblnMw6adMGbiGqFJK5Umoqs2Xu8wFiIaf_hdzlnxtSFcwAH5MxyyW88S0jEUQdvMKYTtUekmzq1wBWsd1m2lQ
// dob=%DOB%&user=%SYSLOGIN%


function fetchPatientData(ehrLaunchCapabilities, client) {

  if(client){
    const observationQuery = new URLSearchParams();
    // observationQuery.set("code", "http://loinc.org|55284-4");

    if(client.patient){
      observationQuery.set("patient", get(client, 'patient'));

      if(client.patient.id){
        observationQuery.set("patient", get(client, 'patient.id'));
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
              Observations._collection.upsert({id: observation.id}, {$set: observation}, {validate: false, filter: false});
              if(Array.isArray(observation.component)){
                observation.component.forEach(c => {
                  const code = client.getPath(c, "code.coding.0.code");
                  if (code === "8480-6") {
                    bpMap.systolic.push({
                      x: new Date(observation.effectiveDateTime),
                      y: get(c , 'valueQuantity.value')
                    });
                  } else if (code === "8462-4") {
                    bpMap.diastolic.push({
                      x: new Date(observation.effectiveDateTime),
                      y: get(c , 'valueQuantity.value')
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
        encounterQuery.set("patient", get(client, 'patient.id'));
        console.log('Encounter Query', encounterQuery);

        let encounterUrl = 'Encounter?' + encounterQuery.toString();
        console.log('encounterUrl', encounterUrl);

        client.request(encounterUrl, { pageLimit: 0, flat: true }).then(encounters => {
          if(encounters){
            console.log('PatientAutoDashboard.encounters', encounters)
            encounters.forEach(encounter => {
              Encounters._collection.upsert({id: encounter.id}, {$set: encounter}, {validate: false, filter: false});                    
            });    
          }
        });
      }

      if(ehrLaunchCapabilities.Condition === true){
        const conditionQuery = new URLSearchParams();
        conditionQuery.set("patient", get(client, 'patient.id'));
        console.log('Condition Query', conditionQuery);

        let conditionUrl = 'Condition?' + conditionQuery.toString()
        console.log('conditionUrl', conditionUrl);

        client.request(conditionUrl, { pageLimit: 0, flat: true}).then(conditions => {
          if(conditions){
            console.log('PatientAutoDashboard.conditions', conditions)
            conditions.forEach(condition => {
              Conditions._collection.upsert({id: condition.id}, {$set: condition}, {validate: false, filter: false});                    
            });    
          }
        });
      }

      if(ehrLaunchCapabilities.Procedure === true){
        const procedureQuery = new URLSearchParams();
        procedureQuery.set("patient", get(client, 'patient.id'));
        console.log('Procedure Query', procedureQuery);

        let procedureUrl = 'Procedure?' + procedureQuery
        console.log('procedureUrl', procedureUrl);

        client.request(procedureUrl, { pageLimit: 0, flat: true }).then(procedures => {
          if(procedures){
            console.log('PatientAutoDashboard.procedures', procedures)
            procedures.forEach(procedure => {
              Procedures._collection.upsert({id: procedure.id}, {$set: procedure}, {validate: false, filter: false});                    
            });    
          }
        });
      }

      if(ehrLaunchCapabilities.Immunization === true){
        const immunizationQuery = new URLSearchParams();
        immunizationQuery.set("patient", get(client, 'patient.id'));
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
              Immunizations._collection.upsert({id: procedure.id}, {$set: procedure}, {validate: false, filter: false});                    
            });    
          }
        });
      }

      // if(ehrLaunchCapabilities.MedicationOrder === true){
      //   const medicationOrderQuery = new URLSearchParams();
      //   medicationOrderQuery.set("patient", get(client, 'patient.id'));
      //   console.log('MedicationOrder Query', medicationOrderQuery);

      //   let medicationOrderUrl = 'MedicationOrder?' + medicationOrderQuery
      //   console.log('medicationOrderUrl', medicationOrderUrl);

      //   client.request(medicationOrderUrl, {
      //       pageLimit: 0,
      //       flat: true
      //   }).then(medicationOrders => {
      //     if(medicationOrders){
      //       console.log('PatientAutoDashboard.medicationOrders', medicationOrders)
      //       medicationOrders.forEach(procedure => {
      //         MedicationOrders._collection.upsert({id: procedure.id}, {$set: procedure}, {validate: false, filter: false});                    
      //       });    
      //     }
      //   });
      // }

      // if(ehrLaunchCapabilities.MedicationRequest === true){
      //   const medicationRequestQuery = new URLSearchParams();
      //   medicationRequestQuery.set("patient", get(client, 'patient.id'));
      //   console.log('MedicationRequest Query', medicationRequestQuery);

      //   let medicationRequestUrl = 'MedicationRequest?' + medicationRequestQuery
      //   console.log('medicationRequestUrl', medicationRequestUrl);

      //   client.request(medicationRequestUrl, {
      //     pageLimit: 0,
      //     flat: true
      //   }).then(medicationRequests => {
      //     if(medicationRequests){
      //       console.log('PatientAutoDashboard.medicationRequests', medicationRequests)
      //       medicationRequests.forEach(procedure => {
      //           MedicationRequests._collection.upsert({id: procedure.id}, {$set: procedure}, {validate: false, filter: false});                    
      //       });    
      //     }
      //   });
      // }

    } catch (error) {
        alert("We had an error fetching data.", error)
    }
  }
}


export class FhirClientProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: null,
      error: null
    };
    this.setClient = client => this.setState({ client });
  }

  render() {

    let self = this;

    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader')){
      headerHeight = 128;
    }

      
    let styles = {
      warningIcon: {
        marginTop: '32px',
        width: '48px',
        height: '48px',
        marginBottom: '32px'
      }
    }

    // if (get(self, 'state.error')) {
    //   return <PageCanvas id='constructionZone' headerHeight={headerHeight} >
    //     <Grid container justify="center">
    //       <Grid item md={6}>
    //         <StyledCard scrollable margin={20} >
    //           <CardHeader title="Unable to Connect" 
    //             subheader="Covid19 Patient Chart Analysis requires the app to be launched from an Electronic Health Record (EHR)."
    //           />
    //           <CardContent style={{textAlign: 'center'}}>
    //             <Icon icon={warning} className="warningIcon" style={styles.warningIcon} size={48} />
    //             <h4 style={{margin: '0px', padding: '0px'}}>Warning Message</h4>
    //             <p style={{margin: '0px', padding: '0px'}}>{get(self, 'state.error.message')}</p>
    //           </CardContent>
    //         </StyledCard>
    //       </Grid>
    //     </Grid>
    //   </PageCanvas>        
    // }

    return (
      <FhirClientContext.Provider
          value={{
              client: self.state.client,
              setClient: self.setClient
          }}
      >
          <FhirClientContext.Consumer>
              {({ client }) => {
                  if (client) {
                    return self.props.children;
                  } else {
                    SMART.ready()
                    .then(client => {

                      self.setState({ error: null });
                      self.setState({ 
                        client: client
                      });

                      const token = client.getAuthorizationHeader();
                      console.log('FhirClientProvider.SMART.ready().token: ' + token);

                      const patientId = client.getPatientId();
                      console.log('FhirClientProvider.SMART.ready().patientId: ' + patientId);

                      const state = client.getState();
                      console.log('FhirClientProvider.SMART.ready().state: ' + JSON.stringify(state));
                      Session.set('fhirclient.state', state);

                      const userId = client.getUserId();
                      console.log('FhirClientProvider.SMART.ready().userId: ' + userId);

                      const userType = client.getUserType();
                      console.log('FhirClientProvider.SMART.ready().userType: ' + userType);

                      const fhirUser = client.getFhirUser();
                      console.log('FhirClientProvider.SMART.ready().fhirUser: ' + fhirUser);

                      if(state){
                        let metadataUrl = "";
                        let patientUrl = "";
                        let practitionerUrl = "";
                        let accessToken = "";

                        metadataUrl = state.serverUrl + "/metadata";
                        patientUrl = state.serverUrl + "/Patient/" + patientId;
                        practitionerUrl = state.serverUrl + "/" + fhirUser;
    
                        console.log('FhirClientProvider.metadataUrl:   ', metadataUrl);
                        console.log('FhirClientProvider.patientUrl:    ', patientUrl);
                        console.log('FhirClientProvider.practitionerUrl:    ', practitionerUrl);

                        if(state.tokenResponse){
                          accessToken = state.tokenResponse.access_token;
                          console.log('FhirClientProvider.accessToken:   ', accessToken);
                        }

                        var httpHeaders = { headers: {
                          'Accept': "application/json,application/fhir+json",
                          'Access-Control-Allow-Origin': '*'          
                        }}
                
                        if(get(Meteor, 'settings.private.fhir.fhirServer.auth.bearerToken')){
                            accessToken = get(Meteor, 'settings.private.fhir.fhirServer.auth.bearerToken');
                        }


                        if(accessToken){
                          httpHeaders.headers["Authorization"] = 'Bearer ' + accessToken;

                          console.log('patientUrl.httpHeaders', httpHeaders);

                          if(metadataUrl){            
                            HTTP.get(metadataUrl, httpHeaders, function(error, conformanceStatement){
                              let parsedCapabilityStatement = JSON.parse(get(conformanceStatement, "content"))
                              console.log('Received a conformance statement for the server received via iss URL parameter.', parsedCapabilityStatement);
                      
                              let ehrLaunchCapabilities = FhirUtilities.parseCapabilityStatement(parsedCapabilityStatement);
                              console.log("Result of parsing through the CapabilityStatement.  These are the ResourceTypes we can search for", ehrLaunchCapabilities);
                              Session.set('FhirClientProvider.ehrLaunchCapabilities', ehrLaunchCapabilities)
                  
                              fetchPatientData(ehrLaunchCapabilities, client);
                            })    
                          }    

                          if(patientUrl){            
                            HTTP.get(patientUrl, httpHeaders, function(error, result){
                              let parsedPatientBundle = JSON.parse(get(result, "content"))
                              console.log('FhirClientProvider.parsedPatientBundle', parsedPatientBundle);                      

                              if(parsedPatientBundle.resourceType === "Patient"){
                                if(!Patients.findOne({id: parsedPatientBundle.id})){
                                  Patients._collection.insert(parsedPatientBundle)
                                  Session.set('selectedPatient', parsedPatientBundle)                                  
                                  Session.set('selectedPatientId', get(parsedPatientBundle, 'id'))
                                }
                              }
                            })    
                          }

                          if(practitionerUrl){            
                            HTTP.get(practitionerUrl, httpHeaders, function(error, result){
                              let parsedPractitionerBundle = JSON.parse(get(result, "content"))
                              console.log('FhirClientProvider.parsedPractitionerBundle', parsedPractitionerBundle);     

                              if(parsedPractitionerBundle.resourceType === "Practitioner"){
                                if(!Practitioners.findOne({id: parsedPractitionerBundle.id})){
                                  Practitioners._collection.insert(parsedPractitionerBundle)
                                  Session.set('currentUser', parsedPractitionerBundle);
                                }
                              }
                            })    
                          }
                        }
                      }

              
                      

                    })
                    .catch(error => {
                      self.setState({ error })
                      // console.log('SMART.ready().catch()', error)                            
                    });

                    return null;
                  }
              }}
          </FhirClientContext.Consumer>
      </FhirClientContext.Provider>
    );
  }
}

export default FhirClientProvider;
