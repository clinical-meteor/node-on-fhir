import React, { Component, useState, useEffect } from 'react';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import { 
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Grid,
  CardActions,
  LinearProgress
} from '@material-ui/core';

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import { get, has } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';

import moment from 'moment';

// import moment from 'moment';

// import {github} from 'react-icons-kit/icomoon/github'
// import { Icon } from 'react-icons-kit'

// import { PageCanvas, StyledCard, PatientTable } from 'material-fhir-ui';
// import { useTracker } from './Tracker';


//==============================================================================================
// FHIR CLIENT

import Client from 'fhir-kit-client';
let fhirClient = new Client({
  baseUrl: get(Meteor, 'settings.public.interfaces.default.channel.endpoint', 'http://localhost:3100/baseR4')
  // baseUrl: get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', 'http://localhost:3100/baseR4')
});

//==============================================================================================
// THEMING

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  githubIcon: {
    margin: '0px'
  },
}));

//==============================================================================================
// MAIN COMPONENT

function SanerFetchDialog(props){

  const classes = useStyles();
  
  let [fhirServerEndpoint, setFhirServerEndpoint] = useState(get(Meteor, 'settings.public.interfaces.default.channel.endpoint', 'http://localhost:3100/baseR4'));

  let [fetchMeasures, setFetchMeasures] = useState(false);
  let [fetchMeasureReports, setFetchMeasureReports] = useState(true);
  let [fetchLocations, setFetchLocations] = useState(false);

  let [queryStartDate, setQueryStartDate] = useState(moment().subtract(2, 'weeks').format("YYYY-MM-DD"));
  let [queryEndDate, setQueryEndDate] = useState(moment().format("YYYY-MM-DD"));

  let [isFetchingData, setIsFetchingData] = useState(false);
  let [httpStatusCode, setHttpStatusCode] = useState(false);

  function handleToggleMeasures(){
    if(fetchMeasures){
      setFetchMeasures(false)
    } else {
      setFetchMeasures(true)
    }
  }  
  function handleToggleMeasureReports(){
    if(fetchMeasureReports){
      setFetchMeasureReports(false)
    } else {
      setFetchMeasureReports(true)
    }
  }  
  function handleToggleLocations(){
    if(fetchLocations){
      setFetchLocations(false)
    } else {
      setFetchLocations(true)
    }
  }  
  function handleStartDateChange(event, newDate){
    setQueryStartDate(moment(newDate).format("YYYY-MM-DD"))

    // Session.set('fhirKitClientStartDate', moment(newDate).format("YYYY-MM-DD"));
    // Session.set('lastUpdated', new Date())
  }

  function handleEndDateChange(event, newDate){
    setQueryEndDate(moment(newDate).format("YYYY-MM-DD"));

    // Session.set('fhirKitClientEndDate', moment(newDate).format("YYYY-MM-DD"))
    // Session.set('lastUpdated', new Date())
  }
  const handleClose = () => {
    //setOpen(false);
    Session.set('mainAppDialogOpen', false);
    // Session.set('mainAppDialogJson', false);
    //Session.set('mainAppDialogJsonComponent', null);
  };
  const handleFetch = () => {
    // Session.set('mainAppDialogOpen', false);

    setIsFetchingData(true);

    console.log('fetchMeasures', fetchMeasures)
    console.log('fetchMeasureReports', fetchMeasureReports)
    console.log('fetchLocations', fetchLocations)

    let searchParams = new URLSearchParams()
    searchParams.set('period', 'le' + queryEndDate)
    searchParams.set('period', 'ge' + queryStartDate)
    searchParams.set('measure', 'http://hl7.org/fhir/us/saner/Measure/CDCPatientImpactAndHospitalCapacity')
    searchParams.set('_format', 'json')

    console.log('searchParams', searchParams.toString())

    let measureSearchUrl = fhirServerEndpoint + "/Measure"
    let measureReportSearchUrl = fhirServerEndpoint + "/MeasureReport?" + searchParams.toString()
    let locationSearchUrl = fhirServerEndpoint + "/Location"

    if(fetchMeasures){
      console.log('measureSearchUrl', measureSearchUrl)
      HTTP.get(measureSearchUrl, {headers: {
        "Accept": "application/json+fhir"
      }}, function(error, result){
       // console.log('result', result);

        if(result.statusCode === 200){
          let parsedResults = JSON.parse(get(result, "content"))
          console.log('Parsed Measure Reports', parsedResults);  
          setIsFetchingData(false);

          if(get(parsedResults, 'resourceType') === "Bundle"){
            Session.set('importBuffer', parsedResults)
            Session.set('mainAppDialogOpen', false);

          }
        } else {
          console.log('/Measure HTTP Response: ' + result.statusCode)
          setHttpStatusCode(result.statusCode)
        }  
        if(error){
          console.log('error', error)
        }
      })  
    }
    if(fetchMeasureReports){
      console.log('measureReportSearchUrl', measureReportSearchUrl)
      HTTP.get(measureReportSearchUrl, {headers: {
        "Accept": "application/json+fhir"
      }}, function(error, result){
        //console.log('result', result);

        if(result.statusCode === 200){
          let parsedResults = JSON.parse(get(result, "content"))
          console.log('Parsed Measure Reports', parsedResults);  
          setIsFetchingData(false);
          
          if(get(parsedResults, 'resourceType') === "Bundle"){
            Session.set('importBuffer', parsedResults)
            Session.set('mainAppDialogOpen', false);
          }
        } else if(get(result, 'statusCode')){
          console.log('/MeasureReport HTTP Response: ' + result.statusCode)
          setHttpStatusCode(result.statusCode)
        }
        if(error){
          console.log('error', error)
        }
      })  
    }
    if(fetchLocations){
      console.log('locationSearchUrl', locationSearchUrl)
      HTTP.get(locationSearchUrl, {headers: {
        "Accept": "application/json+fhir"
      }}, function(error, result){
        //console.log('result', result);
  
        if(result.statusCode === 200){
          let parsedResults = JSON.parse(get(result, "content"))
          console.log('Parsed Measure Reports', parsedResults);  
          setIsFetchingData(false);

          if(get(parsedResults, 'resourceType') === "Bundle"){
            Session.set('importBuffer', parsedResults)
            Session.set('mainAppDialogOpen', false);
          }
        } else {
          console.log('/Location HTTP Response: ' + result.statusCode)
          setHttpStatusCode(result.statusCode)
        }
        if(error){
          console.log('error', error)
        }
      })
    }


    // fhirClient.smartAuthMetadata().then((smartFhirUrls) => {
    //   console.log('smartAuthMetadata', smartFhirUrls);
    // });

  };

  let renderContent;
  
  if(isFetchingData){
    renderContent = <div style={{textAlign: 'center'}}>
      <h2 className="helveticas">Fetching data.  This can take 2 minutes or more.</h2>
      <LinearProgress />
      <h1>{ httpStatusCode }</h1>
    </div>
  } else {
    renderContent = <div>
      <DialogContent dividers={scroll === 'paper'} style={{minWidth: '600px', fontSize: '120%'}}>
        <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} local="en">
          <Grid container spacing={3}>
            <Grid item md={6}>
              <div>
                <KeyboardDatePicker
                  fullWidth
                  variant="inline"
                  format="YYYY-MM-DD"
                  margin="normal"
                  id="startDatePicker"
                  label="Start Date"
                  value={queryStartDate}
                  onChange={handleStartDateChange}
                  // disabled={checkedDateRangeEnabled ? false : true}
                />
              </div>
            </Grid>
            <Grid item md={6}>
              <div>
                <KeyboardDatePicker
                  fullWidth
                  variant="inline"
                  format="YYYY-MM-DD"
                  margin="normal"
                  id="endDatePicker"
                  label="End Date"
                  value={queryEndDate}
                  onChange={handleEndDateChange}
                  // disabled={checkedDateRangeEnabled ? false : true}
                />
              </div>
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
        <br /><br />
        <br /><br />
        <FormControlLabel                
          control={<Checkbox checked={fetchMeasures} onChange={handleToggleMeasures} name="fetchMeasures" />}
          label="Measures"
          style={{position: 'relative', right: '0px', top: '-70px' }}
        />
        <br /><br />
        <FormControlLabel                
          control={<Checkbox checked={fetchMeasureReports} onChange={handleToggleMeasureReports} name="fetchMeasureReports" />}
          label="Measure Reports"
          style={{position: 'relative', right: '0px', top: '-70px' }}
        />
        <br /><br />
        <FormControlLabel                
          control={<Checkbox checked={fetchLocations} onChange={handleToggleLocations} name="fetchLocations" />}
          label="Locations"
          style={{position: 'relative', right: '0px', top: '-70px' }}
        />
      </DialogContent>
      <CardActions>
        <Button onClick={handleFetch} color="primary" variant="contained" fullWidth>
          Fetch!
        </Button>
      </CardActions>
    </div> 
  }


  return (renderContent);
}




export default SanerFetchDialog;