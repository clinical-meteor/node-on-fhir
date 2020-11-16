Package.describe({
    name: 'goinvo:synthea-directory-scan',
    version: '0.3.2',
    summary: 'Dashboard for Synthea analysis',
    git: 'https://github.com/symptomatic/synthea-directory-scan',
    documentation: 'README.md'
});
  
Package.onUse(function(api) {
    api.versionsFrom('1.4');
    
    api.use('meteor-base@1.4.0');
    api.use('ecmascript@0.13.0');
    api.use('react-meteor-data@2.1.2');
    api.use('session');
    api.use('mongo');
     
    api.use('clinical:hl7-fhir-data-infrastructure@6.7.3');

    api.addFiles('lib/MedicalRecordImporter.js', ['client', 'server']);

    api.mainModule('server/methods.js', 'server');
    api.mainModule('index.jsx', 'client');
});


Npm.depends({    
    "read-directory": "3.0.2"
})