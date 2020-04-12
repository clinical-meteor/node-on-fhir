import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useHistory } from "react-router-dom";

import { CssBaseline } from '@material-ui/core';

import { Helmet } from "react-helmet";
import { get } from 'lodash';
import { PageCanvas, StyledCard } from 'material-fhir-ui';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import Footer from '../layout/Footer.jsx';
import Header from '../layout/Header.jsx';
import theme from '../theme.js';

import { 
  CardHeader,
  CardContent,
  Grid
} from '@material-ui/core';

import { oauth2 as SMART } from "fhirclient";


// not currently used; but needed to work so we can get the default theme
const styles = theme => ({});

function LaunchPage(props) {
  if(props.logger){
    props.logger.info('Rendering the LaunchPage.');
    props.logger.verbose('client.app.layout.LaunchPage');  
  }

  //--------------------------------------------------------------------------------
  // Props

  const { children, staticContext, loadingMessage, spinningIcon, ...otherProps } = props;

  //--------------------------------------------------------------------------------
  // Query Parameters

  let searchParams = new URLSearchParams(useLocation().search);


  //--------------------------------------------------------------------------------
  // Styling

  // const classes = useStyles();

  //--------------------------------------------------------------------------------
  // Component Life Cycle Functions

  useEffect(function(){

    let smartConfig = {
      clientId: get(Meteor, 'settings.public.smartOnFhir[0].client_id'),
      scope: get(Meteor, 'settings.public.smartOnFhir[0].scope'),
      redirectUri: get(Meteor, 'settings.public.smartOnFhir[0].redirect_uri')  // ./fhir-quer
    }

    if(searchParams.get('iss')){
      // we prefer using an ?iss parameter from the URL
      // this is how we typically launch from the big EHR systems
      smartConfig.iss = searchParams.get('iss')      
    } else if (get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl')){
      // if we're testing how the launcher works, we can set the iss in the settings file
      // this is marginally useful in blockchain and multi-tenant hosting environments
      smartConfig.iss = get(Meteor, 'settings.public.smartOnFhir[0].iss');
    } else {
      // otherwise, we resort to using a stand-alone app without launch context
      // this is mostly used for HAPI test servers, not Cerner and Epic
      smartConfig.fhirServiceUrl = get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl');
    }

    SMART.authorize(smartConfig);
  });

  //--------------------------------------------------------------------------------
  // Component Rendering


  let headerHeight = 64;
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    headerHeight = 128;
  }

  return (
    <PageCanvas id='constructionZone' headerHeight={headerHeight} >
      <Grid container justify="center">
        <Grid item md={6}>
          <StyledCard height="auto" scrollable margin={20} >
            <CardHeader title="Launch Page" />
            <CardContent>
              TODO:  Add some launch stuff.  Maybe the info dialog?    
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </PageCanvas>
  );
}

export default withStyles(styles, { withTheme: true })(LaunchPage);
