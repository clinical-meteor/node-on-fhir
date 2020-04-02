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

// ==============================================================================
// Dynamic Imports 

let dialogComponents = [];
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
  Session.setDefault('mainAppDialogOpen', false);
  Session.setDefault('mainAppDialogTitle', "Conformance Statement");
  Session.setDefault('mainAppDialogContent', false);
  Session.setDefault('mainAppDialogComponent', false);
}

export default function ScrollDialog(props) {
  let [open, setOpen] = React.useState(false);
  let [scroll, setScroll] = React.useState('paper');

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

  let dialogContent = "";
  dialogContent = useTracker(function(){
    let result = "";
    let mainAppDialogContent = Session.get('mainAppDialogContent');
    if(typeof mainAppDialogContent === "string"){
      result = mainAppDialogContent
    } else if(typeof mainAppDialogContent === "object") {
      result = JSON.stringify(mainAppDialogContent, null, 2);
    }

    return result;
  }, [props.lastUpdated]);

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    //setOpen(false);
    Session.set('mainAppDialogOpen', false);
    // Session.set('mainAppDialogContent', false);
    //Session.set('mainAppDialogContentComponent', null);
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
        dialogContentToRender = reference.component;
      }
    })
  } else {
    dialogContentToRender = <pre>
      { dialogContent }
    </pre>
  }


  return (
    <div>
      <Button onClick={handleClickOpen('paper')}>scroll=paper</Button>
      <Button onClick={handleClickOpen('body')}>scroll=body</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          { dialogContentToRender }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
