import React from 'react';

import { 
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  CardContent,
  CardMedia,
  Container,
  Grid,  
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Image,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { get } from 'lodash';
import { PageCanvas, StyledCard } from 'fhir-starter';

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
import {location} from 'react-icons-kit/icomoon/location'
import {aidKit} from 'react-icons-kit/icomoon/aidKit'
import {chain} from 'react-icons-kit/fa/chain'
import {dashboard} from 'react-icons-kit/fa/dashboard'
import {hospitalO} from 'react-icons-kit/fa/hospitalO'
import {medkit} from 'react-icons-kit/fa/medkit'
import {codeFork} from 'react-icons-kit/fa/codeFork'
import {cubes} from 'react-icons-kit/fa/cubes'
import {usb} from 'react-icons-kit/fa/usb'
import {universalAccess} from 'react-icons-kit/fa/universalAccess'
import {mobileCombo} from 'react-icons-kit/entypo/mobileCombo'
import {fire} from 'react-icons-kit/icomoon/fire'
import {warning} from 'react-icons-kit/fa/warning'

import Carousel from 'react-multi-carousel';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
  },
  media: {
    minHeight: 400,
  },
  open_stack: {
    minHeight: 1200,
    backgroundSize: 'contain'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {},
  button: {},
  fallout_button: {
    width: '100%', 
    marginTop: '20px', 
    marginBottom: '20px',
    textAlign: 'left',
    background: "repeating-linear-gradient( 45deg, rgba(253,184,19, 0.9), rgba(253,184,19, 0.9) 10px, rgba(253,184,19, 0.75) 10px, rgba(253,184,19, 0.75) 20px ), url(http://s3-us-west-2.amazonaws.com/s.cdpn.io/3/old_map_@2X.png)"
  },
  hero_button: {
    width: '100%', 
    marginTop: '20px', 
    marginBottom: '20px',
    textAlign: 'left'
  },
  tip_of_the_day: {
    width: '100%', 
    marginTop: '20px', 
    marginBottom: '20px',
    textAlign: 'left'
  }
}));

function DynamicSpacer(props){
  return(<div style={{height: props.height}}></div>)
}



