
// base layout
import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react';

// import ReactDOM from "react-dom";
// import { Router, browserHistory } from 'react-router';
// import styled from "styled-components";

import {
  Switch,
  Route
} from "react-router-dom";

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Helmet } from "react-helmet";
import { get, has } from 'lodash';

// import { Box, Container, Grid } from '@material-ui/core';

import { useTracker, withTracker } from './Tracker';

// import Info from './Info.jsx';
import MainPage from './MainPage.jsx';
import NotFound from './NotFound.jsx';

import AppCanvas from './AppCanvas.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListItemLink from '@material-ui/core/ListItemText';

// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import MailIcon from '@material-ui/icons/Mail';

// import { GiPieChart } from 'react-icons/gi';
// import { GiCrossedAirFlows} from 'react-icons/gi';
// import { GiLifeBar } from 'react-icons/gi';
// import { GoGraph } from 'react-icons/go';
// import { IoIosGitNetwork } from 'react-icons/io';
// import { FiSun} from 'react-icons/fi';
// import { IoMdGrid} from 'react-icons/io';
// import { FiBarChart2} from 'react-icons/fi';
// import { IoIosBarcode } from 'react-icons/io';

import PatientSidebar from '../patient/PatientSidebar'


// import ThemePage from '../core/ThemePage';
// import ConstructionZone from '../core/ConstructionZone';

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

console.log('dynamicRoutes', dynamicRoutes)



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

class DebugRouter extends Router {
  constructor(props){
    super(props);
    console.log('initial history is: ', JSON.stringify(this.history, null,2))
    this.history.listen((location, action) => {
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      )
      console.log(`The last navigation action was ${action}`, JSON.stringify(this.history, null,2));
    });
  }
}


export function App(props) {
  if(typeof logger === "undefined"){
    logger = props.logger;
  }
  
  logger.info('Rendering the main App.');
  logger.verbose('client.app.layout.App');
  logger.data('App.props', {data: props}, {source: "AppContainer.jsx"});


  const classes = useStyles();
  const theme = useTheme();

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [appWidth, appHeight] = useWindowSize();

  useEffect(() => {
    if(get(props, 'location.pathname')){
      logger.warn('Location pathname was changed.  Setting the session variable: ' + props.location.pathname);
      Session.set('pathname', props.location.pathname);  
    }
  }, [])

  const absoluteUrl = useTracker(function(){
    logger.log('info','App is checking that Meteor is loaded and fetching the absolute URL.')
    return Meteor.absoluteUrl();
  }, []);

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

  let defaultHomeRoute = MainPage;
  
  let drawerStyle = {}

  let drawer;
  if(Meteor.isClient){
    if(Meteor.connection.status() === "connected"){
      drawer = <Drawer
        id='appDrawer'
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
        style={drawerStyle}
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
    }
  }

  let routingSwitchLogic;
  if(Meteor.isClient){
    routingSwitchLogic = <Switch location={ props.location } >
      { dynamicRoutes.map(route => <Route 
        name={route.name} 
        key={route.name} 
        path={route.path} 
        component={ route.component } 
        onEnter={ route.requireAuth ? requireAuth : null } 
        { ...otherProps }
      />) }

      {/* <Route id='themingRoute' path="/theming" component={ ThemePage } { ...otherProps } />
      <Route id='constructionZoneRoute' path="/construction-zone" component={ ConstructionZone } /> */}

      <Route id='defaultHomeRoute' path="/" component={ defaultHomeRoute } />                
      <Route id='notFoundRoute' path="*" component={ NotFound } />              
    </Switch>
  }

  let showDebugger = false
  if(showDebugger){
    routingSwitchLogic = <DebugRouter location={ props.location }> 
      { routingSwitchLogic }
   </DebugRouter> 
  }

  return(
    
    <AppCanvas { ...otherProps }>
      { helmet }

      <div id='primaryFlexPanel' className={classes.primaryFlexPanel} >
        <CssBaseline />
        <Header { ...otherProps } />
          <div id="appDrawerContainer" style={drawerStyle}>
            { drawer }
          </div>
          <main id='mainAppRouter' className={ classes.canvas}>
            { routingSwitchLogic }
          </main>
        <Footer { ...otherProps } />
      </div>
    </AppCanvas>
  )
}

// export default withStyles(styles, { withTheme: true })(App);
export default App;