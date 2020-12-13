Package.describe({
    name: 'symptomatic:patient-corrections',
    version: '0.3.2',
    summary: 'Implementation of the HL7 Patient Empowerment implementation guide for Patient Corrections',
    git: 'https://github.com/symptomatic/patient-corrections',
    documentation: 'README.md'
});
  
Package.onUse(function(api) {
    api.versionsFrom('1.4');
    
    api.use('meteor-base@1.4.0');
    api.use('ecmascript@0.13.0');
    api.use('react-meteor-data@2.1.2');
    api.use('session');
    api.use('mongo');
     
    api.use('clinical:hl7-fhir-data-infrastructure');
    api.use('symptomatic:data-management');
    api.use('symptomatic:fhir-uscore');
    
    api.addFiles('lib/Collections.js', ['client', 'server']);

    api.addFiles('server/main.js', ['server']);

    api.mainModule('index.jsx', 'client');
});


