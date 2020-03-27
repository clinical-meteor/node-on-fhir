import React, { useState } from 'react';
import { 
  CssBaseline,
} from '@material-ui/core';


import { Helmet } from "react-helmet";
import { get } from 'lodash';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import Footer from '../layout/Footer.jsx';
import Header from '../layout/Header.jsx';
import theme from '../theme.js';

import { Icon } from 'react-icons-kit'
import {spinner} from 'react-icons-kit/fa/spinner'


const drawerWidth =  get(Meteor, 'settings.public.defaults.drawerWidth', 280);

const styles = theme => ({
});


function AppLoadingPage(props) {
  if(props.logger){
    props.logger.info('Rendering the AppLoadingPage.');
    props.logger.verbose('client.app.layout.AppLoadingPage');  
  }

  // const classes = useStyles();

  const { children, staticContext, loadingMessage, spinningIcon, ...otherProps } = props;

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
      top: '40%'
    }
  }

  return (
    <div { ...otherProps } >
      { helmet }
      <div id='primaryFlexPanel' >
        <CssBaseline />
        <Header { ...otherProps } />
          <main id="appLoadingPage" style={{width: '100%', height: '100%', textAlign: 'center'}}>
            <div style={ styles.loadingMessage }>
              <h1 className="helveticas" style={{fontWeight: 200, marginLeft: '-50%'}}>This app is loading.</h1>
              <Icon icon={spinner} className="spinningIcon" style={styles.spinningIcon} size={80} />
            </div>
          </main>
        <Footer { ...otherProps } />
      </div>
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(AppLoadingPage);
