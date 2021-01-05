
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';


import { BrowserRouter, withRouter, Router } from "react-router-dom";

import { get } from 'lodash';

import { Meteor } from 'meteor/meteor';

import { ThemeProvider } from '@material-ui/styles';
// import { blue400, blue600, green600, green800 } from 'material-ui/styles/colors';

// import { withRouter } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import App from './App.jsx';
import AppLoadingPage from '../core/AppLoadingPage.jsx';

import { createLogger, addColors, format, transports } from 'winston';
import 'setimmediate';

import { PatientTable } from 'fhir-starter';

import logger from '../Logger';
import theme from '../Theme'
import { createBrowserHistory, createMemoryHistory } from "history";

// Global App-Wide Session Variables

if(Meteor.isClient){
  Session.setDefault('lastUpdated', new Date());

  Session.setDefault('appHeight', window.innerHeight);
  Session.setDefault('appWidth', window.innerWidth);  
  
  Session.setDefault('displayNavbars', get(Meteor, 'settings.public.defaults.displayNavbars'));
}



// Startup
Meteor.startup(function(){
  
  if(Meteor.isClient){
    Session.set('appHeight', window.innerHeight);
    Session.set('appWidth', window.innerWidth);  
  }
  
  // var LocalDb = minimongo.MemoryDb;
 
  // // Create local db (in memory database with no backing)
  // let cache = new LocalDb();
   
  // // Add a collection to the database
  // cache.addCollection("Encounters");

  //   // attaching to the global scope is not recommending
  // // logging is one debatable exception to the general rule, however
  // window.minimongo = global.minimongo = cache;
})



// Application routing history

let appHistory;

if(Meteor.isClient){
  appHistory = createBrowserHistory();
}
if(Meteor.isServer){
  appHistory = createMemoryHistory();
}


// we need this so that pages and routes know their location and history
const AppWithRouter = withRouter(App);

function AppContainer(props){
  logger.debug('Rendering the AppContainer');
  logger.verbose('client.app.layout.AppContainer');
  logger.data('AppContainer.props', {data: props}, {source: "AppContainer.jsx"});

  // useEffect(() => {
  //   const jssStyles = document.querySelector('#jss-server-side');
  //   if (jssStyles) {
  //     jssStyles.parentElement.removeChild(jssStyles);
  //   }
  // }, []);

  let renderedApp = <Router history={appHistory}>
    <ThemeProvider theme={theme} >
      <AppWithRouter />
    </ThemeProvider>
  </Router>

  return renderedApp;  
}

AppContainer.propTypes = {
  id: PropTypes.string
}

export default AppContainer;