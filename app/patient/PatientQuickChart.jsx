import React from "react";
import FhirClientProvider from "../layout/FhirClientProvider";
// import AutoDashboard from "./AutoDashboard";
import AutoDashboard from "./AutoDashboard";
import PatientDemographics from "./PatientDemographics";

import { PageCanvas } from 'fhir-starter';
import { CardHeader, CardContent } from '@material-ui/core';
import { useLocation, useParams, useHistory } from "react-router-dom";

import { oauth2 as SMART } from "fhirclient";
import { get } from 'lodash';



export default function PatientQuickChart(props) {
    logger.info('Rendering the PatientQuickChart');
    logger.verbose('app.patientPatientQuickChart');
    logger.data('PatientQuickChart.props', {data: props}, {source: "PatientQuickChart.jsx"});

    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader')){
      headerHeight = 128;
    }

    let fhirServerEndpoint = 'http://localhost:3100/baseR4';
    // if(Array.isArray(get(Meteor, 'settings.public.smartOnFhir'))){
    //   Meteor.settings.public.smartOnFhir.forEach(function(config){
    //       if(useLocation().search.includes(config.vendorKeyword) && (config.launchContext === "Provider")){
    //           fhirServerEndpoint = get(config, 'fhirServiceUrl') + get(window, '__PRELOADED_STATE__.url.query.code');
    //       }
    //   })
    // }

    let searchParams = new URLSearchParams(useLocation().search);
    if(searchParams.get('iss')){
      console.log('PatientQuickChart.iss', searchParams.get('iss'))
      fhirServerEndpoint = searchParams.get('iss')
    } else if (Session.get('smartOnFhir_iss')){
      fhirServerEndpoint = Session.get('smartOnFhir_iss')
    }



    logger.debug('PatientQuickChart.searchParams', {data: searchParams}, {source: "PatientQuickChart.jsx"});
    logger.debug('PatientQuickChart.props', {data: props}, {source: "PatientQuickChart.jsx"});

    let contentToRender = <FhirClientProvider location={get(props, 'history.location')}>
        <PageCanvas id='patientQuickChart' headerHeight={headerHeight} paddingLeft={20} paddingRight={20} >
          <AutoDashboard fhirServerEndpoint={fhirServerEndpoint} />
        </PageCanvas>
      </FhirClientProvider>
    
    return (contentToRender);
}
