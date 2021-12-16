// base layout
import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { useTracker } from 'meteor/react-meteor-data';
import CapabilityStatementCheck from '../core/CapabilityStatementCheck';
import ErrorDialog from '../core/ErrorDialog';
import LoginDialog from '../core/LoginDialog';
import SignUpDialog from '../core/SignUpDialog';
import LogoutDialog from '../core/LogoutDialog';

import { get } from 'lodash';

import theme from '../Theme';
import logger from '../Logger';
import useStyles from '../Styles';

// ==============================================================================
// Dynamic Imports 

let dialogComponents = [];

// default dialog component
dialogComponents.push({
  "name": "CapabilityStatementCheck",
  "component": <CapabilityStatementCheck />
}, {
  "name": "ErrorDialog",
  "component": <ErrorDialog />
}, {
  "name": "LoginDialog",
  "component": <LoginDialog />
}, {
  "name": "SignUpDialog",
  "component": <SignUpDialog />
}, {
  "name": "LogoutDialog",
  "component": <LogoutDialog />
});



// dynamic dialog components
Object.keys(Package).forEach(function(packageName){
  if(Package[packageName].DialogComponents){
    // we try to build up a route from what's specified in the package
    Package[packageName].DialogComponents.forEach(function(componentReference){
      dialogComponents.push(componentReference);      
    });    
  }
});


// ==============================================================================
// App Session Variables  

if(Meteor.isClient){
  // console.log('landingModal.open', get(Meteor, 'settings.public.defaults.landingModal.open', false))
  Session.setDefault('mainAppDialogOpen', get(Meteor, 'settings.public.defaults.landingModal.open', false));
  Session.setDefault('mainAppDialogComponent', get(Meteor, 'settings.public.defaults.landingModal.component', false));
  Session.setDefault('mainAppDialogTitle', get(Meteor, 'settings.public.defaults.landingModal.title', "JSON Viewer"));
  Session.setDefault('mainAppDialogJson', false);
  Session.setDefault('mainAppDialogErrorMessage', '');
  Session.setDefault('mainAppDialogErrorShowAgain', true);
  Session.setDefault('mainAppDialogMaxWidth', get(Meteor, 'settings.public.defaults.modals.maxWidth', "xl"));


  Session.setDefault('showDialogTitle', true);
}

export default function ScrollDialog(props) {
  if(typeof logger === "undefined"){
    logger = props.logger;
  }

  // ------------------------------------------------------------
  // Styling

  let classes = useStyles();


  // ------------------------------------------------------------
  // State

  let [open, setOpen] = React.useState(false);
  let [scroll, setScroll] = React.useState('paper');

  let {
    children, 
    appHeight,
    maxWidth,
    ...otherProps
  } = props;

  maxWidth = useTracker(function(){
    return Session.get('mainAppDialogMaxWidth')
  }, []);


  let mainAppDialogOpen = useTracker(function(){
    return Session.get('mainAppDialogOpen')
  }, []);

  if(mainAppDialogOpen){
    open = mainAppDialogOpen
  } else {
    open = false;
  }

  let dialogTitle = "";
  dialogTitle = useTracker(function(){
    return Session.get('mainAppDialogTitle')
  }, []);

  let dialogComponent;
  dialogComponent = useTracker(function(){
    return Session.get('mainAppDialogComponent')
  }, [props.lastUpdated]);

  let jsonContent = "";
  jsonContent = useTracker(function(){
    return Session.get('mainAppDialogJson');
  }, [props.lastUpdated]);

  let errorMessage = "";
  errorMessage = useTracker(function(){
    return Session.get('mainAppDialogErrorMessage')
  }, []);


  let showDialogTitle = useTracker(function(){
    let title = Session.get('mainAppDialogTitle');
    if(title.length === 0){ 
      return false;
    } else {
      return true;      
    }
  }, []);
  

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    //setOpen(false);
    Session.set('mainAppDialogOpen', false);
    Session.set('lastUpdated', new Date())
    // Session.set('mainAppDialogJson', false);
    //Session.set('mainAppDialogJsonComponent', null);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);




  let dialogTitleToRender;
  let dialogContentToRender;
  let dialogActionsToRender;

  if(showDialogTitle){
    dialogTitleToRender = <DialogTitle id="scroll-dialog-title">{dialogTitle}</DialogTitle>
  }

  if(dialogComponent){
    dialogComponents.forEach(function(reference){
      if(reference.name === dialogComponent){
        logger.debug('Found a matching dialog component to render.')
        
        if(get(reference, "component")){
          // did we find a matching component?
          dialogContentToRender = get(reference, "component");

          // we want to pass in the content, so we attach it to the props object
          props.jsonContent = jsonContent;

          // or the error message
          props.errorMessage = errorMessage;

          // and pass the props object into the component that we're going to render in the dialog
          dialogContentToRender = React.cloneElement(
            dialogContentToRender, {jsonContent: jsonContent} 
          );
        }

        if(get(reference, "actions")){
          dialogActionsToRender = React.cloneElement(get(reference, "actions"));
        }
      }
    })
  } else if(jsonContent){
    if(typeof jsonContent === "object") {
      jsonContent = JSON.stringify(jsonContent, null, 2);
    }

    dialogContentToRender = <pre>
      { jsonContent }
    </pre>
  }  






  return (
    <div id="mainDialogContainer">
      <Dialog
        id="mainDialog"
        open={open}
        onClose={handleClose}
        scroll={scroll}
        maxWidth={maxWidth}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        classes={{
          container: classes.mainAppDialogContainer,
          paper: classes.mainAppDialogPaper 
        }}        
        style={{
          marginLeft: '0px', marginRight: '0px', 
          paddingLeft: '0px', paddingRight: '0px'}}
      >        
        { dialogTitleToRender }
        { dialogContentToRender }
        { dialogActionsToRender }        
      </Dialog>
    </div>
  );
}
