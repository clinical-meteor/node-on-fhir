import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";


import { makeStyles, withStyles } from '@material-ui/core/styles';

import {
  Grid, 
  Card,
  CardHeader, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';
import { PageCanvas, StyledCard, DynamicSpacer } from 'fhir-starter';
import { get, has } from 'lodash';

import { Alert } from '@mui/lab';


import { oauth2 as SMART } from "fhirclient";

import { logger } from '../Logger';


// ==============================================================================
// Styling

// not currently used; but needed to work so we can get the default theme
const styles = theme => ({});

const useStyles = makeStyles((theme) => ({
  label: {
    fontWeight: 'bold !important'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: "red"
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    // width: '25ch',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: '100%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

// ==============================================================================
// Main Component

function EhrLaunchPage(props) {
  if(logger){
    logger.info('Rendering the EhrLaunchPage.');
    logger.verbose('client.app.layout.EhrLaunchPage');  
  }

  const classes = useStyles();
  //--------------------------------------------------------------------------------
  // Props

  const { children, staticContext, loadingMessage, spinningIcon, ...otherProps } = props;

  //--------------------------------------------------------------------------------
  // Query Parameters

  let useLocationSearch = useLocation().search
  let searchParams = new URLSearchParams(useLocationSearch);

  let [ smartConfigString, setSmartConfigString ] = useState("");
  let [ smartConfigObject, setSmartConfigObject ] = useState({});

  //--------------------------------------------------------------------------------
  // Component Life Cycle Functions

  useEffect(function(){
    console.log('---------------------------------------------------------------')
    console.log('LAUNCH PAGE')
    console.log('')

    let iss = searchParams.get('iss');
    if(iss){
      let issArray = iss.split("/");
      
      let ehrFhirVersion = issArray[issArray.length - 1];

      let appIsProduction = true;
      let appIsRunningOnLocalhost = false;
      if(Meteor.absoluteUrl() === "http://localhost:3000/"){
        appIsProduction = false;
        appIsRunningOnLocalhost = true;
        console.log('Running on localhost');
      } else {
        console.log('Running in production');
      }

      let smartOnFhirConfig;
      let smartOnFhirArray = get(Meteor, 'settings.public.smartOnFhir');
      if(Array.isArray(smartOnFhirArray)){
        if(smartOnFhirArray.length > 1){
          Meteor.settings.public.smartOnFhir.forEach(function(config){
              if(useLocationSearch.includes(config.vendorKeyword) && (config.launchContext === "Provider") && (config.fhirVersion === ehrFhirVersion) && (config.production === appIsProduction) && (config.environment === (appIsRunningOnLocalhost ? "localhost" : "meteor"))){
                  smartOnFhirConfig = config;
                  console.log('Found a matching config for ', config.vendorKeyword) 
              }
          })
        } else if(smartOnFhirArray.length === 1){
          smartOnFhirConfig = smartOnFhirArray[0];
        }
      }


      let smartConfig = {
        clientId: get(smartOnFhirConfig, 'client_id'),
        scope: get(smartOnFhirConfig, 'scope'),
        redirectUri: get(smartOnFhirConfig, 'redirect_uri'), 
        
        // do these need to be in here?  They're in our settings file...
        launch: get(smartOnFhirConfig, 'launch'),
        code: get(smartOnFhirConfig, 'code'), 
        response_type: get(smartOnFhirConfig, 'response_type'), 
        state: get(smartOnFhirConfig, 'state'), 
        aud: get(smartOnFhirConfig, 'aud')
      }
      // if(has(smartOnFhirConfig, 'client_secret')){
      //   smartConfig.clientSecret = get(smartOnFhirConfig, 'client_secret')
      // }

      if(searchParams.get('iss')){
        // we prefer using an ?iss parameter from the URL
        // this is how we typically launch from the big EHR systems
        smartConfig.iss = searchParams.get('iss')      
        //Session.set('smartOnFhir_iss', searchParams.get('iss'))
      } else if (get(smartOnFhirConfig, 'iss')){
        // if we're testing how the launcher works, we can set the iss in the settings file
        // this is marginally useful in blockchain and multi-tenant hosting environments
        smartConfig.iss = get(smartOnFhirConfig, 'iss');
        //Session.set('smartOnFhir_iss', get(smartOnFhirConfig, 'iss'))
      } else {
        // otherwise, we resort to using a stand-alone app without launch context
        // this is mostly used for HAPI test servers, not Cerner and Epic
        smartConfig.fhirServiceUrl = get(smartOnFhirConfig, 'fhirServiceUrl');
        //Session.set('smartOnFhir_iss', get(smartOnFhirConfig, 'settings.public.smartOnFhir[0].fhirServiceUrl'))
      }

      if(process.env.NODE_ENV === "debug"){
        alert(JSON.stringify(smartConfig))
      } else {
        console.log('EhrLaunchPage.smartConfig', smartConfig);
      }

      
      setSmartConfigString(JSON.stringify(smartConfig, null, 2));
      setSmartConfigObject(smartConfig);
      
      if(get(Meteor, 'settings.public.enableEhrLaunchContext')){
        console.log('EhrLaunchPage - EHR Launch Context is enabled.  Authorizing SMART client.')
        SMART.authorize(smartConfig);
      } else {
        console.log('EhrLaunchPage - EHR Launch Context is disabled.  Skipping SMART.authorize()')
      }

    } else {
      console.log('Hmmm.... no iss parameter in Url...');

      let smartOnFhirConfig;
      if(Array.isArray(get(Meteor, 'settings.public.smartOnFhir'))){
        Meteor.settings.public.smartOnFhir.forEach(function(config){
            if(config.isDefault){
                smartOnFhirConfig = config;
            }
        })
      }
      console.log('EhrLaunchPage.smartOnFhirConfig', smartOnFhirConfig);

      let smartConfig = {
        clientId: get(smartOnFhirConfig, 'client_id'),
        //clientSecret: get(smartOnFhirConfig, 'client_secret'),
        scope: get(smartOnFhirConfig, 'scope'),
        redirectUri: get(smartOnFhirConfig, 'redirect_uri'),
        fhirServiceUrl: get(smartOnFhirConfig, 'fhirServiceUrl')
      }
      console.log('EhrLaunchPage.smartConfig', smartConfig);

      if(get(Meteor, 'settings.public.loggingThreshold') === "trace"){
        alert(JSON.stringify(smartConfig))
      }

      setSmartConfigString(JSON.stringify(smartConfig, null, 2));
      setSmartConfigObject(smartConfig);

      if(get(Meteor, 'settings.public.enableEhrLaunchContext')){
        console.log('EhrLaunchPage - EHR Launch Context is enabled.  Authorizing SMART client.')
        SMART.authorize(smartConfig);
      } else {
        console.log('EhrLaunchPage - EHR Launch Context is disabled.  Skipping SMART.authorize()')
      }
    }
    
  }, []);

  //--------------------------------------------------------------------------------
  // Component Rendering


  let headerHeight = 64;
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    headerHeight = 128;
  }

  let contentToRender;

  return (
    <PageCanvas id='EhrLaunchPage' headerHeight={headerHeight} >
      <Grid container justify="center">
        <Grid item md={6} style={{marginTop: '40px'}}>
          <StyledCard scrollable margin={20} >
            <CardContent style={{textAlign: 'center'}}>
              <CardHeader 
                title={"Welcome to " + get(Meteor, 'settings.public.title')}
                subheader="Please wait as we launch your app."
                style={{width: '100%', textAlign: 'center'}}
              />
            </CardContent>
          </StyledCard>
          <DynamicSpacer />
          <DynamicSpacer />
            <CardHeader title="Received Parameters" />
              <StyledCard>
                <CardContent>
                  <DynamicSpacer />
                  <Alert severity="success">{window.location.search}</Alert>
                  <DynamicSpacer />
                  <Alert severity="info">{smartConfigString}</Alert>
                  <DynamicSpacer />
                  <Grid container spacing={3}>
                    <Grid item md={4}>
                      <TextField 
                        id="response_type" 
                        label="response_type" 
                        variant="standard" 
                        fullWidth
                        disabled
                        defaultValue="code"
                      />
                    </Grid>
                    <Grid item md={4}>
                      <TextField 
                        helperText="Received from app settings file."
                        id="client_id" 
                        label="client_id" 
                        variant="standard" 
                        fullWidth
                        color="info"
                        value={get(smartConfigObject, 'clientId', '')}  
                      />
                    </Grid>
                    <Grid item md={4}>
                      <TextField 
                        id="client" 
                        label="client" 
                        variant="standard" 
                        fullWidth
                        value={searchParams.get('client')}
                      />
                    </Grid>
                    <Grid item md={8}>
                      <TextField 
                        helperText="Received from the EHR system."
                        color="success"
                        id="iss" 
                        label="iss" 
                        variant="standard" 
                        fullWidth
                        value={searchParams.get('iss') ? searchParams.get('iss') : get(smartConfigObject, 'iss', '')}
                      />
                    </Grid>
                    <Grid item md={4}>
                      <TextField 
                        helperText="Received from the EHR system."
                        color="success"
                        id="launch" 
                        label="launch" 
                        variant="standard" 
                        fullWidth
                        value={searchParams.get('launch')}
                      />
                    </Grid>
                    <Grid item md={8}>
                      <TextField 
                        id="aud" 
                        label="aud" 
                        variant="standard" 
                        fullWidth                              
                        value={searchParams.get('aud')}
                      />
                    </Grid>
                    <Grid item md={4}>
                      <TextField 
                        id="code" 
                        label="code" 
                        variant="standard" 
                        fullWidth
                        value={searchParams.get('code')}
                      />
                    </Grid>
                    <Grid item md={8}>
                      <TextField 
                        helperText="Received from app settings file." 
                        color="info"
                        id="redirect_uri" 
                        label="redirect_uri" 
                        variant="standard" 
                        fullWidth
                        value={get(smartConfigObject, 'redirectUri', '')}  
                      />
                    </Grid>
                    <Grid item md={4}>
                      <TextField 
                        id="state" 
                        label="state" 
                        variant="standard" 
                        fullWidth
                        value={searchParams.get('state')}
                      />
                    </Grid>

                    <Grid item md={12}>
                      <TextField 
                        helperText="Received from app settings file." 
                        color="success"                            
                        id="scope" 
                        label="scope" 
                        variant="standard" 
                        fullWidth
                        value={get(smartConfigObject, 'scope', '')}  
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </StyledCard>

              <DynamicSpacer />
              <Card>
                <Alert severity="warning">{JSON.stringify(smartConfigObject, null, 2)}</Alert>
              </Card>
              <DynamicSpacer />
              <Card>
                <Alert severity="warning">SMART on FHIR not enabled.  To enable, set <b>Meteor.settings.public.enableEhrLaunchContext</b> to <b>true</b></Alert>
              </Card>


          {/* <DynamicSpacer />
                    <CardHeader title="Scopes" />
                    <StyledCard>
                      <CardContent>
                        <FormControlLabel
                          control={
                            <Checkbox color="primary" inputProps={{ 'aria-label': 'secondary checkbox' }} checked={get(Meteor, 'settings.public.smartOnFhir[0].scope', '').includes("launch/patient")} />
                          }
                          label="launch/patient"
                          classes={{label: classes.label}}
                        />
                        <Typography variant="body1" style={{marginLeft: '30px'}}>
                          Use this to obtain patient context in apps that use a standalone launch sequence.
                        </Typography>
                        <br />
                        <FormControlLabel
                          control={
                            <Checkbox color="primary" inputProps={{ 'aria-label': 'secondary checkbox' }} checked={get(Meteor, 'settings.public.smartOnFhir[0].scope', '').includes("launch/encounter")} />
                          }
                          label="launch/encounter"
                          classes={{label: classes.label}}
                        />
                        <Typography variant="body1" style={{marginLeft: '30px'}}>
                          Use this to obtain encounter context in apps that use a standalone launch sequence.
                        </Typography>
                        <br />
                        <FormControlLabel
                          control={
                            <Checkbox color="primary" inputProps={{ 'aria-label': 'secondary checkbox' }} checked={get(Meteor, 'settings.public.smartOnFhir[0].scope', '').includes("patient/*.*")} />
                          }
                          label="patient/*.*"
                          classes={{label: classes.label}}
                        />
                        <Typography variant="body1" style={{marginLeft: '30px'}}>
                          Use this to get full access to patient information.
                        </Typography>
                        <br />
                        <FormControlLabel
                          control={
                            <Checkbox color="primary" inputProps={{ 'aria-label': 'secondary checkbox' }} checked={get(Meteor, 'settings.public.smartOnFhir[0].scope', '').includes("user/*.*")} />
                          }
                          label="user/*.*"
                          classes={{label: classes.label}}
                        />
                        <Typography variant="body1" style={{marginLeft: '30px'}}>
                          Use this to get full access to information that the user can access.
                        </Typography>
                        <br />
                        <FormControlLabel
                          control={
                            <Checkbox color="primary" inputProps={{ 'aria-label': 'secondary checkbox' }}checked={get(Meteor, 'settings.public.smartOnFhir[0].scope', '').includes("openid")} />
                          }
                          label="openid"
                          classes={{label: classes.label}}
                        />
                        <Typography variant="body1" style={{marginLeft: '30px'}}>
                          Combine this with fhirUser or profile to get an ID Token and to be able to query information about the current user.
                        </Typography>
                        <br />
                        <FormControlLabel
                          control={
                            <Checkbox color="primary" inputProps={{ 'aria-label': 'secondary checkbox' }} checked={get(Meteor, 'settings.public.smartOnFhir[0].scope', '').includes("profile")} />
                          }
                          label="profile"
                          classes={{label: classes.label}}
                        />
                        <Typography variant="body1" style={{marginLeft: '30px'}}>
                          Combine this with openid to get an ID Token and to be able to query information about the current user.
                        </Typography>
                        <br />
                        <FormControlLabel
                          control={
                            <Checkbox color="primary" inputProps={{ 'aria-label': 'secondary checkbox' }} checked={get(Meteor, 'settings.public.smartOnFhir[0].scope', '').includes("offline_access")} />
                          }
                          label="offline_access"
                          classes={{label: classes.label}}
                        />
                        <Typography variant="body1" style={{marginLeft: '30px'}}>
                          Use this to get a Refresh Token and to be able to use the app for long periods of time without having to re-launch it.
                        </Typography>
                        <br />
                        <FormControlLabel
                          control={
                            <Checkbox color="primary" inputProps={{ 'aria-label': 'secondary checkbox' }} checked={get(Meteor, 'settings.public.smartOnFhir[0].scope', '').includes("online_access")} />
                          }
                          label="online_access"
                          classes={{label: classes.label}}
                        />
                        <Typography variant="body1" style={{marginLeft: '30px'}}>
                          Use this to get a Refresh Token and to be able to use the app for long periods of time without having to re-launch it, as long as the app is not closed.
                        </Typography>
                        <br />                        
                        <FormControlLabel
                          control={
                            <Checkbox color="primary" inputProps={{ 'aria-label': 'secondary checkbox' }} checked={get(Meteor, 'settings.public.smartOnFhir[0].scope', '').includes("fhirUser")} />
                          }
                          label="fhirUser"
                          classes={{label: classes.label}}
                        />
                        <Typography variant="body1" style={{marginLeft: '30px'}}>
                          Combine this with openid to get an ID Token and to be able to query information about the current user.
                        </Typography>
                        <br />                        
                        <FormControlLabel
                          control={
                            <Checkbox color="primary" inputProps={{ 'aria-label': 'secondary checkbox' }} checked={get(Meteor, 'settings.public.smartOnFhir[0].scope', '').includes("smart/orchestrate_launch")} />
                          }
                          label="smart/orchestrate_launch"
                          classes={{label: classes.label}}
                        />
                        <Typography variant="body1" style={{marginLeft: '30px'}}>
                          Use this if your app needs to be able to launch other SMART apps.
                        </Typography>
                        <br />                        
                      </CardContent>
                    </StyledCard> */}

        </Grid>
      </Grid>
    </PageCanvas>
  );
}

export default withStyles(styles, { withTheme: true })(EhrLaunchPage);
