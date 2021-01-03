import { 
  CardHeader,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Button
} from '@material-ui/core';

import { ThemeProvider, makeStyles } from '@material-ui/styles';

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';

import React, { useState }  from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

import TaskDetail from './TaskDetail';

import { get } from 'lodash';
import moment from 'moment';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { LayoutHelpers, Tasks, TasksTable } from 'meteor/clinical:hl7-fhir-data-infrastructure';
import TasksDeduplicated from '../lib/Collections';

import { Icon } from 'react-icons-kit';
import {ic_code} from 'react-icons-kit/md/ic_code'



  //===========================================================================
  // HELPER COMPONENTS

  function DynamicSpacer(props){
    return <br className="dynamicSpacer" style={{height: '40px'}}/>;
  }


  //===========================================================================
  // SESSION VARIABLES

  Session.setDefault('taskPageTabIndex', 0);
  Session.setDefault('taskSearchFilter', '');
  Session.setDefault('selectedTaskId', '');
  Session.setDefault('selectedTask', false);
  Session.setDefault('fhirVersion', 'v1.0.2');
  Session.setDefault('tasksArray', []);
  Session.setDefault('TasksPage.onePageLayout', false)


  //===========================================================================
  // THEMING

  // Global Theming 
  // This is necessary for the Material UI component render layer
  let theme = {
    primaryColor: "rgb(108, 183, 110)",
    primaryText: "rgba(255, 255, 255, 1) !important",

    secondaryColor: "rgb(108, 183, 110)",
    secondaryText: "rgba(255, 255, 255, 1) !important",

    cardColor: "rgba(255, 255, 255, 1) !important",
    cardTextColor: "rgba(0, 0, 0, 1) !important",

    errorColor: "rgb(128,20,60) !important",
    errorText: "#ffffff !important",

    appBarColor: "#f5f5f5 !important",
    appBarTextColor: "rgba(0, 0, 0, 1) !important",

    paperColor: "#f5f5f5 !important",
    paperTextColor: "rgba(0, 0, 0, 1) !important",

    backgroundCanvas: "rgba(255, 255, 255, 1) !important",
    background: "linear-gradient(45deg, rgb(108, 183, 110) 30%, rgb(150, 202, 144) 90%)",

    nivoTheme: "greens"
  }

  // if we have a globally defined theme from a settings file
  if(get(Meteor, 'settings.public.theme.palette')){
    theme = Object.assign(theme, get(Meteor, 'settings.public.theme.palette'));
  }

  const muiTheme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        main: theme.primaryColor,
        contrastText: theme.primaryText
      },
      secondary: {
        main: theme.secondaryColor,
        contrastText: theme.errorText
      },
      appBar: {
        main: theme.appBarColor,
        contrastText: theme.appBarTextColor
      },
      cards: {
        main: theme.cardColor,
        contrastText: theme.cardTextColor
      },
      paper: {
        main: theme.paperColor,
        contrastText: theme.paperTextColor
      },
      error: {
        main: theme.errorColor,
        contrastText: theme.secondaryText
      },
      background: {
        default: theme.backgroundCanvas
      },
      contrastThreshold: 3,
      tonalOffset: 0.2
    }
  });

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

  //===========================================================================
  // DATA

  let nancySmartTask = {
    "resourceType": "Task",
    "meta": {
        "lastUpdated": moment().format()
    },
    "status": "completed",
    "intent": "order",
    "priority": "routine",
    "identifier": [{
      "value": "foo-12345"
    }],
    "for": {
        "reference": "Patient/12724066",
        "display": "SMART, NANCY"
    },
    "description": "Smoking history is incorrect.  Please correct.",
    "authoredOn": moment().format(),
    "lastModified": moment().format(),
    "requester": {
        "reference": "Organization/dbff2b03-3eaa-46c3-b993-4db825b17f6b",
        "display": "Onyx Medical Center"
    },
    "owner": {
        "identifier": {
            "system": "http://nationalinsurers.com/identifiers",
            "value": "12345"
        }
    },
    "input": [
        {
            "type": {
                "text": "Questionnaire Order"
            },
            "valueReference": {
                "reference": "Questionnaire/9a287af1-14c6-45ba-a4f0-f41bfd25d313",
                "type": "Questionnaire"
            }
        }
    ]
  }

//===========================================================================
// MAIN COMPONENT  

