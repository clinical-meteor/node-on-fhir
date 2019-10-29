
import React from 'react';
import { BrowserRouter } from "react-router-dom";

import { get, has } from 'lodash';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { ThemeProvider, makeStyles } from '@material-ui/styles';
import {blue400, blue600, green600, green800 } from 'material-ui/styles/colors';

import { withRouter } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import App from './App.jsx';

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
  },
});


// Application routing history
import { createBrowserHistory } from "history";
const appHistory = createBrowserHistory();


// we need this so that pages and routes know their location and history
const AppWithRouter = withRouter(App);



function AppContainer(props){
  console.log('AppContainer.props', AppContainer.props)
  
  return(
    <BrowserRouter history={appHistory}>
      <ThemeProvider theme={theme} >
        <MuiThemeProvider theme={muiTheme}>
          <AppWithRouter />
        </MuiThemeProvider>
      </ThemeProvider>
    </BrowserRouter>
  );  
}

export default AppContainer;
