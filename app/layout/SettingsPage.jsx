import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useHistory } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';

import { get, has } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';

import { DynamicSpacer, FhirUtilities, PageCanvas, StyledCard } from 'fhir-starter';
import { useTracker } from 'meteor/react-meteor-data';

import { Icon } from 'react-icons-kit'
import { spinner8 } from 'react-icons-kit/icomoon/spinner8'


import { oauth2 as SMART } from "fhirclient";

// import Client from 'fhir-kit-client';
// import simpleOauthModule from 'simple-oauth2';

import { Patients } from 'meteor/clinical:hl7-fhir-data-infrastructure';
// import GravityMethods from '../../lib/GravityMethods';

//==============================================================================================
// DEFAULT SESSIONS

if(Meteor.isClient){
  Session.setDefault('gravityServerUrl', 'http://localhost:3000/baseR4');
}


//==============================================================================================
// THEMING

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
    margin: theme.spacing(1)
  }
}));

const buttonStyles = makeStyles(theme => ({
  west_button: {
    cursor: 'pointer',
    justifyContent: 'left',
    float: 'left',
    color: theme.palette.appBar.contrastText,
    marginLeft: '20px',
    marginTop: '15px'
  },
  east_button: {
    cursor: 'pointer',
    justifyContent: 'right',
    color: theme.palette.appBar.contrastText,
    marginTop: '15px'
  },
  east_button_container: {
    float: 'right',
    right: '20px',
    position: 'absolute'
  }
}));

//==============================================================================================
// MAIN COMPONENT


