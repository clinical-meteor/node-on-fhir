import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import GoogleMapReact from 'google-map-react';

import Grid from '@material-ui/core/Grid';
import DialogContent from '@material-ui/core/DialogContent';

import { LocationsTable } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import { get, has } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';
import JSON5 from 'json5';

import moment from 'moment';

import {pin_1} from 'react-icons-kit/ikons/pin_1'
import { Icon } from 'react-icons-kit'
// import { useTracker } from './Tracker';

import haversineCalculator from 'haversine-calculator';


//==============================================================================================
// THEMING

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  githubIcon: {
    margin: '0px'
  }
}));








//==============================================================================================
// MAIN COMPONENT

// Session.setDefault('mappingParameter', get(Meteor, 'settings.public.saner.measureScore', "numICUBeds"));
Session.setDefault('currentPosition', {latitude: null, longitude: null});

function NearestTestingLocationDialog(props){

  const classes = useStyles();

  // console.log('------------------------------------------------------');  
  // console.log('NearestTestingLocationDialog');  
  // console.log('NearestTestingLocationDialog.Locations.count', Locations.find().count());

  let [latitude, setLatitude] = useState(Session.get('myLatitude'));
  let [longitude, setLongitude] = useState(Session.get('myLongitude'));
  let [collectionSiteLatitude, setCollectionSiteLatitude] = useState(Session.get('myLatitude'));
  let [collectionSiteLongitude, setCollectionSiteLongitude] = useState(Session.get('myLongitude'));

  let [locations, setLocations] = useState([]);
  // let [nearbyLocations, setNearbyLocations] = useState([]);
  let nearbyLocations = [];

  // let [locations, setLocations] = useState(Locations.find({_location: {$near: {
  //   $geometry: {
  //     type: 'Point',
  //     coordinates: [latitude, longitude]
  //   },
  //   // Convert [mi] to [km] to [m]
  //   $maxDistance: 50 * 1.60934 * 1000
  // }}}).fetch());



  // console.log('NearestTestingLocationDialog.locations', locations);


  let miniMap;


  useEffect(() => {
    // console.log('NearestTestingLocationDialog.useEffect()')

    // console.log('NearestTestingLocationDialog.useEffect().myLatitude', Session.get('myLatitude'));
    // console.log('NearestTestingLocationDialog.useEffect().myLongitude', Session.get('myLongitude'));

    // console.log('window.navigator.appName', window.navigator.appName);
    // console.log('window.navigator.appCodeName', window.navigator.appCodeName);
    // console.log('window.navigator.appVersion', window.navigator.appVersion);
    // console.log('window.navigator.vendor', window.navigator.vendor);

    // console.log('Geolocation.currentLocation()', Geolocation.currentLocation());
    
    let watchId = window.navigator.geolocation.watchPosition(function geolocationSuccess(position){
        // console.log('NearestTestingLocationDialog.position.coords', position.coords)  

      if(get(position, 'coords')){
        let lat = get(position, 'coords.latitude');
        let lng = get(position, 'coords.longitude');
        if(Number.isFinite(lat)){
          lat = lat.toFixed(6)
        }
        if(Number.isFinite(lng)){
          lng = lng.toFixed(6)
        }
        setLatitude(lat);      
        setLongitude(lng);      
      }

      if(get(position, 'coords.longitude') && get(position, 'coords.latitude')){
        
        setLocations(Locations.find({_location: {$near: {
          $geometry: {
            type: 'Point',
            coordinates: [get(position, 'coords.longitude'), get(position, 'coords.latitude')]
          },
          // Convert [mi] to [km] to [m]
          $maxDistance: 50 * 1.60934 * 1000
        }}}).fetch());

        // console.log('nearbyLocations', nearbyLocations)        
      }
    }, function watchError(error){
      setLocations([]);
      console.warn('ERROR(' + error.code + '): ' + error.message);
    }, {
      enableHighAccuracy: false,
      timeout: 30000,
      maximumAge: 0
    });

    return function cleanup() {
      navigator.geolocation.clearWatch(watchId);
    }
  });

  
  if(Array.isArray(locations)){
    nearbyLocations = [];
    locations.forEach(function(locationRecord){
      // console.log('locationRecord', locationRecord)

      let distance = haversineCalculator({
        longitude: longitude,
        latitude: latitude
      }, {
        longitude: get(locationRecord, '_location.coordinates[0]'),
        latitude: get(locationRecord, '_location.coordinates[1]')
      })
      // console.log('distance', distance)
      if(Array.isArray(locationRecord.extension)){
        locationRecord.extension.push({
          url: 'distance',
          valueDecimal: distance.toFixed(3)
        })
      } else {
        locationRecord.extension = [{
          url: 'distance',
          valueDecimal: distance.toFixed(3)
        }]
      }
      nearbyLocations.push(locationRecord);
    })
  }

  // console.log('NearestTestingLocationDialog.nearbyLocations', nearbyLocations.length)
  // console.log('NearestTestingLocationDialog.nearbyLocations[0]', nearbyLocations[0])

  // if(!Meteor.isCordova){
  //   console.log('NearestTestingLocationDialog', nearbyLocations)
  // }

  // // console.log('miniMap.longitude', longitude);
  // // console.log('miniMap.latitude', latitude);
  // if(nearbyLocations[0]){
  //   if(get(nearbyLocations[0], '_location')){
  //     console.log('miniMap.nearestTestingSite.lat', get(nearbyLocations[0], '_location.coordinates[1]'));
  //     console.log('miniMap.nearestTestingSite.lng', get(nearbyLocations[0], '_location.coordinates[0]'));      
  //   } else {
  //     console.log('No _location field found.  Gry geocoding?')
  //   }
  // } else {
  //   console.log('No nearby locations found.  Check the origin point?')
  // }

  let centerPoint = { lat: Number(latitude), lng: Number(longitude) };
  let nearestPoint = { lat: Number(get(nearbyLocations[0], '_location.coordinates[1]')), lng: Number(get(nearbyLocations[0], '_location.coordinates[0]')) };
  // console.log('miniMap.centerPoint', JSON.stringify(centerPoint));
  // console.log('miniMap.nearestPoint', JSON.stringify(nearestPoint));

  if(process.env.NODE_ENV !== "test"){
    miniMap = <GoogleMapReact
      id="googleMyLocationMap"
      defaultZoom={12}
      defaultCenter={centerPoint}
      center={centerPoint}
      options={{
        panControl: false,
        mapTypeControl: false,
        scrollwheel: false
      }}
      resetBoundsOnResize={true}
      resetBoundsOnRotate={true}
      bootstrapURLKeys={{
        key: get(Meteor, 'settings.public.google.maps.apiKey', ''),
        libraries: 'visualization'
      }}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={function({map, maps}){

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
                      centerPoint.lng,
                      centerPoint.lat
                    ]
                },
                "properties": {
                  "name": "Current Location"
                }
            }
          ]
        };

        markerCollection = map.data.addGeoJson(localFeatures, { idPropertyName: 'id' });

        map.data.setStyle({
          icon: Mapping.getPinIcon('blue'),
          fillColor: '#ffffff',
          fillOpacity: 0.2,
          strokeColor: '#EB6600',
          strokeWeight: 0.5
        });

        let markersArray = [];

        if(nearbyLocations[0]){
          let marker = new maps.Marker({
            map: map,
            position: {
              lat: nearestPoint.lat,
              lng: nearestPoint.lng
            },
            icon: Mapping.getPinIcon('purple')
          });
        
          markersArray.push(marker);          
        }

      }}
    ></GoogleMapReact>; 
  } else {
    console.log("NOTICE:  You are running in the 'test' environment.  Google Maps and other external libraries are disabled to prevent errors with the automated test runners.")
  }

  let locationsContent;
  if(nearbyLocations[0]){
    locationsContent = <LocationsTable 
      id="nearestTestingLocationsTable"
      locations={nearbyLocations} 
      count={nearbyLocations.length}
      hideType={true}
      hideCountry={true}
      simplifiedAddress={true}
      multiline={true}
      hideAddress={true}
      hideLongitude={true}
      hideLatitude={true}
      hideLatLng={false}
      hideCity={true}
      hideState={true}
      hidePostalCode={true}
      hideExtensions={true}
      rowsPerPage={5}
    />
  } else {
    locationsContent = <div id="nearestTestingLocationsTable" style={{width: '100%', minHeight: '20px', marginTop: '20px', border: '0px solid green'}}>Couldn't find any location data.  Check that geolocation services are enabled.</div>
  }

  return (
    <DialogContent style={{fontSize: '120%', marginBottom: '20px'}}>     
      <div id="googleMapContainer" style={{position: 'relative', width: '100%', height: '200px', margin: '0px', padding: '0px', border: '0px solid orange'}}>
        { miniMap }
      </div>      
      <div id="routeIcons" style={{width: '100%', border: '0px solid purple', marginTop: '20px', marginBottom: '20px'}}>
        <Icon icon={pin_1} style={{marginRight: '10px', color: '#9d57a5'}}/>{longitude}, {latitude} <b>Current Location</b><br />
        <Icon icon={pin_1} style={{marginRight: '10px', color: '#4792bf'}}/>{nearestPoint.lng.toFixed(6)}, {nearestPoint.lat.toFixed(6)} <b>Nearest Testing Location</b> 
      </div>
      { locationsContent }

    </DialogContent>
  );
}

export default NearestTestingLocationDialog;