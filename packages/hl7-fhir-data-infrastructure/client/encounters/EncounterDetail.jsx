
import { 
  CssBaseline,
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Tab, 
  Tabs,
  Typography,
  TextField,
  DatePicker,
  Box
} from '@material-ui/core';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';


import { get, set } from 'lodash';
// import { setFlagsFromString } from 'v8';

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
  }
}));

// export class EncounterDetail extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       encounterId: false,
//       encounter: {
//         resourceType: 'Encounter',
//         status: 'preliminary',
//         category: {
//           text: ''
//         },
//         effectiveDateTime: '',
//         subject: {
//           display: '',
//           reference: ''
//         },
//         performer: [],
//         device: {
//           display: '',
//           reference: ''
//         },
//         valueQuantity: {
//           value: '',
//           unit: '',
//           system: 'http://unitsofmeasure.org'
//         },
//         valueString: ''
//       },
//       form: {
//         category: '',
//         code: '',
//         value: '',
//         quantity: '',
//         unit: '',
//         deviceDisplay: '',
//         subjectDisplay: '',
//         subjectReference: '',
//         effectiveDateTime: '',
//         loincCode: '',
//         loincCodeText: '',
//         loincCodeDisplay: '',
//         status: ''
//       }
//     }
//   }
//   dehydrateFhirResource(encounter) {
//     let formData = Object.assign({}, this.state.form);

//     formData.category = get(encounter, 'type.text')
//     formData.code = get(encounter, 'code.text')
//     formData.value = get(encounter, 'valueString')
//     formData.comparator = get(encounter, 'valueQuantity.comparator')
//     formData.quantity = get(encounter, 'valueQuantity.value')
//     formData.unit = get(encounter, 'valueQuantity.unit')
//     formData.deviceDisplay = get(encounter, 'device.display')
//     formData.subjectDisplay = get(encounter, 'subject.display')
//     formData.subjectReference = get(encounter, 'subject.reference')
//     formData.effectiveDateTime = get(encounter, 'effectiveDateTime')
//     formData.status = get(encounter, 'status')

//     formData.loincCode = get(encounter, 'code.codeable[0].code')
//     formData.loincCodeText = get(encounter, 'code.text')
//     formData.loincCodeDisplay = get(encounter, 'code.codeable[0].display')

//     return formData;
//   }
//   shouldComponentUpdate(nextProps){
//     process.env.NODE_ENV === "test" && console.log('EncounterDetail.shouldComponentUpdate()', nextProps, this.state)
//     let shouldUpdate = true;

//     // received an encounter from the table; okay lets update again
//     if(nextProps.encounterId !== this.state.encounterId){

//       if(nextProps.encounter){
//         this.setState({encounter: nextProps.encounter})     
//         this.setState({form: this.dehydrateFhirResource(nextProps.encounter)})       
//       }

//       this.setState({encounterId: nextProps.encounterId})      
//       shouldUpdate = true;
//     }

//     // both false; don't take any more updates
//     if(nextProps.encounter === this.state.encounter){
//       shouldUpdate = false;
//     }
    
//     return shouldUpdate;
//   }
//   getMeteorData() {
//     let data = {
//       encounterId: this.props.encounterId,
//       encounter: false,
//       form: this.state.form,
//       displayDatePicker: false
//     };

//     if(this.props.displayDatePicker){
//       data.displayDatePicker = this.props.displayDatePicker
//     }
    
//     if(this.props.encounter){
//       data.encounter = this.props.encounter;
//       data.form = this.dehydrateFhirResource(this.props.encounter);
//     }

//     //console.log("EncounterDetail[data]", data);
//     return data;
//   }

//   renderDatePicker(displayDatePicker, effectiveDateTime){
//     //console.log('renderDatePicker', displayDatePicker, effectiveDateTime)
//     if(typeof effectiveDateTime === "string"){
//       effectiveDateTime = moment(effectiveDateTime);
//     }
//     // if (displayDatePicker) {
//     //   return (
//     //     <DatePicker 
//     //       name='effectiveDateTime'
//     //       hintText={ setHint("Date of Administration") } 
//     //       container="inline" 
//     //       mode="landscape"
//     //       value={ effectiveDateTime ? effectiveDateTime : null}    
//     //       onChange={ this.changeState.bind(this, 'effectiveDateTime')}      
//     //       fullWidth
//     //     />
//     //   );
//     // }
//   }
//   setHint(text){
//     if(this.props.showHints !== false){
//       return text;
//     } else {
//       return '';
//     }
//   }
//   render() {
//     // console.log('EncounterDetail.render()', this.state)
//     //let formData = this.state.form;

