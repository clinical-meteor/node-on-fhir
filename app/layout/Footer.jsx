import React, { useState } from 'react';
import PropTypes from 'prop-types';


import { Button, BottomNavigation} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { Meteor } from 'meteor/meteor';
import { get } from 'lodash';

import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';
import { useTracker } from './Tracker';


const drawerWidth = get(Meteor, 'settings.public.defaults.drawerWidth', 280);

// not being used?
const styles = theme => ({});

function Footer(props) {
  if(props.logger){
    // props.logger.debug('Rendering the application Footer.');
    props.logger.verbose('package.care-cards.client.layout.Footer');  
    props.logger.data('Footer.props', {data: props}, {source: "FooterContainer.jsx"});
  }
  
  // const pathname = useTracker(function(){
  //   props.logger.info('Pathname was recently updated.  Updating the Footer action buttons.');
  //   return Session.get('pathname');
  //   // return window.location.pathname;
  // }, [props.lastUpdated]);


  function renderWestNavbar(pathname){
    props.logger.trace('Checking packages for action buttons that match the following pathname: ' + pathname);
    props.logger.verbose('package.care-cards.client.layout.Footer.renderWestNavbar');

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

    props.logger.debug('Generated array of buttons to display.')
    props.logger.trace('buttonRenderArray', buttonRenderArray)

    let renderDom;
    buttonRenderArray.forEach(function(buttonConfig){
      // right route
      if (pathname === buttonConfig.pathname){
        props.logger.debug('Found a route match for Footer buttons', pathname)
        // right security/function enabled
        if(buttonConfig.settings && (get(Meteor, buttonConfig.settings) === false)){
          // there was a settings criteria; and it was set to faulse            
          return false;
        } else {
          if(buttonConfig.component){
            props.logger.debug('Trying to render a button from package to the footer')
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

  let componentStyles = {
    footerContainer: {  
      borderTop: '1px solid lightgray',
      height: '64px',
      position: 'fixed',
      bottom: 0,
      left: 0,
      background: props.theme.palette.appBar.main,
      backgroundColor: props.theme.palette.appBar.main,
      color: props.theme.palette.appBar.contrastText,
      width: '100%',
      zIndex: 10000,
      transition: props.theme.transitions.create(['width', 'left'], {
        easing: props.theme.transitions.easing.sharp,
        duration: props.theme.transitions.duration.leavingScreen
      }),
      filter: "grayscale(" + get(Meteor, 'settings.public.theme.grayscaleFilter', "0%") + ")"
    }
  }

  if(Meteor.isClient && props.drawerIsOpen){
    componentStyles.footerContainer.width = (window.innerWidth - drawerWidth) + "px";
    componentStyles.footerContainer.left = drawerWidth + "px";
  }

  return (
    <footer id="footerNavContainer" style={componentStyles.footerContainer}>
      <BottomNavigation id="footerNavigation" name="footerNavigation" position="static" style={{backgroundColor: "inherit", justifyContent: 'left'}} >
        { westNavbar }
      </BottomNavigation>
    </footer>
  );
}

Footer.propTypes = {
  logger: PropTypes.object,
  drawerIsOpen: PropTypes.bool
}
Footer.defaultProps = {
  logger: {
    debug: function(){},
    info: function(){},
    warn: function(){},
    trace: function(){},
    data: function(){},
    verbose: function(){},
    error: function(){}
  }
}

export default withStyles(styles, { withTheme: true })(Footer);