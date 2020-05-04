
import { HTTP } from 'meteor/http';
import { get } from 'lodash';
import { Match } from 'meteor/check';


Meteor.methods({
    async queryEndpoint(fhirUrl, accessToken){
        check(fhirUrl, String)
        check(accessToken, Match.Maybe(String));
    
        if(get(Meteor, 'settings.private.proxyServerEnabled')){
    
            console.log('Query Endpoint: ', fhirUrl)
            console.log('AccessToken:    ', accessToken)
    
            var self = this;
      
            var queryResult;
            var httpHeaders = { headers: {
                'Accept': ['application/json', 'application/fhir+json'],
                'Access-Control-Allow-Origin': '*'          
            }}
    
            if(accessToken){
                httpHeaders.headers["Authorization"] = 'Bearer ' + accessToken;
            }
    
            console.log('httpHeaders', httpHeaders)
    
            return await HTTP.get(fhirUrl, httpHeaders);
    
        } else {
            console.log('Proxy server disabled.')
        }
    }
});



