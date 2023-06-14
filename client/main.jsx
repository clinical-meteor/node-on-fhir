import React from 'react';

import { Meteor } from 'meteor/meteor';
// import { wrapMeteorClient } from '@accounts/meteor-adapter';
// import { wrapMeteorClient } from '@accounts/meteor-adapter';
import { wrapMeteorClient } from './meteor-adapter-client';

import { Session } from 'meteor/session';
import ReactDOM from "react-dom";

import { render } from 'react-dom';
import { onPageLoad } from 'meteor/server-render';

import { register } from 'register-service-worker';
import { get, has } from 'lodash';

import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';
import { RestClient } from '@accounts/rest-client';

import theme from '../app/Theme';
import { logger, message } from '../app/Logger';

import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';

import AppContainer from "/app/layout/AppContainer.jsx";

import '../app/WebsocketSubscriptions';

let path = require('path');
let PROJECT_ROOT = path.join(__dirname, '..');


wrapMeteorClient(Meteor, AccountsClient);

Meteor.hostname = function(){

  let meteorAbsoluteUrl = Meteor.absoluteUrl();
  // console.log('meteorAbsoluteUrl', meteorAbsoluteUrl);
  // console.log('meteorAbsoluteUrl.length', meteorAbsoluteUrl.length);
  // console.log('meteorAbsoluteUrl[meteorAbsoluteUrl.length]', meteorAbsoluteUrl[meteorAbsoluteUrl.length - 1]);

  let trimmedString = "";
  if(meteorAbsoluteUrl[meteorAbsoluteUrl.length - 1] === "/"){
    trimmedString = meteorAbsoluteUrl.substring(0, meteorAbsoluteUrl.length - 1)
    // console.log('meteorAbsoluteUrl.trimmed', trimmedString);
  }

  return trimmedString;
}

let accountServerOptions = {};
if(has(Meteor, 'settings.public.interfaces.accountServer')){
  accountServerOptions = {
    // apiHost: 'http://localhost:4000',
    apiHost: get(Meteor, 'settings.public.interfaces.accountsServer.host') + ":" + get(Meteor, 'settings.public.interfaces.accountsServer.port'),
    rootPath: '/accounts'
  }
}
const accountsRest = new RestClient(accountServerOptions);
const accountsClient = new AccountsClient({}, accountsRest);
const accountsPassword = new AccountsClientPassword(accountsClient);

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

//==========================================================================
// LOGGING 
// https://gist.github.com/bgrins/5108712

function getStackInfo (stackIndex) {
  // get call stack, and analyze it
  // get all file, method, and line numbers
  var stacklist = (new Error()).stack.split('\n').slice(3)

  // stack trace format:
  // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
  // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
  var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
  var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi

  var s = stacklist[stackIndex] || stacklist[0]
  var sp = stackReg.exec(s) || stackReg2.exec(s)

  if (sp && sp.length === 5) {
    return {
      method: sp[1],
      relativePath: path.relative(PROJECT_ROOT, sp[2]),
      line: sp[3],
      pos: sp[4],
      file: path.basename(sp[2]),
      stack: stacklist.join('\n')
    }
  }
}









//========================================================================
// ON PAGE LOAD


onPageLoad(async function(){
  if(process.env.NODE_ENV === "production"){
    if(typeof window === "object"){
      if(window.console){
        window.console.debug = function(){}
        window.console.warn = function(){}
        window.console.trace = function(){}
        window.console.debug = function(){}
        window.console.everything = function(){}    
      }
    }
  } 
  
  console.info("Initial onPageLoad() function.  Storing URL parameters in session variables.", window.location.search);
  Session.set('last_reloaded_url', window.location.search)

  const preloadedState = window.__PRELOADED_STATE__;
  console.debug("onPageLoad().preloadedState", preloadedState);

  // const AppContainer = (await import("/app/layout/AppContainer.jsx")).default;

  let searchParams = new URLSearchParams(get(preloadedState, 'url.path'));
  console.debug("onPageLoad().searchParams", searchParams);
  
  if(get(Meteor, 'settings.public.enableSmartOnFhir')){
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
  }

  if(window.MobileAccessibility){
    window.MobileAccessibility.usePreferredTextZoom(false);
  }

  const jssStyles = document.querySelectorAll('jss-server-side');
	if (jssStyles && jssStyles.parentNode) jssStyles.parentNode.removeChild(jssStyles);

  const jssMakeStyles = document.querySelectorAll('[data-meta="makeStyles"]');
	if (jssMakeStyles && jssMakeStyles.parentNode) jssMakeStyles.parentNode.removeChild(jssStyles);


  console.info("Hydrating the reactCanvas with AppContainer");
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

export default { accountsClient, accountsRest, accountsPassword };