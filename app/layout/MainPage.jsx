import React from 'react';

import { 
  Button,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Image
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { get } from 'lodash';
import { PageCanvas, StyledCard } from 'material-fhir-ui';

import { Icon } from 'react-icons-kit';
import { github } from 'react-icons-kit/fa/github';
import {lightbulbO} from 'react-icons-kit/fa/lightbulbO'
import {puzzlePiece} from 'react-icons-kit/fa/puzzlePiece'
import {map} from 'react-icons-kit/fa/map'
import {amazon} from 'react-icons-kit/fa/amazon'
import {lowVision} from 'react-icons-kit/fa/lowVision'
import {addressCard} from 'react-icons-kit/fa/addressCard'
import {pieChart} from 'react-icons-kit/fa/pieChart'
import {wechat} from 'react-icons-kit/fa/wechat'
import {filePdfO} from 'react-icons-kit/fa/filePdfO'
import {database} from 'react-icons-kit/fa/database'
import {institution} from 'react-icons-kit/fa/institution'
import {speech_bubbles} from 'react-icons-kit/ikons/speech_bubbles'
import {ic_ac_unit} from 'react-icons-kit/md/ic_ac_unit'
import {font} from 'react-icons-kit/fa/font'
import {barcode} from 'react-icons-kit/fa/barcode'
import {cogs} from 'react-icons-kit/fa/cogs'
import {server} from 'react-icons-kit/fa/server'
import {snowflakeO} from 'react-icons-kit/fa/snowflakeO'

import Carousel from 'react-multi-carousel';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {},
  button: {},
  hero_button: {width: '100%', marginTop: '20px'}
}));

function DynamicSpacer(props){
  return(<div style={{height: props.height}}></div>)
}

