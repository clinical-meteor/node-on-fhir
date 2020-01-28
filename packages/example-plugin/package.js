Package.describe({
    name: 'symptomatic:example-plugin',
    version: '0.2.6',
    summary: 'Example Symptomatic plugin, with dynamic routes and UI elements.',
    git: 'https://github.com/symptomatic/example-plugin',
    documentation: 'README.md'
});
  
Package.onUse(function(api) {
    api.versionsFrom('1.4');
    
    api.use('meteor-base@1.4.0');
    api.use('ecmascript');
    api.use('react-meteor-data@0.2.15');
    api.use('session');
    api.use('mongo');  

    api.use('clinical:hl7-resource-patient@5.0.9');

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
    "material-fhir-ui": "0.8.22",
    "moment": "2.20.1",
    "lodash": "4.17.15",
    "react-icons": "3.8.0"
});