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

import { useTracker, withTracker } from './Tracker';
import CapabilityStatementCheck from '../core/CapabilityStatementCheck';
import ErrorDialog from '../core/ErrorDialog';

import { get } from 'lodash';

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
})

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
}

export default function ScrollDialog(props) {
  let [open, setOpen] = React.useState(false);
  let [scroll, setScroll] = React.useState('paper');

  let {
    children, 
    logger, 
    appHeight,
    ...otherProps
  } = props;

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
    // let result = "";
    // let mainAppDialogJson = Session.get('mainAppDialogJson');
    // if(typeof mainAppDialogJson === "string"){
    //   result = mainAppDialogJson
    // } else if(typeof mainAppDialogJson === "object") {
    //   result = JSON.stringify(mainAppDialogJson, null, 2);
    // }

    // return result;
  }, [props.lastUpdated]);

  let errorMessage = "";
  errorMessage = useTracker(function(){
    return Session.get('mainAppDialogErrorMessage')
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


  let dialogContentToRender;
  if(dialogComponent){
    dialogComponents.forEach(function(reference){
      if(reference.name === dialogComponent){
        logger.debug('Found a matching dialog component to render.')
        
        // did we find a matching component?
        dialogContentToRender = reference.component;

        // we want to pass in the content, so we attach it to the props object
        props.jsonContent = jsonContent;

        // or the error message
        props.errorMessage = errorMessage;

        // and pass the props object into the component that we're going to render in the dialog
        dialogContentToRender = React.cloneElement(
          dialogContentToRender, {jsonContent: jsonContent} 
        );
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
    <div>
      {/* <Button onClick={handleClickOpen('paper')}>scroll=paper</Button>
      <Button onClick={handleClickOpen('body')}>scroll=body</Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{dialogTitle}</DialogTitle>
        { dialogContentToRender }
        {/* <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}
