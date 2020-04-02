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
// App Session Variables  

if(Meteor.isClient){
  Session.setDefault('mainAppDialogOpen', false);
  Session.setDefault('mainAppDialogTitle', "Conformance Statement");
  Session.setDefault('mainAppDialogContent', false);
}

export default function ScrollDialog() {
  let [open, setOpen] = React.useState(false);
  let [scroll, setScroll] = React.useState('paper');

  open = useTracker(function(){
    return Session.get('mainAppDialogOpen')
  }, []);

  let dialogTitle = "";
  dialogTitle = useTracker(function(){
    return Session.get('mainAppDialogTitle')
  }, []);

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    //setOpen(false);
    Session.set('mainAppDialogOpen', false);
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

  let dialogContent = [...new Array(50)].map(
    () => `Cras mattis consectetur purus sit amet fermentum.  Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
  ).join('\n')

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
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
