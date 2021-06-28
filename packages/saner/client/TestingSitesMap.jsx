
import GoogleMapReact from 'google-map-react';
import React from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import { Session } from 'meteor/session';
import { Random } from 'meteor/session';
import { HTTP } from 'meteor/http';
import { EJSON } from 'meteor/ejson';

import { get, cloneDeep } from 'lodash';

import { MapDot } from './MapDot';

import customGeoJsonLayer from '../geodata/health_service_areas_template';


const AnyReactComponent = ({ text }) => <Card><CardContent>{text}</CardContent></Card>;


//=============================================================================================================================================
// Analytics

import ReactGA from 'react-ga';
ReactGA.initialize(get(Meteor, 'settings.public.google.analytics.trackingCode'), {debug: get(Meteor, 'settings.public.google.analytics.debug', false)});
ReactGA.pageview(window.location.pathname + window.location.search);
ReactGA.set({ page: window.location.pathname });


//==============================================================================================
// Session Variable

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

Session.setDefault('myLatitude', 0);  
Session.setDefault('myLongitude', 0);  

//==============================================================================================
// Environment

Meteor.startup(function(){
  window.navigator.geolocation.getCurrentPosition(function(position){
    console.log('Determining initial position.', position)

    let lat = get(position, 'coords.latitude', 0);
    let lng = get(position, 'coords.longitude', 0);    

    if(Number.isFinite(lat)){
      lat = lat.toFixed(6)
    }
    if(Number.isFinite(lng)){
      lng = lng.toFixed(6)
    }

    Session.set('myLatitude', lat);  
    Session.set('myLongitude', lng);  

    console.log('Current latitude:  ', lat)
    console.log('Current longitude: ', lng)
  })  

  HTTP.get('/latest-known-testing-locations', function(err, result){
    if(err){
      console.log('HTTP.get.err', err)
    }
    if(result){
      console.log('HTTP.get.result', result)

      let parsedResults = EJSON.parse(result.content);
      console.log('HTTP.get.parsedResults', parsedResults)

      if(Array.isArray(parsedResults)){
        parsedResults.forEach(function(result){
          TestingSiteLocations_Quickload._collection.insert(result)
        })
      }      
    }
  })
})

Session.setDefault('testingSitesAreReady', false);

//==============================================================================================
// Main Component

