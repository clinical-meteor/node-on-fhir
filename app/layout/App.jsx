
// base layout
import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react';

// import ReactDOM from "react-dom";
// import { Router, browserHistory } from 'react-router';
// import styled from "styled-components";

import {
  Switch,
  Route,
  useLocation,
  useParams
} from "react-router-dom";


import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Helmet } from "react-helmet";
import { get, has } from 'lodash';

import { useTracker, withTracker } from './Tracker';

import MainPage from './MainPage.jsx';
import NotFound from './NotFound.jsx';

import AppCanvas from './AppCanvas.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import ScrollDialog from './Dialog';

import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import clsx from 'clsx';
import moment from 'moment';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import PatientSidebar from '../patient/PatientSidebar'
import AppLoadingPage from '../core/AppLoadingPage'
import PatientChart from '../patient/PatientChart'
import LaunchPage from '../core/LaunchPage'

import ConstructionZone from '../core/ConstructionZone';


// ==============================================================================
// Theming

// import ThemePage from '../core/ThemePage';


import { ThemeProvider } from '@material-ui/styles';
import theme from '../theme';

const drawerWidth =  get(Meteor, 'settings.public.defaults.drawerWidth', 280);

  const useStyles = makeStyles(theme => ({
    primaryFlexPanel: {
      display: 'flex',
    },
    canvas: {
      flexGrow: 1,
      position: "absolute",
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      paddingTop: '0px',
      paddingBottom: '0px',
      backgroundColor: theme.palette.background.default,
      transition: theme.transitions.create('left', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      display: 'block'
    },
    canvasOpen: {
      flexGrow: 1,
      position: "absolute",
      left: drawerWidth,
      top: 0,
      width: '100%',
      height: '100%',
      paddingTop: '0px',
      paddingBottom: '0px',
      backgroundColor: theme.palette.background.default,
      transition: theme.transitions.create('left', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      display: 'block'
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      position: 'absolute', 
      zIndex: 1100,
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
    divider: {
      height: '2px'
    },
    drawerText: {
      textDecoration: 'none !important'
    },
    hide: {
      display: 'none',
    },
    menuButton: {
      marginRight: 36,
      float: 'left'
    },
    toolbar: {
      display: 'inline-block',
      minHeight: get(Meteor, 'settings.public.defaults.prominantHeader') ? "128px" : "64px",
      float: 'left'
    },
    title: {
      paddingTop: '10px'
    },
    header_label: {
      paddingTop: '10px',
      fontWeight: 'bold',
      fontSize: '1 rem',
      float: 'left',
      paddingRight: '10px'
    },
    header_text: {
      paddingTop: '10px',
      fontSize: '1 rem',
      float: 'left'
    },
    northeast_title: {
      paddingTop: '10px',
      float: 'right',
      position: 'absolute',
      paddingRight: '20px',
      right: '0px',
      top: '0px',
      fontWeight: 'normal'
    },
    menu_items: {
      position: 'absolute',
      bottom: '10px'
    }
  }));

  // custom hook to listen to the resize event
  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);

    // useLayoutEffect only works on the client!
    if(Meteor.isClient){
      useLayoutEffect(() => {
        function updateSize() {
          setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
      }, []);  
    }
    return size;
  }


// ==============================================================================
// Dynamic Routes


// Pick up any dynamic routes that are specified in packages, and include them
var dynamicRoutes = [];
var privacyRoutes = [];
var headerNavigation;
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
  if(Package[packageName].HeaderNavigation){
    console.log('Found a custom HeaderNavigation object in one of the packages.')
    headerNavigation = Package[packageName].HeaderNavigation;
  }

  if(Package[packageName].MainPage){
    console.log('Found a custom MainPage object in one of the packages.')
    MainPage = Package[packageName].MainPage;
  }  


});

console.log('Loading the following dynamic routes: ', dynamicRoutes)
// console.log('headerNavigation', headerNavigation)


// ==============================================================================
// Security Based Routing

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





// ==============================================================================
// Main App Component

