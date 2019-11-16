import React, { Component, useState, useEffect, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { useTracker, withTracker } from './Tracker';

import { Button, Toolbar, AppBar, Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import { ThemeProvider, makeStyles } from '@material-ui/styles';

const drawerWidth = 280;

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: theme.palette.appBar.main,
    color: theme.palette.appBar.contrastText
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: theme.palette.appBar.main,
    color: theme.palette.appBar.contrastText
  },
  appBarButton: {
    backgroundColor: theme.palette.appBar.main,
    color: theme.palette.appBar.contrastText,
    dropShadow: 'none',
    boxShadow: 'none'
  },
  button: {
    margin: '10px',
    backgroundColor: theme.palette.appBar.main,
    color: theme.palette.appBar.contrastText
  },
  canvas: {
    paddingTop: "80px",
    paddingBottom: "80px",
    paddingLeft: '20px',
    paddingRight: '20px',
    position: "absolute",
    width: "100%",
    top: 0,
    left: 0
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    backgroundColor: theme.palette.paper.main
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: theme.palette.paper.main
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    },
    backgroundColor: theme.palette.paper.main
  },
  drawerIcons: {
    fontSize: '120%',
    paddingLeft: '8px',
    paddingRight: '2px'
  },
  drawerText: {
    textDecoration: 'none !important'
  },
  footerContainer: {  
    height: '64px',
    position: 'fixed',
    bottom: 0,
    left: 0,
    backgroundColor: theme.appBarColor,
    color: theme.appBarTextColor,
    width: '100%',
    zIndex: 10000
  },
  footer: {
    flexGrow: 1,
    backgroundColor: theme.palette.appBar.main,
    color: theme.palette.appBar.contrastText
  },
  header: {
    display: 'flex'
  },
  hide: {
    display: 'none'
  },
  input: {
    display: 'none'
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


function Footer(props) {
  logger.info('Rendering the application Footer.');
  logger.verbose('package.care-cards.client.layout.Footer');
  
  const pathname = useTracker(function(){
    logger.info('Pathname was recently updated.  Updating the Footer action buttons.');
    return Session.get('pathname');
    // return window.location.pathname;
  }, [props]);


  function renderWestNavbar(pathname){
    logger.debug('package.care-cards.client.layout.Footer.renderWestNavbar');
    logger.verbose('Checking packages for action buttons that match the following pathname: ' + pathname);

    let self = this;

    const buttonRenderArray = []

    Object.keys(Package).forEach(function(packageName){
      if(Package[packageName].FooterButtons){
        // we try to build up a route from what's specified in the package
        Package[packageName].FooterButtons.forEach(function(route){
          buttonRenderArray.push(route);      
        });    
      }
    });

    logger.info('Generated array of buttons to display.')
    logger.trace('buttonRenderArray', buttonRenderArray)

    let renderDom;
    buttonRenderArray.forEach(function(buttonConfig){
      // right route
      if (pathname === buttonConfig.pathname){
        logger.info('Found a route match for Footer buttons', pathname)
        // right security/function enabled
        if(buttonConfig.settings && (get(Meteor, buttonConfig.settings) === false)){
          // there was a settings criteria; and it was set to faulse            
          return false;
        } else {
          if(buttonConfig.component){
            logger.info('Trying to render a button from package to the footer')
            renderDom = buttonConfig.component;
          } else {
            renderDom = <div style={{marginTop: '-8px'}}>
              <Button onClick={ buttonConfig.onClick } >
                {buttonConfig.label}
              </Button>
            </div>
          }
        }         
      }
    })

    // we want to pass in the props
    if(renderDom){
      renderDom = React.cloneElement(
        renderDom, props 
      );
    }

    return renderDom;
  }

  let westNavbar;
  // if(this.data.userId){
    westNavbar = renderWestNavbar(pathname);
  // }

  return (
    <div id='footerContainer' className={ props.classes.footerContainer}>
      <AppBar id="footer" position="static" className={classNames(props.classes.appBar, {
            [props.classes.appBarShift]: props.drawerIsOpen
          })} >
        <Toolbar>
          { westNavbar }
        </Toolbar>
      </AppBar>
    </div>
  );
}


export default withStyles(styles, { withTheme: true })(Footer);