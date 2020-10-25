import './ServerSideRendering.js';
import './FhirSchemaImporter.js';
import './AccountsServer.js';

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
