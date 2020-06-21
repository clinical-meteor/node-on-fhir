// import { Meteor } from 'meteor/meteor';

// import { HTTP } from 'meteor/http';
// import { get } from 'lodash';


// Meteor.methods({
//     queryEndpoint: async function(fhirUrl, accessToken){
//         // check(fhirUrl, String)
//         // check(accessToken, Match.Maybe(String));
    
//         if(get(Meteor, 'settings.private.proxyServerEnabled')){
    
//             console.log('Query Endpoint: ', fhirUrl)
//             console.log('AccessToken:    ', accessToken)
    
//             var self = this;
      
//             var queryResult;
//             var httpHeaders = { headers: {
//                 'Accept': ['application/json', 'application/fhir+json'],
//                 'Access-Control-Allow-Origin': '*'          
//             }}

//             if(get(Meteor, 'settings.private.fhir.fhirServer.auth.bearerToken')){
//                 accessToken = get(Meteor, 'settings.private.fhir.fhirServer.auth.bearerToken');
//             }
    
//             if(accessToken){
//                 httpHeaders.headers["Authorization"] = 'Bearer ' + accessToken;
//             }
    
//             console.log('httpHeaders', httpHeaders)
    
//             return await HTTP.get(fhirUrl, httpHeaders);
    
//         } else {
//             console.log('==========================================')
//             console.log('*** Proxy server disabled *** ')

//             return "Proxy server disabled."
//         }
//     }
// });



