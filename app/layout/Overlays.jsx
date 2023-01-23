// base layout
import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { useTracker } from 'meteor/react-meteor-data';
import CapabilityStatementCheck from '../core/CapabilityStatementCheck';
import ErrorDialog from '../core/ErrorDialog';

import { get } from 'lodash';

import {
  makeStyles,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Grid,
  TextField,
  CardActions,
  Button,
} from '@material-ui/core';

// ==============================================================================
// Dynamic Imports 

let contextComponents = [];

// default dialog component
contextComponents.push({
  "name": "ErrorDialog",
  "component": <ErrorDialog />
});

// console.log('contextComponents', contextComponents)



// dynamic dialog components
Object.keys(Package).forEach(function(packageName){
  if(Package[packageName].DialogComponents){
    // we try to build up a route from what's specified in the package
    Package[packageName].DialogComponents.forEach(function(componentReference){
      contextComponents.push(componentReference);      
    });    
  }
});


// ==============================================================================
// App Session Variables  

if(Meteor.isClient){
  // console.log('landingModal.open', get(Meteor, 'settings.public.defaults.landingModal.open', false))
  Session.setDefault('contextOpen', get(Meteor, 'settings.public.defaults.contextMenu.open', false));
  Session.setDefault('contextComponent', get(Meteor, 'settings.public.defaults.contextMenu.component', false));
  Session.setDefault('contextTitle', get(Meteor, 'settings.public.defaults.contextMenu.title', "Context Menu"));
  Session.setDefault('contextJson', false);
  Session.setDefault('contextErrorMessage', '');
  Session.setDefault('contextErrorShowAgain', true);
}

export function ContextSlideOut(props) {
  let [open, setOpen] = React.useState(false);
  let [scroll, setScroll] = React.useState('paper');

  let {
    children, 
    logger, 
    ...otherProps
  } = props;






  let contextOpen = useTracker(function(){
    return Session.get('contextOpen')
  }, []);

  if(contextOpen){
    open = contextOpen
  } else {
    open = false;
  }

  let dialogTitle = "";
  dialogTitle = useTracker(function(){
    return Session.get('contextTitle')
  }, []);

  let contextComponent;
  contextComponent = useTracker(function(){
    return Session.get('contextComponent')
  }, [props.lastUpdated]);


  let errorMessage = "";
  errorMessage = useTracker(function(){
    return Session.get('contextErrorMessage')
  }, []);

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const slideOutCardsVisible = useTracker(function(){
    return Session.get('slideOutCardsVisible')
  }, []);

  console.log('slideOutCardsVisible', slideOutCardsVisible)

  let overlayContainerStyle = {
    position: 'fixed',
    top: '0px',
    left: '0px',
    height: '100%', 
    width: '100%'
  }

  let overlayStyle = {
    position: 'absolute',
    float: 'right',    
    top: '128px',
    right: '73px',
    height: window.innerHeight - 64 + 'px',
    width: '400px',
    transition: '.6s'
  }

  if(slideOutCardsVisible){
    overlayStyle.right = '-473px';
  }


  let contextContentToRender;
  if(contextComponent){
    contextComponents.forEach(function(reference){
      if(reference.name === contextComponent){
        console.debug('Found a matching dialog component to render.')
        
        // did we find a matching component?
        contextContentToRender = reference.component;

        // we want to pass in the content, so we attach it to the props object
        props.jsonContent = jsonContent;

        // or the error message
        props.errorMessage = errorMessage;

        // and pass the props object into the component that we're going to render in the dialog
        contextContentToRender = React.cloneElement(
          contextContentToRender, {jsonContent: jsonContent} 
        );
      }
    })
  } 
  return (
    <div id='contextCardsContainer' style={overlayContainerStyle}>
      <Card id='contextCards' style={overlayStyle}>
        { contextContentToRender }
      </Card>
    </div>
  )
}

export default ContextSlideOut;