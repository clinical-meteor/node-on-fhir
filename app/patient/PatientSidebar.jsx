import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React from 'react';
// import { ReactMeteorData } from 'meteor/react-meteor-data';
// import ReactMixin from 'react-mixin';
// import { Session } from 'meteor/session';
// import { Random } from 'meteor/random';

import { useTracker } from '../layout/Tracker';

import { withStyles } from '@material-ui/core/styles';

import { get } from 'lodash';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemLink from '@material-ui/core/ListItemText';

import Divider from '@material-ui/core/Divider';

import { Icon } from 'react-icons-kit'
import {logOut} from 'react-icons-kit/ionicons/logOut'
import {documentIcon} from 'react-icons-kit/ionicons/documentIcon'
import {modx} from 'react-icons-kit/fa/modx'
import {home} from 'react-icons-kit/fa/home'
import {fire} from 'react-icons-kit/icomoon/fire'

import {user} from 'react-icons-kit/fa/user'
import {users} from 'react-icons-kit/fa/users'
import {userMd} from 'react-icons-kit/fa/userMd'

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

import {ic_view_day} from 'react-icons-kit/md/ic_view_day'

import {ic_hearing} from 'react-icons-kit/md/ic_hearing'  // Condition?
import {ic_fingerprint} from 'react-icons-kit/md/ic_fingerprint' // Biometric
import {ic_accessible} from 'react-icons-kit/md/ic_accessible' // Devices
import {thermometer3} from 'react-icons-kit/fa/thermometer3' // Observation  
import {stethoscope} from 'react-icons-kit/fa/stethoscope' // Device
import {umbrella} from 'react-icons-kit/fa/umbrella' // ExplanationOfBeneft,

import {envelopeO} from 'react-icons-kit/fa/envelopeO' // Correspondence 
import {ic_question_answer} from 'react-icons-kit/md/ic_question_answer'
import {shoppingBasket} from 'react-icons-kit/fa/shoppingBasket'

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
// import {pipette} from 'react-icons-kit/typicons/pipette' // Immunization ?

// import {ic_signal_wifi_0_bar} from 'react-icons-kit/md/ic_signal_wifi_0_bar'
// import {ic_signal_wifi_1_bar} from 'react-icons-kit/md/ic_signal_wifi_1_bar'
// import {ic_signal_wifi_1_bar_lock} from 'react-icons-kit/md/ic_signal_wifi_1_bar_lock'
// import {ic_signal_wifi_2_bar} from 'react-icons-kit/md/ic_signal_wifi_2_bar'
// import {ic_signal_wifi_2_bar_lock} from 'react-icons-kit/md/ic_signal_wifi_2_bar_lock'
// import {ic_signal_wifi_3_bar} from 'react-icons-kit/md/ic_signal_wifi_3_bar'
// import {ic_signal_wifi_3_bar_lock} from 'react-icons-kit/md/ic_signal_wifi_3_bar_lock'
// import {ic_signal_wifi_4_bar} from 'react-icons-kit/md/ic_signal_wifi_4_bar'
// import {ic_signal_wifi_4_bar_lock} from 'react-icons-kit/md/ic_signal_wifi_4_bar_lock'
// import {ic_signal_wifi_off} from 'react-icons-kit/md/ic_signal_wifi_off'
// import {ic_wifi_tethering} from 'react-icons-kit/md/ic_wifi_tethering'
// import {ic_devices} from 'react-icons-kit/md/ic_devices'

