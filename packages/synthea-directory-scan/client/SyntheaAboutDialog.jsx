import React, { useState, useEffect, useCallback } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';


import { 
  Button, 
  Grid, 
  Typography,
} from '@material-ui/core';



import { get } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';
import JSON5 from 'json5';

import moment from 'moment';

import {github} from 'react-icons-kit/icomoon/github'
import { Icon } from 'react-icons-kit'

import { PageCanvas, StyledCard, PatientTable } from 'material-fhir-ui';
import { useTracker } from 'meteor/clinical:hl7-fhir-data-infrastructure';

let appVersion = get(Meteor, 'settings.public.appVersion', 'v0.0.0')

function DynamicSpacer(props){
  return <br className="dynamicSpacer" style={{height: '40px'}}/>;
}

//==============================================================================================
// THEMING

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  githubIcon: {
    margin: '0px'
  }
}));

//==============================================================================================
// MAIN COMPONENT

Session.setDefault('directoryScanUrl', get(Meteor, 'settings.public.defaults.landingModal.sourceCodeUrl', '/'))
function SyntheaAboutDialog(props){

  // let [readyToImport, setReadyToImport] = useState(false);


  let directoryUrl = useTracker(function(){
    return Session.get('directoryScanUrl')
  }, [])

  

  let welcomeMessageText = get(Meteor, 'settings.public.defaults.landingModal.welcomeMessageText', 'Please set the default message text in the Meteor.settings file.');
  let directoryScanUrl = get(Meteor, 'settings.public.defaults.landingModal.sourceCodeUrl', '/');

  let queueToggleText = "Scan Directory";
  let queueButtonColor = "default";

  function scanDirectory(){
    console.log('Asking app server to scan directory...', Session.get('directoryScanUrl'))

    Meteor.call('scanDirectory', Session.get('directoryScanUrl'))
  }
  function cancelBtn(){
    console.log('Cancel')
  }
  function handleKeyClick(event){
    console.log('Ooooh, that was a click.', event.target.value)
    Session.set('directoryScanUrl', event.target.value)
  }
  
  return (
    <DialogContent dividers={scroll === 'paper'} style={{minWidth: '600px', fontSize: '120%'}}>
      { welcomeMessageText }    
      <TextField 
        id="standard-basic" 
        // label={sourceCodeUrl}
        defaultValue={directoryScanUrl}
        onChange={handleKeyClick.bind(this)}    
        color='primary'    
        fullWidth
      />
      <DynamicSpacer />
      <DynamicSpacer />
      <Grid container>
        <Grid item md={10} style={{paddingRight: '10px'}}>
          <Button id="scanDirectoryBtn" fullWidth variant="contained" color='primary' onClick={scanDirectory.bind(this)} >{queueToggleText}</Button>                   
        </Grid>
        <Grid item md={2} style={{paddingLeft: '10px'}}>
          <Button id="cancelBtn" fullWidth variant="contained" onClick={cancelBtn.bind(this)} >Clear</Button>             
        </Grid>
      </Grid>
      <DynamicSpacer />
    </DialogContent>
  );
}




export default SyntheaAboutDialog;