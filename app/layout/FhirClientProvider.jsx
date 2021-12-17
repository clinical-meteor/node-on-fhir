import React, { useState, useEffect } from 'react';

import { oauth2 as SMART } from "fhirclient";
import { FhirClientContext } from "../FhirClientContext";

import { useLocation } from "react-router-dom";

import { 
  CardHeader,
  CardContent,
  Grid
} from '@material-ui/core';
import { PageCanvas, StyledCard } from 'fhir-starter';
import { get, has } from 'lodash';

import { Icon } from 'react-icons-kit'
import { warning } from 'react-icons-kit/fa/warning'

import { Session } from 'meteor/session';
import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import { AuditEvents, Patients, Encounters, Procedures, Conditions, Immunizations, ImmunizationsTable, Observations, Locations, LocationsTable, EncountersTable, ProceduresTable, ConditionsTable, ObservationsTable } from 'meteor/clinical:hl7-fhir-data-infrastructure';
import { HipaaLogger } from 'meteor/clinical:hipaa-logger';

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


function fetchPatientData(ehrLaunchCapabilities, client, accessToken) {
  console.log("---------------------------------------------------------------------")
  console.log("SMART ON FHIR - FhirClientProvider", ehrLaunchCapabilities);

  if(client){
    try {
      if(ehrLaunchCapabilities.Condition === true){
        const conditionQuery = new URLSearchParams();
        conditionQuery.set("patient", get(client, 'patient.id'));
        console.log('Condition Query', conditionQuery);

        // without leading slash seems to work with Cerner, but not with Epic (?)
        let conditionUrl = '/Condition?' + conditionQuery.toString()
        console.log('conditionUrl', conditionUrl);

        console.log('querying the server for Conditions using client.request()')
        client.request(conditionUrl, { pageLimit: 0, flat: true}).then(conditions => {
          if(conditions){
            console.log('PatientAutoDashboard.conditions', conditions)
            conditions.forEach(condition => {
              Conditions._collection.upsert({id: condition.id}, {$set: condition}, {validate: false, filter: false});                    
            });
          }
        });

        console.log('querying the server for Conditions using HTTP.get()')
        let conditionUrlAssembled = get(client.getState(), 'serverUrl') + "/Condition?patient=" + client.getPatientId();
        console.log('FhirClientProvider.conditionUrlAssembled:    ', conditionUrlAssembled);

        if(conditionUrlAssembled){        
          var httpHeaders = { headers: {
            'Accept': "application/json,application/fhir+json",
            "Authorization": "Bearer " + accessToken
          }}

          console.log('FhirClientProvider.conditionUrlAssembled.httpHeaders:    ', httpHeaders);

          // need to reconcile with client.request() syntax above    
          HTTP.get(conditionUrlAssembled, httpHeaders, function(error, result){
            if(result){
              let parsedConditionBundle = JSON.parse(get(result, "content", {}))
              console.log('FhirClientProvider.parsedConditionBundle', parsedConditionBundle);       
              
              if(parsedConditionBundle.resourceType === "Condition"){
                if(!Conditions.findOne({id: parsedConditionBundle.id})){
                  Conditions._collection.upsert({id: parsedConditionBundle.id}, {$set: parsedConditionBundle}, {validate: false, filter: false});     
                }
              }
            }
            if(error){
              console.log('HTTP.get().conditionUrlAssembled.error', error)
            }   
          })    
        }
      }


      if(ehrLaunchCapabilities.Encounter === true){
        const encounterQuery = new URLSearchParams();
        encounterQuery.set("patient", get(client, 'patient.id'));
        console.log('Encounter Query', encounterQuery);

        // without leading slash seems to work with Cerner, but not with Epic (?)
        let encounterUrl = '/Encounter?' + encounterQuery.toString();
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


      if(ehrLaunchCapabilities.Procedure === true){
        const procedureQuery = new URLSearchParams();
        procedureQuery.set("patient", get(client, 'patient.id'));
        console.log('Procedure Query', procedureQuery);

        // without leading slash seems to work with Cerner, but not with Epic (?)
        let procedureUrl = '/Procedure?' + procedureQuery
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

        // without leading slash seems to work with Cerner, but not with Epic (?)
        let immunizationUrl = '/Immunization?' + immunizationQuery
        console.log('immunizationUrl', immunizationUrl);

        client.request(immunizationUrl, {
          pageLimit: 0,
          flat: true
        }).then(immunizations => {
          if(immunizations){
            console.log('PatientAutoDashboard.immunizations', immunizations)
            immunizations.forEach(immunization => {
              Immunizations._collection.upsert({id: immunization.id}, {$set: immunization}, {validate: false, filter: false});                    
            });    
          }
        });
      }

      if(ehrLaunchCapabilities.MedicationOrder === true){
        const medicationOrderQuery = new URLSearchParams();
        medicationOrderQuery.set("patient", get(client, 'patient.id'));
        console.log('MedicationOrder Query', medicationOrderQuery);

        // without leading slash seems to work with Cerner, but not with Epic (?)
        let medicationOrderUrl = '/MedicationOrder?' + medicationOrderQuery
        console.log('medicationOrderUrl', medicationOrderUrl);

        client.request(medicationOrderUrl, {
            pageLimit: 0,
            flat: true
        }).then(medicationOrders => {
          if(medicationOrders){
            console.log('PatientAutoDashboard.medicationOrders', medicationOrders)
            medicationOrders.forEach(medOrder => {
              MedicationOrders._collection.upsert({id: medOrder.id}, {$set: medOrder}, {validate: false, filter: false});                    
            });    
          }
        });
      }

      if(ehrLaunchCapabilities.MedicationRequest === true){
        const medicationRequestQuery = new URLSearchParams();
        medicationRequestQuery.set("patient", get(client, 'patient.id'));
        console.log('MedicationRequest Query', medicationRequestQuery);

        // without leading slash seems to work with Cerner, but not with Epic (?)
        let medicationRequestUrl = '/MedicationRequest?' + medicationRequestQuery
        console.log('medicationRequestUrl', medicationRequestUrl);

        client.request(medicationRequestUrl, {
          pageLimit: 0,
          flat: true
        }).then(medicationRequests => {
          if(medicationRequests){
            console.log('PatientAutoDashboard.medicationRequests', medicationRequests)
            medicationRequests.forEach(procedure => {
                MedicationRequests._collection.upsert({id: procedure.id}, {$set: procedure}, {validate: false, filter: false});                    
            });    
          }
        });
      }

      if(ehrLaunchCapabilities.Observation === true){

        const observationQuery = new URLSearchParams();

        observationQuery.set("patient", get(client, 'patient.id'));
        observationQuery.set("category", "vital-signs");    

        console.log('Vital Signs Query', observationQuery);
    
        // without leading slash seems to work with Cerner, but not with Epic (?)
        let vitalSignsUrl = '/Observation?' + observationQuery.toString();
        console.log('vitalSignsUrl', vitalSignsUrl);

          client.request(vitalSignsUrl, { pageLimit: 0, flat: true }).then(observations => {
          if(observations){
            console.log('PatientAutoDashboard.observations.vital-signs', observations)
            observations.forEach(observation => {
              Observations._collection.upsert({id: observation.id}, {$set: observation}, {validate: false, filter: false});
            });
          }
        });

        observationQuery.delete("category");    
        observationQuery.set("category", "laboratory");    

        console.log('Vital Signs Query', observationQuery);
    
        // without leading slash seems to work with Cerner, but not with Epic (?)
        let laboratoryUrl = '/Observation?' + observationQuery.toString();
        console.log('laboratoryUrl', laboratoryUrl);

          client.request(laboratoryUrl, { pageLimit: 0, flat: true }).then(observations => {
          if(observations){
            console.log('PatientAutoDashboard.observations.laboratory', observations)
            observations.forEach(observation => {
              Observations._collection.upsert({id: observation.id}, {$set: observation}, {validate: false, filter: false});
            });
          }
        });
      }

    } catch (error) {
        alert("We had an error fetching data.", error)
    }
  }
}



export function FhirClientProvider(props){

  let { location, children, ...otherProps } = props;

  let [ client, setClient ] = useState(null);
  let [ error, setError ] = useState(null);
  // let [ location, setLocation ] = useState(location);

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

  return (
    <FhirClientContext.Provider
      value={{
          client: client,
          setClient: setClient
      }}
    >
        <FhirClientContext.Consumer>
            {({ client }) => {
                if (client) {
                  return children;
                } else {


                  SMART.ready()
                    .then(smartClient => {
                      console.log("===========================================================================")
                      console.log("SMART ON FHIR - FhirClientProvider")

                      setError(null);
                      setClient(smartClient);

                      
                      const token = smartClient.getAuthorizationHeader();
                      console.log('FhirClientProvider.SMART.ready().token: ' + token);

                      const patientId = smartClient.getPatientId();
                      console.log('FhirClientProvider.SMART.ready().patientId: ' + patientId);

                      const userId = smartClient.getUserId();
                      console.log('FhirClientProvider.SMART.ready().userId: ' + userId);

                      const userType = smartClient.getUserType();
                      console.log('FhirClientProvider.SMART.ready().userType: ' + userType);

                      const fhirUser = smartClient.getFhirUser();
                      console.log('FhirClientProvider.SMART.ready().fhirUser: ' + fhirUser);

                      const state = smartClient.getState();
                      console.log('FhirClientProvider.SMART.ready().state: ' + JSON.stringify(state));
                      Session.set('fhirclient.state', state);

                      if(state){
                        let metadataUrl = "";
                        let patientUrl = "";
                        let practitionerUrl = "";
                        let accessToken = "";

                        metadataUrl = state.serverUrl + "/metadata?_format=json";
                        console.log('FhirClientProvider.metadataUrl:   ', metadataUrl);


                        if(state.tokenResponse){
                          accessToken = get(state, 'tokenResponse.access_token');
                          console.log('FhirClientProvider.accessToken:   ', accessToken);
                        }

                        var httpHeaders = { headers: {
                          'Accept': "application/json,application/fhir+json",
                          "Authorization": "Bearer " + accessToken
                          // the following doesn't work with Epic; but was needed by some other system
                          // 'Access-Control-Allow-Origin': '*'        
                        }}

                        // if(has(smartOnFhirConfig, 'client_secret')){
                        //   httpHeaders.headers["Authorization"] = "Basic " + atob(get(smartOnFhirConfig, 'client_id') + ":" + get(smartOnFhirConfig, 'client_secret'));
                        // } 
                
                        if(has(Meteor, 'settings.private.fhir.fhirServer.auth.bearerToken')){
                          accessToken = get(Meteor, 'settings.private.fhir.fhirServer.auth.bearerToken');
                        }

                        console.log('FhirClientProvider.patientUrl.httpHeaders', httpHeaders);

                        if(accessToken){
                          if(metadataUrl){            
                            HTTP.get(metadataUrl, httpHeaders, function(error, conformanceStatement){
                              let parsedCapabilityStatement = JSON.parse(get(conformanceStatement, "content"))
                              console.log('Received a conformance statement for the server received via iss URL parameter.', parsedCapabilityStatement);
                      
                              let ehrLaunchCapabilities = FhirUtilities.parseCapabilityStatement(parsedCapabilityStatement);
                              console.log("Result of parsing through the CapabilityStatement.  These are the ResourceTypes we can search for", ehrLaunchCapabilities);
                              Session.set('FhirClientProvider.ehrLaunchCapabilities', ehrLaunchCapabilities)
                  
                              fetchPatientData(ehrLaunchCapabilities, smartClient, accessToken);

                              if(Package["clinical:hipaa-logger"]){
                                let newAuditEvent = { 
                                  "resourceType" : "AuditEvent",
                                  "type" : { 
                                    'code': 'Fetch Patient Data',
                                    'display': 'Fetch Patient Data',
                                    }, 
                                  "action" : 'Fetch Chart',
                                  "recorded" : new Date(), 
                                  "outcome" : "Success",
                                  "outcomeDesc" : 'Medical records fetched from hospital electronic medical record system.',
                                  "agent" : [{ 
                                    "name" : FhirUtilities.pluckName(Session.get('selectedPatient')),
                                    "who": {
                                      "display": FhirUtilities.pluckName(Session.get('selectedPatient')),
                                      "reference": "Patient/" + get(Session.get('selectedPatient'), 'id')
                                    },
                                    "requestor" : false
                                  }],
                                  "source" : { 
                                    "site" : Meteor.absoluteUrl(),
                                    "identifier": {
                                      "value": Meteor.absoluteUrl(),

                                    }
                                  },
                                  "entity": [{
                                    "reference": {
                                      "reference": ''
                                    }
                                  }]
                                };

                                console.log('Logging a hipaa event...', newAuditEvent)
                                let hipaaEventId = HipaaLogger.logAuditEvent(newAuditEvent)            
                              }
                            })    
                          }

                          if(patientId){
                            patientUrl = state.serverUrl + "/Patient?_id=" + patientId;
                            // patientUrl = state.serverUrl + "/Patient/" + patientId;
                            console.log('FhirClientProvider.patientUrl:    ', patientUrl);

                            if(patientUrl){        
                              // need to reconcile with client.request() syntax above    
                              HTTP.get(patientUrl, httpHeaders, function(httpError, httpResult){
                                if(httpResult){
                                  let parsedPatientBundle = JSON.parse(get(httpResult, "content", {}))
                                  console.log('FhirClientProvider.parsedPatientBundle', parsedPatientBundle);                      
    
                                  if(parsedPatientBundle.resourceType === "Patient"){
                                    if(!Patients.findOne({id: parsedPatientBundle.id})){
                                      Patients._collection.insert(parsedPatientBundle)
                                      Session.set('selectedPatient', parsedPatientBundle)                                  
                                      Session.set('selectedPatientId', get(parsedPatientBundle, 'id'))
                                    }
                                  } else if (parsedPatientBundle.resourceType === "Bundle"){
                                    parsedPatientBundle.entry.forEach(function(entry){
                                      if(get(entry, 'resource.resourceType') === "Patient"){
                                        if(!Patients.findOne({id: get(entry, 'resource.id')})){
                                          Patients._collection.insert(get(entry, 'resource'))
                                          Session.set('selectedPatient', get(entry, 'resource'))                                  
                                          Session.set('selectedPatientId', get(entry, 'resource.id'))
                                        }
                                      } 
                                    }) 
                                  }

                                  if(Package["clinical:hipaa-logger"]){
                                    let newAuditEvent = { 
                                      "resourceType" : "AuditEvent",
                                      "type" : { 
                                        'code': 'Fetch Patient Demographics',
                                        'display': 'Fetch Patient Demographics',
                                        }, 
                                      "action" : 'Fetch Chart',
                                      "recorded" : new Date(), 
                                      "outcome" : "Success",
                                      "outcomeDesc" : 'Medical records fetched from hospital electronic medical record system.',
                                      "agent" : [{ 
                                        "name" : FhirUtilities.pluckName(Session.get('selectedPatient')),
                                        "who": {
                                          "display": FhirUtilities.pluckName(Session.get('selectedPatient')),
                                          "reference": "Patient/" + get(Session.get('selectedPatient'), 'id')
                                        },
                                        "requestor" : false
                                      }],
                                      "source" : { 
                                        "site" : Meteor.absoluteUrl(),
                                        "identifier": {
                                          "value": Meteor.absoluteUrl(),

                                        }
                                      },
                                      "entity": [{
                                        "reference": {
                                          "reference": ''
                                        }
                                      }]
                                    };

                                    console.log('Logging a hipaa event...', newAuditEvent)
                                    let hipaaEventId = HipaaLogger.logAuditEvent(newAuditEvent)            
                                  }

                                }
                                if(httpError){
                                  console.log('FhirClientProvider.patientUrl.get().httpError', httpError);
                                }
                              })
                            }
                          } else {
                            console.log('FhirClientProvider.SMART.ready().patientId not found.  Please check scopes and permissions.')
                          }

                          if(fhirUser){
                            practitionerUrl = state.serverUrl + "/" + fhirUser;
                            console.log('FhirClientProvider.practitionerUrl:    ', practitionerUrl);

                            if(practitionerUrl){            
                              // need to reconcile with client.request() syntax above
                              HTTP.get(practitionerUrl, httpHeaders, function(httpError, httpResult){
                                if(httpResult){
                                  let parsedPractitionerBundle = JSON.parse(get(httpResult, "content"))
                                  console.log('FhirClientProvider.parsedPractitionerBundle', parsedPractitionerBundle);     
    
                                  if(parsedPractitionerBundle.resourceType === "Practitioner"){
                                    if(!Practitioners.findOne({id: parsedPractitionerBundle.id})){
                                      Practitioners._collection.insert(parsedPractitionerBundle)
                                      Session.set('currentUser', parsedPractitionerBundle);
                                    }
                                  }  
                                }
                                if(httpError){
                                  console.log('FhirClientProvider.practitionerUrl.get().error', httpError);
                                }
                              })    
                            }
                          } else {
                            console.log('FhirClientProvider.SMART.ready().fhirUser not found.  Please check scopes and permissions.')
                          }
                        }
                      }
                    })
                    .catch(smartError => {
                      setError(smartError);
                    });

                  return null;
                }
            }}
        </FhirClientContext.Consumer>
    </FhirClientContext.Provider>
  );

}




// export class FhirClientProvider extends React.Component {
//   // constructor(props) {
//   //   // super(props);
//   //   // this.state = {
//   //   //   client: null,
//   //   //   error: null,
//   //   //   location: get(props, 'location')
//   //   // };
//   //   // this.setClient = client => this.setState({ client });
//   // }

//   render() {

//     // let self = this;



//     // if (get(self, 'state.error')) {
//     //   return <PageCanvas id='constructionZone' headerHeight={headerHeight} >
//     //     <Grid container justify="center">
//     //       <Grid item md={6}>
//     //         <StyledCard scrollable margin={20} >
//     //           <CardHeader title="Unable to Connect" 
//     //             subheader="Covid19 Patient Chart Analysis requires the app to be launched from an Electronic Health Record (EHR)."
//     //           />
//     //           <CardContent style={{textAlign: 'center'}}>
//     //             <Icon icon={warning} className="warningIcon" style={styles.warningIcon} size={48} />
//     //             <h4 style={{margin: '0px', padding: '0px'}}>Warning Message</h4>
//     //             <p style={{margin: '0px', padding: '0px'}}>{get(self, 'state.error.message')}</p>
//     //           </CardContent>
//     //         </StyledCard>
//     //       </Grid>
//     //     </Grid>
//     //   </PageCanvas>        
//     // }

//     return (
//       <FhirClientContext.Provider
//         value={{
//             client: self.state.client,
//             setClient: self.setClient
//         }}
//       >
//           <FhirClientContext.Consumer>
//               {({ client }) => {
//                   if (client) {
//                     return self.props.children;
//                   } else {

//                     // let useLocationSearch = get(self, 'state.location.search');
//                     // logger.debug('FhirClientProvider.self', self, {source: "FhirClientProvider.jsx"});

//                     // let smartOnFhirConfig;
//                     // if(Array.isArray(get(Meteor, 'settings.public.smartOnFhir'))){
//                     //   Meteor.settings.public.smartOnFhir.forEach(function(config){
//                     //       if(useLocationSearch.includes(config.vendorKeyword) && (config.launchContext === "Provider")){
//                     //           smartOnFhirConfig = config;
//                     //       }
//                     //   })
//                     // }

//                     SMART.ready()
//                       .then(client => {
//                         console.log("===========================================================================")
//                         console.log("SMART ON FHIR - FhirClientProvider")

//                         self.setState({ error: null });
//                         self.setState({ 
//                           client: client
//                         });

//                         const token = client.getAuthorizationHeader();
//                         console.log('FhirClientProvider.SMART.ready().token: ' + token);

//                         const patientId = client.getPatientId();
//                         console.log('FhirClientProvider.SMART.ready().patientId: ' + patientId);

//                         const state = client.getState();
//                         console.log('FhirClientProvider.SMART.ready().state: ' + JSON.stringify(state));
//                         Session.set('fhirclient.state', state);

//                         const userId = client.getUserId();
//                         console.log('FhirClientProvider.SMART.ready().userId: ' + userId);

//                         const userType = client.getUserType();
//                         console.log('FhirClientProvider.SMART.ready().userType: ' + userType);

//                         const fhirUser = client.getFhirUser();
//                         console.log('FhirClientProvider.SMART.ready().fhirUser: ' + fhirUser);

//                         if(state){
//                           let metadataUrl = "";
//                           let patientUrl = "";
//                           let practitionerUrl = "";
//                           let accessToken = "";

//                           metadataUrl = state.serverUrl + "/metadata?_format=json";
//                           console.log('FhirClientProvider.metadataUrl:   ', metadataUrl);


//                           if(state.tokenResponse){
//                             accessToken = get(state, 'tokenResponse.access_token');
//                             console.log('FhirClientProvider.accessToken:   ', accessToken);
//                           }

//                           var httpHeaders = { headers: {
//                             'Accept': "application/json,application/fhir+json",
//                             "Authorization": "Bearer " + accessToken
//                             // the following doesn't work with Epic; but was needed by some other system
//                             // 'Access-Control-Allow-Origin': '*'        
//                           }}

//                           // if(has(smartOnFhirConfig, 'client_secret')){
//                           //   httpHeaders.headers["Authorization"] = "Basic " + atob(get(smartOnFhirConfig, 'client_id') + ":" + get(smartOnFhirConfig, 'client_secret'));
//                           // } 
                  
//                           if(has(Meteor, 'settings.private.fhir.fhirServer.auth.bearerToken')){
//                             accessToken = get(Meteor, 'settings.private.fhir.fhirServer.auth.bearerToken');
//                           }

//                           console.log('FhirClientProvider.patientUrl.httpHeaders', httpHeaders);

//                           if(accessToken){
//                             if(metadataUrl){            
//                               HTTP.get(metadataUrl, httpHeaders, function(error, conformanceStatement){
//                                 let parsedCapabilityStatement = JSON.parse(get(conformanceStatement, "content"))
//                                 console.log('Received a conformance statement for the server received via iss URL parameter.', parsedCapabilityStatement);
                        
//                                 let ehrLaunchCapabilities = FhirUtilities.parseCapabilityStatement(parsedCapabilityStatement);
//                                 console.log("Result of parsing through the CapabilityStatement.  These are the ResourceTypes we can search for", ehrLaunchCapabilities);
//                                 Session.set('FhirClientProvider.ehrLaunchCapabilities', ehrLaunchCapabilities)
                    
//                                 fetchPatientData(ehrLaunchCapabilities, client, accessToken);

//                                 if(Package["clinical:hipaa-logger"]){
//                                   let newAuditEvent = { 
//                                     "resourceType" : "AuditEvent",
//                                     "type" : { 
//                                       'code': 'Fetch Patient Data',
//                                       'display': 'Fetch Patient Data',
//                                       }, 
//                                     "action" : 'Fetch Chart',
//                                     "recorded" : new Date(), 
//                                     "outcome" : "Success",
//                                     "outcomeDesc" : 'Medical records fetched from hospital electronic medical record system.',
//                                     "agent" : [{ 
//                                       "name" : FhirUtilities.pluckName(Session.get('selectedPatient')),
//                                       "who": {
//                                         "display": FhirUtilities.pluckName(Session.get('selectedPatient')),
//                                         "reference": "Patient/" + get(Session.get('selectedPatient'), 'id')
//                                       },
//                                       "requestor" : false
//                                     }],
//                                     "source" : { 
//                                       "site" : Meteor.absoluteUrl(),
//                                       "identifier": {
//                                         "value": Meteor.absoluteUrl(),

//                                       }
//                                     },
//                                     "entity": [{
//                                       "reference": {
//                                         "reference": ''
//                                       }
//                                     }]
//                                   };

//                                   console.log('Logging a hipaa event...', newAuditEvent)
//                                   let hipaaEventId = HipaaLogger.logAuditEvent(newAuditEvent)            
//                                 }
//                               })    
//                             }

//                             if(patientId){
//                               patientUrl = state.serverUrl + "/Patient?_id=" + patientId;
//                               // patientUrl = state.serverUrl + "/Patient/" + patientId;
//                               console.log('FhirClientProvider.patientUrl:    ', patientUrl);

//                               if(patientUrl){        
//                                 // need to reconcile with client.request() syntax above    
//                                 HTTP.get(patientUrl, httpHeaders, function(error, result){
//                                   if(result){
//                                     let parsedPatientBundle = JSON.parse(get(result, "content", {}))
//                                     console.log('FhirClientProvider.parsedPatientBundle', parsedPatientBundle);                      
      
//                                     if(parsedPatientBundle.resourceType === "Patient"){
//                                       if(!Patients.findOne({id: parsedPatientBundle.id})){
//                                         Patients._collection.insert(parsedPatientBundle)
//                                         Session.set('selectedPatient', parsedPatientBundle)                                  
//                                         Session.set('selectedPatientId', get(parsedPatientBundle, 'id'))
//                                       }
//                                     } else if (parsedPatientBundle.resourceType === "Bundle"){
//                                       parsedPatientBundle.entry.forEach(function(entry){
//                                         if(get(entry, 'resource.resourceType') === "Patient"){
//                                           if(!Patients.findOne({id: get(entry, 'resource.id')})){
//                                             Patients._collection.insert(get(entry, 'resource'))
//                                             Session.set('selectedPatient', get(entry, 'resource'))                                  
//                                             Session.set('selectedPatientId', get(entry, 'resource.id'))
//                                           }
//                                         } 
//                                       }) 
//                                     }

//                                     if(Package["clinical:hipaa-logger"]){
//                                       let newAuditEvent = { 
//                                         "resourceType" : "AuditEvent",
//                                         "type" : { 
//                                           'code': 'Fetch Patient Demographics',
//                                           'display': 'Fetch Patient Demographics',
//                                           }, 
//                                         "action" : 'Fetch Chart',
//                                         "recorded" : new Date(), 
//                                         "outcome" : "Success",
//                                         "outcomeDesc" : 'Medical records fetched from hospital electronic medical record system.',
//                                         "agent" : [{ 
//                                           "name" : FhirUtilities.pluckName(Session.get('selectedPatient')),
//                                           "who": {
//                                             "display": FhirUtilities.pluckName(Session.get('selectedPatient')),
//                                             "reference": "Patient/" + get(Session.get('selectedPatient'), 'id')
//                                           },
//                                           "requestor" : false
//                                         }],
//                                         "source" : { 
//                                           "site" : Meteor.absoluteUrl(),
//                                           "identifier": {
//                                             "value": Meteor.absoluteUrl(),

//                                           }
//                                         },
//                                         "entity": [{
//                                           "reference": {
//                                             "reference": ''
//                                           }
//                                         }]
//                                       };

//                                       console.log('Logging a hipaa event...', newAuditEvent)
//                                       let hipaaEventId = HipaaLogger.logAuditEvent(newAuditEvent)            
//                                     }

//                                   }
//                                   if(error){
//                                     console.log('FhirClientProvider.patientUrl.get().error', error);
//                                   }
//                                 })
//                               }
//                             } else {
//                               console.log('FhirClientProvider.SMART.ready().patientId not found.  Please check scopes and permissions.')
//                             }

//                             if(fhirUser){
//                               practitionerUrl = state.serverUrl + "/" + fhirUser;
//                               console.log('FhirClientProvider.practitionerUrl:    ', practitionerUrl);

//                               if(practitionerUrl){            
//                                 // need to reconcile with client.request() syntax above
//                                 HTTP.get(practitionerUrl, httpHeaders, function(error, result){
//                                   if(result){
//                                     let parsedPractitionerBundle = JSON.parse(get(result, "content"))
//                                     console.log('FhirClientProvider.parsedPractitionerBundle', parsedPractitionerBundle);     
      
//                                     if(parsedPractitionerBundle.resourceType === "Practitioner"){
//                                       if(!Practitioners.findOne({id: parsedPractitionerBundle.id})){
//                                         Practitioners._collection.insert(parsedPractitionerBundle)
//                                         Session.set('currentUser', parsedPractitionerBundle);
//                                       }
//                                     }  
//                                   }
//                                   if(error){
//                                     console.log('FhirClientProvider.practitionerUrl.get().error', error);
//                                   }
//                                 })    
//                               }
//                             } else {
//                               console.log('FhirClientProvider.SMART.ready().fhirUser not found.  Please check scopes and permissions.')
//                             }
//                           }
//                         }
//                       })
//                       .catch(error => {
//                         self.setState({ error })
//                         // console.log('SMART.ready().catch()', error)                            
//                       });

//                     return null;
//                   }
//               }}
//           </FhirClientContext.Consumer>
//       </FhirClientContext.Provider>
//     );
//   }
// }

export default FhirClientProvider;
