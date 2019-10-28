
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

import { ThemeProvider, makeStyles, useTheme } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  canvas: {
    paddingTop: "80px",
    paddingBottom: "80px",
    paddingLeft: '20px',
    paddingRight: '20px',
    position: "absolute",
    top: 0,
    left: 0
  }
}));


const drawerWidth = 240;

const styles = theme => ({
  header: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    })
  },
  canvas: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    paddingLeft: '73px'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    backgroundColor: '#fafafa'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: '#fafafa'
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
    },
    backgroundColor: '#fafafa'
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
    marginLeft: 12,
    marginRight: 36,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  }

});


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



export function App(props) {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const doc = useTracker(function(){
    console.log('Checking that meteor is loaded')
    return true;
  }, [props.docId]);

  console.log('App.props', props)

  const classes = useStyles();

  const { staticContext, ...otherProps } = props;

  function handleDrawerOpen(){
    console.log('App.handleDrawerOpen()')
    setDrawerIsOpen(true);
  };

  function handleDrawerClose(){
    setDrawerIsOpen(false);
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

  let listItemsArray = [];  

  let linksArray = [{
    label: 'Pie',
    path: '/pie-graph',
    icon: <GiPieChart className={props.classes.drawerIcons} />
   }, {
    label: 'Parallels',
    path: '/parallels-graph',
    icon: <IoIosBarcode className={props.classes.drawerIcons} />
  }, {
    label: 'Sunburst',
    path: '/sunburst-graph',
    icon: <FiSun className={props.classes.drawerIcons} />
  }, {
    label: 'Sankey',
    path: '/sankey-graph',
    icon: <GiCrossedAirFlows className={props.classes.drawerIcons} />
  }, {
    label: 'Bar',
    path: '/bar-graph',
    icon: <GiLifeBar className={props.classes.drawerIcons} />
  }, {
    label: 'Network',
    path: '/network-graph',
    icon: <IoIosGitNetwork className={props.classes.drawerIcons} />
   }]

   
   linksArray.forEach(function(linkConfig, index){
    listItemsArray.push(
      <NavLink to={linkConfig.path} activeStyle={{ fontWeight: "bold", color: "red" }} key={linkConfig.path} >
        <ListItem button  >
          <ListItemIcon >
            {linkConfig.icon}
          </ListItemIcon>
          <ListItemText primary={linkConfig.label} className={props.classes.drawerText} />
        </ListItem>
      </NavLink>
  )});

  return(
    <AppCanvas { ...otherProps }>
      { helmet }

      <div id='primaryFlexPanel' className='primaryFlexPanel' >
        {/* <Header { ...otherProps } /> */}

        <AppBar id="header" position="fixed" color="default" className={classNames(props.classes.appBar, {
            [props.classes.appBarShift]: drawerIsOpen,
          })} >
          <Toolbar disableGutters={!drawerIsOpen} >
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={function(){ handleDrawerOpen() }}
                className={classNames( props.classes.menuButton, {
                  [ props.classes.hide ]: drawerIsOpen,
                })}
              >
                <MenuIcon />
              </IconButton>
            <Typography variant="h6" color="inherit" onClick={ function(){ goHome(); }} className={ props.classes.title }>
              { get(Meteor, 'settings.public.title', 'Node on FHIR') }
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
            variant="permanent"
            className={classNames( props.classes.drawer, {
              [ props.classes.drawerOpen ]: drawerIsOpen,
              [ props.classes.drawerClose ]: !drawerIsOpen,
            })}
            classes={{
              paper: classNames({
                [ props.classes.drawerOpen ]: drawerIsOpen,
                [ props.classes.drawerClose ]: !drawerIsOpen,
              }),
            }}
            open={drawerIsOpen}
          >
            <div className={ props.classes.toolbar }>
              <IconButton onClick={function(){ handleDrawerClose(); }}>
                <MenuIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              <PatientSidebar { ...otherProps } />
            </List>
          </Drawer>

          <main className={classes.canvas}>
            <Switch location={ props.location } >

              <Route path="/theming" component={ ThemePage } />


              { dynamicRoutes.map(route => <Route 
                name={route.name} 
                key={route.name} 
                path={route.path} 
                component={ route.component } 
                onEnter={ route.requireAuth ? requireAuth : null } 
              />) }

              <Route path="/" component={ MainPage } />

              <Route path="*" component={ NotFound } />              
            </Switch>
          </main>
        <Footer { ...otherProps } />
      </div>
    </AppCanvas>
  )
}


export default withStyles(styles, { withTheme: true })(App);