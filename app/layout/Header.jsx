import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';



import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { get, has } from 'lodash';
import moment from 'moment';

import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import PatientChartWorkflowTabs from '../patient/PatientChartWorkflowTabs';

import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import theme from '../Theme';
import logger from '../Logger';
import useStyles from '../Styles';

const drawerWidth =  get(Meteor, 'settings.public.defaults.drawerWidth', 280);



if(Meteor.isClient){
  Session.setDefault('useDateRangeInQueries', get(Meteor, 'settings.public.defaults.useDateRangeInQueries', false));
  Session.setDefault('workflowTabs', "default");
}


// ==============================================================================
// Icons  
import { Icon } from 'react-icons-kit';
import {ic_menu} from 'react-icons-kit/md/ic_menu';
import {ic_donut_large} from 'react-icons-kit/md/ic_donut_large';
import {ic_track_changes} from 'react-icons-kit/md/ic_track_changes';
import {ic_gps_not_fixed} from 'react-icons-kit/md/ic_gps_not_fixed';
import {ic_gps_off} from 'react-icons-kit/md/ic_gps_off';
import {ic_radio_button_checked} from 'react-icons-kit/md/ic_radio_button_checked';
import {ic_radio_button_unchecked} from 'react-icons-kit/md/ic_radio_button_unchecked';

let headerMenuIcon = ic_radio_button_checked;

// ==============================================================================
// Dynamic Imports 

let headerWorkflows = [];

// default dialog component
headerWorkflows.push({
  name: "PatientChartWorkflowTabs",
  component: <PatientChartWorkflowTabs />,
  matchingPaths: [
    "/patient-chart",
    "/patient-quickchart"
  ]
})

// dynamic dialog components
Object.keys(Package).forEach(function(packageName){
  if(Package[packageName].WorkflowTabs){
    // we try to build up a route from what's specified in the package
    Package[packageName].WorkflowTabs.forEach(function(componentReference){
      headerWorkflows.push(componentReference);      
    });    
  }
});

// // ==============================================================================
// // Theming

// const useStyles = makeStyles(theme => ({
//   headerNavContainer: {  
//     height: '64px',
//     position: 'fixed',
//     top: "0px",
//     left: "0px",
//     background: theme.palette.appBar.main,
//     backgroundColor: theme.palette.appBar.main,
//     color: theme.palette.appBar.contrastText,
//     width: '100%',
//     zIndex: 1200,
//     transition: theme.transitions.create(['width', 'left', 'top'], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen
//     }),
//     filter: "grayscale(" + get(Meteor, 'settings.public.theme.grayscaleFilter', "0%") + ")"
//   },
//   title: {
//     flexGrow: 1,
//     color: theme.palette.appBar.contrastText,
//     paddingTop: '0px',
//     fontWeight: '200',
//     fontSize: '2.125rem',
//     float: 'left',
//     marginTop: Meteor.isCordova ? '5px !important' : '0px',
//     whiteSpace: 'nowrap'
//   },
//   header_label: {
//     paddingTop: '10px',
//     fontWeight: 'bold',
//     fontSize: '1 rem',
//     float: 'left',
//     paddingRight: '10px',
//     paddingLeft: '40px'
//   },
//   header_text: {
//     paddingTop: '10px',
//     fontSize: '1 rem',
//     float: 'left'
//   },
//   menuButton: {
//     float: 'left',
//     color: theme.palette.appBar.contrastText,
//     background: 'inherit',
//     backgroundColor: 'inherit',
//     border: '0px none black',
//     paddingTop: '10px',
//     paddingLeft: '20px',
//     paddingRight: '20px',
//     cursor: 'pointer'
//   }
// }));


// ==============================================================================
// Main Component

