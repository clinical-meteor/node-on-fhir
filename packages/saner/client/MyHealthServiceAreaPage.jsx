
import React, { useEffect, useState } from 'react';
import { useTracker } from '@ledgy/react-meteor-data';
import { browserHistory } from 'react-router';

import { get, has } from 'lodash';

import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';
import { EJSON } from 'meteor/ejson';

import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';

import { StyledCard, PageCanvas, PatientsTable } from 'fhir-starter';

import { 
  DynamicSpacer,
  Immunizations,
  ImmunizationsTable,
  Observations,
  ObservationsTable
} from 'meteor/clinical:hl7-fhir-data-infrastructure';

// import { LocationsHistory, CurrentIcuCapacityData } from '../lib/Collections' 

//==========================================================================================
// Icons

import { Icon } from 'react-icons-kit';
import {fire} from 'react-icons-kit/icomoon/fire';
import {pipette} from 'react-icons-kit/typicons/pipette' // Immunization ?

import {officine2} from 'react-icons-kit/metrize/officine2'
import {check} from 'react-icons-kit/metrize/check'

import {clipboard} from 'react-icons-kit/feather/clipboard'
import {pin_zoom_in} from 'react-icons-kit/ikons/pin_zoom_in';
import {calendar} from 'react-icons-kit/fa/calendar'
import {ic_gradient} from 'react-icons-kit/md/ic_gradient'
import color from '@material-ui/core/colors/amber';

//==============================================================================================
// Styling

import { makeStyles, withStyles } from '@material-ui/core/styles';

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    // backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    backgroundColor: theme.palette.grey[700]
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#999999',
  },
}))(LinearProgress);

//==============================================================================================
// Environment

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log("navigator.geolocation works well");

    navigator.geolocation.getCurrentPosition(function(position){
      Session.set('myLatitude', get(position, 'coords.latitude'));  
      Session.set('myLongitude', get(position, 'coords.longitude'));  
    })  
}

Meteor.startup(function(){
  if(window.navigator){
    window.navigator.geolocation.getCurrentPosition(function(position){
      Session.set('myLatitude', get(position, 'coords.latitude'));  
      Session.set('myLongitude', get(position, 'coords.longitude'));  
    })  
  }
})

// //==========================================================================================
// // Helper Component

// function LinearProgressWithLabel(props) {
//   return (
//     <Box display="flex" alignItems="center">
//       <Box width="100%" mr={1}>
//         <LinearProgress variant="determinate" {...props} />
//       </Box>
//       <Box minWidth={35}>
//         <Typography variant="body2" color="textSecondary">{`${Math.round(
//           props.value,
//         )}%`}</Typography>
//       </Box>
//     </Box>
//   );
// }
// // LinearProgressWithLabel.propTypes = {
// //   value: PropTypes.number.isRequired,
// // };

//==========================================================================================
// Main Component


