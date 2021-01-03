import { 
  CssBaseline,
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  DialogContent,
  Button,
  Input,
  InputAdornment,
  FormControl
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import { Patients, DynamicSpacer, FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';
import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { Session } from 'meteor/session';

import { get, set  } from 'lodash';

import { PatientsTable } from 'material-fhir-ui';





function PatientPickList(props){
  
  let [currentSearch, setCurrentSearch] = useState('');
  let [activeTask, setActiveTask] = useState(null)

  activeTask = useTracker(function(){
    return Session.get('selectedTask');
  }, [])

  let data = {
    patients: []
  }
  data.patients = useTracker(function(){
    return Patients.find({$or: [
      {'name.text': {$regex: currentSearch}}
    ]}).fetch()
  })


  function changeSearchPatientsInput(event){
    setCurrentSearch(event.target.value);
  }
  function handleOpenPatients(){
    console.log('handleOpenPatients')
    Session.set('mainAppDialogOpen', true);
  }  
  function handleClosePatients(){
    Session.set('mainAppDialogOpen', false);
  } 
  function handleRowClick(patientId){
    console.log('handleRowClick', patientId);

    let selectedPatient = Patients.findOne({id: patientId});

    Session.set('selectedPatientId', patientId);
    Session.set('selectedPatient', selectedPatient);

    let newTask = activeTask;
    set(newTask, 'for.reference', "Patient/" + patientId);
    set(newTask, 'for.display', FhirUtilities.pluckName(selectedPatient));

    Session.set('selectedTask', newTask);
    Session.set('mainAppDialogOpen', false);
  } 

  // const patientActions = [
  //   <Button
  //     primary={true}
  //     onClick={ handleClosePatients}
  //   >Clear</Button>,
  //   <Button
  //     primary={true}
  //     keyboardFocused={true}
  //     onClick={ handleClosePatients}
  //   >Select</Button>
  // ];

  console.log('PatientPickList.data', data)
  return(
    <DialogContent>
      <TextField
        id="patientSearchInput"
        name="patientSearchInput"
        label="Patient Search"
        value={currentSearch}
        fullWidth    
        onChange={changeSearchPatientsInput.bind(this)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <DynamicSpacer />
      <PatientsTable 
        patients={data.patients}     
        hideActionIcons={true}     
        hideMaritalStatus={true} 
        hideLanguage={true} 
        hideSpecies={true} 
        hideSystemBarcode={true} 
        hideCountry={true}
        hideActive={true}
        hideAddress={true}
        hideCity={true}
        hideState={true}
        onRowClick={handleRowClick.bind(this)}
      />      
    </DialogContent>
  );
}

export default PatientPickList;

