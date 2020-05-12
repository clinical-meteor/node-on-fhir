import React, { Component, useState, useEffect } from 'react';


import { makeStyles, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';


import { get, has } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';
import JSON5 from 'json5';

import moment from 'moment';

import { Patients, Organizations, Measures, Devices, MeasureReports, MeasuresTable, MeasureReportsTable, OrganizationsTable, HospitalLocations, LocationsTable  } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import { PageCanvas, StyledCard, PatientTable } from 'material-fhir-ui';
import { useTracker } from './Tracker';


import Client from 'fhir-kit-client';

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

// Session.setDefault("fhirServerEndpoint", "http://localhost:3100/baseR4");

function DynamicSpacer(props){
  return <br className="dynamicSpacer" style={{height: '40px'}}/>;
}

let fhirClient = new Client({
  // baseUrl: get(Meteor, 'settings.public.interfaces.default.channel.endpoint', 'http://localhost:3100/baseR4')
  baseUrl: get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', 'http://localhost:3100/baseR4')
});
// console.log('Intitializing fhir-kit-client for ' + get(Meteor, 'settings.public.interfaces.default.channel.endpoint', 'http://localhost:3100/baseR4'))
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


Session.setDefault('fhirKitClientStartDate', '2020-03-01');
Session.setDefault('fhirKitClientEndDate', '2020-03-31');
Session.setDefault('totalEncountersDuringDateRange', 0);
Session.setDefault('currentEncounterSearchset', null);

Session.setDefault('encounterUrl', "https://");
Session.setDefault('conditionUrl', "https://");
Session.setDefault('procedureUrl', "https://");

Session.setDefault('geoJsonLayer', "");

function SanerLeaderboard(props){
  const classes = useStyles();

  const rowsPerPage = get(Meteor, 'settings.public.defaults.rowsPerPage', 25);

  let [patients,   setPatients]   = useState([]);
  let [measures,   setMeasures]   = useState([]);
  let [measureReports, setMeasureReports]   = useState([]);
  let [organizations,   setOrganizations]   = useState([]);
  let [devices,   setDevices]   = useState([]);
  let [hospitals,   setHospitals]   = useState([]);
  let [hospitalLocations,   setHospitalLocations]   = useState([]);
  

  let [checkedTested,  setCheckedTested]  = useState(false);
  let [fhirServerEndpoint, setFhirServerEndpoint] = useState( get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', 'http://localhost:3100/baseR4'));

  //-------------------------------------------------------------------
  // Tracking

  let patientsCursor;
  patientsCursor = useTracker(function(){
    return Patients.find();
  }, [props.lastUpdated]);  
  if(patientsCursor){
    patients = patientsCursor.fetch();
  }

  let measureCursor;
  measureCursor = useTracker(function(){    
    return Measures.find();
  }, [props.lastUpdated]);  

  if(measureCursor){
    measures = measureCursor.fetch();
  }

  let measureReportsCursor;
  measureReportsCursor = useTracker(function(){
    return MeasureReports.find();
  }, [props.lastUpdated]);  
  if(measureReportsCursor){
    measureReports = measureReportsCursor.fetch();
  }

  let devicesCursor;
  devicesCursor = useTracker(function(){
    return Devices.find();
  }, [props.lastUpdated]);  
  if(devicesCursor){
    devices = devicesCursor.fetch();
  }

  let organizationsCursor;
  organizationsCursor = useTracker(function(){
    return Organizations.find();
  }, [props.lastUpdated]);  
  if(organizationsCursor){
    organizations = organizationsCursor.fetch();
  }

  let hospitalLocationsCursor;
  hospitalLocationsCursor = useTracker(function(){
    return HospitalLocations.find();
  }, [props.lastUpdated]);  
  if(hospitalLocationsCursor){
    hospitalLocations = hospitalLocationsCursor.fetch();
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

  let measureReportCount = 0;
  measureReportCount = useTracker(function(){    
    return MeasureReports.find().count()
  }, []);  

  let organizationCount = 0;
  organizationCount = useTracker(function(){    
    return Organizations.find().count()
  }, []);  

  let deviceCount = 0;
  deviceCount = useTracker(function(){    
    return Devices.find().count()
  }, []);  

  let hospitalLocationsCount = 0;
  hospitalLocationsCount = useTracker(function(){    
    return HospitalLocations.find().count()
  }, []);  

  



  //-------------------------------------------------------------------
  // Button Methods


  function handleGeocodeAddresses(props){
    logger.warn('SanerLeaderboard.handleGeocodeAddresses()');
    logger.debug('SanerLeaderboard.handleGeocodeAddresses().patients?', organizations);

    organizations.forEach(function(organization){
      Meteor.call('geocodePatientAddress', organization, function(error, result){
        if(error){
          console.log('geocodeAddress.error', error)
        }
        if(result){
          console.log('geocodeAddress.result', result)
 
          if(get(result, 'resourceType') === "Location"){
            HospitalLocations.insert(result, {filter: false, validate: false});
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




  //-------------------------------------------------------------------
  // Methods

  
  let patientTitle = 'Patients';
  let measureTitle = 'Measures';
  let measureReportsTitle = 'Measure Reports';
  let organizationTitle = 'Organizations';
  let deviceTitle = "Devices";
  let hospitalLocationTitle = "Hospital Locations"

  if(typeof Patients === "object"){
    patientTitle = patientCount + ' Patients';
  }
  if(typeof Measures === "object"){
    measureTitle = measureCount + ' Measures';
  }
  if(typeof MeasureReports === "object"){
    measureReportsTitle = measureReportCount + ' MeasureReports';
  }
  if(typeof Organizations === "object"){
    organizationTitle = organizationCount + ' Organizations';
  }
  if(typeof Devices === "object"){
    deviceTitle = deviceCount + ' Devices';
  }
  if(typeof HospitalLocations === "object"){
    hospitalLocationTitle = hospitalLocationsCount + ' Hospital Locations';
  }
  
  selectedStartDate = moment(selectedStartDate).format("YYYY-MM-DD");
  selectedEndDate = moment(selectedEndDate).format("YYYY-MM-DD");  

  return (
    <PageCanvas id='SanerLeaderboard' headerHeight={158} >
      <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} local="en">
        <CardHeader title="Total Number of Beds" />
        <StyledCard heigh="auto" margin={20}>
          <CardContent>
            <OrganizationsTable
              organizations={organizations}
              rowsPerPage={10}
              hideActionIcons={true}
              hidePhone={true}
              hideEmail={true}
              size="normal"
            />
          </CardContent>
        </StyledCard>
      </MuiPickersUtilsProvider>            
    </PageCanvas>
  );
}

export default SanerLeaderboard;