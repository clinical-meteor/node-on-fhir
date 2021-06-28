import React, { Component, useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { get, has, findIndex, pullAt, sortBy } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';
import JSON5 from 'json5';

import moment from 'moment';

import { FhirUtilities, LayoutHelpers, HospitalLocations, LocationsTable, MeasureReportsTable, OrganizationsTable, DynamicSpacer  } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import { StyledCard } from 'material-fhir-ui';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';

import { ResponsiveBar } from '@nivo/bar';

import Client from 'fhir-kit-client';

import PageCanvas from './PageCanvas'

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';


//=============================================================================================================================================
// Analytics

import ReactGA from 'react-ga';
ReactGA.initialize(get(Meteor, 'settings.public.google.analytics.trackingCode'), {debug: get(Meteor, 'settings.public.google.analytics.debug', false)});
ReactGA.pageview(window.location.pathname + window.location.search);
ReactGA.set({ page: window.location.pathname });

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1)
  }
}));

//==============================================================================================
// Session Variables

// set the reporting defaults to the last two weeks
Session.setDefault('reportingRangeStartDate', moment(get(Meteor, 'settings.public.saner.defaultDate', moment().format("YYYY-MM-DD"))).format("YYYY-MM-DD"));
Session.setDefault('reportingRangeEndDate', moment(get(Meteor, 'settings.public.saner.defaultDate', moment().format("YYYY-MM-DD"))).add(1, 'days').format("YYYY-MM-DD"));

Session.setDefault('totalEncountersDuringDateRange', 0);
Session.setDefault('currentEncounterSearchset', null);

Session.setDefault('encounterUrl', "https://");
Session.setDefault('conditionUrl', "https://");
Session.setDefault('procedureUrl', "https://");

Session.setDefault('geoJsonLayer', "");
Session.setDefault('LocationsTable.extensionUrl', get(Meteor, 'settings.public.saner.measureScore', "numICUBeds"));

Session.setDefault('defaultMeasure', get(Meteor, 'settings.public.saner.defaultMeasure', 'No default measure set.'));
Session.setDefault('SanerLeaderboard.onePageLayout', true)

Session.setDefault('reportingOrganisationsQuery', {});
Session.setDefault('reportingLocationsQuery', {});

//==============================================================================================
// Main Component


