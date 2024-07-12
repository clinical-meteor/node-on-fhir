import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useHistory } from "react-router-dom";

import { CssBaseline } from '@material-ui/core';

import { Helmet } from "react-helmet";
import { has, get } from 'lodash';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import Footer from '../layout/Footer.jsx';
import Header from '../layout/Header.jsx';
import AppCanvas from '../layout/AppCanvas.jsx';
import theme from '../Theme.js';
import { logger } from '../Logger.js';

import { Icon } from 'react-icons-kit';
import { spinner8 } from 'react-icons-kit/icomoon/spinner8';

import { oauth2 as SMART } from "fhirclient";

const drawerWidth =  get(Meteor, 'settings.public.defaults.drawerWidth', 280);

import { Meteor } from 'meteor/meteor';

function AppLoadingPage(props) {
  // if(logger){
  //   logger.debug('Rendering the AppLoadingPage.');
  //   logger.verbose('client.app.layout.AppLoadingPage');  
  // }

  console.info('Rendering the AppLoadingPage.');
  console.debug('client.app.layout.AppLoadingPage');  

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


    let metaArray = [];
    if(get(socialmedia, 'url')){
      metaArray.push(<link key="canonical" rel="canonical" href={socialmedia.url} />)
    }
    if(get(socialmedia, 'title')){
      metaArray.push(<meta key="title" property="og:title" content={get(socialmedia, 'title')} />)
    }
    if(get(socialmedia, 'type')){
      metaArray.push(<meta key="type" property="og:type" content={get(socialmedia, 'type')} />)
    }
    if(get(socialmedia, 'url')){
      metaArray.push(<meta key="url" property="og:url" content={get(socialmedia, 'url')} />)
    }
    if(get(socialmedia, 'image')){
      metaArray.push(<meta key="image" property="og:image" content={get(socialmedia, 'image')} />)
    }
    if(get(socialmedia, 'description')){
      metaArray.push(<meta key="description" property="og:description" content={get(socialmedia, 'description')} />)
    }
    if(get(socialmedia, 'site_name')){
      metaArray.push(<meta key="sitename" property="og:site_name" content={get(socialmedia, 'site_name')} />)
    }
    if(has(socialmedia, 'app_id')){
      metaArray.push(<meta key="app_id" property="fb:app_id" content={get(socialmedia, 'app_id')} />) 
    }


    let title;
    if(get(socialmedia, 'title')){
      title = <title>{get(socialmedia, 'title')}</title>
    }

    helmet = <Helmet>
      <meta charSet="utf-8" />
    
      { title }
      { metaArray }

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


  let backgroundImage;
  if(get(Meteor, 'settings.public.theme.backgroundImagePath')){
    // backgroundImage = "url(" + get(Meteor, 'settings.public.theme.backgroundImagePath') + ")";
    backgroundImage = <AppCanvas></AppCanvas>;
  }

  // let styleObject = {overflow: 'hidden'}

  // if(backgroundImage){
  //   styleObject["background-image"] = backgroundImage;
  //   styleObject.width = '100%';
  //   styleObject.height = '100%';
  //   styleObject.backgroundSize = 'cover';
  // }

  //--------------------------------------------------------------------------------
  // Render Component


  return (
    <div id="appLoadingPage" { ...otherProps } >
      { helmet }
      { backgroundImage }
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
