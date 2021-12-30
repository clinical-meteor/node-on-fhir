// https://stackoverflow.com/questions/53290178/cordova-iphone-x-safe-area-after-layout-orientation-changes


// base layout
import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react';

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

import GettingStartedPage from './GettingStartedPage.jsx';
import NotFound from './NotFound.jsx';

import AppCanvas from './AppCanvas.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import ScrollDialog from './Dialog';
import SideDrawer from './SideDrawer';

import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import clsx from 'clsx';

import AppLoadingPage from '../core/AppLoadingPage'
import PatientChart from '../patient/PatientChart'
import PatientQuickChart from '../patient/PatientQuickChart'
import EhrLaunchPage from '../core/EhrLaunchPage'
import SmartLauncher from '../layout/SmartLauncher'

import QrScannerPage from '../core/QrScannerPage';
import ConstructionZone from '../core/ConstructionZone';
import ContextSlideOut from './ContextSlideOut';

import logger from '../Logger';
import useStyles from '../Styles';

import { useSwipeable } from 'react-swipeable';

//===============================================================================================================
// Analytics

let analyticsTrackingCode = get(Meteor, 'settings.public.google.analytics.trackingCode')

import ReactGA from 'react-ga';
ReactGA.initialize(analyticsTrackingCode, {debug: get(Meteor, 'settings.public.google.analytics.debug', false)});

function logPageView() {
  if(analyticsTrackingCode){
    ReactGA.pageview(window.location.pathname + window.location.search);
    ReactGA.set({ page: window.location.pathname });  
  }
};

function usePageViews() {
  let location = useLocation();
  React.useEffect(() => {
    if(analyticsTrackingCode){
      ReactGA.pageview(window.location.pathname + window.location.search);
      ReactGA.set({ page: window.location.pathname });  
    }
  }, [location]);
}


// ==============================================================================
// Theming

// import ThemePage from '../core/ThemePage';


import { ThemeProvider } from '@material-ui/styles';
import theme from '../Theme';

const drawerWidth =  get(Meteor, 'settings.public.defaults.drawerWidth', 280);
const defaultCanvasColor =  get(Meteor, 'settings.public.theme.palette.canvasColor', "#f2f2f2");

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
    GettingStartedPage = Package[packageName].MainPage;
  }  

  if(Package[packageName].EhrLaunchPage){
    // logger.trace('Found a custom EhrLaunchPage object in one of the packages.')
    EhrLaunchPage = Package[packageName].EhrLaunchPage;
  }  

  if(Package[packageName].ConstructionZone){
    // logger.trace('Found a custom ConstructionZone object in one of the packages.')
    ConstructionZone = Package[packageName].ConstructionZone;
  }  

});

let defaultHomeRoute = GettingStartedPage;
let defaultEhrLaunchPage = EhrLaunchPage;

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

// // ==============================================================================
// // In App Browser

// if(Meteor.isCordova){
//   window.open = cordova.InAppBrowser.open;
// }


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

if(Meteor.isClient){
  Session.setDefault('canvasBackgroundColor', "#f2f2f2")
}



// ==============================================================================
// Main App Component

