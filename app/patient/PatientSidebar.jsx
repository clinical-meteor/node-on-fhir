import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import PropTypes from 'prop-types';
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { withStyles } from '@material-ui/core/styles';

import { get } from 'lodash';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemLink from '@material-ui/core/ListItemText';
import Badge from '@material-ui/core/Badge';

import Divider from '@material-ui/core/Divider';

//==========================================================================================
// Icons

import { Icon } from 'react-icons-kit';
import {logOut} from 'react-icons-kit/ionicons/logOut';
import {documentIcon} from 'react-icons-kit/ionicons/documentIcon';
import {modx} from 'react-icons-kit/fa/modx';
import {home} from 'react-icons-kit/fa/home';
import {fire} from 'react-icons-kit/icomoon/fire';

import {user} from 'react-icons-kit/fa/user';
import {users} from 'react-icons-kit/fa/users';
import {userMd} from 'react-icons-kit/fa/userMd';



import {ic_devices} from 'react-icons-kit/md/ic_devices';  // Devices
import {ic_transfer_within_a_station} from 'react-icons-kit/md/ic_transfer_within_a_station' // Encounters 
import {ic_local_pharmacy} from 'react-icons-kit/md/ic_local_pharmacy'  // Medication, MedicationStatement, MedicationOrder  
import {heartbeat} from 'react-icons-kit/fa/heartbeat' // Condition
import {erlenmeyerFlask} from 'react-icons-kit/ionicons/erlenmeyerFlask' // Substance  
import {hospitalO} from 'react-icons-kit/fa/hospitalO' // Hospital  
import {bath} from 'react-icons-kit/fa/bath'  // Procedure  
import {suitcase} from 'react-icons-kit/fa/suitcase' // Bundle
import {notepad} from 'react-icons-kit/ikons/notepad'  // CarePlan ?
import {iosPulseStrong} from 'react-icons-kit/ionicons/iosPulseStrong' // Pulse, Condition  
import {location} from 'react-icons-kit/typicons/location' // Location
import {eyedropper} from 'react-icons-kit/fa/eyedropper'
import {dashboard} from 'react-icons-kit/fa/dashboard' //Dashboard
import {list} from 'react-icons-kit/fa/list' //Dashboard
import {addressCardO} from 'react-icons-kit/fa/addressCardO'  // Address Card  
import {mapO} from 'react-icons-kit/fa/mapO'
import {map} from 'react-icons-kit/fa/map'

import {ic_view_day} from 'react-icons-kit/md/ic_view_day';

import {ic_hearing} from 'react-icons-kit/md/ic_hearing'  // Condition?
import {ic_fingerprint} from 'react-icons-kit/md/ic_fingerprint' // Biometric
import {ic_accessible} from 'react-icons-kit/md/ic_accessible' // Devices
import {thermometer3} from 'react-icons-kit/fa/thermometer3' // Observation  
import {stethoscope} from 'react-icons-kit/fa/stethoscope' // Device
import {umbrella} from 'react-icons-kit/fa/umbrella' // ExplanationOfBeneft,

import {envelopeO} from 'react-icons-kit/fa/envelopeO' // Correspondence 
import {ic_question_answer} from 'react-icons-kit/md/ic_question_answer';
import {shoppingBasket} from 'react-icons-kit/fa/shoppingBasket';

import {lifeRing} from 'react-icons-kit/fa/lifeRing';
import {dotCircle} from 'react-icons-kit/metrize/dotCircle';
import {sun} from 'react-icons-kit/metrize/sun';
import {ic_album} from 'react-icons-kit/md/ic_album';

import {info} from 'react-icons-kit/metrize/info';
import {question} from 'react-icons-kit/metrize/question';

import {ic_account_balance_wallet} from 'react-icons-kit/md/ic_account_balance_wallet';
import {ticket} from 'react-icons-kit/icomoon/ticket';
import {qrcode} from 'react-icons-kit/fa/qrcode';

import {ic_playlist_add_check} from 'react-icons-kit/md/ic_playlist_add_check';
import {ic_list} from 'react-icons-kit/md/ic_list';
import {balanceScale} from 'react-icons-kit/fa/balanceScale';
import {heartO} from 'react-icons-kit/fa/heartO';

