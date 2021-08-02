import React, { useContext, useState, useEffect } from "react";

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
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  Button
} from '@material-ui/core';

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


let configArray = get(Meteor, 'settings.public.smartOnFhir', []);
console.log('SmartLauncher.configArray', configArray)

//------------------------------------------------------------------------
// Styling

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
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


if(Meteor.isCordova && (typeof cordova === "object")){
  window.open = cordova.InAppBrowser.open;
}

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
export default function Launcher(props){
    const classes = useStyles();
    const client = useContext(FhirClientContext);
    

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
          fhirServiceUrl: config.fhirServiceUrl

          // WARNING: completeInTarget=true is needed to make this work
          // in the codesandbox frame. It is otherwise not needed if the
          // target is not another frame or window but since the entire
          // example works in a frame here, it gets confused without
          // setting this!
          //completeInTarget: true
        }

        // if(fhirconfig.client_secret){
        //     options.clientSecret = fhirconfig.client_secret;
        // }
        if( config.client_id === 'OPEN' ) {
          options.fhirServiceUrl = config.fhirServiceUrl;
          options.patientId = config.patientId;
        } else {
          options.iss = config.fhirServiceUrl;
        }

        if(config.patientId) {
          context.setPatientId(config.patientId)
        }

        console.log("options", options)

        if(config.environment === "node"){

          // Meteor.call('serverSmartAuthorization', options, function(error, result){
          //   if(error){console.log('SmartLauncher.serverSmartAuthorization.error', error)}
          //   if(result){console.log('SmartLauncher.serverSmartAuthorization.result', result)}
          // })
                    
          // // using the HTTP library
          // let launchUrl = Meteor.absoluteUrl() + 'node-launch'
          // console.log('SmartLauncher.launchUrl', launchUrl)
          // HTTP.post(launchUrl, {
          //   data: options,
          //   params: {
          //     "iss": get(options, "iss")
          //   }
          // }, function(error, result){
          //   if(error){console.log('SmartLauncher.serverSmartAuthorization.error', error)}
          //   if(result){console.log('SmartLauncher.serverSmartAuthorization.result', result)}
          // })

          // window.open('/node-launch?' + searchParams.toString(), '_system');
          window.open('/node-launch?' + searchParams.toString(), '_blank');

          // // using the fetch library
          // const results = Meteor.wrapAsync(postSmartAuthConfig(launchUrl, options));
          // console.log('SmartLauncher.serverSmartAuthorization.results', results)

        } else {
          SMART.authorize(options);
        }
    }

    function renderOptions() {
        let configMenu = [];
        configArray.forEach(function(config, index){     
          console.log('config', config)           
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



    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    
    let headerHeight = 84;
    if(get(Meteor, 'settings.public.defaults.prominantHeader')){
        headerHeight = 148;
    }  

    let paddingWidth = 20;

    return (
        <PageCanvas id='SmartLauncher' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth} style={{paddingTop: '128px'}} >
            <Grid container justify="center" spacing={3}>
                <Grid item xs={12} sm={12} md={6} lg={6} >
                    <CardHeader title="Participating Health Networks" />
                    <StyledCard>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Index</TableCell>
                                    <TableCell align="left">Preferred</TableCell>
                                    <TableCell align="left">Vendor</TableCell>
                                    {/* <TableCell align="left">Type</TableCell> */}
                                    {/* <TableCell align="left">Launch Context</TableCell> */}
                                    <TableCell align="left">Environment</TableCell>
                                    <TableCell align="left">Production</TableCell>
                                    <TableCell align="left">Autodownload</TableCell>
                                    <TableCell align="right">FHIR Version</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { renderOptions()}
                            </TableBody>
                        </Table>
                    </StyledCard>
                </Grid>
            </Grid>
        </PageCanvas>
    )
    
}