function MainPage(props){
  const classes = useStyles();

  let code = " # download meteorjs \n curl https://install.meteor.com/ | sh \n\n # clone the repository \n git clone https://github.com/symptomatic/node-on-fhir \n\n # change into the directory \n cd node-on-fhir \n\n # install the dependencies \n meteor npm install \n\n # run the app (with settings) \n meteor run --settings configs/settings.nodeonfhir.localhost.json --extra-packages symptomatic:example-plugin ";


  //----------------------------------------------------------------------
  // Page Styling 

  let headerHeight = 64;
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    headerHeight = 128;
  }

  let pageStyle = {
    paddingLeft: '200px', 
    paddingRight: '200px',
    position: 'absolute',
    top: '0px'
  }


  //----------------------------------------------------------------------
  // Carousel  

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      paritialVisibilityGutter: 60
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      paritialVisibilityGutter: 50
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      paritialVisibilityGutter: 30
    }
  };
  const images = [
    "https://images.unsplash.com/photo-1549989476-69a92fa57c36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550133730-695473e544be?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550167164-1b67c2be3973?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550338861-b7cfeaf8ffd8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550223640-23097fc71cb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550353175-a3611868086b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550330039-a54e15ed9d33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1549737328-8b9f3252b927?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1549833284-6a7df91c1f65?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1549985908-597a09ef0a7c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550064824-8f993041ffd3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
  ];



  //----------------------------------------------------------------------
  // Main Render Method  

  let imageItems = [];
  images.forEach(function(url, index){
    imageItems.push(<img                    
      style={{ width: "100%", height: "100%" }}
      src={url}
    />);
    // imageItems.push(<Card>
    //   <CardMedia />
    // </Card>)
  });

  return (
    <PageCanvas id='MainPage' style={pageStyle} headerHeight={headerHeight}>
        <Grid container justify="center" spacing={3} style={{paddingBottom: '80px'}}>
          <Grid item lg={8}>
            <StyledCard margin={20} style={{marginBottom: '20px'}}>
              <div style={{width: '100%', textAlign: 'center'}}>
                <img src='/node-on-fhir-logo-thin.png' style={{width: '400px'}} alt="Node on FHIR Logo" />
              </div>
              <CardHeader title="Node on FHIR" style={{textAlign:'center'}} />
              <CardContent>
                <p>
                  Welcome to the next best thing to sliced bread.    This code repository contains a reference server and web application stack written in modern ES6/Typescript/Javascript/Node that can compile to mobile devices.  We have gone through the NPM repository, and tried to pull in as many FHIR related libraries as we could in order to find the 'center' of the Javascript FHIR community.  
                </p>
                <p>
                  This project is an offshoot of the Meteor on FHIR project, which developed a Javascript based FHIR application stack about 4 years ago.  A the time, we chose Meteor.js, a full-stack application framework that used websockets as it's transportation mechanism with pub/sub functionality, because it had good support for clinician worklists use cases.  Over time, we saw some limitations with the default Meteor tech stack, but were quite pleased with the Meteor compiler.  Eventually, we decided to do a soft fork of the Meteor project, and set up our own release track and began replacing the websocket/data-distribution-protocol with more standard OAuth/REST interfaces.  We also were tracking many of the latest developments in the Javascript community, such as the release of React, EcmaScript 6, and Typescript.  With the help of the Meteor Development Group, we were able to upgrade the default reference build to include best practices from across the Javascript ecosystem.   
                </p>
                <p>
                  The following reference build isthe result of 5 years of work; 70+ prototypes and pilots, the result of a million+ quality control tests, and the contributions of dozens of different organizations, ranging from big tech companies (Google, Facebook) and javascript specific projects (Meteor, Material UI) to healthcare specific companies (HL7, Vermonster, Asymmetrik, SmartHealthIT, etc).   It represents a rich combination of functionality that is difficult to be found anywhere else, particularly in it's support of mobile applications and blockchain.    
                </p> 
              </CardContent>
            </StyledCard>

            <Carousel     
                additionalTransfrom={0}
                arrows
                autoPlay
                autoPlaySpeed={5000}
                centerMode={true}
                className=""
                containerClass="container-with-dots"
                dotListClass=""
                draggable
                focusOnSelect={false}
                infinite
                itemClass=""
                keyBoardControl
                minimumTouchDrag={80}
                renderButtonGroupOutside={false}
                renderDotsOutside={false}
                responsive={{
                  desktop: {
                    breakpoint: {
                      max: 3000,
                      min: 1024
                    },
                    items: 3,
                    partialVisibilityGutter: 40
                  },
                  mobile: {
                    breakpoint: {
                      max: 464,
                      min: 0
                    },
                    items: 1,
                    partialVisibilityGutter: 30
                  },
                  tablet: {
                    breakpoint: {
                      max: 1024,
                      min: 464
                    },
                    items: 2,
                    partialVisibilityGutter: 30
                  }
                }}
                showDots={false}
                sliderClass=""
                slidesToSlide={2}
                swipeable
              >
                { imageItems }
              </Carousel>



            <StyledCard margin={20} >

              <CardHeader title="Open Source Community Libraries" />
              <CardContent>
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
                </CardContent>
              </StyledCard>

              <Card margin={20} style={{textAlign: 'center', backgroundColor: '#e0e0e0', marginTop: '20px'}}>
                <CardHeader title="You can use ⌘+ and ⌘- to zoom in and out." style={{padding: '20px'}} />
              </Card>
              <StyledCard margin={20} >
                <CardHeader title="Getting Started" />
                <CardContent>
                  <pre>
                    - install meteor
                    - download github repo
                    - install dependencies
                    - run app
                  </pre>
                </CardContent>  
              </StyledCard>

              <StyledCard margin={20} >
                <CardHeader title="Everything You Need For Better Healthcare Software" />
                <CardContent>

                <Table size="small" >
                  <TableHead>
                    <TableRow >
                      <TableCell style={{fontWeight: 'bold'}} >Icon</TableCell>
                      <TableCell style={{fontWeight: 'bold'}} >Feature</TableCell>
                      <TableCell style={{fontWeight: 'bold'}} >Library</TableCell>
                      <TableCell style={{fontWeight: 'bold'}} >Vendor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Material Design</TableCell>
                      <TableCell>material-ui</TableCell>
                      <TableCell>Google; CallEmAll</TableCell>                  
                    </TableRow>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Modular Reusable Components</TableCell>
                      <TableCell>react</TableCell>
                      <TableCell>Facebook</TableCell>                  
                    </TableRow>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>DevOps Logging</TableCell>
                      <TableCell>winston/TableCell</TableCell>
                      <TableCell></TableCell>                  
                    </TableRow>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Icons, Fonts, & Typography</TableCell>
                      <TableCell>react-icons</TableCell>
                      <TableCell></TableCell>                  
                    </TableRow>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Search Engine Optimization</TableCell>
                      <TableCell></TableCell>
                      <TableCell>Google</TableCell>                  
                    </TableRow>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Social Media Metadata</TableCell>
                      <TableCell></TableCell>
                      <TableCell>Facebook, Twitter</TableCell>                  
                    </TableRow>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Multitenant Design</TableCell>
                      <TableCell>meteorjs</TableCell>
                      <TableCell>Meteor Development Group</TableCell>                  
                    </TableRow>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>A/B Testing Infrastructure</TableCell>
                      <TableCell>meteorjs</TableCell>
                      <TableCell>Meteor Development Group</TableCell>                  
                    </TableRow>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Distributed Mongo</TableCell>
                      <TableCell>minimongo</TableCell>
                      <TableCell>Meteor Development Group</TableCell>                  
                    </TableRow>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Document Database</TableCell>
                      <TableCell>mongo</TableCell>
                      <TableCell>Mongo</TableCell>                  
                    </TableRow>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Mesh Networking</TableCell>
                      <TableCell>ipfs</TableCell>
                      <TableCell>Interplanetary File System</TableCell>                  
                    </TableRow>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Peer to Peer File Transfer</TableCell>
                      <TableCell>webtorrent</TableCell>
                      <TableCell>Web Torrent</TableCell>                  
                    </TableRow>
                    
                  </TableBody>
                </Table>
              </CardContent>
            </StyledCard>

            <Button variant="contained" color="primary" className={classes.hero_button} href="https://github.com/symptomatic/node-on-fhir" >
              <Icon icon={github} size={48} /><CardHeader title="Download the Code" />
            </Button>

          </Grid>
        </Grid>
    </PageCanvas>
  );
}

export default MainPage;