import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { FhirUtilities } from 'fhir-starter';

import { get, set, unset, has, pick, cloneDeep } from 'lodash';
import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';

import { Patients, Practitioners } from 'meteor/clinical:hl7-fhir-data-infrastructure';
import { HipaaLogger } from 'meteor/clinical:hipaa-logger';
import moment from 'moment';

const smart = require("fhirclient");
const Session = require("./Session");

import { oauth2 as SMART } from "fhirclient";

// var session = require('express-session')




// This is our storage factory function. It will be called with request and response and is
// expected to return a storage object that implements the basic storage interface found at
// https://github.com/smart-on-fhir/client-js/blob/master/src/ServerStorage.js
function getStorage({ request, response }) {
    const session = Session.fromRequest(request) || new Session();
    response.setHeader("Set-Cookie", session.cookie);
    return session;
}

// Just a simple function to reply back with some data (the current patient if
// we know who he is, or all patients otherwise
async function smartHandler(client, res) {
    const data = await (client.patient.id
        ? client.patient.read()
        : client.request("Patient"));
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify(data, null, 4));
}

// JsonRoutes.Middleware.use(session({
//     secret: 'laksdjflanglsdjkdjfkjdfd',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }
//   }));

JsonRoutes.setResponseHeaders({
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Header": "*",
    "Access-Control-Allow-Origin": "*"
})


JsonRoutes.add('get', '/node-launch', function (req, res, next) {
    console.log('SmartRelay: POST /node-launch req.headers', req.headers);
    console.log('SmartRelay: POST /node-launch req.query', req.query);
    console.log('SmartRelay: POST /node-launch req.params', req.params);
    console.log('SmartRelay: POST /node-launch req.body', req.body);

    let interceptedReq = cloneDeep(req);
    set(interceptedReq, 'headers.Access-Control-Allow-Origin', '*')
    set(interceptedReq, 'headers.access-control-allow-origin', '*')

    

    if(get(interceptedReq, 'headers.x-forwarded-host') === "localhost:3000"){
        set(interceptedReq, 'headers.x-forwarded-host', 'localhost')
    }
    if(get(interceptedReq, 'headers.host') === "localhost:3000"){
        set(interceptedReq, 'headers.host', 'localhost')
    }
    if(get(interceptedReq, 'headers.origin') === "http://localhost:3000"){
        set(interceptedReq, 'headers.origin', 'http://localhost')
    }

    unset(interceptedReq, 'headers.x-forwarded-host');
    unset(interceptedReq, 'headers.x-forwarded-proto');
    unset(interceptedReq, 'headers.x-forwarded-port');
    unset(interceptedReq, 'headers.x-forwarded-for');
    unset(interceptedReq, 'headers.referer');

    console.log('interceptedReq', interceptedReq.headers);

    // res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    // res.setHeader("Access-Control-Allow-Headers", "*");
    // res.setHeader("Access-Control-Allow-Origin", "*");

    let smartConfig = {
        "client_id": get(req.query, "client_id"),
        "scope": get(req.query, "scope"),
        "redirect_uri": get(req.query, "redirect_uri"),
        "iss": get(req.query, "iss"),
        "response_type": "code"
    }

    console.log('SmartRelay.smartConfig', smartConfig)

    smart(interceptedReq, res, getStorage).authorize(smartConfig);

    // JsonRoutes.sendResult(res, {
    //     code: 200
    // });

    // next();
});



JsonRoutes.add('post', '/node-launch', function (req, res, next) {
    console.log('SmartRelay: POST /node-launch', req.headers);
    console.log('SmartRelay: POST /node-launch', req.query);
    console.log('SmartRelay: POST /node-launch', req.params);
    console.log('SmartRelay: POST /node-launch', req.body);

    let interceptedReq = cloneDeep(req);
    set(interceptedReq, 'headers.Access-Control-Allow-Origin', '*')
    set(interceptedReq, 'headers.access-control-allow-origin', '*')

    

    if(get(interceptedReq, 'headers.x-forwarded-host') === "localhost:3000"){
        set(interceptedReq, 'headers.x-forwarded-host', 'localhost')
    }
    if(get(interceptedReq, 'headers.host') === "localhost:3000"){
        set(interceptedReq, 'headers.host', 'localhost')
    }
    if(get(interceptedReq, 'headers.origin') === "http://localhost:3000"){
        set(interceptedReq, 'headers.origin', 'http://localhost')
    }

    unset(interceptedReq, 'headers.x-forwarded-host');
    unset(interceptedReq, 'headers.x-forwarded-proto');
    unset(interceptedReq, 'headers.x-forwarded-port');
    unset(interceptedReq, 'headers.x-forwarded-for');
    unset(interceptedReq, 'headers.referer');

    console.log('interceptedReq', interceptedReq.headers);

    // res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    // res.setHeader("Access-Control-Allow-Headers", "*");
    // res.setHeader("Access-Control-Allow-Origin", "*");

    smart(interceptedReq, res, getStorage).authorize({
        "client_id": get(req.body, "clientId"),
        "scope": get(req.body, "scope"),
        "redirect_uri": get(req.body, "redirectUri"),
        "iss": get(req.body, "iss")
    });

    // smart(req, res, getStorage).init({
    //     "client_id": get(req.body, "client_id"),
    //     "scope": get(req.body, "scope")
    // }).then(console.log).then(function(){
    //     JsonRoutes.sendResult(res, {
    //         code: 200
    //     });
    // }).catch(function(){
    //     console.log('something went wrong during SMART authorization')
    // });

    // let smartSettings = {
    //     "client_id": get(req.body, "clientId"),
    //     "scope": get(req.body, "scope")
    // }
    // console.log("SmartRelay.smartSettings", smartSettings)

    // smart(req, res, getStorage).init({
    //     "client_id": get(req.body, "clientId"),
    //     "scope": get(req.body, "scope")
    // }).then(console.log).then(function(){
    //     JsonRoutes.sendResult(res, {
    //         code: 200
    //     });
    // }).catch(function(){
    //     console.log('something went wrong during SMART authorization')
    // });

    // smart(interceptedReq, res, getStorage).init(smartSettings)
    //     .then(client => smartHandler(client, res))
    //     .catch(function(error){
    //         console.log('something went wrong during SMART authorization', error)
    //     });


    // next();
});

