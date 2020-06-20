import React, { Component, useState, useEffect } from 'react';


import { makeStyles } from '@material-ui/core/styles';

import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';


import { get, has, findIndex, pullAt } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';
import JSON5 from 'json5';

import moment from 'moment';

import { FhirUtilities, LayoutHelpers, HospitalLocations, LocationsTable, MeasureReportsTable, OrganizationsTable, DynamicSpacer  } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import { PageCanvas, StyledCard, PatientTable } from 'material-fhir-ui';
import { useTracker } from './Tracker';

import { ResponsiveBar } from '@nivo/bar';

import Client from 'fhir-kit-client';

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

// Session.setDefault("fhirServerEndpoint", "http://localhost:3100/baseR4");


console.log('Intitializing fhir-kit-client for ' + get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', 'http://localhost:3100/baseR4'))

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
Session.setDefault('reportingRangeStartDate', moment().subtract(2, 'weeks').format("YYYY-MM-DD"));
Session.setDefault('reportingRangeEndDate', moment().format("YYYY-MM-DD"));

Session.setDefault('totalEncountersDuringDateRange', 0);
Session.setDefault('currentEncounterSearchset', null);

Session.setDefault('encounterUrl', "https://");
Session.setDefault('conditionUrl', "https://");
Session.setDefault('procedureUrl', "https://");

Session.setDefault('geoJsonLayer', "");
Session.setDefault('LocationsTable.extensionUrl', 'newDiagnosticTests');

Session.setDefault('defaultMeasure', get(Meteor, 'settings.public.saner.defaultMeasure', ''));
Session.setDefault('SanerLeaderboard.onePageLayout', true)

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
  let [locations,   setLocations]   = useState([]);
  
  let [checkedTested,  setCheckedTested]  = useState(false);
  let [fhirServerEndpoint, setFhirServerEndpoint] = useState( get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', 'http://localhost:3100/baseR4'));

  let [defaultMeasure, setDefaultMeasure] = useState(get(Meteor, 'settings.public.saner.defaultMeasure', ''));

  // let [reportingRangeStartDate, setReportingRangeStartDate] = useState(Session.get('reportingRangeStartDate'));
  // let [reportingRangeEndDate, setReportingRangeEndDate] = useState(Session.get('reportingRangeStartDate'));
  let [reportingRangeStartDate, setReportingRangeStartDate] = useState(moment().subtract(1, 'day').format('YYYY-MM-DD'));
  let [reportingRangeEndDate, setReportingRangeEndDate] = useState(moment().format('YYYY-MM-DD'));

  logger.info('SanerLeaderboard.reportingRangeStartDate', reportingRangeStartDate)
  logger.info('SanerLeaderboard.reportingRangeEndDate', reportingRangeEndDate)

  //-------------------------------------------------------------------
  // Tracking


  let organizationsCursor;
  organizationsCursor = useTracker(function(){
    return Organizations.find({}, {sort: {
      name: 1
    }});
  }, [props.lastUpdated]);  
  if(organizationsCursor){
    organizations = organizationsCursor.fetch();
  }

  let locationsCursor;
  locationsCursor = useTracker(function(){
    return Locations.find({}, {sort: {
      name: 1
    }});
  }, [props.lastUpdated]);  
  if(locationsCursor){
    locations = locationsCursor.fetch();
  }



  let hospitalLocationsCursor;
  hospitalLocationsCursor = useTracker(function(){
    return HospitalLocations.find();
  }, [props.lastUpdated]);  
  if(hospitalLocationsCursor){
    hospitalLocations = hospitalLocationsCursor.fetch();
  }


  let leaderboardLocationsCursor;
  leaderboardLocationsCursor = useTracker(function(){
    return LeaderboardLocations.find();
  }, [props.lastUpdated]);  
  if(leaderboardLocationsCursor){
    leaderboardLocations = leaderboardLocationsCursor.fetch();
  }


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

  reportingRangeStartDate = useTracker(function(){    
    return Session.get('reportingRangeStartDate')
  }, []);  

  reportingRangeEndDate = useTracker(function(){    
    return Session.get('reportingRangeEndDate')
  }, []);  


  //-------------------------------------------------------------------
  // Filter Methods

  let measureReportQuery = {
    measure: get(Meteor, 'settings.public.saner.defaultMeasure', ''),
    'period.start': {$gte: new Date(reportingRangeStartDate)}, 
    'period.end': {$lt: new Date(moment(reportingRangeStartDate).add(1, 'days').format('YYYY-MM-DD'))}, 
  }

  console.log('measureReportQuery', measureReportQuery);
  
  // measureReports = useTracker(function(){
  //   return MeasureReports.find(measureReportQuery).fetch();
  //   // return MeasureReports.find();
  // }, []);  

  measureReports = MeasureReports.find(measureReportQuery).fetch()

  let measureReportCount = 0;
  // measureReportCount = useTracker(function(){    
  //   return MeasureReports.find(measureReportQuery).count()
  // }, []);  

  measureReportCount = MeasureReports.find(measureReportQuery).count()

  //-------------------------------------------------------------------
  // Lookup

  function lookupOrgsAndLocations(){
    console.log("Looking up orgs and locations...");

    let measureReports = MeasureReports.find(measureReportQuery).forEach(function(report){
      console.log('Location:     ' + get(report, 'subject.reference'));
      if(has(report, 'subject.reference')){
        let locationLookupUrl = get(Meteor, 'settings.public.interfaces.default.channel.endpoint') + '/' + get(report, 'subject.reference') + '?_format=json';
        console.log('locationLookupUrl', locationLookupUrl)
        HTTP.get(locationLookupUrl, function(error, result){
          if(result.statusCode === 200){
            let parsedResults = JSON.parse(result.content);
            
            //console.log('parsedResults', parsedResults)
            if(get(parsedResults, 'resourceType') === "Location"){
              Locations.insert(parsedResults, {filter: false, validate: false}, function(err){
                if(err){
                  console.log('err', err)
                }
              })
            }
          } else {
            console.log("HTTP Code: " + result.statusCode)
          }
          // if(error){
          //   console.log('error', error)
          // }
        });
      }

      console.log('Organization: ' + get(report, 'reporter.reference'));
      if(has(report, 'reporter.reference')){
        let organizationLookupUrl = get(Meteor, 'settings.public.interfaces.default.channel.endpoint') + '/' + get(report, 'reporter.reference') + '?_format=json';
        console.log('organizationLookupUrl', organizationLookupUrl)

        HTTP.get(organizationLookupUrl, function(error, result){
          if(result.statusCode === 200){
            let parsedResults = JSON.parse(result.content);
            
            //console.log('parsedResults', parsedResults)
            if(get(parsedResults, 'resourceType') === "Organization"){
              Organizations.insert(parsedResults, {filter: false, validate: false}, function(err){
                if(err){
                  console.log('err', err)
                }
              })
            }
          } else {
            console.log("HTTP Code: " + result.statusCode)
          }
          // if(error){
          //   console.log('error', error)
          // }
        })
      }
    });
  }


  //-------------------------------------------------------------------
  // Button Methods


  function filterPreferences(){    
    Session.set('mainAppDialogTitle', "Filter Preferences");
    Session.set('mainAppDialogComponent', "FilterPreferencesDialog");
    Session.set('lastUpdated', new Date())
    Session.set('mainAppDialogOpen', true);
  }
  function collateMeasureReports(){
    console.log('Collating measure reports...');

    let allReports = MeasureReports.find().fetch();

    console.log('allReports', allReports);

    console.log('measureReportQuery', measureReportQuery)

    let dailyMeasureCohort = MeasureReports.find(measureReportQuery).fetch();

    console.log('dailyMeasureCohort', dailyMeasureCohort);

    setMeasureReports(dailyMeasureCohort)

  }
  function handleGeocodeAddresses(props){
    logger.warn('SanerLeaderboard.handleGeocodeAddresses()');
    // logger.debug('SanerLeaderboard.handleGeocodeAddresses().patients?', );

    Locations.find().forEach(function(location){
      Meteor.call('geocodeLocation', location, function(error, result){
        if(error){
          console.log('geocodeAddress.error', error)
        }
        if(result){
          console.log('geocodeAddress.result', result)
 
          if(get(result, 'resourceType') === "Location"){
            Locations.upsert({_id: result._id}, {$set: result }, {filter: false, validate: false});
            setLocations(Locations.find().fetch())
          }
        }
      })
    });
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


  function handleEncodeMeasureScore(){
    console.log('Click! Encoding measure score...', measureReportQuery)

    Meteor.call('encodeMeasureScores', measureReportQuery, function(error, result){
      if(result){
        console.log('Received the completion signal.  All measure scores should be converted to Locations.')
        setLocations(Locations.find().fetch())
      }
    });

    // MeasureReports.find(measureReportQuery).forEach(function(report){
    //   console.log('report', report)
    //   let locationId = FhirUtilities.pluckReferenceId(get(report, 'subject.reference'));
    //   console.log('locationId', locationId)

    //   let groupPopulationCount = 0;

    //   if(Array.isArray(report.group)){
    //     report.group.forEach(function(group){
    //       //console.log('group', group);
    //       if(get(group, 'code.coding[0].code') === "Beds"){

    //         if(has(report, 'group[0].measureScore.value')){
    //           groupPopulationCount = get(report, 'group[0].measureScore.value', '');
    //         } else if(Array.isArray(group.population)){
    //           group.population.forEach(function(pop){
    //             //console.log('pop', pop)
    //             if(Array.isArray(get(pop, 'code.coding'))){
    //               pop.code.coding.forEach(function(encoding){
    //                 //console.log('encoding', encoding)

    //                 // REFACTOR / EXTRACT
    //                 // This is a CDC code for the SANER implementation
    //                 if(get(encoding, 'code') === "numBeds"){
    //                   //console.log('numBeds: ', pop.count)
    //                   groupPopulationCount = pop.count;
    //                 }
    //               })
    //             }
    //           })
    //         }
    //       }
    //     })
    //   }

    //   let location = Locations.findOne({id: locationId})
    //   if(location){
    //     console.log('location', location);
        
    //     delete location._document;
    //     location.extension = [{
    //       url: 'numBeds',
    //       valueDecimal: groupPopulationCount
    //     }]
  
    //     Locations.update({_id: location._id}, {$set: location}, function(error, result){
    //       if(result){
    //         setLocations(Locations.find().fetch())
    //       }
    //       if(error){
    //         console.log('error', error)
    //         setLocations(Locations.find().fetch())
    //       }
    //     })
    //   } else {
    //     console.log("Could not find location by id");
    //   }
    // })    
  }

  let measure = Measures.findOne({_id: selectedMeasureId});
  console.log('SanerLeaderboard.measure', measure)

  let leaderboardTitle = get(measure, "name", "Hospital Capacity");



  //-------------------------------------------------------------------
  // Bar Chart

  let barData = [];

  MeasureReports.find().forEach(function(report){
    let periodEnd = get(report, 'period.end');
    let year = moment(periodEnd).year();
    let month = moment(periodEnd).month();
    let shortMonth = moment.monthsShort(moment(periodEnd).month());
    let bucketName = moment(periodEnd).format("YYYYMMDD");
    let bucketIndex = 0;
    let bucket;
    let bucketArray = [];
    // let timeIndex = year + ("0" + month).slice(-2)
    let timeIndex = moment(periodEnd).format("YYYYMMDD");

    // console.log('bucketName', bucketName);

    // has this bucket been created yet?
    if(findIndex(barData, {'reportDate': bucketName}) === -1){
      barData.push({
        "index": Number(timeIndex),
        "reportDate": bucketName,
        "cdc": 0,
        "fema": 0
      })
    } 

    bucketIndex = findIndex(barData, {'reportDate': bucketName});

    if(bucketIndex > -1){
      bucketArray = pullAt(barData, [bucketIndex]);
      bucket = bucketArray[0];

      // console.log('bucket', JSON.stringify(bucket))

      let measureUrl = get(report, 'measure');
      if(measureUrl.includes('CDC')){
        bucket.cdc++;
      } else if(measureUrl.includes('FEMA')){
        bucket.fema++;
      }

      barData.push(bucket);
    }
  })

  // console.log('barData', barData)

  logger.data('WorkflowDashboard.barData', { data: barData }, {source: "WorkflowDashboard.jsx"});


  //-------------------------------------------------------------------
  // Methods
  
  // selectedStartDate = moment(selectedStartDate).format("YYYY-MM-DD");
  // selectedEndDate = moment(selectedEndDate).format("YYYY-MM-DD");  

  let renderContent;
  // if(onePageLayout){
  //   renderContent = <div>
  //     <CardHeader 
  //       title={leaderboardTitle}
  //        />
  //       <StyledCard heigh="auto" margin={20}>
  //         <CardContent>
  //           <LocationsTable
  //             locations={leaderboardLocations}
  //             rowsPerPage={10}
  //             hideActionIcons={true}
  //             hideExtensions={false}
  //             size="medium"
  //             extensionUrl={Session.get('LocationsTable.extensionUrl')}
  //             count={leaderboardLocationsCount}
  //           />
  //         </CardContent>
  //       </StyledCard>
  //   </div>
  // } else {
    renderContent = <Grid container>
      <Grid item md={4} style={{paddingRight: '10px'}}>
        <CardHeader 
          title={measureReportCount + " Measure Reports"}
          subheader={defaultMeasure}
        />
        <StyledCard style={{height: '680px'}} margin={20}>
          <CardContent>
            <MeasureReportsTable 
              count={measureReportCount}
              measureReports={measureReports}     
              hideType
              hideNumerator
              hideDenominator
              hideBarcode       
              rowsPerPage={10}
              measureScoreLabel="Beds"
              sortByMeasureScore
            />
          </CardContent>
          <CardActions>
            <Button color="primary" variant="contained" onClick={ lookupOrgsAndLocations.bind(this) } style={{marginTop: '15px'}}>
              Lookup Orgs & Locations
            </Button>
          </CardActions>
        </StyledCard>
      </Grid>
      <Grid item md={4} style={{paddingRight: '10px', paddingLeft: '10px'}}>
        <CardHeader title={organizationCount + " Organizations"} subheader="Unique organizations that have reported in." />
        <StyledCard style={{height: '680px'}} margin={20}>
          <CardContent>
            <OrganizationsTable
              count={organizationCount}
              organizations={organizations}
              hidePhone
              hideEmail
              hideIdentifier
              hideActionIcons
              rowsPerPage={10}

            />
          </CardContent>
        </StyledCard>
        
      </Grid>
      <Grid item md={4} style={{paddingLeft: '10px'}}>
        <CardHeader title={locationsCount + " Locations"} subheader="Unique locations reporting in." />
        <StyledCard style={{height: '680px'}} margin={20}>
          <CardContent>
            <LocationsTable
              locations={locations}
              rowsPerPage={7}
              hideActionIcons
              size="medium"
              hideExtensions={false}
              extensionUrl={Session.get('LocationsTable.extensionUrl')}
              count={locationsCount}
              hideCity
              hideState
              hideCountry
              hidePostalCode
              hideType
              hideAddress
              multiline
              extensionUrl="numBeds"
              extensionLabel="Beds"

            />
          </CardContent>
          <CardActions>
            <Button color="primary" onClick={ handleGeocodeAddresses.bind(this) } style={{marginTop: '15px'}} >
              Geocode Addresses
            </Button>
            <Button color="primary" onClick={ handleEncodeMeasureScore.bind(this) } style={{marginTop: '15px'}} >
              Encode Measure Score
            </Button>
          </CardActions>
        </StyledCard>
      </Grid>
    </Grid>
  // }

  return (
    <PageCanvas id='SanerLeaderboard' headerHeight={158} >
      <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} local="en">
        <CardHeader title="Reporting Participation" />
        <StyledCard margin={20}>
          <CardContent>
            <div id="historyBarChart" style={{width: (window.innerWidth - 260 ) + 'px', height: '300px', minHeight: '200px' }}>
              <ResponsiveBar
                data={barData}
                keys={[ 'cdc', 'fema']}
                indexBy="reportDate"
                margin={{ top: 20, right: 130, bottom: 20, left: 60 }}
                padding={0.3}        
                colors={['#ff9d1b', '#ffd090', '#ffe0b8','#fff1df']}  // https://colordesigner.io/
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'month',
                    legendPosition: 'middle',
                    legendOffset: 32
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
                legends={[
                  {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [{
                      on: 'hover',
                      style: {
                        itemOpacity: 1
                      }
                    }]
                  }
                ]}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
              />
            </div>
          </CardContent>
          <CardActions>
            <Button onClick={ filterPreferences.bind(this) } >
              Parameters
            </Button>
            <Button onClick={ collateMeasureReports.bind(this) } >
              Collate Measure Reports
            </Button>
          </CardActions>
        </StyledCard>   
        <DynamicSpacer />   
        <DynamicSpacer />     
        { renderContent }
      </MuiPickersUtilsProvider>            
    </PageCanvas>
  );
}

export default SanerLeaderboard;