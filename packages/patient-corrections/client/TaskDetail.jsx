import { 
  Grid, 
  Container,
  Button,
  Typography,
  DatePicker,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  TextField
} from '@material-ui/core';


import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import moment from 'moment';
import { get, set, map } from 'lodash';

import { Icon } from 'react-icons-kit'
import {users} from 'react-icons-kit/fa/users'

import PatientPickList from './PatientPickList'

  //===========================================================================
  // VALUE SETS

  import hipaaBusinessStatuses from '../examples/ValueSet.hipaa-http-business-status-mapping';
  let hipaaConcepts = get(hipaaBusinessStatuses, 'compose.include[0].concept');

  // Meteor.startup(function(){
  //   if(hipaaBusinessStatuses){

      
  //     console.log('hipaaConcepts', hipaaConcepts);

  //     // if(Array.isArray()){
  //     //   hipaaBusinessStatuses.compose.include.forEach(function(object){

  //     //   })
  //     // }
  //   }
  // })



  //===========================================================================
  // THEMING

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
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  }
}));



  

  //===========================================================================
  // COMPONENT

function TaskDetail(props){

  let classes = useStyles();

  // let defaultTask = {};

  let { 
    children, 
    task,
    ...otherProps 
  } = props;

  // if(task){
  //   defaultTask = task;
  // }

  let [activeTask, setActiveTask] = useState(task)

  console.log('TaskDetail.activeTask', activeTask)

  activeTask = useTracker(function(){
    return Session.get('selectedTask');
  }, [])


  function handleChangeIdentifier(event){
    console.log('handleChangeIdentifier', event.target.value)
    let newTask = activeTask;
    set(newTask, 'identifier[0].value', event.target.value);
    Session.set('selectedTask', newTask);
  }
  function handleChangeStatus(event){
    console.log('handleChangeStatus', event.target.value)
    let newTask = activeTask;
    set(newTask, 'status', event.target.value);
    Session.set('selectedTask', newTask);
  }
  function handleChangePriority(event){
    console.log('handleChangePriority', event.target.value)
    let newTask = activeTask;
    set(newTask, 'priority', event.target.value);
    Session.set('selectedTask', newTask);
  }
  function handleChangeDescription(event){
    console.log('handleChangeDescription', event.target.value)
    let newTask = activeTask;
    set(newTask, 'description', event.target.value);
    Session.set('selectedTask', newTask);
  }
  function handleChangeFor(event){
    console.log('handleChangeFor', event.target.value)
    let newTask = activeTask;
    set(newTask, 'for.display', event.target.value);
    Session.set('selectedTask', newTask);
  }
  function handleChangeFocus(event){
    console.log('handleChangeFocus', event.target.value)
    let newTask = activeTask;
    set(newTask, 'focus.display', event.target.value);
    Session.set('selectedTask', newTask);
  }
  function handleChangeBasedOn(event){
    console.log('handleChangeBasedOn', event.target.value)
    let newTask = activeTask;
    set(newTask, 'basedOn[0].display', event.target.value);
    Session.set('selectedTask', newTask);
  }
  function handleChangePartOf(event){
    console.log('handleChangePartOf', event.target.value)
    let newTask = activeTask;
    set(newTask, 'partOf[0].display', event.target.value);
    Session.set('selectedTask', newTask);
  }
  function handleChangeGroupIdentifier(event){
    console.log('handleChangePartOf', event.target.value)
    let newTask = activeTask;
    set(newTask, 'partOf[0].display', event.target.value);
    Session.set('selectedTask', newTask);
  }
  function handleChangeBusinessStatus(event){
    console.log('handleChangeBusinessStatus', event.target.value)

    let selectedValueObj;
    hipaaConcepts.forEach(function(valueObj){
      if(event.target.value === valueObj.code){
        selectedValueObj = valueObj;
      }
    })

    console.log('selectedValueObj', selectedValueObj)
    console.log('activeTask', activeTask)

    let newTask = activeTask;
    set(newTask, 'businessStatus.coding[0]', selectedValueObj);
    
    console.log('newTask', newTask)
    Session.set('selectedTask', newTask);
  }


  let businessStatusMenuItems = [];
  hipaaConcepts.forEach(function(valueObj, index){
    businessStatusMenuItems.push(  <MenuItem key={index} value={valueObj.code}>{valueObj.display}</MenuItem>)
  })

  
  function openSelectPatientDialog(event){
    console.log('openSelectPatientDialog', event.target.value)
    Session.set('mainAppDialogOpen', true);
    Session.set('mainAppDialogComponent', 'PatientPickList');
    Session.set('mainAppDialogTitle', 'Patient Pick List Dialog');
    Session.set('mainAppDialogmaxWidth', 'lg');    
  }

  return(
    <div className='TaskDetails'>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>For</InputAdornment>
              <Input
                id="forInput"
                name="forInput"
                className={classes.input}
                placeholder="Jane Doe"              
                value={get(activeTask, 'for.display', '')}
                onChange={handleChangeFor.bind(this)}
                endAdornment={<InputAdornment position="end">
                  <Icon icon={users} size={18} onClick={openSelectPatientDialog.bind(this)} style={{color: 'gray', cursor: 'pointer'}} />
                </InputAdornment>}
                fullWidth              
              />          
            </FormControl>

  
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Based On</InputAdornment>
              <Input
                id="basedOnInput"
                name="basedOnInput"
                className={classes.input}
                placeholder="Task/100" 
                value={get(activeTask, 'basedOn[0].display', '')}
                //onChange={handleFhirEndpointChange}
                onChange={handleChangeBasedOn.bind(this)}
                fullWidth              
              />       
            </FormControl>     
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Focus</InputAdornment>
              <Input
                id="focusInput"
                name="focusInput"
                className={classes.input}
                placeholder="2020.2"              
                value={get(activeTask, 'focus.display', '')}
                onChange={handleChangeFocus.bind(this)}
                fullWidth              
              />          
            </FormControl> 
          </Grid>
          <Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Identifier</InputAdornment>
              <Input
                id="identifierInput"
                name="identifierInput"
                className={classes.input}
                placeholder="acme-12345"              
                value={get(activeTask, 'identifier[0].value', '')}
                onChange={handleChangeIdentifier.bind(this)}
                fullWidth              
              />       
            </FormControl> 

            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Part Of</InputAdornment>
              <Input
                id="partOfInput"
                name="partOfInput"
                className={classes.input}
                placeholder="Task/101"              
                value={get(activeTask, 'partOfInput.value', '')}
                onChange={handleChangePartOf.bind(this)}
                fullWidth              
              />          
            </FormControl>

            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Group Identifier</InputAdornment>
              <Input
                id="groupIdentifierInput"
                name="groupIdentifierInput"
                className={classes.input}
                placeholder="XYZ.1"              
                value={get(activeTask, 'groupIdentifier.value', '')}
                onChange={handleChangeGroupIdentifier.bind(this)}
                fullWidth              
              />
            </FormControl>  

   
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment id="priority-select-label" className={classes.label}>Priority</InputAdornment>
              <Select
                id="priority-select"
                value={get(activeTask, 'priority', 'routine')}
                onChange={handleChangePriority.bind(this)}
              >
                <MenuItem value="routine">Routine</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
                <MenuItem value="asap">ASAP</MenuItem>
                <MenuItem value="stat">STAT</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment id="status-select-label" className={classes.label}>Status</InputAdornment>
              <Select
                id="status-select"
                value={get(activeTask, 'status', 'draft')}
                onChange={handleChangeStatus.bind(this)}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="requested">Requested</MenuItem>
                <MenuItem value="received">Received</MenuItem>
                <MenuItem value="accepted">Accepted</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="ready">Ready</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="on-hold">On Hold</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="entered-in-error">Entered in Error</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Business Status</InputAdornment>
              <Select
                id="businessStatusSelect"
                value={get(activeTask, 'businessStatus.coding[0].code', '200')}
                onChange={handleChangeBusinessStatus.bind(this)}
              >
                { businessStatusMenuItems }
              </Select>

            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <TextField
                id="descriptionInput"
                name="descriptionInput"
                label="Description"
                value={get(activeTask, 'description')}
                onChange={handleChangeDescription.bind(this)}
                fullWidth           
                multiline
                rows={4}
                rowsMax={10}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
                             
          </Grid>
          
          
        </Grid>
    </div>
  );
}

TaskDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  taskId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  task: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};

export default TaskDetail;