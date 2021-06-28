import { CardContent, CardHeader } from '@material-ui/core';

import { Tab, Tabs } from 'material-ui/Tabs';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

import Checkbox from 'material-ui/Checkbox';
import { EJSON } from 'meteor/ejson';
import GoogleMapReact from 'google-map-react';

import LocationDetail from './LocationDetail';
import LocationTable from './LocationsTable';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import RaisedButton from 'material-ui/RaisedButton';

import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { ScatterplotChart } from 'react-easy-chart';
import TextField from 'material-ui/TextField';
import { get, has } from 'lodash';


Session.setDefault('locationPageTabIndex', 1); 
Session.setDefault('locationSearchFilter', ''); 
Session.setDefault('shapefileDataLayer', false);
Session.setDefault('tspRoute', []);
Session.setDefault('mortalityLayer', true);
Session.setDefault('proximityDistance', '5000');
Session.setDefault('priximityLocations', false);

Session.setDefault('selectedLocationId', false);
Session.setDefault('fhirVersion', 'v1.0.2');

const styles = {
  block: {
    maxWidth: 250,
  },
  checkbox: {
    marginBottom: 16,
  },
};
const demoData = [
    {
      type: 'One',
      x: 1,
      y: 5
    },
    {
      type: 'Two',
      x: 3,
      y: 1
    },
    {
      type: 'Three',
      x: 0,
      y: 6
    },
    {
      type: 'Four',
      x: 5,
      y: 2
    },
    {
      type: 'Five',
      x: 4,
      y: 4
    },
    {
      type: 'Six',
      x: 5,
      y: 9
    },
    {
      type: 'Seven',
      x: 9,
      y: 1
    },
    {
      type: 'Eight',
      x: 5,
      y: 6
    },
    {
      type: 'Nine',
      x: 3,
      y: 9
    },
    {
      type: 'Ten',
      x: 7,
      y: 9
    }
  ];

