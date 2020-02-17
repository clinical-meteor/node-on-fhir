import React from 'react';

import { 
  Card,
  CardHeader,
  CardContent,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';
import PropTypes from 'prop-types';


import { PatientTable, PatientDetail, PageCanvas, StyledCard } from 'material-fhir-ui';

import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}


import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';

import { get } from 'lodash';

let defaultPatient = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};
Session.setDefault('patientFormData', defaultPatient);
Session.setDefault('patientSearchFilter', '');
Session.setDefault('selectedPatientId', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('patientPageTabIndex', 0)

export class PatientsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patientId: false,
      patient: {},
      tabIndex: 0
    }
  }

  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('patientPageTabIndex'),
      patientSearchFilter: Session.get('patientSearchFilter'),
      fhirVersion: Session.get('fhirVersion'),
      selectedPatientId: Session.get("selectedPatientId"),
      paginationLimit: 100,
      selectedPatient: false,
      selected: [],
      patients: [],
      patientCount: 0,
      dataCursors: []
    };

    Patients.find().forEach(function(patient){
      data.dataCursors.push({
        Patients: (typeof Patients !== "undefined") ? Patients.find({id: patient.id}).count() : 0,
        AllergyIntolerances: (typeof AllergyIntolerances !== "undefined") ? AllergyIntolerances.find({id: patient.id}).count() : 0,
        Conditions: (typeof Conditions !== "undefined") ? Conditions.find({id: patient.id}).count() : 0,
        CarePlans: (typeof CarePlans !== "undefined") ? CarePlans.find({id: patient.id}).count() : 0,
        Devices: (typeof Devices !== "undefined") ? Devices.find({id: patient.id}).count() : 0,
        Encounters: (typeof Encounters !== "undefined") ? Encounters.find({'patient.reference': 'Patient/' + patient.id}).count() : 0,
        Immunizations: (typeof Immunizations !== "undefined") ? Immunizations.find({id: patient.id}).count() : 0,
        Medications: (typeof Medications !== "undefined") ? Medications.find({id: patient.id}).count() : 0,
        MedicationOrders: (typeof MedicationOrders !== "undefined") ? MedicationOrders.find({id: patient.id}).count() : 0,
        MedicationStatements: (typeof MedicationStatements !== "undefined") ? MedicationStatements.find({id: patient.id}).count() : 0,
        Observations: (typeof Observations !== "undefined") ? Observations.find({'subject.reference': 'Patient/' + patient.id}).count() : 0,
        Organizations: (typeof Organizations !== "undefined") ? Organizations.find({id: patient.id}).count() : 0,
        Persons: (typeof Persons !== "undefined") ? Persons.find({id: patient.id}).count() : 0,
        Practitioners: (typeof Practitioners !== "undefined") ? Practitioners.find({id: patient.id}).count() : 0,
        RelatedPersons: (typeof RelatedPersons !== "undefined") ? RelatedPersons.find({id: patient.id}).count() : 0,
        Procedures: (typeof Procedures !== "undefined") ? Procedures.find({'subject.reference': 'Patient/' + patient.id}).count() : 0
      })
    })

    // number of items in the table should be set globally
    if (get(Meteor, 'settings.public.defaults.paginationLimit')) {
      data.paginationLimit = get(Meteor, 'settings.public.defaults.paginationLimit');
    }

    if (Session.get('selectedPatientId')){
      data.selectedPatient = Patients.findOne({_id: Session.get('selectedPatientId')});
      this.state.patient = Patients.findOne({_id: Session.get('selectedPatientId')});
      this.state.patientId = Session.get('selectedPatientId');
    } else {
      data.selectedPatient = false;
      this.state.patientId = false;
      this.state.patient = {}
    }

    data.patients = Patients.find().fetch();
    data.patientCount = Patients.find().count();

    if(process.env.NODE_ENV === "test") console.log("PatientsPageClass[data]", data);
    return data;
  }
  onCancelUpsertPatient(context){
    Session.set('patientPageTabIndex', 1);
  }
  onDeletePatient(context){
    Patients._collection.remove({_id: context.state.patientId}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Patients.insert[error]', error);
        // Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Patients", recordId: context.state.patientId});
        Session.set('patientPageTabIndex', 1);
        Session.set('selectedPatientId', false);
        // Bert.alert('Patient removed!', 'success');
      }
    });
  }
  onUpsertPatient(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new Patient...', context.state)

    if(get(context, 'state.patient')){
      let self = context;
      let fhirPatientData = Object.assign({}, context.state.patient);
  
      if(process.env.NODE_ENV === "test") console.log('fhirPatientData', fhirPatientData);
  
  
      let patientValidator = PatientSchema.newContext();
      // console.log('patientValidator', patientValidator)
      patientValidator.validate(fhirPatientData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', patientValidator.isValid())
        console.log('ValidationErrors: ', patientValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.patientId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating patient...");
        }

        delete fhirPatientData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirPatientData.resourceType = 'Patient';
  
        Patients._collection.update({_id: context.state.patientId}, {$set: fhirPatientData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("Patients.insert[error]", error);
            // Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Patients", recordId: context.state.patientId});
            Session.set('selectedPatientId', false);
            Session.set('patientPageTabIndex', 1);
            // Bert.alert('Patient added!', 'success');
          }
        });
      } else {
        if(process.env.NODE_ENV === "test") console.log("Creating a new patient...", fhirPatientData);
  
        Patients._collection.insert(fhirPatientData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('Patients.insert[error]', error);
            // Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Patients", recordId: context.state.patientId});
            Session.set('patientPageTabIndex', 1);
            Session.set('selectedPatientId', false);
            // Bert.alert('Patient added!', 'success');
          }
        });
      }
    } 
  }
  onTableRowClick(patientId){
    console.log('onTableRowClick', patientId);

    Session.set('selectedPatientId', patientId);
    Session.set('selectedPatient', Patients.findOne(patientId));
  }
  onTableCellClick(id){
    Session.set('patientsUpsert', false);
    Session.set('selectedPatientId', id);
    Session.set('patientPageTabIndex', 2);

  }
  tableActionButtonClick(id){
    let patient = Patients.findOne({_id: id});

    console.log("PatientTable.onSend()", patient);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/Patient', {
      data: patient
    }, function(error, result){
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
      }
    });
  }


  onNewTab(){
    Session.set('selectedPatientId', false);
    Session.set('patientUpsert', false);
  }

  render() {
    console.log('React.version: ' + React.version);

    let self = this;

    function handleTabChange(event, index){
      console.log('index', index)
      self.setState({tabIndex: index});
    }

    const rowsPerPage = get(Meteor, 'settings.public.defaults.rowsPerPage', 25);

    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){
      headerHeight = 128;
    }

    return (
      <PageCanvas id="patientsPageClass" headerHeight={headerHeight} >
        <MuiThemeProvider theme={muiTheme} >
          <StyledCard height="auto" scrollable={true} margin={20} >
            <CardHeader title="Patients" />
            <CardContent>
              <Tabs value={this.state.tabIndex} onChange={ handleTabChange } aria-label="simple tabs example">
                <Tab label="Directory" />
                <Tab label="New" />
              </Tabs>
              <br />
              <br />
              <TabPanel value={this.state.tabIndex} index={0}>
                <PatientTable 
                  noDataMessagePadding={100}
                  patients={ this.data.patients }
                  paginationLimit={ this.pagnationLimit }
                  rowsPerPage={rowsPerPage}
                  count={this.data.patientCount}
                  onRowClick={ this.onTableRowClick }
                  showCounts={true}
                  cursors={this.data.dataCursors}
                  hideActive={true}
                  // appWidth={ Session.get('appWidth') }
                  // actionButtonLabel="Send"
                  // onCellClick={ this.onTableCellClick }
                  // onActionButtonClick={this.tableActionButtonClick}
                />    
              </TabPanel>
              <TabPanel value={this.state.tabIndex} index={1}>
                <PatientDetail 
                  // id='patientDetails' 
                  // fhirVersion={ this.data.fhirVersion }
                  // patient={ this.data.selectedPatient }
                  // patientId={ this.data.selectedPatientId }
                  // onDelete={ this.onDeletePatient }
                  // onUpsert={ this.onUpsertPatient }
                  // onCancel={ this.onCancelUpsertPatient } 
                />
              </TabPanel>  
            </CardContent>
          </StyledCard>                

        </MuiThemeProvider>
      </PageCanvas>
    );
  }
}

ReactMixin(PatientsPage.prototype, ReactMeteorData);
export default PatientsPage;



