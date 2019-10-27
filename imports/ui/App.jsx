
// base layout
import { Card, CardHeader, CardText, CardTitle } from 'material-ui/Card';
import {blue400, blue600} from 'material-ui/styles/colors';
import PropTypes from 'prop-types';

import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';
import React, { Component } from 'react';


import ReactDOM from "react-dom";
import { browserHistory } from 'react-router';
import styled from "styled-components";

import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  withRouter
} from "react-router-dom";

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Helmet } from "react-helmet";
import { get, has } from 'lodash';

import { Box, Container, Grid } from '@material-ui/core';

import { useTracker, withTracker } from './Tracker';

import ClassComponent from './ClassComponent.jsx';
import FunctionalComponent from './FunctionalComponent.jsx';
import Info from './Info.jsx';
import MainPage from './MainPage.jsx';
import NotFound from './NotFound.jsx';

import AppCanvas from './AppCanvas.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { TransitionGroup, CSSTransition } from "react-transition-group";


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
  const doc = useTracker(function(){
    console.log('Checking that meteor is loaded')
    return true;
  }, [props.docId]);

  console.log('App.props', props)

  const classes = useStyles();

  const { staticContext, ...otherProps } = props;

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

  return(
    <AppCanvas { ...otherProps }>
      { helmet }

      <div id='primaryFlexPanel' className='primaryFlexPanel' >
        <Header { ...otherProps } />
        <section className={classes.canvas}>
          <Switch location={ props.location } >

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
        </section>
        <Footer { ...otherProps } />
      </div>
    </AppCanvas>
  )
}

const Wrapper = styled.div`
    .fade-enter {
        opacity: 0.01;
        position: relative;
    }
    .fade-enter.fade-enter-active {
        opacity: 1;
        transition: opacity 300ms ease-in;
        position: relative;
    }
    .fade-exit {
        opacity: 1;
        position: relative;
    }
      
    .fade-exit.fade-exit-active {
        opacity: 0.01;
        transition: opacity 300ms ease-in;
        position: relative;
    }

    div.transition-group {
      position: absolute;
    }
`;


export default App;