export function MyHealthServiceAreaPage(props){


    //--------------------------------------------------------------------------------
  // Data State

  let data = {
    query: {},
    icuLocations: []
  };

  let [latitude, setLatitude] = useState(Session.get('myLatitude'));
  let [longitude, setLongitude] = useState(Session.get('myLongitude'));
  let [icuCapacity, setIcuCapacity] = useState(0);
  let [locationName, setLocationName] = useState(0);

  let [locationLat, setLocationLat] = useState(null);
  let [locationLng, setLocationLng] = useState(null);

  let [icuLocationsCount, setIcuLocationsCount] = useState(0);

  //--------------------------------------------------------------------------------
  // Life Cycle  

  useEffect(() => {
    function watchSuccess(pos) {      
      if(get(pos, 'coords')){
        // setCoordinates(pos.coords)   
        setLatitude(get(pos, 'coords.latitude'));      
        setLongitude(get(pos, 'coords.longitude'));      

        if((get(pos, 'coords.latitude') !== latitude) || (get(pos, 'coords.longitude') !== longitude)){
          let icuCapacityUrl = "https://saner.symptomatic.us/icu-capacity-at-my-location?latitude=" + get(pos, 'coords.latitude') + "&longitude=" + get(pos, 'coords.longitude')
          console.log('icuCapacityUrl', icuCapacityUrl);
  
          HTTP.get(icuCapacityUrl, function(error, result){
            if(error) console.log('error', error)
            if(result) {
              let parsedResults = JSON.parse(result.content); 
              console.log('parsedResults', parsedResults)
  
              setIcuCapacity(get(parsedResults, 'adult_icu_bed_utilization'))
              setLocationName(get(parsedResults, 'locationMatch.name'))
  
              setLocationLat(get(parsedResults, 'locationMatch._location.coordinates')[1]);
              setLocationLng(get(parsedResults, 'locationMatch._location.coordinates')[0]);
            }
          })  
          
          HTTP.get("/number-of-hsa-records-in-map", function(error, result){
            if(error) console.log('error', error)
            if(result) {
              let parsedResult = JSON.parse(result.content);
              console.log('/number-of-hsa-records-in-map', parsedResult)
      
              setIcuLocationsCount(get(parsedResult, 'hsaRecordCount', 0))
            }
          })
        }
      }
    }
    
    function watchError(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    }
    
    let watchId = navigator.geolocation.watchPosition(watchSuccess, watchError, {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    });

    // Specify how to clean up after this effect:
    return function cleanup() {
      navigator.geolocation.clearWatch(watchId);
    };
  });



  //--------------------------------------------------------------------------------
  // Trackers  


  data.icuLocations = useTracker(function(){
    return LocationsHistory.find().fetch()
  }, []);



  //--------------------------------------------------------------------------------
  // Helper Functions  

  function openPage(url){
    console.log("MyHealthServiceAreaPage.openPage", url)
    // logger.verbose('client.app.patient.PatientSidebar.openPage', url, tabs);
    props.history.replace(url)
  }
  function parseColor(metric){
    
    if(get(Meteor, 'settings.public.defaults.darkModeEnabled')){
      let color = '#000000';

      //---------------------------------
      // orange on black
      if((0 < metric) && (metric <= .1)){
        color = '#000000';
      } else if ((.1 < metric) && (metric <= .2)){
        color = '#1c0702';
      } else if ((.2 < metric) && (metric <= .3)){
        color = '#2d0f07';
      } else if ((.3 < metric) && (metric <= .4)){
        color = '#3f110b';
      } else if ((.4 < metric) && (metric <= .5)){
        color = '#52130e';
      } else if ((.5 < metric) && (metric <= .6)){
        color = '#66140f';
      } else if ((.6 < metric) && (metric <= .7)){
        color = '#7a1410';
      } else if ((.7 < metric) && (metric <= .8)){
        color = '#8f130f';
      } else if ((.8 < metric) && (metric <= .9)){
        color = '#a5100e';
      } else if ((.9 < metric) && (metric <= 1)){
        color = '#ba0d0b';
      } else if (1 < metric){
        color = '#d00707';
      }
    } else {
  
      //---------------------------------
      // HHS purples 
      if((0 < metric) && (metric <= .1)){
        color = '#dee8f2';
      } else if ((.1 < metric) && (metric <= .2)){
        color = '#ced8e9';
      } else if ((.2 < metric) && (metric <= .3)){
        color = '#bec7e0';
      } else if ((.3 < metric) && (metric <= .4)){
        color = '#adb7d7';
      } else if ((.4 < metric) && (metric <= .5)){
        color = '#9da7ce';
      } else if ((.5 < metric) && (metric <= .6)){
        color = '#8d97c5';
      } else if ((.6 < metric) && (metric <= .7)){
        color = '#954e94';
      } else if ((.7 < metric) && (metric <= .8)){
        color = '#a34282';
      } else if ((.8 < metric) && (metric <= .9)){
        color = '#b13771';
      } else if ((.9 < metric) && (metric <= 1)){
        color = '#c02b5f';
      } else if (1 < metric){
        color = '#dc143c';
      }
    }
    
    return color;
  }



  //--------------------------------------------------------------------------------
  // Render Methods

  // console.log("MyHealthServiceAreaPage[data]", data);

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor(2);
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let themePrimaryColor = get(Meteor, 'settings.public.theme.palette.primaryColor')


  let iconStyle = {
    position: 'relative', 
    top: '20px',
    left: '40px',
    float: 'left', 
    color: 'lightgrey'
  }

  function openVaccineFinderUrl(){
    window.open(get(Meteor, 'settings.public.vaccineWallet.vaccineFinderUrl', 'https://www.cdc.gov/vaccines/covid-19/reporting/vaccinefinder/about.html'), "_system");
  }

  let influenzaIcon = officine2;
  let rubellaIcon = officine2;
  let coronavirusIcon = officine2;
  let influenzaStyle = Object.assign({}, iconStyle);
  let rubellaStyle = Object.assign({}, iconStyle);
  let coronavirusStyle = Object.assign({}, iconStyle);

  let ageText = "Age is a direct risk factor for a severe coronavirus outcome.  Risk of death increases 10% or more over the age of 65.";
  let weightText = "Obesity is another known risk for contracting coronavirus and other respiratory ailments.";
  let bloodTypeText = "Some blood types are more succeptible to severe outcomes.";
  let fitzpatrickTest = "Although not a causitive factor, skin color is correlated with system discrimination that results in poor healthcare delivery.";


  if(data.fluVaccinated){
    influenzaIcon = check;
    influenzaStyle.color = "green";
    weightText = get(data, 'lastFluVaccinationDate');
  }
  if(data.rubellaVaccinated){
    rubellaIcon = check;
    rubellaStyle.color = "green";
    bloodTypeText = get(data, 'lastRubellaVaccinationDate');
  }
  if(data.coronavirusVaccinated){
    coronavirusIcon = check;
    coronavirusStyle.color = "green";
    ageText = get(data, 'lastCoronavirusVaccinationDate');
  }


  if(Meteor.isCordova){
    paddingWidth = 20;
  }

  let cardContentStyle = {
    paddingLeft: '120px', 
    height: '100px',
    paddingTop: '0px',
    paddingBottom: '5px'
  }

  let sanerBackgroundColor = parseColor(icuCapacity);
  let textColor = "#222222";

  let buttonStyle = {cursor: 'pointer'}

  let locationElements = <div>
    {/* <Typography className="helveticas" style={{fontSize: '18px', marginTop: '0px', marginBottom: '0px', color: textColor, textTransform: 'uppercase'}}>Current Location</Typography> */}
    <Typography className="helveticas" style={{fontSize: '18px', marginTop: '100px', marginBottom: '0px', color: textColor, textTransform: 'uppercase'}}>Current Location</Typography>
    <Typography className="helveticas" style={{fontSize: '12px', marginTop: '0px', marginBottom: '100px', color: textColor}}>{longitude + ", " +  latitude}</Typography>          

    <Typography className="helveticas" style={{fontSize: '18px', marginTop: '0px', marginBottom: '0px', color: textColor, textTransform: 'uppercase'}}>Health Service Area</Typography>
    <Typography className="helveticas" style={{fontSize: '36px', marginTop: '0px', marginBottom: '0px'}}>{locationName}</Typography>
  </div>

  let nationalMapBtnText = "View National Map";
  let progressControls;
  let openMapButton;

  // if thhe number of icu locations is more than zeo and equal to the expected total
  if((data.icuLocations.length === icuLocationsCount) && (data.icuLocations.length > 0)){
    // otherwise show progress bar
    openMapButton = <Grid item xs={12}  style={{textAlign: 'center'}}>
    <Button color="default" variant="contained" fullWidth onClick={openPage.bind(this, '/icu-capacity-map')} style={buttonStyle}>Open National Map</Button>
    <p>This is a relatively large dataset being loaded into active memory in a web browser.  Please be patient, as display of the map may take 30s to 60s or more.</p>
  </Grid>
  
  } else {
    nationalMapBtnText = <Typography className="helveticas" style={{fontSize: '18px', marginTop: '100px', marginBottom: '0px', color: textColor, textTransform: 'uppercase'}}>{ "Loading National Map: " + data.icuLocations.length + " of " + icuLocationsCount }</Typography>;
    progressControls = <Grid item xs={12}  style={{textAlign: 'center'}}>
      {nationalMapBtnText}
      <BorderLinearProgress variant="determinate" value={Math.round((data.icuLocations.length / icuLocationsCount) * 100)} />
    </Grid>
  }

  return (
    <PageCanvas id='MyHealthServiceAreaPage' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth} style={{overflowX: 'hidden', paddingBottom: '84px', height: '100%', backgroundColor: sanerBackgroundColor}}>      
      <Grid container style={{height: '100%'}} spacing={3}>
        <Grid item md={4} xs={12} style={{height: '100%'}}>
          {/* <Grid container justify="space-evenly" direction="column" alignItems="center" style={{height: '100%'}}> */}
            <Grid item xs={12}  style={{textAlign: 'center'}}>
              <DynamicSpacer />
              { locationElements }
            </Grid>
            <Grid item xs={12}  style={{textAlign: 'center'}}>
              <Typography className="helveticas" style={{fontSize: '18px', marginTop: '100px', marginBottom: '0px', color: textColor, textTransform: 'uppercase'}}>Local ICU Bed Capacity</Typography>
              <Typography className="helveticas" style={{fontSize: '144px', marginTop: '0px', marginBottom: '100px', lineHeight: 1}}>{icuCapacity.toFixed(2) * 100}%</Typography>
            </Grid>
            { progressControls }
            <DynamicSpacer />
            { openMapButton }
          {/* </Grid> */}
        </Grid>
        <Grid item md={8} xs={12}>
          <DynamicSpacer />
          
        </Grid>
      </Grid>
    </PageCanvas>
  );
}


export default MyHealthServiceAreaPage;