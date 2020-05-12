import React from 'react';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';

import { Button } from '@material-ui/core';

import { get } from 'lodash';
import JSON5 from 'json5';

import ReportingMethods from '../lib/ReportingMethods';



// =========================================================================================
// HELPER FUNCTIONS


// function isFhirServerThatRequiresApiKey(){
//   if(["https://syntheticmass.mitre.org/v1/fhir"].includes(get(Meteor, 'settings.public.interfaces.default.channel.endpoint'))){
//     return true;
//   } else {
//     return false
//   }
// }


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
      color: theme.palette.appBar.contrastText,
      marginLeft: '20px',
      marginTop: '15px'
    },
    east_button: {
      cursor: 'pointer',
      justifyContent: 'left',
      color: theme.palette.appBar.contrastText,
      right: '20px',
      marginTop: '15px',
      position: 'absolute'
    }
  }));


//============================================================================================================================
// FETCH






export function ReportingButtons(props){
  const buttonClasses = buttonStyles();

  function initializeMeasures(){
    console.log('Initializing Measures');

    ReportingMethods.initializeSampleMeasure();
    ReportingMethods.initializeSampleMeasureReport();
    // LocationMethods.initializeHospitals();
  }
  return (
    <MuiThemeProvider theme={muiTheme} >
      <Button onClick={ initializeMeasures.bind() } className={ buttonClasses.west_button }>
        Initialize Measures
      </Button>      
    </MuiThemeProvider>
  );
}





//============================================================================================================================
// Organizations

export function OrganizationsButtons(props){
  const buttonClasses = buttonStyles();

  function toggleLayout(){
    console.log('toggleLayout!');

    Session.toggle('OrganizationsPage.onePageLayout')
  }
  function initializeOrganizations(){
    console.log('Initialize Medicare Hospitals!');

    // ReportingMethods.initializeMedicareInpatientFacilities();
    Meteor.call('initializeMedicareInpatientFacilities')
  }
  return (
    <div>
      <Button className={buttonClasses.west_button} onClick={ initializeOrganizations.bind(this) } >
        Initialize Medicare Hospitals
      </Button>
      <Button className={buttonClasses.west_button} onClick={ toggleLayout.bind(this) } >
        Toggle Layout Screen
      </Button>
    </div>
  );
}




//============================================================================================================================
// Measures

export function MeasuresButtons(props){
  const buttonClasses = buttonStyles();

  function toggleLayout(){
    console.log('toggleLayout!');

    Session.toggle('MeasuresPage.onePageLayout')
  }
  function initializeMeasures(){
    console.log('Initializing Measures!');

    // ReportingMethods.initializeSampleMeasures();
    Meteor.call('initializeSampleMeasures');
  }
  function clearMeasures(){
    Meteor.call('clearMeasures');
  }
  return (
    <div>
      <Button className={buttonClasses.west_button} onClick={ initializeMeasures.bind(this) } >
        Initialize CDC & FEMA Measures
      </Button>
      <Button className={buttonClasses.west_button} onClick={ clearMeasures.bind(this) } >
        Clear
      </Button>
      <Button className={buttonClasses.west_button} onClick={ toggleLayout.bind(this) } >
        Toggle Layout Screen
      </Button>
    </div>
  );
}


//============================================================================================================================
// Measure Reports

export function MeasureReportsButtons(props){
  const buttonClasses = buttonStyles();

  function toggleLayout(){
    console.log('toggleLayout!');

    Session.toggle('MeasureReportsPage.onePageLayout')
  }
  function clearMeasureReports(){
    Meteor.call('clearMeasureReports');
  }
  function initializeSampleReports(){
    console.log('Initializing Sample Reports!');

    // ReportingMethods.initializeSampleMeasureReports();
    Meteor.call('initializeSampleMeasureReports');

  }
  return (
    <div>
      <Button className={buttonClasses.west_button} onClick={ initializeSampleReports.bind(this) } >
        Initialize Sample Reports
      </Button>
      <Button className={buttonClasses.west_button} onClick={ clearMeasureReports.bind(this) } >
        Clear
      </Button>
      <Button className={buttonClasses.west_button} onClick={ toggleLayout.bind(this) } >
        Toggle Layout Screen
      </Button>
    </div>
  );
}