//     var patientInputs;
//     if(this.props.showPatientInputs !== false){
//       patientInputs = <Row>
//         <Col md={6}>
//           <TextField
//             id='subjectDisplayInput'                
//             name='subjectDisplay'
//             label='Subject Name'
//             // TimelineSidescrollPage dialog popup
//             // Getting the following when passing an encounter in via props
//             // A component is changing a controlled input of type text to be uncontrolled. Input elements should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. 
//             // value={ get(this, 'data.form.subjectDisplay') }
//             // onChange={ this.changeState.bind(this, 'subjectDisplay')}
//             // hintText={ setHint('Jane Doe') }
//             // floatingLabelFixed={true}
//             fullWidth
//             /><br/>
//         </Col>
//         <Col md={3}>
//           <TextField
//             id='subjectIdInput'                
//             name='subjectReference'
//             label='Subject ID'
//             // value={ get(this, 'data.form.subjectReference') }
//             // onChange={ this.changeState.bind(this, 'subjectReference')}
//             // hintText={ setHint('Patient/12345') }
//             // floatingLabelFixed={true}
//             fullWidth
//             /><br/>
//         </Col>
//         <Col md={3}>
//           <TextField
//             id='categoryTextInput'                
//             name='category'
//             label='Category'
//             // value={ get(this, 'data.form.category') }
//             // onChange={ this.changeState.bind(this, 'category')}
//             // hintText={ setHint('Vital Signs') }
//             // floatingLabelFixed={true}
//             fullWidth
//             /><br/>
//         </Col>
//       </Row>
//     }

//     return (
//       <div id={this.props.id} className="encounterDetail">
//         <CardHeader>
//           { patientInputs }

//           <Row>
//             <Col md={3}>
//               <TextField
//                 id='deviceDisplayInput'                
//                 name='deviceDisplay'
//                 label='Device Name'
//                 // value={ get(this, 'data.form.deviceDisplay') }
//                 // onChange={ this.changeState.bind(this, 'deviceDisplay')}
//                 // hintText={ setHint('iHealth Blood Pressure Cuff') }
//                 // floatingLabelFixed={true}
//                 fullWidth
//                 /><br/>
//             </Col>
//             <Col md={3}>
//               <TextField
//                 id='deviceReferenceInput'                
//                 name='deviceReference'
//                 label='Device Name'
//                 // value={ get(this, 'data.form.deviceReference') }
//                 // onChange={ this.changeState.bind(this, 'deviceReference')}
//                 hintText={ setHint('Device/444') }
//                 floatingLabelFixed={true}
//                 fullWidth
//                 /><br/>
//             </Col>
//             <Col md={3}>
//               <br />
//               { this.renderDatePicker(this.data.displayDatePicker, get(this, 'data.form.effectiveDateTime') ) }
//             </Col>

//           </Row>
//         </CardHeader>
//         <CardActions>
//           { this.determineButtons(this.data.encounterId) }
//         </CardActions>
//       </div>
//     );
//   }
//   determineButtons(encounterId) {
//     if (encounterId) {
//       return (
//         <div>
//           <Button id="updateEncounterButton" className="saveEncounterButton" onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} >Save</Button>
//           <Button id="deleteEncounterButton" onClick={this.handleDeleteButton.bind(this)}> Delete </Button>
//         </div>
//       );
//     } else {
//       return (
//         <Button id="saveEncounterButton" label="Save" onClick={this.handleSaveButton.bind(this)}>Save</Button>
//       );
//     }
//   }
//   updateFormData(formData, field, textValue){
//     if(process.env.NODE_ENV === "test") console.log("EncounterDetail.updateFormData", formData, field, textValue);

//     switch (field) {
//       case "category":
//         set(formData, 'category', textValue)
//         break;
//       case "code":
//         set(formData, 'code', textValue)
//         break;        
//       case "value":
//         set(formData, 'value', textValue)
//         break;        
//       case "comparator":
//         set(formData, 'comparator', textValue)
//         break;
//       case "quantity":
//         set(formData, 'quantity', textValue)
//         break;
//       case "unit":
//         set(formData, 'unit', textValue)
//         break;
//       case "deviceDisplay":
//         set(formData, 'deviceDisplay', textValue)
//         break;
//       case "subjectDisplay":
//         set(formData, 'subjectDisplay', textValue)
//         break;
//       case "subjectReference":
//         set(formData, 'subjectReference', textValue)
//         break;
//       case "effectiveDateTime":
//         set(formData, 'effectiveDateTime', textValue)
//         break;
//       case "status":
//         set(formData, 'status', textValue)
//         break;
//       case "loincCode":
//         set(formData, 'loincCode', textValue)
//         break;
//       case "loincCodeText":
//         set(formData, 'loincCodeText', textValue)
//         break;
//       case "loincCodeDisplay":
//         set(formData, 'loincCodeDisplay', textValue)
//         break;
//     }

