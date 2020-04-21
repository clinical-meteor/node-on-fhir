import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { FhirClientContext } from "../FhirClientContext";

import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';

import { get } from 'lodash';
import moment from 'moment';

import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';

export class PatientDemographics extends React.Component {
    static contextType = FhirClientContext;

    constructor(props) {
        super(props);
    }
    getMeteorData(){
        let data = {
            patient: false
        }
        if(Session.get('selectedPatient')){
            data.patient = Session.get('selectedPatient');
        }
        return data;
    }
    componentDidMount() {
        const client = this.context.client;

        if(get(client, 'patient')){
            client.patient.read().then(patient => {
                console.log("Received a paitent", patient)
                Session.set('selectedPatient', patient)
            })    
        }
    }
    render() {
      const { patient } = this.data;
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

      return (
        <div id="patienCanvasDemographcs">
            { demographicsContent }
        </div>
      );
    }
}

ReactMixin(PatientDemographics.prototype, ReactMeteorData);
export default PatientDemographics;