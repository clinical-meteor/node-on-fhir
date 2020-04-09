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

  // these are the default resource types our app supports
  let capabilityInquiryResourceTypes = get(Meteor, "settings.public.capabilityStatement.resourceTypes", ["AllergyIntolerance", "CarePlan", "Condition", "Device", "DiagnosticReport", "Immunizatoin", "MedicationOrder", "Observation", "Organization", "Patient", "Procedure"]);

  let canSearch = {};
  let interactionsManifest = {};
  let isSupported = {};

  capabilityInquiryResourceTypes.forEach(function(resourceType){
    canSearch[resourceType] = false
    isSupported[resourceType] = false;
  })


  console.log('CapabilityStatementCheck is parsing a JSON object it was given.', jsonContent)
  if(get(jsonContent, 'resourceType') === "CapabilityStatement"){
    console.log('Found CapabilityStatement');
    if(get(jsonContent, 'rest[0].mode') === "server"){
      console.log('CapabilityStatement claims it is a server.');
      if(Array.isArray(get(jsonContent, 'rest[0].resource'))){
        let resourceArray = get(jsonContent, 'rest[0].resource');
        console.log('Loading resource array from CapabilityStatement.');

        resourceArray.forEach(function(resource){
          // console.log('Found the following ' + get(resource, 'type') + ' data in the CapabilityStatement.');          
          capabilityInquiryResourceTypes.forEach(function(inquiryResourceType){
            // console.log("Does this match? " + inquiryResourceType)
            if(get(resource, 'type') === inquiryResourceType){
              // console.log('Resource type matches one of the types that we are inquiring about.')
              interactionsManifest[inquiryResourceType] = get(resource, 'interaction');
              // console.log('Getting interactions manifest for ' + inquiryResourceType)
              interactionsManifest[inquiryResourceType].forEach(function(interaction){
                if(interaction.code === "read"){
                  canSearch[inquiryResourceType] = true;
                }
              })
            }
          })
        })
      }
    }
  }
  console.log("Result of parsing through the CapabilityStatement.  These are the ResourceTypes we can search for", canSearch);

  let statementBlock = [];
  capabilityInquiryResourceTypes.forEach(function(resourceType, index){
    if(canSearch[resourceType]){
      if(isSupported[resourceType]){
        statementBlock.push(<div style={{color: 'red'}} key={'capability-' + index}>𐄂 Server doesn't support {resourceType}</div>)
      } else {
        statementBlock.push(<div style={{color: 'green'}} key={'capability-' + index}>✓ Server does support {resourceType}</div>)
      }
    }
  })
  console.log("Default statements", statementBlock)



  return(
    <DialogContent id={id} className="CapabilityStatementCheck" style={{minWidth: '600px'}} dividers={scroll === 'paper'}>
        <Tabs value={tabIndex} onChange={handleTabChange.bind(this)} aria-label="simple tabs example">
          <Tab label="Parsed" value={0} />
          <Tab label="Raw Text" value={1} />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          { statementBlock }
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