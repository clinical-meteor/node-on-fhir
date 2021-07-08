import React, { useContext, useState, useEffect } from "react";

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

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
export default function Launcher(){
    const classes = useStyles();
    const client = useContext(FhirClientContext);
    

    // /**
    //  * This is configured to make a Standalone Launch, just in case it
    //  * is loaded directly. An EHR can still launch it by passing `iss`
    //  * and `launch` url parameters
    //  */
    // function onChangeProvider(event,context) {
    //     console.log(event.target.value);
    //     const providerKey = event.target.value
    //     const fhirconfig = config[event.target.value]

    //     // put your client id in .env.local (ignored by .gitignore)
    //     const secret_client_id = "REACT_APP_CLIENT_ID_" + providerKey
    //     if( secret_client_id in process.env ) {
    //         fhirconfig.client_id = process.env[secret_client_id]
    //     }

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

    //     alert(`options:  ${JSON.stringify(options)}`)
    //     SMART.authorize(options);
    // }

    function handleRowClick(config, event){

        console.log("SMART config:", config)
        console.log("Event.target", event.target.value)

        const options = {
            clientId: config.client_id,
            scope: config.scope,
            redirectUri: config.redirect_uri,

            // WARNING: completeInTarget=true is needed to make this work
            // in the codesandbox frame. It is otherwise not needed if the
            // target is not another frame or window but since the entire
            // example works in a frame here, it gets confused without
            // setting this!
            //completeInTarget: true
        }
        if(fhirconfig.client_secret){
            options.clientSecret = fhirconfig.client_secret;
        }
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

        if(config.launchContext === "Patient"){
            SMART.authorize(options);
        }

    }

    function renderOptions() {
        let configMenu = [];
        configArray.forEach(function(config, index){                
            // configMenu.push(<MenuItem value={index}>{config.vendor}</MenuItem>);
            let isDisabled = false;
            let rowStyle = {cursor: 'pointer', color: "black"};

            if(config.launchContext === "Provider"){
                isDisabled = true;
                rowStyle.color = "lightgrey"
            }

            configMenu.push(
                <TableRow key={index} hover={isDisabled} style={rowStyle} onClick={handleRowClick.bind(this, config)}>
                    <TableCell align="left" style={rowStyle}>{index}</TableCell>
                    <TableCell align="left" style={rowStyle}>{config.vendor}</TableCell>
                    <TableCell align="left" style={rowStyle}>{config.type}</TableCell>
                    <TableCell align="left" style={rowStyle}>{config.launchContext}</TableCell>
                    <TableCell align="right" style={rowStyle}>{config.fhirVersion}</TableCell>
                </TableRow>
            );
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

    let paddingWidth = 0;

    return (
        <PageCanvas id='SmartLauncher' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth} style={{paddingTop: '128px'}} >
            <Grid container justify="center" spacing={3}>
                <Grid item xs={12} sm={8} md={6} lg={4} >
                    <CardHeader title="Participating Health Networks" />
                    <StyledCard>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Index</TableCell>
                                    <TableCell align="left">Vendor</TableCell>
                                    <TableCell align="left">Type</TableCell>
                                    <TableCell align="left">Launch Context</TableCell>
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