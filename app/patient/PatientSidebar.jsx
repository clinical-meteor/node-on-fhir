
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
import {logOut} from 'react-icons-kit/ionicons/logOut'
import {documentIcon} from 'react-icons-kit/ionicons/documentIcon'
import {user} from 'react-icons-kit/fa/user'
import {userMd} from 'react-icons-kit/fa/userMd'
import {modx} from 'react-icons-kit/fa/modx'
import {home} from 'react-icons-kit/fa/home'
import {fire} from 'react-icons-kit/icomoon/fire'



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