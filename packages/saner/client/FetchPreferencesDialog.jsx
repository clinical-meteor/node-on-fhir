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
  LinearProgress, 
  FormControl,
  FormHelperText,
  MenuItem,
  Input, 
  InputLabel,
  Select
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  }
}));


//==============================================================================================
// MAIN COMPONENT

function FetchPreferencesDialog(props){



  const classes = useStyles();
  
  let [fhirServerEndpoint, setFhirServerEndpoint] = useState(get(Meteor, 'settings.public.interfaces.default.channel.endpoint', 'http://localhost:3100/baseR4'));

  let [fetchMeasures, setFetchMeasures] = useState(false);
  let [fetchMeasureReports, setFetchMeasureReports] = useState(true);
  let [fetchLocations, setFetchLocations] = useState(false);

  let [queryStartDate, setQueryStartDate] = useState(get(Meteor, 'settings.public.saner.defaultDate', moment().subtract(1, 'day').format("YYYY-MM-DD")));
  let [queryEndDate, setQueryEndDate] = useState(moment().format("YYYY-MM-DD"));

  let [isFetchingData, setIsFetchingData] = useState(false);
  let [httpStatusCode, setHttpStatusCode] = useState(false);

  let [groupText, setGroupText] = useState("Beds");
  let [populationCodeText, setPopulationCodeText] = useState(get(Meteor, 'settings.public.saner.measureScore'));

  let [hhsFetchUrl, setHhsFetchUrl] = useState(get(Meteor, 'settings.public.saner.proxies.hhs'));
  let [cdcFetchUrl, setCdcFetchUrl] = useState(get(Meteor, 'settings.public.saner.proxies.cdc'));

  const handleChangeGroup = (event) => {
    setGroupText(event.target.value);
  };
  const handleChangePopulationCode = (event) => {
    setPopulationCodeText(event.target.value);
  };

  
  function fetchHhsData(){
    console.log('Asking proxy server to fetch Department of Health and Human Services data...');

    Meteor.call('fetchHhsData', hhsFetchUrl)
  }
  function changeHhsUrl(event){
    console.log('Changing HHS Url', event.target.value);

    setHhsFetchUrl(event.target.value)
  }
  function fetchCdcData(){
    console.log('Asking proxy server to fetch CDC data...');

    Meteor.call('fetchCdcData', cdcFetchUrl)
  }
  function changeCdcUrl(event){
    console.log('Changing CDC Url', event.target.value);

    setCdcFetchUrl(event.target.value)
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
  
  const handleClose = () => {
    Session.set('mainAppDialogOpen', false);
  };
  const handleSave = () => {
    
    // console.log('Saving filter preferences')
  
    // console.log('Population Code Text', populationCodeText);
    // console.log('Group Text', groupText);
    // console.log('Start Date', queryStartDate);    
    
    // Session.set('mapParameters', {
    //   populationCode: populationCodeText,
    //   group: groupText,
    //   startDate: queryStartDate
    // })
    // Session.set('mainAppDialogOpen', false);
  };

  let defaultMeasure = get(Meteor, 'settings.public.saner.defaultMeasure', '');

  let renderContent;
  
  if(isFetchingData){
    renderContent = <div style={{textAlign: 'center'}}>
      <h2 className="helveticas">Fetching data.</h2>
      <LinearProgress />
      <h1>{ httpStatusCode }</h1>
    </div>
  } else {





    renderContent = <div>
      <DialogContent dividers={scroll === 'paper'} style={{minWidth: '800px', fontSize: '120%'}}>
        <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} local="en">
          <Grid container spacing={3}>
            <Grid item md={12}>
              <a target="_blank" href="https://healthdata.gov/Hospital/COVID-19-Reported-Patient-Impact-and-Hospital-Capa/g62h-syeh">HHS Protect Covid19 Data</a><br />
              <a target="_blank" href="https://www.cdc.gov/nhsn/covid19/report-patient-impact.html">CDC NHSN Covid19 Data</a>
            </Grid>
            <Grid item md={12}>
              <FormControl style={{width: '100%', marginTop: '20px'}}>
                <InputLabel>HHS URL</InputLabel>
                <Input
                  id="hhsFetchUrl"
                  name="hhsFetchUrl"
                  value={hhsFetchUrl}
                  onChange={ changeHhsUrl.bind(this) }
                  fullWidth
                />
                <Button key="a" onClick={ fetchHhsData.bind(this) } style={{justifyContent: 'left'}}>
                  Fetch HHS Data
                </Button><br />
              </FormControl>

              <FormControl style={{width: '100%', marginTop: '20px'}}>
                <InputLabel>CDC URL</InputLabel>
                <Input
                  id="cdcFetchUrl"
                  name="cdcFetchUrl"
                  value={cdcFetchUrl}
                  onChange={ changeCdcUrl.bind(this) }
                  fullWidth
                />
                <Button key="a" onClick={ fetchCdcData.bind(this) } style={{justifyContent: 'left'}}>
                  Fetch CDC Data
                </Button><br />
              </FormControl>


              <Button disabled key="b" onClick={ fetchCdcData.bind(this) } >
                Fetch CDC Data (NHSN)
              </Button><br />
              <Button disabled key="c" onClick={ fetchIndianaApiData.bind(this) } >
                Fetch Indiana API Data
              </Button><br />
              <Button disabled key="d" onClick={ fetchChicagoCovidData.bind(this) } >
                Fetch Chicago API Data 
              </Button><br />
              <Button disabled key="e" onClick={ calcPercentUsage.bind(this) } >
                Calc Percent Usage
              </Button><br />
              <Button disabled key="f" onClick={ generateHsaLocations.bind(this) } >
                Generate HSA L docations
              </Button><br />
              <Button disabled key="g" onClick={ fetchHhsInpatientBeds.bind(this) } >
                Fetch HHS Inpatient Beds
              </Button><br />
              <Button disabled key="h" onClick={ initializePharmacyTestingSites.bind(this) } >
                Init Community Testing Sites
              </Button><br />
            </Grid>
            {/* <Grid item md={6}>
              <div>
                <KeyboardDatePicker
                  fullWidth
                  variant="inline"
                  format="YYYY-MM-DD"
                  margin="normal"
                  id="startDatePicker"
                  label="Start Date"
                  value={queryStartDate}
                  onChange={handleStartDateChange.bind(this)}
                />
                <FormControl style={{width: '100%', marginTop: '20px'}}>
                  <InputLabel id="group-select-label">Group</InputLabel>
                  <Select
                    labelId="group-select-label"
                    id="group-select"
                    value={groupText}
                    onChange={handleChangeGroup}
                  >
                    <MenuItem value="Beds">Beds</MenuItem>
                    <MenuItem value="Ventilators">Ventilators</MenuItem>
                    <MenuItem value="Encounters">Encounters</MenuItem>
                  </Select>
                </FormControl>
                <FormControl style={{width: '100%', marginTop: '20px'}}>
                  <InputLabel>Population Code</InputLabel>
                  <Select
                    labelId="population-code-select-label"
                    id="population-code-select"
                    value={populationCodeText}
                    onChange={handleChangePopulationCode}
                  >
                    <MenuItem value="percent_of_inpatients_with_covid">% Inpatients With Covid</MenuItem>
                    <MenuItem value="inpatient_beds_utilization">% Inpatient Bed Utilization</MenuItem>
                    <MenuItem value="adult_icu_bed_utilization">% ICU Bed Utilization</MenuItem>
                    <MenuItem value="adult_icu_bed_covid_utilization">% ICU Patients With Covid</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </Grid> */}
          </Grid>
        </MuiPickersUtilsProvider>
      </DialogContent>      
    </div> 
  }


  return (renderContent);
}




export default FetchPreferencesDialog;