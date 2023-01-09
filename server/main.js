import './ServerSideRendering.js';
import './AccountsServer.js';
import './SmartHealthCards.js';
import './ProxyMethods.js';
import './ProxyRelay.js';
import './Cron.js';
import './WebsocketPublications.js';

// need to upgrade mongoose, mongo, and the kerberose dependency
// then we can re-enable
// import './FhirSchemaImporter.js';

import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

Meteor.startup(() => {
  // Need to add a default language for accessibility purposes
  WebApp.addHtmlAttributeHook(function() {
    return {
      "lang": "en"
    }
  })
});


export function parseRpcAuthorization(context){
  process.env.DEBUG && console.log("Parsing user authorization....")

  let isAuthorized = true;

  if(get(Meteor, 'settings.private.accessControl.enableRpcAccessRestrictions')){
    if(context.userId){
      isAuthorized = true;
    } else {
      throw new Meteor.Error('not-authorized');
      isAuthorized = false;
    }
  }
  return isAuthorized;
}