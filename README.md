## Node on FHIR  


[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/3466/badge)](https://bestpractices.coreinfrastructure.org/projects/3466) [![StackShare](http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/awatson1978/node-on-fhir)  
[![CircleCI](https://circleci.com/gh/symptomatic/node-on-fhir.svg?style=svg)](https://circleci.com/gh/symptomatic/node-on-fhir)

![NodeOnFHIR-Honeycomb2](https://user-images.githubusercontent.com/675910/143236128-33794cb2-c470-4196-b6af-37f44616c59d.png)



Welcome to Node on FHIR.  This code repository contains a reference FHIR server and web application stack written in modern ES6/Typescript/Javascript/Node that can compile to mobile devices.  We have gone through the NPM repository, and tried to pull in as many FHIR related libraries as we could in order to find the 'center' of the Javascript FHIR community.  

This project is an offshoot of the [Meteor on FHIR](https://github.com/clinical-meteor/meteor-on-fhir) project, which developed a Javascript/Node based FHIR application stack about 4 years ago.  A the time, we chose [Meteor.js](https://www.meteor.com/), a full-stack application framework that used websockets as it's transportation mechanism with pub/sub functionality, because it had good support for clinician worklists use cases with a document oriented database and good support for data visualizations.  Over time, we saw some limitations with the default Meteor tech stack, particularly with the data distribution protocol and the Blaze rendering layer.  However, we've been quite pleased with the Meteor compiler and its support for mobile applications.  

Eventually, we decided to do a soft fork of the Meteor project, and set up our own [release track](https://atmospherejs.com/?q=clinical), which involved publishing [100+ packages](https://github.com/clinical-meteor),  and began replacing the websocket/data-distribution-protocol with [HL7 compliant OAuth/REST interfaces](https://github.com/clinical-meteor/vault-server-freemium).  We also were tracking many of the latest developments in the Javascript community, such as the release of [React](https://reactjs.org/) and [EcmaScript 6](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/), and began migrating our codebase forward.  With the help of the Meteor Development Group, we were able to upgrade the default reference build to include best practices from across the Javascript ecosystem.   

This repository is set up as a GitHub template, so you can simply fork it and adjust the settings file.  Included is an example plugin which can be compiled and published to NPM itself.  Importantly, this repository uses isomorphic code, meaning its the same modern ES6 code pattners on the client, server, and in the plugin packages.  


## Supported FHIR Libraries  

The following FHIR libraries from the NPM repository have been validated to work with NodeOnFHIR.  

Library           | Vendor        | Description 
----------------- | ------------- | -------------
[fhirclient](https://www.npmjs.com/package/fhirclient) | smarthealthit | The official SMART on FHIR javascript client  
[fhir-kit-client](https://www.npmjs.com/package/fhir-kit-client) | Vermonster | Modern FHIR client with ES6, SMART, cross-version support, etc   
[fhir-starter](https://www.npmjs.com/package/fhir-starter) | symptomatic  | FhirUtilities, FhirDehydrator, and template FHIR UI components.
[fhir-react](https://www.npmjs.com/package/fhir-react) | 1uphealth | Multi use react component
[json-schema-resource-validation](https://www.npmjs.com/package/json-schema-resource-validation) | VictorGus | FHIR validator for R4  
[sof-scope-checker](https://www.npmjs.com/package/@asymmetrik/sof-scope-checker) | Asymmetrik | Utility to check SMART on FHIR scope access  
[fhirpath](https://www.npmjs.com/package/fhirpath) | HL7 | The official FHIRPath parser  
[is-fhir-date](https://www.npmjs.com/package/is-fhir-date) | HenrikJoreteg | Checks if a date is FHIR compliant
[ts-fhir-types](https://www.npmjs.com/package/@ahryman40k/ts-fhir-types) | Ahryman40k | Typescript definitions   
[fhir-list-addresses](https://www.npmjs.com/package/fhir-list-addresses) | careMESH | Utility function for extracting addresses  
[hl7v2](https://www.npmjs.com/package/hl7v2) | panates | HL7 v2 parser, serializer, validator and TCP client/server.
[redox-hl7-v2](https://www.npmjs.com/package/@redoxengine/redox-hl7-v2) | Redox | This is Redox's battle-tested in-house HL7v2 parser/generator.  

## Past Projects   

The FHIR appplication server in this repository is the result of 7 years of work; 100+ prototypes and pilots, the result of a million+ quality control tests, and the contributions of dozens of different organizations, ranging from big tech companies (Google Chrome, Facebook React) and javascript specific projects (Meteor, Material UI) to healthcare specific companies (HL7, Vermonster, Asymmetrik, SmartHealthIT, etc).   It represents a rich combination of functionality that is difficult to be found anywhere else.  It has been used to build personal health records, a longitudinal timeline that was published to the Apple App Store, patient charting software, clinical worklists, pharmacogenomics pipelines, medical imaging software, medical home hubs, and many more systems.  

![BuiltWithNodeOnFHIR](https://user-images.githubusercontent.com/675910/143202912-afa95edd-16a3-4093-a69d-485068573ce8.jpg)


## Quickstart

```bash
# install meter
npm install -g meteor

# get the boilerplate
git clone https://github.com/clinical-meteor/node-on-fhir

# get the vault-server package
cd node-on-fhir
cd packages
git clone https://github.com/clinical-meteor/vault-server
cd ../..

# install libraries and dependencies
npm install

# add custom packages (the FHIR server)
meteor add clinical:vault-server

# does it compile?
meteor run 
open http://localhost:3000

# can we get to the FHIR server yet?
open http://localhost:3000/metadata

# now run it with a custom settings file
meteor run --settings configs/settings.nodeonfhir.localhost.json

# does it run?  can we get to the FHIR server?  To the Patient route?
open http://localhost:3000/baseR4/metadata
open http://localhost:3000/baseR4/Patient
```

## Important Links    

- [License](https://github.com/symptomatic/node-on-fhir/blob/master/LICENSE.md)  
- [Change Log / Release History](https://github.com/symptomatic/node-on-fhir/releases)  
- [Installation](https://github.com/symptomatic/node-on-fhir/blob/master/INSTALLATION.md)  
- [Configuration Settings](https://github.com/symptomatic/node-on-fhir/blob/master/API.md)  
- [Meteor Guide](https://guide.meteor.com/) 
- [Getting Started with FHIR](https://www.hl7.org/fhir/modules.html). 
- [Software Development Kit](https://github.com/symptomatic/software-development-kit)  
- [Contributing](https://github.com/symptomatic/node-on-fhir/blob/master/CONTRIBUTING.md)  
- [Code of Conduct](https://github.com/symptomatic/node-on-fhir/blob/master/CODE_OF_CONDUCT.md)  
- [Community Bridge Funding](https://funding.communitybridge.org/projects/node-on-fhir)  
- [Quality Control](https://circleci.com/gh/symptomatic/node-on-fhir)  
- [Material UI](https://material-ui.com/store/) 
- [Example Plugin](https://github.com/clinical-meteor/example-plugin)   

## Technology Stack 

![StackShare](https://user-images.githubusercontent.com/675910/143241422-a9d13558-0665-4e87-8f25-8257b4fcd393.png)



## References  
- [Notice of Proposed Rulemaking to Improve the Interoperability of Health Information](https://www.healthit.gov/topic/laws-regulation-and-policy/notice-proposed-rulemaking-improve-interoperability-health)  
- [Inferno ONC Program Edition](https://inferno.healthit.gov/)  
 

