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

import jwt from 'jsonwebtoken';

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

export default function SmartAppDebugger(props){
  console.log('SmartAppDebugger', props)

    const classes = useStyles();
    // const client = useContext(FhirClientContext);

    let searchParams = new URLSearchParams(useLocation().search);
    
    let [smartConfig, setSmartConfig] = useState(null);
    let [showScopes, setShowScopes] = useState(false);
    let [serverCapabilityStatement, setServerCapabilityStatement] = useState("");
    let [wellKnownSmartConfig, setWellKnownSmartConfig] = useState("");
    let [smartAccessToken, setSmartAccessToken] = useState("");
    let [fhirPatient, setFhirPatient] = useState("");
    

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

        fetchCapabilityStatement();
        
    
    }, [])



    function fetchCapabilityStatement(){
      console.log('fetchCapabilityStatement');

      HTTP.get(get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', '') + "/metadata?_format=json", {}, function(error, result){ 
        if(error){
          console.error('HTTP.get /metadata error', error)
        }
        if(result){
          console.log('HTTP.get /metadata result', result)
          let parsedData;
          if(get(result, 'data')){
            setServerCapabilityStatement(result.data);
            fetchWellKnownSmartConfig();
          } else if (get(result, 'content')) {
            setServerCapabilityStatement(JSON.parse(get(result, 'content')));
            fetchWellKnownSmartConfig();
          }
        }
      });
    }
    function fetchWellKnownSmartConfig(callback){
      console.log('fetchWellKnownSmartConfig');

      HTTP.get(get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', '') + "/.well-known/smart-configuration", {}, function(error, result){
        if(error){
          console.error('HTTP.get /.well-known/smart-configuration error', error)
        }
        if(result){
          console.log('HTTP.get /.well-known/smart-configuration result', result)
          setWellKnownSmartConfig(get(result, 'data'));
          exchangeCodeForAccessToken(get(result, 'data'));
        }
      });
    }
    function exchangeCodeForAccessToken(wellKnownSmartConfig){
      console.log('exchangeCodeForAccessToken')
      console.log('exchangeCodeForAccessToken.url', get(wellKnownSmartConfig, 'token_endpoint'))

      let stringEncodedData = "grant_type=authorization_code&code=" + searchParams.get('code') + '&redirect_uri=' + encodeURIComponent(get(Meteor, 'settings.public.smartOnFhir[0].redirect_uri', '')) + '&client_id=' + get(Meteor, 'settings.public.smartOnFhir[0].client_id', '')
      console.log('exchangeCodeForAccessToken.stringEncodedData', stringEncodedData);
      let payload = {
        code: searchParams.get('code'),
        grant_type: 'authorization_code',
        redirect_uri: encodeURIComponent(get(Meteor, 'settings.public.smartOnFhir[0].redirect_uri', '')),
        client_id: get(Meteor, 'settings.public.smartOnFhir[0].client_id', '')
      }
      console.log('exchangeCodeForAccessToken.code', searchParams.get('code'))
      console.log('exchangeCodeForAccessToken.code', payload)
      
      HTTP.post(get(wellKnownSmartConfig, 'token_endpoint'), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        content: stringEncodedData
      }, function(error, result){
        if(error){
          console.error('HTTP.post /token error', error)
        }
        if(result){
          console.log('HTTP.post /token result', result)
          setSmartAccessToken(get(result, 'data'));

          fetchPatient(get(result, 'data.patient'), get(result, 'data.access_token'));
        }
      });
    }
    function fetchPatient(patientId, accessToken){
      console.log('fetchPatient')
      console.log('fetchPatient.url', get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', '') + "/Patient")
      console.log('fetchPatient.url', accessToken)

      HTTP.get(get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', '') + "/Patient/" + patientId + "?_format=json", {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      }, function(error, result){
        if(error){
          console.error('HTTP.get /Patient error', error)
        }
        if(result){
          console.log('HTTP.get /Patient result', result)
          if(get(result, 'data')){
            setFhirPatient(get(result, 'data'));
          } else if (get(result, 'content')) {
            setFhirPatient(JSON.parse(get(result, 'content')));
          }
        }
      });
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
      receivedParameterElements.push(<CardHeader title="Received Parameters" subheader="Parameters that are pased in via URL during the application redirect process." />)
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
      receivedParameterElements.push(<StyledCard>
        <CardContent>
          <AceEditor
            mode="text"
            theme="github"
            wrapEnabled={true}
            style={{width: '100%', position: 'relative', height: '200px', minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px', lineHeight: '16px'}}
            defaultValue={searchParams.get('code')}
          />
          <DynamicSpacer />
          <Grid container>
            <Grid md={12}>
              <TextField 
                id="response_type" 
                label="header" 
                variant="standard" 
                fullWidth
                disabled
                defaultValue={searchParams.get('code').split('.')[0]}
              />
              <DynamicSpacer />
              <TextField 
                id="response_type" 
                label="payload" 
                variant="standard" 
                fullWidth
                disabled
                defaultValue={searchParams.get('code').split('.')[1]}
              />
              <DynamicSpacer />
              <TextField 
                id="response_type" 
                label="signature" 
                variant="standard" 
                fullWidth
                disabled
                defaultValue={searchParams.get('code').split('.')[2]}
              />

            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>)
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



    let fhirServer = get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', '')
    if(get(Meteor, 'settings.public.smartOnFhir[0].iss')){
      fhirServer = get(Meteor, 'settings.public.smartOnFhir[0].iss', '')
    }
    fhirServer = fhirServer + "/metadata?_format=json";

    return (
        <PageCanvas id='SmartLauncher' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth} style={{paddingTop: '128px', paddingBottom: '128px'}} >
            
            <Grid container spacing={3} style={{width: '100%'}}>
              <Grid item xs={3} sm={3} md={3} lg={3} >
                
                <CardHeader title="Default App Settings" subheader="These are the parameters for the SMART on FHIR protocol, as specified in Meteor.settings.public.smartOnFHIR[0]" />
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
                    <Button color="primary" onClick={() => { setShowScopes(!showScopes) }}> 
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
              <Grid item xs={3} sm={3} md={3} lg={3} >
                { receivedParameterElements }
              </Grid>
              <Grid item xs={3} sm={3} md={3} lg={3} >
                <CardHeader title="Server Capability Statement" subheader="These values are specified in Meteor.settings.public.smartOnFHIR[0]" />
                <StyledCard>
                  <CardContent>
                    <TextField 
                      id="server_url" 
                      label="server_url" 
                      variant="standard" 
                      fullWidth
                      disabled
                      defaultValue={get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', '') + "/metadata?_format=json"}
                    />
                    <DynamicSpacer />
                    <AceEditor
                      mode="text"
                      theme="github"
                      wrapEnabled={false}
                      // onChange={onUpdateLlmFriendlyNdjsonString}
                      name="smartOnFhirSettings"
                      editorProps={{ $blockScrolling: true }}
                      value={JSON.stringify(serverCapabilityStatement, null, 2)}
                      style={{width: '100%', position: 'relative', height: '400px', minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px', lineHeight: '16px'}}        
                    />                   
                  </CardContent>
                  <CardActions>
                    <Button color="primary" onClick={fetchCapabilityStatement}> 
                      Fetch Server Metadata
                    </Button>
                  </CardActions>
                </StyledCard>
              </Grid>
              <Grid item xs={3} sm={3} md={3} lg={3} >
                <CardHeader title=".well-known/smart-configuration" subheader="These values are specified in Meteor.settings.public.smartOnFHIR[0]" />
                <StyledCard>
                  <CardContent>
                    <TextField 
                      id="server_url" 
                      label="server_url" 
                      variant="standard" 
                      fullWidth
                      disabled
                      defaultValue={get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', '') + "/.well-known/smart-configuration"}
                    />
                    <DynamicSpacer />
                    <AceEditor
                      mode="text"
                      theme="github"
                      wrapEnabled={false}
                      // onChange={onUpdateLlmFriendlyNdjsonString}
                      name="smartOnFhirSettings"
                      editorProps={{ $blockScrolling: true }}
                      value={JSON.stringify(wellKnownSmartConfig, null, 2)}
                      style={{width: '100%', position: 'relative', height: '400px', minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px', lineHeight: '16px'}}        
                    />                   
                  </CardContent>
                  <CardActions>
                    <Button color="primary" onClick={fetchWellKnownSmartConfig}> 
                      Fetch SMART Config
                    </Button>
                  </CardActions>
                </StyledCard>
                <DynamicSpacer />
                <StyledCard>
                  <CardContent>
                    <TextField 
                      id="server_url" 
                      label="server_url" 
                      variant="standard" 
                      fullWidth
                      value={wellKnownSmartConfig ? get(wellKnownSmartConfig, 'token_endpoint') : ''}
                    />
                    <DynamicSpacer />
                    <TextField 
                      id="grant_type" 
                      label="grant_type" 
                      variant="standard" 
                      fullWidth
                      disabled
                      value={"authorization_code"}
                    />
                    <DynamicSpacer />
                    <TextField 
                      id="code" 
                      label="code" 
                      variant="standard" 
                      fullWidth
                      value={searchParams.get('code')}
                    />
                    <DynamicSpacer />
                    <TextField 
                      id="redirect_uri" 
                      label="redirect_uri" 
                      variant="standard" 
                      fullWidth
                      value={encodeURIComponent(get(Meteor, 'settings.public.smartOnFhir[0].redirect_uri', ''))}
                    />
                    <DynamicSpacer />
                    <TextField 
                      id="client_id" 
                      label="client_id" 
                      variant="standard" 
                      fullWidth
                      value={get(Meteor, 'settings.public.smartOnFhir[0].client_id', '')}
                    />
                    <DynamicSpacer />
                    <TextField 
                      id="payload" 
                      label="payload" 
                      variant="standard" 
                      fullWidth
                      value={"grant_type=authorization_code&code=" + searchParams.get('code') + '&redirect_uri=' + encodeURIComponent(get(Meteor, 'settings.public.smartOnFhir[0].redirect_uri', '')) + '&client_id=' + get(Meteor, 'settings.public.smartOnFhir[0].client_id', '')}
                    />
                  </CardContent>
                  <CardActions>
                    <Button color="primary" onClick={exchangeCodeForAccessToken}>Exchange code for access token</Button>
                  </CardActions>
                </StyledCard>
              </Grid>              
            </Grid>
            <DynamicSpacer />
            <hr />
            <DynamicSpacer />
            <Grid container spacing={3}>
              <Grid item xs={3} sm={3} md={3} lg={3} >
                  <CardHeader title="Access Token Response"  />
                  <StyledCard>
                    <CardContent>
                      <AceEditor
                        mode="text"
                        theme="github"
                        wrapEnabled={false}
                        // onChange={onUpdateLlmFriendlyNdjsonString}
                        name="smartOnFhirSettings"
                        editorProps={{ $blockScrolling: true }}
                        value={JSON.stringify(smartAccessToken, null, 2)}
                        style={{width: '100%', position: 'relative', height: '200px', minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px', lineHeight: '16px'}}        
                      />                   
                    </CardContent>
                    <CardActions>
                      <Button color="primary" onClick={fetchPatient}> 
                        Fetch Patient
                      </Button>
                    </CardActions>
                  </StyledCard>
              </Grid>
              <Grid item xs={3} sm={3} md={3} lg={3} >
                  <CardHeader title="FHIR Patient"  />
                  <StyledCard>
                    <CardContent>
                      <AceEditor
                        mode="text"
                        theme="github"
                        wrapEnabled={false}
                        // onChange={onUpdateLlmFriendlyNdjsonString}
                        name="smartOnFhirSettings"
                        editorProps={{ $blockScrolling: true }}
                        value={JSON.stringify(fhirPatient, null, 2)}
                        style={{width: '100%', position: 'relative', height: '200px', minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px', lineHeight: '16px'}}        
                      />                   
                    </CardContent>
                  </StyledCard>
              </Grid>
            </Grid>
        </PageCanvas>
    )
    
}

