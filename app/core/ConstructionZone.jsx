import React, { Component } from 'react';
import { 
  CssBaseline,
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent
} from '@material-ui/core';

import { Foo, PatientCard, PatientDetail, PatientTable } from 'material-fhir-ui';

function ConstructionZone(props) {
  logger.info('Rendering the ConstructionZone and associated backgrounds.');
  logger.verbose('client.app.layout.ConstructionZone');

  const { children, staticContext, ...otherProps } = props;

  return (
    <div { ...otherProps } >
      <Container >
        <h2>Construction Zone</h2>
        <Foo />
        <br />
        <br />
        <PatientCard />
        <br />
        <br />
        <PatientTable />
        <br />
        <br />
        <PatientDetail />
      </Container>
    </div>
  );
}
export default ConstructionZone;

