import React from "react";
import Dashboard from "./Dashboard";
import PatientDemographics from "./PatientDemographics";

import { PageCanvas } from 'fhir-starter';
import { CardHeader, CardContent } from '@material-ui/core';
import { useLocation, useParams, useHistory } from "react-router-dom";

import { oauth2 as SMART } from "fhirclient";
import { get } from 'lodash';


export default function PatientChart() {
    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader')){
      headerHeight = 128;
    }

    let fhirServerEndpoint = get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', 'http://localhost:3100/baseR4');

    let searchParams = new URLSearchParams(useLocation().search);
    if(searchParams.get('iss')){
      console.log('PatientChart.iss', searchParams.get('iss'))
      fhirServerEndpoint = searchParams.get('iss')
    }

    let contentToRender = <PageCanvas id='patientChart' headerHeight={headerHeight} >
        <PatientDemographics />
        <Dashboard fhirServerEndpoint={fhirServerEndpoint} />
      </PageCanvas>    
    return (contentToRender);
}
