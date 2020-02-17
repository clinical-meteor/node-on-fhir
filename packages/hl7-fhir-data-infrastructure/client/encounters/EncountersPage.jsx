import { 
  CssBaseline,
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Button,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';
import styled from 'styled-components';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import EncounterDetail from './EncounterDetail';
import EncountersTable from './EncountersTable';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { get, cloneDeep } from 'lodash';


//=============================================================================================================================================
// SESSION VARIABLES

Session.setDefault('encounterPageTabIndex', 0);
Session.setDefault('encounterSearchFilter', '');
Session.setDefault('selectedEncounterId', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('encountersArray', []);

//=============================================================================================================================================
// GLOBAL THEMING

  import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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

//=============================================================================================================================================
// TABS

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


export class EncountersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      encounterId: false,
      encounter: {}
    }
  }
  getMeteorData() {
    let data = {
      tabIndex: Session.get('encounterPageTabIndex'),
      encounterSearchFilter: Session.get('encounterSearchFilter'),
      fhirVersion: Session.get('fhirVersion'),
      selectedEncounterId: Session.get("selectedEncounterId"),
      selectedEncounter: false,
      selected: [],
      encounters: [],
      encountersCount: 0,
      query: {},
      options: {},
      tabIndex: Session.get('encounterPageTabIndex')
    };

    // if(get(Meteor, 'settings.public.defaults.paginationLimit')){
    //   data.options.limit = get(Meteor, 'settings.public.defaults.paginationLimit')
    // }

    // if(Session.get('encountersTableQuery')){
    //   data.query = Session.get('encountersTableQuery')
    // }

    // if (Session.get('selectedEncounterId')){
    //   data.selectedEncounter = Encounters.findOne({_id: Session.get('selectedEncounterId')});
    //   this.state.encounter = Encounters.findOne({_id: Session.get('selectedEncounterId')});
    //   this.state.encounterId = Session.get('selectedEncounterId');
    // } else {
    //   data.selectedEncounter = false;
    //   this.state.encounterId = false;
    //   this.state.encounter = {};
    // }

    console.log('EncountersPage.data.query', data.query)
    console.log('EncountersPage.data.options', data.options)

    data.encounters = Encounters.find(data.query, data.options).fetch();
    data.encountersCount = Encounters.find(data.query, data.options).count();

    console.log("EncountersPage[data]", data);
    return data;
  }

  // this could be a mixin
  handleTabChange(index){
    Session.set('encounterPageTabIndex', index);
  }
  handleActive(index){
  }
  // this could be a mixin
  onNewTab(){
    console.log("onNewTab; we should clear things...");

    Session.set('selectedEncounterId', false);
  }
  onCancelUpsertEncounter(context){
    Session.set('encounterPageTabIndex', 0);
  }
  onDeleteEncounter(context){
    Encounters._collection.remove({_id: get(context, 'state.encounterId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Encounters.insert[error]', error);
        // Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedEncounterId', false);
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Encounters", recordId: context.state.encounterId});
        // Bert.alert('Encounter removed!', 'success');
      }
    });
    Session.set('encounterPageTabIndex', 0);
  }
  onUpsertEncounter(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new Encounter...', context.state)

    if(get(context, 'state.encounter')){
      let self = context;
      let fhirEncounterData = Object.assign({}, get(context, 'state.encounter'));
  
      // if(process.env.NODE_ENV === "test") console.log('fhirEncounterData', fhirEncounterData);
  
      let encounterValidator = EncounterSchema.newContext();
      // console.log('encounterValidator', encounterValidator)
      encounterValidator.validate(fhirEncounterData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', encounterValidator.isValid())
        console.log('ValidationErrors: ', encounterValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.encounterId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating encounter...");
        }

        delete fhirEncounterData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirEncounterData.resourceType = 'Encounter';
  
        Encounters._collection.update({_id: get(context, 'state.encounterId')}, {$set: fhirEncounterData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("Encounters.insert[error]", error);
            // Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Encounters", recordId: context.state.encounterId});
            Session.set('selectedEncounterId', false);
            Session.set('encounterPageTabIndex', 0);
            // Bert.alert('Encounter added!', 'success');
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new encounter...", fhirEncounterData);
  
        fhirEncounterData.effectiveDateTime = new Date();
        Encounters._collection.insert(fhirEncounterData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('Encounters.insert[error]', error);
            // Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Encounters", recordId: context.state.encounterId});
            Session.set('encounterPageTabIndex', 0);
            Session.set('selectedEncounterId', false);
            // Bert.alert('Encounter added!', 'success');
          }
        });
      }
    } 
    Session.set('encounterPageTabIndex', 0);
  }
  onTableRowClick(encounterId){
    Session.set('selectedEncounterId', encounterId);
    Session.set('selectedPatient', Encounters.findOne({_id: encounterId}));
  }
  onTableCellClick(id){
    Session.set('encountersUpsert', false);
    Session.set('selectedEncounterId', id);
    Session.set('encounterPageTabIndex', 2);
  }
  tableActionButtonClick(_id){
    let encounter = Encounters.findOne({_id: _id});

    // console.log("EncountersTable.onSend()", encounter);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/Encounter', {
      data: encounter
    }, function(error, result){
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
      }
    });
  }
  onInsert(encounterId){
    Session.set('selectedEncounterId', false);
    Session.set('encounterPageTabIndex', 0);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Encounters", recordId: encounterId});
  }
  onUpdate(encounterId){
    Session.set('selectedEncounterId', false);
    Session.set('encounterPageTabIndex', 0);
    HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Encounters", recordId: encounterId});
  }
  onRemove(encounterId){
    Session.set('encounterPageTabIndex', 0);
    Session.set('selectedEncounterId', false);
    HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Encounters", recordId: encounterId});
  }
  onCancel(){
    Session.set('encounterPageTabIndex', 0);
  } 
  render() {
    // console.log('EncountersPage.data', this.data)

    function handleChange(event, newValue) {
      Session.set('encounterPageTabIndex', newValue)
    }

    const rowsPerPage = get(Meteor, 'settings.public.defaults.rowsPerPage', 20);

    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){
      headerHeight = 128;
    }

    let encountersCount = this.data.encounters.length;

    return (
      <PageCanvas id="encountersPage" headerHeight={headerHeight} >
        <MuiThemeProvider theme={muiTheme} >
          {/* <Container> */}
            <StyledCard height="auto" scrollable={true} margin={20} headerHeight={headerHeight} >
              <CardHeader
                title={ encountersCount + " Encounters"}
              />
              <CardContent>

                    <div>
                      <Tabs value={this.data.tabIndex} onChange={this.handleTabChange.bind(this)} aria-label="simple tabs example">
                        <Tab label="History" value={0} />
                        <Tab label="New" value={1} />
                      </Tabs>
                      <TabPanel >
                        <EncountersTable 
                          hideIdentifier={true} 
                          hideCheckboxes={true} 
                          hideSubjects={false}
                          noDataMessagePadding={100}
                          actionButtonLabel="Send"
                          hideSubjects={false}
                          hideClassCode={false}
                          hideReasonCode={false}
                          hideReason={false}
                          hideHistory={false}
                          encounters={ this.data.encounters }
                          rowsPerPage={rowsPerPage}
                          count={this.data.encountersCount}      
                          showMinutes={true}
                          // appWidth={ Session.get('appWidth') }
                          // onRowClick={ this.onTableRowClick }
                          // onCellClick={ this.onTableCellClick }
                          // onActionButtonClick={this.tableActionButtonClick}
                          // onRemoveRecord={ this.onDeleteEncounter }
                          // query={this.data.encountersTableQuery}
                          />
                      </TabPanel>
                      {/* <TabPanel >
                        <EncounterDetail 
                          id='newEncounter' 
                          displayDatePicker={true} 
                          displayBarcodes={false}
                          showHints={true}
                          // onInsert={ this.onInsert }
                          // encounter={ this.data.selectedEncounter }
                          // encounterId={ this.data.selectedEncounterId } 
                          // onDelete={ this.onDeleteEncounter }
                          // onUpsert={ this.onUpsertEncounter }
                          // onCancel={ this.onCancelUpsertEncounter } 
                          />
                      </TabPanel> */}
                    </div>

                {/* <Tabs id="encountersPageTabs" default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
                  <Tab className="newEncounterTab" label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0} >
                    <EncounterDetail 
                      id='newEncounter' 
                      displayDatePicker={true} 
                      displayBarcodes={false}
                      showHints={true}
                      onInsert={ this.onInsert }
                      encounter={ this.data.selectedEncounter }
                      encounterId={ this.data.selectedEncounterId } 

                      onDelete={ this.onDeleteEncounter }
                      onUpsert={ this.onUpsertEncounter }
                      onCancel={ this.onCancelUpsertEncounter } 

                      />
                  </Tab>
                  <Tab className="encounterListTab" label='Encounters' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                    <EncountersTable 
                      hideIdentifier={true} 
                      hideSubjects={false}
                      noDataMessagePadding={100}
                      encounters={ this.data.encounters }
                      paginationLimit={ this.data.pagnationLimit }
                      appWidth={ Session.get('appWidth') }
                      actionButtonLabel="Send"
                      onRowClick={ this.onTableRowClick }
                      onCellClick={ this.onTableCellClick }
                      onActionButtonClick={this.tableActionButtonClick}
                      onRemoveRecord={ this.onDeleteEncounter }
                      query={this.data.encountersTableQuery}
                      />
                  </Tab>
                  <Tab className="encounterDetailsTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                    <EncounterDetail 
                      id='encounterDetails' 
                      displayDatePicker={true} 
                      displayBarcodes={false}
                      encounter={ this.data.selectedEncounter }
                      encounterId={ this.data.selectedEncounterId } 
                      showEncounterInputs={true}
                      showHints={false}
                      onInsert={ this.onInsert }

                      onDelete={ this.onDeleteEncounter }
                      onUpsert={ this.onUpsertEncounter }
                      onCancel={ this.onCancelUpsertEncounter } 
                  />
                  </Tab>
                </Tabs> */}
              </CardContent>
            </StyledCard>
          {/* </Container> */}
        </MuiThemeProvider>
      </PageCanvas>
    );
  }
}

ReactMixin(EncountersPage.prototype, ReactMeteorData);
export default EncountersPage;