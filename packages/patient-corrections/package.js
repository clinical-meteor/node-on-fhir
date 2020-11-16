Package.describe({
    name: 'symptomatic:patient-corrections',
    version: '0.3.1',
    summary: 'Implementation of the HL7 Patient Empowerment implementation guide for Patient Corrections',
    git: 'https://github.com/symptomatic/patient-corrections',
    documentation: 'README.md'
});
  
Package.onUse(function(api) {
    api.versionsFrom('1.4');
    
    api.use('meteor-base@1.4.0');
    api.use('ecmascript@0.13.0');
    api.use('react-meteor-data@0.2.15');
    api.use('session');
    api.use('mongo');
     
    api.use('clinical:hl7-fhir-data-infrastructure@6.7.2');
    
    api.addFiles('lib/Collections.js', ['client', 'server']);

    api.mainModule('index.jsx', 'client');
});


// Npm.depends({

// });