export function TestingSitesMap(props){
  let initialScale = get(Meteor, 'settings.public.defaults.initialScale', 0.8);

  let data = {
    style: {
      page: {
        position: 'fixed',
        top: '0px',
        left: '0px',
        height: '100%',
        width: '100%'
      }
    },
    center: {
      lat: Session.get('centroidLatitude'),
      lng: Session.get('centroidLongitude')
    },
    zoom: 12,
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
    displayLabels: Session.get('displayLabels'),
    chiTownLocations: TestingSiteLocations.find({'type.coding.code': 'OUTLAB'}).fetch(),
    pharmacyLocations: TestingSiteLocations.find({'type.coding.code': 'OUTPHARM'}).fetch(),      
    testingSitesAreReady: Session.get('testingSitesAreReady'),
    outLabLocations: [],
    defaultLocations: []
  };

  data.apiKey = get(Meteor, 'settings.public.google.maps.apiKey', '');
  data.geodataUrl = get(Meteor, 'settings.public.google.maps.geodataUrl')

  // data.style.page.height = useTracker(function(){
  //   return Session.get('appHeight');
  // }, [])
  // data.style.page.width = useTracker(function(){
  //   return Session.get('appWidth');
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
    return Session.get('geojsonUrl');
  }, [])
  data.testingSitesAreReady = useTracker(function(){
    return Session.get('testingSitesAreReady');
  }, [])

  if(get(Meteor.user(), 'profile.locations.home.position.latitude') && get(Meteor.user(), 'profile.locations.home.position.longitude')){
    data.center.lat = get(Meteor.user(), 'profile.locations.home.position.latitude');
    data.center.lng = get(Meteor.user(), 'profile.locations.home.position.longitude');
  }       

  data.outLabLocations = useTracker(function(){
    return TestingSiteLocations_Quickload.find({'type.coding.code': 'OUTLAB'}).fetch();
  }, [])
  // data.outPharmLocations = useTracker(function(){
  //   return TestingSiteLocations_Quickload.find({'type.coding.code': 'OUTPHARM'}).fetch();
  // }, [])

  data.defaultLocations = useTracker(function(){
    return TestingSiteLocations_Quickload.find().fetch();
  }, [])

  function getPinIcon(color){
    let icon = 'data:image/png;base64,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JdM99pSg6f+CKQL/iaf78Ck5AlDlBUDUegBCkB5lPzKMECYh18k2KdILwHZ28vFPSZLsbKdjkZBuE/NxYuKdNgC4ZgC+iicmxvdNTHw9jCz2AQAtGdO9/aSwyB9PsQlNQzGiA+5cD/5F/wDjsRlLgZG5+wAAAAlwSFlzAAALEwAACxMBAJqcGAAABCRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjA8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjQwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj40MDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOlNlcS8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjA6MDY6MjMgMTE6MDY6OTg8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy44LjQ8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Co/+CH8AAASHSURBVFgJ7VlvTJVVGH/fpuBWcO8Hh8jFG0EBsvDPFU0ZTq7lFU1imXXNspqbzj646RdnG31oudVYG7XWSmkurbE0NsXaSmtdCCSmdBNHSbTUXeAKhnovygprezs/xnN3Ot3znvPC1u4H2eB5nz+/3/lxznuf5wwMy7LeYd+FRop9QRO0GakojvYqlbWRxrt22jtgTpehtePc4r7LV7zx+C33wNWRmeDLnTv7L5crI1b4QF5kVfnSH6ezxpQEhkKhGdHY2Lau8M8b2OI+0zQ8yURYljHI4uEyX8kXOe57D/n9/r+T1dnFHAsM9/yysKn5y71/jt/ZYkcs5malpzVuqllX53u4qFvM2fmOBHZ2na842nz6dbZjlSKpZVi3TcscRtwyrTmmYd73nxrLaAnWBF5dXraoXczJfG2B2LmPjza/LYpzuzJDK1f4Tj/k9Z71eOb0Y6HBweF5v0Yiy9q+Dwdi8VE/vzg79patwZrdujupJRDv3Ncd3YeFY71Wvbby3crypQdN07zGi6Bn1mizWjrO7fj8VMsuFsuiOI57TfnCF3XeyRkEsrPRG2PbRHF7dr5QOy8nu8EONyl8f390aLj+gyP7We2ESHAxzlbmH7TDI3ePqgD5H87/9Dhfh51TiePrUQsMHxM5+Rz/rBT4zXedCyzDXEIgvHM4VvJ1LTDAUj04wU2+zCoFXor0e/k+hw+E7J2TLYI4MMBSDTjBTb7MKgXejI+6CIxWgk8r+U4tsOAg3M34WIKbYqJVChyKjiQ+SOhz1EpEIh0fWOqVqB+KDie4ZXilQMswHI8n2WJiXIdbKdCTkzVKxJgQaMLkO7XAgoNwPDfFRKsUWOCdG2EN9yqAGF+YECKJrg8sjUBwgluFVQrcWF3VzcbNBSJq6wwHMCHI17XAYPRRPTjBTb7MKgUCmH9/bqJ/xWKjfowvGaEsDgw/l3lOGQZxLYG+RaXNrLaHiDBb2fjaTr7KonZyHlNpzyQn+VKrJbC8bEFvdvbsExxLFmZr6ExXrd1xIxc6c7aWn8PgyM/znAAnxyd91LrNAN3Xd2X++58c+5QB/jWe3G523Vpexq5bucJ1a2BZW2dXAK8EvzprLRdefv6ZzYWFeRf5uOxZWyAIGhqb9l3svfRGMjKdCytw84vzX9m+ZdObyTiSxbSOmIDBDYEGdpc7RT5vJ9qHaRSwXlRArYTP4xlYcIhxO9+RwMzMzOs1VY8eYO/W73akyXLAPPvkugPgSJaXxRwJBMkjS0qPlxQ/6GgXgAOmtKToOJ6dfDkWCPJg9Zr69FlpJ3UXQi0wuvV83ZQEsmMaeWnzxrcYUaI38qTCcw9qgRHiWu6UBIK5KN/b9ljlinr+fieuiBxqUCvmdP0pC8QC61evPFSQ531PthhyqJHldeLTEogFtj61vs7tymgUF0MMOTHu1FfeaFWELpfrxm8DA699+FHTH+Pjd1ajPj097dvngtV1yKnwqryjSWJH1t7em/HZVydXoebpqidaKyqKb9nV3839bzvARlDK/YWffvkJbexHSv4bgkT+A8rQvhsVn0lWAAAAAElFTkSuQmCC';

    switch (color) {
      case "red":
        icon = 'data:image/png;base64,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JdM99pSg6f+CKQL/iaf78Ck5AlDlBUDUegBCkB5lPzKMECYh18k2KdILwHZ28vFPSZLsbKdjkZBuE/NxYuKdNgC4ZgC+iicmxvdNTHw9jCz2AQAtGdO9/aSwyB9PsQlNQzGiA+5cD/5F/wDjsRlLgZG5+wAAAAlwSFlzAAALEwAACxMBAJqcGAAABCRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjA8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjQwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj40MDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOlNlcS8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjA6MDY6MjMgMTE6MDY6NDI8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy44LjQ8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CqxNKcsAAARUSURBVFgJ7VlNaBRJFK6a7pDRSdJtYsagrhfdHPyLP5DTgtGDCJrBEEXwIgi7l0XwJAp6SkAJgruIBxWEvQTEhMHJeNCDRvSUg5ph2IMEFUVMJon2jLYmZmbK+uLUWHb6dyI4BxtCVb33vq++qa56r+jQqc4D/zJVudQcv/6UVNEz2XWoleYLfxN0qkjXd1KqWdt3Qn8NFrMCdDFgYDOx7q1FRtfMzhX0MTNbA9u6iDZXW6MYIcpeRhODj2Gr9KlIIOvoUDMNTUfThrGPT7yNErrKTgAj7DW3P9qo68lobvoaHR7O28W52QILfLfvUNtT0zhhFgqH3Yitvoii9LdG9L5lyeujVp/bOJDAt50H/3hivOshlHRYSYuEfaCUTsDOGFsRIrTOGkMYGd6iLzvTOHTj4QKfg8G3QKzc4+z0P1Zx0fCSey214Tucf6TIiq8wT4iGfuNN+/jszO7MzKedsJUfLnKr1nTc70r6Eog9N0Jr/5NfK+Pno61Bv5ivKVxpicczZQFSZ7yrK6rOKX+N5oxjfKKocOF1t7PZI372pCpAbi0OhGlky3sO4jbr2unliYGrbriS8N7JWPdEysj2CpH4oRm96T7HXnHDwxfyCoA/bWT3ynFYuebEoKs4OR6xwMg2K6fsk/ueAidi3Zv5tt8uQNhzeK1i7LcFBthv8Wz7V+5vFruep0DGk7Cc53AgnPac3QTCBkzpMM2bwAlu4XdqPQWa+c+aACOV8P6IGFfQjpQ45qEz+UKZ24nLU+Bz0ywfJOQ5kUqcCN3swIpcibgxM1fmdsJ5CuTAwOXJaTIbuye3p8DfI3U5QTxfIb4mYWEK1CKBg0OAZG5hs7aeAsNK6GWRkDcAlspXu5UkwLhdlEBwgtsL6ylwRTKO4p4SRChfqBBi7LcFBlgpPlXilkwLu54CAdlQr5fzF2orytdCKncLMHJdljndkL4E1oTYTU6SFkSorbx8/SnGXi1igZHi0iVOyWTf9XVZAPTFnv09zz5+OC1oFnNZWN+g97YkB84ILrfWMw8JcJ1C+7moGP9FvPQRfusi0VTO6OHla9dU50H765aJ69b7nfIqcI6Uygr9gterlbFesWS8s/vk/9nsWbtAXxdWDlyvaadahgbP2XHY2XztQQHMq8WrEUW9LcZyi/RBGVmLP5FKZD/6wILDancbBxK4Oh6fXhupv8xf06QbqZ0PGGDBYed3sgUSCJLlyRvxDVpDoFUADhhg0Q/yBBYI8iKZu7BUURN+J0IsMH7j5biKBK4cGppqXVp3nhOVc6NMaumnEQuMxe5rWJFAMDfeGniwUdcuyPc764zwIQaxVp/fccUCMQH/rHFtU71+yWky+BDj5PdjX5RATBDOh/qi4fCCxAsbfH5EuMUEStRORPjQOGZkT3wq5HchZomi3l2na30/4qvtDxEIUZOxWP3oW3MH+m2NkfvNicR79H89P30FqvlD9bw2/BuimkV+ARLXpaSQhBHFAAAAAElFTkSuQmCC';        
        break;
      case "purple":
        icon = 'data:image/png;base64,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JdM99pSg6f+CKQL/iaf78Ck5AlDlBUDUegBCkB5lPzKMECYh18k2KdILwHZ28vFPSZLsbKdjkZBuE/NxYuKdNgC4ZgC+iicmxvdNTHw9jCz2AQAtGdO9/aSwyB9PsQlNQzGiA+5cD/5F/wDjsRlLgZG5+wAAAAlwSFlzAAALEwAACxMBAJqcGAAABCRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjA8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjQwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj40MDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOlNlcS8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjA6MDY6MjMgMTE6MDY6NDk8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy44LjQ8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CnYre/kAAARxSURBVFgJ7VldT1xFGJ457OFLGihfGk23tMsC9sJqaWkTl7ZLTG80/gBvTEz8xI1eEU3apAkkGmJSm80apUmT3nDb1JgYvZBuoTeUftA0FaTYCEplgQJaC7JwxnnOMrvj8cz5YJu4Fz0JmZn3fZ9nnjM7876TAx2MjZwmRiDRnnj+J1JAz2DnjSairXcSs1NAwmQphaxN1vm4n9cK0LzQHJyMXXmBGiS4kv67anr5rg6+HZW70mV6yRLTyNSR+IHr+cyxJYEDJwcC2nzFGxNzY68wQvZpRHvGToRBjN/4BNfCdS3fGLUPzkZPRtft4pxsvgUOxq7tnVq627W6tvqaE7HVV1pc2h+s2tXbHt83avU5jX0JHPpgJDL2+1g3JfSoldRg7AGldBZ2xtiTGqUV1hhG2MWWp1pORE7vH7L6VGPPArFy46nbn1vFbX+iZqCmvPZ7Qugw0dLT5kSGvoPLbFt4OH9s8a+FqDw5RDbX7/nQ60p6Eog9NzN5/9y/flbKUo11LfFAWu978cu9KVmE6F9+Z7R+XU+/dWduLEYYrRd2/NxPh6pf97InAwLk1OJArK7N5PYcFxeue/b44XjrGSfcpvCeS7GrsxNzP/YIkXhRzpnk2D4nPHyaWwD8E6nxl+U4rJybODkescDINiun7JP7rgIvvXv1OUZZqwBhz+FnFWOvLTDAinhwgluMVa2rwA1tPSjnORwI1Z5TTQI7MJnDlIkCJ7idMPC5ClxZW60UJEgl5mkVBt8tHc5wZIBrGzluFZWrwJnl6exBMvOcSCUqRic7x4pcibDp+zluFcxVoEGZ7/Kkmsxq98LtKnBnVcMfghgVgphJWFh8thxrcmzCZG4Vk6tAvbh4iu+beyDIlC/WpiJzt7M2UQLBCW43jKvAjvjBUULJTUGE8oUKIcZeW2CAzcZzTpM7a7DvuAoErLE6nM1fqK0oX/Z0aiswcl2WOdUoD2nGBBcVXeBF/pYgQm3l5etNMXZrEWvW481Ak4tzuuHg93RZQOC3bye7Z5Z+PY6++eRxWdhdG+qJJg6dEFRObTbHOQXBV15U0c9vz6/yN8qUJ347uZMa7+blqyP5/ojtdWv24b1ji4u4buXWgXPc1Jje7zaf8OeQwuLQDrw3/NHPCxOf2IWgQogkrLqwAre7Jvxx9Iu2T+047GyeDokAblB2pjRQ/p0Yyy3SB3/bEP5EKpH96AMLDqvdaexL4EuJgwvBquBXjBhzTqR2PmCABYedX2XzJRAk7YnW8421Tb5WAThggEXfz+NbIMhZuuhUiV76tdeJEAuM13g5bksCo3375xu2N3wm50aZVO4jBrHAyHav/S0JBHkk3jrYXN98Sr7fWSeFDzGItfq8jrcsEBO0xw+cbawLJ1STwYcYld+LPS+BmKCkeKO3urzmP4kXNvi8iHCK8ZWoVUT40Di1PNm1kl7pQEyZXvZDsDLU+yi+2j4SgRA11DW07fYvk0fQ37MzlIz0Rv5E//Hzv69AIX+oNrXh3xCFLPIfgiq+71dWiAIAAAAASUVORK5CYII=';      
        break;
      case "blue":
        icon = 'data:image/png;base64,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JdM99pSg6f+CKQL/iaf78Ck5AlDlBUDUegBCkB5lPzKMECYh18k2KdILwHZ28vFPSZLsbKdjkZBuE/NxYuKdNgC4ZgC+iicmxvdNTHw9jCz2AQAtGdO9/aSwyB9PsQlNQzGiA+5cD/5F/wDjsRlLgZG5+wAAAAlwSFlzAAALEwAACxMBAJqcGAAABCRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjA8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjQwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj40MDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOlNlcS8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjA6MDY6MjMgMTE6MDY6MTg8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy44LjQ8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CmGtoI8AAARiSURBVFgJ7VldSFRBGJ3JrdYsLSUlK9M1zVjI/pUIyhUsqB6kl4ooSiwogvAhCgyEgkIqjTBQyaiHfp6s6KXAVSkiKoykyKysrLRVs8jUraxpzuYss3f33jtXg/ahffnm+zlnjnPvft+opIaxkyWMpZMw+0ATtJFwFCfOKpy1CY3/7ahPgI6WoeA1W9DbMpD0vbdr8peOtrHgi050/BgXG/85NmNC+5lk+nA0e4xI4Mp6ZptqI9s9991rKWMLCaXTQ4pg7D2jtClhiet69xCpacihQyHrDIKWBe78xDKfX7y776d3YJMBb1Aqwj7hQtrG7NLKKfRRUNIgYEngjg62/NmlukOE0JVaTkbIV8qIB3FGSQInnqit4ZmGORtyD1Yl0tvBudARZYE4uZazdeVaceMnJ9TPWOG8Gesg9+yEvMU2XkJm9raRpe8an+R9++zJCdyaNWRsy92repJKAvHOjXl695z8WBkjXan5rlOzUkhVCaVdgSL+eLzRxr95RXa8rHXvoZTEixo87l9zs7eqvJM2ATKy+EJ0Se8cxC0uchWfoLTaCDcs/HARY54HJ9yHhUj8oPE20sixVUZ45MaYFSDvuedeI9fh5MzEyfWoBUaOaTnlnLw2Fbilhc2jhC0SILxzeKzCV7XAACvqwQlu4etZU4F9bwaS5D6HL4TeO6e3CeLAAOuv4b3Tx+0PhF6YCvT2fIgRULQSfFuFb9UCCw6B837q9nOLmNaaCuzvfOX/IqHPiVaiJVLxgRW9EvX97174ufXwpgI50PJ40tssRNyU21Rg1My0L4IYEwJNWPhWLbDgEDiZW8S01lRgdHJSO2OsE0De1SdiQmhJVH1gwYF6cILbDGsq8HKWb7g3CyKML0wI4ataYICV6puHuaVQ8NJUICAxqfP9/QuzFeMrmMo4Aow8l2VOI6SSwGlL464SRh4LIsxWPr4KhW9mUQuMv45z+Tj9Af2FkkB+PWqJSky5ImgwUzFbC9pYsdHjRm4br5HnMDhiZmdeAafgM7JKtxkQ7P3G5jZVuC9xQMB48l23cvh1K1lz3XrNr1v1wdct3qibF+52bSgfT58aCRM5ZYEA5N8Y3N/75M4RAZYtJoRowvoXVkJincsO1K6KPCpjjdZKj1gQZOTZq232qBvCl62vfVCSyntRqm8tJ4fXwIIjREo3ZEngEUo/OtZnVfL7YLcuo04CmIzNWZXg0CkJGbYkEAzVCbQ2zrnM0ikAB0xFNK3F2srHskCQO1bZy/i1/ZrqRqgFRrVerhuRwOOU9jgLs4/JvVEmDVjznodaYALiis6IBIL71Fh6a9ZqV5l8v9PuiRxqUKvNqfojFogNzjtpzZTZmRV6myGHGr28SnxUArGBY11cKW/WF7SbIYacNm7Vt9So9cj5rE1/eBp/Dhl0oSbCHulesCu7lP8216qHUY3/FYHYbHs3m9R6vm4F1ulbchtrptI+rP9//vkJ8CtR2P2FXxyKT1u4/htCiPwN6g+bnqKLE3IAAAAASUVORK5CYII=';
        break;
      case "green":
        icon = 'data:image/png;base64,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JdM99pSg6f+CKQL/iaf78Ck5AlDlBUDUegBCkB5lPzKMECYh18k2KdILwHZ28vFPSZLsbKdjkZBuE/NxYuKdNgC4ZgC+iicmxvdNTHw9jCz2AQAtGdO9/aSwyB9PsQlNQzGiA+5cD/5F/wDjsRlLgZG5+wAAAAlwSFlzAAALEwAACxMBAJqcGAAABCRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjA8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjQwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj40MDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOlNlcS8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjA6MDY6MjMgMTE6MDY6OTQ8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy44LjQ8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CvzTOnwAAAR6SURBVFgJ7VlbbBRVGD4DO5JpS6/brbJ0221Ti3ghCPFJBRolRoy+mxgTE3ghpIZAI4bChG3ELJUVVx4oCcaXvhKMGiVGSuGJGIm1UaGBbttU02W5uKWd6K4czzfuGWZndmbObEncByZpzvkv33e+npn5/5NZ6RD99JhGsscPS+9fJRV07aMfPK6Q2p0EkwrSVSSlkrUVCX1oLGUHpKWAgd210L/+77QW0W5q9X9O3pLhq4s25pQm5c4jIWU6WR27DF+5V1kC1XNqILM2987MhcnXKKHPStKycCkBlN6blYj0Y+sL0S+Dv8in1C1qvlSem8+3wN13D62bGr3el9dyb7oRW2MBRR5ue7EjfrTmwE/WmJvtS2Cvpj6f+moiRiSy2UZK6V3mn9P9lLQQSaqx55CR9m1d/ccU9aIt5uAQFoidu/bNlY+t4qqCVedC68Nn5ZXLL0lkxQzWoeSv1tz8P8+lL89uXcwsbilam5KRzle63xXdSSGBeOZ+1lKfW25ruv2ljqRcWzs0KO1NF4koGHvokVAum92R+u76LuYK8Rzc7qeV9rdFnskAB7mNeCHyF4ueuXTXG2v2Dwb6T7rhCsIH9uRjcxNnfhtgubpI/KOZDbnzzB5ywyO2zCsB8ZnR1DZzHnbOS5w5H7nAmH1WTnPMPPcU2HtLfYZK9zZwEJ453FZui47AAMvzwQlubjuNngIX5xci5jqHF8LpmXNaBH5ggOU54AQ3t51GT4Ha3EKdAWalBG+rYfuc6FiUo8KlZUzc3GkZPQVmp2/ff5FYneOlxMIjZOpYXisZIjtp4nZg8BRIqOS7PTmsZXcLcHsKrOuozxrMrEOgCBu2z4mORZcpXEXc3GkZPQXWr26aJpT+oeNY+0KHsHAImzqWt0DGqXN7oD0FJltiaO5jnAftCx2C26IjMMCa8scK3CaXfeopEJDg2majfqG3on3Zqdw9wJj7spnTDSkksH51wxlGMs6J0FtZ+9rOba8RuYV+zFPHC5zcdhyFDgtAv3VpZyw7c2e/iSndvrUrKddU+z4sND4ZGvhsTaLfxOU4vV/jHFP+Czy27tFhVhNfZ+c83p5CqbMTMda+enqzasnj1uzo1RLHLTrWHG0c9ljOCAvvIBA7pva+N/fD74cNtHkicmBl+S0bV+0bajvyoRnqNhd6BjlBU6ThZKBK/pbbRaNePqROQtgfLyVFCYQACw6L29X0JZB9HrkZ3hQ9QSm94cpaIghMpCd6Ahwlwo4uXwLB8knVwdOrNoZ97QJwwCRWHDyNuZ/Lt0CQV7dVJ2Ql8IXoQsgFRjTfnFeWwI8kNdP6cucgIzJqo5nUMh9HLjAWv5BZlkAwJ+QDFyI9HQnWp43znW1FFkMOcm0xQUfZAsGfbIidCj7VctxpLcSQ4xQX8S9JIBao7a6LK0HFVnjhQ0xEhFuOr0LtRLSbfQSd+voK+xyS70FOQAl83/Zqd/zoA/hq+0AEQlTfjb6Vv47MbsL8ic3h8/Hm+DzmD6//fQcq+UO1rg0/Q1SyyH8BwaqoDIrpKTAAAAAASUVORK5CYII=';  
        break;
      case "yellow":
        icon = 'data:image/png;base64,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JdM99pSg6f+CKQL/iaf78Ck5AlDlBUDUegBCkB5lPzKMECYh18k2KdILwHZ28vFPSZLsbKdjkZBuE/NxYuKdNgC4ZgC+iicmxvdNTHw9jCz2AQAtGdO9/aSwyB9PsQlNQzGiA+5cD/5F/wDjsRlLgZG5+wAAAAlwSFlzAAALEwAACxMBAJqcGAAABCRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjA8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjQwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj40MDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOlNlcS8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjA6MDY6MjMgMTE6MDY6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy44LjQ8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiGuCZMAAARJSURBVFgJ7VlbSJRBFJ7J1XLXy9plXQsTLXvTbmBkG90NKnrroXtI+Rb0FAX1pFBEYBE9aCBdjeihCxFopUWG2EMX6SFCjBLRXZVEcykvTefs7Lizl/+f+XeD9sEB+WfOOd83387lnH9XwtjRy4wdWkaSrKEm1EaSUZxYq2TWJjTOPBNeAZooA5yTlcOj/sVDvnFnV/dIKvItLcqamOdKG3Zm2r9TevN9InPEJZCxjbaJP+7K1hf9uwihqwgli2KKYKSXEPZu0xb3k9RZ/Q2UvpyMGWditCyQsQPL29r7T/rHpvaZ8Ea57I6URs9a9wVKb3+McpoYLAmE7fQ0PeupppRsjOJk5CejxIt2ykgurGpGZAxj5OX2bflnYdvbIn1GY22BuHJNz3ovRYpzuWa3riid10xI2lvYzh4+Ec0nZLzsQ+dQhc/3e5M8ORe56ITuSmoJxDPX1m67EbGtvoqteVcISamn9JZPFiH6jB10ETJV1fy87zjYoM8b3+7Jwzpn0iZAZk+8EP4xr3zmQFzBGUqvXzPDBYXXMHbE2/z8Ww3EBkTiBwXOVzCuN8Ojb5YqAP0tL7w75ThcOZU4OR5j+WqHrJGcIU94TymQsb2lcA5WCxieOdxWMdZ/ptRzLEcgJ3Kr8EqBP0YnFst5Di+E0Zkzmwwx/DIFoyB3BrjNQOBTCvR5f2VPc0Aq4bd12mKxAzc9wMFhQwMStwGTUuDX7p/TF4nnOZFKDBhNzaxH5EoM6+oKcRvBlAIZIZbLk9FkkXYdbqXA4uKMEUEcqBAEk3C8jeZzDo6XuY0YlQILCh3fGWN9AYJA+RovMyJT2wEbLIHIidwqjFJgGr0HxZ12CiIsX7xCCIveEzGIDUXTTs4dssTqKQUiqKTECbmPN15bp6rEWP85VSXXZZnTjENL4EL3nEeQHj4JIqytUL6OibHqibHBesxDgSvAqQKCX0sgpXc/FxY5Hkp8LqytjO07Y7bd6MMYuQ4jR0lpzkPklPgMu9M5zjAi6ChektPY/XVsN5QoUZ5AZF81lK/NjO03eN0aiH7dIqQzL9fRqJpP+GE+/TY8sudUR8fguZgIjRdWxK1ZM/+0M+v++ZgcMYxaWyxw2Znp1+x2W5MYhz0hfcCnXYJ/IpWE+WGAWOSItJuNLQmEV/UhT7mrDnLYgBlpLB9iPOV5dcgRy29ksyQQSSi986B87XxLq4A4xIC4B9i30iwLRPLMjNTa9HTbY92JMBYxuvFyXFwCIUUMrl+Xe1HOjTJpWB9yHsYiJsyuOYhLIHLDt7LXFdsW1srvd1Fzws3GGIyN8mka4haI/HAeG0pXOK8azYU+jDHy69gTEogTuBfMveByzYlKvGhDn44IsxhLidqICH9obHvTd9Lvn9yMMZDvWjzr8uBnjptfjDC69n8iECdjrDLzaXP3BuzvqCh6RWnDKPZn2n9fgWT+oTqgLVn/DSF27i8cR5Qt4CzwKwAAAABJRU5ErkJggg==';
        break;
      case "orange":
        icon = 'data:image/png;base64,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JdM99pSg6f+CKQL/iaf78Ck5AlDlBUDUegBCkB5lPzKMECYh18k2KdILwHZ28vFPSZLsbKdjkZBuE/NxYuKdNgC4ZgC+iicmxvdNTHw9jCz2AQAtGdO9/aSwyB9PsQlNQzGiA+5cD/5F/wDjsRlLgZG5+wAAAAlwSFlzAAALEwAACxMBAJqcGAAABCRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjA8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjQwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj40MDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOlNlcS8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjA6MDY6MjMgMTE6MDY6NjU8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy44LjQ8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cj6So8YAAARQSURBVFgJ7VlfSFRZGD/fODqajk5YE7JYa9GC1EyYaeQOm7qyu9Cft156WQh2X5agpyioJ4VdJLAIH0wQ6sHX2D8vLW3q7pSgta0zQuCyEUprWu5Omf91Tt93Zs5w5jr33nNHoXnogpzz/fn9zo8z93zf4Qp8oOEaW3F1Qkt4jOXQw++GPmH58e+YmOSQMFVKLmtTdX6Yb2gHYENoBPOBIzXsdXznypsl35OJpXziq670rOSXemKszDUORwcfb2SNrATyvkY3W144E3k8exwlHgQXfJRJBI/z54zBn8Ea7y+soKgHmvpXM+VZ+RwL5PdCB55F/z8/u8RPWxEbY14P9H4c2NoOzeERY8zKdiSQ94VC0eGZVtyVRiMp7tZbAJgiP+d8B+5qiTEHI/2BuvLL0BQOr49l9mgLpJ2LPpy5ahRX4cvv27Zny6/MDUOMrU0klsmrZKu8/tU/819Mxlaa0pdGkYfKz+nupJZAeueeRV7eNPys04Fa33W2ym7Alw+m00UkLH6nwc/c7Nvoo9hZ9Phljvi5g9u/1nkn3RJkOeKBWCeu3ncJGh90W+GSwtt4f8NUdCjWhrlCpOBaXhhA+4YVnmIuuwSKR/6aPabm0c7ZiVPzKVfstuI0ciqhtKmtQH73cBDf+lqJoneOflZpa4+IEVgJQE7BLW2T0VYgm+c71TpHB8LsnTNZQ7gJIw5TMklwIrcVhmK2Ahf/Wy6TJFRKEqdVehyOeNIFRxK2+Ho1xW3GZCtwbGoxdZASdU6WEjNKK//ahKyVlDX273yK2wxlKzDOXI7bk9liRr8Ot63A6orCN5KYOgRjWISzfvIqExwJApXbjNJWoMfvHmdxPkkEon1hhzAjs/UjNtUCkVNw24BsBcJXQyMcICJ5qH2JDiEdmiNhCCvTiZO4pW022gokYHB3UZ8kEL0V25e0tUfEqH1Z5bTi0BLISgt+xGI9Komot2L7+kbadiPlJvtxIpW4iFPj0bosEM/CrZrWv18sXVI4s74sBKqK2+DU8GWFy3RqW4cksnCXp5dNLp5kAMGkz4+70ortq5n/dsTkujW3/rrFeYT583olr92ovYNExH+uuxB9Mvd9JlK9Cytjgerii3Bi+IdMHJl8eu+gRBZBd0mh64401VGUD2B7GP6lSomagHOBRQ6D29J0JBBahmaq9nm7sNi+tGTNECRMVdDbRRwZwqYuRwKJBT4fvB2s9jraBcIRBhoHb9PcyeNYoCD3rnWUFMBPuguJXMTo5qt5WQmEpkevqvb7rqi1USVNm2PNo1zCpPk1jawEEje03P8jUOfrUO93xjUpRjmUa4zp2lkLpAWgebAnuLek02wxilGOWVzHvyGBYoEKd3tFmXtd4RU+jOmIsMpxVKjNiOhD49PR2Pm55bVmyikuyLu3e7+vfTO+2m6KQBLFw596R36fOUrzA5+VD0Do/izNPzzvfQdy+UO10Eb/hshlke8AHNapoF9yW8gAAAAASUVORK5CYII=';
        break;              
      case "grey":
        icon = 'data:image/png;base64,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JdM99pSg6f+CKQL/iaf78Ck5AlDlBUDUegBCkB5lPzKMECYh18k2KdILwHZ28vFPSZLsbKdjkZBuE/NxYuKdNgC4ZgC+iicmxvdNTHw9jCz2AQAtGdO9/aSwyB9PsQlNQzGiA+5cD/5F/wDjsRlLgZG5+wAAAAlwSFlzAAALEwAACxMBAJqcGAAABCRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjA8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjQwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj40MDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOlNlcS8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjA6MDY6MjMgMTE6MDY6OTg8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy44LjQ8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Co/+CH8AAASHSURBVFgJ7VlvTJVVGH/fpuBWcO8Hh8jFG0EBsvDPFU0ZTq7lFU1imXXNspqbzj646RdnG31oudVYG7XWSmkurbE0NsXaSmtdCCSmdBNHSbTUXeAKhnovygprezs/xnN3Ot3znvPC1u4H2eB5nz+/3/lxznuf5wwMy7LeYd+FRop9QRO0GakojvYqlbWRxrt22jtgTpehtePc4r7LV7zx+C33wNWRmeDLnTv7L5crI1b4QF5kVfnSH6ezxpQEhkKhGdHY2Lau8M8b2OI+0zQ8yURYljHI4uEyX8kXOe57D/n9/r+T1dnFHAsM9/yysKn5y71/jt/ZYkcs5malpzVuqllX53u4qFvM2fmOBHZ2na842nz6dbZjlSKpZVi3TcscRtwyrTmmYd73nxrLaAnWBF5dXraoXczJfG2B2LmPjza/LYpzuzJDK1f4Tj/k9Z71eOb0Y6HBweF5v0Yiy9q+Dwdi8VE/vzg79patwZrdujupJRDv3Ncd3YeFY71Wvbby3crypQdN07zGi6Bn1mizWjrO7fj8VMsuFsuiOI57TfnCF3XeyRkEsrPRG2PbRHF7dr5QOy8nu8EONyl8f390aLj+gyP7We2ESHAxzlbmH7TDI3ePqgD5H87/9Dhfh51TiePrUQsMHxM5+Rz/rBT4zXedCyzDXEIgvHM4VvJ1LTDAUj04wU2+zCoFXor0e/k+hw+E7J2TLYI4MMBSDTjBTb7MKgXejI+6CIxWgk8r+U4tsOAg3M34WIKbYqJVChyKjiQ+SOhz1EpEIh0fWOqVqB+KDie4ZXilQMswHI8n2WJiXIdbKdCTkzVKxJgQaMLkO7XAgoNwPDfFRKsUWOCdG2EN9yqAGF+YECKJrg8sjUBwgluFVQrcWF3VzcbNBSJq6wwHMCHI17XAYPRRPTjBTb7MKgUCmH9/bqJ/xWKjfowvGaEsDgw/l3lOGQZxLYG+RaXNrLaHiDBb2fjaTr7KonZyHlNpzyQn+VKrJbC8bEFvdvbsExxLFmZr6ExXrd1xIxc6c7aWn8PgyM/znAAnxyd91LrNAN3Xd2X++58c+5QB/jWe3G523Vpexq5bucJ1a2BZW2dXAK8EvzprLRdefv6ZzYWFeRf5uOxZWyAIGhqb9l3svfRGMjKdCytw84vzX9m+ZdObyTiSxbSOmIDBDYEGdpc7RT5vJ9qHaRSwXlRArYTP4xlYcIhxO9+RwMzMzOs1VY8eYO/W73akyXLAPPvkugPgSJaXxRwJBMkjS0qPlxQ/6GgXgAOmtKToOJ6dfDkWCPJg9Zr69FlpJ3UXQi0wuvV83ZQEsmMaeWnzxrcYUaI38qTCcw9qgRHiWu6UBIK5KN/b9ljlinr+fieuiBxqUCvmdP0pC8QC61evPFSQ531PthhyqJHldeLTEogFtj61vs7tymgUF0MMOTHu1FfeaFWELpfrxm8DA699+FHTH+Pjd1ajPj097dvngtV1yKnwqryjSWJH1t7em/HZVydXoebpqidaKyqKb9nV3839bzvARlDK/YWffvkJbexHSv4bgkT+A8rQvhsVn0lWAAAAAElFTkSuQmCC';
        break;              
      default:
        icon = 'data:image/png;base64,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JdM99pSg6f+CKQL/iaf78Ck5AlDlBUDUegBCkB5lPzKMECYh18k2KdILwHZ28vFPSZLsbKdjkZBuE/NxYuKdNgC4ZgC+iicmxvdNTHw9jCz2AQAtGdO9/aSwyB9PsQlNQzGiA+5cD/5F/wDjsRlLgZG5+wAAAAlwSFlzAAALEwAACxMBAJqcGAAABCRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjA8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjQwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj40MDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOlNlcS8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjA6MDY6MjMgMTE6MDY6OTg8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy44LjQ8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Co/+CH8AAASHSURBVFgJ7VlvTJVVGH/fpuBWcO8Hh8jFG0EBsvDPFU0ZTq7lFU1imXXNspqbzj646RdnG31oudVYG7XWSmkurbE0NsXaSmtdCCSmdBNHSbTUXeAKhnovygprezs/xnN3Ot3znvPC1u4H2eB5nz+/3/lxznuf5wwMy7LeYd+FRop9QRO0GakojvYqlbWRxrt22jtgTpehtePc4r7LV7zx+C33wNWRmeDLnTv7L5crI1b4QF5kVfnSH6ezxpQEhkKhGdHY2Lau8M8b2OI+0zQ8yURYljHI4uEyX8kXOe57D/n9/r+T1dnFHAsM9/yysKn5y71/jt/ZYkcs5malpzVuqllX53u4qFvM2fmOBHZ2na842nz6dbZjlSKpZVi3TcscRtwyrTmmYd73nxrLaAnWBF5dXraoXczJfG2B2LmPjza/LYpzuzJDK1f4Tj/k9Z71eOb0Y6HBweF5v0Yiy9q+Dwdi8VE/vzg79patwZrdujupJRDv3Ncd3YeFY71Wvbby3crypQdN07zGi6Bn1mizWjrO7fj8VMsuFsuiOI57TfnCF3XeyRkEsrPRG2PbRHF7dr5QOy8nu8EONyl8f390aLj+gyP7We2ESHAxzlbmH7TDI3ePqgD5H87/9Dhfh51TiePrUQsMHxM5+Rz/rBT4zXedCyzDXEIgvHM4VvJ1LTDAUj04wU2+zCoFXor0e/k+hw+E7J2TLYI4MMBSDTjBTb7MKgXejI+6CIxWgk8r+U4tsOAg3M34WIKbYqJVChyKjiQ+SOhz1EpEIh0fWOqVqB+KDie4ZXilQMswHI8n2WJiXIdbKdCTkzVKxJgQaMLkO7XAgoNwPDfFRKsUWOCdG2EN9yqAGF+YECKJrg8sjUBwgluFVQrcWF3VzcbNBSJq6wwHMCHI17XAYPRRPTjBTb7MKgUCmH9/bqJ/xWKjfowvGaEsDgw/l3lOGQZxLYG+RaXNrLaHiDBb2fjaTr7KonZyHlNpzyQn+VKrJbC8bEFvdvbsExxLFmZr6ExXrd1xIxc6c7aWn8PgyM/znAAnxyd91LrNAN3Xd2X++58c+5QB/jWe3G523Vpexq5bucJ1a2BZW2dXAK8EvzprLRdefv6ZzYWFeRf5uOxZWyAIGhqb9l3svfRGMjKdCytw84vzX9m+ZdObyTiSxbSOmIDBDYEGdpc7RT5vJ9qHaRSwXlRArYTP4xlYcIhxO9+RwMzMzOs1VY8eYO/W73akyXLAPPvkugPgSJaXxRwJBMkjS0qPlxQ/6GgXgAOmtKToOJ6dfDkWCPJg9Zr69FlpJ3UXQi0wuvV83ZQEsmMaeWnzxrcYUaI38qTCcw9qgRHiWu6UBIK5KN/b9ljlinr+fieuiBxqUCvmdP0pC8QC61evPFSQ531PthhyqJHldeLTEogFtj61vs7tymgUF0MMOTHu1FfeaFWELpfrxm8DA699+FHTH+Pjd1ajPj097dvngtV1yKnwqryjSWJH1t7em/HZVydXoebpqidaKyqKb9nV3839bzvARlDK/YWffvkJbexHSv4bgkT+A8rQvhsVn0lWAAAAAElFTkSuQmCC';
        break;
    }
    return icon;
  }
  function onBoundsChange(center, zoom){
    this.props.onCenterChange(center);
    this.props.onZoomChange(zoom);
  }


  var map;

  let chiTownLocations = data.chiTownLocations;
  let pharmacyLocations = data.pharmacyLocations;

  //----------------------------------------------------------------------------------------------------
  // Diagnostics

  console.log('TestingSitesMap.data', data)

  let testingSites = {
    "type": "FeatureCollection",
    "features": []
  };

  
  // if(data.outLabLocations.length > 0){
  //   data.outLabLocations.forEach(function(location){
  //     if(get(location, '_location.coordinates[0]') && get(location, '_location.coordinates[1]')){
  //       testingSites.features.push({
  //         "type": "Feature",
  //         "geometry": {
  //             "type": "Point",
  //             "coordinates": [
  //               get(location, '_location.coordinates[0]'),
  //               get(location, '_location.coordinates[1]'),                          
  //             ]
  //         },
  //         "properties": {
  //           "name": get(location, 'name'),
  //           "id": get(location, 'id'),
  //           "color": "grey"
  //         }
  //       })            
  //     }
  //   })      
  // }
  if(data.defaultLocations.length > 0){
    data.defaultLocations.forEach(function(location){
      if(get(location, '_location.coordinates[0]') && get(location, '_location.coordinates[1]')){
  
        let pinColor = "grey";
        switch (get(location, 'identifier[0].system')) {
          case 'cvs-pharmacy':
            pinColor = "blue";
            break;
          case 'wallgreens-pharmacy':
            pinColor = "red";
            break;
          case 'walmart-pharmacy':
            pinColor = "purple";
            break;
          case 'kroger-pharmacy':
            pinColor = "yellow";
            break;
          case 'riteaid-pharmacy':
            pinColor = "orange";
            break;
          case 'etruenorth-pharmacy':
            pinColor = "green";
            break;                                      
          default:
            pinColor = "grey";
            break;
        }

        // let pinColor = "green";
        // switch (get(location, 'identifier[0].system')) {
        //   case 'cvs-pharmacy':
        //     pinColor = "grey";
        //     break;
        //   case 'wallgreens-pharmacy':
        //     pinColor = "grey";
        //     break;
        //   case 'walmart-pharmacy':
        //     pinColor = "grey";
        //     break;
        //   case 'kroger-pharmacy':
        //     pinColor = "grey";
        //     break;
        //   case 'riteaid-pharmacy':
        //     pinColor = "grey";
        //     break;
        //   case 'etruenorth-pharmacy':
        //     pinColor = "grey";
        //     break;                                      
        //   default:
        //     pinColor = "green";
        //     break;
        // }

  
        testingSites.features.push({
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [
                get(location, '_location.coordinates[0]'),
                get(location, '_location.coordinates[1]'),                          
              ]
          },
          "properties": {
            "name": get(location, 'name'),
            "id": get(location, 'id'),
            "color": pinColor
          }
        })  
      }
    })
  
  }

  console.log('testingSites', testingSites)

  //----------------------------------------------------------------------------------------------------
  // Map Rendering

  let keyIndex = "mapWaitingForData";
  if(data.testingSitesAreReady){
    keyIndex = 'mapWithReadySubscription'
  }
  console.log('keyIndex', keyIndex)

  if(process.env.NODE_ENV !== "test"){
    map = <GoogleMapReact
            id="googleMap"
            key={keyIndex}
            defaultCenter={data.center}
            defaultZoom={data.zoom}
            options={data.options}
            resetBoundsOnResize={true}
            bootstrapURLKeys={{
            key: data.apiKey,
            libraries: 'visualization'
          }}
          //  onBoundsChange={this.onBoundsChange}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={function({map, maps}){


          //----------------------------------------------------------------------------------------------------

          let markerCollection;

          //----------------------------------------------------------------------------------------------------
          // Option 1 - Load from file
          // // load HSA boundary polygons from a GeoJson file
          // let hsaShapeFile = 'https://data.cityofchicago.org/resource/thdn-3grx.geojson';
          // console.log('Loading testing file from City of Chicago: ', hsaShapeFile)

          if(map){

            // //----------------------------------------------------------------------------------------------------
            // // Option 2 - Add all the locations, then apply a global style
            markerCollection = map.data.addGeoJson(testingSites, { idPropertyName: 'id' });

            // map.data.setStyle({
            //   // raw binary data (extremely fast!)
            //   icon: self.getPinIcon(get(Meteor, 'settings.public.theme.palette.mapMarkers', 'blue')),
      
            //   fillColor: '#ffffff',
            //   fillOpacity: 0.2,
            //   strokeColor: '#EB6600',
            //   strokeWeight: 0.5
            // });

            //----------------------------------------------------------------------------------------------------
            // Option 3 - Add markers with individual style, one at a time

            map.data.setStyle(function(feature){
              return {
                // icon: feature.getProperty('color'),          
                icon: getPinIcon(feature.getProperty('color')),          
                fillColor: '#ffffff',
                fillOpacity: 0.2,
                strokeColor: '#EB6600',
                strokeWeight: 0.5
              }
            });
          }            
        }}
        >                   

        </GoogleMapReact>;
  } else {
    console.log("NOTICE:  You are running in the 'test' environment.  Google Maps and other external libraries are disabled to prevent errors with the automated test runners.")
  }
  return(
    <div id="testingSitesMap" style={data.style.page}>
      {map}
    </div>
  );
}




export default TestingSitesMap;