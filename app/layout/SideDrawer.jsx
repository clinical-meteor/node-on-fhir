import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useTracker } from 'meteor/react-meteor-data';

import { 
  IconButton,
  Button,
  Divider,
  List,
  Typography,
  Drawer,
  SwipeableDrawer
} from '@material-ui/core';


import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { get, has, cloneDeep } from 'lodash';

import PatientSidebar from '../patient/PatientSidebar'

import theme from '../Theme';
import { logger } from '../Logger';
import useStyles from '../Styles';

import clsx from 'clsx';

import { useSwipeable } from 'react-swipeable';

const drawerWidth = get(Meteor, 'settings.public.defaults.drawerWidth', 280);

// ==============================================================================
// Device Detection

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

// ==============================================================================
// Main Component

function SideDrawer(props) {
  let styles = useStyles();

  let { 
    children,
    drawerIsOpen, 
    onDrawerOpen,
    onDrawerClose,
    ...otherProps 
  } = props; 

  if(logger){
    // logger.debug('Rendering the application SideDrawer.');
    // logger.verbose('app.layout.SideDrawer');  
    // logger.data('SideDrawer.props', {data: props}, {source: "DrawerContainer.jsx"});

    console.debug('Rendering the application SideDrawer.');
    console.debug('app.layout.SideDrawer');  
    // console.trace('SideDrawer.props', {data: props}, {source: "DrawerContainer.jsx"});
  }

  // ------------------------------------------------------------------
  // Styling & Theming

  const classes = useStyles();


  // ------------------------------------------------------------------
  // Helper Functions

  function handleDrawerClose(event){
    console.log('Closing drawer....', event)

    console.log('handleDrawerClose().event.type', event.type)
    console.log('handleDrawerClose().event.key', event.key)

    if(typeof onDrawerClose === "function"){
      onDrawerClose();
    }
  }
  function handleDrawerOpen(event){
    console.log('Opening drawer....', event)
    
    console.log('handleDrawerOpen().event.type', event.type)
    console.log('handleDrawerOpen().event.key', event.key)

    if(typeof onDrawerOpen === "function"){
      onDrawerOpen();
    }
  }


   const toggleDrawer = (anchor, open) => (event) => {
    console.log('toggleDrawer')
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  // ------------------------------------------------------------------
  // User Interfaces
  
  const drawerHandlers = useSwipeable({
    // onSwiped: function(eventData){
    //   console.log("User Swiped!", eventData)
    // },
    onSwipedLeft: function(eventData){
      console.log("User SwipedLeft!", eventData)

      if(typeof onDrawerClose === "function"){
        onDrawerClose();
      }

      // setDrawerIsOpen(false)
    },
    onSwipedRight: function(eventData){
      console.log("User SwipedRight!", eventData)
      // setDrawerIsOpen(true)

      if(typeof onDrawerOpen === "function"){
        onDrawerOpen();
      }
    },
    onSwipedUp: function(eventData){
      console.log("User SwipedUp!", eventData)
    },
    onSwiping: function(eventData){
      console.log("User Swiping!", eventData)
    },
    onTap: function(eventData){
      console.log("User Tapped!", eventData)
    }
  });


  // ------------------------------------------------------------------
  // Rendering

  let drawerVarient = "temporary";
  let drawerContainerClassNames = styles.drawerContents;;
  let drawerContentsClassNames = styles.drawerContents;

  if(!get(Meteor, 'settings.public.defaults.disableCanvasSlide')){
    drawerVarient = "persistent";
    drawerContainerClassNames = clsx(classes.drawer, {
      [classes.drawerOpen]: drawerIsOpen,
      [classes.drawerClose]: !drawerIsOpen
    })
    drawerContentsClassNames = clsx(classes.drawer, {
      [classes.drawerOpen]: drawerIsOpen,
      [classes.drawerClose]: !drawerIsOpen
    })
  } 

  let containerContents;

  if(Meteor.isClient){
    containerContents = <React.Fragment key="left">
        <Drawer
          id="appDrawer"
          variant={drawerVarient}
          anchor="left"
          className={drawerContentsClassNames}
          classes={{paper: drawerContentsClassNames}}
          open={drawerIsOpen}
          onClose={handleDrawerClose.bind(this)}
          // onOpen={handleDrawerOpen.bind(this)}
          {...drawerHandlers}
        >
          <div className={styles.toolbar}>
            <IconButton onClick={handleDrawerClose.bind(this)} style={{width: '64px', height: '64px'}}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider className={styles.divider} />
          <List>
            <PatientSidebar history={props.history} { ...otherProps } />
          </List>
        </Drawer>
      </React.Fragment>
  }

  // ------------------------------------------------------------------
  // Rendering

  let appDrawerContainerStyle = {
    position: 'absolute',
    height: '100%',
    width: drawerWidth,
    zIndex: 0
  }

  return (
    <aside id="appDrawerContainer" className={drawerContainerClassNames} classes={drawerContainerClassNames} style={appDrawerContainerStyle} >
      { containerContents }
    </aside> 
  );
}


SideDrawer.propTypes = {
  drawerIsOpen: PropTypes.bool,
  onDrawerOpen: PropTypes.func,
  onDrawerClose: PropTypes.func,
  children: PropTypes.oneOf([PropTypes.array, PropTypes.object])
}
SideDrawer.defaultProps = {
  drawerIsOpen: false
}

export default SideDrawer;