import React, { useContext, useState, useEffect } from "react";

import {
  useLocation
} from "react-router-dom";


import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';

import { get, has } from 'lodash';

import { oauth2 as SMART } from "fhirclient";
// import config from "../config"
import { FhirClientContext } from "../FhirClientContext";
import {
  Grid, 
  Card,
  CardHeader, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  CardActions,
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
import { Alert } from '@mui/lab';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { StyledCard, PageCanvas, FhirUtilities, DynamicSpacer } from 'fhir-starter';

import { Icon } from 'react-icons-kit';
import {star} from 'react-icons-kit/fa/star'
import {ic_file_download} from 'react-icons-kit/md/ic_file_download';
import {fire} from 'react-icons-kit/icomoon/fire';
import {ic_public} from 'react-icons-kit/md/ic_public';
import {ic_people} from 'react-icons-kit/md/ic_people';
import {ic_people_outline} from 'react-icons-kit/md/ic_people_outline';

import { fetch, Headers, Request, Response } from 'meteor/fetch';

import "ace-builds";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";


let configArray = get(Meteor, 'settings.public.smartOnFhir', []);
// console.log('SmartLauncher.configArray', configArray)

//------------------------------------------------------------------------
// Styling

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




//------------------------------------------------------------------------
// Main Component

/**
 * Typically the launch page is an empty page with a `SMART.authorize`
 * call in it.
 *
 * This example demonstrates that the call to authorize can be postponed
 * and called manually. In this case we use ReactRouter which will match
 * the `/launch` path and render our component. Then, after our page is
 * rendered we start the auth flow.
 */
export default function SmartLaunchDebugger(props){
  console.log('SmartLaunchDebugger', props)

    const classes = useStyles();
    // const client = useContext(FhirClientContext);

    let searchParams = new URLSearchParams(useLocation().search);
    
    let [smartConfig, setSmartConfig] = useState(null);
    let [showScopes, setShowScopes] = useState(false);

    useEffect(function(){

      // let searchParams = new URLSearchParams(useLocation().search);

      let fhirconfig = get(Meteor, 'settings.public.smartOnFhir[0]', {})

        const options = {
            clientId: get(fhirconfig, 'client_id'),
            scope: get(fhirconfig, 'scope'),
            redirectUri: get(fhirconfig, 'redirect_uri'),
            fhirServerUrl: get(fhirconfig, 'fhirServerUrl'),
            iss: get(fhirconfig, 'iss'),

            // WARNING: completeInTarget=true is needed to make this work
            // in the codesandbox frame. It is otherwise not needed if the
            // target is not another frame or window but since the entire
            // example works in a frame here, it gets confused without
            // setting this!
            //completeInTarget: true
        }
        // if(get(fhirconfig, 'client_secret')){
        //     options.clientSecret = get(fhirconfig, 'client_secret');
        // }


        // if(fhirconfig.patientId) {
        //     context.setPatientId(fhirconfig.patientId)
        // }

        setSmartConfig(options);


      // if(get(Meteor, 'settings.public.enableEhrLaunchContext')){
      //   if(searchParams){
    
      //     searchParams.forEach(function(value, key){
      //       console.log(key + ': ' + value); 
      //     });
      
      //     if(searchParams.get('aud')){
      //       Session.set('smartOnFhir_aud', searchParams.get('aud'));
      //     }
      //     if(searchParams.get('client')){
      //       Session.set('smartOnFhir_client', searchParams.get('client'));
      //     }
      //     if(searchParams.get('client_id')){
      //       Session.set('smartOnFhir_client_id', searchParams.get('client_id'));
      //     }


      //     if(searchParams.get('iss')){
      //       Session.set('smartOnFhir_iss', searchParams.get('iss'));
      //     }
      //     if(searchParams.get('launch')){
      //       Session.set('smartOnFhir_launch', searchParams.get('launch'));
      //     }
      //     if(searchParams.get('code')){
      //       Session.set('smartOnFhir_code', searchParams.get('code'));
      //     }
      //     if(searchParams.get('scope')){
      //       Session.set('smartOnFhir_scope', searchParams.get('scope'));
      //     }
      
      //     if(searchParams.state){
      //       Session.set('smartOnFhir_state', searchParams.state);
      //     }        
      //   }  
      // }
    }, [])

    // // /**
    // //  * This is configured to make a Standalone Launch, just in case it
    // //  * is loaded directly. An EHR can still launch it by passing `iss`
    // //  * and `launch` url parameters
    // //  */
    // function onChangeProvider(event,context) {
    //     console.log(event.target.value);
    //     const providerKey = event.target.value
    //     const fhirconfig = config[event.target.value]

    //     // // put your client id in .env.local (ignored by .gitignore)
    //     // const secret_client_id = "REACT_APP_CLIENT_ID_" + providerKey
    //     // if( secret_client_id in process.env ) {
    //     //     fhirconfig.client_id = process.env[secret_client_id]
    //     // }

    //     const options = {
    //         clientId: fhirconfig.client_id,
    //         scope: fhirconfig.scope,
    //         redirectUri: fhirconfig.redirectUri,

    //         // WARNING: completeInTarget=true is needed to make this work
    //         // in the codesandbox frame. It is otherwise not needed if the
    //         // target is not another frame or window but since the entire
    //         // example works in a frame here, it gets confused without
    //         // setting this!
    //         //completeInTarget: true
    //     }
    //     if(fhirconfig.client_secret){
    //         options.clientSecret = fhirconfig.client_secret;
    //     }
    //     if( fhirconfig.client_id === 'OPEN' ) {
    //         options.fhirServiceUrl = fhirconfig.url
    //         options.patientId = fhirconfig.patientId
    //     } else {
    //         options.iss = fhirconfig.url
    //     }

    //     if(fhirconfig.patientId) {
    //         context.setPatientId(fhirconfig.patientId)
    //     }

    //     // alert(`options:  ${JSON.stringify(options)}`)
    //     // SMART.authorize(options);
    // }

    async function postSmartAuthConfig (url, data) {
      const response = await fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: new Headers({
              // Authorization: 'Bearer my-secret-key',
              'Content-Type': 'application/json',    
              "x-forwarded-host": "localhost"          
          }),
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      return response.json();
    }

    function handleRowClick(config, event){

        console.log("SMART config:", config)
        console.log("Event.target", event.target.value);


        var searchParams = new URLSearchParams();
        searchParams.set("client_id", config.client_id);
        searchParams.set("scope", config.scope);
        searchParams.set("redirect_uri", config.redirect_uri);
        searchParams.set("iss", config.iss);

        Session.set('smartConfig', config);

        const options = {
          clientId: config.client_id,
          scope: config.scope,
          redirectUri: config.redirect_uri,

          environment: config.environment,
          production: config.production,
          iss: config.iss,
          fhirServiceUrl: config.fhirServiceUrl,

          // WARNING: completeInTarget=true is needed to make this work
          // in the codesandbox frame. It is otherwise not needed if the
          // target is not another frame or window but since the entire
          // example works in a frame here, it gets confused without
          // setting this!
          completeInTarget: true
        }

        if( config.client_id === 'OPEN' ) {
          options.fhirServiceUrl = config.fhirServiceUrl;
          options.patientId = config.patientId;
        } else {
          options.iss = config.fhirServiceUrl;
        }

        if(config.launch_uri){
          let launchUrl = config.launch_uri + '?' + searchParams.toString()
          console.log('SmartLauncher.launchUrl', launchUrl)
  
          if(Meteor.isCordova){
            cordova.InAppBrowser.open(launchUrl, '_self');
          } else {
            window.open(launchUrl, '_self');
          }
        }        
    }

    function renderOptions() {
        let configMenu = [];
        configArray.forEach(function(config, index){     
          console.log('SmartLauncher.config', config)           
          // configMenu.push(<MenuItem value={index}>{config.vendor}</MenuItem>);
          let isDisabled = false;
          let rowStyle = {cursor: 'pointer', color: "black"};

          // if(config.launchContext === "Provider"){
          //     isDisabled = true;
          //     rowStyle.color = "lightgrey"
          // } 

          let currentEnvironment = "meteor";
          if(Meteor.absoluteUrl() === "http://localhost:3000/"){
            currentEnvironment = "localhost"
          }
          
          if(config.launchContext !== "Provider"){
              configMenu.push(
                <TableRow key={index} hover={isDisabled} style={rowStyle} onClick={handleRowClick.bind(this, config)} hover>
                  <TableCell align="left" style={rowStyle}>{index}</TableCell>
                  <TableCell align="left" style={rowStyle}>{config.preferred ? <Icon icon={star} size={18} /> : ""}</TableCell>
                  <TableCell align="left" style={rowStyle}>{config.vendor}</TableCell>
                  <TableCell align="left" style={rowStyle}>{config.environment}</TableCell>
                  <TableCell align="left" style={rowStyle}>{config.production ? <Icon icon={ic_people} size={24} /> : <Icon icon={ic_people_outline} size={24} />}</TableCell>
                  <TableCell align="left" style={rowStyle}>{config.autodownload ? <Icon icon={ic_file_download} size={24} /> : ""}</TableCell>
                  <TableCell align="right" style={rowStyle}>{config.fhirVersion}</TableCell>
              </TableRow>);
            }          
        })

        return configMenu;
    }



    function handleAuthorizeUser(){
      console.log('handleAuthorizeUser');
      SMART.authorize(smartConfig);
    }



    let headerHeight = 84;
    if(get(Meteor, 'settings.public.defaults.prominantHeader')){
        headerHeight = 148;
    }  

    let paddingWidth = 20;

    let authUrl = "https://launch.smarthealthit.org/sample-app?aud=https%3A%2F%2Flaunch.smarthealthit.org%2Fv%2Fr4%2Fsim%2FWzMsIiIsIiIsIkFVVE8iLDAsMCwwLCIiLCIiLCIiLCIiLCIiLCIiLCIiLDAsMV0%2Ffhir"

    let receivedParameterElements = [];
    if(get(window, 'location.search')){
      receivedParameterElements.push(<CardHeader title="Received Parameters" />)
      receivedParameterElements.push(<StyledCard>
        <CardContent>
          <Alert severity="info">{window.location.search}</Alert>
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
                id="client_id" 
                label="client_id" 
                variant="standard" 
                fullWidth
                defaultValue={searchParams.get('client_id')}
              />
            </Grid>
            <Grid item md={4}>
              <TextField 
                id="client" 
                label="client" 
                variant="standard" 
                fullWidth
                defaultValue={searchParams.get('client')}
              />
            </Grid>
            <Grid item md={8}>
              <TextField 
                id="iss" 
                label="iss" 
                variant="standard" 
                fullWidth
                defaultValue={searchParams.get('iss')}
              />
            </Grid>
            <Grid item md={4}>
              <TextField 
                id="launch" 
                label="launch" 
                variant="standard" 
                fullWidth
                defaultValue={searchParams.get('launch')}
              />
            </Grid>
            <Grid item md={8}>
              <TextField 
                id="aud" 
                label="aud" 
                variant="standard" 
                fullWidth
                defaultValue={searchParams.get('aud')}
              />
            </Grid>
            <Grid item md={4}>
              <TextField 
                id="code" 
                label="code" 
                variant="standard" 
                fullWidth
                defaultValue={searchParams.get('code')}
              />
            </Grid>
            <Grid item md={8}>
              <TextField 
                id="redirect_uri" 
                label="redirect_uri" 
                variant="standard" 
                fullWidth
                defaultValue={searchParams.get('redirect_uri')}
              />
            </Grid>
            <Grid item md={4}>
              <TextField 
                id="state" 
                label="state" 
                variant="standard" 
                fullWidth
                defaultValue={searchParams.get('state')}
              />
            </Grid>

            <Grid item md={12}>
              <TextField 
                id="scope" 
                label="scope" 
                variant="standard" 
                fullWidth
                defaultValue={searchParams.get('scope')}
              />
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>)
      receivedParameterElements.push(<DynamicSpacer />);
    } else {
      receivedParameterElements.push(<DynamicSpacer />);
      receivedParameterElements.push(<Card><Alert severity="info">No search parameters specified in URL.</Alert></Card>);
      receivedParameterElements.push(<DynamicSpacer />);
    }


    let scopesElements = [];
    if(showScopes){
      scopesElements.push(<DynamicSpacer />);
      scopesElements.push(<CardHeader title="Scopes" />)
      scopesElements.push(
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
        </StyledCard>
      );
    }



    return (
        <PageCanvas id='SmartLauncher' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth} style={{paddingTop: '128px', paddingBottom: '128px'}} >
            
            <Grid container justify="center" spacing={3}>
                <Grid item xs={12} sm={12} md={6} lg={6} >
                  { receivedParameterElements }
                  <CardHeader title="SMART on FHIR App Settings" subheader="These values are specified in Meteor.settings.public.smartOnFHIR[0]" />
                  <StyledCard>
                    <CardContent>
                      <AceEditor
                        mode="text"
                        theme="github"
                        wrapEnabled={false}
                        // onChange={onUpdateLlmFriendlyNdjsonString}
                        name="smartOnFhirSettings"
                        editorProps={{ $blockScrolling: true }}
                        value={JSON.stringify(get(Meteor, 'settings.public.smartOnFhir'), null, 2)}
                        style={{width: '100%', position: 'relative', height: '200px', minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px', lineHeight: '16px'}}        
                      /> 
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
                              id="client_id" 
                              label="client_id" 
                              variant="standard" 
                              fullWidth
                              defaultValue={get(Meteor, 'settings.public.smartOnFhir[0].client_id', '')}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <TextField 
                              id="client" 
                              label="client" 
                              variant="standard" 
                              fullWidth
                              defaultValue={get(Meteor, 'settings.public.smartOnFhir[0].client_name', '')}
                            />
                          </Grid>
                          <Grid item md={8}>
                            <TextField 
                              id="iss" 
                              label="iss" 
                              variant="standard" 
                              fullWidth
                              defaultValue={get(Meteor, 'settings.public.smartOnFhir[0].iss', '')}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <TextField 
                              id="launch" 
                              label="launch" 
                              variant="standard" 
                              fullWidth
                              defaultValue=""
                            />
                          </Grid>
                          <Grid item md={8}>
                            <TextField 
                              id="fhirServiceUrl" 
                              label="fhirServiceUrl" 
                              variant="standard" 
                              fullWidth
                              defaultValue={get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', '')}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <TextField 
                              id="code" 
                              label="code" 
                              variant="standard" 
                              fullWidth
                              defaultValue=""
                            />
                          </Grid>
                          <Grid item md={8}>
                            <TextField 
                              id="redirect_uri" 
                              label="redirect_uri" 
                              variant="standard" 
                              fullWidth
                              defaultValue={get(Meteor, 'settings.public.smartOnFhir[0].redirect_uri', '')}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <TextField 
                              id="state" 
                              label="state" 
                              variant="standard" 
                              fullWidth
                              defaultValue=""
                            />
                          </Grid>

                          <Grid item md={12}>
                            <TextField 
                              id="scope" 
                              label="scope" 
                              variant="standard" 
                              fullWidth
                              defaultValue={get(Meteor, 'settings.public.smartOnFhir[0].scope', '')}
                            />
                          </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                      <Button color="info" onClick={() => { setShowScopes(!showScopes) }}> 
                        More
                      </Button>
                    </CardActions>
                  </StyledCard>

                    { scopesElements }                  
                    <DynamicSpacer />
                    <Card>
                      <Alert severity="info">{JSON.stringify(smartConfig)}</Alert>
                    </Card>                    
                    <DynamicSpacer />
                    <Button fullWidth variant="contained" color="primary" onClick={handleAuthorizeUser}> 
                      Authorize
                    </Button>
                </Grid>
            </Grid>
        </PageCanvas>
    )
    
}

