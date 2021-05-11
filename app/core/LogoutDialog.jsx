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
import { HTTP } from 'meteor/http';
import JSON5 from 'json5';

import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import Logout from '../accounts/Logout';




export function LogoutDialog(props){

  const [tabIndex, setTabIndex] = useState(0);

  let { 
    children, 
    id,
    // error,
    errorMessage,
    jsonContent,
    ...otherProps 
  } = props;

  let textToRender = "";
  if(jsonContent && !errorMessage){
    errorMessage = jsonContent;
  }

  // console.log('LogoutDialog', errorMessage)

  if(errorMessage){
    if(typeof errorMessage === "string"){
      textToRender = errorMessage
    } else if(typeof errorMessage === "object") {
      textToRender = JSON.stringify(errorMessage, null, 2);
    }
  }

  function handleTabChange(event, newIndex){
    setTabIndex(newIndex);
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

  // let baseUrl = "";
  // if(get(jsonContent, 'url')){
  //   baseUrl = get(jsonContent, 'url');
  // } else if (get(jsonContent, 'implementation.url')){
  //   baseUrl = get(jsonContent, 'implementation.url');
  // }


  return(
    <DialogContent id={id} className="LogoutDialog" dividers={scroll === 'paper'}>      
      <Logout />
    </DialogContent>
  )
}

LogoutDialog.propTypes = {
  errorMessage: PropTypes.string
}
LogoutDialog.defaultProps = {}


export default LogoutDialog;