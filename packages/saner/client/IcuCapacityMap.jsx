
import GoogleMapReact from 'google-map-react';
import React, { useEffect, useState } from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';


import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import { Session } from 'meteor/session';
import { Random } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import moment from 'moment';

import { get, has, findIndex, cloneDeep } from 'lodash';


import hsaGeoJsonLayer from '../geodata/health_service_areas_template';

//=============================================================================================================================================
// Analytics

import ReactGA from 'react-ga';
ReactGA.initialize(get(Meteor, 'settings.public.google.analytics.trackingCode'), {debug: get(Meteor, 'settings.public.google.analytics.debug', false)});
ReactGA.pageview(window.location.pathname + window.location.search);
ReactGA.set({ page: window.location.pathname });

// // //==============================================================================================
// // // Environment

// Meteor.startup(function(){

//   // HTTP.get('/latest-known-testing-locations', function(err, result){
//   //   if(err){
//   //     console.log('HTTP.get.err', err)
//   //   }
//   //   if(result){
//   //     console.log('HTTP.get.result', result)

//   //     let parsedResults = EJSON.parse(result.content);
//   //     console.log('HTTP.get.parsedResults', parsedResults)

//   //     if(Array.isArray(parsedResults)){
//   //       parsedResults.forEach(function(result){
//   //         TestingSiteLocations_Quickload._collection.insert(result)
//   //       })
//   //     }      
//   //   }
//   // })

//   Meteor.call("fetchCurrentIcuMap", function(error, results){
//     if(error){
//       console.log('fetchCurrentIcuMap().error', error)
//     }
//     if(results){
//       console.log('fetchCurrentIcuMap().results', results)

//       if(Array.isArray(results)){
//         results.forEach(function(result){
//           CurrentIcuCapacityData._collection.insert(result)
//         })
//       }      
//     }
//   })
// })

// Session.setDefault('testingSitesAreReady', false);

//=============================================================================================================================================
// Session Variables  


const AnyReactComponent = ({ text }) => <Card><CardContent>{text}</CardContent></Card>;

Session.setDefault('mapName', false);
Session.setDefault('displayHeatmap', false);
Session.setDefault('displayMarkers', false);
Session.setDefault('displayLabels', false);

Session.setDefault('centroidAddress', "Chicago, IL");
Session.setDefault('centroidLatitude', 41.8781136);
Session.setDefault('centroidLongitude', -87.6297982);

Session.setDefault('heatmapOpacity', 11);
Session.setDefault('heatmapRadius', 0.5);
Session.setDefault('heatmapMaxIntensity', 20);
Session.setDefault('heatmapDissipating', true);

Session.setDefault('choroplethMetric', get(Meteor, 'settings.public.saner.measureScore', "adult_icu_bed_utilization"));
Session.setDefault('choroplethMetricVerified', "numICUBeds_verified");

Session.setDefault('zoom', get(Meteor, 'settings.public.google.maps.defaultZoom', 7));

