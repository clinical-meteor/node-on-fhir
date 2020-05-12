Package.describe({
  name: 'symptomatic:saner',
  version: '0.5.0',
  summary: 'Symptomatic SANER package with vault server, data management, etc.',
  git: 'https://github.com/symptomatic/saner',
  documentation: 'README.md'
});


Package.onUse(function(api) {
  api.versionsFrom('1.4');
  
  api.use('meteor-base@1.4.0');
  api.use('ecmascript@0.13.0');
  api.use('react-meteor-data@0.2.15');
  api.use('session');
  api.use('mongo');
  api.use('http');
  api.use('ejson');
  api.use('random');
  api.use('fourseven:scss');

  api.addFiles('lib/Collections.js');
  api.addFiles('lib/Methods.js');

  api.use('symptomatic:covid19-on-fhir');
  api.use('symptomatic:covid19-geomapping');

  api.use('symptomatic:data-management');
  api.use('symptomatic:fhir-uscore');
  api.use('symptomatic:vault-server');

  api.use('symptomatic:vault-server@6.1.0');
  api.use('clinical:hl7-fhir-data-infrastructure@6.4.17');
  api.imply('symptomatic:vault-server@6.1.0');

  api.addAssets('geodata/health_service_areas.geojson', 'client');
  api.addAssets('geodata/health_service_areas_detailed.geojson', 'client');
  api.addAssets('geodata/health_referral_region_merged.geojson', 'client');
  
  api.mainModule('index.jsx', 'client');
});


Npm.depends({
  "google-map-react":"1.1.7"
});