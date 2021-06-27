
import GoogleMapReact from 'google-map-react';
import React from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import { Session } from 'meteor/session';
import { Random } from 'meteor/session';

import { get, has, findIndex, cloneDeep } from 'lodash';

import { MapDot } from './MapDot';

import { HTTP } from 'meteor/http';
import hsaGeoJsonLayer from '../geodata/health_service_areas_template';

//=============================================================================================================================================
// Analytics

import ReactGA from 'react-ga';
ReactGA.initialize(get(Meteor, 'settings.public.google.analytics.trackingCode'), {debug: get(Meteor, 'settings.public.google.analytics.debug', false)});
ReactGA.pageview(window.location.pathname + window.location.search);
ReactGA.set({ page: window.location.pathname });

//=============================================================================================================================================
// Session 

const AnyReactComponent = ({ text }) => <Card><CardContent>{text}</CardContent></Card>;

Session.setDefault('mapName', false);
Session.setDefault('displayHeatmap', false);
Session.setDefault('displayMarkers', false);
Session.setDefault('displayLabels', false);

Session.setDefault('centroidAddress', "Chicago, IL");
Session.setDefault('centroidLatitude', get(Meteor, 'settings.public.saner.defaultLatitude', 41.8781136));
Session.setDefault('centroidLongitude', get(Meteor, 'settings.public.saner.defaultLongitude', -87.6297982));

Session.setDefault('heatmapOpacity', 11);
Session.setDefault('heatmapRadius', 0.5);
Session.setDefault('heatmapMaxIntensity', 20);
Session.setDefault('heatmapDissipating', true);

Session.setDefault('choroplethMetric', get(Meteor, 'settings.public.saner.measureScore', "numICUBeds"));
Session.setDefault('choroplethMetricVerified', "numICUBeds_verified");


