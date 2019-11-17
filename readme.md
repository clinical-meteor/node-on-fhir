## Node on FHIR  

Welcome to Node on FHIR.  This code repository contains a reference FHIR server and web application stack written in modern ES6/Typescript/Javascript/Node that can compile to mobile devices.  We have gone through the NPM repository, and tried to pull in as many FHIR related libraries as we could in order to find the 'center' of the Javascript FHIR community.  

This project is an offshoot of the Meteor on FHIR project, which developed a Javascript based FHIR application stack about 4 years ago.  A the time, we chose Meteor.js, a full-stack application framework that used websockets as it's transportation mechanism with pub/sub functionality, because it had good support for clinician worklists use cases.  Over time, we saw some limitations with the default Meteor tech stack, but were quite pleased with the Meteor compiler.  Eventually, we decided to do a soft fork of the Meteor project, and set up our own release track and began replacing the websocket/data-distribution-protocol with more standard OAuth/REST interfaces.  We also were tracking many of the latest developments in the Javascript community, such as the release of React, EcmaScript 6, and Typescript.  With the help of the Meteor Development Group, we were able to upgrade the default reference build to include best practices from across the Javascript ecosystem.   

The following reference build is the result of 5 years of work; 70+ prototypes and pilots, the result of a million+ quality control tests, and the contributions of dozens of different organizations, ranging from big tech companies (Google, Facebook) and javascript specific projects (Meteor, Material UI) to healthcare specific companies (HL7, Vermonster, Asymmetrik, SmartHealthIT, etc).   It represents a rich combination of functionality that is difficult to be found anywhere else, particularly in it's support of mobile applications and blockchain.  


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


## Getting Started  
```
# install the meteor compiler; this will take care of node, nvm, npm, yarn, etc.
# it will also set up debugging tools, a compiler build tool, etc
curl https://install.meteor.com/ | sh

# download the node-on-fhir application
git clone https://github.com/symptomatic/node-on-fhir  
cd node-on-fhir

# install dependencies
meteor yarn install

# run the application in local development mode
meteor run --settings configs/settings.nodeonfhir.json

# build and minifiy the application
meteor build --directory ../output

# run the node application  
cd ../output



```


## Settings 

**Meteor.settings.public.title**  
Used in multiple places in the application - header, logging, emails, tabs, etc.  

**Meteor.settings.public.theme**  
A meta-theme that manages colors, styles, and images for a half-dozen theme infrastructures used by different libraries in this stack.  Material UI has changed it's theme architecture over the years, and various data visualizations packages that we've used have their own theming.  This is just a centralized place to put all those different configs.

**Meteor.settings.public.theme.showVideoBackground**
Enables video background functionality.  For best results, set your card or paper background to an RGBA color with some amount of alpha channel, or at the very least set the opacity of the card to something less than 1.    

**Meteor.settings.public.theme.darkroomTextEnabled**
Deprecated.  Set palette colors instead.

**Meteor.settings.public.theme.defaultVideo**
Default video used in background.

**Meteor.settings.public.theme.backgroundImagePath**
URL of the image to display in the background.  If an absolute URL is set, make sure that that network connectivity is available and the resource is available.  If a relative URL is set, it will be relative to the /public directory.  

**Meteor.settings.public.theme.palette**
Color palette to use throughout the application.

**Meteor.settings.public.home**
Mostly deprecated.  

**Meteor.settings.public.defaults**
Default behavior for the application.  

**Meteor.settings.public.defaults.route**
The default URL that the application will route to when you visit the site, login, etc.  

**Meteor.settings.public.defaults.displayNavbars**

**Meteor.settings.public.defaults.disableHeader**

**Meteor.settings.public.defaults.disableFooter**

**Meteor.settings.public.defaults.paginationLimit**

**Meteor.settings.public.defaults.subscriptionLimit**

**Meteor.settings.public.defaults.sidebar**

**Meteor.settings.public.defaults.sidebar.menuItems**

**Meteor.settings.public.defaults.sidebar.menuItems.HomePage**

**Meteor.settings.public.defaults.sidebar.menuItems.FhirResources**

**Meteor.settings.public.defaults.sidebar.menuItems.DynamicModules**

**Meteor.settings.public.defaults.sidebar.hidden**

**Meteor.settings.public.interfaces**

**Meteor.settings.public.meshNetwork**

**Meteor.settings.public.modules**

**Meteor.settings.public.apps**

**Meteor.settings.public.fhir**

**Meteor.settings.private**


## Deployment  
Lorem ipsum...

## Contributing  
Lorem ipsum...
