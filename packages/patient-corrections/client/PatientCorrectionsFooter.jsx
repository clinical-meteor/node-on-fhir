import React from 'react';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';

import { Button } from '@material-ui/core';

import { get, has } from 'lodash';
import JSON5 from 'json5';

import { useTracker, LayoutHelpers, Locations } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import moment from 'moment';





//========================================================================================================

import {
  fade,
  ThemeProvider,
  MuiThemeProvider,
  withStyles,
  makeStyles,
  createMuiTheme,
  useTheme
} from '@material-ui/core/styles';

  // Global Theming 
  // This is necessary for the Material UI component render layer
  let theme = {
    appBarColor: "#f5f5f5 !important",
    appBarTextColor: "rgba(0, 0, 0, 1) !important",
  }

  // if we have a globally defined theme from a settings file
  if(get(Meteor, 'settings.public.theme.palette')){
    theme = Object.assign(theme, get(Meteor, 'settings.public.theme.palette'));
  }

  const muiTheme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      appBar: {
        main: theme.appBarColor,
        contrastText: theme.appBarTextColor
      },
      contrastThreshold: 3,
      tonalOffset: 0.2
    }
  });


  const buttonStyles = makeStyles(theme => ({
    west_button: {
        cursor: 'pointer',
        justifyContent: 'left',
        color: theme.appBarTextColor,
        marginLeft: '20px',
        marginTop: '15px'
      },
      east_button: {
        cursor: 'pointer',
        justifyContent: 'left',
        color: theme.appBarTextColor,
        right: '20px',
        marginTop: '15px',
        position: 'absolute'
      }
  }));


//============================================================================================================================
// Shared Functions






//============================================================================================================================
// Task Buttons


export function TaskButtons(props){
  const buttonClasses = buttonStyles();

  function initTasks(){
    console.log('Initializing tasks...');

    Meteor.call('Tasks/initialize');    
  }
  function dropTasks(){
    console.log('Initializing tasks...');

    Meteor.call('dropTasks');    
  }
  function toggleChecklist(){
    console.log('Switching between Task History and Checklist modes...');

    Session.toggle('taskChecklistMode')
  }
  return (
    <MuiThemeProvider theme={muiTheme} >
      <Button onClick={ initTasks.bind(this) } className={ buttonClasses.west_button }>
        Initialize Tasks
      </Button>      
      <Button onClick={ dropTasks.bind(this) } className={ buttonClasses.west_button }>
        Drop Tasks
      </Button>
      <Button onClick={ toggleChecklist.bind(this) } className={ buttonClasses.east_button }>
        Toggle Checklist
      </Button>    
    </MuiThemeProvider>
  );
}



