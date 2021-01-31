import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';

import { Button, BottomNavigation} from '@material-ui/core';
// import Toolbar from '@material-ui/core/Toolbar';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { get, has, cloneDeep } from 'lodash';

import { makeStyles } from '@material-ui/styles';
import theme from '../Theme';
import logger from '../Logger';

const drawerWidth = get(Meteor, 'settings.public.defaults.drawerWidth', 280);


// ==============================================================================
// Theming

const useStyles = makeStyles(theme => ({
  footerContainer: {  
    height: '64px',
    position: 'fixed',
    bottom: "0px",
    left: "0px",
    background: theme.palette.appBar.main,
    backgroundColor: theme.palette.appBar.main,
    color: theme.palette.appBar.contrastText,
    width: '100%',
    zIndex: 1300,
    borderTop: '1px solid lightgray',
    transition: theme.transitions.create(['width', 'left', 'bottom'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    filter: "grayscale(" + get(Meteor, 'settings.public.theme.grayscaleFilter', "0%") + ")"
  },
  footer: {
    flexGrow: 1,
    backgroundColor: theme.palette.appBar.main,
    color: theme.palette.appBar.contrastText
  },
  footerNavigation: {
    backgroundColor: "inherit", 
    justifyContent: 'left'
  }
}));


// ==============================================================================
// Main Component

function Footer(props) {
  let styles = useStyles();

  // if(typeof logger === "undefined"){
  //   logger = props.logger;
  // } 

  if(logger){
    logger.debug('Rendering the application Footer.');
    logger.verbose('package.care-cards.client.layout.Footer');  
    logger.data('Footer.props', {data: props}, {source: "FooterContainer.jsx"});
  }


  // const pathname = useTracker(function(){
  //   logger.info('Pathname was recently updated.  Updating the Footer action buttons.');
  //   return Session.get('pathname');
  //   // return window.location.pathname;
  // }, [props.lastUpdated]);


  function renderWestNavbar(pathname){
    logger.trace('Checking packages for action buttons that match the following pathname: ' + pathname);
    logger.verbose('package.care-cards.client.layout.Footer.renderWestNavbar');

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

    logger.debug('Generated array of buttons to display.')
    logger.trace('buttonRenderArray', buttonRenderArray)

    let renderDom;
    buttonRenderArray.forEach(function(buttonConfig){
      // right route
      if (pathname === buttonConfig.pathname){
        logger.debug('Found a route match for Footer buttons', pathname)
        // right security/function enabled
        if(buttonConfig.settings && (get(Meteor, buttonConfig.settings) === false)){
          // there was a settings criteria; and it was set to faulse            
          return false;
        } else {
          if(buttonConfig.component){
            logger.debug('Trying to render a button from package to the footer')
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
  westNavbar = renderWestNavbar(get(props, 'location.pathname'));
  // }


  if(Meteor.isClient && props.drawerIsOpen){
    styles.footerContainer.width = (window.innerWidth - drawerWidth) + "px";
    styles.footerContainer.left = drawerWidth + "px";
  }

  let displayNavbars = true;  

  if(Meteor.isClient){
    displayNavbars = useTracker(function(){  
      return Session.get("displayNavbars");  
    }, []);    
  }

  if(!displayNavbars){
    styles.footerContainer.bottom = '-64px'
  }
  if(get(Meteor, 'settings.public.defaults.disableFooter')){
    styles.footerContainer.display = 'none'
  }

  return (
    <footer id="footerNavContainer" className={styles.footerContainer}>
      <div id="footerNavigation" name="footerNavigation" position="static" style={{backgroundColor: "inherit", justifyContent: 'left'}} >
        { westNavbar }
      </div>
    </footer>
  );
}


Footer.propTypes = {

  drawerIsOpen: PropTypes.bool
}
Footer.defaultProps = {
  drawerIsOpen: false
}

export default Footer;