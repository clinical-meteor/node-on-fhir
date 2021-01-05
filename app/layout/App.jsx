// https://stackoverflow.com/questions/53290178/cordova-iphone-x-safe-area-after-layout-orientation-changes


// base layout
import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';


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

import { useTracker } from 'meteor/react-meteor-data';

import ProjectPage from './MainPage.jsx';

import MainPage from './MainPage.jsx';
import NotFound from './NotFound.jsx';

import AppCanvas from './AppCanvas.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import ScrollDialog from './Dialog';
import Minibar from './Minibar.jsx';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import clsx from 'clsx';
import moment from 'moment';

import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import AppLoadingPage from '../core/AppLoadingPage'
import PatientChart from '../patient/PatientChart'
import PatientQuickChart from '../patient/PatientQuickChart'
import LaunchPage from '../core/LaunchPage'

import ConstructionZone from '../core/ConstructionZone';
import ContextSlideOut from './ContextSlideOut';

import logger from '../Logger';

//=============================================================================================================================================
// Analytics

import ReactGA from 'react-ga';
if(has(Meteor, 'settings.public.google.analytics')){
  ReactGA.initialize(get(Meteor, 'settings.public.google.analytics.trackingCode'), {debug: get(Meteor, 'settings.public.google.analytics.debug', false)});
}

function logPageView() {
  ReactGA.pageview(window.location.pathname + window.location.search);
  ReactGA.set({ page: window.location.pathname });
};

function usePageViews() {
  let location = useLocation();
  React.useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    ReactGA.set({ page: window.location.pathname });
  }, [location]);
}


// ==============================================================================
// Theming

// import ThemePage from '../core/ThemePage';


import { ThemeProvider } from '@material-ui/styles';
import theme from '../Theme';