Session.setDefault('locationsHistoryIsReady', false);
export function IcuCapacityMap(props){
  let initialScale = get(Meteor, 'settings.public.defaults.initialScale', 0.8);

  let [ keyIndex, setKeyIndex ] = useState("mapWaitingForData");

  let data = {
    style: {
      page: {
        position: 'fixed',
        top: '0px',
        left: '0px',
        height: '100%',
        width: '100%'
        // height: Session.get('appHeight') / initialScale,
        // width: Session.get('appWidth') / initialScale
      }
    },
    center: {
      lat: Session.get('centroidLatitude'),
      lng: Session.get('centroidLongitude')
    },
    zoom: get(Meteor, 'settings.public.google.maps.defaultZoom', 7),
    defaultZoom: get(Meteor, 'settings.public.google.maps.defaultZoom', 7),
    layers: {
      heatmap: true,
      points: true
    },
    options: {
      panControl: false,
      mapTypeControl: true,
      mapTypeControlOptions: null,
      scrollwheel: false,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#bdbdbd"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ffffff"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dadada"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#c9c9c9"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        }
      ]
    },
    displayHeatmap: Session.get('displayHeatmap'),
    heatmapOpacity: Session.get('heatmapOpacity'),
    heatmapRadius: Session.get('heatmapRadius'),
    heatmapMaxIntensity: Session.get('heatmapMaxIntensity'),
    heatmapDissipating: Session.get('heatmapDissipating'),
    displayMarkers: Session.get('displayMarkers'),
    displayLabels: Session.get('displayLabels'),
    geoJsonLayer: GeojsonLayers.findOne(),
    choroplethMetric: Session.get('choroplethMetric'),
    choroplethMetricVerified: Session.get('choroplethMetricVerified'),
    mapParameters: Session.get('mapParameters'),
    lastUpdated: new Date(),
    locationsHistoryIsReady: Session.get('locationsHistoryIsReady'),
    locationsHistory: [],
    keyIndex: "mapWaitingForData"
  };

  // data.style.page.height = useTracker(function(){
  //   return Session.get('appHeight') / initialScale;
  // }, [])
  // data.style.page.width = useTracker(function(){
  //   return Session.get('appWidth') / initialScale;
  // }, [])

  // data.zoom = useTracker(function(){
  //   return Session.get('zoom')
  // }, [])

  data.geoJsonLayer = useTracker(function(){
    return Session.get('geoJsonLayer');
  }, [])
  data.displayHeatmap = useTracker(function(){
    return Session.get('displayHeatmap');
  }, [])

  data.heatmapOpacity = useTracker(function(){
    return Session.get('heatmapOpacity');
  }, [])
  data.heatmapRadius = useTracker(function(){
    return Session.get('heatmapRadius');
  }, [])
  data.heatmapMaxIntensity = useTracker(function(){
    return Session.get('heatmapMaxIntensity');
  }, [])
  data.heatmapDissipating = useTracker(function(){
    return Session.get('heatmapDissipating');
  }, [])
  data.displayMarkers = useTracker(function(){
    return Session.get('displayMarkers');
  }, [])
  data.displayLabels = useTracker(function(){
    return Session.get('displayLabels');
  }, [])
  data.geodataUrl = useTracker(function(){
    return Session.get('geodataUrl');
  }, [])
  data.geojsonUrl = useTracker(function(){
    return Session.get('geojsonUrl');
  }, [])
  data.mapParameters = useTracker(function(){
    return Session.get('mapParameters');
  }, [])

  // data.lastUpdated = useTracker(function(){
  //   return Session.get('lastUpdated');
  // }, [])
  data.locationsHistoryIsReady = useTracker(function(){
    return Session.get('locationsHistoryIsReady');
  }, [])
  data.locationsHistory = useTracker(function(){
    return LocationsHistory.find().fetch()
  }, [])


  

  data.apiKey = get(Meteor, 'settings.public.google.maps.apiKey', '');
  data.geodataUrl = get(Meteor, 'settings.public.google.maps.geodataUrl')

  if(has(data.mapParameters, 'populationCode')){
    data.choroplethMetric = get(data.mapParameters, 'populationCode')
  }

  if(get(Meteor.user(), 'profile.locations.home.position.latitude') && get(Meteor.user(), 'profile.locations.home.position.longitude')){
    data.center.lat = get(Meteor.user(), 'profile.locations.home.position.latitude');
    data.center.lng = get(Meteor.user(), 'profile.locations.home.position.longitude');
  }       

  logger.debug("IcuCapacityMap[data]", data);


  
  var reactRenderMap;
  let geoJsonLayer = data.geoJsonLayer;
  let choroplethMetric = data.choroplethMetric;
  let choroplethMetricVerified = data.choroplethMetricVerified;

  //----------------------------------------------------------------------------------------------------
  // Prep the Map Data

  // otherwise, load in the HSA map from file.  
  // console.log('Imported HSA mapfile.', hsaGeoJsonLayer)
  console.log('Mapping LocationsHistory collection to HSA mapfile...')

  // begin by parsing through all the Location records (there should be one for each HSA, and each State)
  if(Array.isArray(data.locationsHistory)){
    // for each region reporting in
    data.locationsHistory.forEach(function(record){
      // console.log('Found a location', record)

      // look up the identifiers
      let identifierIndex = findIndex(record.identifier, function(identifier){
        // and get the index of the HSA identifier
        return get(identifier, 'system') === "HSA93";
      })
      // it should usually by 0, the only entry in the array
      // console.log('identifierIndex', identifierIndex)
      // console.log('HSA93 identifier: ', get(record.identifier[identifierIndex], 'value'))

      if(identifierIndex > -1){
        // then parse the features in the HSA geojson file 
        let featureIndex = findIndex(hsaGeoJsonLayer.features, function(feature){

          // and for each feature, look in the properties.HSA93 location
          // and if it matches the identifier in the reporting location
          
          // then return true
          return (get(feature, 'properties.HSA93')).toString() === get(record.identifier[identifierIndex], 'value');
        });
        
        // console.log('featureIndex', featureIndex)  

        // assuming there is a feature index
        if(featureIndex > -1){
          // grab the index of the extension (purples)
          let extensionIndex = findIndex(record.extension, function(extension){
            // return get(extension, 'url') === get(Meteor, 'settings.public.saner.measureScore', "numICUBeds");
            return get(extension, 'url') === choroplethMetric;
          })    
          // console.log('extensionIndex', extensionIndex)

          // // grab the index of the validated extension (orange)
          // let validatedExtensionIndex = findIndex(record.extension, function(extension){
          //   return get(extension, 'url') === "numICUBeds_verified";
          // })    
          // // console.log('validatedExtensionIndex', validatedExtensionIndex)

          // grab the measure score type
          // let measureScoreType = get(Meteor, 'settings.public.saner.measureScore', "numICUBeds");
          let measureScoreType = choroplethMetric;
          
          // console.log('measureScoreType', measureScoreType)

          if(extensionIndex > -1){
            // if the extensionIndex exists, assign the decimal value from it to the measureScoreType property of the selected HSA zone
            hsaGeoJsonLayer.features[featureIndex].properties[measureScoreType] = record.extension[extensionIndex].valueDecimal;  
            // console.log(measureScoreType + ' : ' + record.extension[extensionIndex].valueDecimal)
          }                      
          // if(validatedExtensionIndex > -1){

          //   // then do the same thing with validated data, but override the averaged data 
          //   // i.e. orange validated data gets precedent over averaged purples data on the second render pass
          //   hsaGeoJsonLayer.features[featureIndex].properties["numICUBeds_verified"] = record.extension[validatedExtensionIndex].valueDecimal;  
          //   // console.log('numICUBeds_verified: ' + record.extension[validatedExtensionIndex].valueDecimal)
          // }                      
        }
      }
    })
  } 

  console.log('HSA geojson layer ready for rendering...', hsaGeoJsonLayer)
  // console.log('data.locationsHistoryIsReady', data.locationsHistoryIsReady)
                  
  //----------------------------------------------------------------------------------------------------
  // Map Rendering

  
  // if(data.locationsHistoryIsReady){
  //   setKeyIndex('mapWithReadySubscription')
  // }
  // // console.log('keyIndex', keyIndex)

  let newDataOptions = data.options;
              
  if(process.env.NODE_ENV !== "test"){



    reactRenderMap = <GoogleMapReact
         id="googleMap"
         key={keyIndex}
         defaultCenter={data.center}
         zoom={data.zoom}
         options={data.options}
         resetBoundsOnResize={true}
         resetBoundsOnRotate={true}
         bootstrapURLKeys={{
          key: data.apiKey,
          libraries: 'visualization'
         }}
         yesIWantToUseGoogleMapApiInternals
         onGoogleApiLoaded={function({map, maps}){


          //----------------------------------------------------------------------------------------------------
          // Diagnostics

          if(process.env.NODE_ENV === "test"){
              console.log('maps', maps)
              console.log('map', map)
          }
          

          //----------------------------------------------------------------------------------------------------


          // let hsaGeoJsonLayer;
          let markerCollection;


          // if we have necessary network connection to load the map
          if(map){

            // if we received a record from the DDP service, just use it directly
            // limit:  16MB graphs
            if(geoJsonLayer){
              markerCollection = map.data.addGeoJson(geoJsonLayer, { idPropertyName: 'id' });
              
            } else if(hsaGeoJsonLayer){

              // otherwise, load in the HSA map from file.  
              console.log('Rendering HSA geojson layer', hsaGeoJsonLayer)

              markerCollection = map.data.addGeoJson(hsaGeoJsonLayer, { idPropertyName: 'id' });
      
            } else {

              console.log('Couldnt find geoJsonLayer or hsaGeoJsonLayer.  Defaulting to static .geojson file.')

              // load HSA boundary polygons from a GeoJson file
              let hsaShapeFile = Meteor.absoluteUrl() + 'packages/symptomatic_saner/geodata/health_service_areas_detailed.geojson';
              console.log('hsaShapeFile', hsaShapeFile)

              markerCollection = map.data.loadGeoJson(hsaShapeFile);
            }

            console.log('Preparing choropleth colorization using metric: ' + choroplethMetric)
            map.data.setStyle(function(feature){
              var metric = feature.getProperty(choroplethMetric);
              var metricVerified;                

              var color = '#ffffff';


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

              return {
                fillColor: color,
                strokeColor: '#164140',
                strokeWeight: .1
              };
            })  

            newDataOptions.zoomControlOptions = {
              position: maps.ControlPosition.RIGHT_CENTER
            };
            map.setOptions(newDataOptions);
          }
        }}
       >                   

       </GoogleMapReact>;
  } else {
    console.log("NOTICE:  You are running in the 'test' environment.  Google Maps and other external libraries are disabled to prevent errors with the automated test runners.")
  }
  return(
    <div id="mapsPage" style={data.style.page}>
      {reactRenderMap}
    </div>
  );
}


export default IcuCapacityMap;