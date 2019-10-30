import React, { memo, useState, useEffect, useCallback } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import classNames from 'classnames';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import { Meteor } from 'meteor/meteor';
import { get, has } from 'lodash';


import { Link } from "react-router-dom";

import { ThemeProvider, makeStyles, useTheme } from '@material-ui/styles';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  },
});


function Header(props) {
  console.log('Header.props', props)

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);


  function handleDrawerOpen(){
    console.log('handleDrawerOpen')
    setDrawerIsOpen(true);
  };

  function handleDrawerClose(){
    setDrawerIsOpen(false);
  };

  function showAlert(){
    props.history.replace('/')
  }

  return (
    <AppBar id="header" position="fixed" color="default" className={appBarClassNames} >
      <Toolbar disableGutters={!drawerIsOpen} >
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={function(){ handleDrawerOpen() }}
            className={iconClassNames}
          >
            <MenuIcon />
          </IconButton>
        <Typography variant="h6" color="inherit" onClick={ function(){ goHome(); }} className={ props.classes.title }>
          { get(Meteor, 'settings.public.title', 'Node on FHIR') }
        </Typography>
      </Toolbar>
    </AppBar>

  );
}


export default withStyles(styles, { withTheme: true })(Header);;