// JsonRoutes.add('post', '/node-launch', function (req, res, next) {
//     console.log('SmartRelay: POST /node-launch', req.headers);
//     console.log('SmartRelay: POST /node-launch', req.query);
//     console.log('SmartRelay: POST /node-launch', req.params);
//     console.log('SmartRelay: POST /node-launch', req.body);

//     let interceptedReq = cloneDeep(req);
//     set(interceptedReq, 'headers.Access-Control-Allow-Origin', '*')

//     if(get(interceptedReq, 'headers.x-forwarded-host') === "localhost:3000"){
//         set(interceptedReq, 'headers.x-forwarded-host', 'localhost')
//     }

//     unset(interceptedReq, 'headers.x-forwarded-host');
//     unset(interceptedReq, 'headers.x-forwarded-proto');
//     unset(interceptedReq, 'headers.x-forwarded-port');
//     unset(interceptedReq, 'headers.x-forwarded-for');
//     unset(interceptedReq, 'headers.referer');

//     console.log('interceptedReq', interceptedReq.headers);

//     // res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
//     // res.setHeader("Access-Control-Allow-Headers", "*");
//     // res.setHeader("Access-Control-Allow-Origin", "*");

//     // smart(interceptedReq, res, getStorage).authorize({
//     //     "client_id": get(req.body, "client_id"),
//     //     "scope": get(req.body, "scope")
//     // });

//     smart(req, res, getStorage).authorize({
//         "client_id": get(req.body, "client_id"),
//         "scope": get(req.body, "scope")
//     }).then(console.log).then(function(){
//         JsonRoutes.sendResult(res, {
//             code: 200
//         });
//     }).catch(function(){
//         console.log('something went wrong during SMART authorization')
//     });


//     // next();
// });


JsonRoutes.add('get', '/node-fhir-receiver', function (req, res, next) {
    console.log('SmartRelay: GET /node-fhir-receiver', req.headers);
    console.log('SmartRelay: GET /node-fhir-receiver', req.query);
    console.log('SmartRelay: GET /node-fhir-receiver', req.params);
    console.log('SmartRelay: GET /node-fhir-receiver', req.body);

    let interceptedReq = cloneDeep(req);
    set(interceptedReq, 'headers.Access-Control-Allow-Origin', '*')
    set(interceptedReq, 'headers.access-control-allow-origin', '*')

    if(get(interceptedReq, 'headers.x-forwarded-host') === "localhost:3000"){
        set(interceptedReq, 'headers.x-forwarded-host', 'localhost')
    }
    if(get(interceptedReq, 'headers.host') === "localhost:3000"){
        set(interceptedReq, 'headers.host', 'localhost')
    }
    if(get(interceptedReq, 'headers.origin') === "http://localhost:3000"){
        set(interceptedReq, 'headers.origin', 'http://localhost')
    }

    // res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Location', Meteor.absoluteUrl() + 'patient-chart');
    
    smart(interceptedReq, res, getStorage).ready()
        .then(function(client){
            return client.request("Patient/" + client.getPatientId())
        })
        .then(res.json)
        .then(console.log)
        .catch(res.json);

    // let redirectHeaders = { 'content-type': 'application/json', 'authorization': `Bearer ${token}`, 'cache-control': 'no-cache', 'Location': '/patient-chart'};

    JsonRoutes.sendResult(res, {
        code: 302
    });
    
    // next();
});

JsonRoutes.add('post', '/node-fhir-receiver', function (req, res, next) {
    console.log('SmartRelay: POST /node-fhir-receiver');

    JsonRoutes.sendResult(res, {
        code: 302
    });    
});


// Meteor.methods({
//     serverSmartAuthorization: function(options){
//         console.log("Initializing SMART authorization", options);

//         let smartSettings = {
//             "client_id": get(options, "clientId"),
//             "scope": get(options, "scope"),
//             "redirect_uri": get(options, "redirectUri"),
//         }
//         console.log("SmartRelay.smartSettings", smartSettings);


//         // using the HTTP library
//         let launchUrl = Meteor.absoluteUrl() + 'node-launch';
//         console.log('SmartLauncher.launchUrl', launchUrl);

//         HTTP.post(launchUrl, {
//           data: options,
//           params: {
//             "iss": get(options, "iss")
//           }
//         }, function(error, result){
//           if(error){console.log('SmartLauncher.serverSmartAuthorization.error', error)}
//           if(result){console.log('SmartLauncher.serverSmartAuthorization.result', result)}
//         })

//         // SMART.authorize(smartSettings);

//     }
// })