import React, { useState } from 'react';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';

import { Button } from '@material-ui/core';

import { get, has } from 'lodash';
import JSON5 from 'json5';

import ReportingMethods from '../lib/ReportingMethods';
import { LayoutHelpers, Locations } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import moment from 'moment';
import { useTracker } from './Tracker';

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
// Shared Functions






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
// Locations

export function LocationsButtons(props){
  const buttonClasses = buttonStyles();

  let [onePageLayout, setOnePageLayout] = useState(Session.get('LocationsPage.onePageLayout'));

  function toggleLayout(){
    console.log('toggleLayout!');

    Session.toggle('LocationsPage.onePageLayout')
    setOnePageLayout(!onePageLayout);
  }
  return (
    <div>
      <Button className={buttonClasses.west_button} onClick={ toggleLayout.bind(this) } >
        { LayoutHelpers.getCardLayoutIcon(onePageLayout) }
      </Button>
    </div>
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
      <Button className={buttonClasses.west_button} onClick={ toggleLayout.bind(this) } >
        { LayoutHelpers.getCardLayoutIcon(onePageLayout) }
      </Button>
      <Button className={buttonClasses.west_button} onClick={ initializeOrganizations.bind(this) } >
        Initialize Medicare Hospitals
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
  function initializeHhsSampleReports(){
    console.log('Initializing HHS Sample Reports!');

    // ReportingMethods.initializeSampleMeasureReports();
    Meteor.call('initializeHhsSampleMeasureReports');

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
    console.log('Posting a MeasureReport to ' + get(Meteor, 'settings.public.saner.relayEndpoint[0].reference'));

    let selectedMeasureReportId = Session.get('selectedMeasureReportId');
    console.log('selectedMeasureReportId', selectedMeasureReportId)

    let selectedMeasureReport = Session.get('selectedMeasureReport');
    console.log('selectedMeasureReport', selectedMeasureReport)


    HTTP.post(get(Meteor, 'settings.public.saner.relayEndpoint[0].reference') + '/MeasureReport', {
      headers: {
        "Content-Type": "application/fhir+json"
      },
      data: selectedMeasureReport
    }, function(error, result){
      if(error){
        console.log('error', error)
      }
      if(result){
        console.log('result', result)
      }
    });
  }

  let sampleBtn;
  let hhsSamplesBtn;
  let postBtn;
  let newBtn;
  if(!Meteor.isCordova && Meteor.currentUser()){
    sampleBtn = <Button className={buttonClasses.west_button} onClick={ initializeSampleReports.bind(this) } >
      Initialize Sample Reports
    </Button>
    hhsSamplesBtn = <Button className={buttonClasses.west_button} onClick={ initializeHhsSampleReports.bind(this) } >
      Initialize HHS Cares Reports
    </Button>
    postBtn = <Button className={buttonClasses.east_button} onClick={ postReport.bind(this) } >
      Post Report
    </Button>
    newBtn = <Button className={buttonClasses.east_button} onClick={ newReport.bind(this) } >
      New
    </Button>
  }

  return (
    <div style={{width: '100%'}}>
      <Button className={buttonClasses.west_button} onClick={ toggleLayout.bind(this) } >
        { LayoutHelpers.getCardLayoutIcon(onePageLayout) }
      </Button>      
      { sampleBtn }
      { hhsSamplesBtn }
      <Button className={buttonClasses.west_button} onClick={ clearMeasureReports.bind(this) } >
        Clear
      </Button>

      { postBtn }
      { newBtn }      
    </div>
  );
}


 
//============================================================================================================================
// Leaderboard Buttons

export function LeaderboardButtons(props){
  const buttonClasses = buttonStyles();
  
  let [defaultMeasure, setDefaultMeasure] = useState(get(Meteor, 'settings.public.saner.defaultMeasure', ''));
  let [onePageLayout, setOnePageLayout] = useState(Session.get('CovidLeaderboard.onePageLayout'));
  let [hhsFetchUrl, setHhsFetchUrl] = useState(get(Meteor, 'settings.public.saner.proxies.hhs'));


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
  function fetchHhsData(){
    console.log('Asking proxy server to fetch Department of Health and Human Services data...');
    console.log('HHS Fetch Url: ' + hhsFetchUrl);

    Meteor.call('fetchHhsData', hhsFetchUrl)
  }
  function fetchCdcData(){
    console.log('Asking proxy server to fetch CDC data...');

    Meteor.call('fetchCdcData')
  }
  function generateGeojsonLayer(){
    console.log('Asking proxy server to generate Geojson Layer...');

    Meteor.call('generateGeojsonLayer')
  }
  function generateHsaLocations(){
    console.log('Asking proxy server to generate HSA Locations...');

    Meteor.call('generateHsaLocations')
  }
  function fetchIndianaApiData(){
    console.log("Asking proxy server to fetch data from State of Indiana...");

    Meteor.call('fetchIndianaApiData');
  }
  function fetchChicagoCovidData(){
    console.log("Asking proxy server to fetch data from City of Chicago...");

    Meteor.call('fetchChicagoCovidData');
  }
  function toggleMapLayersDialog(){
    console.log('Toggle map layers dialog open/close.');

    Session.set('mainAppDialogJson', false);
    Session.set('mainAppDialogTitle', "Map Layers");
    Session.set('mainAppDialogComponent', "MapLay ersDialog");
    Session.set('lastUpdated', new Date())

    Session.toggle('mainAppDialogOpen');
  }
  function calcPercentUsage(){
    console.log('Asking proxy server to calculate percent utilization...');

    Meteor.call('calcPercentUsage')
  }
  function fetchHhsInpatientBeds(){
    console.log('Asking proxy server to fetch HHS Protect Percentage of Inpatient Beds Occupied (Estimate)...');

    Meteor.call('fetchHhsInpatientBeds');
  }
  function initializePharmacyTestingSites(){
    console.log("Asking proxy server to initialize CSV testing sites from file.");

    Meteor.call('initChicagoTestingSites');
    Meteor.call('initializePharmacyTestingSites');
  }
  function toggleLegendPanel(){
    console.log('Toggle legend panel.')

    Session.set('contextJson', false);
    Session.set('contextTitle', "Community Testing Sites");
    Session.set('contextComponent', "TestingSitesMapLayersContext");
    Session.set('lastUpdated', new Date())

    // Session.toggle('mapLegendOpen')
    Session.toggle('slideOutCardsVisible');
  }
  function toggleFetchDialog(){
    console.log('Toggle legend panel.')

    // Session.set('contextJson', false);
    // Session.set('contextTitle', "Fetch Preferences");
    // Session.set('contextComponent', "FetchPreferencesDialog");
    // Session.set('lastUpdated', new Date())

    Session.set('mainAppDialogJson', false);
    Session.set('mainAppDialogTitle', "Fetch Preferences");
    Session.set('mainAppDialogComponent', "FetchPreferencesDialog");
    Session.set('lastUpdated', new Date())

    // Session.toggle('mapLegendOpen')
    Session.toggle('mainAppDialogOpen');
  }

  let currentUser = useTracker(function(){
    return Meteor.currentUser();
  }, [])


  let webButtons = [];
  if(!Meteor.isCordova && currentUser){
    webButtons.push(<Button key="a" className={buttonClasses.west_button} onClick={ toggleFetchDialog.bind(this) } >
      Fetch Options
    </Button>);
    webButtons.push(<Button key="b" className={buttonClasses.west_button} onClick={ fetchHhsData.bind(this) } >
      Fetch HHS Data
    </Button>);
    webButtons.push(<Button key="c" className={buttonClasses.west_button} onClick={ fetchCdcData.bind(this) } >
      Fetch CDC Data (NHSN)
    </Button>);
    webButtons.push(<Button key="d" className={buttonClasses.west_button} onClick={ fetchIndianaApiData.bind(this) } >
      Fetch Indiana API Data
    </Button>);
    webButtons.push(<Button key="e" className={buttonClasses.west_button} onClick={ fetchChicagoCovidData.bind(this) } >
      Fetch Chicago API Data 
    </Button>);
    webButtons.push(<Button key="f" className={buttonClasses.west_button} onClick={ calcPercentUsage.bind(this) } >
      Calc Percent Usage
    </Button>);
    webButtons.push(<Button key="g" className={buttonClasses.west_button} onClick={ generateHsaLocations.bind(this) } >
      Generate HSA Locations
    </Button>);
    webButtons.push(<Button key="h" className={buttonClasses.west_button} onClick={ fetchHhsInpatientBeds.bind(this) } >
      Fetch HHS Inpatient Beds
    </Button>)
    webButtons.push(<Button key="i" className={buttonClasses.west_button} onClick={ initializePharmacyTestingSites.bind(this) } >
      Init Community Testing Sites
    </Button>)
}

  return (
    <div style={{width: '100%'}}>
      <Button className={buttonClasses.west_button} onClick={ toggleLayout.bind(this) } >
        { LayoutHelpers.getCardLayoutIcon(onePageLayout) }
      </Button>
      { webButtons }      
      {/* <Button className={buttonClasses.east_button} onClick={ toggleMapLayersDialog.bind(this) } >
        Layers
      </Button> */}
      <Button key="legendBtn" className={buttonClasses.east_button} onClick={ toggleLegendPanel.bind(this) } >
        Legend
      </Button>
    </div>
  );
}

//============================================================================================================================
// Health Service Areas

Session.setDefault('mapLegendOpen', true)
export function HsaMapButtons(props){
  const buttonClasses = buttonStyles();

  let [onePageLayout, setOnePageLayout] = useState(Session.get('LocationsPage.onePageLayout'));

  function toggleMapLayersDialog(){
    console.log('Toggle map layers dialog open/close.')
    Session.set('mainAppDialogJson', false);
    Session.set('mainAppDialogTitle', "Map Layers");
    Session.set('mainAppDialogComponent', "MapLayersDialog");
    Session.set('lastUpdated', new Date())
    Session.toggle('mainAppDialogOpen');
  }
  function toggleMyLocationDialog(){
    console.log('Toggle my location dialog open/close.')
    Session.set('mainAppDialogJson', false);
    Session.set('mainAppDialogTitle', "My Location");
    Session.set('mainAppDialogComponent', "MyLocationDialog");
    Session.set('lastUpdated', new Date())
    Session.toggle('mainAppDialogOpen');
  }
  function toggleLegendPanel(){
    console.log('Toggle legend panel.')

    Session.set('contextJson', false);
    Session.set('contextTitle', "Health Service Areas");
    Session.set('contextComponent', "MapLayersDialog");
    Session.set('lastUpdated', new Date())

    // Session.toggle('mapLegendOpen')
    Session.toggle('slideOutCardsVisible');
  }
  // function toggleOverlays(){
  //   Session.toggle('overlaysVisible');
  //   console.log('toggleOverlays')
  // }
  // function toggleSlideOut(){
  //   // console.log('toggleSlideOut', Session.get('slideOutCardsVisible'))
  //   Session.toggle('slideOutCardsVisible');
  // }

  return (
    <div style={{marginLeft: '40px', width: '100%'}}>
      {/* <Button className={buttonClasses.west_button} onClick={ toggleMapLayersDialog.bind(this) } >
        { LayoutHelpers.getCardLayoutIcon(onePageLayout) }
      </Button> */}
      {/* <Button className={buttonClasses.east_button} onClick={ toggleMapLayersDialog.bind(this) } >
        Layers
      </Button> */}
      <Button className={buttonClasses.east_button} onClick={ toggleLegendPanel.bind(this) } >
        Legend
      </Button>
      <Button className={buttonClasses.east_button} onClick={ toggleMyLocationDialog.bind(this) } >
        My Location
      </Button>
      {/* <Button className={buttonClasses.east_button} onClick={ toggleOverlays.bind(this) } >
        Overlays
      </Button>
      <Button className={buttonClasses.east_button} onClick={ toggleSlideOut.bind(this) } >
        Slideout
      </Button> */}
    </div>
  );
}
// SanerFetchApisDialog




//============================================================================================================================
// Testing Sites

Session.setDefault('nearestTestingLocation', true)
export function TestingSitesMapButtons(props){
  const buttonClasses = buttonStyles();

  function toggleNearestLocationDialog(){
    console.log('Toggle nearest testing location dialog open/close.')
    Session.set('mainAppDialogJson', false);
    Session.set('mainAppDialogTitle', "Nearest Testing Location");
    Session.set('mainAppDialogComponent', "NearestTestingLocationDialog");
    Session.set('lastUpdated', new Date())
    Session.toggle('mainAppDialogOpen');
  }
  function initTestingSites(){
    console.log('Initializing specimen collection sites...')

    Meteor.call('initChicagoTestingSites');
    Meteor.call('initializePharmacyTestingSites');
  }
  function toggleLegendPanel(){
    console.log('Toggle legend panel.')

    Session.set('contextJson', false);
    Session.set('contextTitle', "Community Testing Sites");
    Session.set('contextComponent', "TestingSitesMapLayersContext");
    Session.set('lastUpdated', new Date())

    // Session.toggle('mapLegendOpen')
    Session.toggle('slideOutCardsVisible');
  }
  let currentUser = useTracker(function(){
    return Meteor.currentUser();
  }, [])

  let initButton;
  if(currentUser){
    initButton = <Button key="initSitesBtn" className={buttonClasses.east_button} onClick={ initTestingSites.bind(this) } >
      Init Community Testing Sites
    </Button>
  }
  return (
    <div style={{marginLeft: '40px'}}>
      { initButton }
      <Button key="nearestSiteBtn" className={buttonClasses.east_button} onClick={ toggleNearestLocationDialog.bind(this) } >
        Nearest Site Info
      </Button>
      <Button key="legendBtn" className={buttonClasses.east_button} onClick={ toggleLegendPanel.bind(this) } >
        Legend
      </Button>
    </div>
  );
}
// SanerFetchApisDialog