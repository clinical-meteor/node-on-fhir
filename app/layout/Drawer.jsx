import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useTracker } from 'meteor/react-meteor-data';

import { 
  IconButton,
  Button,
  Divider
} from '@material-ui/core';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { get, has, cloneDeep } from 'lodash';

import PatientSidebar from '../patient/PatientSidebar'

import theme from '../Theme';
import logger from '../Logger';
import useStyles from '../Styles';

import clsx from 'clsx';

const drawerWidth = get(Meteor, 'settings.public.defaults.drawerWidth', 280);


// ==============================================================================
// Main Component

function Drawer(props) {
  let styles = useStyles();

  let { 
    drawerIsOpen, 
    children, 
    onDrawerOpen,
    onDrawerClose,
    ...otherProps 
  } = props; 

  logger.debug('Drawer.styles', styles)

  if(logger){
    logger.debug('Rendering the application Drawer.');
    logger.verbose('app.layout.Drawer');  
    logger.data('Drawer.props', {data: props}, {source: "DrawerContainer.jsx"});
  }

  function handleDrawerClose(){
    if(typeof onDrawerClose === "function"){
      onDrawerClose();
    }
  }
  function handleDrawerOpen(){
    if(typeof onDrawerOpen === "function"){
      onDrawerOpen();
    }
  }


  return (
    <aside id="appDrawerContainer" >
      <Drawer
        id="appDrawer"
        variant="persistent"
        anchor="left"
        className={styles.drawer}
        classes={{paper: styles.drawerPaper}}
        open={drawerIsOpen}
      >
        <div className={styles.toolbar}>
          <IconButton onClick={handleDrawerClose.bind(this)}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider className={styles.divider} />
        <List>
          <PatientSidebar { ...otherProps } />
        </List>
      </Drawer>
    </aside> 
  );
}


Drawer.propTypes = {
  drawerIsOpen: PropTypes.bool,
  onDrawerOpen: PropTypes.func,
  onDrawerClose: PropTypes.func,
  children: PropTypes.object
}
Drawer.defaultProps = {
  drawerIsOpen: false
}

export default Drawer;