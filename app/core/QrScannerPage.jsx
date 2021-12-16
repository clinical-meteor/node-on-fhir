
import React, { useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { get } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';

import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';

import { PageCanvas } from 'fhir-starter';

if(Meteor.isClient){
  Session.setDefault('adult_icu_bed_utilization', 0);
}




//==========================================================================================
// Icons

import { Icon } from 'react-icons-kit';
import {fire} from 'react-icons-kit/icomoon/fire';
import {pipette} from 'react-icons-kit/typicons/pipette' // Immunization ?

import {officine2} from 'react-icons-kit/metrize/officine2'
import {check} from 'react-icons-kit/metrize/check'

import {ticket} from 'react-icons-kit/entypo/ticket'


//==========================================================================================
// QR Scanner  

import QRScanner from 'cordova-plugin-qrscanner';


function displayContents(err, token){
  if(err){
  // an error occurred, or the scan was canceled (error code 6)
    console.log('displayContents().err', err)
  } else if(token){
    // alert(token);
    console.log('displayContents().token', token);

    Meteor.call('parseHealthCard', token, function(error, decodedHealthCard){
      if(error){
        console.log('parseHealthCard.error', error)
      } else {
        console.log('parseHealthCard.decodedHealthCard', decodedHealthCard)

        Session.set('mainAppDialogJson', JSON.parse(decodedHealthCard));
        Session.set('mainAppDialogTitle', "Immunization HealthCard");
        Session.set('mainAppDialogComponent', "PreviewQrDataDialog");
        Session.set('lastUpdated', new Date())
        Session.set('mainAppDialogOpen', true);    
        Session.set('mainAppDialogMaxWidth', "md");
      }
    });

    
  } else {
    console.log("displayContents() didn't receive an err or text")
  }
}


function onDone(err, status){
  if (err) {
    // here we can handle errors and clean up any loose ends.
    console.error(err);
  }

  if (get(status, 'authorized')) {
    console.log('authorized');
    window.QRscanner.show(function(status){
      console.log('showing the background');
      Session.set('canvasBackgroundColor', 'inherit');
    }) 
    // W00t, you have camera access and the scanner is initialized.
    // window.QRscanner.show() should feel very fast.
  } else if (get(status, 'denied')) {
    console.log('opening settings');
    window.QRScanner.openSettings()
  // The video preview will remain black, and scanning is disabled. We can
  // try to ask the user to change their mind, but we'll have to send them
  // to their device settings with `window.QRScanner.openSettings()`.
 } else {
    console.log('resetting background; destorying scanner');
    
    // we didn't get permission, but we didn't get permanently denied. (On
    // Android, a denial isn't permanent unless the user checks the "Don't
    // ask again" box.) We can ask again at the next relevant opportunity.
      Session.set('canvasBackgroundColor', '#f2f2f2');
  }
}




//==========================================================================================
// Main Component


export function QrScannerPage(props){

  let data = {
    query: {},
    currentYearData: [],
    currentScore: 0,
    immunizations: [],
    patients: [],
    selectedPatientId: '',
    fluVaccinated: false,
    rubellaVaccinated: false,
    coronavirusVaccinated: false,
    buttonColor: "#666666",
    adult_icu_bed_utilization: 0
  };

  let iconStyle = {
    height: '64px',
    float: 'left',
    position: 'relative',
    top: '16px',
    left: '16px'
  }

  let [torchEnabled, setTorchEnabled] = useState(false);
  let [icuCapacity, setIcuCapacity] = useState(0);


  //------------------------------------------------------------------------------------
  // Lifecycle

  useEffect(function(){
    if(window.QRScanner){
      window.QRScanner.prepare(onDone); // show the prompt

      window.QRScanner.useBackCamera(function(err, status){
        err && console.error(err);
        console.log(status);
      });  
    }

    return function(){
      if(window.QRScanner){
        window.QRScanner.destroy(function(status){
          console.log(status);
        });  
      }
    }
  }, [])


  //------------------------------------------------------------------------------------
  // Trackers

  data.adult_icu_bed_utilization = useTracker(function(){
    return Session.get('adult_icu_bed_utilization')
  }, []);


  //------------------------------------------------------------------------------------
  // Helper Functions

  function activateCamera(){
    console.log('activating camera; getting status, scan, show')
    if(window.QRScanner){
      window.QRScanner.getStatus(function(status){
        if(!status.authorized && status.canOpenSettings){
          if(confirm("Would you like to enable QR code scanning? You can allow camera access in your settings.")){
            window.QRScanner.openSettings();
          }
        }
      });
  
      window.QRScanner.getStatus(function(status){
        console.log(status);
        // alert(status)
      });
  

      window.QRScanner.scan(displayContents);
      window.QRScanner.show();  

      if(document.getElementById("reactCanvas")){
        document.getElementById("reactCanvas").setAttribute("style", "background: inherit !important;");
        document.body.setAttribute("style", "background: inherit !important;");        
      } 
      if(document.getElementById("footerNavContainer")){
        document.getElementById("footerNavContainer").setAttribute("style", "background: inherit !important;");
        document.getElementById("footerNavContainer").setAttribute("style", "border-top: none;");  
      }
    }    
  }

  function toggleLight(){
    console.log('Toggle the light');

    if(torchEnabled){
      setTorchEnabled(false);
      if(window.QRScanner){
        window.QRScanner.disableLight()
      }
    } else {
      setTorchEnabled(true);
      if(window.QRScanner){
        window.QRScanner.enableLight();
      }
    }
  }

  function parseColor(metric){
    let color = '#000000';

    if(get(Meteor, 'settings.public.defaults.darkModeEnabled')){      

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



  const ColorButton = withStyles((theme) => ({
    root: {
      color: "#ffffff",
      backgroundColor: parseColor(data.adult_icu_bed_utilization),
      '&:hover': {
        backgroundColor: parseColor(data.adult_icu_bed_utilization)
      },
    },
  }))(Button);





  // function openVaccineFinderUrl(){
  //   window.open(get(Meteor, 'settings.public.vaccineWallet.vaccineFinderUrl', 'https://www.cdc.gov/vaccines/covid-19/reporting/vaccinefinder/about.html'));
  // }

  if(Meteor.isCordova){
    paddingWidth = 20;
  }

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  // default top and bottom navbars
  let containerHeight = window.innerHeight - 128;
  
  // prominent header, if using
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    containerHeight = containerHeight - 64;
  }

  let torchString = "Enable Light";
  if(torchEnabled){
    torchString = "Disable Light";
  }

  return (
    <PageCanvas id='QrScannerPage' headerHeight={headerHeight} paddingLeft={0} paddingRight={0} style={{overflowX: 'hidden', marginBottom: '80px', background: 'transparent'}}>
      <Container id="QrScannerContainer" maxWidth="lg" style={{height: containerHeight}}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', paddingBottom: '20px'}}>
          <ColorButton color="primary" variant="contained" onClick={activateCamera.bind(this)} style={{width: '100%', marginTop: '20px'}}>
            <CardHeader title="Scan Vaccine Code"  />   
          </ColorButton>

          <div style={{width: '200px', height: '200px', border: '1px solid grey', borderRadius: '5px', position: 'relative', marginTop: '100px', marginBottom: '100px', left: '50%', marginLeft: '-100px'}}></div>
          <ColorButton color="primary" variant="contained" onClick={toggleLight.bind(this)} style={{width: '100%',  marginTop: '20px', marginBottom: '20x'}}>
            <CardHeader title={torchString} />   
          </ColorButton>
        </div>
      </Container>    
    </PageCanvas>
  );
}

export default QrScannerPage;