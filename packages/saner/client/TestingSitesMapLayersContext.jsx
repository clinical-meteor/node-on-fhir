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
import {pin_1} from 'react-icons-kit/ikons/pin_1'

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
function TestingSitesMapLayersContext(props){

  const classes = useStyles();

  var [mappingParameterIndex, setMappingParameter] = useState(0);
  
  mappingParameterIndex = useTracker(function(){    
    return Session.get('mappingParameterIndex')
  }, [props.lastUpdated]);  

  let numSites = 0;
  numSites = useTracker(function(){
    return Locations.find({'type.coding.code': {$in: ['OUTPHARM', 'OUTLAB']}}).count();
  })

  function handleChangeMappingParameter(event){
    console.log('handleChangeMappingParameter', event)
    setMappingParameter(event.target.value)    

    switch (event.target.value) {
      case 7:
        Session.set('mappingParameterIndex', 'numICUBeds')        
        break;
      case 8:
        Session.set('mappingParameterIndex', 'adult_icu_bed_utilization')        
        break;
      default:
        Session.set('mappingParameterIndex', 'numBeds')        
        break;
    }
  }

  if(mappingParameterIndex === null){
    mappingParameterIndex = 0;
  }

  console.log('mappingParameterIndex', mappingParameterIndex);

  
  return (
    <CardContent>   
      <h1 style={{marginTop: '40px'}}>{ moment(get(Meteor, 'settings.public.saner.defaultDate')).format("MMM DD, YYYY")}</h1>
      <h2 style={{marginBotton: '40px'}}>{numSites} Community Testing Sites</h2>

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

        <Grid style={{marginTop: '40px'}}>
          <Grid item md={12}>
            <Icon icon={pin_1} size={32} style={{color: 'cornflowerblue'}} /><h2 style={{marginLeft: '20px', display: 'inline-block'}}>CVS</h2>
          </Grid>
          <Grid item md={12}>
            <Icon icon={pin_1} size={32} style={{color: 'green'}} /><h2 style={{marginLeft: '20px', display: 'inline-block'}}>eTrueNorth</h2>
          </Grid>
          <Grid item md={12}>
            <Icon icon={pin_1} size={32} style={{color: 'yellow'}} /><h2 style={{marginLeft: '20px', display: 'inline-block'}}>Kroger</h2>
          </Grid>
          <Grid item md={12}>
            <Icon icon={pin_1} size={32} style={{color: 'orange'}} /><h2 style={{marginLeft: '20px', display: 'inline-block'}}>RiteAid</h2>
          </Grid>
          <Grid item md={12}>
            <Icon icon={pin_1} size={32} style={{color: 'red'}} /><h2 style={{marginLeft: '20px', display: 'inline-block'}}>Wallgreens</h2>
          </Grid>
          <Grid item md={12}>
            <Icon icon={pin_1} size={32} style={{color: 'purple'}} /><h2 style={{marginLeft: '20px', display: 'inline-block'}}>Quest / Walmart Community</h2>
          </Grid>                    
        </Grid>      
    </CardContent>
  );
}




export default TestingSitesMapLayersContext;