
// base layout
import { Card, CardHeader, CardText, CardTitle } from 'material-ui/Card';
import {blue400, blue600} from 'material-ui/styles/colors';
import PropTypes from 'prop-types';

import React, { memo, useState, useEffect, useCallback } from 'react';

import ReactDOM from "react-dom";
import { browserHistory } from 'react-router';
import styled from "styled-components";

import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  NavLink,
  withRouter
} from "react-router-dom";

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Helmet } from "react-helmet";
import { get, has } from 'lodash';

import { Box, Container, Grid } from '@material-ui/core';

import { useTracker, withTracker } from './Tracker';

import Info from './Info.jsx';
import MainPage from './MainPage.jsx';
import NotFound from './NotFound.jsx';

import AppCanvas from './AppCanvas.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import clsx from 'clsx';

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
import ListItemLink from '@material-ui/core/ListItemText';

import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import { GoGraph } from 'react-icons/go';
import { GiPieChart } from 'react-icons/gi';
import { IoIosGitNetwork } from 'react-icons/io';
import { FiSun} from 'react-icons/fi';
import { GiCrossedAirFlows} from 'react-icons/gi';
import { IoMdGrid} from 'react-icons/io';
import { FiBarChart2} from 'react-icons/fi';
import { GiLifeBar } from 'react-icons/gi';
import { IoIosBarcode } from 'react-icons/io';

import PatientSidebar from '../patient/PatientSidebar'

import ThemePage from '../core/ThemePage';

import { ThemeProvider } from '@material-ui/styles';

const drawerWidth = 280;