export class LocationsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        },
        page: {
          position: 'fixed',
          top: '0px',
          left: '0px',
          height: Session.get('appHeight'),
          width: Session.get('appWidth')
        },
        canvas: {
          left: '0px',
          top: '0px',
          position: 'fixed'
        }
      },
      tabIndex: Session.get('locationPageTabIndex'),
      locationSearchFilter: Session.get('locationSearchFilter'),
      selectedLocationId: Session.get('selectedLocationId'),
      currentLocation: null,
      fhirVersion: Session.get('fhirVersion'),
      center: {
        lat: 41.8359496, 
        lng: -87.8317244
      },
      home: {
        lat: 41.8359496, 
        lng: -87.8317244        
      },
      zoom: 10, 
      layers: {
        heatmap: false,
        reimbursements: false,
        mortality: Session.get('mortalityLayer'),
        eyeexams: false,
        diabetes: false,
        lipidPanels: false,
        outpatientReimbursement: false
      },
      shapefileDataLayer: [],
      markers: [],
      tspRoute: Session.get('tspRoute'),
      proximity: Session.get('proximityDistance'),
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
      metadata: {
        pricePerGallonGasoline: 2.50,
        milesPerGallon: 24
      }
    };

    if(Session.get('shapefileDataLayer')){
      data.shapefileDataLayer = Session.get('shapefileDataLayer');
    }
    if(Session.get('priximityLocations')){
      data.markers = Session.get('priximityLocations');
    } else { 
      data.markers = Locations.find({}, {sort: {name: 1}}).fetch();
    }

    if (Session.get('selectedLocationId')){
      data.currentLocation = Locations.findOne({_id: Session.get('selectedLocationId')});
    } else {
      data.currentLocation = false;
    }

    if(get(Meteor.user(), 'profile.locations.home')){
      data.home.lat = get(Meteor.user(), 'profile.locations.home.position.latitude')
      data.home.lng = get(Meteor.user(), 'profile.locations.home.position.longitude')
    }


    data.apiKey = get(Meteor, 'settings.public.google.maps.apiKey', '');

    if(process.env.NODE_ENV === "test") console.log("LocationsPage[data]", data);
    return data;
  }

  handleTabChange(index){
    Session.set('locationPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedLocationId', false);
    Session.set('locationUpsert', false);
  }
  setGeojsonUrl(event, text){
    console.log('setGeojsonUrl', text);

    Session.set('geojsonUrl', text)
  }

  // this could be a mixin
  changeState(field, event, value){
    let routeMetadataUpdate;

    // if(process.env.NODE_ENV === "test") console.log("LocationDetail.changeState", field, event, value);

    // by default, assume there's no other data and we're creating a new location
    if (Session.get('routeMetadataUpdate')) {
      routeMetadataUpdate = Session.get('routeMetadataUpdate');
    } else {
      routeMetadataUpdate = {
        pricePerGallonGasoline: 2.50,
        milesPerGallon: 24
      };
    }



    // if there's an existing location, use them
    if (Session.get('selectedLocationId')) {
      routeMetadataUpdate = this.data.location;
    }

    switch (field) {
      case "pricePerGallonGasoline":
        routeMetadataUpdate.pricePerGallonGasoline = value;
        break;
      case "milesPerGallon":
        routeMetadataUpdate.milesPerGallon = value;
        break;
        case "proximity":
        routeMetadataUpdate.proximity = value;
        Session.set('proximityDistance', value)
        break;
      default:
    }

    Session.set('routeMetadataUpdate', routeMetadataUpdate);
  }
  calculateTspRoute(){
    console.log('calculateTspRoute');
    Meteor.call('calculateTspRoute', function(error, result){
      if(result){
        console.log('result', result);
        Session.set('tspRoute', result.shortestFoundPath);
      }
    });
  }
  toggleMortalityLayer(){
    Session.toggle('mortalityLayer');
  }
  findNearMe(){
    console.log('findLocationsNearMe');
    Meteor.call('findLocationsNearMe', Session.get('proximityDistance'), function(error, result){
      if(result){
        console.log('result', result);

        Session.set('priximityLocations', result);
      }
    });    
  }
  clearProximity(){
    Session.set('priximityLocations', false);    
  }
  initializeHospitals(){
    console.log('initializeHospitals()')
    Meteor.call('initializeHospitals');
  }
  initializePoliceStations(){
    console.log('initializePoliceStations()')
  }
  initializeFireStations(){
    console.log('initializeFireStations()')
  }
  render() {
    var self = this;
    var markers = [];
    var tspWaypoints = [];
    var map;
  

    // we know that the vertical canvas with locations will be displayed regardless of whether
    // we load the background map; so lets create a variable to set it up
    var canvas = <PageCanvas position="fixed" style={{top: '0px'}}>
      <StyledCard height='auto' width='768px' >
        <CardHeader
          title="Locations"
        />
        <CardContent>
          <Tabs id="locationsPageTabs" default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}> <Tab className="newLocationTab" label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0} >
              <LocationDetail 
                id='newLocation'
                fhirVersion={ this.data.fhirVersion }
              />  
            </Tab>
            <Tab className="locationListTab" label='Locations' onActive={this.handleActive} style={this.data.style.tab} value={1}>
              <LocationTable />
            </Tab>
            <Tab className="locationDetailsTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
              <LocationDetail 
                id='locationDetails'
                fhirVersion={ this.data.fhirVersion }
                location={ this.data.currentLocation }
                locationId={ this.data.selectedLocationId }
              />
            </Tab>
            <Tab className="layersDetail" label='Layers' onActive={this.handleActive} style={this.data.style.tab} value={3}>
              <CardContent>      
              <TextField
                  id='geojsonUrl'
                  ref='geojsonUrl'
                  name='geojsonUrl'
                  floatingLabelText='Heat Map Data Url'
                  floatingLabelFixed={true}
                  placeholder='http://somewhere.com/healthdata.geojson'
                  value={ Session.get('geojsonUrl') }
                  onChange={ this.setGeojsonUrl.bind(this)}
                  fullWidth
                  />
                <br/>
                <br/>
                <br/>
          
                <h4>Public Services</h4>
                <RaisedButton id="initializeHospitals" label="Initialize Hospitals" primary={true} onClick={this.initializeHospitals.bind(this)}  /> <br/><br/>
                <RaisedButton id="initializePoliceStations" label="Initialize Police Stations" primary={false} disabled={true} onClick={this.initializePoliceStations }  />
                <RaisedButton id="initializeFireStations" label="Initialize Fire Stations" primary={true} onClick={this.initializeFireStations.bind(this)}  /> <br/><br/>

                <br/>
                <br/>
                <br/>
                <h4 style={{color: '#666666'}}>Health Statistics</h4>
                <Checkbox label="Hospital Referral Regions" style={styles.checkbox} disabled={true} />
                <Checkbox label="Health Service Areas" style={styles.checkbox} disabled={true} onCheck={this.toggleMortalityLayer } checked={ this.data.layers.mortality } />                        
                <br/>

                <h4 disabled={true} style={{color: '#666666'}}>Medicare</h4>
                <Checkbox label="Reimbursements" style={styles.checkbox} disabled={true} />
                <Checkbox label="Total Mortality" style={styles.checkbox} disabled={true} onCheck={this.toggleMortalityLayer } checked={ this.data.layers.mortality } />
                <Checkbox label="Eye Exams" style={styles.checkbox} disabled={true} />
                <Checkbox label="Diabetes" style={styles.checkbox} disabled={true} />
                <Checkbox label="Lipid Panels" style={styles.checkbox} disabled={true} />
                <Checkbox label="Outpatient Visits" style={styles.checkbox} disabled={true} />
                <p>Contact <a href="mailto:sales@symptomatic.io">sales@symptomatic.io</a> for more information about enabling neighborhood level geodata.</p>
              </CardContent>
            </Tab>
            <Tab className="findNearMe" label='Proximity' onActive={this.handleActive} style={this.data.style.tab} value={4}>
              <CardContent>      
              <TextField
                  id='proximityInput'
                  ref='proximity'
                  name='proximity'
                  floatingLabelText='Distance (meters)'
                  placeholder='5000'
                  value={ this.data.proximity }
                  onKeyPress={this.changeState.bind(this, 'proximity')}
                  fullWidth
                  /><br/>

                <br />
                <RaisedButton id="findNearMe" label="Find Near Me" primary={true} onClick={this.findNearMe.bind(this)}  /> <br/><br/>
                <RaisedButton id="clear" label="Clear Selection" primary={true} onClick={this.clearProximity }  />

              </CardContent>
            </Tab>
            {/* <Tab className="quickAnalysisTab" label='Analysis' onActive={this.handleActive} style={this.data.style.tab} value={4}>
              <CardContent>
                  <Row>
                    <Col md={4}>
                      <TextField
                        id='pricePerGallonGasolineInput'
                        ref='pricePerGallonGasoline'
                        name='pricePerGallonGasoline'
                        floatingLabelText='Price Per Gallon'
                        value={(this.data.metadata) ? this.data.metadata.pricePerGallonGasoline : ''}
                        onChange={ this.changeState.bind(this, 'pricePerGallonGasoline')}
                        fullWidth
                        /><br/>
                    </Col>
                    <Col md={4}>
                      <TextField
                        id='milesPerGallonInput'
                        ref='milesPerGallon'
                        name='milesPerGallon'
                        floatingLabelText='Miles Per Gallon'
                        value={(this.data.metadata) ? this.data.metadata.milesPerGallon : ''}
                        onChange={ this.changeState.bind(this, 'milesPerGallon')}
                        fullWidth
                        /><br/>
                    </Col>
                  </Row>
                  <RaisedButton id="calculateRoute" label="Calculate Route" primary={true} onClick={this.calculateTspRoute.bind(this)}  />

                  <hr />

                  <LocationTable data={ this.data.tspRoute } />
              </CardContent>
            </Tab> */}
          </Tabs>
        </CardContent>
      </StyledCard>
    </PageCanvas>;


    var pageContent;
    // we only want to render the google map in certain environments
    // specifically, we don't want to render it while running QA tests
    if(process.env.NODE_ENV !== 'test'){

      markers.push(
        <div key='marker-init' lat={ this.data.home.lat} lng={ this.data.home.lng } style={{width: '200px'}} $hover="false">
          <div $hover="false" style={{backgroundColor: 'orange', opacity: '.8', height: '20px', width: '20px', borderRadius: '80%'}}></div>
          {location.name}
        </div>)


      // okay, we're not running QA tests,
      // so lets create a bunch of markers to draw on the map, and load them into a variable
      this.data.markers.forEach(function(location, index){

        var bgColor = '#666666';
        if(get(location, 'type.text') === "Hospital"){
          bgColor = '#21a525';
        } 
        if(get(location, 'type.text') === "Volunteer"){
          bgColor = '#4286f4';
        } 
        if(get(location, 'type.text') === "Medication"){
          bgColor = '#9e4545';
        } 
        if(get(location, 'position.latitude') && get(location, 'position.longitude')){
          markers.push(
            <div key={'marker-' + index} lat={get(location, 'position.latitude')} lng={ get(location, 'position.longitude', 0)} style={{width: '200px'}}>
              <div style={{backgroundColor: bgColor, opacity: '.8', height: '10px', width: '10px', borderRadius: '80%'}}></div>
              {location.name}
            </div>)  
        }
      });

      // we're now going to draw our background map,
      // add the canvas with our locations CRUD user interface
      // and our map markers
      pageContent = <GoogleMapReact
          id="googleMap"
          defaultCenter={this.data.center}
          defaultZoom={this.data.zoom}           
          options={this.data.options}
          bootstrapURLKeys={{
            key: this.data.apiKey,
            libraries: 'visualization'
          }}
          onGoogleApiLoaded={function({map, maps}){
            console.log('onGoogleApiLoaded', map);
            

            // for (var index = 0; index < 8; index++) {
            //   tspWaypoints.push({
            //     location: new maps.LatLng(self.data.tspRoute[index].latitude, self.data.tspRoute[index].longitude),
            //     stopover: true
            //   });
            // }
            // console.log('tspWaypoints', tspWaypoints)

  
            map.data.setStyle({
              // raw binary data (extremely fast!)
              //icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAiklEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NUlH5v9rF5f+ZoCAwHaig8B8oPhOmKC1NU/P//7Q0DByrqgpSGAtSdOCAry9WRXt9fECK9oIUPXwYFYVV0e2ICJCi20SbFAuyG5uiECUlkKIQmOPng3y30d0d7Lt1bm4w301jQAOgcNoIDad1yOEEAFm9fSv/VqtJAAAAAElFTkSuQmCC'
  
              // load from a content delivery network
              //icon: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'

              // load from Meteor server
              //icon: Meteor.absoluteUrl() + 'geodata/icons/purple-dot.png'

              // load from googleapis
              //icon: 'https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-a.png&text=A&psize=16&font=fonts/Roboto-Regular.ttf&color=ff333333&ax=44&ay=48&scale=1'

              // load a Symbol
              icon: {
                // a custom designed path (must be less than 22x22 pixels)
                //path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',

                path: maps.SymbolPath.CIRCLE,
                fillColor: '#616161',
                fillOpacity: 0.5,
                strokeColor: '#9e4545',
                strokeWeight: 2,
                scale: 2
              },
              fillColor: '#ffffff',
              strokeColor: '#9e4545',
              strokeWeight: 0.5
              //icon: new maps.MarkerImage(
              //  'http://www.gettyicons.com/free-icons/108/gis-gps/png/24/needle_left_yellow_2_24.png',
              //  new maps.Size(24, 24),
              //  new maps.Point(0, 0),
              //  new maps.Point(0, 24)
              //)

              // and some labels 
              //label: {
              //  color: "blue",
              //  fontFamily: "Courier",
              //  fontSize: "24px",
              //  fontWeight: "bold",
              //  text: 'foo'
              //}
            });


            // // TSP Routing / Directions
            // directionsService = new maps.DirectionsService({map: map});
            // directionsDisplay = new maps.DirectionsRenderer({map: map});
            // directionsDisplay.setMap(map);

            // var request = {
            //   origin: 'Logan Square, Chicago, IL',
            //   destination: 'Logan Square, Chicago, IL',
            //   waypoints: tspWaypoints,
            //   provideRouteAlternatives: false,
            //   travelMode: 'DRIVING',
            //   unitSystem: maps.UnitSystem.IMPERIAL
            // }

            // console.log('directionsService', directionsService);
            // console.log('directionsDisplay', directionsDisplay);

            // directionsService.route(request, function(result, status) {
            //   if (status == 'OK') {
            //     directionsDisplay.setDirections(result);
            //   }
            // });


            
            // // heatmaps are special, and need to process the data from our geojson after it's received
            // if(self.data.layers.heatmap){
            //   var dataLayer = [];
            //   HTTP.get(Meteor.absoluteUrl() + '/geodata/health_service_areas_detailed.geojson', function(error, data){
            //     var geojson = EJSON.parse(data.content);
            //     console.log('loadGeoJson', geojson);
            //     geojson.features.forEach(function(datum){
            //       if(datum.geometry && datum.geometry.coordinates && datum.geometry.coordinates[0] && datum.geometry.coordinates[1]){
            //         dataLayer.push(new maps.LatLng(datum.geometry.coordinates[1], datum.geometry.coordinates[0]));
            //       }
            //     })
            //     console.log('dataLayer', dataLayer);

            //     // we sometimes also want to load the data twice
            //     // do we need to double fetch?  or can we just pass data in here?
            //     if(self.data.layers.points){
            //       map.data.loadGeoJson(Meteor.absoluteUrl() + '/geodata/health_service_areas_detailed.geojson');
            //       console.log('map.data', map.data);
            //     }


            //     // if we turn on the heatmap
            //     var heatmap = new maps.visualization.HeatmapLayer({
            //       data: dataLayer,
            //       map: map
            //     });
            //     var gradient = [
            //       'rgba(0, 255, 255, 0)',
            //       'rgba(0, 255, 255, 1)',
            //       'rgba(0, 191, 255, 1)',
            //       'rgba(0, 127, 255, 1)',
            //       'rgba(0, 63, 255, 1)',
            //       'rgba(0, 0, 255, 1)',
            //       'rgba(0, 0, 223, 1)',
            //       'rgba(0, 0, 191, 1)',
            //       'rgba(0, 0, 159, 1)',
            //       'rgba(0, 0, 127, 1)',
            //       'rgba(63, 0, 91, 1)',
            //       'rgba(255, 0, 0, 1)'
            //     ]
            //     heatmap.set('gradient', gradient);
            //     heatmap.set('radius', 40);
            //     heatmap.set('opacity', 0.4);
            //     heatmap.setMap(map);

            //   });
              var baseUrl = Meteor.absoluteUrl();
              if(get(Meteor, 'settings.public.baseUrl')){
                baseUrl = get(Meteor, 'settings.public.baseUrl');
              }

              map.data.loadGeoJson(baseUrl + 'geodata/health_service_areas_detailed.geojson');
              console.log('map.data', map.data);

              // reimbursements layer
              if(self.data.layers.reimbursements){
                map.data.setStyle(function(feature){
                  var reimbursements = feature.getProperty("Total_Reimbursements");
                  //console.log('reimbursements', reimbursements);
                  var color = '#ffffff';
                  if((1 < reimbursements) && (reimbursements < 7000)){
                     color = '#f0faf8';
                  } else if ((7001 < reimbursements) && (reimbursements < 8000)){
                     color = '#d0dfdd';
                  } else if ((8001 < reimbursements) && (reimbursements < 9000)){
                     color = '#b1c5c3';
                  } else if ((9001 < reimbursements) && (reimbursements < 10000)){
                     color = '#92aaa9';
                  } else if ((10001 < reimbursements) && (reimbursements < 11000)){
                     color = '#73908e';
                  } else if ((11001 < reimbursements) && (reimbursements < 12000)){
                     color = '#547574';
                  } else if (12001 < reimbursements){
                     color = '#355b5a';
                  }

                  return {
                    fillColor: color,
                    strokeColor: '#164140',
                    strokeWeight: 1
                  };
                })
              } 
              if(self.data.layers.mortality){
                map.data.setStyle(function(feature){
                  var mortality = parseFloat(feature.getProperty("Total Mort"));
                  //console.log('mortality', mortality);
                  var color = '#ffffff';
                  if((1 < mortality) && (mortality < 3)){
                     color = '#fdd49e';
                  } else if ((3 < mortality) && (mortality <= 3.5)){
                     color = '#fdbb84';
                  } else if ((3.5 < mortality) && (mortality <= 4)){
                     color = '#fc8d59';
                  } else if ((4 < mortality) && (mortality <= 4.5)){
                     color = '#ef6548';
                  } else if ((4.5 < mortality) && (mortality <= 5)){
                     color = '#d7301f';
                  } else if ((5 < mortality) && (mortality <= 5.5)){
                     color = '#b30000';
                  } else if (5.5 <= mortality){
                     color = '#7f0000';
                  }

                  return {
                    fillColor: color,
                    strokeColor: '#164140',
                    strokeWeight: 1
                  };
                })
              }

              if(self.data.layers.outpatientReimbursement){
                map.data.setStyle(function(feature){
                  var outpatients = parseFloat(feature.getProperty("Outpat$"));
                  //console.log('outpatients', outpatients);
                  var color = '#ffffff';
                  if((1 < outpatients) && (outpatients < 1000)){
                     color = '#eee1eb';
                  } else if ((1001 < outpatients) && (outpatients <= 2000)){
                     color = '#d6c6e6';
                  } else if ((2001 < outpatients) && (outpatients <= 3000)){
                     color = '#b89ac5';
                  } else if ((3001 < outpatients) && (outpatients <= 4000)){
                     color = '#775599';
                  } else if ((4001 < outpatients) && (outpatients <= 5000)){
                     color = '#321272';
                  } else if ((5001 < outpatients) && (outpatients <= 6000)){
                     color = '#300042';
                  } else if (6001 <= outpatients){
                     color = '#300042';
                  }

                  return {
                    fillColor: color,
                    strokeColor: '#164140',
                    strokeWeight: 0.5
                  };
                })
              }              
            // }
          }}
        >          
        {markers}
        {canvas}
      </GoogleMapReact>
    } else {
      // but if we're in a test environment, we're just going to render the locations CRUD user interface
      pageContent = canvas;
    }
          
    return (
      <div id="locationsPage" style={this.data.style.page}> 
        {pageContent}                
      </div>
    );
  }
}



ReactMixin(LocationsPage.prototype, ReactMeteorData);

export default LocationsPage;