Session.setDefault('taskChecklistMode', false)
Session.setDefault('displayTaskJson', false)

export function TasksPage(props){
  let classes = useStyles();

  let [fhirServerUrl, setFhirServerUrl] = useState(get(Meteor, "settings.public.interfaces.default.channel.endpoint"));

  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    tasks: [],
    onePageLayout: false,
    taskSearchFilter: '',
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    taskChecklistMode: false,
    displayTaskJson: false
  };


  data.onePageLayout = useTracker(function(){
    return Session.get('TasksPage.onePageLayout');
  }, [])
  data.selectedTaskId = useTracker(function(){
    return Session.get('selectedTaskId');
  }, [])
  data.selectedTask = useTracker(function(){
    // return TasksDeduplicated.findOne({id: Session.get('selectedTaskId')});
    return Session.get('selectedTask');
  }, [])
  data.tasks = useTracker(function(){
    let results = [];
    if(Session.get('taskChecklistMode')){
      results = TasksDeduplicated.find({
        'focus.display': "Patient Correction"
      }, {
        limit: 10,
        sort: {lastModified: -1}
      }).fetch();      
    } else {
      results = TasksDeduplicated.find().fetch();
    }

    return results;
  }, [])
  data.taskSearchFilter = useTracker(function(){
    return Session.get('taskSearchFilter')
  }, [])
  data.taskChecklistMode = useTracker(function(){
    return Session.get('taskChecklistMode')
  }, [])
  data.displayTaskJson = useTracker(function(){
    return Session.get('displayTaskJson')
  }, [])

  function onCancelUpsertTask(context){
    Session.set('taskPageTabIndex', 1);
  }
  function onDeleteTask(context){
    TasksDeduplicated._collection.remove({_id: get(context, 'state.taskId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('TasksDeduplicated.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedTaskId', '');
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Tasks", recordId: context.state.taskId});        
      }
    });
    Session.set('taskPageTabIndex', 1);
  }
  function onUpsertTask(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new Task...', context.state)

    if(get(context, 'state.task')){
      let self = context;
      let fhirTaskData = Object.assign({}, get(context, 'state.task'));
  
      // if(process.env.NODE_ENV === "test") console.log('fhirTaskData', fhirTaskData);
  
      let taskValidator = TaskSchema.newContext();
      // console.log('taskValidator', taskValidator)
      taskValidator.validate(fhirTaskData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', taskValidator.isValid())
        console.log('ValidationErrors: ', taskValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.taskId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating task...");
        }

        delete fhirTaskData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirTaskData.resourceType = 'Task';
  
        TasksDeduplicated._collection.update({_id: get(context, 'state.taskId')}, {$set: fhirTaskData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("TasksDeduplicated.insert[error]", error);
          
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Tasks", recordId: context.state.taskId});
            Session.set('selectedTaskId', '');
            Session.set('taskPageTabIndex', 1);
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new task...", fhirTaskData);
  
        fhirTaskData.effectiveDateTime = new Date();
        TasksDeduplicated._collection.insert(fhirTaskData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('TasksDeduplicated.insert[error]', error);           
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Tasks", recordId: context.state.taskId});
            Session.set('taskPageTabIndex', 1);
            Session.set('selectedTaskId', '');
          }
        });
      }
    } 
    Session.set('taskPageTabIndex', 1);
  }
  function handleRowClick(taskId, foo, bar){
    console.log('TasksPage.handleRowClick', taskId)
    let task = TasksDeduplicated.findOne({id: taskId});

    Session.set('selectedTaskId', get(task, 'id'));
    Session.set('selectedTask', task);
  }
  function onInsert(taskId){
    Session.set('selectedTaskId', '');
    Session.set('taskPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Tasks", recordId: taskId});
  }
  function onCancel(){
    Session.set('taskPageTabIndex', 1);
  } 
  function handleChange(event, newValue) {
    Session.set('taskPageTabIndex', newValue)
  }
  function postTask(){
    let taskToPost = Session.get('selectedTask')
    console.log('postTask', taskToPost);

    let taskUrl = get(Meteor, 'settings.public.interfaces.default.channel.endpoint') + "/Task";
    console.log('taskUrl', taskUrl)

    if(get(taskToPost, 'id')){
      HTTP.put(taskUrl + "/" + get(taskToPost, 'id'), {
        headers: {},
        data: taskToPost
      }, function(error, result){
        if(error){
          console.log('error', error)
        }
        if(result){
          console.log('result', result)
        }
      })  
    } else {
      HTTP.post(taskUrl, {
        headers: {},
        data: taskToPost
      }, function(error, result){
        if(error){
          console.log('error', error)
        }
        if(result){
          console.log('result', result)
        }
      })  
    }
  }
  function newTask(){
    console.log('newTask', nancySmartTask)
    Session.set('selectedTask', nancySmartTask)
  }
  function toggleJson(){
    Session.toggle('displayTaskJson')
  }
  function handleChangeFhirServerUrl(event){
    console.log('handleChangeFhirServerUrl')
    
    setFhirServerUrl(event.target.value);
  }




  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let taskDetails;
  if(data.displayTaskJson){
    taskDetails = <pre>
      { JSON.stringify(data.selectedTask, null, 2) }
    </pre>
  } else {
    taskDetails = <TaskDetail 
      id='taskDetails' 
      
      displayDatePicker={true} 
      displayBarcodes={false}
      task={ data.selectedTask }
      taskId={ data.selectedTaskId } 
      showTaskInputs={true}
      showHints={false}
      // onInsert={  onInsert }
      // onDelete={  onDeleteTask }
      // onUpsert={  onUpsertTask }
      // onCancel={  onCancelUpsertTask } 
    />
  }

  let buttonMessage = "POST a new Task"
  if(get(data.selectedTask, 'id')){
    buttonMessage = "PUT an update to the existing Task"
  } 

  let layoutContents;
  if(false){
    layoutContents = <StyledCard height="auto" margin={20} >
      <CardHeader title={data.tasks.length + " Task History Records"} />
      <CardContent>

        <TasksTable 
          tasks={ data.tasks }
          showMinutes={true}
          paginationLimit={10}     
          checklist={data.taskChecklistMode}
          formFactorLayout={formFactor}
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>

      <Grid item lg={4}>
        {/* <CardHeader title="1. Select server"  /> */}
        <StyledCard scrollabl margin={20} >
          <CardContent>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>FHIR Task Server URL</InputAdornment>
              <Input
                id="fhirTaskServerUrl"
                name="fhirTaskServerUrl"
                //className={classes.input}
                label="FHIR Task Server URL"
                placeholder={fhirServerUrl}
                value={fhirServerUrl}                    
                onChange={handleChangeFhirServerUrl.bind(this)}
                fullWidth              
              />       
          </FormControl> 
          </CardContent>
        </StyledCard>

        <DynamicSpacer />
        {/* <DynamicSpacer />
        <CardHeader title="2. Initialize new Task"  /> */}
        <Button 
            id='newTaskButton'
            onClick={ newTask.bind(this) }
            color='primary'
            variant="contained"
            style={{marginBottom: '20px'}}
            fullWidth
          >New Task</Button>   
        <DynamicSpacer />
        {/* <DynamicSpacer />
        <CardHeader title="3. Edit Task as Needed"  /> */}

        <StyledCard scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{get(data, 'selectedTask.id') }</h1>
          <Icon icon={ic_code} style={{float: 'right', marginTop: '-50px', marginRight: '20px', cursor: 'pointer'}} size={32} onClick={toggleJson.bind(this)} />
            <CardContent>
              { taskDetails }
            </CardContent>
        </StyledCard>        
        <DynamicSpacer />
        {/* <DynamicSpacer />
        <CardHeader title="4. Post Task to server"  /> */}
        <Button 
            id='postTaskButton'
            onClick={ postTask.bind(this) }
            color='primary'
            variant="contained"
            style={{marginBottom: '20px'}}
            fullWidth
          >{buttonMessage}</Button>   
      </Grid>
      <Grid item lg={8}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.tasks.length + " Tasks"} />
          <CardContent>
            <TasksTable 
              tasks={ data.tasks }
              selectedTaskId={ data.selectedTaskId }
              hideIdentifier={true} 
              hideCheckbox={false}
              hideActionIcons={true}
              hideBarcode={true}
              onRowClick={ handleRowClick.bind(this) }
              count={data.tasks.length}
              formFactorLayout={formFactor}
              />
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
    
  }

  console.log('TasksPage.data', data)

  return (
    <PageCanvas id="tasksPage" headerHeight={headerHeight}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default TasksPage;