export function App(props) {
  // if(typeof logger === "undefined"){
  //   logger = props.logger;
  // }
  
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


  // // ------------------------------------------------------------------
  // // User Interfaces
  
  // const drawerHandlers = useSwipeable({
  //   // onSwiped: function(eventData){
  //   //   console.log("User Swiped!", eventData)
  //   // },
  //   onSwipedLeft: function(eventData){
  //     console.log("User SwipedLeft!", eventData)
  //     setDrawerIsOpen(false)
  //   },
  //   onSwipedRight: function(eventData){
  //     console.log("User SwipedRight!", eventData)
  //     setDrawerIsOpen(true)
  //   },
  //   onSwipedUp: function(eventData){
  //     console.log("User SwipedUp!", eventData)
  //   },
  //   onSwiping: function(eventData){
  //     console.log("User Swiping!", eventData)
  //   },
  //   onTap: function(eventData){
  //     console.log("User Tapped!", eventData)
  //   }
  // });



  // ------------------------------------------------------------------
  // Pathname Updates

  useEffect(() => {
    if(get(props, 'location.pathname')){
      logger.warn('Location pathname was changed.  Setting the session variable: ' + props.location.pathname);
      Session.set('pathname', props.location.pathname);  
      logPageView()
    }

    if(document.getElementById("reactCanvas") && !Meteor.isCordova){
      document.getElementById("reactCanvas").setAttribute("style", "bottom: 0px; background: " + defaultCanvasColor + ";");
      document.getElementById("reactCanvas").setAttribute("background", defaultCanvasColor);
    }
  }, [])

  // ------------------------------------------------------------------
  // Trackers (Auto Update Variables)

  const absoluteUrl = useTracker(function(){
    logger.log('info','App is checking that Meteor is loaded and fetching the absolute URL.')
    return Meteor.absoluteUrl();
  }, []);

  const selectedPatient = useTracker(function(){
    return Session.get('selectedPatient')
  }, []);


  // const canvasBackgroundColor = useTracker(function(){    
  //   let canvasBackgroundColor = Session.get('canvasBackgroundColor')    
  //   console.log('canvasBackgroundColor updated', canvasBackgroundColor)

  //   if(canvasBackgroundColor && document.getElementById("reactCanvas")){
  //     document.getElementById("reactCanvas").setAttribute("style", "background: " + canvasBackgroundColor + ";");
  //     document.body.setAttribute("style", "background: inherit !important;");

  //     // if(document.getElementById("footerNavContainer")){
  //     //   document.getElementById("footerNavContainer").setAttribute("style", "background: " + canvasBackgroundColor + " !important;");
  //     //   document.getElementById("footerNavContainer").setAttribute("style", "border-top: none;");  
  //     // }
  //   } else {
  //   }
  //   return canvasBackgroundColor;
  // }, []);

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

  let initialScale = 1.0;

  headerTags.push(<meta key='theme' name="theme-color" content={themeColor} />)
  headerTags.push(<meta key='utf-8' charSet="utf-8" />);    
  // headerTags.push(<meta name="viewport" key='viewport' property="viewport" content={"initial-scale=" + initialScale + ", minimal-ui, minimum-scale=" + initialScale + ", maximum-scale=" + initialScale + ", width=device-width, height=device-height, user-scalable=no"} />);
  headerTags.push(<meta name="viewport" key='viewport' property="viewport" content={"initial-scale=" + initialScale + ", minimal-ui, minimum-scale=" + initialScale + ", maximum-scale=" + initialScale + ", width=device-width, height=device-height"} />);
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

  helmet = <Helmet>
    { headerTags }
  </Helmet>


  

  // // ------------------------------------------------------------------
  // // User Interface

  // let drawerVarient = "persistent";
  // if(get(Meteor, 'settings.public.defaults.disableCanvasSlide')){
  //   drawerVarient = "temporary";
  // } 

  // let drawer;
  // if(Meteor.isClient){
  //     drawer = <Drawer
  //       id='appDrawer'
  //       anchor="left"
  //       variant={drawerVarient}
  //       className={clsx(classes.drawer, {
  //         [classes.drawerOpen]: drawerIsOpen,
  //         [classes.drawerClose]: !drawerIsOpen
  //       })}
  //       classes={{
  //         paper: clsx({
  //           [classes.drawerOpen]: drawerIsOpen,
  //           [classes.drawerClose]: !drawerIsOpen
  //         })
  //       }}
  //       open={drawerIsOpen}
  //     >
  //       <div className={classes.toolbar}>
  //         <IconButton onClick={handleDrawerClose.bind(this)} style={{width: '64px', height: '64px'}}>
  //           {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
  //         </IconButton>
  //       </div>
  //       <Divider className={classes.divider} />
  //       <List>
  //         <PatientSidebar { ...otherProps } />
  //       </List>
  //     </Drawer>
  // }

  // ------------------------------------------------------------------
  // Page Routing  

  let routingSwitchLogic;
  let themingRoute;
  let constructionRoute;
  let qrScannerRoute;

  if(Meteor.isClient){

    if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.Theming')){
      themingRoute = <Route id='themingRoute' path="/theming" component={ ThemePage } { ...otherProps } />
    }
    if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.ConstructionZone')){
      constructionRoute = <Route id='constructionZoneRoute' path="/construction-zone" component={ ConstructionZone } />
    }
    if(get(Meteor, 'settings.public.defaults.sidebar.menuItems.QrScanner')){
      qrScannerRoute = <Route id='QrScannerPage' path="/qr-scanner" component={ QrScannerPage } />
    }
    

    routingSwitchLogic = <ThemeProvider theme={theme} >
        <Switch location={props.location} history={props.history} >
          { dynamicRoutes.map(route => <Route 
            appHeight={appHeight}
            appWidth={appWidth}
            name={route.name} 
            key={route.name} 
            path={route.path} 
            history={props.history}
            component={ route.component } 
            onEnter={ route.requireAuth ? requireAuth : null } 
            { ...otherProps }
          />) }

        { themingRoute }
        { constructionRoute }
        { qrScannerRoute }
        
        <Route name='SmartLauncher' key='SmartLauncher' path="/smart-launcher" exact component={ SmartLauncher } />                
        <Route name='patientChartRoute' key='patientChartPage' path="/patient-chart" exact component={ PatientChart } />                
        <Route name='patientIntakeRoute' key='patientIntakePage' path="/patient-intake" exact component={ PatientQuickChart } />       
        <Route name='quickChartRoute' key='quickChartPage' path="/patient-quickchart" exact component={ PatientQuickChart } />                
        <Route name='launchRoute' key='defaultEhrLaunchPage' path="/launcher" exact component={ defaultEhrLaunchPage } />                
        <Route name='ehrLaunchRoute' key='EhrLaunchPage' path="/ehr-launcher" exact component={ defaultEhrLaunchPage } />                
        <Route name='landingPageRoute' key='landingPageRoute' path="/app-loading-page" component={ AppLoadingPage } />      
        <Route name='gettingStartedPage' key='gettingStartedRoute' path="/getting-started" component={ GettingStartedPage } />      

        <Route name='defaultHomeRoute' key='defaultHomeRoute' path="/" exact component={ defaultHomeRoute } />                
        <Route name='notFoundRoute' key='notFoundRoute' path="*" component={ NotFound } />              
      </Switch>
    </ThemeProvider>
  }

  let canvasSlide;
  if(!get(Meteor, 'settings.public.defaults.disableCanvasSlide')){
    canvasSlide = clsx({
      [classes.canvasOpen]: drawerIsOpen,
      [classes.canvas]: !drawerIsOpen
    })
  } else {
    canvasSlide = clsx(classes.canvas)
  }


  return(
    <AppCanvas { ...otherProps }>
      { helmet }
      <div id='primaryFlexPanel' className={classes.primaryFlexPanel} >
        <Header drawerIsOpen={drawerIsOpen} handleDrawerOpen={handleDrawerOpen} headerNavigation={headerNavigation} { ...otherProps } />
        <SideDrawer drawerIsOpen={drawerIsOpen} onDrawerClose={function(){setDrawerIsOpen(false)}}  { ...otherProps } />        
        <Footer drawerIsOpen={drawerIsOpen} location={props.location} { ...otherProps } />
        <ContextSlideOut drawerIsOpen={drawerIsOpen} onDrawerClose={function(){setDrawerIsOpen(false)}}  { ...otherProps } />

        <main id='mainAppRouter' className={canvasSlide}>
          { routingSwitchLogic }
        </main>
        <ScrollDialog {...otherProps} appHeight={appHeight} />
      </div>
    </AppCanvas>
  )
}

export default App;