function SanerLeaderboard(props){
  const classes = useStyles();

  const rowsPerPage = get(Meteor, 'settings.public.defaults.rowsPerPage', 25);

  let [measureReports, setMeasureReports]   = useState([]);
  let [organizations,   setOrganizations]   = useState([]);
  let [hospitals,   setHospitals]   = useState([]);
  let [hospitalLocations,   setHospitalLocations]   = useState([]);
  let [leaderboardLocations,   setLeaderboardLocations]   = useState([]);
  let [locations, setLocations]   = useState([]);
  let [locationsHistory, setLocationsHistory]   = useState([]);

  let [reportingLocations,   setReportingLocations]   = useState([]);
  let [reportingOrganizations,   setReportingOrganizations]   = useState([]);

  let [checkedTested,  setCheckedTested]  = useState(false);

  let [defaultMeasure, setDefaultMeasure] = useState(get(Meteor, 'settings.public.saner.defaultMeasure', ''));
  let [measureScore, setMeasureScore] = useState(get(Meteor, 'settings.public.saner.measureScore', "numICUBeds"));
  let [measureLabel] = useState(get(Meteor, 'settings.public.saner.measureLabel', "% ICU Bed Utilization"));




  // let [reportingRangeStartDate, setReportingRangeStartDate] = useState(Session.get('reportingRangeStartDate'));
  // let [reportingRangeEndDate, setReportingRangeEndDate] = useState(Session.get('reportingRangeStartDate'));
  let [reportingRangeStartDate, setReportingRangeStartDate] = useState(moment().format('YYYY-MM-DD'));
  let [reportingRangeEndDate, setReportingRangeEndDate] = useState(moment().add(1, 'day').format('YYYY-MM-DD'));

  logger.trace('SanerLeaderboard.reportingRangeStartDate', reportingRangeStartDate)
  logger.trace('SanerLeaderboard.reportingRangeEndDate', reportingRangeEndDate)

  //-------------------------------------------------------------------
  // Auto Tracking

  let hospitalLocationsCursor;
  let leaderboardLocationsCursor;
  let reportingLocationsCursor;
  let reportingOrganizationsCursor;
  let locationsHistoryCursor;

  let currentUser = null;
  let mapParameters = null;

  if(Meteor.isClient){

    //-------------------------------------------------------------------
    // Cursor Methods

    hospitalLocations = useTracker(function(){
      return HospitalLocations.find().fetch();
    }, [props.lastUpdated]);  

    leaderboardLocations = useTracker(function(){
      return LeaderboardLocations.find().fetch();
    }, [props.lastUpdated]);  

    reportingLocations = useTracker(function(){
      return ReportingLocations.find().fetch();
    }, [props.lastUpdated]);  

    reportingOrganizations = useTracker(function(){
      return ReportingLocations.find().fetch();
    }, [props.lastUpdated]);  

    locationsHistory = useTracker(function(){
      return LocationsHistory.find().fetch();
    }, [props.lastUpdated]);  

    //-------------------------------------------------------------------
    // Filter Methods

    reportingRangeStartDate = useTracker(function(){    
      return Session.get('reportingRangeStartDate')
    }, []);  

    reportingRangeEndDate = useTracker(function(){    
      return Session.get('reportingRangeEndDate')
    }, []);  

    currentUser = useTracker(function(){    
      return Session.get('currentUser')
    }, []);  
  
    mapParameters = useTracker(function(){    
      return Session.get('mapParameters')
    }, []);  
  }
  
  
  // console.log('mapParameters', mapParameters)

  if(mapParameters){
    reportingRangeStartDate = get(mapParameters, 'startDate');
    measureScore = get(mapParameters, 'populationCode');

    // console.log('switching measureScore from mapParameters', measureScore);

    switch (measureScore) {
      case 'percent_of_inpatients_with_covid':
        measureLabel = "% Inpatients With Covid";
        break;
      case 'inpatient_beds_utilization':
        measureLabel = "% Inpatient Bed Utilization";
        break;
      case 'adult_icu_bed_utilization':
        measureLabel = "% ICU Bed Utilization";
        break;
      case 'adult_icu_bed_covid_utilization':
        measureLabel = "% ICU Patients With Covid";
        break;        
    }
  }


  let measureReportQuery = {
    measure: get(Meteor, 'settings.public.saner.defaultMeasure', ''),
    'period.start': {$gte: new Date(reportingRangeStartDate)}, 
    'period.end': {$lte: new Date(moment(reportingRangeStartDate).add(1, 'days').format('YYYY-MM-DD'))}, 
  }

  logger.debug('SanerLeaderboard.measureReportQuery', measureReportQuery);
  
  measureReports = useTracker(function(){
    return MeasureReports.find(measureReportQuery).fetch();
    // return MeasureReports.find();
  }, []);  
  let measureReportsAll = MeasureReports.find().fetch();
  logger.trace('SanerLeaderboard.measureReportsAll', measureReportsAll);


  measureReports = MeasureReports.find(measureReportQuery).fetch()
  logger.debug('SanerLeaderboard.measureReports', measureReports);

  let orgReferenceIds = MeasureReports.find(measureReportQuery).map(function(record){
    return FhirUtilities.pluckReferenceId(get(record, 'reporter.reference'));
  })
  let locationReferenceIds = MeasureReports.find(measureReportQuery).map(function(record){
    return FhirUtilities.pluckReferenceId(get(record, 'subject.reference'));
  })
  // console.log('SanerLeaderboard.orgReferenceIds', orgReferenceIds)
  // console.log('SanerLeaderboard.locationReferenceIds', locationReferenceIds)

  let measureReportCount = 0;
  // measureReportCount = useTracker(function(){    
  //   return MeasureReports.find(measureReportQuery).count()
  // }, []);  

  measureReportCount = MeasureReports.find(measureReportQuery).count();
  // console.log('SanerLeaderboard.measureReportCount', measureReportCount);

  //-------------------------------------------------------------------
  // Dependent Trackers


  let organizationsCursor;

  organizations = useTracker(function(){

    // let orgRefIds = MeasureReports.find(measureReportQuery).map(function(record){
    //   return FhirUtilities.pluckReferenceId(get(record, 'reporter.reference'));
    // })

    // return Organizations.find({id: Reporting Organizations
    //   name: 1
    // }});

    // return Organizations.find(Session.get('reportingOrganisationsQuery'), {sort: {
    //   name: 1
    // }});
    return Organizations.find().fetch();

  }, [props.lastUpdated]);  
  // if(organizationsCursor){
  //   organizations = organizationsCursor.fetch();
    
  // }

  let locationsCursor;
  locations = useTracker(function(){
    // return Locations.find({id: {$in: locationReferenceIds}}, {sort: {
    //   name: 1
    // }});
    return Locations.find().fetch();
  }, [props.lastUpdated]);  
  // if(locationsCursor){
  //   locations = locationsCursor.fetch();
  // }


  //-------------------------------------------------------------------
  // Counters
  
  let patientCount = 0;
  patientCount = useTracker(function(){    
    return Patients.find().count()
  }, []);  

  let measureCount = 0;
  measureCount = useTracker(function(){    
    return Measures.find().count()
  }, []);  





  let organizationCount = 0;
  organizationCount = useTracker(function(){    
    return Organizations.find().count()
  }, []);  

  let locationsCount = 0;
  locationsCount = useTracker(function(){    
    return Locations.find().count()
  }, []);  

  let reportingOrganizationCount = 0;
  reportingOrganizationCount = useTracker(function(){    
    return Organizations.find().count()
  }, []);  

  let reportingLocationsCount = 0;
  reportingLocationsCount = useTracker(function(){    
    return Locations.find().count()
  }, []);  

  let deviceCount = 0;
  deviceCount = useTracker(function(){    
    return Devices.find().count()
  }, []);  

  let hospitalLocationsCount = 0;
  hospitalLocationsCount = useTracker(function(){    
    return HospitalLocations.find().count()
  }, []);  

  let leaderboardLocationsCount = 0;
  leaderboardLocationsCount = useTracker(function(){    
    return LeaderboardLocations.find().count()
  }, []);  

  let selectedMeasureId = "";
  selectedMeasureId = useTracker(function(){    
    return Session.get('selectedMeasureId')
  }, []);  

  let onePageLayout = "";
  onePageLayout = useTracker(function(){    
    return Session.get('SanerLeaderboard.onePageLayout')
  }, []);  






  //-------------------------------------------------------------------
  // Lookup
  function lookupOrgsAndLocations(){
    console.log("Looking up orgs and locations...");

    // For each measure report we have, of the correct type and within the correct date range
    let measureReports = MeasureReports.find(measureReportQuery).forEach(function(report){
      console.log('Location:     ' + get(report, 'subject.reference'));

      // we're going to look at it's subject 
      if(has(report, 'subject.reference')){
        let locationLookupUrl = get(Meteor, 'settings.public.interfaces.symptomaticFhirServer.channel.endpoint') + '/' + FhirUtilities.pluckReferenceBase(get(report, 'subject.reference')) + '?_id=' + FhirUtilities.pluckReferenceId(get(report, 'subject.reference')) + '&_format=json';
        console.log('Looking up the location at the following URL: ', locationLookupUrl)        

        HTTP.get(locationLookupUrl, function(error, result){
          if(result){
            if(result.statusCode === 200){
              let parsedResults = JSON.parse(result.content);
              console.log('Parsed a successful result', parsedResults)

              if(get(parsedResults, 'resourceType') === "Bundle"){
                console.log('Received a Bundle.')

                if(Array.isArray(parsedResults.entry)){
                  parsedResults.entry.forEach(function(bundleEntry){
                    if(get(bundleEntry, 'resourceType') === "Location"){
                      console.log('Found an Location.  Upserting.')
                      if(!Locations.findOne({id: bundleEntry.id})){
                        Locations.insert(bundleEntry, {filter: false, validate: false}, function(err, result){
                          if(err){
                            console.log('err', err)
                          }
                          if(result){
                            console.log('result', result)
                          }
                        })        
                      }
                    }
                  })
                }
              } else if(get(parsedResults, 'resourceType') === "Location"){
                console.log('Found an Location.  Upserting.')
                if(!Locations.findOne({id: parsedResults.id})){
                  Locations.insert(parsedResults, {filter: false, validate: false}, function(err, result){
                    if(err){
                      console.log('err', err)
                    }
                    if(result){
                      console.log('result', result)
                    }
                  })        
                }
              }              
            } 
          }

          if(error){
            if(error.statusCode === 404){
              console.log('Caught a 404');
              
            } else {
              console.log("error", error)
            }
          }
        });
      }

      console.log('Organization: ' + get(report, 'reporter.reference'));
      if(has(report, 'reporter.reference')){
        let organizationLookupUrl = get(Meteor, 'settings.public.interfaces.symptomaticFhirServer.channel.endpoint') + '/' + get(report, 'reporter.reference') + '?_format=json';
        console.log('Looking up the organization at the following URL: ', organizationLookupUrl)

        HTTP.get(organizationLookupUrl, function(error, result){
          if(result){
            if(result.statusCode === 200){
              let parsedResults = JSON.parse(result.content);
              console.log('Parsed a successful result', parsedResults)
              
              //console.log('parsedResults', parsedResults)
              if(get(parsedResults, 'resourceType') === "Bundle"){
                console.log('Received a Bundle.')
                if(Array.isArray(parsedResults.entry)){
                  console.log('Iterating through entries.')
                  parsedResults.entry.forEach(function(bundleEntry){
                    if(get(bundleEntry, 'resourceType') === "Organization"){
                      console.log('Found an Organization.  Checking if it already exists.')
                      if(!Organizations.findOne({id: bundleEntry.id})){
                        Organizations.insert(bundleEntry, {filter: false, validate: false}, function(err, result){
                          if(err){
                            console.log('err', err)
                            Session.set('lastUpdated', new Date())
                          }
                          if(result){
                            console.log('result', result)
                            Session.set('lastUpdated', new Date())
                          }
                        })        
                      }
                    }
                  })
                }
              } else if(get(parsedResults, 'resourceType') === "Organization"){
                console.log('Found an Organization.  Checking if it already exists.')
                if(Organizations.findOne({id: parsedResults.id})){
                  console.log('Found an Organization with that id.', Organizations.findOne({id: parsedResults.id}))
                  Session.set('lastUpdated', new Date())
                } else {
                  console.log('No existing Organization found matching that id.  Inserting new.')
                  Organizations.insert(parsedResults, {filter: false, validate: false}, function(err, result){
                    if(err){
                      console.log('err', err)
                      Session.set('lastUpdated', new Date())
                    }
                    if(result){
                      console.log('result', result)
                      Session.set('lastUpdated', new Date())
                    }
                  }) 
                }
              }
            } else {
              console.log("HTTP Code: " + result.statusCode)
            }
          }
          if(error){
            console.log('error', error)
          }
        })
      }
    });
  }


  function generateLocationMarkers(){
    console.log('Generating Locations for map markers.')

    Meteor.call('generateLocationMarkers');
  }



  //-------------------------------------------------------------------
  // Button Methods


  function filterPreferences(){    
    Session.set('mainAppDialogTitle', "Filter Preferences");
    Session.set('mainAppDialogComponent', "FilterPreferencesDialog");
    Session.set('lastUpdated', new Date())
    Session.set('mainAppDialogOpen', true);
  }
  // function collateMeasureReports(){
  //   console.log('Collating measure reports...');

  //   let allReports = MeasureReports.find().fetch();

  //   console.log('allReports', allReports);

  //   console.log('measureReportQuery', measureReportQuery)

  //   let dailyMeasureCohort = MeasureReports.find(measureReportQuery).fetch();

  //   console.log('dailyMeasureCohort', dailyMeasureCohort);

  //   setMeasureReports(dailyMeasureCohort)

  // }
  function handleGeocodeAddresses(props){
    logger.verbose('SanerLeaderboard.handleGeocodeAddresses()');
    logger.debug('Geocoding addresses.', );

    Meteor.call('geocodeIntegrityCheck');
    // Locations.find().forEach(function(location){
    //   if(!get(location, 'position')){
    //     console.log('No geoposition found.  Lets try geocoding... ' + location.id)
    //     Meteor.call('geocodeLocationAddress', location, function(error, result){
    //       if(error){
    //         console.log('geocodeAddress.error', error)
    //       }
    //       if(result){
    //         console.log('geocodeAddress.result', result) 
    //       }
    //     })  
    //   }
    // });
  }
  function lookupOrganizations(){
    logger.warn('SanerLeaderboard.lookupOrganizations()');
  }

  function clearMeasures(){
    logger.warn('SanerLeaderboard.clearMeasures()');
    MeasuresTable.remove({});
  }
  function clearMeasureReports(){
    logger.warn('SanerLeaderboard.clearMeasureReports()');
    MeasureReports.remove({});
  }
  function clearOrganizations(){
    logger.warn('SanerLeaderboard.clearOrganizations()');
    Organizations.remove({});
  }

  function clearGeoJson(){
    logger.warn('SanerLeaderboard.clearGeoJson()');
    Session.set('geoJsonLayer', "")
  }

  function generateGeoJson(){
    logger.warn('SanerLeaderboard.generateGeoJson()');

    let newGeoJson = {
      "type": "FeatureCollection",
      "features": []
    }

    let proximityCount = Locations.find({_location: {$near: {
      $geometry: {
        type: 'Point',
        coordinates: [-88.0020589, 42.01136169999999]
      },
      // Convert [mi] to [km] to [m]
      $maxDistance: 50 * 1.60934 * 1000
    }}}).count();

    console.log('Found ' + proximityCount + ' locations within 50 miles of the search origin.')

    let count = 0;
    Locations.find({_location: {$near: {
      $geometry: {
        type: 'Point',
        coordinates: [-88.0020589, 42.01136169999999]
      },
      // Convert [mi] to [km] to [m]
      $maxDistance: 50 * 1.60934 * 1000
    }}}).forEach(function(location){
      count++;

      if(get(location, 'position.longitude') && get(location, 'position.latitude')){
        let newFeature = { 
          "type": "Feature", 
          "properties": { 
            "id": (count).toString(),                 
            "primary_type": "POSITIVE",                           
            "location_zip": get(location, 'address.postalCode'),      
            "location_address": get(location, 'address.line[0]'),    
            "location_city": get(location, 'address.city'),                    
            "location_state": get(location, 'address.state'),
            "longitude": (get(location, 'position.longitude')).toFixed(9).toString(),
            "latitude": (get(location, 'position.latitude')).toFixed(9).toString()        
          }, 
          "geometry": { 
            "type": "Point", 
            "coordinates": [ Number((get(location, 'position.longitude')).toFixed(9)), Number((get(location, 'position.latitude')).toFixed(9)) ] 
          }
        }
  
        newGeoJson.features.push(newFeature);
      }      
    })

    console.log('newGeoJson', newGeoJson)
    Session.set('geoJsonLayer', newGeoJson)
  }


  function handleEnscribeMeasureScore(){
    console.log('Click!  Enscribing score onto reports and locations', measureScore)
    
    let measureScoreType = get(Meteor, 'settings.public.saner.measureScore', "numICUBeds");

    if(measureScore){
      measureScoreType = measureScore;
    }
    console.log('Now enscribing measure score...', measureReportQuery, measureScoreType)

    Meteor.call('encodeMeasureScores', measureReportQuery, measureScoreType, function(error, result){
      if(result){
        console.log('Received the completion signal.  All measure scores should be converted to Locations.')
        setLocations(Locations.find().fetch())
      }
    });
    // Meteor.call('encodeMeasureScores', measureReportQuery, "numICUBeds_verified", function(error, result){
    //   if(result){
    //     console.log('Received the completion signal.  All measure scores should be converted to Locations.')
    //     setLocations(Locations.find().fetch())
    //   }
    // });
  }

  function handleLookupMeasureScores(){
    console.log('Click! Looking up measure score...', measureReportQuery)

    Meteor.call('lookupMeasureScores', get(Meteor, 'settings.public.saner.measureScore', "numICUBeds"), get(Meteor, 'settings.public.saner.defaultDate', moment().format("YYYY-MM-DD")), function(error, result){
      if(result){
        console.log('Received the completion signal.  All measure scores should be converted to Locations.')
        setLocations(Locations.find().fetch())
      }
    });
    // Meteor.call('lookupMeasureScores', 'numICUBeds_verified', get(Meteor, 'settings.public.saner.defaultDate', moment().format("YYYY-MM-DD")), function(error, result){
    //   if(result){
    //     console.log('Received the completion signal.  All measure scores should be converted to Locations.')
    //     setLocations(Locations.find().fetch())
    //   }
    // });
  }
  function handleWriteLocHistory(){
    console.log('Writing Locations cursor to LocationsHistory...')

    Meteor.call('writeLocationToHistory', get(Meteor, 'settings.public.saner.measureScore'), get(Meteor, 'settings.public.saner.defaultDate'), function(error, versionId){
      if(versionId){
        console.log('Received the completion signal.  All measure scores should be written to LocationsHistory.')   
        alert('Just published version ' + versionId + '.  You may wish to update the METEOR_SETTINGS variable or Meteor.settings file, if you are enforcing a specific map version.')     
      }
    });
  }

  function handleWriteTestingSites(){
    console.log('Writing Locations cursor to LocationsHistory...')

    Meteor.call('writeLocationToTestingSites',function(error, count){
      if(count){
        console.log('Received the completion signal.  All measure scores should be written to TestingSiteLocations.')   
        alert('Just published  ' + count + ' testing sites. ')     
      }
    });
  }

  let measure = Measures.findOne({_id: selectedMeasureId});
  // console.log('SanerLeaderboard.measure', measure)

  let leaderboardTitle = get(measure, "name", "Hospital Capacity");



  //-------------------------------------------------------------------
  // Bar Chart

  let barData = [];
  // let barLimit = 120;
  // if(Meteor.isCordova){
  //   barLimit = 30;
  // }

  // for each measure report
  MeasureReports.find({}, {sort: {'period.start': 1}}).forEach(function(report, index){
    // grab some info about when it was run
    let periodStart = get(report, 'period.start');
    let periodEnd = get(report, 'period.end');
    let year = moment(periodEnd).year();
    let month = moment(periodEnd).month();
    let shortMonth = moment.monthsShort(moment(periodEnd).month());
    let bucketName = moment(periodEnd).format("YYYYMMDD");
    let bucketIndex = 0;
    let bucket;
    let bucketArray = [];

    // convert the timestamp into a basic timeindex
    let timeIndex = moment(periodStart).format("YYYYMMDD");

    logger.trace('This report belongs in the following bucket: ', bucketName);

    // if there is no index for this bucket
    if(findIndex(barData, {'reportDate': bucketName}) === -1){
      // assume that we need to create it
      barData.push({
        "index": index,
        "reportDate": bucketName,
        "cdc": 0,
        "fema": 0
      })
    } 

    // the bucket should either already exist, or we just crated it
    // so lets get the index
    bucketIndex = findIndex(barData, {'reportDate': bucketName});
    //logger.trace('Fund the bucketIndex for where the report should belong: ', bucketIndex);

    // the bucket should now exist
    if(bucketIndex > -1){
      
      bucketArray = pullAt(barData, [bucketIndex]);
      //logger.trace('Get the bucket array from the above index: ', bucketArray);
      
      bucket = bucketArray[0];
      //logger.trace('Then get the first bucket: ', bucket);

      // logger.trace('bucket', JSON.stringify(bucket))

      let measureUrl = get(report, 'measure');
      //logger.trace('What kind of measure is this?', measureUrl)

      if(measureUrl.includes('CDC')){
        bucket.cdc++;
      } else if(measureUrl.includes('FEMA')){
        bucket.fema++;
      }

      barData.push(bucket);
    }
  })

  sortBy(barData, ['index']);

  
  // console.log('render.measureScore', measureScore);

  //-------------------------------------------------------------------
  // rendering
  
  let renderContent;

  // let reportingDate = get(Meteor, 'settings.public.saner.defaultDate', moment().format("YYYY-MM-DD"));

  let orgTableCardStyle = {};
  let reportsColumnStyle = {paddingRight: '10px', width: '100%'};
  let orgsColumnStyle = {};
  let locationsColumnStyle = {};

  if(Meteor.isCordova){
    // on mobile, we want to be space conserving
    // and hide elements when needed 
    orgTableCardStyle = {};

    // if(MeasureReports.find().count() === 0){
    //   reportsColumnStyle.display = "none";
    // }  
  } else {
    // on desktop, we want minimum heights and fixed layout
    // even if it gobbles up space
    orgTableCardStyle = { height: '720px' };
  }

  let reportSubheaderText = "";
  let showReporter = true;
  let showDates = true;
  let measureReportActions;
  let orgActions;
  let geocodingActions;
  if(Meteor.isCordova){
    showReporter = false;
    showDates = false;
  } else {
    reportSubheaderText = defaultMeasure;
    if(currentUser){
      measureReportActions = <CardActions style={{width: '100%'}}>
        <Button color="primary" onClick={ handleEnscribeMeasureScore.bind(this) } style={{marginTop: '15px', minWidth: '200px'}} >
          Enscribe Measure Scores on Locations
        </Button>
      </CardActions> 
      orgActions = <CardActions style={{width: '100%'}}>
      <Button color="primary" onClick={ generateLocationMarkers.bind(this) } style={{marginTop: '15px', minWidth: '200px'}}>
          Generate Location Markers
        </Button>
      </CardActions>
      geocodingActions = <CardActions style={{width: '100%'}}>
        <Button color="primary" onClick={ handleGeocodeAddresses.bind(this) } style={{marginTop: '15px', minWidth: '200px'}} >
          Geocode Addresses
        </Button>
        {/* <Button color="primary" onClick={ handleLookupMeasureScores.bind(this) } style={{marginTop: '15px', minWidth: '200px'}} >
          Lookup Managing Org Scores
        </Button> */}
        <Button color="primary" onClick={ handleWriteLocHistory.bind(this) } style={{marginTop: '15px', minWidth: '200px'}} >
          Write to LocationHistory
        </Button>
        <Button color="primary" onClick={ handleWriteTestingSites.bind(this) } style={{marginTop: '15px', minWidth: '200px'}} >
          Write to TestingSiteLocations
        </Button>
      </CardActions>
    }
  }

  renderContent = <Grid container>
    <Grid item xl={4} style={reportsColumnStyle}>
      <CardHeader 
        title={measureReportCount + " Measure Reports for " + reportingRangeStartDate }
        subheader={reportSubheaderText}
      />
      <StyledCard style={{height: '720px'}} margin={20}>
        <CardContent>
          <MeasureReportsTable 
            count={measureReportCount}
            measureReports={measureReports}     
            hideType
            hideNumerator
            hideDenominator
            hideBarcode       
            hideReporter={showReporter}
            hideStartDate={showDates}
            hideEndDate={showDates}
            rowsPerPage={10}
            measureScoreLabel={measureLabel}
            measureScoreType={measureScore}
            sortByMeasureScore
          />
        </CardContent>
        { measureReportActions }
      </StyledCard>
      <DynamicSpacer />  
    </Grid>
    <Grid item xl={4} style={{paddingRight: '10px', paddingLeft: '10px', width: '100%'}}>
      <CardHeader title={organizationCount + " Reporting Organizations"} subheader="Unique organizations that have reported in." />
      <StyledCard style={orgTableCardStyle} margin={20}>
        <CardContent>
          <OrganizationsTable
            // count={reportingOrganizationCount}
            // organizations={reportingOrganizations}
            count={organizationCount}
            organizations={organizations}
            hideAddressLine
            hidePhone
            hideEmail
            hideIdentifier
            hideActionIcons
            rowsPerPage={10}
          />
        </CardContent>
        { orgActions }        
      </StyledCard>  
      <DynamicSpacer />        
    </Grid>
    <Grid item xl={4} style={{paddingLeft: '10px', width: '100%'}}>
      <CardHeader title={locationsCount + " Locations to Render"} subheader="Unique locations reporting in." />
      <StyledCard style={{height: '720px', marginBottom: '80px'}} margin={20}>
        <CardContent>
          <LocationsTable
            locations={locations}
            rowsPerPage={10}
            hideActionIcons
            size="medium"
            hideExtensions={false}
            count={locationsCount}
            hideCity
            hideState
            hideCountry
            hidePostalCode
            hideType
            hideAddress
            extensionUrl={measureScore}
            extensionLabel={measureLabel}
          />
        </CardContent>
        { geocodingActions }        
      </StyledCard>
      <DynamicSpacer />  
    </Grid>
    {/* <Grid item xl={4} style={{paddingLeft: '10px', width: '100%'}}>
      <CardHeader title={"Location History: " + locationsHistory.length } subheader="Collection for managing versions of files." />
      <StyledCard style={{height: '720px', marginBottom: '80px'}} margin={20}>
        <CardContent>
          <LocationsTable
            locations={locationsHistory}
            rowsPerPage={10}
            hideActionIcons
            size="medium"
            hideExtensions={false}
            count={locationsHistory.length}
            hideCity
            hideState
            hideCountry
            hidePostalCode
            hideType
            hideAddress
            extensionUrl={measureScore}
            extensionLabel={measureLabel}
          />
        </CardContent>
        { geocodingActions }        
      </StyledCard>
    </Grid> */}
  </Grid>


  // console.log('SanerLeaderboard.organizations', organizations)
  // console.log('SanerLeaderboard.locations', locations)

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let cardWidth = window.innerWidth - paddingWidth;
  

  let reportingParticipationActionButtons;
  if(!Meteor.isCordova && currentUser){
    reportingParticipationActionButtons = <CardActions>
      <Button onClick={ filterPreferences.bind(this) } >
        Parameters
      </Button>
    </CardActions>
  }

  let barChartStyle = {
    width: (window.innerWidth - 260 ) + 'px',     
    minHeight: '200px'
  }
  if(!Meteor.isCordova){
    barChartStyle.height = '300px';
  }

  // console.log('SanerLeaderboard.paddingWidth', paddingWidth)

  return (
    <PageCanvas id='SanerLeaderboard' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} local="en">
        <CardHeader title="Reporting Participation" />
        <StyledCard>
          <CardContent>
            <div id="historyBarChart" style={barChartStyle}>
              <ResponsiveBar
                data={barData}
                keys={[ 'cdc', 'fema']}
                indexBy="reportDate"
                margin={{ top: 20, right: 130, bottom: 100, left: 60 }}
                padding={0.3}        
                colors={['#ff9d1b', '#ffd090', '#ffe0b8','#fff1df']}  // https://colordesigner.io/
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 80,
                    tickRotation: 0,
                    legend: 'month',
                    legendPosition: 'middle',
                    legendOffset: 32,
                    tickRotation: 270
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'encounters',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                // legends={[
                //   {
                //     dataFrom: 'keys',
                //     anchor: 'bottom',
                //     direction: 'column',
                //     justify: false,
                //     translateX: 120,
                //     translateY: 0,
                //     itemsSpacing: 2,
                //     itemWidth: 100,
                //     itemHeight: 20,
                //     itemDirection: 'left-to-right',
                //     itemOpacity: 0.85,
                //     symbolSize: 20,
                //     effects: [{
                //       on: 'hover',
                //       style: {
                //         itemOpacity: 1
                //       }
                //     }]
                //   }
                // ]}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
              />
            </div>
          </CardContent>
          { reportingParticipationActionButtons }
        </StyledCard>   
        <DynamicSpacer />   
        <DynamicSpacer />     
        { renderContent }
      </MuiPickersUtilsProvider>            
    </PageCanvas>
  );
}

export default SanerLeaderboard;