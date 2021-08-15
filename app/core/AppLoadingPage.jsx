import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useHistory } from "react-router-dom";

import { CssBaseline } from '@material-ui/core';

import { Helmet } from "react-helmet";
import { has, get } from 'lodash';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import Footer from '../layout/Footer.jsx';
import Header from '../layout/Header.jsx';
import theme from '../Theme.js';
import logger from '../Logger.js';

import { Icon } from 'react-icons-kit'
import { spinner8 } from 'react-icons-kit/icomoon/spinner8'

import { oauth2 as SMART } from "fhirclient";

const drawerWidth =  get(Meteor, 'settings.public.defaults.drawerWidth', 280);


function AppLoadingPage(props) {
  if(logger){
    logger.debug('Rendering the AppLoadingPage.');
    logger.verbose('client.app.layout.AppLoadingPage');  
  }

  //--------------------------------------------------------------------------------
  // Props

  const { children, staticContext, loadingMessage, spinningIcon, ...otherProps } = props;

  //--------------------------------------------------------------------------------
  // Social Media Registration

  let helmet;
  let initialScale = (get(Meteor, 'settings.public.defaults.initialScale', 1.0)).toString();
  // let viewportString = "initial-scale=" + initialScale + ", minimal-ui, minimum-scale=" + initialScale +  ", maximum-scale=" + initialScale + ", width=device-width, height=device-height, user-scalable=no";
  let viewportString = "initial-scale=" + initialScale + ", minimal-ui, minimum-scale=" + initialScale +  ", maximum-scale=" + initialScale + ", width=device-width, height=device-height";

  if(get(Meteor, 'settings.public.socialmedia')){
    let socialmedia = get(Meteor, 'settings.public.socialmedia');

     let appIdMeta;

    if(has(socialmedia, 'app_id')){
      appIdMeta = <meta property="fb:app_id" content={get(socialmedia, 'app_id')} /> 
    }

    helmet = <Helmet>
      <meta charSet="utf-8" />
      <title>{socialmedia.title}</title>
      <link rel="canonical" href={socialmedia.url} />

      <meta property="og:title" content={get(socialmedia, 'title')} />
      <meta property="og:type" content={get(socialmedia, 'type')} />
      <meta property="og:url" content={get(socialmedia, 'url')} />
      <meta property="og:image" content={get(socialmedia, 'image')} />
      <meta property="og:description" content={get(socialmedia, 'description')} />
      <meta property="og:site_name" content={get(socialmedia, 'site_name')} />   
      
      { appIdMeta }

      <meta name="theme-color" content={get(Meteor, 'settings.public.theme.palette.appBarColor', "#669f64 !important")} />   
      { /* <meta name="viewport" content={ viewportString } /> */ }

    </Helmet>
  }

  

  //--------------------------------------------------------------------------------
  // Styling

  // const classes = useStyles();

  let styles = {
    spinningIcon: {
      marginTop: '32px',
      width: '80px',
      height: '80px',
      marginLeft: '-55%'
    },
    loadingMessage: {
      position: 'absolute',
      left: '50%',
      top: '40%',
      marginLeft: '-40px'
    }
  }

  //--------------------------------------------------------------------------------
  // Render Component

  return (
    <div { ...otherProps } >
      { helmet }
      <div id='primaryFlexPanel' >
        {/* <CssBaseline /> */}
        <Header { ...otherProps } />
          <main id="appLoadingPage" style={{width: '100%', height: '100%', textAlign: 'center'}}>
            <div style={ styles.loadingMessage }>
              <h1 className="helveticas" style={{fontWeight: 200, marginLeft: '-50%'}}>This app is loading.</h1>
              <Icon icon={spinner8} className="spinningIcon" style={styles.spinningIcon} size={80} />
            </div>
          </main>
        <Footer { ...otherProps } />
      </div>
    </div>
  );
}

export default AppLoadingPage
