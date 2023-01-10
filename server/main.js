import './ServerSideRendering.js';
import './AccountsServer.js';
import './SmartHealthCards.js';
import './ProxyMethods.js';
import './ProxyHttpRelay.js';
import './Cron.js';
import './WebsocketPublications.js';

// need to upgrade mongoose, mongo, and the kerberose dependency
// then we can re-enable
// import './FhirSchemaImporter.js';

import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

import { get } from 'lodash';

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
    process.env.DEBUG && console.log("parseRpcAuthorization().userId", context.userId)
    if(context.userId){
      isAuthorized = true;
    } else {
      isAuthorized = false;
      throw new Meteor.Error('not-authorized');
    }
  }
  return isAuthorized;
}