//     if(process.env.NODE_ENV === "test") console.log("formData", formData);
//     return formData;
//   }
//   updateEncounter(encounterData, field, textValue){
//     if(process.env.NODE_ENV === "test") console.log("EncounterDetail.updateEncounter", encounterData, field, textValue);

//     switch (field) {
//       case "category":
//         set(encounterData, 'category.text', textValue)
//         break;
//       case "code":
//         set(encounterData, 'code.text', textValue)
//         break;        
//       case "value":
//         set(encounterData, 'valueString', textValue)
//         break;        
//       case "comparator":
//         set(encounterData, 'valueQuantity.comparator', textValue)
//         break;        
//       case "quantity":
//         set(encounterData, 'valueQuantity.value', textValue)
//         break;
//       case "unit":
//         set(encounterData, 'valueQuantity.unit', textValue)
//         break;
//       case "deviceDisplay":
//         set(encounterData, 'device.display', textValue)
//         break;
//       case "subjectDisplay":
//         set(encounterData, 'subject.display', textValue)
//         break;
//       case "subjectReference":
//         set(encounterData, 'subject.reference', textValue)
//         break;
//       case "effectiveDateTime":
//         set(encounterData, 'effectiveDateTime', textValue)
//         break;    
//       case "status":
//         set(encounterData, 'status', textValue)
//         break;    
//       case "loincCode":
//         set(encounterData, 'code.coding[0].code', textValue)
//         break;
//       case "loincCodeText":
//         set(encounterData, 'code.text', textValue)
//         break;
//       case "loincCodeDisplay":
//         set(encounterData, 'code.coding[0].display', textValue)
//         break;
//     }
//     return encounterData;
//   }

//   changeState(field, event, textValue){
//     if(process.env.NODE_ENV === "test") console.log("   ");
//     if(process.env.NODE_ENV === "test") console.log("EncounterDetail.changeState", field, textValue);
//     if(process.env.NODE_ENV === "test") console.log("this.state", this.state);

//     let formData = Object.assign({}, this.state.form);
//     let encounterData = Object.assign({}, this.state.encounter);

//     formData = this.updateFormData(formData, field, textValue);
//     encounterData = this.updateEncounter(encounterData, field, textValue);

//     if(process.env.NODE_ENV === "test") console.log("encounterData", encounterData);
//     if(process.env.NODE_ENV === "test") console.log("formData", formData);

//     this.setState({encounter: encounterData})
//     this.setState({form: formData})
//   }


  
//   // this could be a mixin
//   handleSaveButton() {
//     let self = this;
//     if(this.props.onUpsert){
//       this.props.onUpsert(self);
//     }
//     // if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
//     // console.log('Saving a new Encounter...', this.state)

//     // let self = this;
//     // let fhirEncounterData = Object.assign({}, this.state.encounter);

//     // if(process.env.NODE_ENV === "test") console.log('fhirEncounterData', fhirEncounterData);


//     // let encounterValidator = EncounterSchema.newContext();
//     // encounterValidator.validate(fhirEncounterData)

//     // console.log('IsValid: ', encounterValidator.isValid())
//     // console.log('ValidationErrors: ', encounterValidator.validationErrors());

//     // if (this.data.encounterId) {
//     //   if(process.env.NODE_ENV === "test") console.log("Updating encounter...");
//     //   delete fhirEncounterData._id;

//     //   Encounters._collection.update({_id: this.data.encounterId}, {$set: fhirEncounterData },function(error, result){
//     //     if (error) {
//     //       if(process.env.NODE_ENV === "test") console.log("Encounters.insert[error]", error);
//     //       console.log('error', error)
//     //       Bert.alert(error.reason, 'danger');
//     //     }
//     //     if (result) {
//     //       if(self.props.onUpdate){
//     //         self.props.onUpdate(self.data.encounterId);
//     //       }
//     //       Bert.alert('Encounter added!', 'success');
//     //     }
//     //   });
//     // } else {
//     //   fhirEncounterData.effectiveDateTime = new Date();
//     //   if (process.env.NODE_ENV === "test") console.log("create a new encounter", fhirEncounterData);

