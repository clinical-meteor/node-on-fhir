import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'

import { HTTP } from 'meteor/http';
import { Random } from 'meteor/random';
import { get, has, findIndex } from 'lodash';
import { FhirUtilities, Locations, Organizations, MeasureReports, Endpoints } from 'meteor/clinical:hl7-fhir-data-infrastructure';
import moment from 'moment';

import { parseRpcAuthorization } from './main';

let publicKey;
try {
    import keychain from '../certs/jwks.json';
    publicKey = get(keychain, 'keys[0]');        
} catch (error) {
    // console.log(error)    
    console.warn("Could not find ../certs/jwks.json file")
    console.warn('Skipping initialization of Smart Health Cards')
}

// import privateKeychain from '../certs/private.jwks.json';
// let signingKey = get(privateKeychain, 'keys[0]');

let localFilesystemPem;
try {
  localFilesystemPem = get(Meteor, 'settings.private.x509.privateKey', '');
  if(localFilesystemPem){
    process.env.DEBUG_CRYPTO && console.log(localFilesystemPem)
    console.info('PrivateKey found in settings file.  Ready to sign SmartHealthCards...');
    process.env.DEBUG_CRYPTO && console.log(localFilesystemPem)
  } else {
    console.info('No local privateKey found for signing SmartHealthCards...')
  }
} catch (err) {
    process.env.DEBUG_CRYPTO && console.error("FileSystemError", err)
}

import fs from 'fs';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import zlib from 'zlib';
import atob from 'atob';
import btoa from 'btoa';
import pako from 'pako';
import got from 'got';
// import jose, { JWK, JWS } from 'node-jose';
import { base64, base64url } from "rfc4648";
import jws from 'jws';
import InflateAuto from 'inflate-auto';

// import base64url from 'base64url';
// import * as base64 from "byte-base64";

 

// import { SignJWT } from 'jose';

import { Convert } from 'any-to-any';

const inputNumber  = '1110111' // 119 in decimal
const inputBase = 64
const outputBase = 10


// Notes
// node-jose doest support ES256 (unsupported algorithm)
// SignJWT uses ESM

//     567629595326546034602925407728043360287028647167452228092862700541
// (a) 56762959532654603460292540772804
// (b) 56762959532654603460292540772843


// var privateKey = fs.readFileSync('private.key');


// VerifiableCredential{Bundle{Immunization}} > stringify() > trim() > deflate() > sign() > "shc:/" + numeric(signature)
// VerifiableCredential{Bundle{Immunization}} > stringify() > trim() > deflate() > base64() > sign() > "shc:/" + numeric(signature)