// const styles = theme => ({
  const useStyles = makeStyles(theme => ({
    primaryFlexPanel: {
      display: 'flex',
    },
    header: {
      display: 'flex'
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      backgroundColor: theme.palette.appBar.main,
      color: theme.palette.appBar.contrastText
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      backgroundColor: theme.palette.appBar.main,
      color: theme.palette.appBar.contrastText
    },
    canvas: {
      flexGrow: 1,
      position: "absolute",
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      paddingTop: '100px',
      paddingBottom: '100px',
      backgroundColor: theme.palette.background.default
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      backgroundColor: theme.palette.paper.main
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      backgroundColor: theme.palette.paper.main
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
      backgroundColor: theme.palette.paper.main
    },
    drawerIcons: {
      fontSize: '120%',
      paddingLeft: '8px',
      paddingRight: '2px'
    },
    drawerText: {
      textDecoration: 'none !important'
    },
    hide: {
      display: 'none',
    },
    menuButton: {
      marginRight: 36,
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar
    }
  }));

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.location !== this.props.location) {
  //     // navigated!
  //     // console.log('componentWillReceiveProps', this.props.location, nextProps.location)
  //     Session.set('pathname', nextProps.location.pathname)
  //   }
  // }


// Pick up any dynamic routes that are specified in packages, and include them
var dynamicRoutes = [];
var privacyRoutes = [];
Object.keys(Package).forEach(function(packageName){
  if(Package[packageName].DynamicRoutes){
    // we try to build up a route from what's specified in the package
    Package[packageName].DynamicRoutes.forEach(function(route){
      dynamicRoutes.push(route);      

      if(route.privacyEnabled){
        privacyRoutes.push(route.path)
      }
    });    
  }
});

// logger.log('info','dynamicRoutes', dynamicRoutes)



// patient authentication function
const requireAuth = (nextState, replace) => {
  // do we even need to authorize?
  if(get(Meteor, 'settings.public.defaults.requireAuthorization')){
    // yes, this is a restricted page
    if (!Meteor.loggingIn() && !Meteor.userId()) {
      // we're in the compiled desktop app that somebody purchased or downloaded
      // so no need to go to the landing page
      // lets just take them to the signin page
      if(Meteor.isDesktop){
        replace({
          pathname: '/signin',
          state: { nextPathname: nextState.location.pathname }
        });  
      } else {

        // we're in the general use case
        // user is trying to access a route that requires authorization, but isn't signed in
        // redirect them to the landing page
        if(get(Meteor, 'settings.public.defaults.landingPage')){
          replace({
            pathname: get(Meteor, 'settings.public.defaults.landingPage'),
            state: { nextPathname: nextState.location.pathname }
          });    
        } else {
          replace({
            pathname: '/landing-page',
            state: { nextPathname: nextState.location.pathname }
          });    
        }

      }
    }

  } else {
  // apparently we don't need to authorize;
  // so lets just continue (i.e. everybody is authorized)
    if(get(Meteor, 'settings.public.defaults.route')){
      // hey, a default route is specified
      // lets go there
      replace({
        pathname: get(Meteor, 'settings.public.defaults.route'),
        state: { nextPathname: nextState.location.pathname }
      });  
    }

    // can't find anywhere else to go to, so lets just go to the root path 
    // ¯\_(ツ)_/¯
  }
};

// practitioner authentication function
const requirePractitioner = (nextState, replace) => {
  if (!Roles.userIsInRole(Meteor.userId(), 'practitioner')) {
    replace({
      pathname: '/need-to-be-practitioner',
      state: { nextPathname: nextState.location.pathname }
    });
  }
};
// practitioner authentication function
const requreSysadmin = (nextState, replace) => {
  if (!Roles.userIsInRole(Meteor.userId(), 'sysadmin')) {
    replace({
      pathname: '/need-to-be-sysadmin',
      state: { nextPathname: nextState.location.pathname }
    });
  }
};


export function App(props) {
  logger.info('Rendering the main App.');
  logger.verbose('client.app.layout.App');
  logger.data('App.props', {data: props}, {source: "AppContainer.jsx"});


  const classes = useStyles();
  const theme = useTheme();

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  useEffect(() => {
    logger.verbose('Location pathname was changed.  Setting the session variable: ' + props.location.pathname);
    Session.set('pathname', props.location.pathname);
  }, [props.location.pathname])


  const absoluteUrl = useTracker(function(){
    logger.log('info','App is checking that Meteor is loaded and fetching the absolute URL.')
    return Meteor.absoluteUrl();
  }, [props.location.pathname]);

  const { staticContext, ...otherProps } = props;

  function handleDrawerOpen(){
    logger.trace('App.handleDrawerOpen()')
    setDrawerIsOpen(true);
  };

  function handleDrawerClose(){
    setDrawerIsOpen(false);
    logger.trace('App.handleDrawerClose()')

  };

  function goHome(){
    props.history.replace('/');
  };


  let socialmedia = {
    title: get(Meteor, 'settings.public.socialmedia.title', ''),
    type: get(Meteor, 'settings.public.socialmedia.type', ''),
    url: get(Meteor, 'settings.public.socialmedia.url', ''),
    image: get(Meteor, 'settings.public.socialmedia.image', ''),
    description: get(Meteor, 'settings.public.socialmedia.description', ''),
    site_name: get(Meteor, 'settings.public.socialmedia.site_name', ''),
  }

  let helmet;
  if(get(Meteor, 'settings.public.socialmedia')){
    helmet = <Helmet>
      <meta charSet="utf-8" />
      <title>{socialmedia.title}</title>
      <link rel="canonical" href={socialmedia.url} />

      <meta property="og:title" content={socialmedia.title} />
      <meta property="og:type" content={socialmedia.type} />
      <meta property="og:url" content={socialmedia.url} />
      <meta property="og:image" content={socialmedia.image} />
      <meta property="og:description" content={socialmedia.description} />
      <meta property="og:site_name" content={socialmedia.site_name} />
      
    </Helmet>
  }


  let defaultHomeRoute = MainPage;
  
  return(
    
    <AppCanvas { ...otherProps }>
      { helmet }

      <div id='primaryFlexPanel' className={classes.primaryFlexPanel} >
        <CssBaseline />
        {/* <Header { ...otherProps } /> */}

        <AppBar id="header" position="fixed" color="default" className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerIsOpen
        })} >
          <Toolbar >
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={ handleDrawerOpen }
                edge="start"
                className={clsx(classes.menuButton, {
                  [classes.hide]: drawerIsOpen,
                })}
              >
                <MenuIcon />
              </IconButton>
            <Typography variant="h6" color="inherit" onClick={ function(){ goHome(); }} className={ classes.title } noWrap >
              { get(Meteor, 'settings.public.title', 'Node on FHIR') }
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: drawerIsOpen,
              [classes.drawerClose]: !drawerIsOpen,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: drawerIsOpen,
                [classes.drawerClose]: !drawerIsOpen,
              }),
            }}
            open={drawerIsOpen}
          >
            <div className={classes.toolbar}>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </div>
            <Divider />
            <List>
              <PatientSidebar { ...otherProps } />
            </List>
          </Drawer>

          <main className={ classes.canvas}>
            <Switch location={ props.location } >

              <Route path="/theming" component={ ThemePage } { ...otherProps } />

              { dynamicRoutes.map(route => <Route 
                name={route.name} 
                key={route.name} 
                path={route.path} 
                component={ route.component } 
                onEnter={ route.requireAuth ? requireAuth : null } 
                { ...otherProps }
              />) }

              <Route path="/" component={ defaultHomeRoute } />

              <Route path="*" component={ NotFound } />              
            </Switch>
          </main>
        <Footer drawyerIsOpen={drawerIsOpen} { ...otherProps } />
      </div>
    </AppCanvas>
  )
}


// export default withStyles(styles, { withTheme: true })(App);

export default App;