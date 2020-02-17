Package.describe({
    name: 'symptomatic:example-plugin',
    version: '0.2.7',
    summary: 'Example Symptomatic plugin, with dynamic routes and UI elements.',
    git: 'https://github.com/symptomatic/example-plugin',
    documentation: 'README.md'
});
  
Package.onUse(function(api) {
    api.versionsFrom('1.4');
    
    api.use('meteor-base@1.4.0');
    api.use('ecmascript@0.13.0');

    api.use('react-meteor-data@0.2.15');
    api.use('session');
    api.use('mongo');  

    api.use('clinical:hl7-fhir-data-infrastructure');

    // api.addFiles('assets/NodeOnFhir-ComponentRendering.png', 'client', {isAsset: true});
    // api.addFiles('assets/NodeOnFhir-RecommendedCodingArea.png', 'client', {isAsset: true});

    api.addFiles('assets/NodeOnFhir-BuildPipeline.png', 'client', {isAsset: true});
    api.addFiles('assets/NodeOnFhir-DataStores.png', 'client', {isAsset: true});
    api.addFiles('assets/NodeOnFhir-DirectoryStructure.png', 'client', {isAsset: true});
    api.addFiles('assets/NodeOnFhir-IsomorphicCode.png', 'client', {isAsset: true});
    api.addFiles('assets/NodeOnFhir-Licensing.png', 'client', {isAsset: true});
    api.addFiles('assets/NodeOnFhir-RefactorPaths.png', 'client', {isAsset: true});
    api.addFiles('assets/NodeOnFhir-StateManagement.png', 'client', {isAsset: true});
    api.addFiles('assets/NodeOnFhir-FhirComponents.png', 'client', {isAsset: true});
    
    api.mainModule('index.jsx', 'client');
});



Npm.depends({
  "moment": "2.22.2",
  "lodash": "4.17.13",
  "material-fhir-ui": "0.9.26",
  "react-icons-kit": "1.3.1"
});