function SettingsPage(props){

  const buttonClasses = buttonStyles();

  //--------------------------------------------------------------------------------
  // Props

  const { children, staticContext, loadingMessage, spinningIcon, ...otherProps } = props;

  //--------------------------------------------------------------------------------
  // Query Parameters

  let searchParams = new URLSearchParams(useLocation().search);


  //--------------------------------------------------------------------------------
  // Trackers

  let gravityServerUrl = [];
  gravityServerUrl = useTracker(function(){
    return Session.get('gravityServerUrl')
  }, [])

  let lastRefreshedAt = new Date();
  lastRefreshedAt = useTracker(function(){
    // GravityMethods.fetchEhrData();
    return Session.get('lastRefreshedAt')
  }, [])


  //--------------------------------------------------------------------------------
  // Styling

  const classes = useStyles();
  
  let styles = {
    spinningIcon: {
      marginTop: '32px',
      width: '48px',
      height: '48px'
    },
    loadingMessage: {
      position: 'absolute',
      left: '50%',
      top: '40%'
    }
  }

  let headerHeight = 84;
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    headerHeight = 148;
  }  

  function initServerConfigs(){
    Meteor.call('initializeGravityArtifacts')
    Meteor.call('initGravity')
  }
  function initUsCore(){
    if(confirm('Initializing US Core')){
      Meteor.call('initializeUsCoreValueSets')  
    }
  }
  function initPatientData(){
    Meteor.call('initializeGravityPatientArtifacts')
  }
  function initMapData(){
    Meteor.call('initChicagoGrocersMap')
  }
  function changeServerUrl(event){
    Session.set('gravityServerUrl', event.target.value)
  }
  function fetchMetadata(){
    Session.set('mainAppDialogOpen', true);
    Session.set('mainAppDialogComponent', null);
    Session.set('mainAppDialogMaxWidth', "md");
    Session.set('mainAppDialogTitle', "Fetch Metadata");

    console.log('gravityServerUrl', gravityServerUrl)
    HTTP.get(gravityServerUrl + '/metadata', function(error, result){
      if(error){
        console.error(error)
      }
      if(result){
        console.log("result", result)
        if(has(result, 'data')){
          Session.set('mainAppDialogJson', get(result, 'data'));
        }        
      }
    })    
  }
  function fhirKitTest(){
    console.log('fhirKitTest');

    Meteor.call('fetchContainerizedBearerToken', async function(error, result){
      console.log('authenticateWithFhirServer', Session.get('smartOnFhir_iss'));

      if(result){
        fhirClient = new Client({ 
          baseUrl: get(result, 'baseUrl', Session.get('smartOnFhir_iss'))    
        });
        const { authorizeUrl, tokenUrl } = await fhirClient.smartAuthMetadata();
  
        if(authorizeUrl && tokenUrl){
          const oauth2 = simpleOauthModule.create({
            client: {
              id: get(Meteor, 'settings.public.smartOnFhir[0].client_id'),
              secret: get(Meteor, 'settings.public.smartOnFhir[0].secret')
            },
            auth: {
              tokenHost: tokenUrl.protocol + '//' + tokenUrl.host,
              tokenPath: tokenUrl.pathname,
              authorizeHost: authorizeUrl.protocol + '//' + authorizeUrl.host,
              authorizePath: authorizeUrl.pathname
            },
            options: {
              authorizationMethod: 'body',
            }
          });
  
          const options = {
            code: Session.get('smartOnFhir_code'),
            redirect_uri: get(Meteor, 'settings.public.smartOnFhir[0].redirect_uri')
          };
  
          try {
            const result = await oauth2.authorizationCode.getToken(options);
        
            const { token } = oauth2.accessToken.create(result);
        
            console.log('The token is : ', token);
        
            fhirClient.bearerToken = token.access_token;
        
            const patient = await fhirClient.read({ resourceType: 'Patient', id: token.patient });
        
            console.log('patient', patient);
          } catch (error) {
            console.error('Access Token Error', error.message);        
          }
        }
      }      
    })
  }

  function indexPatientNames(){
    if(confirm('This process will generate patient name.text fields for indexing.  Are you sure you want to continue?')){      

      Patients.find().forEach(function(patientRecord){
        console.log('name.text', FhirUtilities.assembleName(get(patientRecord, 'name[0]')))
        if(!get(patientRecord, 'name[0].text')){
          Patients.update({_id: patientRecord._id}, {$set: {
            "name.0.text": FhirUtilities.assembleName(get(patientRecord, 'name[0]'))
          }})
        }
      })

      
    }
  }
  function deduplicateRecords(){
    if(confirm('Warning!  This function can result in lost data.  Are you sure you want to proceed?')){
      alert('Simulating deduplication now...')
    }
  }

  return (
    <PageCanvas id='SettingsPage' headerHeight={headerHeight} >
      <Grid container spacing={3} justify="center" style={{paddingBottom: '80px'}}>
        <Grid item xs={4}>
          <StyledCard>
            <CardHeader 
              title="Settings" 
              subheader="Options you can configure when setting up the application."
              style={{fontSize: '100%'}} />
            <CardContent>
              <Button variant="contained" fullWidth onClick={initServerConfigs.bind(this)}>Initialize Server Configs (ValueSets, CodeSystems, etc)</Button>
              <DynamicSpacer />
              <Button variant="contained" fullWidth onClick={initUsCore.bind(this)}>Initialize US Core</Button>
            </CardContent>
          </StyledCard>   
        <DynamicSpacer />
          <StyledCard>
            <CardHeader 
              title="Add Server" 
              subheader="Location of the upstream EHR system."
              style={{fontSize: '100%'}} />
            <CardContent>
              <FormControl style={{width: '100%', marginTop: '20px'}}>
                <InputAdornment className={classes.label}>Address</InputAdornment>
                <Input
                  id="addServerInput"
                  name="addServerInput"
                  style={classes.input}                  
                  defaultValue={gravityServerUrl}
                  onChange={  changeServerUrl.bind(this)}
                  fullWidth              
                />       
              </FormControl>
            </CardContent>
            <CardActions>
              <Button color="primary" onClick={fetchMetadata.bind(this)}>View Metadata</Button>
              {/* <Button color="primary">Add</Button> */}
            </CardActions>
          </StyledCard>   
        <DynamicSpacer />
          <StyledCard>
            <CardHeader 
              title="Database Maintenance" 
              subheader="Utilities to keep the database synchronized and healthy"
              style={{fontSize: '100%'}} />
            <CardContent>
              <Button variant="contained" fullWidth onClick={ indexPatientNames.bind(this) }>Index Patient Names</Button>
              <DynamicSpacer />
              <Button variant="contained" fullWidth onClick={ deduplicateRecords.bind(this) }>Deduplicate Records</Button>
            </CardContent>
          </StyledCard>   


          {/* <DynamicSpacer />
          <StyledCard>
            <CardHeader 
              title="Servers" 
              subheader="Location of the upstream EHR system."
              style={{fontSize: '100%'}} />
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Name
                    </TableCell>
                    <TableCell>
                      Address
                    </TableCell>
                  </TableRow>

                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      Self
                    </TableCell>
                    <TableCell>
                      {Meteor.absoluteUrl()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>              
            </CardContent>
          </StyledCard>           */}
        </Grid>
      </Grid>                 
    </PageCanvas>
  );
}

export default SettingsPage;