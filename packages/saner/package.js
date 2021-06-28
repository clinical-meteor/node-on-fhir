Package.describe({
  name: 'symptomatic:saner',
  version: '0.6.3',
  summary: 'Symptomatic SANER package with vault server, data management, etc.',
  git: 'https://github.com/symptomatic/saner',
  documentation: 'README.md'
});


Package.onUse(function(api) {
  api.versionsFrom('1.4');
  
  api.use('meteor-base@1.4.0');
  api.use('ecmascript@0.13.0');
  api.use('react-meteor-data@2.1.2');
  api.use('session');
  api.use('mongo');
  api.use('http');
  api.use('ejson');
  api.use('random');
  api.use('fourseven:scss');
  api.use('simple:json-routes@2.1.0')
  api.use('percolate:synced-cron@1.3.2');

  api.addFiles('lib/Collections.js');
  api.addFiles('lib/Methods.js');

  api.addFiles('server/methods.js', "server");
  api.addFiles('server/cron.js', "server");
  api.addFiles('server/rest.js', "server");

  // api.use('symptomatic:data-management');
  // api.use('symptomatic:covid19-on-fhir');
  // api.use('symptomatic:covid19-geomapping@0.4.10');
  // api.use('symptomatic:covid19-saner');  
  // api.use('symptomatic:fhir-uscore');
  // api.use('symptomatic:vault-server');
  
  api.use('clinical:hl7-fhir-data-infrastructure');
  api.use('symptomatic:covid19-geomapping');

  api.use('symptomatic:vault-server@6.2.0');
  api.imply('symptomatic:vault-server@6.2.0');

  api.addAssets('geodata/health_service_areas.geojson', 'client');
  api.addAssets('geodata/health_service_areas_detailed.geojson', 'client');
  api.addAssets('geodata/health_referral_region_merged.geojson', 'client');

  api.addAssets('data/locations/CVS-Covid19-TestingLocations-20200731.csv', 'server');  
  api.addAssets('data/locations/Walgreens-Covid19-TestingLocatinos-20200816.csv', 'server');  
  api.addAssets('data/locations/eTrueNorth-Covid19-TestingLocations-20200816.csv', 'server');  
  api.addAssets('data/locations/Kroger-Covid19-TestingLocations-20200816.csv', 'server');  
  api.addAssets('data/locations/QuestWalmart-FreeCovid19-TestingLocations-20200816.csv', 'server');  
  api.addAssets('data/locations/RiteAid-Covid19-TestingLocations-20200816.csv', 'server');  

  api.addFiles('assets/SocialMedia.jpg', "client", {isAsset: true});

  api.export('LeaderboardLocations', 'client');
  api.export('ReportingLocations', 'client');
  api.export('ReportingOrganizations', 'client');
  api.export('GeojsonLayers', 'client');
  api.export('LocationsHistory', ['client', 'server']);
  api.export('TestingSiteLocations', ['client', 'server']);
  api.export('TestingSiteLocations_Quickload', ['client', 'server']);

  

  api.mainModule('index.jsx', 'client');
});


Npm.depends({
  "@nivo/bar": "0.62.0",
  "google-map-react":"2.1.9",
  "papaparse": "5.2.0",
  "parse-address": "1.1.2",
  "haversine-calculator": "1.0.3"
});