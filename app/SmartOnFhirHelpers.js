import _ from 'lodash';
let get = _.get;
let set = _.set;
let has = _.has;
let uniq = _.uniq;

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';


export const SmartOnFhirHelpers = {
    fetchCapabilityStatement(){
        console.log('fetchCapabilityStatement');
    
        HTTP.get(get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', '') + "/metadata?_format=json", {}, function(error, result){ 
          if(error){
            console.error('HTTP.get /metadata error', error)
          }
          if(result){
            console.log('HTTP.get /metadata result', result)
            let parsedData;
            if(get(result, 'data')){
              setServerCapabilityStatement(result.data);
              fetchWellKnownSmartConfig();
            } else if (get(result, 'content')) {
              setServerCapabilityStatement(JSON.parse(get(result, 'content')));
              SmartOnFhirHelpers.fetchWellKnownSmartConfig();
            }
          }
        });
    },
    fetchWellKnownSmartConfig(callback){
        console.log('fetchWellKnownSmartConfig');
  
        HTTP.get(get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', '') + "/.well-known/smart-configuration", {}, function(error, result){
          if(error){
            console.error('HTTP.get /.well-known/smart-configuration error', error)
          }
          if(result){
            console.log('HTTP.get /.well-known/smart-configuration result', result)
            setWellKnownSmartConfig(get(result, 'data'));
            SmartOnFhirHelpers.exchangeCodeForAccessToken(get(result, 'data'));
          }
        });      
    },
    exchangeCodeForAccessToken(wellKnownSmartConfig){
    
        console.log('exchangeCodeForAccessToken')
        console.log('exchangeCodeForAccessToken.url', get(wellKnownSmartConfig, 'token_endpoint'))

        let stringEncodedData = "grant_type=authorization_code&code=" + searchParams.get('code') + '&redirect_uri=' + encodeURIComponent(get(Meteor, 'settings.public.smartOnFhir[0].redirect_uri', '')) + '&client_id=' + get(Meteor, 'settings.public.smartOnFhir[0].client_id', '')
        console.log('exchangeCodeForAccessToken.stringEncodedData', stringEncodedData);
        let payload = {
            code: searchParams.get('code'),
            grant_type: 'authorization_code',
            redirect_uri: encodeURIComponent(get(Meteor, 'settings.public.smartOnFhir[0].redirect_uri', '')),
            client_id: get(Meteor, 'settings.public.smartOnFhir[0].client_id', '')
        }
        console.log('exchangeCodeForAccessToken.code', searchParams.get('code'))
        console.log('exchangeCodeForAccessToken.code', payload)
      
        HTTP.post(get(wellKnownSmartConfig, 'token_endpoint'), {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            content: stringEncodedData
        }, function(error, result){
            if(error){
                console.error('HTTP.post /token error', error)
            }
            if(result){
                console.log('HTTP.post /token result', result)
                setSmartAccessToken(get(result, 'data'));

                SmartOnFhirHelpers.fetchPatient(get(result, 'data.patient'), get(result, 'data.access_token'));
            }
        });
   
        return returnQuery
    },
    fetchPatient(patientId, accessToken){
        console.log('fetchPatient')
        console.log('fetchPatient.url', get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', '') + "/Patient")
        console.log('fetchPatient.url', accessToken)

        HTTP.get(get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', '') + "/Patient/" + patientId + "?_format=json", {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
        }, function(error, result){
        if(error){
            console.error('HTTP.get /Patient error', error)
        }
        if(result){
            console.log('HTTP.get /Patient result', result)
            if(get(result, 'data')){
            setFhirPatient(get(result, 'data'));
            } else if (get(result, 'content')) {
            setFhirPatient(JSON.parse(get(result, 'content')));
            }
        }
        });
    }
}

export default FhirUtilities;