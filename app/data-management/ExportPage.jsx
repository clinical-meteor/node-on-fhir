// https://www.npmjs.com/package/react-dropzone-component
// http://www.dropzonejs.com/

import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';

import { get } from 'lodash';

import { StyledCard, PageCanvas } from 'fhir-starter';
import { ExportComponent } from './ExportComponent';


//============================================================================
//Global Theming 

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


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


//============================================================================
// Main Component  

export function ExportPage(props){

  // let data = {
  //   dialog: {
  //     open: false
  //   },      
  //   user: {
  //     isAdmin: false
  //   },
  //   title: "Client Collections",
  //   upstreamSync: false,
  //   encryptExport: this.state.encryptExport,
  //   import: {
  //     fileExtension: Session.get('fileExtension'),
  //     height: '0px',
  //     data: ''
  //   },
  //   dataManagement: {
  //     height: (Session.get('appHeight') - 300 ) + 'px'
  //   },
  //   export: {
  //     height: (Session.get('appHeight') - 380 ) + 'px',
  //     data: ''
  //   },
  //   syncSourceItem: Session.get('syncSourceItem'),
  //   toggleStates: Session.get('toggleStates')
  // };

  // data.dialog = useTracker(function(){
  //   return Session.get('open')
  // }, [])
  // data.import.fileExtension = useTracker(function(){
  //   return Session.get('fileExtension')
  // }, [])
  // data.import.height = useTracker(function(){
  //   return (Session.get('appHeight') - 556 ) + 'px';
  // }, [])
  // data.dataManagement.height = useTracker(function(){
  //   return (Session.get('appHeight') - 300 ) + 'px'
  // }, [])
  // data.export.height = useTracker(function(){
  //   return (Session.get('appHeight') - 380 ) + 'px'
  // }, [])
  // data.export.data = useTracker(function(){
  //   return JSON.stringify(Session.get('continuityOfCareDoc'), null, 2);
  // }, [])
  // data.syncSourceItem = useTracker(function(){
  //   return Session.get('syncSourceItem')
  // }, [])
  // data.toggleStates = useTracker(function(){
  //   return Session.get('toggleStates')
  // }, [])


  // logger.debug('Navigated to ExportPage', data);

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();


  return(
    <PageCanvas id="ExportPage" headerHeight={headerHeight} paddingLeft={20} paddingRight={20} >
      <MuiThemeProvider theme={muiTheme} >
        <ExportComponent />
      </MuiThemeProvider>
    </PageCanvas>
  );
}



export default ExportPage;