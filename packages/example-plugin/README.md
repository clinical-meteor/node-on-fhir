# symptomatic:example-plugin

This is an example plugin for Meteor on FHIR (and Symptomatic) that illustrates how to create a REST endpoint, database collection, server side publication, client side subscription, and a reactive user interface.  When implemented, you can ping the REST endpoint, and it will automatically update the user interface.  


#### Clone the Example Plugin      

```bash
# download the Meteor on FHIR Community Server
git clone http://github.com/symptomatic/meteor-on-fhir
cd webapp

# install the example plugin
git clone http://github.com/symptomatic/example-plugin packages/example-plugin

# run Meteor on FHIR Community Server using the example plugin
meteor run --settings configs/settings.greens.json --extra-packages symptomatic:example-plugin

# permanently add the example plugin to the project
meteor add clinical:example
```

#### Customize the Plugin      

```bash
# Step 1 - Rename package folder
packages/example-plugin

# Step 2 - Update package name, description
packages/my-plugin/package.js

# Step 3 - Customize the HelloWorld Page
packages/my-plugin/client/HelloWorldPage.jsx

# Step 4 - Update your routes if you wish
packages/my-plugin/index.jsx

# Step 5 - Edit the settings file; add custom route, etc.
packages/my-plugin/configs/settings.example.jsx
```


#### Run Meteor on FHIR with your plugin  

```bash
# add your package
meteor add foo:my-plugin
meteor npm install

# run with a custom settings file
meteor --settings packages/my-plugin/configs/settings.example.json
```

