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
            patient: {}
        }
        if(Session.get('currentPatient')){
            data.patient = Session.get('currentPatient');
        }
        return data;
    }
    componentDidMount() {
        const client = this.context.client;



        client.patient.read().then(patient => {
            console.log("Received a paitent", patient)
            Session.set('currentPatient', patient)
        })
        
    }
    render() {
      const { patient } = this.data;
        console.log('PatientDemographics.patient', patient);

      let displayName = FhirUtilities.pluckName(patient);
      
      return (
        <div>
            <h1 className="helveticas" style={{marginBottom: '0px'}}>{displayName}</h1>
            <span style={{paddingRight: '10px'}}>
                Gender: <b>{get(patient, 'gender')}</b>
            </span>
            <span>
                Date of Birth: <b>{moment(get(patient, 'birthDate')).format("YYYY-MM-DD")}</b>
            </span>
        </div>
      );
    }
}

ReactMixin(PatientDemographics.prototype, ReactMeteorData);
export default PatientDemographics;