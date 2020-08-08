import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { Icon } from 'react-icons-kit';
import {ic_menu} from 'react-icons-kit/md/ic_menu'

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { get } from 'lodash';
import moment from 'moment';

import { useTracker } from './Tracker';
import PatientChartWorkflowTabs from '../patient/PatientChartWorkflowTabs';

import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';


const drawerWidth =  get(Meteor, 'settings.public.defaults.drawerWidth', 280);

// not being used?
const styles = theme => ({});

if(Meteor.isClient){
  Session.setDefault('useDateRangeInQueries', get(Meteor, 'settings.public.defaults.useDateRangeInQueries', false));
  Session.setDefault('workflowTabs', "default");
}

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



function Header(props) {
  
  if(props.logger){
    // props.logger.trace('Rendering the application Header.');
    props.logger.verbose('package.care-cards.client.layout.Header');  
    props.logger.data('Header.props', {data: props}, {source: "HeaderContainer.jsx"});
  }

  let [drawerIsOpen, setDrawerIsOpen] = useState(false);
  let [currentUser, setCurrentUser] = useState({
    givenName: 'Anonymous'
  });

  function clickOnMenuButton(){
    console.log('clickOnMenuButton');

    props.handleDrawerOpen.call(this);
  };

  function goHome(){
    props.history.replace('/');
  };
  

  // ------------------------------------------------------------
  // Styling

  let componentStyles = {
    headerContainer: {  
      height: '64px',
      position: 'fixed',
      top: 0,
      left: 0,
      background: props.theme.palette.appBar.main,
      backgroundColor: props.theme.palette.appBar.main,
      color: props.theme.palette.appBar.contrastText,
      width: '100%',
      zIndex: 1200,
      transition: props.theme.transitions.create(['width', 'left', 'top'], {
        easing: props.theme.transitions.easing.sharp,
        duration: props.theme.transitions.duration.leavingScreen
      }),
      filter: "grayscale(" + get(Meteor, 'settings.public.theme.grayscaleFilter', "0%") + ")"
    },
    title: {
      flexGrow: 1,
      // background: props.theme.palette.appBar.main,
      // backgroundColor: props.theme.palette.appBar.main,
      color: props.theme.palette.appBar.contrastText,
      paddingTop: '10px',
      fontWeight: '200',
      fontSize: '2.125rem',
      float: 'left',
      marginTop: '0px',
      whiteSpace: 'nowrap'
    },
    header_label: {
      paddingTop: '10px',
      fontWeight: 'bold',
      fontSize: '1 rem',
      float: 'left',
      paddingRight: '10px',
      paddingLeft: '40px'
    },
    header_text: {
      paddingTop: '10px',
      fontSize: '1 rem',
      float: 'left'
    },
    menuButton: {
      float: 'left',
      color: props.theme.palette.appBar.contrastText,
      background: 'inherit',
      backgroundColor: 'inherit',
      border: '0px none black',
      paddingTop: '15px'
    }
  }

  // ------------------------------------------------------------
  // Trackers

  let selectedStartDate;
  selectedStartDate = useTracker(function(){
    return Session.get("fhirKitClientStartDate");
  }, [props.lastUpdated]);

  let selectedEndDate;
  selectedEndDate = useTracker(function(){
    return Session.get("fhirKitClientEndDate");
  }, [props.lastUpdated]);

  let useDateRangeInQueries;
  useDateRangeInQueries = useTracker(function(){
    return Session.get("useDateRangeInQueries");
  }, [props.lastUpdated]);

  let currentPatientId = "";
  currentPatientId = useTracker(function(){
    return Session.get("currentPatientId");
  }, [props.lastUpdated]);

  let currentPatient = null;  
  currentPatient = useTracker(function(){  
    return Session.get("currentPatient");  
  }, [props.lastUpdated]);  

  let workflowTabs = "default";  
  workflowTabs = useTracker(function(){  
    return Session.get("workflowTabs");  
  }, [props.lastUpdated]);  


  let displayNavbars = true;  
  displayNavbars = useTracker(function(){  
    return Session.get("displayNavbars");  
  }, []);  

  
  currentUser = useTracker(function(){  
    let currentUser = Session.get('currentUser');
    let userName = '';
    if(get(currentUser, 'givenName') || get(currentUser, 'familyName')){
      userName = get(currentUser, 'givenName', '') + ' ' + get(currentUser, 'familyName', '');
    } else {
      userName = 'Anonymous'
    }
    return userName; 
  }, []);  

  if(!displayNavbars){
    componentStyles.headerContainer.top = '-128px'
  }

  // ------------------------------------------------------------  
  // Layout  

  if(Meteor.isClient && props.drawerIsOpen){
    componentStyles.headerContainer.width = window.innerWidth - drawerWidth;
    componentStyles.headerContainer.left = drawerWidth;
  }

  let workflowTabsToRender;
  let selectedWorkflow;
  if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){
    componentStyles.headerContainer.height = '128px';

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

    // if(typeof props.headerNavigation === "function"){
    //   workflowTabsToRender = props.headerNavigation(props);
    // }    

    // if(workflowTabs === "patientchart"){
    //   workflowTabsToRender = <PatientChartWorkflowTabs />
    // }
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
        }    
      }
    }

    if(!Meteor.isCordova){
      titleText = titleText + secondaryTitleText;
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


  let demographicItems;
  let dateTimeItems;
  let userItems;



  if(Meteor.isClient){

    // if we have a selected patient, we show that info
    if(!Meteor.isCordova){
      if(Session.get('selectedPatient')){
        demographicItems = <div style={{float: 'right', top: '10px', position: 'absolute', right: '20px'}}>
          <Typography variant="h6" color="inherit" style={ componentStyles.header_label }>Patient ID: </Typography>
          <Typography variant="h6" color="inherit" style={ componentStyles.header_text } noWrap >
            { parseId() }
          </Typography>
        </div>   
      } else {
        // otherwise, we default to population/search level info to display
        if(useDateRangeInQueries){
          if(selectedStartDate && selectedEndDate){
            dateTimeItems = <div style={{float: 'right', top: '10px', position: 'absolute', right: '20px'}}>
              <Typography variant="h6" color="inherit" style={ componentStyles.header_label }>Date Range: </Typography>
              <Typography variant="h6" color="inherit" style={ componentStyles.header_text } noWrap >
                { getSearchDateRange() }
              </Typography>
            </div>   
          }      
        }
        if(get(Meteor, 'settings.public.defaults.displayUserNameInHeader')){
          userItems = <div style={{float: 'right', top: '10px', position: 'absolute', right: '20px'}}>
          <Typography variant="h6" color="inherit" style={ componentStyles.header_label }>User: </Typography>
          <Typography variant="h6" color="inherit" style={ componentStyles.header_text } noWrap >
            { currentUser }
          </Typography>
        </div>             
        }
      }
    }
  }



  return (
    <AppBar id="header" position="fixed" style={componentStyles.headerContainer}>
      <Toolbar disableGutters={!drawerIsOpen} >
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          onClick={ clickOnMenuButton }
          style={componentStyles.menuButton}
        >
          <Icon icon={ic_menu} size={32} />
        </IconButton>
        <Typography variant="h4" color="inherit" onClick={ function(){ goHome(); }} style={  componentStyles.title }>
          { parseTitle() }
        </Typography>

        
        { userItems }
        { dateTimeItems }        
        { demographicItems }
        { workflowTabsToRender }

      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  logger: PropTypes.object,
  drawerIsOpen: PropTypes.bool,
  handleDrawerOpen: PropTypes.func,
  headerNavigation: PropTypes.func
}
Header.defaultProps = {
  logger: {
    debug: function(){},
    info: function(){},
    warn: function(){},
    trace: function(){},
    data: function(){},
    verbose: function(){},
    error: function(){}
  }
}

// export default Header;
export default withStyles(styles, { withTheme: true })(Header);