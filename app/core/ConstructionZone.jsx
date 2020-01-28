import React, { memo, useState, useEffect, useCallback } from 'react';
import { 
  CssBaseline,
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Paper,
  Button,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';
import StyledCard from '../components/StyledCard';

import { PatientCard, PatientDetail, PatientTable } from 'material-fhir-ui';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box>{children}</Box>
    </Typography>
  );
}


let JaneDoe = {
  resourceType: "Patient",
  name: [
    {
      text: "Amelia Doe",
      family: ["Doe"],
      given: ["Amelia"]
    }
  ],
  birthDate: "Jan 31st, 1990",
  gender: "female",
  photo: [
    {
      url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Amelia-in-evening-clothes_%28cropped%29.jpg/220px-Amelia-in-evening-clothes_%28cropped%29.jpg"
    }
  ],
  contact: [
    {
      value: "janedoe@symptomatic.io",
      system: "email"
    }
  ],
  identifier: [
    {
      system: "MRN",
      value: "UC-387437483"
    }
  ]
};

function ConstructionZone(props) {
  logger.info('Rendering the ConstructionZone and associated backgrounds.');
  logger.verbose('client.app.layout.ConstructionZone');

  const { children, staticContext, ...otherProps } = props;

  const [tabIndex, setTabIndex] = useState(0);

  function handleChange(event, newValue) {
    setTabIndex(newValue);
  }

  return (
    <div { ...otherProps } >
      <Container style={{paddingLeft: '100px'}} >
        <h2>Construction Zone</h2>

        <Tabs value={tabIndex} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Directory" />
          <Tab label="New" />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          <StyledCard>
            <CardHeader title="Patients" />
            <CardContent>
              <PatientTable />
            </CardContent>
          </StyledCard>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <PatientDetail patient={JaneDoe} />
        </TabPanel>
        <br />
        <br />
        <PatientCard patient={JaneDoe} />    
      </Container>
    </div>
  );
}
export default ConstructionZone;

