import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import { 
  Card,
  CardHeader,
  CardContent,
  Button,
  Tab, 
  Tabs,
  Typography,
  Box,
} from '@material-ui/core';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import { get, has } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';
import JSON5 from 'json5';

import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';


//=============================================================================================================================================
// TABS

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
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

export function CapabilityStatementCheck(props){

  const [tabIndex, setTabIndex] = useState(0);

  let { 
    children, 
    id,
    jsonContent,
    ...otherProps 
  } = props;

  let textToRender = "";

  if(jsonContent){
    if(typeof jsonContent === "string"){
      textToRender = jsonContent
    } else if(typeof jsonContent === "object") {
      textToRender = JSON.stringify(jsonContent, null, 2);
    }
  }

  function handleTabChange(event, newIndex){
    setTabIndex(newIndex);
  }

  // --------------------------------------------------------------------------------------------------------------------------------
  // REST Interactions

  // these are the default resource types our app supports
  let capabilityInquiryResourceTypes = get(Meteor, "settings.public.capabilityStatement.resourceTypes", ["AllergyIntolerance", "CarePlan", "Condition", "Device", "DiagnosticReport", "Encounter", "Immunization", "MedicationOrder", "Observation", "Organization", "Patient", "Procedure"]);

  let canSearch = {};
  let isSupported = {};

  capabilityInquiryResourceTypes.forEach(function(resourceType){
    canSearch[resourceType] = false
    isSupported[resourceType] = false;
  })

  console.log('CapabilityStatementCheck is parsing a JSON object it was given.', jsonContent)
  canSearch = FhirUtilities.parseCapabilityStatement(jsonContent);
  console.log("Result of parsing through the CapabilityStatement.  These are the ResourceTypes we can search for ", canSearch);

  let statementBlock = [];
  capabilityInquiryResourceTypes.forEach(function(resourceType, index){
    if(canSearch[resourceType]){
      statementBlock.push(<div style={{color: 'green'}} key={'capability-' + index}>✓ Server does support {resourceType}</div>)
    } else {
      statementBlock.push(<div style={{color: 'red'}} key={'capability-' + index}>𐄂 Server doesn't support {resourceType}</div>)
    }
  })
  console.log("Default statements", statementBlock)


  // --------------------------------------------------------------------------------------------------------------------------------
  // OAuth / Authentication

  // json doesn't actually specify the ordering of 
  let oauthExtensions = get(jsonContent, 'rest[0].security.extension[0].extension');
  let authorizeUrl = "https://";
  let tokenUrl = "https://";

  if(Array.isArray(oauthExtensions)){
    console.log('oauthExtensions', oauthExtensions);

    oauthExtensions.forEach(function(object){
        console.log('Security Object: ', object)
        if(object.url === "authorize") {
            authorizeUrl = object.valueUri;          
        }
        if(object.url === "token"){
            tokenUrl = object.valueUri                      
        }
    });  
  } else {
    console.log('Couldnt find security extentions in capability statement.')
  }

  // --------------------------------------------------------------------------------------------------------------------------------
  // Rendering


  let labelRowStyle = {
    clear: 'both'
  }
  let labelStyle = {
    float: 'left',
    width: '160px',
    margin: '0px'
  }
  let valueStyle = {
    float: 'left',
    whiteSpace: 'pre',
    textOverflow: 'ellipsis',
    position: 'absolute'
  }
  let blockStyle = {
    clear: 'both'
  }
  let separatorStyle = {
    marginTop: '40px', 
    marginBottom: '20px', 
    clear: 'both',
    height: '2px'
  }

  let baseUrl = "";
  if(get(jsonContent, 'url')){
    baseUrl = get(jsonContent, 'url');
  } else if (get(jsonContent, 'implementation.url')){
    baseUrl = get(jsonContent, 'implementation.url');
  }


  return(
    <DialogContent id={id} className="CapabilityStatementCheck" style={{minWidth: '600px'}} dividers={scroll === 'paper'}>
        <Tabs value={tabIndex} onChange={handleTabChange.bind(this)} aria-label="simple tabs example">
          <Tab label="Parsed" value={0} />
          <Tab label="Raw Text" value={1} />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
        <div style={labelRowStyle}><h4 style={labelStyle}>Base URL:</h4><span style={valueStyle}>{baseUrl}</span></div>

          <hr style={separatorStyle} />
          <div style={labelRowStyle}><h4 style={labelStyle}>Publisher:</h4><span style={valueStyle}>{get(jsonContent, 'publisher')}</span></div>
          <div style={labelRowStyle}><h4 style={labelStyle}>Software:</h4><span style={valueStyle}>{get(jsonContent, 'software.name')}</span></div>
          <div style={labelRowStyle}><h4 style={labelStyle}>Version:</h4><span style={valueStyle}>{get(jsonContent, 'software.version')}</span></div>
          <div style={labelRowStyle}><h4 style={labelStyle}>FHIR Version:</h4><span style={valueStyle}>{get(jsonContent, 'fhirVersion')}</span></div>

          <hr style={separatorStyle} />
          <div style={labelRowStyle}><h4 style={labelStyle}>Authentication:</h4><span style={valueStyle}>{authorizeUrl}</span></div>
          <div style={labelRowStyle}><h4 style={labelStyle}>Token:</h4><span style={valueStyle}>{tokenUrl}</span></div>

          <hr style={separatorStyle} />
          <div style={labelRowStyle}><h4 style={{margin: '10px', float: 'left'}}>REST Interactions</h4></div>
          <div style={{clear: 'both', margiTop: '20px', marginBottom: '10px'}}>
            { statementBlock }
          </div>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <pre>
            { textToRender }
          </pre>
        </TabPanel>
    </DialogContent>
  )
}

CapabilityStatementCheck.propTypes = {}
CapabilityStatementCheck.defaultProps = {}


export default CapabilityStatementCheck;