function Header(props) {
  if(typeof logger === "undefined"){
    logger = props.logger;
  }
  
  if(logger){
    logger.verbose('package.care-cards.client.layout.Header');  
    logger.data('Header.props', {data: props}, {source: "headerNavContainer.jsx"});
  }

  let [drawerIsOpen, setDrawerIsOpen] = useState(false);
  let [currentUser, setCurrentUser] = useState({
    givenName: 'Anonymous'
  });

  function clickOnMenuButton(){
    console.log('clickOnMenuButton');

    if(window.QRScanner){
      window.QRScanner.hide();  
    }

    document.getElementById("reactCanvas").setAttribute("style", "background: " + get(Meteor, 'settings.public.theme.palette.canvasColor', "#f2f2f2") + ";");
    document.body.setAttribute("style", "background: black;");

    if(document.getElementById("footerNavContainer")){
      document.getElementById("footerNavContainer").setAttribute("style", "background: " + get(Meteor, 'settings.public.theme.palette.appBarColor', "#000000") + ";");
      document.getElementById("footerNavContainer").setAttribute("style", "border-top: 1px solid lightgrey;");  
    }

    props.handleDrawerOpen.call(this);
  };

  function goHome(){
    props.history.replace('/');
  };
  

  // ------------------------------------------------------------
  // Styling


  let componentStyles = useStyles();

  // console.log('Header.styles', componentStyles)

  // ------------------------------------------------------------
  // Trackers

  let selectedStartDate;
  let selectedEndDate;
  let useDateRangeInQueries;
  let currentPatientId = "";
  let currentPatient = null;  
  let workflowTabs = "default";  
  let displayNavbars = true;  

  if(Meteor.isClient){
    selectedStartDate = useTracker(function(){
      return Session.get("fhirKitClientStartDate");
    }, [props.lastUpdated]);
    selectedEndDate = useTracker(function(){
      return Session.get("fhirKitClientEndDate");
    }, [props.lastUpdated]);
  
    useDateRangeInQueries = useTracker(function(){
      return Session.get("useDateRangeInQueries");
    }, [props.lastUpdated]);
  
    currentPatientId = useTracker(function(){
      return Session.get("currentPatientId");
    }, [props.lastUpdated]);
  
    currentPatient = useTracker(function(){  
      return Session.get("currentPatient");  
    }, [props.lastUpdated]);  
  
    workflowTabs = useTracker(function(){  
      return Session.get("workflowTabs");  
    }, [props.lastUpdated]);  
  
  
    displayNavbars = useTracker(function(){  
      return Session.get("displayNavbars");  
    }, []);  

    currentUser = useTracker(function(){  
      let currentUser = Session.get('currentUser');
      let userName = '';
      // Meteor Accounts
      if(has(currentUser, 'fullLegalName')){
        userName = get(currentUser, 'fullLegalName', '');

      // Patient, R4
      } else if(has(currentUser, 'givenName') || has(currentUser, 'familyName')){
        userName = get(currentUser, 'givenName', '') + ' ' + get(currentUser, 'familyName', '');

      // Patient, R4
      } else if(has(currentUser, 'name[0].text')) {
        userName = get(currentUser, 'name[0].text', '');
      // Patient, R4
      } else if(has(currentUser, 'name[0].given[0]') || has(currentUser, 'name[0].family')) {
        userName = get(currentUser, 'name[0].given[0]', '') + ' ' + get(currentUser, 'name[0].family', '');
      // Patient, DSTU2
      } else if(has(currentUser, 'name[0].given[0]') || has(currentUser, 'name[0].family[0]')) {
        userName = get(currentUser, 'name[0].given[0]', '') + ' ' + get(currentUser, 'name[0].family[0]', '');

        // Practitioner, R4
      } else if(has(currentUser, 'name.text')) {
        userName = get(currentUser, 'name.text', '');
      // Practitioner, R4
      } else if(has(currentUser, 'name.given[0]') || has(currentUser, 'name.family')) {
        userName = get(currentUser, 'name[0].given[0]', '') + ' ' + get(currentUser, 'name[0].family', '');
      // Practitioner, DSTU2
      } else if(has(currentUser, 'name.given[0]') || has(currentUser, 'name.family[0]')) {
        userName = get(currentUser, 'name[0].given[0]', '') + ' ' + get(currentUser, 'name[0].family[0]', '');

      } else {
        userName = 'Anonymous'
      }
      return userName; 
    }, []);  
  }

  // if(!displayNavbars){
  //   componentStyles.headerNavContainer.top = '-128px'
  // }
  // if(get(Meteor, 'settings.public.defaults.disableHeader')){
  //   componentStyles.headerNavContainer.display = 'none'
  // }


  // ------------------------------------------------------------  
  // Layout  

  if(Meteor.isClient && props.drawerIsOpen){
    componentStyles.headerNavContainer.width = window.innerWidth - drawerWidth;
    componentStyles.headerNavContainer.left = drawerWidth;
  }

  let workflowTabsToRender;
  let selectedWorkflow;
  if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){    
    if(Meteor.isClient){
      headerWorkflows.forEach(function(workflow){
        if(Array.isArray(workflow.matchingPaths)){
          if(workflow.matchingPaths.includes(window.location.pathname)){
            // console.log('Found a matching workflow component to render.')
            
            // did we find a matching component?
            workflowTabsToRender = workflow.component;  
          }  

          if(workflowTabsToRender){
            workflowTabsToRender = React.cloneElement(
              workflowTabsToRender, props 
            );
          }
        }
      })
    }     
  }




  // ------------------------------------------------------------
  // Helper Methods

  function parseTitle(){
    let titleText = get(Meteor, 'settings.public.title', 'Node on FHIR');
    let secondaryTitleText = get(Meteor, 'settings.public.secondaryTitle', '');
    let selectedPatient;

    if(Meteor.isClient){
      if(get(Meteor, 'settings.public.defaults.showPatientNameInHeader')){
        if(Session.get("selectedPatient")){
          selectedPatient = Session.get("selectedPatient");
  
          titleText = FhirUtilities.pluckName(selectedPatient); 
          logger.verbose("Selected patients name that we're displaying in the Title: " + titleText)
        } else {

          if(!Meteor.isCordova){      
            titleText = titleText + secondaryTitleText;
          }
        }
      } else {
        if(!Meteor.isCordova){      
          titleText = titleText + secondaryTitleText;
        }

      }
    }

    return titleText;    
  }

  
  function parseId(){
    let patientId = '';
    if(Meteor.isClient){
      patientId = get(Session.get('selectedPatient'), 'id');
    }
    return patientId;
  }


  function getSearchDateRange(){
    return moment(selectedStartDate).format("MMM DD, YYYY") + " until " + moment(selectedEndDate).format("MMM DD, YYYY")
  }

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


  let demographicItems;
  let dateTimeItems;
  let userItems;



  if(Meteor.isClient){
    // console.log('Header.Meteor.isClient')
    // if we have a selected patient, we show that info
    if(!Meteor.isCordova){
      // console.log('Header.Meteor.!isCordova')
      if(get(Meteor, 'settings.public.defaults.enablePatientOveride')){
        if(Session.get('selectedPatient')){
          demographicItems = <div style={{float: 'right', top: '10px', position: 'absolute', right: '20px'}}>
            <Typography variant="h6" color="inherit" className={ componentStyles.header_label }>Patient ID: </Typography>
            <Typography variant="h6" color="inherit" className={ componentStyles.header_text } noWrap className="barcode" >
              <span className="barcode helvetica">
                { parseId() }
              </span>
            </Typography>
          </div>     
        }
      } else {
        // console.log('Header.Meteor.!patientId')
        // otherwise, we default to population/search level info to display
        if(useDateRangeInQueries){
          if(selectedStartDate && selectedEndDate){
            dateTimeItems = <div style={{float: 'right', top: '10px', position: 'absolute', right: '20px'}}>
              <Typography variant="h6" color="inherit" className={ componentStyles.header_label }>Date Range: </Typography>
              <Typography variant="h6" color="inherit" className={ componentStyles.header_text } noWrap >
                { getSearchDateRange() }
              </Typography>
            </div>   
          }      
        }
        if(get(Meteor, 'settings.public.defaults.displayUserNameInHeader')){
          userItems = <div style={{float: 'right', top: '5px', position: 'absolute', right: '20px', cursor: 'pointer'}} onClick={toggleLoginDialog.bind(this)}>
          <Typography variant="h6" color="inherit" className={ componentStyles.header_label }>User: </Typography>
          <Typography variant="h6" color="inherit" className={ componentStyles.header_text } noWrap >
            { currentUser }
          </Typography>
        </div>             
        }
      }
    }
  }





  let headerNavContainerClass = componentStyles.headerNavContainer;

  if(!displayNavbars){
    headerNavContainerClass = componentStyles.headerNavContainer_hidden;
  }
  if(get(Meteor, 'settings.public.defaults.disableHeader')){
    headerNavContainerClass = componentStyles.headerNavContainer_hidden;
  }

  let titleClass = componentStyles.title;
  if(Meteor.isCordova){
    titleClass = componentStyles.title_cordova;
  }

  return (
    <div id="header" className="headerNavContainer" position="fixed" className={headerNavContainerClass}>
      <div style={{paddingTop: '10px'}}>
          <Icon 
            id="sidebarMenuButton"
            icon={headerMenuIcon} 
            size={28} 
            onClick={ clickOnMenuButton.bind(this) }
            className={componentStyles.sidebarMenuButton}
          />
        <h4 onClick={ function(){ goHome(); }} className={ titleClass } style={{cursor: 'pointer', userSelect: 'none'}}>
          { parseTitle() }
        </h4>

        
        { userItems }
        { dateTimeItems }        
        { demographicItems }
        { workflowTabsToRender }

      </div>
    </div>
  );
}

Header.propTypes = {
  drawerIsOpen: PropTypes.bool,
  handleDrawerOpen: PropTypes.func,
  headerNavigation: PropTypes.func
}
Header.defaultProps = {}

export default Header;
