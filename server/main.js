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

import mongoose from 'mongoose';
import { Mongo } from '@accounts/mongo';
import { AccountsServer } from '@accounts/server';

let accountsServer;
Meteor.startup(async function(){
  // Need to add a default language for accessibility purposes
  WebApp.addHtmlAttributeHook(function() {
    return {
      "lang": "en"
    }
  })

  // Establish a database connection
  mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  const db = mongoose.connection;
  accountsMongo = new Mongo(db, {
    // options
  });

  // Connect to the accounts server for authentication 
  accountsServer = new AccountsServer(
    {
      db: accountsMongo,
      tokenSecret: get(Meteor, 'settings.private.accountServerTokenSecret', Random.secret()) 
    }
  );
});

export async function parseRpcAuthorization(accessToken){
  process.env.DEBUG && console.log("Parsing user authorization....")

  let isAuthorized = true;

  if(get(Meteor, 'settings.private.accessControl.enableRpcAccessRestrictions')){
    process.env.DEBUG && console.log("parseRpcAuthorization().accessToken", accessToken)
    
    try {
      const session = await accountsServer.findSessionByAccessToken(accessToken);
      process.env.DEBUG && console.log("parseRpcAuthorization().session", session);

      // const sessionUser = await accountsServer.findUserById(userId);
      // process.env.DEBUG && console.log("parseRpcAuthorization().sessionUser", sessionUser)
  
      if(session){
        isAuthorized = true;
      }        
    } catch (error) {
      console.log('findSessionByAccessToken.error', error)
      isAuthorized = false;
    }
  }
  return isAuthorized;
}

