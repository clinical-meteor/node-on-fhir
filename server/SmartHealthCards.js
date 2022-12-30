import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'

import { HTTP } from 'meteor/http';
import { Random } from 'meteor/random';
import { get, has, findIndex } from 'lodash';
import { FhirUtilities, Locations, Organizations, MeasureReports, Endpoints } from 'meteor/clinical:hl7-fhir-data-infrastructure';
import moment from 'moment';

let publicKey;
try {
    import keychain from '../certs/jwks.json';
    publicKey = get(keychain, 'keys[0]');        
} catch (error) {
    console.log(error)    
}

// import privateKeychain from '../certs/private.jwks.json';
// let signingKey = get(privateKeychain, 'keys[0]');

let localFilesystemPem;
try {
  localFilesystemPem = get(Meteor, 'settings.private.x509.privateKey', '');
  if(localFilesystemPem){
    console.log(localFilesystemPem)
    console.log('PrivateKey found in settings file.  Ready to sign SmartHealthCards...');
    process.env.DEBUG_CRYPTO && console.log(localFilesystemPem)
  } else {
    console.log('No local privateKey found for signing SmartHealthCards...')
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

    // console.log('numericMode() typeof inputString', typeof inputString);

    // console.log("numericMode().inputString", inputString);
    // result = inputString;

    let inputArray = Array.from(inputString);

    inputArray.forEach(function(character, index){
        resultArray.push(zeroPad(inputString.charCodeAt(index) - 45, 2));
    })    

    // console.log("numericMode().resultArray", resultArray);

    // convert the array to a comma separated string, and then remove commas
    let result = resultArray.toString().replace(/,/g, "");

    // console.log("numericMode().result", result);
    return result;
}
export function decodeNumeric(shcString){
    let resultArray = [];

    // console.log('typeof shcString', typeof shcString);
    // console.log("decodeNumeric().shcString", shcString);

    let token = shcString.substring(5, shcString.length);
    // console.log("decodeNumeric().token", token);

    let firstIndex;
    let secondIndex;


    // this algorithm is... handwavy
    // we have an off-by-one error in the denumerization, hence starting at -1
    for (let index = 0; index < token.length; index++) {
        if((index % 2) === 0){
            firstIndex = index;
            secondIndex = index + 1;
        
            // console.log('firstIndex:          ' + firstIndex);
            // console.log('secondIndex:         ' + secondIndex);    

            let douplet;
            let first;
            let second;
            let ascii;

            if(token[firstIndex] && token[secondIndex]){
                first = token[firstIndex];
                second = token[secondIndex];
                // console.log('first:      ' + parseInt(first));
                // console.log('second:     ' + parseInt(second));    


                douplet = parseInt(first).toString() + parseInt(second).toString();
                // console.log('douplet:    ' + douplet);    

                // console.log('douplet+45:   ' + (parseInt(douplet) + 45));
                
                ascii = String.fromCharCode((parseInt(douplet) + 45));
                // console.log('ascii:      ' + ascii);    

                resultArray.push(ascii);               

                firstIndex = null;
                secondIndex = null;
        
            } else {
                console.log("uh oh, wasnt a doublet.  how did that happen?")
            }
        }
    }
    // console.log("resultArray", resultArray);

    let result = resultArray.toString().replace(/,/g, "").trim();

    // console.log("decodeNumeric().result", result);
    return result;

}
Meteor.methods({
    signHealthCard: async function(recordToSign){
        check(recordToSign, Object);
        console.log('================SIGNING HEALTHCARD=============================')
        console.log('');

        console.log('');
        console.log('---------------Verified Credential------------------------')        
        console.log('');

        recordToSign.nbf = moment().add(1, "seconds").unix();
        console.log(recordToSign);

        console.log('');
        console.log('---------------FHIR Bundle--------------------------------')        
        console.log('');    
        console.log(get(recordToSign, 'vc.credentialSubject.fhirBundle'));

        console.log('');
        console.log('---------------Signing Key (PEM)--------------------------')        
        console.log('');

        let privatePem = Assets.getText('ec_private.pem');

        if(privatePem){
            console.log('');
            console.log(privatePem);
    
            console.log('');
            console.log('-----------Public Key (.well-known/jwks.json)-------------')        
            console.log('');

            if(publicKey){
                console.log(publicKey);
                console.log('');
        
                console.log('');
                console.log('---------------Stringified Payload------------------------')
                console.log('');
        
                let vcPayloadString = JSON.stringify(recordToSign);
                let vcPayloadString_trimmed = vcPayloadString.trim();
                console.log(vcPayloadString_trimmed);
        
                console.log('');
                console.log('-------------Raw Deflated Payload (Buffer)----------------')
                console.log('');
        
                let deflatedPayload = zlib.deflateRawSync(vcPayloadString_trimmed);
                console.log(deflatedPayload);
        
                let json_web_signature = jws.sign({
                    header: { alg: 'ES256', zip: 'DEF', kid: get(keychain, 'keys[0].kid')},
                    secret: privatePem,
                    payload: deflatedPayload.toString('base64'),
                    encoding: 'base64'
                });

                if(json_web_signature){
                    console.log('');
                    console.log('------------JSON Web Signature (JWS)----------------------')
                    console.log('');
            
                    console.log(json_web_signature)     
            
                    Meteor.call('verifyHealthCard', json_web_signature);
            
                    console.log('');
                    console.log('------------Smart Health Card----------------------------')
                    console.log('');
            
                    let shcNumericString = "shc:/" + numericMode(json_web_signature);
                    console.log(shcNumericString)
                    console.log('==============================================================================')
            
                    return shcNumericString;
                } else {
                    console.log('json_web_signature was not available....')
                    console.log('');
                    console.log('please add a key to the following locations:');
                    console.log('certs/jwks.json');
                    console.log('.well-known/jwks.json');
                    console.log('');
                    console.log('should look something like the following,');
                    console.log('using ES256 algorithm and DEF zip format:')
                    console.log('{');
                    console.log('  "keys": [');
                    console.log('    {');
                    console.log('      "kty": "EC",');
                    console.log('      "use": "sig",');
                    console.log('      "crv": "P-256",');
                    console.log('      "kid": "yRwxp3sb7ldqlbGcw42zkcamMCo_9QZqUqKR6ZFQtH8",');
                    console.log('      "x": "ivxR4CWtrm4B0D4Bqbg3gnlQO6SuzF-VFZ66D44IDLA",');
                    console.log('      "y": "T6EdDPqwz9sIBrTXaR0KTFlbQsmdCbV4ZpObVo_80MY",');
                    console.log('      "alg": "ES256"');
                    console.log('    }');
                    console.log('  ]');
                    console.log('}');
                    console.log('');
                    console.log('the above key has been mangled, and is only provided to show the correct syntax');
                    console.log('');

                    return false;
                }
            } else {
                console.log('publicKey was not available....');
                console.log('');
                console.log('please add a key to the following locations:');
                console.log('certs/jwks.json');
                console.log('.well-known/jwks.json');
                console.log('');
                console.log('should look something like the following,');
                console.log('using ES256 algorithm and DEF zip format:')
                console.log('{');
                console.log('  "keys": [');
                console.log('    {');
                console.log('      "kty": "EC",');
                console.log('      "use": "sig",');
                console.log('      "crv": "P-256",');
                console.log('      "kid": "yRwxp3sb7ldqlbGcw42zkcamMCo_9QZqUqKR6ZFQtH8",');
                console.log('      "x": "ivxR4CWtrm4B0D4Bqbg3gnlQO6SuzF-VFZ66D44IDLA",');
                console.log('      "y": "T6EdDPqwz9sIBrTXaR0KTFlbQsmdCbV4ZpObVo_80MY",');
                console.log('      "alg": "ES256"');
                console.log('    }');
                console.log('  ]');
                console.log('}');
                console.log('');
                console.log('the above key has been mangled, and is only provided to show the correct syntax');
                console.log('');
                return false;    
            }
        } else {
            console.log('privatePem was not available....');
            console.log('');
            console.log('please add a key to the following locations:');
            console.log('certs/ec_private.pem');
            console.log('');
            console.log('should look something like the following:');
            console.log('-----BEGIN PRIVATE KEY-----');
            console.log('MEECAQAwEwYKKoZIzjwCAQYIKoZIzj0DAQcEJzAlAgEBBCCGnb8hUos2FdRkKrPf');
            console.log('xMGenh8eqwyr51XDEM4GdO1Fgg==');
            console.log('-----END PRIVATE KEY-----');
            console.log('');
            console.log('the above key has been mangled, and is only provided to show the correct syntax');
            console.log('');

            return false;
        }
    },
    parseHealthCard: async function(healthCardToken){
        check(healthCardToken, String);
        console.log('==============================================================================')
        console.log('parseHealthCard().healthCardToken', healthCardToken)

        let json_web_signature = decodeNumeric(healthCardToken);
        console.log('parseHealthCard().json_web_signature', json_web_signature);

        let dataPayload = Meteor.call('verifyHealthCard', json_web_signature);
        console.log('parseHealthCard().dataPayload', dataPayload)

        return dataPayload;
    },
    verifyHealthCard: async function(json_web_signature){
        check(json_web_signature, String);
        console.log('');
        console.log('================VERIFYING SIGNATURE=======================')
        console.log('');

        console.log(json_web_signature)

        console.log('')     
        console.log('------------Decoded Signature-----------------------------')     
        console.log('')

        // // quality control check
        // // can disable later
        var decoded = jws.decode(json_web_signature);
        console.log(decoded);

        console.log('')
        console.log('-------------Is Verified----------------------------------')
        console.log('')

        // let isVerified = jws.verify(json_web_signature, 'ES256', privatePem);
        let isVerified = jws.verify(json_web_signature, 'ES256', jwkToPem(publicKey));
        console.log(isVerified ? "YES" : "NO")   

        console.log('')
        console.log('------------JWS Parts-------------------------------------')
        console.log('')


        const parts = json_web_signature.split('.');
        console.log(parts)

        console.log('')
        console.log('------------JWS Payload-----------------------------------')
        console.log('')

        const rawPayload = parts[1].trim();
        console.log(rawPayload);

        
        // console.log('')
        // console.log('------------Payload Buffer--------------------------------')    
        // console.log('')

        // // // per Matt Printz
        // let buffer_from_payload = Buffer.from(rawPayload);
        // console.log(buffer_from_payload);

        console.log('')
        console.log('---------**-Payload Buffer (from base64)-**---------------')    
        console.log('')

        
        let buffer_from_base64_payload = Buffer.from(rawPayload, 'base64');
        console.log(buffer_from_base64_payload);


        // console.log('')
        // console.log('------------Payload Buffer (atob)---------------------------')    
        // console.log('')

        // // // per Matt Printz
        // let buffer_from_atob_payload = Buffer.from(atob(rawPayload));
        // console.log(buffer_from_atob_payload);

        // console.log('')
        // console.log('------------Payload Buffer (from base64, atob)------------------')    
        // console.log('')

        
        // let buffer_from_base64_atob_payload = Buffer.from(atob(rawPayload), 'base64');
        // console.log(buffer_from_base64_atob_payload);


        // console.log('')
        // console.log('------------Payload Buffer (btoa)---------------------------')    
        // console.log('')

        // // // per Matt Printz
        // let buffer_from_btoa_payload = Buffer.from(btoa(rawPayload));
        // console.log(buffer_from_btoa_payload);

        // console.log('')
        // console.log('------------Payload Buffer (from base64, btoa)------------------')    
        // console.log('')

        
        // let buffer_from_base64_btoa_payload = Buffer.from(btoa(rawPayload), 'base64');
        // console.log(buffer_from_base64_btoa_payload);



        console.log('')
        console.log('------------Decompressed Payload--------------------------')
        console.log('')

            
        const decompressed = zlib.inflateRawSync(buffer_from_base64_payload);    
        const decompressed_string = decompressed.toString('utf8')      
        console.log(decompressed_string); 

        return decompressed_string;
    },
    decodeHealthCard: async function(json_web_signature){
        check(json_web_signature, String);
        console.log('================DECODE HEALTHCARD==========================')
        
        console.log(json_web_signature)

        console.log('')
        console.log('------------JWS Payload-----------------------------------')
        console.log('')

        const parts = json_web_signature.split('.');
        const rawPayload = parts[1].trim();
        console.log(rawPayload)

        console.log('')
        // console.log('------------Payload Buffer (atob, base64)-----------------')
        console.log('------------Payload Buffer (atob)-----------------')
        console.log('')

        // per Matt Printz
        // let buffer_from_base64_payload_atob = Buffer.from(rawPayload_atob);
        let buffer_from_base64_payload_atob = Buffer.from(rawPayload_atob, 'base64');
        console.log(buffer_from_base64_payload_atob);

        console.log('')
        console.log('------------Decompressed Payload--------------------------')
        console.log('')
        
        const decompressed = zlib.inflateRawSync(buffer_from_base64_payload_atob);    
        // const decompressed = InflateAuto.inflateAutoSync(buffer_from_base64_payload_atob);    
        const decompressed_string = decompressed.toString('utf8')      
        console.log(decompressed_string); 

    return decompressed_string;
    }
});