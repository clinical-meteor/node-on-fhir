## Node on FHIR  

Welcome to Node on FHIR.  This code repository contains a reference FHIR server and web application stack written in modern ES6/Typescript/Javascript/Node that can compile to mobile devices.  We have gone through the NPM repository, and tried to pull in as many FHIR related libraries as we could in order to find the 'center' of the Javascript FHIR community.  

This project is an offshoot of the Meteor on FHIR project, which developed a Javascript based FHIR application stack about 4 years ago.  A the time, we chose Meteor.js, a full-stack application framework that used websockets as it's transportation mechanism with pub/sub functionality, because it had good support for clinician worklists use cases.  Over time, we saw some limitations with the default Meteor tech stack, but were quite pleased with the Meteor compiler.  Eventually, we decided to do a soft fork of the Meteor project, and set up our own release track and began replacing the websocket/data-distribution-protocol with more standard OAuth/REST interfaces.  We also were tracking many of the latest developments in the Javascript community, such as the release of React, EcmaScript 6, and Typescript.  With the help of the Meteor Development Group, we were able to upgrade the default reference build to include best practices from across the Javascript ecosystem.   

The following reference build is the result of 5 years of work; 70+ prototypes and pilots, the result of a million+ quality control tests, and the contributions of dozens of different organizations, ranging from big tech companies (Google, Facebook) and javascript specific projects (Meteor, Material UI) to healthcare specific companies (HL7, Vermonster, Asymmetrik, SmartHealthIT, etc).   It represents a rich combination of functionality that is difficult to be found anywhere else, particularly in it's support of mobile applications and blockchain.  


## Supported FHIR Libraries  

There's currently three (3) javascript client libraries in the NPM repository right now.  We have 

Library           | Vendor        | Description 
----------------- | ------------- | -------------

fhir-kit-client | Vermonster | Modern FHIR client with ES6, SMART, cross-version support, and more.    
fhirclient | smarthealthit | The official SMART on FHIR javascript client  
fhir.js | FHIR Community / Aidbox | Community javascript client (good Angular support)  
ts-fhir-types | Ahryman40k | Typescript definitions   
blue-button-fhir | Amida Technology Solutions  | Blue Button to FHIR converter (DSTU2)  
node-fhir-server-core | Asymmetrik | Node FHIR Server  
sof-scope-checker | Asymmetrik | Utility to check SMART on FHIR scope access  
fhir-list-addresses | careMESH | Utility function for extracting addresses  
fhirpath | HL7 | The official FHIRPath parser  
json-schema-resource-validation | VictorGus | FHIR validator for R4  
fhir-helpers | jackruss  | Utilities to hydrate argonaut form data into FHIR objects  
hl7v2 | panates | HL7 v2 parser, serializer, validator and tcp client/server for NodeJS  
redox-hl7-v2 | Redox | This is Redox's battle-tested in-house HL7v2 parser/generator.  

