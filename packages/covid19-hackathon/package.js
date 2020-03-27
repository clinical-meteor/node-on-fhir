Package.describe({
    name: 'symptomatic:covid19-hackathon',
    version: '0.2.25',
    summary: 'COVID19 Hackathon',
    git: 'https://github.com/symptomatic/covid19-hackathon',
    documentation: 'README.md'
});
  

Package.onUse(function(api) {
    api.versionsFrom('1.4');
    
    api.use('meteor-base@1.4.0');
    api.use('ecmascript@0.13.0');
    api.use('react-meteor-data@0.2.15');
    api.use('session');
    api.use('mongo');
    api.use('fourseven:scss');

    api.use('clinical:hl7-fhir-data-infrastructure@6.2.0')

    api.addFiles('lib/TestingMethods.js');
    api.addFiles('server/ProxyMethods.js', 'server');

    api.mainModule('index.jsx', 'client');
});

