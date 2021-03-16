Package.describe({
  name: 'oasys:big-data-infrastructure',
  version: '0.5.11',
  summary: 'OASYS integration package for Hadoop, Apache Spark, etc',
  git: 'https://github.com/symptomatic/oasys-big-data-infrastructure',
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

  // api.addFiles('server/methods.js', "server");

  // api.mainModule('index.jsx', 'client');
});
