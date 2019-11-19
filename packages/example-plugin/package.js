Package.describe({
    name: 'symptomatic:example-plugin',
    version: '0.2.0',
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

    api.mainModule('index.jsx', 'client');
});



Npm.depends({
    "moment": "2.20.1",
    "lodash": "4.17.4",
    "react-icons": "3.8.0"
});