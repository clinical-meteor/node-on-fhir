
import React, { useEffect, useState } from 'react';


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

import { PageCanvas } from 'fhir-starter';



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


function displayContents(err, text){
  if(err){
  // an error occurred, or the scan was canceled (error code 6)
    console.log('displayContents().err', err)
  } else {
    // alert(text);

    // Session.set('receivedQrMessage', JSON.parse(text));
    Session.set('mainAppDialogJson', JSON.parse(text));
    Session.set('mainAppDialogTitle', "Immunization HealthCard");
    // Session.set('mainAppDialogComponent', "ImmunizationHealthCardDialog");
    Session.set('mainAppDialogComponent', "PreviewQrDataDialog");
    Session.set('lastUpdated', new Date())
    Session.set('mainAppDialogOpen', true);  
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
    coronavirusVaccinated: false
  };

  let iconStyle = {
    height: '64px',
    float: 'left',
    position: 'relative',
    top: '16px',
    left: '16px'
  }

  let [torchEnabled, setTorchEnabled] = useState(false);

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
    <PageCanvas id='window.QrScannerPage' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth} style={{overflowX: 'hidden', marginBottom: '80px', background: 'transparent'}}>
      <Container maxWidth="md" style={{height: containerHeight}}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', paddingBottom: '20px'}}>
          <Button color="primary" variant="contained" onClick={activateCamera.bind(this)} style={{width: '100%', marginTop: '20px'}}>
            <CardHeader title="Scan Vaccine Code"  />   
          </Button>

          <div style={{width: '200px', height: '200px', border: '1px solid grey', borderRadius: '5px', position: 'relative', marginTop: '100px', marginBottom: '100px', left: '50%', marginLeft: '-100px'}}></div>
          <Button color="primary" variant="contained" onClick={toggleLight.bind(this)} style={{width: '100%',  marginTop: '20px', marginBottom: '20x'}}>
            <CardHeader title={torchString} />   
          </Button>
        </div>
      </Container>    
    </PageCanvas>
  );
}

export default QrScannerPage;