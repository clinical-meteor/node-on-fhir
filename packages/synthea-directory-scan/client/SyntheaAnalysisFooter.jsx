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


export function SyntheaAnalysisFooter(props){
  const buttonClasses = buttonStyles();

  function scanDirectory(){
    console.log('Scanning directory...');

    Session.set('mainAppDialogOpen', true)
  }
  function dropEverything(){
    console.log('Dropping the database.');

    if(confirm("Are you sure?")){
      Meteor.call('dropDatabase');     
    }
  }

  let scanDirectoryBtn;
  if(get(Meteor, 'settings.public.synthea.showScanDirectoryButton')){
    scanDirectoryBtn = <Button onClick={ scanDirectory.bind(this) } className={ buttonClasses.west_button }>
      Scan Synthea Directory
    </Button>
  }
  let clearDatabaseBtn;
  if(get(Meteor, 'settings.public.synthea.showScanDirectoryButton')){
    scanDirectoryBtn = <Button onClick={ dropEverything.bind(this) } className={ buttonClasses.west_button }>
      Clear Database
    </Button>
  }

  return (
    <MuiThemeProvider theme={muiTheme} >
      { scanDirectoryBtn }
      { clearDatabaseBtn }
    </MuiThemeProvider>
  );
}



