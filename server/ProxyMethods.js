import { Meteor } from 'meteor/meteor';
import AccountsServer from '@accounts/server';
import { wrapMeteorServer } from '@accounts/meteor-adapter';

import { HTTP } from 'meteor/http';
import { get } from 'lodash';

import { check } from 'meteor/check'


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

        var self = this;
  
        var queryResult;
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

  },
  postRelay: async function(fhirUrl, options){
    console.log('Relaying a message...');

    if(get(Meteor, 'settings.private.proxyServerEnabled')){

      console.log('Relay Endpoint: ', fhirUrl)

      var self = this;

      var queryResult;
      var httpHeaders = { headers: {
          'Content-Type': 'application/fhir+json',
          'Access-Control-Allow-Origin': '*'          
      }}

      if(get(Meteor, 'settings.private.interfaces.fhirServer.auth.bearerToken')){
        httpHeaders.headers["Authorization"] = 'Bearer ' + get(Meteor, 'settings.private.interfaces.fhirServer.auth.bearerToken');
      }

      console.log('httpHeaders', httpHeaders)

      return await HTTP.post(fhirUrl, {
        headers: httpHeaders,
        data: options.payload
      }, function(error, result){
        if(error){
          console.log('error', error);
        }
        if(result){
          console.log('result', result);
          return result;
        }
      });
    } else {
        console.log('==========================================')
        console.log('*** Proxy server disabled *** ')

        return "Proxy server disabled."
    }
  }

});



