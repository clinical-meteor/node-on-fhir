import { 
  Grid, 
  Container,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  TextField,
  DatePicker,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';



import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';

import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import { get, set } from 'lodash';
import moment from 'moment';

import { FhirDehydrator } from 'fhir-starter';


//=============================================================================================================================================
// Session Variables

Session.setDefault('watersNewMeasureReport', null);


//=============================================================================================================================================
// Global Theming  

import { ThemeProvider, makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  button: {
    background: theme.background,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: theme.buttonText,
    height: 48,
    padding: '0 30px',
  },
  input: {
    marginBottom: '20px'
  },
  compactInput: {
    marginBottom: '10px'
  },
  label: {
    paddingBottom: '10px'
  }
}));


//=============================================================================================================================================
// MAIN COMPONENT 


function MeasureReportDetail(props){

  let classes = useStyles();

  //-------------------------------------------------------
  // Component Life Cycle

  useEffect(function(){
    Session.set('watersNewMeasureReport', assembleMeasureReport())    
  })
  
  //-------------------------------------------------------
  // Component Props

  let { 
    children, 
    ...otherProps 
  } = props;


  console.log('MeasureReportDetail.props', props)

  //-------------------------------------------------------
  // Component State

  let [measureReport, setMeasureReport] = useState(props.measureReport);
  let [measureReportId, setMeasureReportId] = useState(props.measureReportId);

  let [identifier, setIdentifier] = useState(get(props.measureReport, 'identifier[0].value', ''));
  let [status, setStatus] = useState(get(props.measureReport, 'status', 'preliminary'));
  let [type, setType] = useState(get(props.measureReport, 'type', 'summary'));
  let [dateGenerated, setDateGenerated] = useState(get(props.measureReport, 'date', moment().format("YYYY-MM-DD")));
  let [internalMeasure, setMeasure] = useState(get(props.measureReport, 'measure', props.measure));
  let [periodStart, setPeriodStart] = useState(get(props.measureReport, 'period.start', moment().format("YYYY-MM-DD")));
  let [periodEnd, setPeriodEnd] = useState(get(props.measureReport, 'period.end', moment().add(1, "days").format("YYYY-MM-DD")));


  //-------------------------------------------------------
  // Helper Functions

  function assembleMeasureReport(){
    let newObservation = {
      resourceType: 'MeasureReport',
      identifier: [],
      measure: internalMeasure,
      status : status,
      type : type,
      date: null,
      period: {
        start: null,
        end: null
      }
    };

    if(identifier){
      newObservation.identifier.push({
        system: "waters-identifier-tbd",
        value: identifier
      })
    }

    if(dateGenerated){
      newObservation.date = dateGenerated;
    }
    if(periodStart){
      newObservation.period.start = periodStart;
    }
    if(periodEnd){
      newObservation.period.end = periodEnd;
    }

    return newObservation;
  }


  function renderDatePicker(displayDatePicker, effectiveDateTime){
    if(typeof effectiveDateTime === "string"){
      effectiveDateTime = moment(effectiveDateTime);
    }
  }

  function handleUpdateMeasureReport(field, event, textValue){
    console.log("MeasureReportDetail.handleUpdateMeasureReport", field, textValue);
    
    updateMeasureReportFields(field, textValue);
    Session.set('watersNewMeasureReport', assembleMeasureReport())    
  }

  function updateMeasureReportFields(field, textValue){
    switch (field) {
      case "identifier":
        setIdentifier(textValue);
        break;      
      case "status":
        setStatus(textValue);
        break;      
      case "type":
        setType(textValue);
        break;      
      case "dateGenerated":
        setDateGenerated(textValue);
        break;      
      case "measure":
        setMeasure(textValue);
        break;      
      case "periodStart":
        setPeriodStart(textValue);
        break;      
      case "periodEnd":
        setPeriodEnd(textValue);
        break;      
    }
  }

  let renderElements = [];
  let groups = get(measureReport, 'group');

  if(Array.isArray(groups)){
    groups.forEach(function(group){
      renderElements.push(<Grid item xs={9}>
        <FormControl style={{width: '100%', marginTop: '20px'}}>
          <InputAdornment className={classes.label}>Group Code</InputAdornment>
          <Input
            id="groupCodeInput"
            name="groupCodeInput"
            className={classes.input}       
            value={get(group, 'code.coding[0].code')}
            fullWidth              
          />       
        </FormControl>   
      </Grid>)
      renderElements.push(<Grid item xs={3}>
        <FormControl style={{width: '100%', marginTop: '20px'}}>
          <InputAdornment className={classes.label}>Measure Score</InputAdornment>
          <Input
            id="measureScoreInput"
            name="measureScoreInput"
            className={classes.input}       
            value={get(group, 'measureScore.value')}
            fullWidth              
          />       
        </FormControl>     
      </Grid>)

      let populations = get(group, 'population');
      if(Array.isArray(populations)){
        populations.forEach(function(subPopulation){
          if(props.showPopulationCode){
            renderElements.push(<Grid item xs={9}>
              <FormControl style={{width: '100%', marginTop: '20px'}}>
                <InputAdornment className={classes.label}>Population Code</InputAdornment>
                <Input
                  id={"populationCodeInput-" + get(subPopulation, 'id')}
                  name={"populationCodeInput-" + get(subPopulation, 'id')}
                  className={classes.input}       
                  value={get(subPopulation, 'code.text')}
                  fullWidth              
                />       
              </FormControl>   
            </Grid>)
            renderElements.push(<Grid item xs={3}>
              <FormControl style={{width: '100%', marginTop: '20px'}}>
                <InputAdornment className={classes.label}>Count</InputAdornment>
                <Input
                  id={"populationCodeInput-" + get(subPopulation, 'id')}
                  name={"populationCodeInput-" + get(subPopulation, 'id')}
                  className={classes.input}       
                  value={get(subPopulation, 'count')}
                  fullWidth              
                />       
              </FormControl>   
            </Grid>)
          }
        })
      }
    })    
  }


  return(
    <div className='MeasureReportDetails'>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Identifier</InputAdornment>
              <Input
                id="identifierInput"
                name="identifierInput"
                className={classes.input}
                placeholder="XYZ.1"              
                value={identifier}
                onChange={handleUpdateMeasureReport.bind(this, 'identifier')}
                fullWidth              
              />
            </FormControl>  
        </Grid>
        <Grid item xs={3}>
          <FormControl style={{width: '100%', marginTop: '20px'}}>
            <InputAdornment className={classes.label}>Status</InputAdornment>
            <Input
              id="statusInput"
              name="statusInput"
              className={classes.input}
              placeholder="active"              
              value={status}
              onChange={handleUpdateMeasureReport.bind(this, 'status')}
              fullWidth              
            />    
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl style={{width: '100%', marginTop: '20px'}}>
            <InputAdornment className={classes.label}>Type</InputAdornment>
            <Input
              id="typeInput"
              name="typeInput"
              className={classes.input}
              value={type}
              onChange={handleUpdateMeasureReport.bind(this, 'type')}
              fullWidth              
            />          
          </FormControl> 
        </Grid>
        <Grid item xs={3}>
          <FormControl style={{width: '100%', marginTop: '20px'}}>
            <InputAdornment className={classes.label}>Date Generated</InputAdornment>
            <Input
              id="dateGeneratedInput"
              name="dateGeneratedInput"
              className={classes.input}
              placeholder="YYYY-MM-DD"              
              type="date"  
              value={moment(dateGenerated).format("YYYY-MM-DD")}
              onChange={handleUpdateMeasureReport.bind(this, 'dateGenerated')}
              InputLabelProps={{ shrink: true }}
              fullWidth              
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl style={{width: '100%', marginTop: '20px'}}>
            <InputAdornment className={classes.label}>Measure</InputAdornment>
            <Input
              id="measureInput"
              name="measureInput"
              className={classes.input}
              placeholder="http://hl7.org/fhir/us/saner/Measure/HHSProtectCaresActReport"              
              value={internalMeasure}
              onChange={handleUpdateMeasureReport.bind(this, 'measure')}
              fullWidth              
            />
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl style={{width: '100%', marginTop: '20px'}}>
            <InputAdornment className={classes.label}>Period Start</InputAdornment>
            <Input
              id="periodStartInput"
              name="periodStartInput"
              className={classes.input}
              placeholder="YYYY-MM-DD"  
              type="date"      
              value={moment(periodStart).format("YYYY-MM-DD")} 
              onChange={handleUpdateMeasureReport.bind(this, 'periodStart')}
              InputLabelProps={{ shrink: true }}           
              fullWidth              
            />
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl style={{width: '100%', marginTop: '20px'}}>
            <InputAdornment className={classes.label}>Period End</InputAdornment>
            <Input
              id="periodEndInput"
              name="periodEndInput"
              className={classes.input}
              placeholder="YYYY-MM-DD"    
              type="date"  
              value={moment(periodEnd).format("YYYY-MM-DD")} 
              onChange={handleUpdateMeasureReport.bind(this, 'periodEnd')}                     
              InputLabelProps={{ shrink: true }}
              fullWidth              
            />
          </FormControl>
        </Grid>
        

        { renderElements }

      </Grid>
    </div>
  );
}

MeasureReportDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  measureReportId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  measureReport: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  measure: PropTypes.string,

  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  showPopulationCode: PropTypes.bool,

  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};
MeasureReportDetail.defaultProps = {
  showPopulationCode: true,
  measureReportId: '',
  measure: ''
}

export default MeasureReportDetail;