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

function FilterPreferencesDialog(props){



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

  const handleChangeGroup = (event) => {
    setGroupText(event.target.value);
  };
  const handleChangePopulationCode = (event) => {
    setPopulationCodeText(event.target.value);
  };

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
    console.log('Updating query start date', newDate);

    setQueryStartDate(moment(newDate).format("YYYY-MM-DD"))

    Session.set('reportingRangeStartDate', moment(newDate).format("YYYY-MM-DD"));
    Session.set('reportingRangeStartDate', moment(newDate).add(1, 'days').format("YYYY-MM-DD"));
    Session.set('lastUpdated', new Date())
  }

  function handleEndDateChange(event, newDate){
    setQueryEndDate(moment(newDate).format("YYYY-MM-DD"));

    Session.set('reportingRangeEndDate', moment(newDate).format("YYYY-MM-DD"));
    Session.set('lastUpdated', new Date())
  }
  const handleClose = () => {
    Session.set('mainAppDialogOpen', false);
  };
  const handleSave = () => {
    
    // console.log('Saving filter preferences')
  
    // console.log('Population Code Text', populationCodeText);
    // console.log('Group Text', groupText);
    // console.log('Start Date', queryStartDate);    
    
    Session.set('mapParameters', {
      populationCode: populationCodeText,
      group: groupText,
      startDate: queryStartDate
    })
    Session.set('mainAppDialogOpen', false);
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
      <DialogContent dividers={scroll === 'paper'} style={{minWidth: '600px', fontSize: '120%'}}>
        <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} local="en">
          <Grid container spacing={3}>
            <Grid item md={12}>
              <FormControl style={{width: '100%', marginTop: '20px'}}>
                <InputLabel>Measure URL</InputLabel>
                <Input
                  id="measureUrl"
                  name="measureUrl"
                  defaultValue={ defaultMeasure }
                  // onChange={handleFhirEndpointChange}
                  fullWidth
                  disabled
                />
              </FormControl>
            </Grid>
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
                  onChange={handleStartDateChange.bind(this)}
                  // disabled={checkedDateRangeEnabled ? false : true}
                />
                <FormControl style={{width: '100%', marginTop: '20px'}}>
                  <InputLabel id="group-select-label">Group</InputLabel>
                  <Select
                    // labelId="group-select-label"
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
                  {/* <Input
                    id="populationCode"
                    name="populationCode"
                    defaultValue={ populationCodeText }
                    onChange={handleChangePopulationCode}
                    fullWidth
                  /> */}
                  <Select
                    // labelId="population-code-select-label"
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
            </Grid>
            {/* <Grid item md={6}>
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
            </Grid> */}
          </Grid>
        </MuiPickersUtilsProvider>
        {/* <br /><br />
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
        /> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave.bind(this)} color="primary" variant="contained" fullWidth style={{marginTop: '10px', marginBottom: '10px'}}>
          Save
        </Button>
      </DialogActions>
    </div> 
  }


  return (renderContent);
}




export default FilterPreferencesDialog;