export function App(props) {
  if(typeof logger === "undefined"){
    logger = props.logger;
  }
  
  logger.info('Rendering the main App.');
  logger.verbose('client.app.layout.App');
  logger.data('App.props', {data: props}, {source: "AppContainer.jsx"});


  // ------------------------------------------------------------------
  // Props  

  const { staticContext, startAdornment,  ...otherProps } = props;


  // ------------------------------------------------------------------
  // SMART on FHIR Oauth Scope  

  let searchParams = new URLSearchParams(useLocation().search);
  if(searchParams){
    console.log("WE HAVE STATE", searchParams.state);
    console.log("WE HAVE QUERY PARAMS");
    searchParams.forEach(function(value, key){
      console.log(key + ': ' + value); 
    });

    if(searchParams.get('iss')){
      Session.set('smartOnFhir_iss', searchParams.get('iss'));
    }
    if(searchParams.get('launch')){
      Session.set('smartOnFhir_launch', searchParams.get('launch'));
    }
    if(searchParams.get('code')){
      Session.set('smartOnFhir_code', searchParams.get('code'));
    }
    if(searchParams.get('scope')){
      Session.set('smartOnFhir_scope', searchParams.get('scope'));
    }

    if(searchParams.state){
      Session.set('smartOnFhir_state', searchParams.state);
    }        
  }



  // ------------------------------------------------------------------
  // Styling & Theming

  const classes = useStyles();
  const theme = useTheme();

  // ------------------------------------------------------------------
  // App UI State

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [appWidth, appHeight] = useWindowSize();

  // ------------------------------------------------------------------
  // Pathname Updates

  useEffect(() => {
    if(get(props, 'location.pathname')){
      logger.warn('Location pathname was changed.  Setting the session variable: ' + props.location.pathname);
      Session.set('pathname', props.location.pathname);  
    }
  }, [])

  let defaultHomeRoute = MainPage;

  // ------------------------------------------------------------------
  // Trackers (Auto Update Variables)

  const absoluteUrl = useTracker(function(){
    logger.log('info','App is checking that Meteor is loaded and fetching the absolute URL.')
    return Meteor.absoluteUrl();
  }, []);

  const selectedPatient = useTracker(function(){
    return Session.get('selectedPatient')
  }, []);


  // ------------------------------------------------------------------
  // User Interface Methods

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


  // ------------------------------------------------------------------
  // Social Media Registration  

  let socialmedia = {
    title: get(Meteor, 'settings.public.socialmedia.title', ''),
    type: get(Meteor, 'settings.public.socialmedia.type', ''),
    url: get(Meteor, 'settings.public.socialmedia.url', ''),
    image: get(Meteor, 'settings.public.socialmedia.image', ''),
    description: get(Meteor, 'settings.public.socialmedia.description', ''),
    site_name: get(Meteor, 'settings.public.socialmedia.site_name', ''),
  }

  let helmet;
  let headerTags = [];
  let themeColor = "";  
  let rawColor = get(Meteor, 'settings.public.theme.palette.appBarColor', "#669f64");

  // all we're doing here is grabing the hex color, and ignoring adornments like !important
  if(rawColor.split(" ")){
    themeColor = rawColor.split(" ")[0];
  } else {
    themeColor = rawColor;
  }

  headerTags.push(<meta key='theme' name="theme-color" content={themeColor} />)
  headerTags.push(<meta key='utf-8' charSet="utf-8" />);    
  headerTags.push(<meta name="Description" key='description' property="description" content={get(Meteor, 'settings.public.title', "Node on FHIR")} />);

  if(get(Meteor, 'settings.public.socialmedia')){
    //headerTags.push(<title>{socialmedia.title}</title>);    
    headerTags.push(<link key='canonical' rel="canonical" href={socialmedia.url} />);    
    headerTags.push(<meta key='og:title' property="og:title" content={socialmedia.title} />);
    headerTags.push(<meta key='og:type' property="og:type" content={socialmedia.type} />);
    headerTags.push(<meta key='og:url' property="og:url" content={socialmedia.url} />);
    headerTags.push(<meta key='og:image' property="og:image" content={socialmedia.image} />);
    headerTags.push(<meta key='og:description' property="og:description" content={socialmedia.description} />);
    headerTags.push(<meta key='og:site_name' property="og:site_name" content={socialmedia.site_name} />);
  }

  helmet = <Helmet>
    { headerTags }
  </Helmet>


  

  // ------------------------------------------------------------------
  // User Interface

  let drawerStyle = {}

  let drawer;
  if(Meteor.isClient){
      drawer = <Drawer
        id='appDrawer'
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: drawerIsOpen,
          [classes.drawerClose]: !drawerIsOpen
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: drawerIsOpen,
            [classes.drawerClose]: !drawerIsOpen
          }),
        }}
        open={drawerIsOpen}
        style={drawerStyle}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider className={classes.divider} />
        <List>
          <PatientSidebar { ...otherProps } />
        </List>
      </Drawer>
  }

  // ------------------------------------------------------------------
  // Page Routing  

  let routingSwitchLogic;
  let themingRoute;
  let constructionRoute;

  if(Meteor.isClient){

    if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Theming')){
      themingRoute = <Route id='themingRoute' path="/theming" component={ ThemePage } { ...otherProps } />
    }
    if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.ConstructionZone')){
      themingRoute = <Route id='constructionZoneRoute' path="/construction-zone" component={ ConstructionZone } />
    }

    routingSwitchLogic = <ThemeProvider theme={theme} >
        <Switch location={ props.location } >
          { dynamicRoutes.map(route => <Route 
            name={route.name} 
            key={route.name} 
            path={route.path} 
            component={ route.component } 
            onEnter={ route.requireAuth ? requireAuth : null } 
            { ...otherProps }
          />) }

        { themingRoute }
        { constructionRoute }
        
        <Route name='smartOnFhirSampleAppRoute' key='smartOnFhirSampleApp' path="/patient-chart" exact component={ PatientChart } />                
        <Route name='launchRoute' key='smartOnFhirLaunchPage' path="/launcher" exact component={ LaunchPage } />                
        <Route name='landingPageRoute' key='landingPageRoute' path="/app-loading-page" component={ AppLoadingPage } />                
        <Route name='defaultHomeRoute' key='defaultHomeRoute' path="/" exact component={ defaultHomeRoute } />                
        <Route name='notFoundRoute' key='notFoundRoute' path="*" component={ NotFound } />              
      </Switch>
    </ThemeProvider>
  }


  return(
    <AppCanvas { ...otherProps }>
      { helmet }

      <div id='primaryFlexPanel' className={classes.primaryFlexPanel} >
        <CssBaseline />
        <Header drawerIsOpen={drawerIsOpen} handleDrawerOpen={handleDrawerOpen} headerNavigation={headerNavigation} { ...otherProps } />
        <Footer drawerIsOpen={drawerIsOpen} { ...otherProps } location={props.location} />

        <div id="appDrawerContainer" style={drawerStyle}>
          { drawer }
        </div>
        <main id='mainAppRouter' className={clsx({
            [classes.canvasOpen]: drawerIsOpen,
            [classes.canvas]: !drawerIsOpen
          })}>
          { routingSwitchLogic }
        </main>
        <ScrollDialog />
      </div>
    </AppCanvas>
  )
}

// export default withStyles(styles, { withTheme: true })(App);
export default App;