import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import GoogleMapReact from 'google-map-react';

import DialogContent from '@material-ui/core/DialogContent';

import { get, has } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';


import Mapping from '../lib/Mapping';

function DynamicSpacer(props){
  return <br className="dynamicSpacer" style={{height: '40px'}}/>;
}

//==============================================================================================
// THEMING

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  githubIcon: {
    margin: '0px'
  },
}));


//==============================================================================================
// Environment

Meteor.startup(function(){
  window.navigator.geolocation.getCurrentPosition(function(position){
    Session.setDefault('myLatitude', get(position, 'coords.latitude'));  
    Session.setDefault('myLongitude', get(position, 'coords.longitude'));  
  })  
})



//==============================================================================================
// MAIN COMPONENT

// Session.setDefault('mappingParameter', get(Meteor, 'settings.public.saner.measureScore', "numICUBeds"));
Session.setDefault('currentPosition', {latitude: null, longitude: null});

function MyLocationDialog(props){

  const classes = useStyles();

  let geolocationOptions = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  };
  let [latitude, setLatitude] = useState(Session.get('myLatitude'));
  let [longitude, setLongitude] = useState(Session.get('myLongitude'));

  // let [coordinates, setCoordinates] = useState({
  //   latitude: '',
  //   longitude: ''
  // });


  let mapOptions = {
    panControl: false,
    mapTypeControl: false,
    scrollwheel: false
  }

  let miniMap;

  useEffect(() => {
    function watchSuccess(pos) {      
      if(get(pos, 'coords')){
        // setCoordinates(pos.coords)   
        setLatitude(get(pos, 'coords.latitude'));      
        setLongitude(get(pos, 'coords.longitude'));      
      }
    }
    
    function watchError(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    }
    
    let watchId = navigator.geolocation.watchPosition(watchSuccess, watchError, geolocationOptions);

    // Specify how to clean up after this effect:
    return function cleanup() {
      navigator.geolocation.clearWatch(watchId);
    };
  });


  miniMap = <GoogleMapReact
    id="googleMyLocationMap"
    defaultZoom={12}
    defaultCenter={{ lat: latitude, lng: longitude }}
    center={{ lat: latitude, lng: longitude }}
    options={mapOptions}
    resetBoundsOnResize={true}
    resetBoundsOnRotate={true}
    bootstrapURLKeys={{
      key: get(Meteor, 'settings.public.google.maps.apiKey', ''),
      libraries: 'visualization'
    }}
    yesIWantToUseGoogleMapApiInternals
    onGoogleApiLoaded={function({map, maps}){

      // let customGeoJsonLayer;
      let markerCollection;
      // load HSA boundary polygons from a GeoJson file
      let localFeatures = {
        "type": "FeatureCollection",
        "features": [
          {
              "type": "Feature",
              "geometry": {
                  "type": "Point",
                  "coordinates": [
                    longitude,
                    latitude
                  ]
              },
              "properties": {
              }
          }
        ]
      };
      
      markerCollection = map.data.addGeoJson(localFeatures, { idPropertyName: 'id' });

      map.data.setStyle({
        // raw binary data (extremely fast!)
        icon: Mapping.getPinIcon('red'),
        fillColor: '#ffffff',
        fillOpacity: 0.2,
        strokeColor: '#EB6600',
        strokeWeight: 0.5
      });

    }}
  ></GoogleMapReact>; 



  return (

    <DialogContent dividers={scroll === 'paper'} style={{minWidth: '600px', fontSize: '120%', marginBottom: '20px'}}>     
      <b>Latitude:</b> {latitude} <b>, Longitude:</b> {longitude} 
      <div style={{width: '550px', height: '800px', margin: '0px'}}>
        { miniMap }        
      </div>      
    </DialogContent>
  );
}




export default MyLocationDialog;