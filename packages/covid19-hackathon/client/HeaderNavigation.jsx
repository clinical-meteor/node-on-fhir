import React, { Component, useState, useEffect } from 'react';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import {
  fade,
  ThemeProvider,
  MuiThemeProvider,
  withStyles,
  makeStyles,
  createMuiTheme,
  useTheme
} from '@material-ui/core/styles';
import { 
  AppBar, 
  Button, 
  Toolbar, 
  Typography, 
  Input,
  InputLabel,
  TextField,
  InputAdornment,
  FormControl
} from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// import { IoIosSearch } from 'react-icons/io';
import { green } from '@material-ui/core/colors';

import { get } from 'lodash';



const useStyles = makeStyles(theme => ({
  input: {
    backgroundColor: theme.palette.appBar.main,
    color: theme.palette.appBar.contrastText
  }, 
  searchForm: {
    margin: theme.spacing(1),
    float: 'right',
    marginRight: '10px',
    position: 'absolute',
    bottom: '0px',
    right: '10px'
  }
}));


const useTabStyles = makeStyles(theme => ({
  menu_items: {
    position: 'absolute',
    bottom: '10px',
    left: '0px', 
    display: 'flex', 
    float: 'left', 
    top: '64px', 
    marginTop: '5px', 
    marginLeft: '20px',
    cursor: 'pointer'
  },
  menu_items_right: {
    position: 'absolute',
    bottom: '10px',
    right: '0px', 
    display: 'flex', 
    float: 'right', 
    top: '64px', 
    marginTop: '5px', 
    marginRight: '20px',
    zIndex: 1
  },
  button: {
    margin: theme.spacing(1)
  },
  textField: {
    position: 'absolute',
    right: '20px', 
    width: '200px'
  }
}));



//========================================================================================================

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



export function HeaderNavigation(props){
  console.log('HeaderNavigation.props', props)
  let value = 0;

  const classes = useStyles();
  const tabClasses = useTabStyles();
  const [tabIndex, setTabIndex] = useState(0);

  function selectSlide(event, newIndex){
    logger.info('HeaderNavigation.selectSlide', newIndex);
    setTabIndex(newIndex);    

    switch (newIndex) {
      case 0:
        props.history.replace('/query-fhir-provider')
        break;
      case 1:
        props.history.replace('/encounters-at-discharge')
        break;
      case 2:
        props.history.replace('/cardiac-dashboard')
        break;
      case 3:
        props.history.replace('/measure-reports-expansion-page')
        break;
      case 4:
        props.history.replace('/sunburst-graph')
        break;
    }   

    // if(window.Carousel){
    //   window.Carousel.goToSlide(newIndex + 2);
    //   Session.set('currentCarouselSlide', newIndex + 2)
    // }
  }

  // function onSearchChange(event, value){
  //   //console.log('HeaderNavigation.onSearchChange', event, value)
  //   logger.info('HeaderNavigation.onSearchChange', event, value)
  // }
  
  // function openPage(url){
  //   props.history.replace(url)
  // }
  
  return (        
    <div style={{display: 'contents'}}>
      <div >
        <Tabs id="headerNavigationTabs" value={tabIndex} onChange={selectSlide} aria-label="simple tabs example" className={ tabClasses.menu_items }>        
          <Tab id="fetchTab" label="Fetch" />
          <Tab id="mapTab" label="Map" />
          {/* <Tab id="dashboardTab" label="Dashboard" />
          <Tab id="scorecardTab" label="Scorecard" />
          <Tab id="patientInfoTab" label="Patient Information" /> */}
        </Tabs>
        <div id="headerUrl" aria-label="sitename" className={ tabClasses.menu_items_right }>        
          <h3 id="fetchTab">{Session.get('fhirServerEndpoint')}</h3>          
        </div>

        <MuiThemeProvider theme={muiTheme} >
          <div></div>
          {/* <FormControl id="globalSearch" className={classes.searchForm}>
            <InputLabel htmlFor="input-with-icon-adornment">With a start adornment</InputLabel>
            <Input
              id="globalSearch-input"
              label="Search"
              placeholder="febdb1a2-aa9a-4c5c-a87d-fea7c464b4a5"     
              onChange={ onSearchChange.bind(this) }   
              //InputProps={{ classes, disableUnderline: true }}    
              startAdornment={
                <InputAdornment position="start">
                  <IoIosSearch style={{color: "white"}} />
                </InputAdornment>
              }
              inputProps={{style: {
                width: '360px', color: 'white'
              }}}
            />
          </FormControl> */}
          {/* <TextField
            id="searchInput"
            className={tabClasses.textField}
            label={"Search"}
            placeholder="febdb1a2-aa9a-4c5c-a87d-fea7c464b4a5"
            margin="normal"
            InputProps={{ classes, disableUnderline: true }}
            // StartAdornment={
            //   <InputAdornment position="start">
            //     <IoIosSearch style={{color: "white"}} />
            //   </InputAdornment>
            // }
          /> */}
        </MuiThemeProvider>
      </div>
    </div>
  );
}

export default HeaderNavigation;



