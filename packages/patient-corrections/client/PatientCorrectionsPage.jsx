
import React from 'react';

import { get, has } from 'lodash';
import { Session } from 'meteor/session';

import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';

import { StyledCard, PageCanvas } from 'material-fhir-ui';




//==========================================================================================
// Main Component

function PatientCorrectionsPage(props){

  return (
    <PageCanvas id='PatientCorrectionsPage' headerHeight={148}  >
      <Grid container style={{marginTop: '40px', marginBottom: '80px'}}>            
        <Grid item md={6}> 
          <StyledCard id="patientCorrectionCard"  >
            <CardHeader title="Patient Corrections" />

          </StyledCard>               
        </Grid>
      </Grid>          
    </PageCanvas>
  );
}

export default PatientCorrectionsPage;