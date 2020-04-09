
import { Meteor } from 'meteor/meteor';
import React from 'react';
// import { ReactMeteorData } from 'meteor/react-meteor-data';
// import ReactMixin from 'react-mixin';
// import { Session } from 'meteor/session';
// import { Random } from 'meteor/random';

import { withStyles } from '@material-ui/core/styles';

import { get } from 'lodash';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemLink from '@material-ui/core/ListItemText';

import Divider from '@material-ui/core/Divider';

import { Icon } from 'react-icons-kit'
import { logOut } from 'react-icons-kit/ionicons/logOut'
import { documentIcon } from 'react-icons-kit/ionicons/documentIcon'
import { modx } from 'react-icons-kit/fa/modx'
import { home } from 'react-icons-kit/fa/home'
import { fire } from 'react-icons-kit/icomoon/fire'

import {userMd} from 'react-icons-kit/fa/userMd'; // Practitioner  
import {users} from 'react-icons-kit/fa/users'; // Users, Patients
import {user} from 'react-icons-kit/fa/user';  // Patient 

// import {ic_devices} from 'react-icons-kit/md/ic_devices';  // Devices
// import {ic_transfer_within_a_station} from 'react-icons-kit/md/ic_transfer_within_a_station' // Encounters 
// import {ic_local_pharmacy} from 'react-icons-kit/md/ic_local_pharmacy'  // Medication, MedicationStatement, MedicationOrder  
// import {heartbeat} from 'react-icons-kit/fa/heartbeat' // Condition
// import {erlenmeyerFlask} from 'react-icons-kit/ionicons/erlenmeyerFlask' // Substance  
// import {hospitalO} from 'react-icons-kit/fa/hospitalO' // Hospital  
// import {bath} from 'react-icons-kit/fa/bath'  // Procedure  
// import {suitcase} from 'react-icons-kit/fa/suitcase' // Bundle
// import {notepad} from 'react-icons-kit/ikons/notepad'  // CarePlan ?
// import {iosPulseStrong} from 'react-icons-kit/ionicons/iosPulseStrong' // Pulse, Condition  
// import {location} from 'react-icons-kit/typicons/location' // Location
// import {eyedropper} from 'react-icons-kit/fa/eyedropper'

// import {ic_hearing} from 'react-icons-kit/md/ic_hearing'  // Condition?
// import {ic_fingerprint} from 'react-icons-kit/md/ic_fingerprint' // Biometric
// import {ic_accessible} from 'react-icons-kit/md/ic_accessible' // Devices
// import {thermometer3} from 'react-icons-kit/fa/thermometer3' // Observation  
// import {stethoscope} from 'react-icons-kit/fa/stethoscope' // Device
// import {umbrella} from 'react-icons-kit/fa/umbrella' // ExplanationOfBeneft,
// import {dashboard} from 'react-icons-kit/fa/dashboard' //Dashboard
// import {flask} from 'react-icons-kit/fa/flask' // Substance 
// import {cameraRetro} from 'react-icons-kit/fa/cameraRetro' // ImagingStudy
// import {film} from 'react-icons-kit/fa/film' // Media 
// import {image} from 'react-icons-kit/fa/image' // Media 
// import {envelopeO} from 'react-icons-kit/fa/envelopeO' // Correspondence 
// import {eye} from 'react-icons-kit/fa/eye' // BodySite
// import {barcode} from 'react-icons-kit/fa/barcode' // Barcode  
// import {ambulance} from 'react-icons-kit/fa/ambulance' // Ambulance   
// import {medkit} from 'react-icons-kit/fa/medkit'  // SmartKit  
// import {desktop} from 'react-icons-kit/fa/desktop' //Desktop  
// import {tablet} from 'react-icons-kit/fa/tablet' // Tablet 
// import {mobile} from 'react-icons-kit/fa/mobile' // Mobile 
// import {laptop} from 'react-icons-kit/fa/laptop' // Laptop  
// import {wheelchair} from 'react-icons-kit/fa/wheelchair' // Wheelchair   
// import {signing} from 'react-icons-kit/fa/signing' // Handwash / Signing  
// import {addressCardO} from 'react-icons-kit/fa/addressCardO'  // Address Card  
// import {addressBook} from 'react-icons-kit/fa/addressBook' // Address Book  
// import {iosNutrition} from 'react-icons-kit/ionicons/iosNutrition' // Nutrition  
// import {nuclear} from 'react-icons-kit/ionicons/nuclear' // Radiology  
// import {pipette} from 'react-icons-kit/typicons/pipette' // Immunization ?




const drawerWidth = get(Meteor, 'settings.public.defaults.drawerWidth', 280);

const styles = theme => ({
  header: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    })
  },
  canvas: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingLeft: '73px'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    backgroundColor: '#fafafa'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: '#fafafa'
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    },
    backgroundColor: '#fafafa'
  },
  drawerIcons: {
    fontSize: '200%',
    paddingLeft: '10px',
    paddingRight: '2px'
  },
  drawerText: {
    textDecoration: 'none !important'
  },
  hide: {
    display: 'none',
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  divider: {
    height: '2px'
  }
});





