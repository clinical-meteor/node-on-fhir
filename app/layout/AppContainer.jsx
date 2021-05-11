
import React from 'react';
import { withRouter, Router } from "react-router-dom";

import { get } from 'lodash';

import { Meteor } from 'meteor/meteor';

import { ThemeProvider } from '@material-ui/styles';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App.jsx';
import AppLoadingPage from '../core/AppLoadingPage.jsx';


import { theme, defaultAppPalette} from '../Theme';
import logger from '../Logger';
import useStyles from '../Styles';

import CssBaseline from '@material-ui/core/CssBaseline';

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

  // Application routing history
  import { createBrowserHistory } from "history";
  let appHistory;
  
  if(Meteor.isClient){
    window.appHistory = createBrowserHistory();
  }

  // we need this so that pages and routes know their location and history
  const AppWithRouter = withRouter(App);

  function AppContainer(props){
    // logger.debug('Rendering the AppContainer');
    // logger.verbose('client.app.layout.AppContainer');
    // logger.data('AppContainer.props', {data: props}, {source: "AppContainer.jsx"});

    let renderedApp;
    if(Meteor.isClient){
      // renderedApp = <BrowserRouter history={appHistory}>
      renderedApp = <Router history={window.appHistory}>
        <ThemeProvider theme={defaultAppPalette} >
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <AppWithRouter />
          </MuiThemeProvider>
        </ThemeProvider>
      </Router>
      {/* </BrowserRouter> */}
    }
    if(Meteor.isServer){
      renderedApp = <ThemeProvider theme={defaultAppPalette} >
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <AppLoadingPage />
        </MuiThemeProvider>
      </ThemeProvider>      
    }

    return renderedApp;  
  }

  export default AppContainer;
})



