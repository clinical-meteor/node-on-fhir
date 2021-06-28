import { Meteor } from 'meteor/meteor';
import AccountsServer from '@accounts/server';
import { wrapMeteorServer } from '@accounts/meteor-adapter';

import { HTTP } from 'meteor/http';
import { get } from 'lodash';

import { check } from 'meteor/check'

AccountsServer.config({}); // Config your accounts server
 wrapMeteorServer(Meteor, AccountsServer);


Meteor.methods({
    queryEndpoint: async function(fhirUrl, accessToken){
      check(fhirUrl, String);
      check(accessToken, String);

      if(this.userId){
        // check(fhirUrl, String)
        // check(accessToken, Match.Maybe(String));
    
        if(get(Meteor, 'settings.private.proxyServerEnabled')){
    
          console.log('Query Endpoint: ', fhirUrl)
          console.log('AccessToken:    ', accessToken)
    
          var httpHeaders = { headers: {
              'Accept': ['application/json', 'application/fhir+json'],
              'Access-Control-Allow-Origin': '*'          
          }}

          if(get(Meteor, 'settings.private.fhir.fhirServer.auth.bearerToken')){
              accessToken = get(Meteor, 'settings.private.fhir.fhirServer.auth.bearerToken');
          }
  
          if(accessToken){
              httpHeaders.headers["Authorization"] = 'Bearer ' + accessToken;
          }
  
          console.log('httpHeaders', httpHeaders)
  
          return await HTTP.get(fhirUrl, httpHeaders);
  
        } else {
            console.log('==========================================')
            console.log('ProxyServer:  Disabled.  Please check the Meteor.settings file.')    

            return "Proxy server disabled."
        }
      } else {
        console.log('ProxyServer:  Unauthorized request.')   
        return "Unauthorized." 
      }

    }
});



