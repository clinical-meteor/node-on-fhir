
import React from 'react';
import { BrowserRouter } from "react-router-dom";

import { get, has } from 'lodash';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ThemeProvider, makeStyles } from '@material-ui/styles';
import {blue400, blue600, green600, green800 } from 'material-ui/styles/colors';

import { withRouter } from "react-router-dom";

import App from './App.jsx';

// Global Theming 
// This is necessary for the Material UI component render layer
let theme = {
  primary1Color: "rgb(108, 183, 110)",
  primary2Color: "rgb(150, 202, 144)",
  buttonText: "rgba(255, 255, 255, 1) !important",
  cardColor: "rgba(255, 255, 255, 1) !important",
  appBarColor: "lightgrey !important",
  appBarTextColor: "black !important",
  backgroundCanvas: "lightgrey !important",
  background: "linear-gradient(45deg, rgb(108, 183, 110) 30%, rgb(150, 202, 144) 90%)",
  nivoTheme: "greens"
}

// if we have a globally defined theme from a settings file
if(get(Meteor, 'settings.public.theme.palette')){
  theme = Object.assign(theme, get(Meteor, 'settings.public.theme.palette'));
}


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
        <AppWithRouter />
      </ThemeProvider>
    </BrowserRouter>
  );  
}

export default AppContainer;
