import React, { Component, useState, useEffect } from 'react';

import StyledCard from '../components/StyledCard';
import { 
  CssBaseline,
  Grid, 
  Button,
  Container,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tab, 
  Tabs 
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import { FaGithub } from 'react-icons/fa';


const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1),
  }
}));


function MainPage(props){
  const classes = useStyles();

  return (
    <div id='MainPage'>
      <Container>
        <StyledCard>
          <div style={{width: '100%', textAlign: 'center'}}>
            <img src='/node-on-fhir-logo.png' style={{width: '600px'}} />
          </div>
          <CardHeader title="Node on FHIR" />
          <CardContent>
            <p>
              Welcome to Node on FHIR.  This code repository contains a reference FHIR server and web application stack written in modern ES6/Typescript/Javascript/Node that can compile to mobile devices.  We have gone through the NPM repository, and tried to pull in as many FHIR related libraries as we could in order to find the 'center' of the Javascript FHIR community.  
            </p>
            <p>
              This project is an offshoot of the Meteor on FHIR project, which developed a Javascript based FHIR application stack about 4 years ago.  A the time, we chose Meteor.js, a full-stack application framework that used websockets as it's transportation mechanism with pub/sub functionality, because it had good support for clinician worklists use cases.  Over time, we saw some limitations with the default Meteor tech stack, but were quite pleased with the Meteor compiler.  Eventually, we decided to do a soft fork of the Meteor project, and set up our own release track and began replacing the websocket/data-distribution-protocol with more standard OAuth/REST interfaces.  We also were tracking many of the latest developments in the Javascript community, such as the release of React, EcmaScript 6, and Typescript.  With the help of the Meteor Development Group, we were able to upgrade the default reference build to include best practices from across the Javascript ecosystem.   
            </p>
            <p>
              The following reference build is the result of 5 years of work; 70+ prototypes and pilots, the result of a million+ quality control tests, and the contributions of dozens of different organizations, ranging from big tech companies (Google, Facebook) and javascript specific projects (Meteor, Material UI) to healthcare specific companies (HL7, Vermonster, Asymmetrik, SmartHealthIT, etc).   It represents a rich combination of functionality that is difficult to be found anywhere else, particularly in it's support of mobile applications and blockchain.    
            </p>

            <CardHeader title="FHIR Libraries" />

            <Table size="small" >
              <TableHead>
                <TableRow >
                  <TableCell style={{fontWeight: 'bold'}} >Feature</TableCell>
                  <TableCell style={{fontWeight: 'bold'}} >Library</TableCell>
                  <TableCell style={{fontWeight: 'bold'}} >Vendor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                <TableCell>FHIR Client with modern ES6 classes, cross-version support, SMART, testing, and more.  </TableCell>
                  <TableCell>fhir-kit-client</TableCell>
                  <TableCell>Vermonster</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>FHIR Client from the developers of the SMART specification.</TableCell>
                  <TableCell>fhirclient</TableCell>
                  <TableCell>smarthealthit</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>FHIR Client from the community with good Angular, jQuery, and YUI support.</TableCell>
                  <TableCell>fhir.js</TableCell>
                  <TableCell>FHIR Community / Aidbox</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Node FHIR Server</TableCell>
                  <TableCell>node-fhir-server-core</TableCell>
                  <TableCell>Asymmetrik</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Typescript definitions</TableCell>
                  <TableCell>ts-fhir-types</TableCell>
                  <TableCell>Ahryman40k</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Blue Button to FHIR DSTU2 converter</TableCell>
                  <TableCell>blue-button-fhir</TableCell>
                  <TableCell>Amida Technology Solutions</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>FHIRPath parser</TableCell>
                  <TableCell>fhirpath</TableCell>
                  <TableCell>HL7</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>FHIR validator for R4</TableCell>
                  <TableCell>json-schema-resource-validation</TableCell>
                  <TableCell>VictorGus</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Utilities to check SMART on FHIR scope access</TableCell>
                  <TableCell>sof-scope-checker</TableCell>
                  <TableCell>Asymmetrik</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Utilities for extracting addresses</TableCell>
                  <TableCell>fhir-list-addresses</TableCell>
                  <TableCell>careMESH</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Utilities to hydrate argonaut form data into FHIR objects</TableCell>
                  <TableCell>fhir-helpers</TableCell>
                  <TableCell>jackruss</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Utilities to hydrate argonaut form data into FHIR objects</TableCell>
                  <TableCell>fhir-helpers</TableCell>
                  <TableCell>jackruss</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>HL7 v2 parser, serializer, validator and tcp client/server for NodeJS</TableCell>
                  <TableCell>hl7v2</TableCell>
                  <TableCell>panates</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>HL7v2 parser/generator from Redox.  Battle tested.</TableCell>
                  <TableCell>redox-hl7-v2</TableCell>
                  <TableCell>Redox</TableCell>
                  </TableRow>
              </TableBody>
            </Table>

            <br />
            <br />
            <CardHeader title="Features" />

            <Table size="small" >
              <TableHead>
                <TableRow >
                  <TableCell style={{fontWeight: 'bold'}} >Feature</TableCell>
                  <TableCell style={{fontWeight: 'bold'}} >Library</TableCell>
                  <TableCell style={{fontWeight: 'bold'}} >Vendor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Material Design</TableCell>
                  <TableCell>material-ui</TableCell>
                  <TableCell>Google; CallEmAll</TableCell>                  
                </TableRow>
                <TableRow>
                  <TableCell>Modular Reusable Components</TableCell>
                  <TableCell>react</TableCell>
                  <TableCell>Facebook</TableCell>                  
                </TableRow>
                <TableRow>
                  <TableCell>DevOps Logging</TableCell>
                  <TableCell>winston/TableCell</TableCell>
                  <TableCell></TableCell>                  
                </TableRow>
                <TableRow>
                  <TableCell>Icons, Fonts, & Typography</TableCell>
                  <TableCell>react-icons</TableCell>
                  <TableCell></TableCell>                  
                </TableRow>
                <TableRow>
                  <TableCell>Search Engine Optimization</TableCell>
                  <TableCell></TableCell>
                  <TableCell>Google</TableCell>                  
                </TableRow>
                <TableRow>
                  <TableCell>Social Media Metadata</TableCell>
                  <TableCell></TableCell>
                  <TableCell>Facebook, Twitter</TableCell>                  
                </TableRow>
                <TableRow>
                  <TableCell>Multitenant Design</TableCell>
                  <TableCell>meteorjs</TableCell>
                  <TableCell>Meteor Development Group</TableCell>                  
                </TableRow>
                <TableRow>
                  <TableCell>A/B Testing Infrastructure</TableCell>
                  <TableCell>meteorjs</TableCell>
                  <TableCell>Meteor Development Group</TableCell>                  
                </TableRow>
                <TableRow>
                  <TableCell>Distributed Mongo</TableCell>
                  <TableCell>minimongo</TableCell>
                  <TableCell>Meteor Development Group</TableCell>                  
                </TableRow>
                <TableRow>
                  <TableCell>Document Database</TableCell>
                  <TableCell>mongo</TableCell>
                  <TableCell>Mongo</TableCell>                  
                </TableRow>
                <TableRow>
                  <TableCell>Mesh Networking</TableCell>
                  <TableCell>ipfs</TableCell>
                  <TableCell>Interplanetary File System</TableCell>                  
                </TableRow>
                <TableRow>
                  <TableCell>Peer to Peer File Transfer</TableCell>
                  <TableCell>webtorrent</TableCell>
                  <TableCell>Web Torrent</TableCell>                  
                </TableRow>
                
              </TableBody>
            </Table>

            <br />
            <br />
            <div style={{width: '100%', textAlign: 'center'}}>
            <Button variant="contained" color="primary" className={classes.button} href="https://github.com/symptomatic/node-on-fhir" >
              <FaGithub style={{fontSize: '150%'}} /> <CardHeader title="Download the Code" />
            </Button>

            </div>

            


            {/* <CardHeader title="Acknowledgements" />
            <ul>
              <li><b>HL7</b></li>
              <li><b>AidBox</b></li>
              <li><b>Asymmetrik</b></li>
            </ul> */}
          </CardContent>
        </StyledCard>
        <br />
        <br />
        <br />
        <br />
        <br />
      </Container>
    </div>
  );
}

export default MainPage;