// import {ic_tune} from 'react-icons-kit/md/ic_tune'
// import {flask} from 'react-icons-kit/fa/flask' // Substance 
// import {cameraRetro} from 'react-icons-kit/fa/cameraRetro' // ImagingStudy
// import {film} from 'react-icons-kit/fa/film' // Media 
// import {image} from 'react-icons-kit/fa/image' // Media 
// import {eye} from 'react-icons-kit/fa/eye' // BodySite
// import {barcode} from 'react-icons-kit/fa/barcode' // Barcode  
import {ambulance} from 'react-icons-kit/fa/ambulance' // Ambulance   
// import {medkit} from 'react-icons-kit/fa/medkit'  // SmartKit  
// import {desktop} from 'react-icons-kit/fa/desktop' //Desktop  
// import {tablet} from 'react-icons-kit/fa/tablet' // Tablet 
// import {mobile} from 'react-icons-kit/fa/mobile' // Mobile 
// import {laptop} from 'react-icons-kit/fa/laptop' // Laptop  
import {wheelchair} from 'react-icons-kit/fa/wheelchair' // Wheelchair   
// import {signing} from 'react-icons-kit/fa/signing' // Handwash / Signing  
// import {addressBook} from 'react-icons-kit/fa/addressBook' // Address Book  
import {iosNutrition} from 'react-icons-kit/ionicons/iosNutrition' // Nutrition  
// import {nuclear} from 'react-icons-kit/ionicons/nuclear' // Radiology  
import {pipette} from 'react-icons-kit/typicons/pipette' // Immunization ?

// import {ic_signal_wifi_0_bar} from 'react-icons-kit/md/ic_signal_wifi_0_bar';
// import {ic_signal_wifi_1_bar} from 'react-icons-kit/md/ic_signal_wifi_1_bar';
// import {ic_signal_wifi_1_bar_lock} from 'react-icons-kit/md/ic_signal_wifi_1_bar_lock';
// import {ic_signal_wifi_2_bar} from 'react-icons-kit/md/ic_signal_wifi_2_bar';
// import {ic_signal_wifi_2_bar_lock} from 'react-icons-kit/md/ic_signal_wifi_2_bar_lock';
// import {ic_signal_wifi_3_bar} from 'react-icons-kit/md/ic_signal_wifi_3_bar';
// import {ic_signal_wifi_3_bar_lock} from 'react-icons-kit/md/ic_signal_wifi_3_bar_lock';
// import {ic_signal_wifi_4_bar} from 'react-icons-kit/md/ic_signal_wifi_4_bar';
// import {ic_signal_wifi_4_bar_lock} from 'react-icons-kit/md/ic_signal_wifi_4_bar_lock';
// import {ic_signal_wifi_off} from 'react-icons-kit/md/ic_signal_wifi_off';
// import {ic_wifi_tethering} from 'react-icons-kit/md/ic_wifi_tethering';
// import {ic_devices} from 'react-icons-kit/md/ic_devices';

import {signIn} from 'react-icons-kit/fa/signIn';


//==========================================================================================
// Styling

import useStyles from '../Styles';


//==========================================================================================
// Main Component

