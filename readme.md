## Node on FHIR  

![https://github.com/symptomatic/node-on-fhir/blob/development/public/node-on-fhir-logo.png](https://github.com/symptomatic/node-on-fhir/blob/development/public/node-on-fhir-logo.png)

[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/3466/badge)](https://bestpractices.coreinfrastructure.org/projects/3466)  

Welcome to Node on FHIR.  This code repository contains a reference FHIR server and web application stack written in modern ES6/Typescript/Javascript/Node that can compile to mobile devices.  We have gone through the NPM repository, and tried to pull in as many FHIR related libraries as we could in order to find the 'center' of the Javascript FHIR community.  

This project is an offshoot of the [Meteor on FHIR](https://github.com/clinical-meteor/meteor-on-fhir) project, which developed a Javascript/Node based FHIR application stack about 4 years ago.  A the time, we chose Meteor.js, a full-stack application framework that used websockets as it's transportation mechanism with pub/sub functionality, because it had good support for clinician worklists use cases with a document oriented database and good support for data visualizations.  Over time, we saw some limitations with the default Meteor tech stack, particularly with the data distribution protocol and the Blaze rendering layer.  However, we've been quite pleased with the Meteor compiler and its support for mobile applications.  

Eventually, we decided to do a soft fork of the Meteor project, and set up our own release track and began replacing the websocket/data-distribution-protocol with more standard OAuth/REST interfaces.  We also were tracking many of the latest developments in the Javascript community, such as the release of React, EcmaScript 6, and Typescript and migrating our codebase forward.  With the help of the Meteor Development Group, we were able to upgrade the default reference build to include best practices from across the Javascript ecosystem.   

The following reference build is the result of 5 years of work; 70+ prototypes and pilots, the result of a million+ quality control tests, and the contributions of dozens of different organizations, ranging from big tech companies (Google, Facebook) and javascript specific projects (Meteor, Material UI) to healthcare specific companies (HL7, Vermonster, Asymmetrik, SmartHealthIT, etc).   It represents a rich combination of functionality that is difficult to be found anywhere else.

We've set this repository up as a GitHub template, so you can simply fork it and begin coding.  You'll find the example plugin can be compiled and published to NPM itself (as long as you don't add things like binaries that depend on specific platforms).  Importantly, you'll find all of our code to be isomorphic, meaning its the same modern ES6 code pattners on the client, server, and in the plugin packages.  


## Supported FHIR Libraries  

There's currently three (3) javascript client libraries in the NPM repository right now.  We have 

Library           | Vendor        | Description 
----------------- | ------------- | -------------
fhir-kit-client | Vermonster | Modern FHIR client with ES6, SMART, cross-version support, etc   
fhirclient | smarthealthit | The official SMART on FHIR javascript client  
fhir.js | FHIR Community | Community javascript client (good Angular support)  
ts-fhir-types | Ahryman40k | Typescript definitions   
blue-button-fhir | Amida Technology  | Blue Button to FHIR converter (DSTU2)  
node-fhir-server-core | Asymmetrik | Node FHIR Server  
sof-scope-checker | Asymmetrik | Utility to check SMART on FHIR scope access  
fhir-list-addresses | careMESH | Utility function for extracting addresses  
fhirpath | HL7 | The official FHIRPath parser  
json-schema-resource-validation | VictorGus | FHIR validator for R4  
fhir-helpers | jackruss  | Utilities to hydrate argonaut form data into FHIR objects  
hl7v2 | panates | HL7 v2 parser, serializer, validator and TCP client/server.
redox-hl7-v2 | Redox | This is Redox's battle-tested in-house HL7v2 parser/generator.  


## Features  

**Material Design** - Lorem ipsum...  
**Modular Reusable Components** - Lorem ipsum...  
**DevOps Logging** - Lorem ipsum...  
**Data Models** - Lorem ipsum...  
**Icons, Fonts & Typography** - Lorem ipsum...  
**Social Media Metadata** - Lorem ipsum...  
**Multitenant Design** - Lorem ipsum...  
**A/B Testing Infrastructure** - Lorem ipsum...  
**Distributed Mongo** - Lorem ipsum...  
**Mesh Networking** - Lorem ipsum...  
**Q/A Testing Examples** - Lorem ipsum...  
**Mobile Devices** - Lorem ipsum...  
**Desktop Applications** - Lorem ipsum...  
**HealthRecords** - Lorem ipsum...  
**Plugin Architecture** - Lorem ipsum...  
**Private Packages** - Lorem ipsum...  


## Quickstart

```bash
# install the meteor compiler; this will take care of node, nvm, npm, yarn, etc.
# it will also set up debugging tools, a compiler build tool, etc
curl https://install.meteor.com/ | sh

# download the node-on-fhir application
git clone https://github.com/symptomatic/node-on-fhir  
cd node-on-fhir

# install dependencies
meteor yarn install

# run the application in local development mode
# this will automatically launch a mongo instance
# you will want to create your own settings file 
# and a plugin if you have assets you want to keep private
meteor run --settings configs/settings.nodeonfhir.json  --extra-packages symptomatic:example-plugin

# build and minifiy the application
meteor add symptomatic:example-plugin
meteor build --directory ../output

# run the node application  
# warning!  we don't have a mongo instance yet
# you will need to specify a MONGO_URL

cd ../output
more README

cd programs/server 
npm install
export MONGO_URL='mongodb://user:password@host:port/databasename'
export ROOT_URL='http://example.com'
export METEOR_SETTINGS=`(cat configs/settings.nodeonfhir.json)`
node main.js

# or if you're looking for a one-liner
MONGO_URL='mongodb://user:password@host:port/databasename' PORT=4200 ROOT_URL=http://localhost METEOR_SETTINGS=`(cat ../../node-on-fhir/configs/settings.nodeonfhir.json)` node main.js
```


## Configurable Settings 

**public.title**  
Used in multiple places in the application - header, logging, emails, tabs, etc.  

**public.theme**   
A meta-theme that manages colors, styles, and images for a half-dozen theme infrastructures used by different libraries in this stack.  Material UI has changed it's theme architecture over the years, and various data visualizations packages that we've used have their own theming.  This is just a centralized place to put all those different configs.

**public.theme.showVideoBackground**  
Enables video background functionality.  For best results, set your card or paper background to an RGBA color with some amount of alpha channel, or at the very least set the opacity of the card to something less than 1.    

**public.theme.darkroomTextEnabled**  
Deprecated.  Set palette colors instead.

**public.theme.defaultVideo**  
Default video used in background.

**public.theme.backgroundImagePath**  
URL of the image to display in the background.  If an absolute URL is set, make sure that that network connectivity is available and the resource is available.  If a relative URL is set, it will be relative to the /public directory.  

**public.theme.palette**  
Color palette to use throughout the application.

**public.home**  
Mostly deprecated.  

**public.defaults**  
Default behavior for the application.  

**public.defaults.route**  
The default URL that the application will route to when you visit the site, login, etc.  

**public.defaults.disableHeader**  
Disables the header.  Generallyu used with `disableFooter` to achieve a full-page canvas affect.  Useful for full screen video applications or video games.  

**public.defaults.disableFooter**  
Disables the footer.  Most commonly used to create a traditional webpage view.  

**public.defaults.paginationLimit**  
Pagination limit is the maximum number of rows to display in a table.  After that number of rows, you need to press 'next' to get the next page of data.

**public.defaults.subscriptionLimit**  
Subscription limit is websocket pub/sub specific functionality, and limits the number of records that are returned in a publication.  

**public.defaults.sidebar**  
The sidebar is dynamically generated from the settings file and plugins/packages that are loaded into memory at application at runtime.  

**public.defaults.sidebar.menuItems**  
There are a number of default menu items that are available to most any application.  These include the HomePage, AboutPage, PrivacyPage, and such.  These page routes exist regardless of whether you have user interface that can navigate to them.  The settings file allows you to configure the sidebar so you can navigate to the various elements.


**public.defaults.sidebar.menuItems.HomePage**  
Include the HomePage button in the sidebar.  

**public.defaults.sidebar.menuItems.AboutPage**  
Include the AboutPage button in the sidebar.  

**public.defaults.sidebar.menuItems.PrivacyPage**  
Include the PrivacyPage button in the sidebar.  

**public.defaults.sidebar.menuItems.FhirResources**  
Include a button for each of the FHIR resources that is enabled for this application.  All of the FHIR resources will be grouped together in their own menu block.  

**public.defaults.sidebar.menuItems.DynamicModules**  
Dynamic modules are other buttons that exported from packages.  These are workflow specific menu options.  Anytime you want to create a dashboard, report, visualization, or other special user interface, you'll probably want to export a dynamic module.  

**public.defaults.sidebar.hidden**  
The settings file can override the default rendering of sidebar menu items, and hide items based on the page that they route to.  This may sound esoteric, but it works quite well.  

**public.interfaces.default**  
The default interface contains information on connecting to your FHIR server.  You can configure it to point at localhost or use `Meteor.absoluteUrl()` to create a traditional client/server architecture.  If you point to an external FHIR server, you are effectively reconfiguring the app to be be an application server.    

**public.meshNetwork**  
Previous versions had good success with WebRTC and IPFS pilots, and this reference build is intended to support various blockchains as a general purpose Distributed App (DApp) architecture.  

**public.meshNetwork.upstreamSync**  
The URL of the upstream IPFS or BitTorrent server.  
 
**public.meshNetwork.magnets**  
The magnet URLs or IPFS file hashes to sync.  

**public.meshNetwork.autosync**  
Automatically sync the listed magnets or hashes to the local data cursors.  

**public.modules**  
Modules are groups of functionalities, usually organized around FHIR resource definitions or by apps.  

**public.apps**  
The `apps` contains key to activate app functionality in packages.  It's generally user defineable and custom to your app or workflow.  

**public.fhir**  
The `fhir` object contains a key for each of the FHIR resource types.  When enabled, the Node on FHIR framework will activate functionality related to that resource.  These include:

- Creation of a database cursor
- Creation of a client side data cursor
- Registration of page route for that resource type 
- Creation of a page with basic Create/Read/Update/Delete functionality
- Registration of navigation buttons in the sidebar
- Rendering of navigation tiles in the FHIR Resource Index Page
- Creation of a REST endpoint
- Updating the CapabilityStatement

**private**  
Private settings don't get send to the client.  Private is server-only, and shouldn't be confused with server-side, because public settings are also available on the server.  

**private.secret**  
A tenent specific cryptographic hash to seed algorithms and otherwise use as a token or default password.

**private.disableOauth**  
Disables oauth, and sets all endpoints on the server to be publicly available.  

## Meteor.Settings 

The `configs` directory contains a number of .json settings file, which are used with the `meteor run --settings` command or the `METEOR_SETTINGS` environment variable.  Once loaded, they can be accessed from within the application by importing the `Meteor` object and inspecting `Meteor.settings`.  

```js
import { Meteor } from 'meteor/meteor';

Meteor.startup(function(){
  console.log(Meteor.settings);
})
```