function MainPage(props){
  const classes = useStyles();

  let code = " # download meteorjs \n curl https://install.meteor.com/ | sh \n\n # clone the repository \n git clone https://github.com/symptomatic/node-on-fhir \n\n # change into the directory \n cd node-on-fhir \n\n # install the dependencies \n meteor npm install \n\n # run the app (with settings) \n meteor run --settings configs/settings.nodeonfhir.localhost.json --extra-packages symptomatic:example-plugin ";





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


  function openExternalPage(url){
    logger.debug('client.app.layout.MainPage.openExternalPage', url);
    window.open(url);
    // props.history.replace(url)
  }

  //----------------------------------------------------------------------
  // Page Styling 

  let headerHeight = 64;
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    headerHeight = 128;
  }

  let pageStyle = {
    paddingLeft: '100px', 
    paddingRight: '100px',
    position: 'absolute',
    top: '0px'
  }

  //----------------------------------------------------------------------
  // Main Render Method  

  let carouselImages = get(Meteor, 'settings.public.projectPage.carouselImages', []);

  let imageItems = [];
  carouselImages.forEach(function(url, index){
    imageItems.push(<img                    
      style={{ width: "100%", height: "100%" }}
      key={"image-" + index}
      src={url}
    />);
  });

  let tagLineStyle = {
    fontWeight: 'normal',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: '0px',
    marginBottom: '40px'
  }

  let featureRowStyle = {
    height: '52px'
  }

  if(Meteor.isCordova){
    pageStyle.width = '100%';
    pageStyle.padding = 20;
    pageStyle.marginLeft = '0px';
    pageStyle.marginRight = '0px';
  }



  return (
    <PageCanvas id='MainPage' style={pageStyle} headerHeight={headerHeight} paddingLeft={pageStyle.padding} paddingRight={pageStyle.padding}>
        <Grid container justify="center" style={{paddingBottom: '80px'}}>
          <Grid item xs={4}>

          </Grid>

            {/* <Button variant="contained" color="secondary" className={classes.fallout_button} href="https://github.com/symptomatic/covid19-on-fhir" >
              <Icon icon={warning} size={24} /><CardHeader title="Announcement" subheader="Due to pandemic, we have discontinued the old example plugin, and will now be offering Covid19-on-FHIR as the example." />
            </Button> */}
            <StyledCard margin={20} style={{marginBottom: '20px'}}>
              <div style={{width: '100%', textAlign: 'center'}}>
                <img src='/node-on-fhir-logo-thin.png' style={{width: '400px'}} alt="National Directory" />
              </div>
              <CardContent>
                <CardContent style={{fontSize: '110%', lineHeight: '200%', textAlign: 'justify'}}>
                  <h4 style={tagLineStyle}>
                  Lorem ipsum...
                  </h4>
                  <p>
                    Lorem ipsum...
                  </p>
                </CardContent>
              </CardContent>
            </StyledCard>

              <StyledCard margin={20} >
                <CardHeader title="Features - Everything You Need; Kitchen Sink Included" />
                <CardContent>

                <Table size="small" >
                  <TableHead>
                    <TableRow >
                      <TableCell style={{fontWeight: 'bold'}} >Icon</TableCell>
                      <TableCell style={{fontWeight: 'bold', minWidth: '320px'}} >Feature</TableCell>
                      <TableCell style={{fontWeight: 'bold'}} >Vendor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={fire} size={18} /></TableCell>
                      <TableCell>Fast Healthcare Interoperability Resources</TableCell>
                      <TableCell>ANSI Certified Standards.  Required by U.S. federal law, pertaining to MACRA and 21st Century Cures.  </TableCell>                  
                    </TableRow>
                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={hospitalO} size={18} /></TableCell>
                      <TableCell>EHR Interoperability</TableCell>
                      <TableCell>Can fetch data from Medicare, Medicaid, Apple HealthRecords, and all hospitals running a Cerner, Epic, or other FHIR compliant EHR.</TableCell>                  
                    </TableRow>
                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={mobileCombo} size={18} /></TableCell>
                      <TableCell>Multiple Device Pipelines</TableCell>
                      <TableCell>Write once and run anywhere, with pipelines for compiling the javascript software on desktops, mobile devices, and webTV.</TableCell>                  
                    </TableRow>
                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={puzzlePiece} size={18} /></TableCell>
                      <TableCell>Modular Reusable Components</TableCell>
                      <TableCell>Built with modular reusable components using React (from Facebook).  Proven web technology used by billions of people.  Components progressively get better with time rather than become a speghetti mess.</TableCell>                  
                    </TableRow>
                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={universalAccess} size={18} /></TableCell>
                      <TableCell>Accessibility</TableCell>
                      <TableCell>Includes accessibility best practices via Accessible Rich Internet Applications (ARIA) specification.  Supports screen readers, low visibility modes, voice prompts, etc.</TableCell>                  
                    </TableRow>
                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={cubes} size={18} /></TableCell>
                      <TableCell>Material Design</TableCell>
                      <TableCell>Designed with a modern toolkit of user interface components based on the Material Design specification from Google.</TableCell>                  
                    </TableRow>

                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={font} size={18} /></TableCell>
                      <TableCell>Icons, Fonts, & Typography</TableCell>
                      <TableCell>Includes rich typography and fonts and extended icon support to make your applications look beautiful.</TableCell>                  
                    </TableRow>
                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={addressCard} size={18} /></TableCell>
                      <TableCell>Social Media Metadata</TableCell>
                      <TableCell>Get the word out and allow people to share your project with others on Facebook and Twitter.</TableCell>                  
                    </TableRow>
                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={codeFork} size={18} /></TableCell>
                      <TableCell>A/B Testing Infrastructure</TableCell>
                      <TableCell>Built from the ground up around containerization and an application-wide settings, to allow different containers to run the software with different settings.  Perfect for A/B testing methodologies.</TableCell>                  
                    </TableRow>
                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={database} size={18} /></TableCell>
                      <TableCell>Document Database</TableCell>
                      <TableCell>Built with Mongo, an ultra-scalable JSON database that stores FHIR data as-is in a NoSQL format.  Easily convert a server database into an enterprise grade datalake.</TableCell>                  
                    </TableRow>
                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={speech_bubbles} size={18} /></TableCell>
                      <TableCell>Email, Chat & SMS Integration</TableCell>
                      <TableCell>Support inbound and outbound messaging via the FHIR Communication resource and integration with MailChimp, Twilio, and other messaging platforms.</TableCell>                  
                    </TableRow>

                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={barcode} size={18} /></TableCell>
                      <TableCell>Machine Vision & Learning</TableCell>
                      <TableCell>Get fancy and add AI to your project with libraries like Tensorflow. Or keep it simply by adding barcodes and QR codes to let your application read products labels.</TableCell>                  
                    </TableRow>
                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={amazon} size={18} /></TableCell>
                      <TableCell>HIPAA Hosting</TableCell>
                      <TableCell>Chose your HIPAA hosting provider.  We regularly run NodeOnFHIR instances on Amazon Web Services, Azure, Aptible, Galaxy, and other providers.</TableCell>                  
                    </TableRow>
                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={location} size={18} /></TableCell>
                      <TableCell>GPS, Maps, & Location Services</TableCell>
                      <TableCell>Support geospatial applications via Google Maps integration.</TableCell>                  
                    </TableRow>
                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={chain} size={18} /></TableCell>
                      <TableCell>Blockchain Support</TableCell>
                      <TableCell>Take advantage of all the blockchain libraries available to the Node/Javascript community, including Hyperledger, Etherium, BigChain, and IPFS.</TableCell>                  
                    </TableRow>
                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={dashboard} size={18} /></TableCell>
                      <TableCell>Realtime Dashboards</TableCell>
                      <TableCell>Build data rich dashboards using D3 charts from Stanford.  Chose Chart.js or Nivo for reusable charts that make creating dashboards a breeze.</TableCell>                  
                    </TableRow>
                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={medkit} size={18} /></TableCell>
                      <TableCell>EMT Smart Device Integration</TableCell>
                      <TableCell>Internet of Things has never been easier than with standardized data models and APIs.  We've integrated iHealth, Withings, and FitBit in the past, and look forward to many more integrations to come.</TableCell>                  
                    </TableRow>

                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={filePdfO} size={18} /></TableCell>
                      <TableCell>PDF Support</TableCell>
                      <TableCell>Seamlessly render the Material UI components to PDF with WYSIWYG layout and design.</TableCell>                  
                    </TableRow>

                    <TableRow style={featureRowStyle}>
                      <TableCell><Icon icon={snowflakeO} size={18} /></TableCell>
                      <TableCell>Autoconfiguratoin via P2P & Mesh Networking</TableCell>
                      <TableCell>Cut down on hassle of configuring systems by using P2P network topologies, distribtued file systems, and mesh networks.</TableCell>                  
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </StyledCard>

            <Button variant="contained" color="secondary" className={classes.tip_of_the_day} >
              <Icon icon={lightbulbO} size={24} /><CardHeader title="Getting Started Tip" subheader="Use ⌘+ and ⌘- to zoom in and out." style={{padding: '20px'}} />
            </Button>

            <StyledCard margin={20} style={{marginBottom: '20px'}}>
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
                    <TableCell>FHIR Client with ES6 classes, cross-version support, testing, etc.  </TableCell>
                      <TableCell>fhir-kit-client</TableCell>
                      <TableCell>Vermonster</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>FHIR Client from the developers of the SMART specification.</TableCell>
                      <TableCell>fhirclient</TableCell>
                      <TableCell>smarthealthit</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>FHIR Client with good Angular and jQuery support.</TableCell>
                      <TableCell>fhir.js</TableCell>
                      <TableCell>Aidbox</TableCell>
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
                      <TableCell>Amida Technology</TableCell>
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
                      <TableCell>HL7 v2 parser, serializer, validator and tcp client/server.</TableCell>
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


            <StyledCard>
              <CardHeader title="Open Source - With Professional Services and Plugins" subheader="Node on FHIR is open source, but it exists within an ecosystem of professional services and supports proprietary plugins." />
                <CardMedia 
                  className={classes.media}
                  title="Open Source - With Professional Services"
                  image="https://raw.githubusercontent.com/symptomatic/software-development-kit/master/images/ClientEngagementBuildPipeline.png" />                
            </StyledCard>


            <Button variant="contained" color="primary" className={classes.hero_button} href="https://github.com/symptomatic/node-on-fhir" >
              <Icon icon={github} size={48} /><CardHeader title="Download the Code" />
            </Button>

            <StyledCard style={{marginBottom: '20px'}}>
              <CardHeader title="Change Log" subheader="A huge amount of new features have gone into Node on FHIR since v0.3.0, easily making this the most feature packed release ever.  " />
              <CardContent style={{padding: '20px', marginLeft: '40px'}}>
                <Typography gutterBottom variant="h6" component="h2">
                  v0.4.0 - Patient Charting with SMART on FHIR
                </Typography>
                <ul>
                  <li>Upgraded to the official SMART on FHIR client library.</li>
                  <li>Added provider launch context.</li>
                  <li>Added a basic patient chart with most of the Argonaut / USCDI FHIR resources.</li>
                  <li>Added quicklaunch functionality to pull patient chart when being launched from an EHR.</li>
                  <li>Autoconfiguration checks Capability Statement on launch, and adjusts queries accordingly.</li>
                  <li>No Data cards and workflows.</li>
                  <li>Added additional Clinical Parameters to Bulk Data Fetch. </li>
                  <li>Updated license terms to MIT, in consideration of pandemic response.</li>
                  <li>Updated privacy policy to reflect redesigned example page.</li>
                </ul>
                <Typography gutterBottom variant="h6" component="h2">
                  v0.3.2 - COVID19 - Geocoding, Heatmaps, and Measure Reports
                </Typography>
                <ul>
                  <li>Google Maps integration, with markers and heatmaps.</li>
                  <li>Geocoding pipelines codes Address datatypes into Locations with Lat/Lng</li>
                  <li>Sidebar Workflows separated from FHIR Resource links.</li>
                  <li>Server side hospital index with 2dsphere index.</li>
                  <li>Proximity searches on both client and server using $near operator.</li>
                  <li>Map controls for radius, opacity, and max intensity.  Toggle labels and markers on/off.</li>
                  <li>Covid19-Reporting plugin which includes Measure and Measure Reports.</li>
                  <li>Sample data includes grocers file, CDC measures, and hospital index file.</li>
                </ul>
                <Typography gutterBottom variant="h6" component="h2">
                  v0.3.1 - COVID19 - FHIR Queries
                </Typography>
                <ul>
                  <li>Replaced the old example plugin with the Covid19 on FHIR plugin.</li>
                  <li>Preliminary integration with Synthea via the Covid19 Module.</li>
                  <li>Validated bulk data query operations with Covid19 related LOINC and SNOMED codes.</li>
                  <li>Major updates to resource tables in the HL7 FHIR Data Infrastructure package.</li>
                </ul>
              </CardContent>
            </StyledCard>


            <StyledCard>
              <CardHeader title="StackShare" subheader="For architecture details and discussion, please see StackShare for rationals and why we chose some technologies over others." />
              <CardActionArea onClick={openExternalPage.bind(this, "https://stackshare.io/symptomatic-llc/node-on-fhir")}>
                <CardMedia 
                  className={classes.open_stack}
                  title="Open Source - With Professional Services"
                  image="https://raw.githubusercontent.com/symptomatic/node-on-fhir/development/docs/assets/StackShare.png" />                
              </CardActionArea>
            </StyledCard>

      </Grid>
    </PageCanvas>
  );
}

export default MainPage;