export function PatientSidebar(props){
  logger.debug('PatientSidebar is rendering.');
  logger.verbose('client.app.patient.PatientSidebar');
  logger.data('PatientSidebar.props', {data: props}, {source: "AppContainer.jsx"});

  let styles = useStyles();

  let collectionCounts = {
    AllergyIntolerances: 0,
    AuditEvents: 0,
    Bundles: 0,
    CodeSystems: 0,
    CarePlans: 0,
    CareTeams: 0,
    Conditions: 0,
    Consents: 0,
    Communications: 0,
    CommunicationRequests: 0,
    Encounters: 0,
    Endpoints: 0,
    Goals: 0,
    HealthcareServices: 0,
    Immunizations: 0,
    InsurancePlans: 0,
    Lists: 0,
    Locations: 0,
    MedicationOrders: 0,
    Networks: 0,
    Observations: 0,
    Organizations: 0,
    OrganizationAffiliations: 0,
    Patients: 0,
    Procedures: 0,
    Practitioners: 0,
    PractitionerRoles: 0,
    Provenances: 0,
    Persons: 0,
    Questionnaires: 0,
    QuestionnaireResources: 0,
    Restrictions: 0,
    RiskAssessments: 0,
    SearchParameters: 0,
    ServiceRequests: 0,
    StructureDefinitions: 0,
    Tasks: 0,
    ValueSets: 0,
    VerificationResults: 0
  };

  collectionCounts.AllergyIntolerances = useTracker(function(){
    return AllergyIntolerances.find().count();
  }, [])
  collectionCounts.AuditEvents = useTracker(function(){
    return AuditEvents.find().count();
  }, [])
  collectionCounts.Bundles = useTracker(function(){
    return Bundles.find().count();
  }, [])
  collectionCounts.CarePlans = useTracker(function(){
    return CarePlans.find().count();
  }, [])
  collectionCounts.CareTeams = useTracker(function(){
    return CareTeams.find().count();
  }, [])
  collectionCounts.CodeSystems = useTracker(function(){
    return CodeSystems.find().count();
  }, [])
  collectionCounts.Communications = useTracker(function(){
    return Communications.find().count();
  }, [])
  collectionCounts.CommunicationRequests = useTracker(function(){
    return CommunicationRequests.find().count();
  }, [])
  collectionCounts.Conditions = useTracker(function(){
    return Conditions.find().count();
  }, [])
  collectionCounts.Consents = useTracker(function(){
    return Consents.find().count();
  }, [])
  collectionCounts.Encounters = useTracker(function(){
    return Encounters.find().count();
  }, [])
  collectionCounts.Endpoints = useTracker(function(){
    return Endpoints.find().count();
  }, [])
  collectionCounts.Goals = useTracker(function(){
    return Goals.find().count();
  }, [])
  collectionCounts.HealthcareServices = useTracker(function(){
    return HealthcareServices.find().count();
  }, [])
  collectionCounts.Immunizations = useTracker(function(){
    return Immunizations.find().count();
  }, [])
  collectionCounts.InsurancePlans = useTracker(function(){
    return InsurancePlans.find().count();
  }, [])
  collectionCounts.Lists = useTracker(function(){
    return Lists.find().count();
  }, [])
  collectionCounts.Locations = useTracker(function(){
    return Locations.find().count();
  }, [])
  collectionCounts.MedicationOrders = useTracker(function(){
    return MedicationOrders.find().count();
  }, [])
  collectionCounts.Networks = useTracker(function(){
    return Networks.find().count();
  }, [])
  collectionCounts.Observations = useTracker(function(){
    return Observations.find().count();
  }, [])
  collectionCounts.Organizations = useTracker(function(){
    return Organizations.find().count();
  }, [])
  collectionCounts.OrganizationAffiliations = useTracker(function(){
    return OrganizationAffiliations.find().count();
  }, [])
  collectionCounts.Patients = useTracker(function(){
    return Patients.find().count();
  }, [])
  collectionCounts.Procedures = useTracker(function(){
    return Procedures.find().count();
  }, [])
  collectionCounts.Practitioners = useTracker(function(){
    return Practitioners.find().count();
  }, [])
  collectionCounts.PractitionerRoles = useTracker(function(){
    return PractitionerRoles.find().count();
  }, [])
  collectionCounts.Persons = useTracker(function(){
    return Persons.find().count();
  }, [])
  collectionCounts.Questionnaires = useTracker(function(){
    return Questionnaires.find().count();
  }, [])
  collectionCounts.QuestionnaireResponses = useTracker(function(){
  return QuestionnaireResponses.find().count();
  }, [])
  collectionCounts.Restrictions = useTracker(function(){
    return Restrictions.find().count();
  }, [])
  collectionCounts.RiskAssessments = useTracker(function(){
    return RiskAssessments.find().count();
  }, [])
  collectionCounts.SearchParameters = useTracker(function(){
    return SearchParameters.find().count();
  }, [])
  collectionCounts.ServiceRequests = useTracker(function(){
    return ServiceRequests.find().count();
  }, [])
  collectionCounts.StructureDefinitions = useTracker(function(){
    return StructureDefinitions.find().count();
  }, [])
  collectionCounts.Tasks = useTracker(function(){
    return Tasks.find().count();
  }, [])
  collectionCounts.ValueSets = useTracker(function(){
    return ValueSets.find().count();
  }, [])
  collectionCounts.VerificationResults = useTracker(function(){
    return VerificationResults.find().count();
  }, [])



  function openPage(url, tabs){
    logger.verbose('client.app.patient.PatientSidebar.openPage', url, tabs);
    props.history.replace(url)

    if(tabs){
      Session.set('workflowTabs', tabs)
    }
  }
  function toggleAboutDialog(){
    Session.toggle('mainAppDialogOpen');
  }
  function handleLogout(){
    logger.verbose('client.app.patient.PatientSidebar.handleLogout');
    Meteor.logoutCurrentUser();
    logger.info('Logging user out.');
  }
  function toggleNavbars(){
    logger.verbose('client.app.patient.PatientSidebar.toggleNavbars');

    Session.toggle('displayNavbars');
    logger.info('Toggling Navbars');
  }
  function openDocumentationLink(){
    logger.verbose('client.app.patient.PatientSidebar.openDocumentationLink');

    window.open(get(Meteor, 'settings.public.defaults.sidebar.links.documentation', 'https://www.symptomatic.io'), '_system')
    logger.info('Open documentation website');
  }
  

  //----------------------------------------------------------------------
  // Construction Zone
    
  let constructionZone = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.ConstructionZone')){
    // if(!['iPhone'].includes(window.navigator.platform)){
      
      constructionZone.push(
        <ListItem id='constructionZoneItem' key='constructionZoneItem' button onClick={function(){ openPage('/construction-zone'); }} >
          <ListItemIcon >
            <Icon icon={modx} className={styles.drawerIcons} />
          </ListItemIcon>
          <ListItemText primary='Construction Zone' className={styles.drawerText}  />
        </ListItem>
      );

      constructionZone.push(<Divider className={styles.divider} key='construction-hr' />);
    // }
  }
  
  //----------------------------------------------------------------------
  // Trackers

  let currentUser = useTracker(function(){  
    return Session.get('currentUser');    
  }, [props.lastUpdated]);  


  //----------------------------------------------------------------------
  // FHIR Resources
    
  let fhirResources = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.FhirResources')){
    //if(!['iPhone'].includes(window.navigator.platform)){      
      fhirResources.push(
        <ListItem id='fhirResourcesItem' key='fhirResourcesItem' button onClick={function(){ openPage('/fhir-resources-index'); }} >
          <ListItemIcon >
            <Icon icon={fire} className={styles.drawerIcons} />
          </ListItemIcon>
          <ListItemText primary='FHIR Resources' className={styles.drawerText}  />
        </ListItem>
      );

      fhirResources.push(<Divider className={styles.divider} key='resources-hr' />);
    //}
  }


  //----------------------------------------------------------------------
  // Dynamic Modules
  // Pick up any dynamic routes that are specified in packages, and include them
  let dynamicModules = [];

  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.DynamicModules')){
    Object.keys(Package).forEach(function(packageName){
      if(Package[packageName].SidebarElements){
        // we try to build up a route from what's specified in the package
        Package[packageName].SidebarElements.forEach(function(element){
          dynamicModules.push(element);      
        });    
      }
    }); 

    logger.data('PatientSidebar.dynamicModules', dynamicModules);
  }

  let sidebarWorkflows = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.SidebarWorkflows')){
    Object.keys(Package).forEach(function(packageName){
      if(Package[packageName].SidebarWorkflows){
        // we try to build up a route from what's specified in the package
        Package[packageName].SidebarWorkflows.forEach(function(element){
          sidebarWorkflows.push(element);      
        });    
      }
    }); 
    logger.data('PatientSidebar.sidebarWorkflows', sidebarWorkflows);
  }
  


  //----------------------------------------------------------------------
  // Dynamic Modules  

  function parseIcon(iconName){
    let result = <Icon icon={fire} className={styles.drawerIcons} />

    if(typeof iconName === "string"){
      switch (iconName) {
        case "fire":
          result = <Icon icon={fire} />
          break;
        case "user":
          result = <Icon icon={user} />
          break;
        case "userMd":
          result = <Icon icon={userMd} />
          break;
        case "suitcase":
          result = <Icon icon={suitcase} />
          break;
        case "notepad":
          result = <Icon icon={notepad} />
          break;
        case "heartbeat":
          result = <Icon icon={heartbeat} />
          break;
        case "dashboard":
          result = <Icon icon={dashboard} />
          break;
        case "ic_devices":
          result = <Icon icon={ic_devices} />
          break;
        case "ic_local_pharmacy":
          result = <Icon icon={ic_local_pharmacy} />
          break;
        case "ic_transfer_within_a_station":
          result = <Icon icon={ic_transfer_within_a_station} />
          break;
        case "eyedropper":
          result = <Icon icon={eyedropper} />
          break;
        case "location":
          result = <Icon icon={location} />
          break;
        case "erlenmeyerFlask":
          result = <Icon icon={erlenmeyerFlask} />
          break;
        case "iosPulseStrong":
          result = <Icon icon={iosPulseStrong} />
          break;
        case "hospitalO":
          result = <Icon icon={hospitalO} />
          break;
        case "users":
          result = <Icon icon={users} />
          break;
        case "document":
          result = <Icon icon={documentIcon} />
          break;
        case "bath":
          result = <Icon icon={bath} />
          break;          
        case "list":
          result = <Icon icon={list} />
          break;    
        case "addressCardO":
          result = <Icon icon={addressCardO} />
          break;   
        case "ic_hearing":
          result = <Icon icon={ic_hearing} />
          break;    
        case "ic_fingerprint":
          result = <Icon icon={ic_fingerprint} />
          break;    
        case "ic_accessible":
          result = <Icon icon={ic_accessible} />
          break;    
        case "thermometer3":
          result = <Icon icon={thermometer3} />
          break;    
        case "stethoscope":
          result = <Icon icon={stethoscope} />
          break;    
        case "umbrella":
          result = <Icon icon={umbrella} />
          break;    
        case "envelopeO":
          result = <Icon icon={envelopeO} />
          break;    
        case "ic_question_answer":
          result = <Icon icon={ic_question_answer} />
          break;    
        case "picnic_basket":
          result = <Icon icon={shoppingBasket} />
          break;    
        case "map":
          result = <Icon icon={map} />
          break;    
        case "mapO":
          result = <Icon icon={mapO} />
          break;    
        case "lifeRing":
          result = <Icon icon={lifeRing} />
          break;    
        case "dotCircle":
          result = <Icon icon={dotCircle} />
          break;    
        case "sun":
          result = <Icon icon={sun} />
          break;   
        case "info":
          result = <Icon icon={info} />
          break;   
        case "question":
          result = <Icon icon={question} />
          break;     
        case "ic_account_balance_wallet":
          result = <Icon icon={ic_account_balance_wallet} />
          break;     
        case "ticket":
          result = <Icon icon={ticket} />
          break;   
        case "ic_album":
          result = <Icon icon={ic_album} />
          break;    
        case "qrcode":
          result = <Icon icon={qrcode} />
          break;   
        case "ic_playlist_add_check":
          result = <Icon icon={ic_playlist_add_check} />
          break;   
        case "ic_list":
          result = <Icon icon={ic_list} />
          break;   
        case "balanceScale":
          result = <Icon icon={balanceScale} />
          break;   
        case "heartO":
          result = <Icon icon={heartO} />
          break;   
          
          
          
        default:
          result = <Icon icon={fire} className={styles.drawerIcons} />
          break;
      }
    }

    return result;
  }

  let dynamicElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.DynamicModules')){
    dynamicModules.map(function(element, index){ 

      if(element.icon){
        console.warn('Plugin Warning: You have tried to pass in an icon.  This has been deprecated.  Please use an iconName instead.')
      }

      let clonedIcon = parseIcon(element.iconName); 

      // // we want to pass in the props
      if(clonedIcon){
        clonedIcon = React.cloneElement(clonedIcon, {
          className: styles.drawerIcons 
        });
      } else {
        clonedIcon = <Icon icon={fire} className={styles.drawerIcons} />
      }
      // the excludes array will hide routes
      if(!get(Meteor, 'settings.public.defaults.sidebar.hidden', []).includes(element.to)){

        // don't show the element unless it's public, or the user is signed in
        if(!element.requireAuth || (element.requireAuth && currentUser)){

          let elementCount = 0;
          if(collectionCounts[element.collectionName]){
            elementCount = collectionCounts[element.collectionName]
          }

          dynamicElements.push(
            <ListItem key={index} button onClick={function(){ openPage(element.to, element.workflowTabs); }} >
              <ListItemIcon >
                { clonedIcon }
              </ListItemIcon>
              <ListItemText primary={element.primaryText} className={styles.drawerText}  />
              <Badge badgeContent={elementCount} variant="standard" max={10000} color="primary"  style={{marginRight: '10px'}} />
              {/* <ListItemText primary={elementCount} className={styles.drawerTextTag}  /> */}
            </ListItem>
          );  
        }
      }
    });
    dynamicElements.push(<Divider className={styles.divider} key="dynamic-modules-hr" />);
    logger.trace('client.app.patient.PatientSidebar.dynamicElements: ' + dynamicElements.length);
  }


  //----------------------------------------------------------------------
  // Workflow Modules  

  let workflowElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.SidebarWorkflows')){
    sidebarWorkflows.map(function(element, index){ 

      if(element.icon){
        console.warn('Plugin Warning: You have tried to pass in an icon.  This has been deprecated.  Please use an iconName instead.')
      }

      let clonedIcon = parseIcon(element.iconName); 

      // // we want to pass in the props
      if(clonedIcon){
        clonedIcon = React.cloneElement(clonedIcon, {
          className: styles.drawerIcons 
        });
      } else {
        clonedIcon = <Icon icon={fire} className={styles.drawerIcons} />
      }

      // the excludes array will hide routes
      if(!get(Meteor, 'settings.public.defaults.sidebar.hiddenWorkflow', []).includes(element.to)){

        // don't show the element unless it's public, or the user is signed in
        if(!element.requireAuth || (element.requireAuth && currentUser)){

          workflowElements.push(
            <ListItem key={index} button onClick={function(){ openPage(element.to, element.workflowTabs); }} >
              <ListItemIcon >
                { clonedIcon }
              </ListItemIcon>
              <ListItemText primary={element.primaryText} className={styles.drawerText}  />
            </ListItem>
          );
        }
      }
    });
    workflowElements.push(<Divider className={styles.divider} key="workflow-modules-hr" />);
    logger.trace('client.app.patient.PatientSidebar.workflowElements: ' + workflowElements.length);
  }


  //----------------------------------------------------------------------
  // Home

  let homePage = [];
  let homePageUrl = get(Meteor, 'settings.public.defaults.homePage', '/')
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.HomePage')){
      homePage.push(<ListItem id='homePageItem' key='homeItem' button onClick={function(){ openPage(homePageUrl); }} >
        <ListItemIcon >
          <Icon icon={home} className={styles.drawerIcons} />
        </ListItemIcon>
        <ListItemText primary="Home Page" className={styles.drawerText}  />
      </ListItem>);    
      homePage.push(<Divider className={styles.divider} key="home-page-hr" />);
  };


  //----------------------------------------------------------------------
  // Data Management

  let dataManagementElements = [];
  let drawDataMgmDivider = false;
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.HealthRecords')){
    drawDataMgmDivider = true;
    dataManagementElements.push(<ListItem id='healthkitImportItem' key='healthkitImportItem' button onClick={function(){ openPage('/healthcard'); }} >
      <ListItemIcon >
        <Icon icon={addressCardO} className={styles.drawerIcons} />
      </ListItemIcon>
      <ListItemText primary="HealthRecords" className={styles.drawerText}  />
    </ListItem>);    
  };
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.SmartLauncher')){
    drawDataMgmDivider = true;
    dataManagementElements.push(<ListItem id='smartLauncherItem' key='smartLauncherItem' button onClick={function(){ openPage('/smart-launcher'); }} >
      <ListItemIcon >
        <Icon icon={fire} className={styles.drawerIcons} />
      </ListItemIcon>
      <ListItemText primary="Smart Launcher" className={styles.drawerText}  />
    </ListItem>);    
  };
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.DataImport')){
    drawDataMgmDivider = true;
    dataManagementElements.push(<ListItem id='dataImportItem' key='dataImportItem' button onClick={function(){ openPage('/import-data'); }} >
      <ListItemIcon >
        <Icon icon={fire} className={styles.drawerIcons} />
      </ListItemIcon>
      <ListItemText primary="Data Import" className={styles.drawerText}  />
    </ListItem>);    
  };
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.DataExport')){
    drawDataMgmDivider = true;
    dataManagementElements.push(<ListItem id='dataExportItem' key='dataExportItem' button onClick={function(){ openPage('/export-data'); }} >
      <ListItemIcon >
        <Icon icon={fire} className={styles.drawerIcons} />
      </ListItemIcon>
      <ListItemText primary="Data Export" className={styles.drawerText}  />
    </ListItem>);    
  };


  if(drawDataMgmDivider){
    dataManagementElements.push(<Divider className={styles.divider} key="data-management-modules-hr" />);
  }

  //----------------------------------------------------------------------
  // Theming

  let themingElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Theming')){
      themingElements.push(<ListItem id='themingItem' key='themingItem' button onClick={function(){ openPage('/theming'); }} >
        <ListItemIcon >
          <Icon icon={documentIcon} className={styles.drawerIcons} />
        </ListItemIcon>
        <ListItemText primary="Theming" className={styles.drawerText}  />
      </ListItem>);    
  };



  //----------------------------------------------------------------------
  // About

  let aboutElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.About')){
      aboutElements.push(<ListItem id='aboutItem' key='aboutItem' button onClick={function(){ openPage('/about'); }} >
        <ListItemIcon >
          <Icon icon={info} className={styles.drawerIcons} />
        </ListItemIcon>
        <ListItemText primary="About" className={styles.drawerText}  />
      </ListItem>);    
  };

  //----------------------------------------------------------------------
  // Documentation

  let documentationElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Documentation')){
      documentationElements.push(<ListItem id='documentationItem' key='documentationItem' button onClick={function(){ openDocumentationLink(); }} >
        <ListItemIcon >
          <Icon icon={question} className={styles.drawerIcons} />
        </ListItemIcon>
        <ListItemText primary="Documentation" className={styles.drawerText}  />
      </ListItem>);    
  };



  //----------------------------------------------------------------------
  // Marketing

  let marketingElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Marketing')){
      marketingElements.push(<ListItem id='marketingItem' key='marketingItem' button onClick={function(){ openPage('/marketing'); }} >
        <ListItemIcon >
          <Icon icon={question} className={styles.drawerIcons} />
        </ListItemIcon>
        <ListItemText primary="Marketing" className={styles.drawerText}  />
      </ListItem>);    
  };


  //----------------------------------------------------------------------
  // Privacy

  let privacyElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Privacy')){
      privacyElements.push(<ListItem id='privacyItem' key='privacyItem' button onClick={function(){ openPage('/privacy'); }} >
        <ListItemIcon >
          <Icon icon={documentIcon} className={styles.drawerIcons} />
        </ListItemIcon>
        <ListItemText primary="Privacy" className={styles.drawerText}  />
      </ListItem>);    
  };


  //----------------------------------------------------------------------
  // TermsAndConditions

  let termsAndConditionElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.TermsAndConditions')){
    termsAndConditionElements.push(<ListItem id='termsItem' key='termsItem' button onClick={function(){ openPage('/terms-and-conditions'); }} >
      <ListItemIcon >
        <Icon icon={documentIcon} className={styles.drawerIcons} />
      </ListItemIcon>
      <ListItemText primary="Terms and Conditions" className={styles.drawerText}  />
    </ListItem>);    
  };



  //----------------------------------------------------------------------
  // Navbars

  let navbarElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Navbars')){
    navbarElements.push(<ListItem id='navbarMenuItem' key='navbarMenuItem' button onClick={function(){ toggleNavbars(); }} >
      <ListItemIcon >
        <Icon icon={ic_view_day} className={styles.drawerIcons} />
      </ListItemIcon>
      <ListItemText primary="Navbars" className={styles.drawerText} />
    </ListItem>);    
  };

  //----------------------------------------------------------------------
  // LoginPage

  function toggleLoginDialog(){
    console.log('Toggle login dialog open/close.')
    Session.set('mainAppDialogJson', false);
    Session.set('mainAppDialogMaxWidth', "sm");

    if(Session.get('currentUser')){
      Session.set('mainAppDialogTitle', "Logout");
      Session.set('mainAppDialogComponent', "LogoutDialog");
    } else {
      Session.set('mainAppDialogTitle', "Login");
      Session.set('mainAppDialogComponent', "LoginDialog");      
    }

    Session.toggle('mainAppDialogOpen');
  }

  let loginElements = [];
  function determineDialogOrRouteLogin(loginElements){

    if(currentUser){
      if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Logout')){
        loginElements.push(<ListItem id='logoutMenuItem' key='logoutMenuItem' button >
          <ListItemIcon >
            <Icon icon={logOut} className={styles.drawerIcons} />
          </ListItemIcon>
          <ListItemText primary="Logout" className={styles.drawerText} onClick={function(){ handleLogout(); }} />
        </ListItem>);    
      };
    } else {
      if (get(Meteor, 'settings.public.defaults.sidebar.menuItems.Login.route')){
        loginElements.push(<ListItem id='loginMenuItem' key='loginMenuItem' button onClick={function(){ openPage(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Login.route')); }} >
          <ListItemIcon >
            <Icon icon={signIn} className={styles.drawerIcons} />
          </ListItemIcon>
          <ListItemText primary="Login" className={styles.drawerText} />
        </ListItem>);   
      } else {
        loginElements.push(<ListItem id='loginDialogMenuItem' key='loginDialogMenuItem' button onClick={function(){ toggleLoginDialog(); }} >
          <ListItemIcon >
            <Icon icon={signIn} className={styles.drawerIcons} />
          </ListItemIcon>
          <ListItemText primary="Login" className={styles.drawerText} />
        </ListItem>);   
      }  
    }


    if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Profile') && currentUser){
      loginElements.push(<ListItem id='profileMenuItem' key='profileMenuItem' button onClick={function(){ openPage('/profile'); }} >
        <ListItemIcon >
          <Icon icon={user} className={styles.drawerIcons} />
        </ListItemIcon>
        <ListItemText primary="Profile" className={styles.drawerText} />
      </ListItem>);    
    };
    loginElements.push(<Divider className={styles.divider} key="login-hr" />);
  }

  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Login')){

    if(Meteor.isCordova){
      if(["anywhere", "cordova"].includes(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Login.availability'))){
        determineDialogOrRouteLogin(loginElements);
      }  
    } else {
      if(["anywhere", "web"].includes(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Login.availability'))){
        determineDialogOrRouteLogin(loginElements);
      }    
    }
  };

  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Register')){
    loginElements.push(<ListItem id='registrationMenuItem' key='registrationMenuItem' button onClick={function(){ openPage('/registration'); }} >
      <ListItemIcon >
        <Icon icon={signIn} className={styles.drawerIcons} />
      </ListItemIcon>
      <ListItemText primary="Register" className={styles.drawerText} />
    </ListItem>);   
  };

  return(
    <div id='patientSidebar'>
      { homePage }

      { loginElements }

      { dataManagementElements }

      <div id='patientWorkflowElements' key='patientWorkflowElements'>
        { workflowElements }   
      </div>
      <div id='patientDynamicElements' key='patientDynamicElements'>
        { dynamicElements }   
      </div>

      { fhirResources }         
      { constructionZone }         

      { themingElements }
      { aboutElements }
      { documentationElements }
      { marketingElements }
      { privacyElements }
      { termsAndConditionElements }
      { navbarElements }
            
    </div>
  );
}

export default PatientSidebar;