//     //   Encounters._collection.insert(fhirEncounterData, function(error, result){
//     //     if (error) {
//     //       if(process.env.NODE_ENV === "test") console.log("Encounters.insert[error]", error);
//     //       console.log('error', error)
//     //       Bert.alert(error.reason, 'danger');
//     //     }
//     //     if (result) {
//     //       if(self.props.onInsert){
//     //         self.props.onInsert(self.data.encounterId);
//     //       }
//     //       Bert.alert('Encounter added!', 'success');
//     //     }
//     //   });
//     // }
//   }

//   // this could be a mixin
//   handleCancelButton() {
//     let self = this;
//     if(this.props.onCancel){
//       this.props.onCancel(self);
//     }
//   }

//   handleDeleteButton() {
//     let self = this;
//     if(this.props.onDelete){
//       this.props.onDelete(self);
//     }
//     // console.log('Delete encounter...', this.data.encounterId)
//     // let self = this;
//     // Encounters._collection.remove({_id: this.data.encounterId}, function(error, result){
//     //   if (error) {
//     //     console.log('error', error)
//     //     Bert.alert(error.reason, 'danger');
//     //   }
//     //   if (result) {
//     //     if(self.props.onDelete){
//     //       self.props.onDelete(self.data.encounterId);
//     //     }
//     //     Bert.alert('Encounter deleted!', 'success');
//     //   }
//     // })
//   }
// }




function EncounterDetail(props){

  let classes = useStyles();

  function renderDatePicker(displayDatePicker, effectiveDateTime){
    //console.log('renderDatePicker', displayDatePicker, effectiveDateTime)
    if(typeof effectiveDateTime === "string"){
      effectiveDateTime = moment(effectiveDateTime);
    }
    // if (displayDatePicker) {
    //   return (
    //     <DatePicker 
    //       name='effectiveDateTime'
    //       hintText={ setHint("Date of Administration") } 
    //       container="inline" 
    //       mode="landscape"
    //       value={ effectiveDateTime ? effectiveDateTime : null}    
    //       onChange={ this.changeState.bind(this, 'effectiveDateTime')}      
    //       fullWidth
    //     />
    //   );
    // }
  }
  function setHint(text){
    if(props.showHints !== false){
      return text;
    } else {
      return '';
    }
  }

  return(
    <div className='EncounterDetails'>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            id='subjectDisplayInput'                
            name='subjectDisplay'
            label='Subject Name'
            // TimelineSidescrollPage dialog popup
            // Getting the following when passing an encounter in via props
            // A component is changing a controlled input of type text to be uncontrolled. Input elements should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. 
            // value={ get(this, 'data.form.subjectDisplay') }
            // onChange={ this.changeState.bind(this, 'subjectDisplay')}
            // hintText={ setHint('Jane Doe') }
            // floatingLabelFixed={true}
            fullWidth
            /><br/>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='subjectIdInput'                
            name='subjectReference'
            label='Subject ID'
            // value={ get(this, 'data.form.subjectReference') }
            // onChange={ this.changeState.bind(this, 'subjectReference')}
            // hintText={ setHint('Patient/12345') }
            // floatingLabelFixed={true}
            fullWidth
            /><br/>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='categoryTextInput'                
            name='category'
            label='Category'
            // value={ get(this, 'data.form.category') }
            // onChange={ this.changeState.bind(this, 'category')}
            // hintText={ setHint('Vital Signs') }
            // floatingLabelFixed={true}
            fullWidth
            /><br/>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='deviceDisplayInput'                
            name='deviceDisplay'
            label='Device Name'
            // value={ get(this, 'data.form.deviceDisplay') }
            // onChange={ this.changeState.bind(this, 'deviceDisplay')}
            // hintText={ setHint('iHealth Blood Pressure Cuff') }
            // floatingLabelFixed={true}
            fullWidth
            /><br/>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='deviceReferenceInput'                
            name='deviceReference'
            label='Device Name'
            // value={ get(this, 'data.form.deviceReference') }
            // onChange={ this.changeState.bind(this, 'deviceReference')}
            //hintText={ setHint('Device/444') }
            //floatingLabelFixed={true}
            fullWidth
            /><br/>
        </Grid>
        <Grid item xs={3}>
        </Grid>
        <Grid item xs={3}>
        </Grid>
      </Grid>
    </div>
  );
}

EncounterDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  encounterId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  encounter: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};
ReactMixin(EncounterDetail.prototype, ReactMeteorData);
export default EncounterDetail;