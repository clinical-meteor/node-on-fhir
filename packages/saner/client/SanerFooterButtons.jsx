import React, { useState } from 'react';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';

import { Button } from '@material-ui/core';

import { get, has } from 'lodash';
import JSON5 from 'json5';

import ReportingMethods from '../lib/ReportingMethods';
import { LayoutHelpers, Locations } from 'meteor/clinical:hl7-fhir-data-infrastructure';



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
      marginTop: '15px',
      float: 'left'
    },
    east_button: {
      cursor: 'pointer',
      justifyContent: 'right',
      color: theme.palette.appBar.contrastText,
      right: '20px',
      marginTop: '15px',
      float: 'right'
      // position: 'absolute'
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

  let [onePageLayout, setOnePageLayout] = useState(Session.get('OrganizationsPage.onePageLayout'));


  function toggleLayout(){
    console.log('toggleLayout!');

    Session.toggle('OrganizationsPage.onePageLayout')
    setOnePageLayout(!onePageLayout);
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

Session.setDefault('MeasuresPage.onePageLayout', true)
export function MeasuresButtons(props){
  const buttonClasses = buttonStyles();

  let [onePageLayout, setOnePageLayout] = useState(Session.get('MeasuresPage.onePageLayout'));

  function toggleLayout(){
    console.log('toggleLayout!');

    Session.toggle('MeasuresPage.onePageLayout')
    setOnePageLayout(!onePageLayout);
  }
  function initializeMeasures(){
    console.log('Initializing Measures!');

    // ReportingMethods.initializeSampleMeasures();
    Meteor.call('initializeSampleMeasures');
  }
  function clearMeasures(){
    Meteor.call('clearMeasures');
  }
  function toggleLayout(){
    console.log('toggleLayout!');

    Session.toggle('MeasuresPage.onePageLayout')
  }
  return (
    <div>
      <Button className={buttonClasses.west_button} onClick={ toggleLayout.bind(this) } >
        { LayoutHelpers.getCardLayoutIcon(onePageLayout) }
      </Button>
      <Button className={buttonClasses.west_button} onClick={ initializeMeasures.bind(this) } >
        Initialize CDC & FEMA Measures
      </Button>
      <Button className={buttonClasses.west_button} onClick={ clearMeasures.bind(this) } >
        Clear
      </Button>
    </div>
  );
}


//============================================================================================================================
// Measure Reports

export function MeasureReportsButtons(props){
  const buttonClasses = buttonStyles();

  let [onePageLayout, setOnePageLayout] = useState(Session.get('MeasureReportsPage.onePageLayout'));

  function toggleLayout(){
    console.log('toggleLayout!');

    Session.toggle('MeasureReportsPage.onePageLayout')
    setOnePageLayout(!onePageLayout);
  }

  function clearMeasureReports(){
    if(confirm("Are you sure?")){
      Meteor.call('clearMeasureReports');
    }
  }
  function initializeSampleReports(){
    console.log('Initializing Sample Reports!');

    // ReportingMethods.initializeSampleMeasureReports();
    Meteor.call('initializeSampleMeasureReports');

  }
  function generateReportFromMeasureDefinition(measure){
    console.log('Generateing report from measure definition...');

    if(typeof measure === "object"){
      console.log('measure', measure)
    }

    let newReport = {
      resourceType: "MeasureReport",
      id: Random.id(),
      status: "complete",
      type: "summary",
      subject: get(Meteor, 'settings.public.saner.location', null),
      date: new Date(),
      reporter: get(Meteor, 'settings.public.saner.reporter', null),
      period: {
        start: "2020-04-07T00:00:00.000Z",
        end: "2020-04-07T00:00:00.000Z"
      },
      group: []
    };

    if(get(measure, 'id')){
      newReport.measure = Meteor.absoluteUrl() + '/baseR4/Measure/' + get(selectedMeasure, 'id');
    }

    if(get(mesure, 'group')){
      if(Array.isArray(get(measure, 'group'))){
        measure.group.forEach(function(measureGroupment){
          let reportGroupment = {
            code: get(measureGroupment, 'code'),
            population: [],
            measureScore: 0
          }  
        
          if(Array.isArray(measureGroupment.population)){
            measureGroupment.population.forEach(function(populationCoding){
              delete populationCoding.criteria;
              reportGroupment.population.push(populationCoding)
            })
          }
          
          newReport.group.push(reportGroupment)
        })
      }
    }


    return newReport;
  }
  function newReport(){
    console.log('Initializing a new reports...');
    console.log('Clearing selected measure report...');

    let selectedMeasure = Session.get('selectedMeasure');

    let newReport = generateReportFromMeasureDefinition(selectedMeasure);

    Session.set('selectedMeasureReportId', newReport.id);
    Session.set('selectedMeasureReport', newReport);
  }
  function postReport(){
    console.warn('Posting report to reporting server...');

    HTTP.post();
  }
  return (
    <div style={{width: '100%'}}>
      <Button className={buttonClasses.west_button} onClick={ toggleLayout.bind(this) } >
        { LayoutHelpers.getCardLayoutIcon(onePageLayout) }
      </Button>
      <Button className={buttonClasses.west_button} onClick={ initializeSampleReports.bind(this) } >
        Initialize Sample Reports
      </Button>
      <Button className={buttonClasses.west_button} onClick={ clearMeasureReports.bind(this) } >
        Clear
      </Button>
      {/* <Button className={buttonClasses.west_button} onClick={ toggleLayout.bind(this) } >
        Toggle Layout Screen
      </Button> */}

      <Button className={buttonClasses.east_button} onClick={ postReport.bind(this) } >
        Post Report
      </Button>
      <Button className={buttonClasses.east_button} onClick={ newReport.bind(this) } >
        New
      </Button>
    </div>
  );
}


 
//============================================================================================================================
// Leaderboard Buttons

export function LeaderboardButtons(props){
  const buttonClasses = buttonStyles();
  
  let [defaultMeasure, setDefaultMeasure] = useState(get(Meteor, 'settings.public.saner.defaultMeasure', ''));
  let [onePageLayout, setOnePageLayout] = useState(Session.get('CovidLeaderboard.onePageLayout'));

  function filterPreferences(){    
    Session.set('mainAppDialogTitle', "Filter Preferences");
    Session.set('mainAppDialogComponent', "FilterPreferencesDialog");
    Session.set('lastUpdated', new Date())
    Session.set('mainAppDialogOpen', true);
  }
  function toggleLayout(){
    console.log('toggleLayout!');

    Session.toggle('SanerLeaderboard.onePageLayout')
    setOnePageLayout(!onePageLayout);
  }

  function calculateLeaderboard(){
    console.log('Calculating Leaderboard...');

    console.log('Default measure:  ', defaultMeasure)
    

    let selectedMeasure;
    let measureUrl = '';
    
    if(defaultMeasure){
      measureUrl = defaultMeasure;
    } else {
      selectedMeasure = Session.get('selectedMeasure');
      measureUrl = get(selectedMeasure, 'url', '');
    }
    
    console.log('Updating LocationTable to display the appropriate extensionUrl')
    Session.set('LocationsTable.extensionUrl', get(selectedMeasure, 'group[0].code.coding[0].code'));

    console.log('LocationLeaderboard.selectedMeasureId', Session.get('selectedMeasureId'));
    console.log('LocationLeaderboard.selectedMeasure.url', measureUrl);

    MeasureReports.find().forEach(function(report, index){
      console.log('MeasureReport', report)
      if(report.measure === measureUrl){
        console.log('Match!')
        // console.log('selectedMeasure.subject.extension', get(report, 'subject.extension'))
        console.log('selectedMeasure.subject.extension[0].extension', get(report, 'subject.extension[0].extension'))

        let inferredPosition = {
          latitude: null,
          longitude: null
        };

        if(Array.isArray(get(report, 'subject.extension[0].extension'))){


          report.subject.extension[0].extension.forEach(function(extension){
            if(get(extension, 'url') === "latitude"){
              inferredPosition.latitude = get(extension, 'valueDecimal', null)
            }
            if(get(extension, 'url') === "longitude"){
              inferredPosition.longitude = get(extension, 'valueDecimal', null)
            }
          })
        }


        let newLocation = {
          meta: {
            lastUpdated: new Date()
          },
          name: get(report, 'reporter.display'),
          position: inferredPosition,
          extension: [{
            url: get(report, 'group[0].code.coding[0].code'),
            valueDecimal: get(report, 'group[0].measureScore.value')
          }]
        }
        Locations.insert(newLocation, {validate: false, filter: false})
        LeaderboardLocations.insert(newLocation, {validate: false, filter: false})
      }
    })
  }
  function clearLeaderboard(){
    LeaderboardLocations.remove({});
  }
  function handleLookupOrgsAndLocations(){
    console.log("Click! Looking up orgs and locations...");

    Meteor.call('lookupOrgsAndLocations');
  }
  return (
    <div style={{width: '100%'}}>
      <Button className={buttonClasses.west_button} onClick={ toggleLayout.bind(this) } >
        { LayoutHelpers.getCardLayoutIcon(onePageLayout) }
      </Button>
      {/* <Button className={buttonClasses.west_button} onClick={ calculateLeaderboard.bind(this) } >
        Calculate Leaderboard
      </Button> */}
      {/* <Button className={buttonClasses.west_button} onClick={ handleLookupOrgsAndLocations.bind(this) } >
        Lookup Orgs & Locations
      </Button> */}
      <Button className={buttonClasses.west_button} onClick={ clearLeaderboard.bind(this) } >
        Clear
      </Button>
      {/* <Button className={buttonClasses.east_button} onClick={ filterPreferences.bind(this) } >
        Filter Preferences
      </Button> */}
    </div>
  );
}

