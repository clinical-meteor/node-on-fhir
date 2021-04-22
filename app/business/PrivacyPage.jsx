// import React from 'react';

// import { makeStyles, withStyles } from '@material-ui/core/styles';

// import Grid from '@material-ui/core/Grid';
// import CardContent from '@material-ui/core/CardContent';
// import CardHeader from '@material-ui/core/CardHeader';
// import CardActions from '@material-ui/core/CardActions';
// import Checkbox from '@material-ui/core/Checkbox';
// import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';
// import Container from '@material-ui/core/Container';

// import { get, has } from 'lodash';
// import { Meteor } from 'meteor/meteor';
// import { Session } from 'meteor/session';
// import { HTTP } from 'meteor/http';
// import JSON5 from 'json5';

// import moment from 'moment';

// import { PageCanvas, StyledCard, PatientTable } from 'material-fhir-ui';
// import { useTracker } from './Tracker';

// function DynamicSpacer(props){
//   return <br className="dynamicSpacer" style={{height: '40px'}}/>;
// }

// //==============================================================================================
// // THEMING

// const useStyles = makeStyles(theme => ({
//   container: {
//     display: 'flex',
//     flexWrap: 'wrap',
//   },
//   textField: {
//     marginLeft: theme.spacing(1),
//     marginRight: theme.spacing(1)
//   },
//   button: {
//     margin: theme.spacing(1)
//   }
// }));

// //==============================================================================================
// // MAIN COMPONENT


// function PrivacyPage(props){

//   const classes = useStyles();
  
//   let containerStyle = {
//     paddingLeft: '100px',
//     paddingRight: '100px',
//     marginBottom: '100px'
//   };

  
//   let headerHeight = 84;
//   if(get(Meteor, 'settings.public.defaults.prominantHeader')){
//     headerHeight = 148;
//   }  

//   return (
//     <PageCanvas id='infoPage' headerHeight={headerHeight} >
//         <Container maxWidth="lg" style={{paddingBottom: '80px'}}>
//           <StyledCard height="auto" style={{overflowY: 'scroll'}}>
//             <CardHeader 
//               title="Privacy Page" 
//               style={{fontSize: '100%'}} />
//             <CardContent style={{fontWeight: 300, fontSize: '120%'}}>
           

//               <h4>U.S. Development</h4>
//               <p>Pandemic Maps is an application provided by Symptomatic, LLC, an Illinois company based in Chicago. All development occurs within the United States and is NOT outsourced.</p>

//               <h4>Funding Model</h4>
//               <p>Pandemic Maps was initially produced by volunteers and the open source Node/Javascript community, along with help from HL7 International volunteers.  It is seeking to establish sustainable funding through the following activities:  selling a consumer app via the Apple App Store; applying for federal contract opportunities; selling a HIPAA compliant data-mining and reporting utility to hospitals via the EHR App Stores; and selling aggregated, anonymized data geographic maps and similar generated media assets to news networks (ie for inclusion in weather reporting segments, etc).</p>

//               <h4>Metadata and AuditLogs</h4>
//               <p>Some metadata is communicated to our servers to maintain regulatory compliance and to improve the overall service for users with clinical or enterprise accounts. This metadata may including your username, account ID, device type, device address, operating system, session tokens (“cookies”), and security access tokens.</p>

//               <h4>Google Analytics</h4>
//               <p>Pandemic Maps uses Google Analytics to track application usage and improve user experience.  We do not use Google Ads or sell user data to advertisers.</p>


//               <h4>HIPAA Compliance</h4>
//               <p>This health technology developer is not a HIPAA covered entity, although regularly signs Business Associate Agreements with covered entities.</p>

//               <p>Please note that the health data we submit over the SANER relay network is substantially de-anonymized and aggregated public health data, and therefore is NOT covered by HIPAA and our company’s HIPAA Notice of Privacy Practices does NOT apply.</p>

//               <p>However, with regard to the EHR data mining utilities and MeasureProducer functionality, some of the health data we query and access is protected by HIPAA.  Such protected data only resides in-memory in the MeasureProducer application, which is responsible for anonymization and aggregation into a public-health report.</p>

//               <h4>How We Use Clinical Data</h4>

//               <p>Pandemic Maps is a public facing front-end for the SANER (Situational Awareness for Novel Epidemic Response) relay network, and connects to both the CDC National Healthcare Safety Network and HHS Protect.  </p>