const drawerWidth =  get(Meteor, 'settings.public.defaults.drawerWidth', 280);

  const useStyles = makeStyles(theme => ({
    primaryFlexPanel: {
      display: 'block',
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
      background: 'inherit',
      //backgroundColor: theme.palette.background.default,
      transition: theme.transitions.create('left', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      display: 'block',
      zIndex: 1
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
      background: 'inherit',
      //backgroundColor: theme.palette.background.default,
      transition: theme.transitions.create('left', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      display: 'block',
      zIndex: 1
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
      height: get(Meteor, 'settings.public.defaults.prominantHeader') ? "128px" : "64px",
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


// ==============================================================================
// Window Resizing

function getWindowWidth(){
  let result = 0;
  if(Meteor.isClient){
    result = window.innerWidth;
  }
  return result;
}


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
    // logger.trace('Found a custom HeaderNavigation object in one of the packages.')
    headerNavigation = Package[packageName].HeaderNavigation;
  }

  if(Package[packageName].MainPage){
    // logger.trace('Found a custom MainPage object in one of the packages.')
    MainPage = Package[packageName].MainPage;
  }  

  if(Package[packageName].LaunchPage){
    // logger.trace('Found a custom LaunchPage object in one of the packages.')
    LaunchPage = Package[packageName].LaunchPage;
  }  

});

let defaultHomeRoute = MainPage;
let launchPage = LaunchPage;

// logger.debug('Loading the following dynamic routes: ', dynamicRoutes)
// console.log('headerNavigation', headerNavigation)


// ==============================================================================
// Security Based Routing

// patient authentication function
const requireAuth = (nextState, replace) => {
  // do we even need to authorize?
  if(get(Meteor, 'settings.public.defaults.requireAuthorization')){
    // yes, this is a restricted page
    if (!Meteor.loggingIn() && !Meteor.currentUser()) {
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
  if (!Roles.userIsInRole(get(Meteor.currentUser(), '_id'), 'practitioner')) {
    replace({
      pathname: '/need-to-be-practitioner',
      state: { nextPathname: nextState.location.pathname }
    });
  }
};
// practitioner authentication function
const requreSysadmin = (nextState, replace) => {
  if (!Roles.userIsInRole(get(Meteor.currentUser(), '_id'), 'sysadmin')) {
    replace({
      pathname: '/need-to-be-sysadmin',
      state: { nextPathname: nextState.location.pathname }
    });
  }
};




// ==============================================================================
// Main App Component

import {
  Card,
  CardHeader
} from '@material-ui/core';

if(Meteor.isClient){
  Session.setDefault('slideOutCardsVisible', true)
}
export function SlideOutCards(props){


  const slideOutCardsVisible = useTracker(function(){
    return Session.get('slideOutCardsVisible')
  }, []);

  console.log('slideOutCardsVisible', slideOutCardsVisible)

  let overlayContainerStyle = {
    position: 'fixed',
    top: '0px',
    left: '0px',
    height: '100%', 
    width: '100%'
  }

  let overlayStyle = {
    position: 'absolute',
    float: 'right',    
    top: '128px',
    right: '73px',
    height: window.innerHeight - 64 + 'px',
    width: '400px',
    transition: '.7s'
  }

  if(slideOutCardsVisible){
    overlayStyle.right = '-473px';
  }


  return <div id='slideoutCardsContainer' style={overlayContainerStyle}>
    <Card id='slideoutCards' style={overlayStyle}>
      <CardHeader title="Slideout" />
    </Card>
  </div>
}


// ==============================================================================
// Main App Component

export function App(props) {
  if(typeof logger === "undefined"){
    logger = props.logger;
  }
  
  logger.debug('Rendering the main App.');
  logger.verbose('client.app.layout.App');
  logger.data('App.props', {data: props}, {source: "AppContainer.jsx"});


  // ------------------------------------------------------------------
  // Props  

  const { staticContext, startAdornment,  ...otherProps } = props;


  // ------------------------------------------------------------------
  // SMART on FHIR Oauth Scope  

  let searchParams = new URLSearchParams(useLocation().search);
  if(searchParams){

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

  usePageViews();

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
      logPageView()
    }
  }, [])

  // ------------------------------------------------------------------
  // Trackers (Auto Update Variables)

  let absoluteUrl;
  let selectedPatient;

  if(Meteor.isClient){
    absoluteUrl = useTracker(function(){
      logger.log('info','App is checking that Meteor is loaded and fetching the absolute URL.')
      return Meteor.absoluteUrl();
    }, []);
  
    selectedPatient = useTracker(function(){
      return Session.get('selectedPatient')
    }, []);  
  }



  // ------------------------------------------------------------------
  // User Interface Methods

  function handleDrawerOpen(){
    logger.trace('App.handleDrawerOpen()')
    setDrawerIsOpen(!drawerIsOpen);
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
    author: get(Meteor, 'settings.public.socialmedia.author', '')
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

  let initialScale = 0.8;

  headerTags.push(<meta key='theme' name="theme-color" content={themeColor} />)
  headerTags.push(<meta key='utf-8' charSet="utf-8" />);    
  headerTags.push(<meta name="viewport" key='viewport' property="viewport" content={"initial-scale=" + initialScale + ", minimal-ui, minimum-scale=" + initialScale + ", maximum-scale=" + initialScale + ", width=device-width, height=device-height, user-scalable=no"} />);
  headerTags.push(<meta name="description" key='description' property="description" content={get(Meteor, 'settings.public.title', "Node on FHIR")} />);
  headerTags.push(<title key='title'>{get(Meteor, 'settings.public.title', "Node on FHIR")}</title>);

  if(get(Meteor, 'settings.public.socialmedia')){
    //headerTags.push(<title>{socialmedia.title}</title>);    
    headerTags.push(<link key='canonical' rel="canonical" href={socialmedia.url} />);    
    headerTags.push(<meta prefix="og: http://ogp.me/ns#" key='og:title' property="og:title" content={socialmedia.title} />);
    headerTags.push(<meta prefix="og: http://ogp.me/ns#" key='og:type' property="og:type" content={socialmedia.type} />);
    headerTags.push(<meta prefix="og: http://ogp.me/ns#" key='og:url' property="og:url" content={socialmedia.url} />);
    headerTags.push(<meta prefix="og: http://ogp.me/ns#" key='og:image' property="og:image" content={socialmedia.image} />);
    headerTags.push(<meta prefix="og: http://ogp.me/ns#" key='og:description' property="og:description" content={socialmedia.description} />);
    headerTags.push(<meta prefix="og: http://ogp.me/ns#" key='og:site_name' property="og:site_name" content={socialmedia.site_name} />);
    headerTags.push(<meta prefix="og: http://ogp.me/ns#" key='og:author' property="og:author" content={socialmedia.author} />);
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
        <Switch location={ props.location }>
          { dynamicRoutes.map(route => <Route 
            appHeight={appHeight}
            appWidth={appWidth}
            name={route.name} 
            key={route.name} 
            path={route.path} 
            component={ route.component } 
            onEnter={ route.requireAuth ? requireAuth : null } 
            { ...otherProps }
          />) }

        { themingRoute }
        { constructionRoute }
        
        ProjectPage

        <Route name='ProjectPage' key='ProjectPage' path="/project-page" exact component={ ProjectPage } />                
        <Route name='patientChartRoute' key='patientChartPage' path="/patient-chart" exact component={ PatientChart } />                
        <Route name='quickChartRoute' key='quickChartPage' path="/patient-quickchart" exact component={ PatientQuickChart } />                
        <Route name='launchRoute' key='smartOnFhirLaunchPage' path="/launcher" exact component={ launchPage } />                
        <Route name='landingPageRoute' key='landingPageRoute' path="/app-loading-page" component={ AppLoadingPage } />                
        <Route name='defaultHomeRoute' key='defaultHomeRoute' path="/" exact component={ defaultHomeRoute } />                
        <Route name='notFoundRoute' key='notFoundRoute' path="*" component={ NotFound } />              
      </Switch>
    </ThemeProvider>
  }

  return(
    <AppCanvas id='appCanvas' { ...otherProps }>
      <Helmet>{ headerTags }</Helmet>

      <div id='primaryFlexPanel' className={classes.primaryFlexPanel} >
        <CssBaseline />
        <Header drawerIsOpen={drawerIsOpen} handleDrawerOpen={handleDrawerOpen} headerNavigation={headerNavigation} { ...otherProps } />
        <Footer drawerIsOpen={drawerIsOpen} location={props.location} { ...otherProps } />
        <Minibar drawerIsOpen={drawerIsOpen} { ...otherProps } />  
        
        <main id='mainAppRouter' className={clsx({
            [classes.canvasOpen]: drawerIsOpen,
            [classes.canvas]: !drawerIsOpen
          })}>
          { routingSwitchLogic }
        </main>
        <ScrollDialog {...otherProps} appHeight={appHeight} />
      </div>
    </AppCanvas>
  )
}

export default App;