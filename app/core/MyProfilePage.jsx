import React, { memo, useState, useEffect, useCallback } from 'react';
import { Button, Grid, CardHeader, CardContent, Container, TextField, Typography, Box } from '@material-ui/core';

import { get } from 'lodash';
import { PageCanvas, StyledCard, DynamicSpacer } from 'fhir-starter';
import { useTracker } from 'meteor/react-meteor-data';

import { ConsentsTable } from 'meteor/clinical:hl7-fhir-data-infrastructure';






function MyProfilePage(props) {
  logger.info('Rendering the MyProfilePage and associated backgrounds.');
  logger.verbose('client.app.layout.MyProfilePage');

  const { children, staticContext, ...otherProps } = props;


  let currentUser = useTracker(function(){
    return Session.get('currentUser');
  }, [])


  let headerHeight = 64;
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    headerHeight = 128;
  }


  return (
    <PageCanvas id='MyProfilePage' headerHeight={headerHeight} >
      <Container maxwidth="md">
        <StyledCard scrollable margin={20} >
          <CardHeader title="My Profile" />
          <CardContent>
            <TextField 
              fullWidth={true}
              type="text"
              label="Name"
              style={{marginBottom: '10px'}}
              value={get(currentUser, 'fullLegalName')}
              InputLabelProps={{shrink: true}}
            />
            <TextField 
              fullWidth={true}
              type="text"
              label="User ID"
              style={{marginBottom: '10px'}}
              value={get(currentUser, 'id')}
              InputLabelProps={{shrink: true}}
            />
            <TextField 
              fullWidth={true}
              type="text"
              label="Primary Email"
              style={{marginBottom: '10px'}}
              value={get(currentUser, 'emails[0].address')}
              InputLabelProps={{shrink: true}}
            />
          </CardContent>
        </StyledCard>
        <DynamicSpacer />
        <StyledCard scrollable margin={20} >
          <CardHeader title="Consent Records" />
          <CardContent>
            <ConsentsTable
              consents={[]}
              hideIdentifier={true}
              noDataMessage={false}
              // onSetPage={function(index){
              //   setConsentsIndex(index)
              // }}        
              // page={data.consentsIndex}
              sort="periodStart"
            />
          </CardContent>
        </StyledCard>
        <DynamicSpacer />
        <StyledCard scrollable margin={20} >
          <CardHeader title="Danger Area" />
          <CardContent>
            <Button fullWidth variant="contained" color="primary">Delete Account</Button>
          </CardContent>
        </StyledCard>
        <DynamicSpacer />
      </Container>
    </PageCanvas>
  );
}
export default MyProfilePage;