import {signIn} from 'react-icons-kit/fa/signIn'

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
  logger.debug('PatientSidebar is rendering.');
  logger.verbose('client.app.patient.PatientSidebar');
  logger.data('PatientSidebar.props', {data: props}, {source: "AppContainer.jsx"});


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
    logger.verbose('client.app.patient.PatientSidebar.handleLogout', url);
    Meteor.logout();
    logger.info('Logging user out.');
  }
  function toggleNavbars(){
    logger.verbose('client.app.patient.PatientSidebar.toggleNavbars');

    Session.toggle('displayNavbars');
    logger.info('Logging user out.');
  }
  

  //----------------------------------------------------------------------
  // Construction Zone
    
  let constructionZone = [];
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
            <Icon icon={fire} className={props.classes.drawerIcons} />
          </ListItemIcon>
          <ListItemText primary='FHIR Resources' className={props.classes.drawerText}  />
        </ListItem>
      );

      fhirResources.push(<Divider className={props.classes.divider} key='resources-hr' />);
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
    let result = <Icon icon={fire} className={props.classes.drawerIcons} />

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
            
          
          

          
        default:
          result = <Icon icon={fire} className={props.classes.drawerIcons} />
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
          className: props.classes.drawerIcons 
        });
      } else {
        clonedIcon = <Icon icon={fire} className={props.classes.drawerIcons} />
      }

      // the excludes array will hide routes
      if(!get(Meteor, 'settings.public.defaults.sidebar.hidden', []).includes(element.to)){

        // don't show the element unless it's public, or the user is signed in
        if(!element.requireAuth || (element.requireAuth && currentUser)){
          dynamicElements.push(
            <ListItem key={index} button onClick={function(){ openPage(element.to, element.workflowTabs); }} >
              <ListItemIcon >
                { clonedIcon }
              </ListItemIcon>
              <ListItemText primary={element.primaryText} className={props.classes.drawerText}  />
            </ListItem>
          );  
        }
      }

    });
    dynamicElements.push(<Divider className={props.classes.divider} key="dynamic-modules-hr" />);
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
          className: props.classes.drawerIcons 
        });
      } else {
        clonedIcon = <Icon icon={fire} className={props.classes.drawerIcons} />
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
              <ListItemText primary={element.primaryText} className={props.classes.drawerText}  />
            </ListItem>
          );
        }
      }
    });
    workflowElements.push(<Divider className={props.classes.divider} key="workflow-modules-hr" />);
    logger.trace('client.app.patient.PatientSidebar.workflowElements: ' + workflowElements.length);
  }


  //----------------------------------------------------------------------
  // Home

  let homePage = [];
  let homePageUrl = get(Meteor, 'settings.public.defaults.homePage', '/')
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.HomePage')){
      homePage.push(<ListItem id='homePageItem' key='homeItem' button onClick={function(){ openPage(homePageUrl); }} >
        <ListItemIcon >
          <Icon icon={home} className={props.classes.drawerIcons} />
        </ListItemIcon>
        <ListItemText primary="Home Page" className={props.classes.drawerText}  />
      </ListItem>);    
      homePage.push(<Divider className={props.classes.divider} key="home-page-hr" />);
  };


  //----------------------------------------------------------------------
  // Theming


  let themingElements = [];
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

  let aboutElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.About')){
      aboutElements.push(<ListItem id='aboutItem' key='aboutItem' button onClick={function(){ toggleAboutDialog(); }} >
        <ListItemIcon >
          <Icon icon={documentIcon} className={props.classes.drawerIcons} />
        </ListItemIcon>
        <ListItemText primary="About" className={props.classes.drawerText}  />
      </ListItem>);    
  };


  //----------------------------------------------------------------------
  // Privacy

  let privacyElements = [];
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

  let termsAndConditionElements = [];
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

  let logoutElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Logout')){
    logoutElements.push(<ListItem id='logoutMenuItem' key='logoutMenuItem' button onClick={function(){ openPage('/signin'); }} >
      <ListItemIcon >
        <Icon icon={logOut} className={props.classes.drawerIcons} />
      </ListItemIcon>
      <ListItemText primary="Logout" className={props.classes.drawerText} onClick={function(){ handleLogout(); }} />
    </ListItem>);    
  };

  //----------------------------------------------------------------------
  // Navbars

  let navbarElements = [];
  if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Navbars')){
    navbarElements.push(<ListItem id='navbarMenuItem' key='navbarMenuItem' button onClick={function(){ toggleNavbars(); }} >
      <ListItemIcon >
        <Icon icon={ic_view_day} className={props.classes.drawerIcons} />
      </ListItemIcon>
      <ListItemText primary="Navbars" className={props.classes.drawerText} />
    </ListItem>);    
  };

  //----------------------------------------------------------------------
  // LoginPage

  function toggleLoginDialog(){
    console.log('Toggle login dialog open/close.')
    Session.set('mainAppDialogJson', false);

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
    if (get(Meteor, 'settings.public.defaults.sidebar.menuItems.Login.route')){
      loginElements.push(<ListItem id='loginMenuItem' key='loginMenuItem' button onClick={function(){ openPage(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Login.route')); }} >
        <ListItemIcon >
          <Icon icon={signIn} className={props.classes.drawerIcons} />
        </ListItemIcon>
        <ListItemText primary="Login" className={props.classes.drawerText} />
      </ListItem>);   
    } else {
      loginElements.push(<ListItem id='loginDialogMenuItem' key='loginDialogMenuItem' button onClick={function(){ toggleLoginDialog(); }} >
        <ListItemIcon >
          <Icon icon={signIn} className={props.classes.drawerIcons} />
        </ListItemIcon>
        <ListItemText primary="Login" className={props.classes.drawerText} />
      </ListItem>);   
    }
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
        <Icon icon={signIn} className={props.classes.drawerIcons} />
      </ListItemIcon>
      <ListItemText primary="Register" className={props.classes.drawerText} />
    </ListItem>);    
  };


  return(
    <div id='patientSidebar' style={{marginBottom: '80px',}} >
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
      { navbarElements }
      { logoutElements }
      { loginElements }
            
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(PatientSidebar);