export function SanerHealthServiceAreaMap(props){
  let initialScale = 0.8;

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
      lat: get(Meteor, 'settings.public.saner.defaultLatitude', 41.8781136),
      lng: get(Meteor, 'settings.public.saner.defaultLongitude', -87.6297982)
    },
    zoom: get(Meteor, 'settings.public.saner.defaultZoom', 7),
    layers: {
      heatmap: true,
      points: true
    },
    options: {
      panControl: false,
      mapTypeControl: false,
      scrollwheel: false,
      styles: [
        {
          elementType: "geometry",
          stylers: [{ color: "#f5f5f5" }]
        },
        {
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }]
        },
        {
          elementType: "labels.text.fill",
          stylers: [{ color: "#616161" }]
        },
        {
          elementType: "labels.text.stroke",
          stylers: [{ color: "#f5f5f5" }]
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "labels.text.fill",
          stylers: [{ color: "#bdbdbd" }]
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#eeeeee" }]
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#757575" }]
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#e5e5e5" }]
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9e9e9e" }]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }]
        },
        {
          featureType: "road.arterial",
          elementType: "labels.text.fill",
          stylers: [{ color: "#757575" }]
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#dadada" }]
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#616161" }]
        },
        {
          featureType: "road.local",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9e9e9e" }]
        },
        {
          featureType: "transit.line",
          elementType: "geometry",
          stylers: [{ color: "#e5e5e5" }]
        },
        {
          featureType: "transit.station",
          elementType: "geometry",
          stylers: [{ color: "#eeeeee" }]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#c9c9c9" }]
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9e9e9e" }]
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
    mapParameters: Session.get('mapParameters')
  };

  // data.style.page.height = useTracker(function(){
  //   return Session.get('appHeight') / initialScale;
  // }, [])
  // data.style.page.width = useTracker(function(){
  //   return Session.get('appWidth') / initialScale;
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

  data.apiKey = get(Meteor, 'settings.public.google.maps.apiKey', '');
  data.geodataUrl = get(Meteor, 'settings.public.google.maps.geodataUrl')

  if(has(data.mapParameters, 'populationCode')){
    data.choroplethMetric = get(data.mapParameters, 'populationCode')
  }

  if(get(Meteor.user(), 'profile.locations.home.position.latitude') && get(Meteor.user(), 'profile.locations.home.position.longitude')){
    data.center.lat = get(Meteor.user(), 'profile.locations.home.position.latitude');
    data.center.lng = get(Meteor.user(), 'profile.locations.home.position.longitude');
  }     
  
  if(get(Meteor, 'settings.public.defaults.darkModeEnabled')){
    data.options.styles = [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      }
    ]
  }

  logger.debug("SanerHealthServiceAreaMap[data]", data);


  
  var map;
  let geoJsonLayer = data.geoJsonLayer;
  let choroplethMetric = data.choroplethMetric;
  let choroplethMetricVerified = data.choroplethMetricVerified;

  //----------------------------------------------------------------------------------------------------
  // Prep the Map Data

  // otherwise, load in the HSA map from file.  
  console.log('Imported HSA mapfile.', hsaGeoJsonLayer)
  console.log('Mapping Locations collection to HSA mapfile...')

  // begin by parsing through all the Location records (there should be one for each HSA, and each State)
  if(Locations.find().count() > 0){
    // for each region reporting in
    Locations.find().forEach(function(record){
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

          // grab the index of the validated extension (orange)
          let validatedExtensionIndex = findIndex(record.extension, function(extension){
            return get(extension, 'url') === "numICUBeds_verified";
          })    
          // console.log('validatedExtensionIndex', validatedExtensionIndex)

          // grab the measure score type
          // let measureScoreType = get(Meteor, 'settings.public.saner.measureScore', "numICUBeds");
          let measureScoreType = choroplethMetric;
          
          // console.log('measureScoreType', measureScoreType)

          if(extensionIndex > -1){
            // if the extensionIndex exists, assign the decimal value from it to the measureScoreType property of the selected HSA zone
            hsaGeoJsonLayer.features[featureIndex].properties[measureScoreType] = record.extension[extensionIndex].valueDecimal;  
            // console.log(measureScoreType + ' : ' + record.extension[extensionIndex].valueDecimal)
          }                      
          if(validatedExtensionIndex > -1){

            // then do the same thing with validated data, but override the averaged data 
            // i.e. orange validated data gets precedent over averaged purples data on the second render pass
            hsaGeoJsonLayer.features[featureIndex].properties["numICUBeds_verified"] = record.extension[validatedExtensionIndex].valueDecimal;  
            // console.log('numICUBeds_verified: ' + record.extension[validatedExtensionIndex].valueDecimal)
          }                      
        }
      }
    })
  } 

  console.log('HSA geojson layer ready for rendering...', hsaGeoJsonLayer)
                  
  //----------------------------------------------------------------------------------------------------
  // Map Rendering
              
  if(process.env.NODE_ENV !== "test"){
    map = <GoogleMapReact
         id="googleMap"
         defaultCenter={data.center}
         defaultZoom={data.zoom}
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

              // //---------------------------------
              // // green/teal scale
              // if((1 < metric) && (metric < 40)){
              //     color = '#E4F3D8';
              // } else if ((40 < metric) && (metric < 50)){
              //     color = '#CAE6B2';
              // } else if ((50 < metric) && (metric < 60)){
              //     color = '#AFD88D';
              // } else if ((60 < metric) && (metric < 70)){
              //     color = '#95CA68';
              // } else if (70 < metric){
              //     color = '#7ABC43';
              // }


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




            //   //---------------------------------
            //   // blues scale
            //   if((1 < metric) && (metric < 20)){
            //     color = '#DAEAF6';
            // } else if ((20 < metric) && (metric < 40)){
            //     color = '#B0D3E9';
            // } else if ((40 < metric) && (metric < 60)){
            //     color = '#8EBEE6';
            // } else if ((60 < metric) && (metric < 80)){
            //     color = '#4F92C7';
            // } else if (80 < metric){
            //     color = '#106F9F';
            // }


              // //---------------------------------
              // // greyscale
              
              // if((1 < metric) && (metric < 20)){ 
              //     color = '#eeeeee';
              // } else if ((20 < metric) && (metric < 40)){
              //     color = '#cccccc';
              // } else if ((40 < metric) && (metric < 60)){
              //   color = '#999999';
              // } else if ((60 < metric) && (metric < 80)){
              //   color = '#858585';
              // } else if (80 < metric){
              //     color = '#666666';
              // }
 

              // // //---------------------------------
              // // // orange scale overlay!!
              // if(feature.getProperty(choroplethMetricVerified)){
              //   metricVerified = feature.getProperty(choroplethMetricVerified);
              //   if(metricVerified){
              //     if((1 < metricVerified) && (metricVerified < 10)){
              //       color = '#ffdcae';
              //     } else if ((10 < metricVerified) && (metricVerified < 100)){
              //         color = '#ffca85';
              //     } else if ((100 < metricVerified) && (metricVerified < 1000)){
              //         color = '#ffa733';
              //     } else if (1000 < metricVerified){
              //         color = '#ff960b';
              //     }
              //   }   
              // }
         

              return {
                fillColor: color,
                strokeColor: '#164140',
                strokeWeight: .1
              };
            })  
          }
        }}
       >                   

       </GoogleMapReact>;
  } else {
    console.log("NOTICE:  You are running in the 'test' environment.  Google Maps and other external libraries are disabled to prevent errors with the automated test runners.")
  }
  return(
    <div id="mapsPage" style={data.style.page}>
      {map}
    </div>
  );
}


export default SanerHealthServiceAreaMap;