function zeroPad(num, places){
    return String(num).padStart(places, '0');
}
export function arrayBufferToBase64( uint8Array ) {
    var binary = '';
    for (var i = 0; i < uint8Array.byteLength; i++) {
        binary += String.fromCharCode( uint8Array[ i ] );
    }
    return btoa( binary );
}
export function numericMode(inputString){
    let resultArray = [];

    let inputArray = Array.from(inputString);

    inputArray.forEach(function(character, index){
        resultArray.push(zeroPad(inputString.charCodeAt(index) - 45, 2));
    })    

    // convert the array to a comma separated string, and then remove commas
    let result = resultArray.toString().replace(/,/g, "");

    return result;
}
export function decodeNumeric(shcString){
    let resultArray = [];

    process.env.TRACE && console.log('typeof shcString', typeof shcString);
    process.env.TRACE && console.log("decodeNumeric().shcString", shcString);

    let token = shcString.substring(5, shcString.length);
    process.env.TRACE && console.log("decodeNumeric().token", token);

    let firstIndex;
    let secondIndex;


    // this algorithm is... handwavy
    // we have an off-by-one error in the denumerization, hence starting at -1
    for (let index = 0; index < token.length; index++) {
        if((index % 2) === 0){
            firstIndex = index;
            secondIndex = index + 1;
        
            console.log('firstIndex:          ' + firstIndex);
            process.env.TRACE && console.log('secondIndex:         ' + secondIndex);    

            let douplet;
            let first;
            let second;
            let ascii;

            if(token[firstIndex] && token[secondIndex]){
                first = token[firstIndex];
                second = token[secondIndex];
                process.env.TRACE &&  console.log('first:      ' + parseInt(first));
                process.env.TRACE &&  console.log('second:     ' + parseInt(second));    


                douplet = parseInt(first).toString() + parseInt(second).toString();
                process.env.TRACE &&  console.log('douplet:    ' + douplet);    

                process.env.TRACE &&  console.log('douplet+45:   ' + (parseInt(douplet) + 45));
                
                ascii = String.fromCharCode((parseInt(douplet) + 45));
                process.env.TRACE &&  console.log('ascii:      ' + ascii);    

                resultArray.push(ascii);               

                firstIndex = null;
                secondIndex = null;
        
            } else {
                process.env.DEBUG && console.error("Uh oh, wasnt a doublet.  How did that happen?");
            }
        }
    }
    process.env.TRACE &&  console.log("resultArray", resultArray);

    let result = resultArray.toString().replace(/,/g, "").trim();

    process.env.TRACE &&  console.log("decodeNumeric().result", result);
    return result;

}
Meteor.methods({
    signHealthCard: async function(recordToSign, meteorSessionToken){
        check(recordToSign, Object);

        let isAuthorized = await parseRpcAuthorization(meteorSessionToken);
        if(isAuthorized){
            process.env.DEBUG_CRYPTO && console.log('================SIGNING HEALTHCARD=============================')
            process.env.DEBUG_CRYPTO && console.log('');
    
            process.env.DEBUG_CRYPTO && console.log('');
            process.env.DEBUG_CRYPTO && console.log('---------------Verified Credential------------------------')        
            process.env.DEBUG_CRYPTO && console.log('');
    
            recordToSign.nbf = moment().add(1, "seconds").unix();
            process.env.DEBUG_CRYPTO && console.log(recordToSign);
    
            process.env.DEBUG_CRYPTO && console.log('');
            process.env.DEBUG_CRYPTO && console.log('---------------FHIR Bundle--------------------------------')        
            process.env.DEBUG_CRYPTO && console.log('');    
            process.env.DEBUG_CRYPTO && console.log(get(recordToSign, 'vc.credentialSubject.fhirBundle'));
    
            process.env.DEBUG_CRYPTO && console.log('');
            process.env.DEBUG_CRYPTO && console.log('---------------Signing Key (PEM)--------------------------')        
            process.env.DEBUG_CRYPTO && console.log('');
    
            let privatePem = Assets.getText('ec_private.pem');
    
            if(privatePem){
                process.env.DEBUG_CRYPTO && console.log('');
                process.env.DEBUG_CRYPTO && console.log(privatePem);
        
                process.env.DEBUG_CRYPTO && console.log('');
                process.env.DEBUG_CRYPTO && console.log('-----------Public Key (.well-known/jwks.json)-------------')        
                process.env.DEBUG_CRYPTO && console.log('');
    
                if(publicKey){
                    process.env.DEBUG_CRYPTO && console.log(publicKey);
                    process.env.DEBUG_CRYPTO && console.log('');
            
                    process.env.DEBUG_CRYPTO && console.log('');
                    process.env.DEBUG_CRYPTO && console.log('---------------Stringified Payload------------------------')
                    process.env.DEBUG_CRYPTO && console.log('');
            
                    let vcPayloadString = JSON.stringify(recordToSign);
                    let vcPayloadString_trimmed = vcPayloadString.trim();
                    process.env.DEBUG_CRYPTO && console.log(vcPayloadString_trimmed);
            
                    process.env.DEBUG_CRYPTO && console.log('');
                    process.env.DEBUG_CRYPTO && console.log('-------------Raw Deflated Payload (Buffer)----------------')
                    process.env.DEBUG_CRYPTO && console.log('');
            
                    let deflatedPayload = zlib.deflateRawSync(vcPayloadString_trimmed);
                    process.env.DEBUG_CRYPTO && console.log(deflatedPayload);
            
                    let json_web_signature = jws.sign({
                        header: { alg: 'ES256', zip: 'DEF', kid: get(keychain, 'keys[0].kid')},
                        secret: privatePem,
                        payload: deflatedPayload.toString('base64'),
                        encoding: 'base64'
                    });
    
                    if(json_web_signature){
                        process.env.DEBUG_CRYPTO && console.log('');
                        process.env.DEBUG_CRYPTO && console.log('------------JSON Web Signature (JWS)----------------------')
                        process.env.DEBUG_CRYPTO && console.log('');
                
                        process.env.DEBUG_CRYPTO && console.log(json_web_signature)     
                
                        Meteor.call('verifyHealthCard', json_web_signature, Session.get('accountsAccessToken'));
                
                        process.env.DEBUG_CRYPTO && console.log('');
                        process.env.DEBUG_CRYPTO && console.log('------------Smart Health Card----------------------------')
                        process.env.DEBUG_CRYPTO && console.log('');
                
                        let shcNumericString = "shc:/" + numericMode(json_web_signature);
                        process.env.DEBUG_CRYPTO && console.log(shcNumericString)
                        process.env.DEBUG_CRYPTO && console.log('==============================================================================')
                
                        return shcNumericString;
                    } else {
                        process.env.DEBUG_CRYPTO && console.log('json_web_signature was not available....')
                        process.env.DEBUG_CRYPTO && console.log('');
                        process.env.DEBUG_CRYPTO && console.log('please add a key to the following locations:');
                        process.env.DEBUG_CRYPTO && console.log('certs/jwks.json');
                        process.env.DEBUG_CRYPTO && console.log('.well-known/jwks.json');
                        process.env.DEBUG_CRYPTO && console.log('');
                        process.env.DEBUG_CRYPTO && console.log('should look something like the following,');
                        process.env.DEBUG_CRYPTO && console.log('using ES256 algorithm and DEF zip format:')
                        process.env.DEBUG_CRYPTO && console.log('{');
                        process.env.DEBUG_CRYPTO && console.log('  "keys": [');
                        process.env.DEBUG_CRYPTO && console.log('    {');
                        process.env.DEBUG_CRYPTO && console.log('      "kty": "EC",');
                        process.env.DEBUG_CRYPTO && console.log('      "use": "sig",');
                        process.env.DEBUG_CRYPTO && console.log('      "crv": "P-256",');
                        process.env.DEBUG_CRYPTO && console.log('      "kid": "yRwxp3sb7ldqlbGcw42zkcamMCo_9QZqUqKR6ZFQtH8",');
                        process.env.DEBUG_CRYPTO && console.log('      "x": "ivxR4CWtrm4B0D4Bqbg3gnlQO6SuzF-VFZ66D44IDLA",');
                        process.env.DEBUG_CRYPTO && console.log('      "y": "T6EdDPqwz9sIBrTXaR0KTFlbQsmdCbV4ZpObVo_80MY",');
                        process.env.DEBUG_CRYPTO && console.log('      "alg": "ES256"');
                        process.env.DEBUG_CRYPTO && console.log('    }');
                        process.env.DEBUG_CRYPTO && console.log('  ]');
                        process.env.DEBUG_CRYPTO && console.log('}');
                        process.env.DEBUG_CRYPTO && console.log('');
                        process.env.DEBUG_CRYPTO && console.log('the above key has been mangled, and is only provided to show the correct syntax');
                        process.env.DEBUG_CRYPTO && console.log('');
    
                        return false;
                    }
                } else {
                    process.env.DEBUG_CRYPTO && console.log('publicKey was not available....');
                    process.env.DEBUG_CRYPTO && console.log('');
                    process.env.DEBUG_CRYPTO && console.log('please add a key to the following locations:');
                    process.env.DEBUG_CRYPTO && console.log('certs/jwks.json');
                    process.env.DEBUG_CRYPTO && console.log('.well-known/jwks.json');
                    process.env.DEBUG_CRYPTO && console.log('');
                    process.env.DEBUG_CRYPTO && console.log('should look something like the following,');
                    process.env.DEBUG_CRYPTO && console.log('using ES256 algorithm and DEF zip format:')
                    process.env.DEBUG_CRYPTO && console.log('{');
                    process.env.DEBUG_CRYPTO && console.log('  "keys": [');
                    process.env.DEBUG_CRYPTO && console.log('    {');
                    process.env.DEBUG_CRYPTO && console.log('      "kty": "EC",');
                    process.env.DEBUG_CRYPTO && console.log('      "use": "sig",');
                    process.env.DEBUG_CRYPTO && console.log('      "crv": "P-256",');
                    process.env.DEBUG_CRYPTO && console.log('      "kid": "yRwxp3sb7ldqlbGcw42zkcamMCo_9QZqUqKR6ZFQtH8",');
                    process.env.DEBUG_CRYPTO && console.log('      "x": "ivxR4CWtrm4B0D4Bqbg3gnlQO6SuzF-VFZ66D44IDLA",');
                    process.env.DEBUG_CRYPTO && console.log('      "y": "T6EdDPqwz9sIBrTXaR0KTFlbQsmdCbV4ZpObVo_80MY",');
                    process.env.DEBUG_CRYPTO && console.log('      "alg": "ES256"');
                    process.env.DEBUG_CRYPTO && console.log('    }');
                    process.env.DEBUG_CRYPTO && console.log('  ]');
                    process.env.DEBUG_CRYPTO && console.log('}');
                    process.env.DEBUG_CRYPTO && console.log('');
                    process.env.DEBUG_CRYPTO && console.log('the above key has been mangled, and is only provided to show the correct syntax');
                    process.env.DEBUG_CRYPTO && console.log('');
                    return false;    
                }
            } else {
                process.env.DEBUG_CRYPTO && console.log('privatePem was not available....');
                process.env.DEBUG_CRYPTO && console.log('');
                process.env.DEBUG_CRYPTO && console.log('please add a key to the following locations:');
                process.env.DEBUG_CRYPTO && console.log('certs/ec_private.pem');
                process.env.DEBUG_CRYPTO && console.log('');
                process.env.DEBUG_CRYPTO && console.log('should look something like the following:');
                process.env.DEBUG_CRYPTO && console.log('-----BEGIN PRIVATE KEY-----');
                process.env.DEBUG_CRYPTO && console.log('MEECAQAwEwYKKoZIzjwCAQYIKoZIzj0DAQcEJzAlAgEBBCCGnb8hUos2FdRkKrPf');
                process.env.DEBUG_CRYPTO && console.log('xMGenh8eqwyr51XDEM4GdO1Fgg==');
                process.env.DEBUG_CRYPTO && console.log('-----END PRIVATE KEY-----');
                process.env.DEBUG_CRYPTO && console.log('');
                process.env.DEBUG_CRYPTO && console.log('the above key has been mangled, and is only provided to show the correct syntax');
                process.env.DEBUG_CRYPTO && console.log('');
    
                return false;
            }
        } else {
            return "User not authorized."
        }        
    },
    parseHealthCard: async function(healthCardToken, meteorSessionToken){
        check(healthCardToken, String);

        let isAuthorized = await parseRpcAuthorization(meteorSessionToken);
        if(isAuthorized){
            process.env.DEBUG_CRYPTO && console.log('==============================================================================')
            process.env.DEBUG_CRYPTO && console.log('parseHealthCard().healthCardToken', healthCardToken)
    
            let json_web_signature = decodeNumeric(healthCardToken);
            process.env.DEBUG_CRYPTO && console.log('parseHealthCard().json_web_signature', json_web_signature);
    
            let dataPayload = Meteor.call('verifyHealthCard', json_web_signature);
            process.env.DEBUG_CRYPTO && console.log('parseHealthCard().dataPayload', dataPayload)
    
            return dataPayload;    
        } else {
            return "User not authorized."
        }
    },
    verifyHealthCard: async function(json_web_signature, meteorSessionToken){
        check(json_web_signature, String);

        let isAuthorized = await parseRpcAuthorization(meteorSessionToken);
        if(isAuthorized){
            process.env.DEBUG_CRYPTO && console.log('');
            process.env.DEBUG_CRYPTO && console.log('================VERIFYING SIGNATURE=======================')
            process.env.DEBUG_CRYPTO && console.log('');

            process.env.DEBUG_CRYPTO && console.log(json_web_signature)

            process.env.DEBUG_CRYPTO && console.log('')     
            process.env.DEBUG_CRYPTO && console.log('------------Decoded Signature-----------------------------')     
            process.env.DEBUG_CRYPTO && console.log('')

            // // quality control check
            // // can disable later
            var decoded = jws.decode(json_web_signature);
            process.env.DEBUG_CRYPTO && console.log(decoded);

            process.env.DEBUG_CRYPTO && console.log('')
            process.env.DEBUG_CRYPTO && console.log('-------------Is Verified----------------------------------')
            process.env.DEBUG_CRYPTO && console.log('')

            // let isVerified = jws.verify(json_web_signature, 'ES256', privatePem);
            let isVerified = jws.verify(json_web_signature, 'ES256', jwkToPem(publicKey));
            process.env.DEBUG_CRYPTO && console.log(isVerified ? "YES" : "NO")   

            process.env.DEBUG_CRYPTO && console.log('')
            process.env.DEBUG_CRYPTO && console.log('------------JWS Parts-------------------------------------')
            process.env.DEBUG_CRYPTO && console.log('')


            const parts = json_web_signature.split('.');
            process.env.DEBUG_CRYPTO && console.log(parts)

            process.env.DEBUG_CRYPTO && console.log('')
            process.env.DEBUG_CRYPTO && console.log('------------JWS Payload-----------------------------------')
            process.env.DEBUG_CRYPTO && console.log('')

            const rawPayload = parts[1].trim();
            process.env.DEBUG_CRYPTO && console.log(rawPayload);

            
            // process.env.DEBUG_CRYPTO && console.log('')
            // process.env.DEBUG_CRYPTO && console.log('------------Payload Buffer--------------------------------')    
            // process.env.DEBUG_CRYPTO && console.log('')

            // // // per Matt Printz
            // let buffer_from_payload = Buffer.from(rawPayload);
            // process.env.DEBUG_CRYPTO && console.log(buffer_from_payload);

            process.env.DEBUG_CRYPTO && console.log('')
            process.env.DEBUG_CRYPTO && console.log('---------**-Payload Buffer (from base64)-**---------------')    
            process.env.DEBUG_CRYPTO && console.log('')

            
            let buffer_from_base64_payload = Buffer.from(rawPayload, 'base64');
            process.env.DEBUG_CRYPTO && console.log(buffer_from_base64_payload);


            // process.env.DEBUG_CRYPTO && console.log('')
            // process.env.DEBUG_CRYPTO && console.log('------------Payload Buffer (atob)---------------------------')    
            // process.env.DEBUG_CRYPTO && console.log('')

            // // // per Matt Printz
            // let buffer_from_atob_payload = Buffer.from(atob(rawPayload));
            // process.env.DEBUG_CRYPTO && console.log(buffer_from_atob_payload);

            // process.env.DEBUG_CRYPTO && console.log('')
            // process.env.DEBUG_CRYPTO && console.log('------------Payload Buffer (from base64, atob)------------------')    
            // process.env.DEBUG_CRYPTO && console.log('')

            
            // let buffer_from_base64_atob_payload = Buffer.from(atob(rawPayload), 'base64');
            // process.env.DEBUG_CRYPTO && console.log(buffer_from_base64_atob_payload);


            // process.env.DEBUG_CRYPTO && console.log('')
            // process.env.DEBUG_CRYPTO && console.log('------------Payload Buffer (btoa)---------------------------')    
            // process.env.DEBUG_CRYPTO && console.log('')

            // // // per Matt Printz
            // let buffer_from_btoa_payload = Buffer.from(btoa(rawPayload));
            // process.env.DEBUG_CRYPTO && console.log(buffer_from_btoa_payload);

            // process.env.DEBUG_CRYPTO && console.log('')
            // process.env.DEBUG_CRYPTO && console.log('------------Payload Buffer (from base64, btoa)------------------')    
            // process.env.DEBUG_CRYPTO && console.log('')

            
            // let buffer_from_base64_btoa_payload = Buffer.from(btoa(rawPayload), 'base64');
            // process.env.DEBUG_CRYPTO && console.log(buffer_from_base64_btoa_payload);



            process.env.DEBUG_CRYPTO && console.log('')
            process.env.DEBUG_CRYPTO && console.log('------------Decompressed Payload--------------------------')
            process.env.DEBUG_CRYPTO && console.log('')

                
            const decompressed = zlib.inflateRawSync(buffer_from_base64_payload);    
            const decompressed_string = decompressed.toString('utf8')      
            process.env.DEBUG_CRYPTO && console.log(decompressed_string); 

            return decompressed_string;
        } else {
            return "User not authorized."
        }


        
    },
    decodeHealthCard: async function(json_web_signature, meteorSessionToken){
        check(json_web_signature, String);

        let isAuthorized = await parseRpcAuthorization(meteorSessionToken);
        if(isAuthorized){
            process.env.DEBUG_CRYPTO && console.log('================DECODE HEALTHCARD==========================')
        
            process.env.DEBUG_CRYPTO && console.log(json_web_signature)
    
            process.env.DEBUG_CRYPTO && console.log('')
            process.env.DEBUG_CRYPTO && console.log('------------JWS Payload-----------------------------------')
            process.env.DEBUG_CRYPTO && console.log('')
    
            const parts = json_web_signature.split('.');
            const rawPayload = parts[1].trim();
            process.env.DEBUG_CRYPTO && console.log(rawPayload)
    
            process.env.DEBUG_CRYPTO && console.log('')
            // process.env.DEBUG_CRYPTO && console.log('------------Payload Buffer (atob, base64)-----------------')
            process.env.DEBUG_CRYPTO && console.log('------------Payload Buffer (atob)-----------------')
            process.env.DEBUG_CRYPTO && console.log('')
    
            // per Matt Printz
            // let buffer_from_base64_payload_atob = Buffer.from(rawPayload_atob);
            let buffer_from_base64_payload_atob = Buffer.from(rawPayload_atob, 'base64');
            process.env.DEBUG_CRYPTO && console.log(buffer_from_base64_payload_atob);
    
            process.env.DEBUG_CRYPTO && console.log('')
            process.env.DEBUG_CRYPTO && console.log('------------Decompressed Payload--------------------------')
            process.env.DEBUG_CRYPTO && console.log('')
            
            const decompressed = zlib.inflateRawSync(buffer_from_base64_payload_atob);    
            // const decompressed = InflateAuto.inflateAutoSync(buffer_from_base64_payload_atob);    
            const decompressed_string = decompressed.toString('utf8')      
            process.env.DEBUG_CRYPTO && console.log(decompressed_string); 
    
            return decompressed_string;
        } else {
            return "User not authorized."
        }    
    }
});