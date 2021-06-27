import { 
  Grid,
  Button,
  CardContent,
  CardActions,
  TextField,
  DatePicker
} from '@material-ui/core';


import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import { get, set } from 'lodash';
import moment from 'moment';

import { FhirDehydrator } from 'fhir-starter';


//=============================================================================================================================================
// Session Variables

Session.setDefault('watersNewObservation', null);


//=============================================================================================================================================
// MAIN COMPONENT 


export function ObservationDetail(props){

  console.log("ObservationDetail.props", props)

  //-------------------------------------------------------
  // Component Life Cycle

  useEffect(function(){
    let newObservation = assembleObservation();

    if(typeof props.onObservationChange === "function"){
      props.onObservationChange(newObservation)
    }
  })
  

  //-------------------------------------------------------
  // Component State

  let [observation, setObservation] = useState(props.observation);
  let [subject, setSubject] = useState(props.subject);

  let [subjectDisplay, setSubjectDisplay] = useState(get(props.observation, 'subject.display', ''));
  let [subjectReference, setSubjectReference] = useState(get(props.observation, 'subject.reference', ''));
  let [deviceDisplay, setDeviceDisplay] = useState(get(props.observation, 'device.display', ''));
  let [deviceReference, setDeviceReference] = useState(get(props.observation, 'device.reference', ''));

  let [effectiveDateTime, setEffectiveDateTime] = useState(get(props.observation, 'effectiveDateTime', ''));
  let [category, setCategory] = useState(get(props.observation, 'category.text', ''));
  let [status, setStatus] = useState(get(props.observation, 'status', 'preliminary'));

  let [loincCode, setLoincCode] = useState(get(props.observation, 'code.coding[0].code', ''));
  let [loincCodeText, setLoincCodeText] = useState(get(props.observation, 'code.text', ''));
  let [loincCodeDisplay, setLoincCodeDisplay] = useState(get(props.observation, 'code.coding[0].display', ''));

  let [valueQuantityValue, setValueQuantityValue] = useState(get(props.observation, 'valueQuantity.value', ''));
  let [valueQuantityComparator, setValueQuantityComparator] = useState(get(props.observation, 'valueQuantity.comparator', ''));
  let [valueQuantityUnit, setValueQuantityUnit] = useState(get(props.observation, 'valueQuantity.unit', ''));
  let [valueQuantitySystem, setValueQuantitySystem] = useState(get(props.observation, 'valueQuantity.system', ''));
  let [valueQuantityCode, setValueQuantityCode] = useState(get(props.observation, 'valueQuantity.code', ''));
  let [valueString, setValueString] = useState(get(props.observation, 'valueString', ''));

  if(subject){
    subjectDisplay = FhirUtilities.assembleName(get(props.subject, 'name[0]', ''));
    subjectReference = "Patient/" + get(props.subject, 'id', '');
  }


  let data = {
    observationId: props.observationId,
    observation: false,
    displayDatePicker: false
  };

  if(props.displayDatePicker){
    data.displayDatePicker = props.displayDatePicker
  }
  
  if(props.observation){
    data.observation = props.observation;
    data.form = FhirDehydrator.flattenObservation(props.observation);
  }


  //-------------------------------------------------------
  // Helper Functions

  function assembleObservation(){
    let newObservation = {
      resourceType: 'Observation',
      status: status,
      category: {
        text: category
      },
      subject: {                        
        display: subjectDisplay,
        reference: subjectReference
      },
      performer: [],
      device: {
        display: deviceDisplay,
        reference: deviceReference
      },
      valueQuantity: {
        value: valueQuantityValue,
        unit: valueQuantityUnit,
        comparator: valueQuantityComparator,
        code: valueQuantityCode,
        system: 'http://unitsofmeasure.org'
      },
      code: {
        text: loincCodeText
      }
    };

    if(effectiveDateTime){
      newObservation.effectiveDateTime = effectiveDateTime;
    }
    if(props.showValueString){
      newObservation.valueString = valueString;
      delete newObservation.valueQuantity;
    }
    if(loincCodeDisplay && loincCode){
      newObservation.code.coding = [{
        display: loincCodeDisplay,
        code: loincCode
      }]
    }

    return newObservation;
  }
  function emitObservationChange(newObservation){
    if(typeof props.onObservationChange === "function"){
      if(!newObservation){
        newObservation = assembleObservation();
      }
      props.onObservationChange(newObservation)
    }
  }  

  
  function handleSaveButton() {
    let self = this;
    if(props.onUpsert){
      props.onUpsert(self);
    }
  }
  function handleCancelButton() {
    let self = this;
    if(props.onCancel){
      props.onCancel(self);
    }
  }
  function handleDeleteButton() {
    let self = this;
    if(props.onDelete){
      props.onDelete(self);
    }
  }
  function renderDatePicker(displayDatePicker, effectiveDateTime){
    console.log('renderDatePicker', displayDatePicker, effectiveDateTime)
    if(typeof effectiveDateTime === "string"){
      effectiveDateTime = moment(effectiveDateTime);
    }
    if (displayDatePicker) {
      return(<div></div>)
      // return (
      //   <DatePicker 
      //     name='effectiveDateTime'
      //     hintText={ setHint("Date of Administration") } 
      //     container="inline" 
      //     mode="landscape"
      //     value={ effectiveDateTime ? effectiveDateTime : null}    
      //     onChange={ handleUpdateObservation.bind(this, 'effectiveDateTime')}      
      //     fullWidth
      //   />
      // );
    }
  }
  function determineButtons(observationId) {
    if (observationId) {
      return (
        <div>
          <Button id="updateObservationButton" variant="contained" className="saveObservationButton" primary={true} onClick={handleSaveButton.bind(this)} style={{marginRight: '20px'}} >Save</Button>
          <Button id="deleteObservationButton" onClick={handleDeleteButton.bind(this)} >Delete</Button>
        </div>        
      );
    } else {
      return (
        <Button id="saveObservationButton" variant="contained"  primary={true} onClick={handleSaveButton.bind(this)} >Save</Button>
      );
    }
  }
  function setHint(text){
    if(props.showHints !== false){
      return text;
    } else {
      return '';
    }
  }
  function handleUpdateObservation(field, event){
    console.log("ObservationDetail.handleUpdateObservation", field, event.target.value);
    
    let textValue = event.target.value;

    switch (field) {
      case "category":
        setCategory(textValue);
        break;
      case "valueString":
        setValueString(textValue);
        break;        
      case "valueQuantityValue":
        setValueQuantityValue(textValue);
        break;        
      case "valueQuantitySystem":
        setValueQuantitySystem(textValue);
        break;        
      case "valueQuantityComparator":
        setValueQuantityComparator(textValue);
        break;        
      case "valueQuantityCode":
        setValueQuantityCode(textValue);
        break;
      case "valueQuantityUnit":
        setValueQuantityUnit(textValue);
        break;
      case "deviceDisplay":
        setDeviceDisplay(textValue);
        break;
      case "deviceReference":
        setDeviceReference(textValue);
        break;
      case "subjectDisplay":
        setSubjectDisplay(textValue);
        break;
      case "subjectReference":
        setSubjectReference(textValue);
        break;
      case "effectiveDateTime":
        setEffectiveDateTime(textValue);
        break;    
      case "status":
        setStatus(textValue)
        break;    
      case "loincCode":
        setLoincCode(textValue)
        break;
      case "loincCodeText":
        setLoincCodeText(textValue)
        break;
      case "loincCodeDisplay":
        setLoincCodeDisplay(textValue)
        break;
    }
  }





    var patientInputs;
    if(props.showPatientInputs !== false){
      patientInputs = <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            id='subjectDisplayInput'                
            name='subjectDisplay'
            label='Subject Name'
            value={ subjectDisplay }
            onChange={ handleUpdateObservation.bind(this, 'subjectDisplay')}
            // hintText={ setHint('Jane Doe') }
            fullWidth
            InputLabelProps={{ shrink: true }}
            /><br/>            
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='subjectIdInput'                
            name='subjectReference'
            label='Subject ID'
            value={ subjectReference }
            onChange={ handleUpdateObservation.bind(this, 'subjectReference')}
            // hintText={ setHint('Patient/12345') }
            fullWidth
            InputLabelProps={{ shrink: true }}
            /><br/>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='categoryTextInput'                
            name='category'
            label='Category'
            value={ category }
            onChange={ handleUpdateObservation.bind(this, 'category')}
            // hintText={ setHint('Vital Signs') }
            fullWidth
            InputLabelProps={{ shrink: true }}
            /><br/>
        </Grid>
      </Grid>
    }

    let actionButtons;
    if(props.showActionButtons){
      actionButtons = <CardActions>
        { determineButtons(data.observationId) }
      </CardActions>
    }

    let valueElements;
    if(props.showValueString){
      valueElements = <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            id='valueString'                
            name='valueString'
            label='Value String'
            value={ valueString }
            onChange={ handleUpdateObservation.bind(this, 'valueString')}
            fullWidth
            InputLabelProps={{ shrink: true }}
            /><br/> 
        </Grid>
      </Grid>
    } else {
      valueElements = <Grid container spacing={3}>
        <Grid item xs={2}>
          <TextField
            id='valueQuantityComparator'                
            name='valueQuantityComparator'
            label='Comparator'
            // hintText={ setHint('< | <= | >= | >') }
            value={ valueQuantityComparator }
            onChange={ handleUpdateObservation.bind(this, 'valueQuantityComparator')}
            fullWidth
            InputLabelProps={{ shrink: true }}
            /><br/> 
        </Grid>
        <Grid item xs={2}>
          <TextField
            id='valueQuantityInput'                
            name='valueQuantityCode'
            label='Quantity Code'
            // hintText={ setHint('70.0') }
            value={ valueQuantityCode }
            onChange={ handleUpdateObservation.bind(this, 'valueQuantityCode')}
            fullWidth
            InputLabelProps={{ shrink: true }}
            /><br/>
        </Grid>
        <Grid item xs={2}>
          <TextField
            id='valueQuantityUnitInput'                
            name='valueQuantityUnit'
            label='Unit'
            // hintText={ setHint('kg') }
            value={ valueQuantityUnit }
            onChange={ handleUpdateObservation.bind(this, 'valueQuantityUnit')}
            fullWidth
            InputLabelProps={{ shrink: true }}
            /><br/>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='valueStringInput'                
            name='valueQuantityValue'
            label='Value'
            // hintText={ setHint('AB+; pos; neg') }
            value={ valueQuantityValue }
            onChange={ handleUpdateObservation.bind(this, 'valueQuantityValue')}
            fullWidth
            InputLabelProps={{ shrink: true }}
            /><br/>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='statusInput'                
            name='status'
            label='Status'
            value={ status }
            onChange={ handleUpdateObservation.bind(this, 'status')}
            // hintText={ setHint('preliminary | final') }
            fullWidth
            InputLabelProps={{ shrink: true }}
            /><br/>
        </Grid>
      </Grid>
    }

    

    return (
      <div id={props.id} className="observationDetail">
        <CardContent>
          { patientInputs }
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                id='loincCodeTextInput'                
                name='loincCodeText'
                label='LOINC Code Text'
                // hintText={ setHint('HbA1c') }
                value={ loincCodeText }
                onChange={ handleUpdateObservation.bind(this, 'loincCodeText')}
                // hintText={ setHint('HbA1c') }
                fullWidth
                InputLabelProps={{ shrink: true }}
                /><br/>
            </Grid>
            <Grid item xs={2}>
              <TextField
                id='loincCodeInput'                
                name='loincCode'
                label='LOINC Code'
                value={ loincCode }
                onChange={ handleUpdateObservation.bind(this, 'loincCode')}
                // hintText={ setHint('4548-4') }
                fullWidth
                InputLabelProps={{ shrink: true }}
                /><br/>
            </Grid>
            <Grid item xs={4}>
              <TextField
                id='loincDisplayInput'                
                name='loincCodeDisplay'
                label='LOINC Display'
                value={ loincCodeDisplay }
                onChange={ handleUpdateObservation.bind(this, 'loincCodeDisplay')}
                // hintText={ setHint('4548-4') }
                fullWidth
                InputLabelProps={{ shrink: true }}
                /><br/>
            </Grid>
          </Grid>

          { valueElements }
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                id='deviceDisplayInput'                
                name='deviceDisplay'
                label='Device Name'
                value={ deviceDisplay }
                onChange={ handleUpdateObservation.bind(this, 'deviceDisplay')}
                // hintText={ setHint('iHealth Blood Pressure Cuff') }
                fullWidth
                InputLabelProps={{ shrink: true }}
                /><br/>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id='deviceReferenceInput'                
                name='deviceReference'
                label='Device Reference'
                value={ deviceReference }
                onChange={ handleUpdateObservation.bind(this, 'deviceReference')}
                // hintText={ setHint('Device/444') }
                fullWidth
                InputLabelProps={{ shrink: true }}
                /><br/>
            </Grid>
            <Grid item xs={3}>
              <br />
              { renderDatePicker(data.displayDatePicker, get(this, 'data.form.effectiveDateTime') ) }
            </Grid>
          </Grid>

        </CardContent>
        { actionButtons }
      </div>
    );
}





ObservationDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  observationId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  observation: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  subjectReference: PropTypes.object,
  showPatientInputs: PropTypes.bool,
  showSubjectDisplay: PropTypes.bool,
  showSubjectReference: PropTypes.bool,
  showDeviceDisplay: PropTypes.bool,
  showDeviceReference: PropTypes.bool,
  showEffectiveDateTime: PropTypes.bool,
  showCategory: PropTypes.bool,
  showValueQuantityCode: PropTypes.bool,
  showValueQuantityUnit: PropTypes.bool,
  showValueQuantityValue: PropTypes.bool,
  showValueQuantityComparator: PropTypes.bool,
  showValueQuantitySystem: PropTypes.bool,
  showValueString: PropTypes.bool,
  showLoincCode: PropTypes.bool,
  showLoincDisplay: PropTypes.bool,
  showHints: PropTypes.bool,  
  showActionButtons: PropTypes.bool,
  showSubjectRow: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func,
  onObservationChange: PropTypes.func,
  subject: PropTypes.object
};
ObservationDetail.defaultTypes = {
  showActionButtons: false,
  showPatientInputs: false,
  showSubjectDisplay: true,
  showSubjectReference: true,
  showDeviceDisplay: true,
  showDeviceReference: true,
  showEffectiveDateTime: true,
  showCategory: true,
  showValueQuantityCode: true,
  showValueQuantityUnit: true,
  showValueQuantityValue: true,
  showValueQuantityComparator: true,
  showValueQuantitySystem: true,
  showValueString: true,
  showLoincCode: true,
  showLoincDisplay: true,
  showSubjectRow: true,
  subject: null
}

export default ObservationDetail;