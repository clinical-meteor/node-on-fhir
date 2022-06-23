import './ServerSideRendering.js';
import './AccountsServer.js';
import './SmartHealthCards.js';
import './ProxyMethods.js';
import './SmartRelay.js';
import './Cron.js';


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
