import React, { useState } from 'react';
import clsx from 'clsx';

import PropTypes from 'prop-types';
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import PatientSidebar from '../patient/PatientSidebar'

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


// ==============================================================================
// Environment / Utility Function


function getWindowWidth(){
  let result = 0;
  if(Meteor.isClient){
    result = window.innerWidth;
  }
  return result;
}


// ==============================================================================
// Theming

const useStyles = makeStyles(function(theme){
  return {
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      position: 'absolute', 
      zIndex: 1100,
      backgroundColor: theme.palette.paper.main
    },
    drawerOpen: {
      margin: '0px',
      width: drawerWidth,
      transition: theme.transitions.create(['width', 'left', 'opacity'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      backgroundColor: theme.palette.paper.main,
      opacity: 1,
      left: '0px'
    },
    drawerClose: {
      margin: '0px',
      transition: theme.transitions.create(['width', 'left', 'opacity'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1
      },
      backgroundColor: theme.palette.paper.main,
      opacity: (get(Meteor, 'settings.public.defaults.sidebar.minibarVisible') && (getWindowWidth() > 1072)) ? 1 : 0,
      left: (get(Meteor, 'settings.public.defaults.sidebar.minibarVisible') && (getWindowWidth() > 1072)) ? '0px' : ('-' + theme.spacing(7) + 1 + 'px')
    },
    drawerIcons: {
      fontSize: '120%',
      paddingLeft: '8px',
      paddingRight: '2px'
    },
    appDrawer: {
      margin: '0px'
    },  
    appDrawerContainer: {
      margin: '0px'
    }, 
    divider: {
      height: '2px',
      flexGrow: 0
    },
    drawerText: {
      textDecoration: 'none !important'
    },
    drawerList: {
      top: get(Meteor, 'settings.public.defaults.prominantHeader') ? "128px" : "64px"
    }
  };
});


// ==============================================================================
// Main Component

function Minibar(props) {

  let { children, drawerIsOpen, ...otherProps } = props;
  
  if(props.logger){
    // props.logger.trace('Rendering the application Minibar.');
    props.logger.verbose('package.care-cards.client.layout.Minibar');  
    props.logger.data('Minibar.props', {data: props}, {source: "headMinibarrNavContainer.jsx"});
  }


  // ------------------------------------------------------------------
  // Styling & Theming

  const classes = useStyles();
  const theme = useTheme();



  // ------------------------------------------------------------
  // Styling


  let componentStyles = useStyles();


  logger.debug('Minibar.drawerIsOpen', drawerIsOpen)
  logger.debug('Minibar.componentStyles', componentStyles)

  let renderElements = <div id="minibarDrawer"></div>;
  if(Meteor.isClient){
    if(get(Meteor, 'settings.public.defaults.sidebar.minibarVisible')){
      renderElements = <div id="appDrawerContainer" className={classes.appDrawerContainer}>
        <Drawer
          id='appDrawer'
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: drawerIsOpen,
            [classes.drawerClose]: !drawerIsOpen
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: drawerIsOpen,
              [classes.drawerClose]: !drawerIsOpen,
            }),
          }}
          open={drawerIsOpen}
        >
          {/* <div id="menuIconDiv" className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose.bind(this)}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div> */}
          {/* <Divider id="drawerDivider" className={classes.divider} /> */}
          <List id="drawerList" className={classes.drawerList}>
            <PatientSidebar { ...otherProps } />
          </List>
        </Drawer>
      </div>
    }
  }

  return renderElements;
}

Minibar.propTypes = {
  drawerIsOpen: PropTypes.bool,
  handleDrawerOpen: PropTypes.func,
  headerNavigation: PropTypes.func
}
Minibar.defaultProps = {
  drawerIsOpen: false
}

export default Minibar;