export function PatientSidebar(props){
  logger.info('PatientSidebar is rendering.');
  logger.debug('client.app.patient.PatientSidebar');
  logger.data('PatientSidebar.props', {data: props}, {source: "AppContainer.jsx"});


  function openPage(url){
    logger.debug('client.app.patient.PatientSidebar.openPage', url);
    props.history.replace(url)
  }
  function handleLogout(){
    logger.debug('client.app.patient.PatientSidebar.handleLogout', url);
    Meteor.logout();
    logger.info('Logging user out.');
  }
  

  //----------------------------------------------------------------------
  // Construction Zone
    
  var constructionZone = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.ConstructionZone')){
    if(!['iPhone'].includes(window.navigator.platform)){
      
      constructionZone.push(
        <ListItem id='constructionZoneItem' key='constructionZoneItem' button onClick={function(){ openPage('/construction-zone'); }} >
          <ListItemIcon >
            <Icon icon={modx} className={props.classes.drawerIcons} />
          </ListItemIcon>
          <ListItemText primary='Construction Zone' className={props.classes.drawerText}  />
        </ListItem>
      );

      constructionZone.push(<Divider className={props.classes.divider} key='construction-hr' />);
    }
  }


  //----------------------------------------------------------------------
  // FHIR Resources
    
  var fhirResources = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.FhirResources')){
    //if(!['iPhone'].includes(window.navigator.platform)){      
      fhirResources.push(
        <ListItem id='fhirResourcesItem' key='fhirResourcesItem' button onClick={function(){ openPage('/fhir-resources-index'); }} >
          <ListItemIcon >
            <Icon icon={fire} className={props.classes.drawerIcons} />
          </ListItemIcon>
          <ListItemText primary='FHIR Resources' className={props.classes.drawerText}  />
        </ListItem>
      );

      fhirResources.push(<Divider className={props.classes.divider} key='hra' />);
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

    dynamicModules.push(<Divider className={props.classes.divider} key='dynamic-modules-hr' />);  
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

    sidebarWorkflows.push(<Divider className={props.classes.divider} key='workflows-hr' />);  
    logger.data('PatientSidebar.sidebarWorkflows', sidebarWorkflows);
  }
  


  //----------------------------------------------------------------------
  // Dynamic Modules  

  var dynamicElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.DynamicModules')){
    dynamicModules.map(function(element, index){ 

      let clonedIcon;

      switch (element.iconName) {
        case "FaUserInjured":
          element.icon = <Icon icon={user} />
          break;
        case "FaUserMd":
          element.icon = <Icon icon={userMd} />
          break;
        case "GoKebabHorizontal":
          element.icon = <Icon icon={fire} />
          break;
        case "GoFlame":
          element.icon = <Icon icon={fire} />
          break;
        case "MdLineWeight":
          element.icon = <Icon icon={fire} />
          break;

        // case "suitcase":
        //   element.icon = <Icon icon={suitcase} />
        //   break;
        // case "notepad":
        //   element.icon = <Icon icon={notepad} />
        //   break;
        // case "heartbeat":
        //   element.icon = <Icon icon={heartbeat} />
        //   break;
        // case "ic_devices":
        //   element.icon = <Icon icon={ic_devices} />
        //   break;
        // case "ic_transfer_within_a_station":
        //   element.icon = <Icon icon={ic_transfer_within_a_station} />
        //   break;
        // case "eyedropper":
        //   element.icon = <Icon icon={eyedropper} />
        //   break;
        // case "location":
        //   element.icon = <Icon icon={location} />
        //   break;
        // case "erlenmeyerFlask":
        //   element.icon = <Icon icon={erlenmeyerFlask} />
        //   break;
        // case "ic_local_pharmacy":
        //   element.icon = <Icon icon={ic_local_pharmacy} />
        //   break;
        // case "iosPulseStrong":
        //   element.icon = <Icon icon={iosPulseStrong} />
        //   break;
        // case "hospitalO":
        //   element.icon = <Icon icon={hospitalO} />
        //   break;
        // case "users":
        //   element.icon = <Icon icon={users} />
        //   break;
        // case "userMd":
        //   element.icon = <Icon icon={userMd} />
        //   break;
        // case "bath":
        //   element.icon = <Icon icon={bath} />
        //   break;
          

        default:
          break;
      }

      // we want to pass in the props
      if(element.icon){
        clonedIcon = React.cloneElement(element.icon, {
          className: props.classes.drawerIcons 
        });
      } else {
        clonedIcon = <Icon icon={fire} className={props.classes.drawerIcons} />
      }

      // the excludes array will hide routes
      if(!get(Meteor, 'settings.public.defaults.sidebar.hidden', []).includes(element.to)){
        dynamicElements.push(
          <ListItem key={index} button onClick={function(){ openPage(element.to); }} >
            <ListItemIcon >
              { clonedIcon }
            </ListItemIcon>
            <ListItemText primary={element.primaryText} className={props.classes.drawerText}  />
          </ListItem>
        );
      }
    });
    dynamicElements.push(<Divider className={props.classes.divider} key="dynamic-modules-hr" />);
  }


  //----------------------------------------------------------------------
  // Workflow Modules  

  var workflowElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.SidebarWorkflows')){
    sidebarWorkflows.map(function(element, index){ 

      let clonedIcon;

      switch (element.iconName) {
        case "FaUserInjured":
          element.icon = <Icon icon={user} />
          break;
        case "FaUserMd":
          element.icon = <Icon icon={userMd} />
          break;
        case "GoKebabHorizontal":
          element.icon = <Icon icon={fire} />
          break;
        case "GoFlame":
          element.icon = <Icon icon={fire} />
          break;
        case "MdLineWeight":
          element.icon = <Icon icon={fire} />
          break;
            
        default:
          break;
      }

      // we want to pass in the props
      if(element.icon){
        clonedIcon = React.cloneElement(element.icon, {
          className: props.classes.drawerIcons 
        });
      } else {
        clonedIcon = <Icon icon={fire} className={props.classes.drawerIcons} />
      }

      // the excludes array will hide routes
      if(!get(Meteor, 'settings.public.defaults.sidebar.hiddenWorkflow', []).includes(element.to)){
        workflowElements.push(
          <ListItem key={index} button onClick={function(){ openPage(element.to); }} >
            <ListItemIcon >
              { clonedIcon }
            </ListItemIcon>
            <ListItemText primary={element.primaryText} className={props.classes.drawerText}  />
          </ListItem>
        );
      }
    });
    workflowElements.push(<Divider className={props.classes.divider} key="workflow-modules-hr" />);
  }


  //----------------------------------------------------------------------
  // Home

  var homePage = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.HomePage')){
      homePage.push(<ListItem id='homePageItem' key='homeItem' button onClick={function(){ openPage('/'); }} >
        <ListItemIcon >
          <Icon icon={home} className={props.classes.drawerIcons} />
        </ListItemIcon>
        <ListItemText primary="Home Page" className={props.classes.drawerText}  />
      </ListItem>);    
      homePage.push(<Divider className={props.classes.divider} key="home-page-hr" />);
  };


  //----------------------------------------------------------------------
  // Theming


  var themingElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Theming')){
      themingElements.push(<ListItem id='themingItem' key='themingItem' button onClick={function(){ openPage('/theming'); }} >
        <ListItemIcon >
          <Icon icon={documentIcon} className={props.classes.drawerIcons} />
        </ListItemIcon>
        <ListItemText primary="Theming" className={props.classes.drawerText}  />
      </ListItem>);    
  };


  //----------------------------------------------------------------------
  // About

  var aboutElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.About')){
      aboutElements.push(<ListItem id='aboutItem' key='aboutItem' button onClick={function(){ openPage('/about'); }} >
        <ListItemIcon >
          <Icon icon={documentIcon} className={props.classes.drawerIcons} />
        </ListItemIcon>
        <ListItemText primary="About" className={props.classes.drawerText}  />
      </ListItem>);    
  };


  //----------------------------------------------------------------------
  // Privacy

  var privacyElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Privacy')){
      privacyElements.push(<ListItem id='privacyItem' key='privacyItem' button onClick={function(){ openPage('/privacy'); }} >
        <ListItemIcon >
          <Icon icon={documentIcon} className={props.classes.drawerIcons} />
        </ListItemIcon>
        <ListItemText primary="Privacy" className={props.classes.drawerText}  />
      </ListItem>);    
  };


  //----------------------------------------------------------------------
  // TermsAndConditions

  var termsAndConditionElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.TermsAndConditions')){
    termsAndConditionElements.push(<ListItem id='termsItem' key='termsItem' button onClick={function(){ openPage('/terms-and-conditions'); }} >
      <ListItemIcon >
        <Icon icon={documentIcon} className={props.classes.drawerIcons} />
      </ListItemIcon>
      <ListItemText primary="Terms and Conditions" className={props.classes.drawerText}  />
    </ListItem>);    
  };


  //----------------------------------------------------------------------
  // Logout

  var logoutElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Logout')){
    logoutElements.push(<ListItem id='logoutMenuItem' key='logoutMenuItem' button onClick={function(){ openPage('/signin'); }} >
      <ListItemIcon >
        <Icon icon={logOut} className={props.classes.drawerIcons} />
      </ListItemIcon>
      <ListItemText primary="Logout" className={props.classes.drawerText} onClick={function(){ handleLogout(); }} />
    </ListItem>);    
  };

  return(
    <div id='patientSidebar'>
      { homePage }

      <div id='patientWorkflowElements' key='patientWorkflowElements'>
        {/* <h4>Workflow</h4> */}
        { workflowElements }   
      </div>

      <div id='patientDynamicElements' key='patientDynamicElements'>
        {/* <h4>Data</h4> */}
        { dynamicElements }   
      </div>

      { fhirResources }         

      { constructionZone }         

      { themingElements }
      { aboutElements }
      { privacyElements }
      { termsAndConditionElements }
      { logoutElements }
            
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(PatientSidebar);