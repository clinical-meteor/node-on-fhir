
import GoogleMapReact from 'google-map-react';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import { Session } from 'meteor/session';
import { Random } from 'meteor/session';

import { get, cloneDeep } from 'lodash';

import { MapDot } from './MapDot';

import { HTTP } from 'meteor/http';
import customGeoJsonLayer from '../geodata/health_service_areas_template';

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

export class SanerHealthServiceAreaMap extends React.Component {
  constructor(props) {
    super(props);
  }
  getMeteorData() {
    let data = {
      style: {
        page: {
          position: 'fixed',
          top: '0px',
          left: '0px',
          height: Session.get('appHeight'),
          width: Session.get('appWidth')
        }
      },
      center: {
        lat: Session.get('centroidLatitude'),
        lng: Session.get('centroidLongitude')
      },
      zoom: 7,
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
      geoJsonLayer: Session.get('geoJsonLayer'),
      displayHeatmap: Session.get('displayHeatmap'),
      heatmapOpacity: Session.get('heatmapOpacity'),
      heatmapRadius: Session.get('heatmapRadius'),
      heatmapMaxIntensity: Session.get('heatmapMaxIntensity'),
      heatmapDissipating: Session.get('heatmapDissipating'),
      displayMarkers: Session.get('displayMarkers'),
      displayLabels: Session.get('displayLabels')
    };

    data.apiKey = get(Meteor, 'settings.public.google.maps.apiKey', '');
    data.geodataUrl = get(Meteor, 'settings.public.google.maps.geodataUrl')

    if(Session.get('geojsonUrl')){
      data.geodataUrl = Session.get('geojsonUrl');
    }

    if(get(Meteor.user(), 'profile.locations.home.position.latitude') && get(Meteor.user(), 'profile.locations.home.position.longitude')){
      data.center.lat = get(Meteor.user(), 'profile.locations.home.position.latitude');
      data.center.lng = get(Meteor.user(), 'profile.locations.home.position.longitude');
    }       
    

    if(process.env.NODE_ENV === "test") {
        console.log("SanerHealthServiceAreaMap[data]", data);
    }
    return data;
  }
  render(){
    var self = this;
    var map;
    var globalGoogle;

    let geoJsonLayer = this.data.geoJsonLayer;

    if(process.env.NODE_ENV !== "test"){
      map = <GoogleMapReact
           id="googleMap"
           defaultCenter={this.data.center}
           defaultZoom={this.data.zoom}
           options={this.data.options}
           bootstrapURLKeys={{
            key: this.data.apiKey,
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


            // let customGeoJsonLayer;
            let markerCollection;

            if(customGeoJsonLayer){
              console.log('How about that.  Import successful.  customGeoJsonLayer', customGeoJsonLayer)
                            
              // customGeoJsonLayer.features.forEach(function(feature){
              //   if(get(feature, 'geometry.coordinates[0]') && get(feature, 'geometry.coordinates[1]')){                    
              //     dataLayer.push({
              //       location: new maps.LatLng(get(feature, 'geometry.coordinates[1]'), get(feature, 'geometry.coordinates[0]')),                     
              //       weight: 5});
              //   }
              // })   

              markerCollection = map.data.addGeoJson(customGeoJsonLayer, { idPropertyName: 'id' });
            } else {

              
              // load HSA boundary polygons from a GeoJson file
              let hsaShapeFile = Meteor.absoluteUrl() + 'packages/symptomatic_saner/geodata/health_service_areas_detailed.geojson';
              console.log('hsaShapeFile', hsaShapeFile)

              markerCollection = map.data.loadGeoJson(hsaShapeFile);
            }

            map.data.setStyle(function(feature){
              var reimbursements = feature.getProperty("numBeds");
              //console.log('reimbursements', reimbursements);
              var color = '#ffffff';
              // var color = '#ff9d1b';
              if((1 < reimbursements) && (reimbursements < 200)){
                  color = '#fff1df';
                  // color = '#ffd090';
              } else if ((201 < reimbursements) && (reimbursements < 400)){
                  color = '#ffe0b8';
              } else if ((401 < reimbursements) && (reimbursements < 600)){
                  color = '#ffd090';
                  // color = '#fff1df';
              } else if (600 < reimbursements){
                  color = '#ff9d1b';
                  // color = '#ffffff';
              }

              return {
                fillColor: color,
                strokeColor: '#164140',
                strokeWeight: 1
              };
            })
          }}
         >                   

         </GoogleMapReact>;
    } else {
      console.log("NOTICE:  You are running in the 'test' environment.  Google Maps and other external libraries are disabled to prevent errors with the automated test runners.")
    }
    return(
      <div id="mapsPage" style={this.data.style.page}>
        {map}
      </div>
    );
  }
}

ReactMixin(SanerHealthServiceAreaMap.prototype, ReactMeteorData);
export default SanerHealthServiceAreaMap;