//               <p>Part of our implementation of the SANER specification involved the creation of a data-mining utility, known both as the ‘MeasureProducer’ or ‘Covid19-on-FHIR’ utility, and whose primarily use is for the automated syndromic surveillance of COVID19.  </p>

//               <p>This data mining utility queries identifiable clinical health data from hospital EHR servers, and then anonymizes and aggregates it for use in public health reporting (both governmental and non-governmental public-interest, such as network news channels).  </p>

//               <p>This anonymized, aggregated clinical data is then used for quality control purposes and making policy recommendations.  </p>

//               <h4>How We Share Data</h4>

//               <p>Currently, as of November 2020, we DO NOT share your personal,  identifiable data.  </p>

//               <p>The default configuration is to relay aggregated, anonymized data to federal agencies via CDC National Healthcare Safety Network or via HHS Protect.</p>

//               <p>That being said, our software can be configured by clients to relay identified data, in the case of Laboratory Reporting laws.  </p>

//               <p>Additionally, some clients may wish to configure their intermediary/hub to relay aggregated anonymized data to non-government agencies, such as news networks for their weather reporting segments.  </p>

//               <p>In some instances, we may send data records to Google geocoding servers, to obtain latitude/longitude coordinates for mapping purposes.</p>

//               <h4>Who We Sell Your Data To</h4>

//               <p>Pandemic Maps DOES NOT sell identifiable health data. </p>

//               <p>However, we may sell aggregated anonymized maps and derivative datasets.  Possible customers include news networks, such as CNN, MSNBC, FOX, and others, for inclusion in their weather reporting services.  Or to supply chain companies, so they know where to deliver personal protective equipment to.  Or to travel agencies, so travelers know which cities to avoid.</p>

//               <h4>How We Store Data</h4>

//               <p>We have designed our technology such that PHI continues to reside on personal devices or within hospital EHRs.  Symptomatic is in the business of syndromic surveillance reporting, not data warehousing.  We do not store your identified data at our company or through third parties.  </p>

//               <h4>How This Technology Accesses Other Data</h4>

//               <p>Pandemic Maps may request access to either your GPS location or to your Apple Health Records.  This data access is for personalizing the pandemic maps on your local device only. </p>

//               <p>This app DOES NOT do contract tracing, nor does it access Bluetooth, nor does it participate in Exposure Notifications.</p>

//               <h4>What You Can Do With the Data We Collect</h4>

//               <p>While Pandemic Maps is not in the business of collecting data on our own servers, our technology does give visibility into what is being collected at the state and national levels.  </p>

//               <p>Importantly, we provide the public transparency into the syndromic surveillance process by providing sousveillance tools that aid in accessing, sharing, scrutinizing, verifying, and contesting the reported public health data.  We do not provide the ability to edit, delete, or retract past reported data.  </p>

//               <h4>Deactivation</h4>

//               <p>You can use the Pandemic Maps app from your phone without creating an account.  As such, deactivation is as simple as deleting the app off your phone.  No personal account details or profile information will be kept on our servers.</p>

//               <p>Organization and enterprise customers, on the other hand, will have their business accounts deactivated; and organization details will remain on asymptomatic surfers.  Any aggregated anonymized data that has been reported into the SANER relay network, CCD NHSN, or HHS Protect will remain in those reporting networks.  </p>

//               <h4>Policy Changes</h4>

//               <p>Changes to the privacy policy for the general public will be communicated during version updates on the App Store.  Clinical and enterprise users with registered accounts will receive updates via email.</p>

//               <h4>Notifications in Case of Improper Disclosure</h4>

//               <p>Symptomatic has gone to great lengths to architect a mobile app that doesn’t store personal health information, thereby minimizing the risk and liability of data breaches.  Since Pandemic Maps doesn’t collect and store PHI in the first place, we anticipate a low-to-zero risk of data breaches occurring involving personal user data being improperly disclosed from our mobile app. </p>

//               <p>For clinical and enterprise users, using the HIPAA compliant MeasureProducer data mining utility, notifications will be sent to the email provided upon registration.</p>

//             </CardContent>
//           </StyledCard>          
//       </Container>                 
//     </PageCanvas>
//   );
// }

// export default PrivacyPage;