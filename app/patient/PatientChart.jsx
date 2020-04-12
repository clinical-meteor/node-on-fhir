import React from "react";
import FhirClientProvider from "../layout/FhirClientProvider";
import Chart from "./Chart";
import Patient from "./Patient";

import { PageCanvas, StyledCard } from 'material-fhir-ui';
import { CardHeader, CardContent } from '@material-ui/core';

import { get } from 'lodash';

/**
 * Wraps everything into `FhirClientProvider` so that any component
 * can have access to the fhir client through the context.
 */
export default function PatientChart() {
    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader')){
      headerHeight = 128;
    }
    
    return (
      <FhirClientProvider>
        <PageCanvas id='constructionZone' headerHeight={headerHeight} >
          <CardHeader title="Patient Chart" />
          <StyledCard height="auto" scrollable margin={20} >
            <CardContent>
              <Patient />
              <hr />
              <Chart />
              <br />
            </CardContent>
          </StyledCard>
        </PageCanvas>
      </FhirClientProvider>
    );
}
