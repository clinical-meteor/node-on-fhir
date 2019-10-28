import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { useTracker, withTracker } from './Tracker';

import { Button, Toolbar, AppBar, Typography} from '@material-ui/core';

import { ThemeProvider, makeStyles, useTheme } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
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
    flexGrow: 1
  },
  button: {
    margin: '10px'
  },
  input: {
    display: 'none'
  }
}));


function Footer(props) {
  const classes = useStyles();

  const pathname = useTracker(function(){
    console.log('Footer is using tracker to check security dialog.')
    // return Session.get('pathname');
    return window.location.pathname;
  }, [props]);


  function renderWestNavbar(pathname){

    console.log('pathname', pathname)
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

    console.log('buttonRenderArray', buttonRenderArray)

    let renderDom;
    buttonRenderArray.forEach(function(buttonConfig){
      // right route
      if (pathname === buttonConfig.pathname){
        // right security/function enabled
        if(buttonConfig.settings && (get(Meteor, buttonConfig.settings) === false)){
          // there was a settings criteria; and it was set to faulse            
          return false;
        } else {
          if(buttonConfig.component){
            renderDom = buttonConfig.component;
          } else {
            renderDom = <div style={{marginTop: '-8px'}}>
              <Button color="primary" className={classes.button} onClick={ buttonConfig.onClick } >
                {buttonConfig.label}
              </Button>
            </div>
          }
        }         
      }
    })

    return renderDom;
  }

  let westNavbar;
  // if(this.data.userId){
    westNavbar = renderWestNavbar(pathname);
  // }

  return (
    <div id='footerContainer' className={classes.footerContainer}>
      <AppBar id="footer" position="static" color="default">
        <Toolbar>
          {/* <Typography variant="h6" color="inherit">
            Action
          </Typography> */}
          { westNavbar }
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Footer;