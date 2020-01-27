import React, { useState } from 'react';
import { 
  CssBaseline,
} from '@material-ui/core';


import { Helmet } from "react-helmet";
import { get } from 'lodash';

import { MuiThemeProvider, createMuiTheme, withStyles, makeStyles, useTheme } from '@material-ui/core/styles';

// import { Promise } from 'meteor/promise';

// import clsx from 'clsx';

// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
// import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
// import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import Footer from '../layout/Footer.jsx';
import Header from '../layout/Header.jsx';
import theme from '../theme.js';

// const [Header, Footer, theme] = await Promise.all([
//   import('/app/layout/Header.jsx'),
//   import('/app/layout/Footer.jsx'),
//   import('/app/theme.js'),
// ])

import { FaSpinner } from 'react-icons/fa';

// import { ThemeProvider } from '@material-ui/styles';

const drawerWidth = 280;

// // Global Theming 
//   // This is necessary for the Material UI component render layer
//   let activeTheme = {
//     primaryColor: "rgb(108, 183, 110)",
//     primaryText: "rgba(255, 255, 255, 1) !important",

//     secondaryColor: "rgb(108, 183, 110)",
//     secondaryText: "rgba(255, 255, 255, 1) !important",

//     cardColor: "rgba(255, 255, 255, 1) !important",
//     cardTextColor: "rgba(0, 0, 0, 1) !important",

//     errorColor: "rgb(128,20,60) !important",
//     errorText: "#ffffff !important",

//     appBarColor: "#f5f5f5 !important",
//     appBarTextColor: "rgba(0, 0, 0, 1) !important",

//     paperColor: "#f5f5f5 !important",
//     paperTextColor: "rgba(0, 0, 0, 1) !important",

//     backgroundCanvas: "rgba(255, 255, 255, 1) !important",
//     background: "linear-gradient(45deg, rgb(108, 183, 110) 30%, rgb(150, 202, 144) 90%)",

//     nivoTheme: "greens"
//   }

//   // if we have a globally defined theme from a settings file
//   if(get(Meteor, 'settings.public.theme.palette')){
//     activeTheme = Object.assign(activeTheme, get(Meteor, 'settings.public.theme.palette'));
//   }

//   const muiTheme = createMuiTheme({
//     typography: {
//       useNextVariants: true,
//     },
//     palette: {
//       primary: {
//         main: activeTheme.primaryColor,
//         contrastText: activeTheme.primaryText
//       },
//       secondary: {
//         main: activeTheme.secondaryColor,
//         contrastText: activeTheme.errorText
//       },
//       appBar: {
//         main: activeTheme.appBarColor,
//         contrastText: activeTheme.appBarTextColor
//       },
//       cards: {
//         main: activeTheme.cardColor,
//         contrastText: activeTheme.cardTextColor
//       },
//       paper: {
//         main: activeTheme.paperColor,
//         contrastText: activeTheme.paperTextColor
//       },
//       error: {
//         main: activeTheme.errorColor,
//         contrastText: activeTheme.secondaryText
//       },
//       background: {
//         default: activeTheme.backgroundCanvas
//       },
//       contrastThreshold: 3,
//       tonalOffset: 0.2
//     }
//   });


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
      backgroundColor: theme.appBarColor,
      color: theme.appBarTextColor
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
      backgroundColor: theme.backgroundCanvas
    },
    spinningIcon: {
      marginTop: '32px',
      width: '64px',
      height: '64px',
      margin: '-60px 0 0 -60px'
    },
    loadingMessage: {
      position: 'absolute',
      left: '50%',
      top: '45%'
    }
  }));


function AppLoadingPage(props) {
  if(props.logger){
    props.logger.info('Rendering the AppLoadingPage.');
    props.logger.verbose('client.app.layout.AppLoadingPage');  
  }

  const classes = useStyles();

  const { children, staticContext, ...otherProps } = props;

  const [tabIndex, setTabIndex] = useState(0);

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

      <meta name="theme-color" content={get(Meteor, 'settings.public.theme.palette.appBarColor', "#669f64 !important")} />   
    </Helmet>
  }

  return (
    <div { ...otherProps } >
      { helmet }
      <div id='primaryFlexPanel' >
        <CssBaseline />
        <Header { ...otherProps } />
          <main id="appLoadingPage" style={{width: '100%', height: '100%', textAlign: 'center'}}>
            <div className={classes.loadingMessage }>
              <h1 className="helveticas" style={{fontWeight: 200}}>This app is loading.</h1>
              <FaSpinner className={ classes.spinningIcon + " spinningIcon"} />
            </div>
          </main>
        <Footer { ...otherProps } />
      </div>
    </div>
  );
}
export default AppLoadingPage;

