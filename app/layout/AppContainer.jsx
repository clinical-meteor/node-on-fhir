
import React from 'react';
import { BrowserRouter, withRouter } from "react-router-dom";

import { get } from 'lodash';

import { Meteor } from 'meteor/meteor';

import { ThemeProvider } from '@material-ui/styles';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import App from './App.jsx';
import AppLoadingPage from '../core/AppLoadingPage.jsx';

import { createLogger, addColors, format, transports } from 'winston';
import 'setimmediate';

// import theme from '../theme';

// import minimongo from 'minimongo';


Meteor.startup(function(){

  // var LocalDb = minimongo.MemoryDb;
 
  // // Create local db (in memory database with no backing)
  // let cache = new LocalDb();
   
  // // Add a collection to the database
  // cache.addCollection("Encounters");

  //   // attaching to the global scope is not recommending
  // // logging is one debatable exception to the general rule, however
  // window.minimongo = global.minimongo = cache;

  
  // some functions that do log level filtering
  const LEVEL = Symbol.for('level');
  function filterOnly(level) {
    return format(function (info) {
      if (info[LEVEL] === level) {
        return info;
      }
    })();
  }

  function hideDataLogLevel() {
    return format(function (info) {
      if (info[LEVEL] !== 'data') {
        return info;
      }
    })();
  }

  function onlyDisplayDataLogLevel() {
    return format(function (info) {
      if (info[LEVEL] === 'data') {
        return info;
      }
    })();
  }

   // lets create a global logger
   const logger = createLogger({
    level: get(Meteor, 'settings.public.loggingThreshold') ,
    levels: {
      error: 0, 
      warn: 1, 
      info: 2, 
      verbose: 3, 
      debug: 4, 
      trace: 5, 
      data: 6 
    },
    // defaultMeta: {tags: ['client_app']},
    // defaultMeta: { app: get(Meteor, 'settings.public.title') },
    transports: [
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      
      // new winston.transports.File({ filename: 'error.log', level: 'error' }),
      // new winston.transports.File({ filename: 'combined.log' }),

      new transports.Console({
        colorize: true,
        format: format.combine(
          hideDataLogLevel(),
          format.colorize(),
          format.simple(),
          format.splat(),
          format.timestamp()
        )
      }),

      new transports.Console({
        colorize: true,
        format: format.combine(
          onlyDisplayDataLogLevel(),
          format.simple(),
          format.splat(),
          format.prettyPrint()
        )
      })
    ],
    exitOnError: false
  });

  addColors({
    error: "red", 
    warn: "yellow", 
    info: "white bold", 
    verbose: "green", 
    debug: "cyan", 
    trace: 'cyan',
    data: "grey" 
  });
    
  // what is the logging threshold set in the Meteor.settings file?
  logger.verbose('Setting the logging threshold to: ' + get(Meteor, 'settings.public.loggingThreshold'))


  // introspection for the win
  console.info('Winston Logging Service');

  // attaching to the global scope is not recommending
  // logging is one debatable exception to the general rule, however
  if(typeof window === "object"){
    window.logger = global.logger = logger;
  }

  // ironically telling the logger where to write the error message when it fails
  logger.on('error', function (err) { 
    console.error('Winston just blew up.', error)
  });


  // Global Theming 
  // This is necessary for the Material UI component render layer
  let theme = {
    primaryColor: "rgb(108, 183, 110)",
    primaryText: "rgba(255, 255, 255, 1) !important",

    secondaryColor: "rgb(108, 183, 110)",
    secondaryText: "rgba(255, 255, 255, 1) !important",

    cardColor: "rgba(255, 255, 255, 1) !important",
    cardTextColor: "rgba(0, 0, 0, 1) !important",

    errorColor: "rgb(128,20,60) !important",
    errorText: "#ffffff !important",

    appBarColor: "#f5f5f5 !important",
    appBarTextColor: "rgba(0, 0, 0, 1) !important",

    paperColor: "#f5f5f5 !important",
    paperTextColor: "rgba(0, 0, 0, 1) !important",

    backgroundCanvas: "rgba(255, 255, 255, 1) !important",
    background: "linear-gradient(45deg, rgb(108, 183, 110) 30%, rgb(150, 202, 144) 90%)",

    nivoTheme: "greens"
  }

  // if we have a globally defined theme from a settings file
  if(get(Meteor, 'settings.public.theme.palette')){
    theme = Object.assign(theme, get(Meteor, 'settings.public.theme.palette'));
  }

  const muiTheme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        main: theme.primaryColor,
        contrastText: theme.primaryText
      },
      secondary: {
        main: theme.secondaryColor,
        contrastText: theme.errorText
      },
      appBar: {
        main: theme.appBarColor,
        contrastText: theme.appBarTextColor
      },
      cards: {
        main: theme.cardColor,
        contrastText: theme.cardTextColor
      },
      paper: {
        main: theme.paperColor,
        contrastText: theme.paperTextColor
      },
      error: {
        main: theme.errorColor,
        contrastText: theme.secondaryText
      },
      background: {
        default: theme.backgroundCanvas
      },
      contrastThreshold: 3,
      tonalOffset: 0.2
    }
  });


  // Application routing history
  import { createBrowserHistory } from "history";
  let appHistory;
  
  if(Meteor.isClient){
    appHistory = createBrowserHistory();
  }

  // we need this so that pages and routes know their location and history
  const AppWithRouter = withRouter(App);

  function AppContainer(props){
    logger.info('AppContainer environment is initializing.');
    logger.verbose('Rendering AppContainer');
    logger.debug('client.app.layout.AppContainer');
    logger.data('AppContainer.props', {data: props}, {source: "AppContainer.jsx"});

    let renderedApp;
    if(Meteor.isClient){
      renderedApp = <BrowserRouter history={appHistory}>
        <ThemeProvider theme={theme} >
          <MuiThemeProvider theme={muiTheme}>
            <AppWithRouter logger={logger} />
          </MuiThemeProvider>
        </ThemeProvider>
      </BrowserRouter>
    }
    if(Meteor.isServer){
      renderedApp = <MuiThemeProvider theme={muiTheme}>
        {/* <App logger={logger} /> */}
        <AppLoadingPage logger={logger} />
      </MuiThemeProvider>
    }

    return renderedApp;  
  }

  export default AppContainer;
})



