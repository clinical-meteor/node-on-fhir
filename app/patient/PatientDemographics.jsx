import React from "react";
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { FhirClientContext } from "../FhirClientContext";

import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';

import { get } from 'lodash';
import moment from 'moment';

import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';

export function PatientDemographics(props){
    const contextType = FhirClientContext;

    
    let selectedPatient = useTracker(function(){
        return Session.get('selectedPatient')
    }, [])

    const { patient } = props;
    console.log('PatientDemographics.patient', patient);

    let displayName = FhirUtilities.pluckName(patient);
  
    let birthDate = "";
    if(get(patient, 'birthDate')){
        birthDate = moment(get(patient, 'birthDate')).format("YYYY-MM-DD");
    }

    let demographicsContent;

    if(patient){
        demographicsContent = <div>
            <h1 className="helveticas" style={{marginBottom: '0px'}}>{displayName}</h1>
            <span style={{paddingRight: '10px'}}>
                Gender: <b>{get(patient, 'gender')}</b>
            </span>
            <span>
                Date of Birth: <b>{birthDate}</b>
            </span>
        </div>
    }

    // // deprecated
    // // but this might be important logic
    // function componentDidMount() {
    //     const client = this.context.client;

    //     if(get(client, 'patient')){
    //         client.patient.read().then(patient => {
    //             console.log("Received a paitent", patient)
    //             Session.set('selectedPatient', patient)
    //         })    
    //     }
    // }

  return (
    <div id="patienCanvasDemographcs">
        { demographicsContent }
    </div>
  );
}


export default PatientDemographics;