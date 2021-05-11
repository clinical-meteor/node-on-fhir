import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { useTracker } from 'meteor/react-meteor-data';

import { Button, BottomNavigation} from '@material-ui/core';
// import Toolbar from '@material-ui/core/Toolbar';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { get, has, cloneDeep } from 'lodash';

import { makeStyles } from '@material-ui/styles';

import theme from '../Theme';
import logger from '../Logger';
import useStyles from '../Styles';


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



  let displayNavbars = true;  

  if(Meteor.isClient){
    displayNavbars = useTracker(function(){  
      return Session.get("displayNavbars");  
    }, []);    
  }

  let footerNavContainerClass = styles.footerNavContainer;

  if(!displayNavbars){
    footerNavContainerClass = styles.footerNavContainer_hidden;
  }
  if(get(Meteor, 'settings.public.defaults.disableFooter')){
    footerNavContainerClass = styles.footerNavContainer_hidden;
  }

  return (
    <footer id="footerNavContainer" className={footerNavContainerClass}>
      <BottomNavigation id="footerNavigation" name="footerNavigation" position="static" className={styles.footerNavigation} >
        { westNavbar }
      </BottomNavigation>
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