import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";


import { makeStyles, withStyles } from '@material-ui/core/styles';

import { 
  CardHeader,
  CardContent,
  Grid
} from '@material-ui/core';
import { PageCanvas, StyledCard } from 'fhir-starter';
import { get, has } from 'lodash';

import { oauth2 as SMART } from "fhirclient";

import logger from '../Logger';

// ==============================================================================
// Styling

// not currently used; but needed to work so we can get the default theme
const styles = theme => ({});


// ==============================================================================
// Main Component

function EhrLaunchPage(props) {
  if(logger){
    logger.info('Rendering the EhrLaunchPage.');
    logger.verbose('client.app.layout.EhrLaunchPage');  
  }

  //--------------------------------------------------------------------------------
  // Props

  const { children, staticContext, loadingMessage, spinningIcon, ...otherProps } = props;

  //--------------------------------------------------------------------------------
  // Query Parameters

  let useLocationSearch = useLocation().search
  let searchParams = new URLSearchParams(useLocationSearch);


  //--------------------------------------------------------------------------------
  // Component Life Cycle Functions

  useEffect(function(){

    let iss = searchParams.get('iss');
    if(iss){
      let issArray = iss.split("/");
      
      let ehrFhirVersion = issArray[issArray.length - 1];

      let appIsProduction = true;
      let appIsRunningOnLocalhost = false;
      if(Meteor.absoluteUrl() === "http://localhost:3000/"){
        appIsProduction = false;
        appIsRunningOnLocalhost = true;
      }

      let smartOnFhirConfig;
      if(Array.isArray(get(Meteor, 'settings.public.smartOnFhir'))){
        Meteor.settings.public.smartOnFhir.forEach(function(config){
            if(useLocationSearch.includes(config.vendorKeyword) && (config.launchContext === "Provider") && (config.fhirVersion === ehrFhirVersion) && (config.production === appIsProduction) && (config.environment === (appIsRunningOnLocalhost ? "localhost" : "meteor"))){
                smartOnFhirConfig = config;
            }
        })
      }

      let smartConfig = {
        clientId: get(smartOnFhirConfig, 'client_id'),
        scope: get(smartOnFhirConfig, 'scope'),
        redirectUri: get(smartOnFhirConfig, 'redirect_uri') 
      }
      // if(has(smartOnFhirConfig, 'client_secret')){
      //   smartConfig.clientSecret = get(smartOnFhirConfig, 'client_secret')
      // }

      if(searchParams.get('iss')){
        // we prefer using an ?iss parameter from the URL
        // this is how we typically launch from the big EHR systems
        smartConfig.iss = searchParams.get('iss')      
        //Session.set('smartOnFhir_iss', searchParams.get('iss'))
      } else if (get(smartOnFhirConfig, 'iss')){
        // if we're testing how the launcher works, we can set the iss in the settings file
        // this is marginally useful in blockchain and multi-tenant hosting environments
        smartConfig.iss = get(smartOnFhirConfig, 'iss');
        //Session.set('smartOnFhir_iss', get(smartOnFhirConfig, 'iss'))
      } else {
        // otherwise, we resort to using a stand-alone app without launch context
        // this is mostly used for HAPI test servers, not Cerner and Epic
        smartConfig.fhirServiceUrl = get(smartOnFhirConfig, 'fhirServiceUrl');
        //Session.set('smartOnFhir_iss', get(smartOnFhirConfig, 'settings.public.smartOnFhir[0].fhirServiceUrl'))
      }

      if(process.env.NODE_ENV === "debug"){
        alert(JSON.stringify(smartConfig))
      }

      SMART.authorize(smartConfig);
    } else {
      console.log('Hmmm.... no iss parameter in Url...');

      let smartOnFhirConfig;
      if(Array.isArray(get(Meteor, 'settings.public.smartOnFhir'))){
        Meteor.settings.public.smartOnFhir.forEach(function(config){
            if(config.isDefault){
                smartOnFhirConfig = config;
            }
        })
      }
      console.log('EhrLaunchPage.smartOnFhirConfig', smartOnFhirConfig);

      let smartConfig = {
        clientId: get(smartOnFhirConfig, 'client_id'),
        //clientSecret: get(smartOnFhirConfig, 'client_secret'),
        scope: get(smartOnFhirConfig, 'scope'),
        redirectUri: get(smartOnFhirConfig, 'redirect_uri'),
        fhirServiceUrl: get(smartOnFhirConfig, 'fhirServiceUrl')
      }
      console.log('EhrLaunchPage.smartConfig', smartConfig);

      if(get(Meteor, 'settings.public.loggingThreshold') === "trace"){
        alert(JSON.stringify(smartConfig))
      }

      SMART.authorize(smartConfig);
    }
    
  });

  //--------------------------------------------------------------------------------
  // Component Rendering


  let headerHeight = 64;
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    headerHeight = 128;
  }

  let contentToRender;

  return (
    <PageCanvas id='constructionZone' headerHeight={headerHeight} >
      <Grid container justify="center">
        <Grid item md={6}>
          <StyledCard scrollable margin={20} >
            <CardHeader title="Launch Page" />
            <CardContent style={{textAlign: 'center'}}>
              <h2>Welcome to {get(Meteor, 'settings.public.title')}</h2>

              <p>Please wait as we launch your app.</p>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </PageCanvas>
  );
}

export default withStyles(styles, { withTheme: true })(EhrLaunchPage);
