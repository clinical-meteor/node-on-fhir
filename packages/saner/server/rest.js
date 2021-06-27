import { get, has } from 'lodash';
import moment from 'moment';


if(Package['browser-policy-common']){
    console.log('Configuring content-security-policy.');

    import { BrowserPolicy } from 'meteor/browser-policy-common';

    BrowserPolicy.content.allowConnectOrigin('http://localhost:3000');
    BrowserPolicy.content.allowConnectOrigin('ws://localhost:3000');
    BrowserPolicy.content.allowConnectOrigin('wss://localhost:3000');

    BrowserPolicy.content.allowConnectOrigin('https://vaccine-passport.symptomatic.us');
    BrowserPolicy.content.allowConnectOrigin('http://vaccine-passport.symptomatic.us');
    BrowserPolicy.content.allowConnectOrigin('https://vaccine-passport.symptomatic.io');
    BrowserPolicy.content.allowConnectOrigin('http://vaccine-passport.symptomatic.io');
};

JsonRoutes.add('get', '/latest-known-testing-locations', function(req, res, next) {
    console.log('GET /latest-known-testing-locations');

    console.log('GET /latest-known-testing-locations');

    let dataPayload = TestingSiteLocations.find().fetch();


    JsonRoutes.sendResult(res, {
        data: dataPayload
    });
});



// MAXIMUM SIZE EXCEEDED

// JsonRoutes.add('GET', '/daily-pandemic-map', function(req, res, next) {
//     console.log('GET /daily-pandemic-map');

//     console.log('GET /daily-pandemic-map');

//     // var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
//     // var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

//     JsonRoutes.sendResult(res, {
//         data: {
//             "LocationsHistory": LocationsHistory.find({'meta.versionId': get(Meteor, 'settings.public.saner.mainMapVersion')}).fetch() 
//         }
//     });
// });


JsonRoutes.add('GET', '/number-of-hsa-records-in-map', function(req, res, next) {
    console.log('GET /number-of-hsa-records-in-map');

    console.log('GET /number-of-hsa-records-in-map');

    // var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
    // var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

    JsonRoutes.sendResult(res, {
        data: {
            "hsaRecordCount": LocationsHistory.find({'meta.versionId': get(Meteor, 'settings.public.saner.mainMapVersion')}).count() 
        }
    });
});




JsonRoutes.add('GET', '/icu-capacity-at-my-location', function(req, res, next) {
    console.log('GET /icu-capacity-at-my-location', req.query);

    res.setHeader("Access-Control-Allow-Origin", "*");

    // Meteor.call('generateIcuCapacityMap', req.query, function(err, result){
    //     if(err){
    //         console.log('generateIcuCapacityMap.err', err)
    //     }
    //     if(result){
    //         console.log('generateIcuCapacityMap.result', result)
    //     }
    // })

    // var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
    // var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

    // let alabaster = LocationsHistory.findOne({_id: "7SrLFGa4bvEfteeNw"});
    // console.log('alabaster', alabaster);

    if(get(req.query, 'longitude') && get(req.query, 'latitude')){
        let searchLocation = {
            type: "Point",
            coordinates: [parseFloat(get(req.query, 'longitude')), parseFloat(get(req.query, 'latitude'))]
        }
        console.log('searchLocation', searchLocation);

        let currentLocationMatches = LocationsHistory.find({
            '_geometry': {$geoIntersects: {
                $geometry: searchLocation
            }}
        }).fetch()

        // // there appears to be a bug in the Mongo driver during $geoIntersects queries
        // // wherein fields that have an array type are being subsetting/pushed into the new array, instead of assigned

        // if(has(currentLocationMatch, 'identifier[0]')){
        //     currentLocationMatch.identifier = currentLocationMatch.identifier[0]
        // }
        // if(has(currentLocationMatch, 'extension[0]')){
        //     currentLocationMatch.extension = currentLocationMatch.extension[0]            
        // }
        delete currentLocationMatches[0]._document;

        console.log('currentLocationMatches', currentLocationMatches[0])
        console.log('currentLocationMatches.extension', currentLocationMatches[0].extension)

        let icuBedUtilization = null;
        if(Array.isArray(currentLocationMatches[0].extension)){
            console.log('Parsing through extensions...')
            currentLocationMatches[0].extension.forEach(function(extension){
                if(extension.url === "adult_icu_bed_utilization"){
                    icuBedUtilization = extension.valueDecimal;
                }
            });
        }
        console.log('icuBedUtilization', icuBedUtilization)

        JsonRoutes.sendResult(res, {
            code: 200,
            data: {
                query: req.query,
                adult_icu_bed_utilization: icuBedUtilization,
                location: searchLocation,
                locationMatch: currentLocationMatches[0]
            }
        });    
    } else {
        JsonRoutes.sendResult(res, {
            code: 400,
            data: {}
        });    
    }

});


