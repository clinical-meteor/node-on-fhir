import React, { Component, useState, useEffect } from 'react';

import { 
  Container, 
  Card, 
  CardMedia, 
  CardContent, 
  CardHeader,
  Input,
  TextField,
  Button,
  Divider
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import { get, has } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { PatientTable } from 'material-fhir-ui';
import { Patients } from 'meteor/clinical:hl7-resource-patient';

import StyledCard from './StyledCard';

import Client from 'fhir-kit-client';

console.log('Intitializing fhir-kit-client for ' + get(Meteor, 'settings.public.interfaces.default.channel.endpoint', ''))
const fhirClient = new Client({
  baseUrl: get(Meteor, 'settings.public.interfaces.default.channel.endpoint', '')
});

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1),
  }
}));

function FhirQueryPage(props){
  const classes = useStyles();

  const rowsPerPage = get(Meteor, 'settings.public.defaults.rowsPerPage', 25);

  let endpointDefinedInSettings = get(Meteor, 'settings.public.interfaces.default.channel.endpoint', '');

  const [json, setJson] = useState("");
  const [patients, setPatients] = useState([]);

  function fetchData(props){
    console.log('Fetch data from the following endpoint: ', get(Meteor, 'settings.public.interfaces.default.channel.endpoint', ''));
    
    let patientsArray = [];
    let foo = fhirClient
      .search({ resourceType: 'Patient', searchParams: { gender: 'female' } })
      .then((response) => {
        console.log(response);
        Session.set('helloFhirQueryResults', response);
        setJson(JSON.stringify(response));

        if(get(response, 'resourceType') === "Bundle"){
          console.log('Parsing a Bundle.')
          let entries = get(response, 'entry', []);
          
          entries.forEach(function(entry){
            if(get(entry, 'resource.resourceType') === "Patient"){
              let patientId = Patients.insert(get(entry, 'resource'), {validate: false, filter: false});
              console.log('Just created new patient: ' + patientId);

              if(!get(entry, 'resource.id')){
                entry.resource.id = Random.id()
              }
              if(!get(entry, 'resource._id')){
                entry.resource._id = Random.id()
              }

              patientsArray.push(get(entry, 'resource'))
            }
          })
          
        }

        return patientsArray;
      })
      .then((patientsArray) => {
        console.log('patientsArray', patientsArray);
        setPatients(patientsArray);
        return patientsArray;
      })
      .catch((error) => {
        console.error(error);
      });

      console.log('foo',)
  }

  let containerStyle = {};
  if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){
    containerStyle.paddingTop = "64px";
  }
  
  return (
    <div id='indexPage'>
      <Container style={containerStyle}>
        <StyledCard >
          <CardHeader 
            title="Fetch Some Health Related Data" 
            subheader="Exercising data access rights according to the 21st Century Cures Act."
            style={{fontSize: '100%'}} />
          <CardContent style={{fontSize: '100%'}}>
            <TextField
              id="standard-basic"
              className={classes.textField}
              label="Health Record and Interoperability Resource Query"
              defaultValue={ endpointDefinedInSettings }
              placeholder="http://localhost:3100/baseDstu2/Patient?_count=20"
              helperText='Please enter a web address URL.  '
              fullWidth
              margin="normal"
            />
            <Button color="primary" className={classes.button} onClick={fetchData.bind(this)} >Fetch</Button>            
          </CardContent>
        </StyledCard>
        <br />
        <br />
        <StyledCard height='auto'>
          <CardHeader 
            title="Results" 
            style={{fontSize: '100%'}} />
          <CardContent style={{fontSize: '100%'}}>
          <PatientTable
            patients={patients}
            rowsPerPage={rowsPerPage}
            count={patients.length}
          />
            {/* { json } */}
          </CardContent>
        </StyledCard>
        <br />
        <br />
        <br />
        <br />
        <br />
      </Container>
    </div>
  );
}

export default FhirQueryPage;