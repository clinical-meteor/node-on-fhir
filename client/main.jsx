import React from 'react';

import { Meteor } from 'meteor/meteor';
import { wrapMeteorClient } from '@accounts/meteor-adapter';

import { Session } from 'meteor/session';
import ReactDOM from "react-dom";

import { render } from 'react-dom';
import { onPageLoad } from 'meteor/server-render';

import { register } from 'register-service-worker';
import { get } from 'lodash';

import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';
import { RestClient } from '@accounts/rest-client';

import theme from '../app/Theme';
import logger from '../app/Logger';

import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';

import AppContainer from "/app/layout/AppContainer.jsx";

const accountsRest = new RestClient({
  // apiHost: 'http://localhost:4000',
  apiHost: get(Meteor, 'settings.public.accountsServer.host') + ":" + get(Meteor, 'settings.public.accountsServer.host'),
  rootPath: '/accounts'
});
const accountsClient = new AccountsClient({}, accountsRest);
const accountsPassword = new AccountsClientPassword(accountsClient);

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

onPageLoad(async function(){
  logger.info("Initial onPageLoad() function.  Storing URL parameters in session variables.", window.location.search);
  Session.set('last_reloaded_url', window.location.search)

  const preloadedState = window.__PRELOADED_STATE__;
  logger.debug("onPageLoad().preloadedState", preloadedState);

  // const AppContainer = (await import("/app/layout/AppContainer.jsx")).default;

  let searchParams = new URLSearchParams(get(preloadedState, 'url.path'));
  logger.debug("onPageLoad().searchParams", searchParams);
  
  if(searchParams.get('iss')){
    Session.set('smartOnFhir_iss', searchParams.get('iss'));
  }
  if(searchParams.get('launch')){
    Session.set('smartOnFhir_launch', searchParams.get('launch'));
  }
  if(searchParams.get('code')){
    Session.set('smartOnFhir_code', searchParams.get('code'));
  }
  if(searchParams.get('scope')){
    Session.set('smartOnFhir_scope', searchParams.get('scope'));
  }

  if(window.MobileAccessibility){
    window.MobileAccessibility.usePreferredTextZoom(false);
  }

  const jssStyles = document.querySelectorAll('jss-server-side');
	if (jssStyles && jssStyles.parentNode) jssStyles.parentNode.removeChild(jssStyles);

  const jssMakeStyles = document.querySelectorAll('[data-meta="makeStyles"]');
	if (jssMakeStyles && jssMakeStyles.parentNode) jssMakeStyles.parentNode.removeChild(jssStyles);


  logger.info("Hydrating the reactCanvas with AppContainer");
  ReactDOM.hydrate(<AppContainer />, document.getElementById('reactCanvas'));
});


//========================================================================
// HOT CODE PUSH RESUME

// // this disables hot-push reloading!!!
// // have to rebuild through the cordova pipeline to deploy updates
// if(Meteor.isCordova){
//   Reload._onMigrate(function (retry) {

//     // remove any lingering styles from the last migration
//     const oldMigrationStyles = document.querySelectorAll('jss-client-migration');
//     if (oldMigrationStyles && oldMigrationStyles.parentNode) oldMigrationStyles.parentNode.removeChild(oldMigrationStyles);
  
//     // prepare to collect style sheets
//     const sheets = new ServerStyleSheets();

//     // do a secondary render of the application
//     // to calculate style sheets in this environment
//     const htmlString = renderToString(sheets.collect(
//       <ThemeProvider theme={theme} >          
//         <AppContainer location={get(window, 'location.pathname')} />
//       </ThemeProvider>  
//     ));

//     // attach style sheets to app
//     const $style = document.createElement("jss-client-migration");
//     document.head.appendChild($style);

//     return [true];
//   });
// }

//========================================================================
// WEB WORKERS (MULTITHREADED SCALING)

//  // we register a static file that's put in the /public folder
// register('/service-worker.js', {
//   registrationOptions: { scope: './' },
//   ready (registration) {
//     console.log('Service worker is active.')
//   },
//   registered (registration) {
//     console.log('Service worker has been registered.')
//   },
//   cached (registration) {
//     console.log('Content has been cached for offline use.')
//   },
//   updatefound (registration) {
//     console.log('New content is downloading.')
//   },
//   updated (registration) {
//     console.log('New content is available; please refresh.')
//   },
//   offline () {
//     console.log('No internet connection found. App is running in offline mode.')
//   },
//   error (error) {
//     console.error('Error during service worker registration:', error)
//   }
// });

export { accountsClient, accountsRest, accountsPassword };