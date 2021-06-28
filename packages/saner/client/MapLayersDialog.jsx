import React, { useState } from 'react';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Input,
  
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CardContent from '@material-ui/core/CardContent';


import { get, has } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';
import JSON5 from 'json5';

import moment from 'moment';

import { PageCanvas, StyledCard, PatientTable } from 'material-fhir-ui';
import { useTracker } from './Tracker';


import { Icon } from 'react-icons-kit';
import {ic_layers} from 'react-icons-kit/md/ic_layers'

function DynamicSpacer(props){
  return <br className="dynamicSpacer" style={{height: '40px'}}/>;
}

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

Session.setDefault('mappingParameterIndex', get(Meteor, 'settings.public.saner.mappingParameterIndex', 0));
function MapLayersDialog(props){

  const classes = useStyles();

  var [mappingParameterIndex, setMappingParameter] = useState(0);
  
  // mappingParameterIndex = useTracker(function(){    
  //   return Session.get('mappingParameterIndex')
  // }, [props.lastUpdated]);  

  var mapParameters = useTracker(function(){
    return Session.get('mapParameters');
  }, [props.lastUpdated]);  

  if(has(mapParameters, 'populationCode')){
    switch (get(mapParameters, 'populationCode')) {
      case 'adult_icu_bed_utilization':
        mappingParameterIndex = 8;
        break;
      case 'inpatient_beds_utilization':
        mappingParameterIndex = 9;
        break;
      case 'percent_of_inpatients_with_covid':
        mappingParameterIndex = 10;
        break;
      case 'adult_icu_bed_covid_utilization':
        mappingParameterIndex = 11;
        break;                
      default:
        mappingParameterIndex = 0;
        break;
    } 
  }

    
  function handleChangeMappingParameter(event){
    console.log('handleChangeMappingParameter', event)
    setMappingParameter(event.target.value)    

    // switch (event.target.value) {
    //   case 7:
    //     Session.set('mappingParameterIndex', 'numICUBeds')        
    //     break;
    //   case 8:
    //     Session.set('mappingParameterIndex', 'adult_icu_bed_utilization')        
    //     break;
    //   default:
    //     Session.set('mappingParameterIndex', 'numBeds')        
    //     break;
    // }
  }

  if(mappingParameterIndex === null){
    mappingParameterIndex = 0;
  }

  console.log('mappingParameterIndex', mappingParameterIndex);

  return (
    <CardContent>   
      <h1 style={{marginTop: '40px', marginBotton: '40px'}}>{ moment(get(mapParameters, 'startDate')).format("MMM DD, YYYY")}</h1>
      {/* <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} local="en">
        <KeyboardDatePicker
          fullWidth
          variant="inline"
          format="MMM DD, YYYY"
          margin="normal"
          id="lastReportedDataDate"
          label="Date of Last Reported Data"
          value={moment().format("MMM DD, YYYY")}
          style={{fontSize: '150%', marginBottom: '40px', marginTop: '40px'}}
          disabled
        />
      </MuiPickersUtilsProvider>   */}

      {/* <FormControl style={{width: '100%', paddingBottom: '20px'}}> */}
        <InputLabel htmlFor="mapping-parameters-label" id="mapping-parameters-label">Mapping Parameter</InputLabel>
        <Select
          id="mapping-parameters-label"
          value={ mappingParameterIndex }
          onChange={ handleChangeMappingParameter }
          fullWidth
          >
          <MenuItem value={1} >Number of Beds</MenuItem>
          <MenuItem value={2} disabled >Beds In Use</MenuItem>
          <MenuItem value={3} >Percentage of Beds In Use</MenuItem>
          <MenuItem value={4} disabled >Number of Ventilators</MenuItem>
          <MenuItem value={5} disabled >Ventilators In Use</MenuItem>
          <MenuItem value={6} disabled >Percentage of Ventilators In Use</MenuItem>
          <MenuItem value={7} >Number of ICU Beds</MenuItem>
          <MenuItem value={8} >Percent ICU Bed Capacity</MenuItem>          
          <MenuItem value={9} >Percent Inpatient Bed Capacity</MenuItem>          
          <MenuItem value={10} >Percent Inpatient With Covid</MenuItem>          
          <MenuItem value={11} >Percent ICU Patients With Covid</MenuItem>          
        </Select>

        <Grid style={{marginTop: '40px'}}>
          <Grid item md={12}>
            <InputLabel htmlFor="10_color">0% - 10%</InputLabel>
            <Input
              disableUnderline={true}
              fullWidth
              id="10_color"
              type="color"
              value="#dee8f2"
              style={{minWidth: '120px', marginBottom: '10px'}}
            />  
          </Grid>
          <Grid item md={12}>
            <InputLabel htmlFor="20_color">10% - 20%</InputLabel>
            <Input
              disableUnderline={true}
              fullWidth
              id="20_color"
              type="color"
              value="#ced8e9"
              style={{minWidth: '120px', marginBottom: '10px'}}
            />  
          </Grid>
          <Grid item md={12}>
            <InputLabel htmlFor="30_color">20% - 30%</InputLabel>
            <Input
              disableUnderline={true}
              fullWidth
              id="30_color"
              type="color"
              value="#bec7e0"
              style={{minWidth: '120px', marginBottom: '10px'}}
            />  
          </Grid>
          <Grid item md={12}>
            <InputLabel htmlFor="40_color">30% - 40%</InputLabel>
            <Input
              disableUnderline={true}
              fullWidth
              id="40_color"
              type="color"
              value="#adb7d7"
              style={{minWidth: '120px', marginBottom: '10px'}}
            />              
          </Grid>
          <Grid item md={12}>
            <InputLabel htmlFor="50_color">40% - 50%</InputLabel>
            <Input
              disableUnderline={true}
              fullWidth
              id="50_color"
              type="color"
              value="#9da7ce"
              style={{minWidth: '120px', marginBottom: '10px'}}
            />  
          </Grid>
          <Grid item md={12}>
            <InputLabel htmlFor="60_color">50% - 60%</InputLabel>
            <Input
              disableUnderline={true}
              fullWidth
              id="60_color"
              type="color"
              value="#8d97c5"
              style={{minWidth: '120px', marginBottom: '10px'}}
            />              
          </Grid>
          <Grid item md={12}>
            <InputLabel htmlFor="70_color">60% - 70%</InputLabel>
            <Input
              disableUnderline={true}
              fullWidth
              id="70_color"
              type="color"
              value="#954e94"
              style={{minWidth: '120px', marginBottom: '10px'}}
            />              
          </Grid>
          <Grid item md={12}>
            <InputLabel htmlFor="80_color">70% - 80%</InputLabel>
            <Input
              disableUnderline={true}
              fullWidth
              id="80_color"
              type="color"
              value="#a34282"
              style={{minWidth: '120px', marginBottom: '10px'}}
            />                          
          </Grid>
          <Grid item md={12}>
            <InputLabel htmlFor="90_color">80% - 90%</InputLabel>
            <Input
              disableUnderline={true}
              fullWidth
              id="90_color"
              type="color"
              value="#b13771"
              style={{minWidth: '120px', marginBottom: '10px'}}
            />                          
          </Grid>
          <Grid item md={12}>
            <InputLabel htmlFor="100_color">90% - 100%</InputLabel>
            <Input
              disableUnderline={true}
              fullWidth
              id="100_color"
              type="color"
              value="#c02b5f"
              style={{minWidth: '120px', marginBottom: '10px'}}
            />                          
          </Grid>
          <Grid item md={12}>
            <InputLabel htmlFor="over_100_color">> 100%</InputLabel>
            <Input
              disableUnderline={true}
              fullWidth
              id="over_100_color"
              type="color"
              value="#dc143c"
              style={{minWidth: '120px', marginBottom: '10px'}}
            />                          
          </Grid>
        </Grid>
      {/* </FormControl> */}
      
    </CardContent>
  );
}




export default MapLayersDialog;