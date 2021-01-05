import React, { useState } from 'react';
import clsx from 'clsx';

import PropTypes from 'prop-types';
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import { Icon } from 'react-icons-kit';
import {ic_menu} from 'react-icons-kit/md/ic_menu';
import MenuIcon from '@material-ui/icons/Menu';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { get } from 'lodash';
import moment from 'moment';

import { useTracker } from 'meteor/react-meteor-data';
import PatientChartWorkflowTabs from '../patient/PatientChartWorkflowTabs';

import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import theme from '../Theme';
import logger from '../Logger';

const drawerWidth =  get(Meteor, 'settings.public.defaults.drawerWidth', 280);

if(Meteor.isClient){
  Session.setDefault('useDateRangeInQueries', get(Meteor, 'settings.public.defaults.useDateRangeInQueries', false));
  Session.setDefault('workflowTabs', "default");
}



// ==============================================================================
// Theming

const useStyles = makeStyles(function(theme){
  return {
    // headerNavContainer: {  
    //   height: '64px',
    //   position: 'fixed',
    //   display: 'flex',
    //   top: "0px",
    //   left: "0px",
    //   background: theme.palette.appBar.main,
    //   backgroundColor: theme.palette.appBar.main,
    //   color: theme.palette.appBar.contrastText,
    //   width: '100%',
    //   zIndex: 12000,
    //   transition: theme.transitions.create(['width', 'left', 'top'], {
    //     easing: theme.transitions.easing.sharp,
    //     duration: theme.transitions.duration.leavingScreen
    //   }),
    //   filter: "grayscale(" + get(Meteor, 'settings.public.theme.grayscaleFilter', "0%") + ")"
    // },
    appBar: {
      paddingTop: '0px',
      paddingLeft: '0px',
      background: 'inherit',
      display: 'flex',
      justifyContent: 'flex-start',
      flexWrap: 'nowrap',
      width: '100%',
      height: get(Meteor, 'settings.public.defaults.prominantHeader') ? '128px' : '64px',
      zIndex: 13000,
      // transition: theme.transitions.create(['width', 'margin'], {
      transition: theme.transitions.create(['width', 'left', 'top'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      background: theme.palette.appBar.main,
      backgroundColor: theme.palette.appBar.main,
      color: theme.palette.appBar.contrastText,
      filter: "grayscale(" + get(Meteor, 'settings.public.theme.grayscaleFilter', "0%") + ")"
    },     
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      height: get(Meteor, 'settings.public.defaults.prominantHeader') ? '128px' : '64px',
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    hamburgerMenuButton: {
      // left: '0px',
      marginTop: '0px',
      marginLeft: '20px',
      marginRight: '20px',
      zIndex: 100000,
      background: 'inherit',
      zIndex: 100000,
      background: 'inherit',
      width: '32px !important',
      display: 'inline-flex',
      position: 'inherit',
      float: 'left',
      left: '-20px'      
    },
    // hamburgerMenuIcon: {
    //   display: 'inline-flex',
    //   float: 'left',
    //   color: theme.palette.appBar.contrastText,
    //   position: 'absolute',
    //   padding: '20px',
    //   cursor: 'pointer',
    //   marginTop: '0px',
    //   zIndex: 10,
    //   backgroundColor: 'inherit'
    // },
    appTitle: {
      fontWeight: '200',
      fontSize: '2.125rem',
      display: 'inline-flex',
      float: 'left',
      position: 'inherit'
      // position: 'relative',
      // display: 'inline-flex',
      // top: '0px',
      // left: '0px',
      // width: '100%',
      // margin: '0px',
      // paddingTop: '10px',
      // paddingLeft: '80px',
      // height: get(Meteor, 'settings.public.defaults.prominantHeader') ? '128px' : '64px',
      // whiteSpace: 'nowrap',
      // color: theme.palette.appBar.contrastText,
      // background: 'inherit',
      // backgroundColor: 'none',
      // zIndex: -1
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
    hide: {
      left: '0px',
      display: 'none'
    }
  };
});


// ==============================================================================
// Main Component

function Header(props) {
  
  if(props.logger){
    // props.logger.trace('Rendering the application Header.');
    props.logger.verbose('package.care-cards.client.layout.Header');  
    props.logger.data('Header.props', {data: props}, {source: "headerNavContainer.jsx"});
  }

  let [drawerIsOpen, setDrawerIsOpen] = useState(props.drawerIsOpen);
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


  let componentStyles = useStyles();

  // console.log('componentStyles', componentStyles)

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
      if(get(currentUser, 'givenName') || get(currentUser, 'familyName')){
        userName = get(currentUser, 'givenName', '') + ' ' + get(currentUser, 'familyName', '');
      } else {
        userName = 'Anonymous'
      }
      return userName; 
    }, []);  
  }

  if(!displayNavbars){
    componentStyles.appBar.top = '-128px'
  }
  if(get(Meteor, 'settings.public.defaults.disableHeader')){
    componentStyles.appBar.display = 'none'
  }
  // ------------------------------------------------------------  
  // Layout  

  if(Meteor.isClient && props.drawerIsOpen){
    componentStyles.appBar.width = window.innerWidth - drawerWidth;
    componentStyles.appBar.left = drawerWidth;
  }

  let workflowTabsToRender;
  let selectedWorkflow;
  if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){
    componentStyles.appBar.height = '128px';

    if(Meteor.isClient){


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


  let demographicItems;
  let dateTimeItems;
  let userItems;



  if(Meteor.isClient){

    // if we have a selected patient, we show that info
    if(!Meteor.isCordova){
      if(get(Meteor, 'settings.public.defaults.header.patientId')){
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
          userItems = <div style={{float: 'right', top: '10px', position: 'absolute', right: '20px'}}>
          <Typography variant="h6" color="inherit" className={ componentStyles.header_label }>User: </Typography>
          <Typography variant="h6" color="inherit" className={ componentStyles.header_text } noWrap >
            { currentUser }
          </Typography>
        </div>             
        }
      }
    }
  }

  console.log('Header.drawerIsOpen', drawerIsOpen)
  console.log('Header.componentStyles', componentStyles)
  console.log('Header.componentStyles.appTitle', componentStyles.appTitle)

  return (      
      <AppBar id="header" color="inherit" position="fixed" className={clsx(componentStyles.appBar, {
          [componentStyles.appBarShift]: drawerIsOpen
        })}>
        <Toolbar>
          <IconButton
            id="hamburgerMenuButton"
            color="inherit"
            aria-label="open drawer"
            onClick={ clickOnMenuButton.bind(this) }
            edge="start"
            className={clsx(componentStyles.hamburgerMenuButton, {
              [componentStyles.hide]: drawerIsOpen
            })}
          >
            {/* <MenuIcon id="hamburgerMenuIcon" /> */}
            <Icon 
              id="hamburgerMenuIcon"
              icon={ic_menu} 
              size={32}             
            />
          </IconButton>
          <div id="appTitle" className={componentStyles.appTitle} classes={componentStyles.appTitle}>
            { parseTitle() }
          </div>
        </Toolbar>

        { userItems }
        { dateTimeItems }        
        { demographicItems }
        { workflowTabsToRender }

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
  drawerIsOpen: false,
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

export default Header;