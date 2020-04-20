import React from "react";
import FhirClientProvider from "../layout/FhirClientProvider";
// import AutoDashboard from "./AutoDashboard";
import AutoDashboard from "./AutoDashboard";
import PatientDemographics from "./PatientDemographics";

import { PageCanvas } from 'material-fhir-ui';
import { CardHeader, CardContent } from '@material-ui/core';
import { useLocation, useParams, useHistory } from "react-router-dom";

import { oauth2 as SMART } from "fhirclient";
import { get } from 'lodash';

/**
 * Wraps everything into `FhirClientProvider` so that any component
 * can have access to the fhir client through the context.
 */
export default function PatientQuickChart(props) {
    logger.info('Rendering the PatientQuickChart');
    logger.verbose('app.patientPatientQuickChart');
    logger.data('PatientQuickChart.props', {data: props}, {source: "PatientQuickChart.jsx"});

    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader')){
      headerHeight = 128;
    }

    let fhirServerEndpoint = get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', 'http://localhost:3100/baseR4');

    let searchParams = new URLSearchParams(useLocation().search);
    if(searchParams.get('iss')){
      console.log('PatientQuickChart.iss', searchParams.get('iss'))
      fhirServerEndpoint = searchParams.get('iss')
    } else if (Session.get('smartOnFhir_iss')){
      fhirServerEndpoint = Session.get('smartOnFhir_iss')
    }

    let contentToRender;
    if(SMART.ready()){
      contentToRender = <FhirClientProvider>
        <PageCanvas id='patientQuickChart' headerHeight={headerHeight} >
          <PatientDemographics />
          <AutoDashboard fhirServerEndpoint={fhirServerEndpoint} />
        </PageCanvas>
      </FhirClientProvider>
    } else {
      contentToRender = <PageCanvas id='patientQuickChart' headerHeight={headerHeight} >
        <PatientDemographics />
        <AutoDashboard fhirServerEndpoint={fhirServerEndpoint} />
      </PageCanvas>
    }
    
    return (contentToRender);
}
