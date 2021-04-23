## Node on FHIR  

![https://github.com/symptomatic/node-on-fhir/blob/development/public/node-on-fhir-logo.png](https://github.com/symptomatic/node-on-fhir/blob/development/public/node-on-fhir-logo-thin.png)

[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/3466/badge)](https://bestpractices.coreinfrastructure.org/projects/3466) [![StackShare](http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/awatson1978/node-on-fhir)  

[![CircleCI](https://circleci.com/gh/symptomatic/node-on-fhir.svg?style=svg)](https://circleci.com/gh/symptomatic/node-on-fhir)

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



## Quickstart

```bash
# install the meteor compiler; this will take care of node, nvm, npm, yarn, etc.
# it will also set up debugging tools, a compiler build tool, etc
curl https://install.meteor.com/ | sh

# download the node-on-fhir application
git clone https://github.com/symptomatic/node-on-fhir  
cd node-on-fhir

# install dependencies
meteor npm install

# alternative, use yarn if you'd like a more modern package manager
meteor yarn install

# run the application in local development mode
# this will automatically launch a mongo instance
meteor run --settings configs/settings.nodeonfhir.json  

# stop the application with Ctrl-C

# download custom packages
cd packages
git clone https://github.com/symptomatic/covid19-on-fhir
git clone https://github.com/symptomatic/vault-server-freemium
cd ..

# run the application again, using the config from the Covid19 on FHIR package, and using the Vault FHIR server
meteor run --settings packages/covid19-on-fhir/configs/settings.covid19.json  --extra-packages symptomatic:covid19-on-fhir,symptomatic:vault-server-freemium

# using a NEW TERMINAL (or the Postman utility)
# query the server metadata to view the conformance statement
curl http://localhost:3000/baseR4/metadata

# GET/POST data to the FHIR server
curl http://localhost:3000/baseR4/Patient
curl http://localhost:3000/baseR4/Organization
curl http://localhost:3000/baseR4/Observation

```

## Important Links    

- [Stack Share](https://stackshare.io/symptomatic-llc/node-on-fhir)  
- [License](https://github.com/symptomatic/node-on-fhir/blob/master/LICENSE.md)  
- [Installation](https://github.com/symptomatic/node-on-fhir/blob/master/INSTALLATION.md)  
- [Configuration Settings](https://github.com/symptomatic/node-on-fhir/blob/master/API.md)  
- [Plugin Architecture](http://localhost:3000/hello-world)  
- [Contributing](https://github.com/symptomatic/node-on-fhir/blob/master/CONTRIBUTING.md)  
- [Code of Conduct](https://github.com/symptomatic/node-on-fhir/blob/master/CODE_OF_CONDUCT.md)  
- [Community Bridge Funding](https://funding.communitybridge.org/projects/node-on-fhir)  
- [Quality Control](https://circleci.com/gh/symptomatic/node-on-fhir)  
- [Demo Page](https://node-on-fhir.meteorapp.com)  

## Stack Components  

![StackShare](https://raw.githubusercontent.com/symptomatic/node-on-fhir/development/docs/assets/StackShare.png)  

## References  
- [Notice of Proposed Rulemaking to Improve the Interoperability of Health Information](https://www.healthit.gov/topic/laws-regulation-and-policy/notice-proposed-rulemaking-improve-interoperability-health)  

