import React from 'react';


import MyHealthServiceAreaPage from './client/MyHealthServiceAreaPage';

import IcuCapacityMap from './client/IcuCapacityMap';
import MainPandemicPositivityMap from './client/MainPandemicPositivityMap';
import SanerHealthServiceAreaMap from './client/SanerHealthServiceAreaMap';
import SanerHealthReferralMap from './client/SanerHealthReferralMap';
import SanerLeaderboard from './client/SanerLeaderboard';
import ReportingPage from './client/ReportingPage';
import SanerWorkflowTabs from './client/SanerWorkflowTabs';
import SanerAboutDialog from './client/SanerAboutDialog';
import SanerFetchDialog from './client/SanerFetchDialog';
import MapLayersDialog from './client/MapLayersDialog';
import FilterPreferencesDialog from './client/FilterPreferencesDialog';
import FetchPreferencesDialog from './client/FetchPreferencesDialog';
import SanerFetchApisDialog from './client/SanerFetchApisDialog';
import MyLocationDialog from './client/MyLocationDialog';
import NearestTestingLocationDialog from './client/NearestTestingLocationDialog';
import ScreenScraperMeasureInputPage from './client/ScreenScraperMeasureInputPage';

import TestingSitesMap from './client/TestingSitesMap';

import HsaMapLayersContext from './client/HsaMapLayersContext';
import TestingSitesMapLayersContext from './client/TestingSitesMapLayersContext';

import PrivacyPage from './client/PrivacyPage';
import TermsAndConditionsPage from './client/TermsAndConditionsPage';

import PatientCard from './client/PatientCard';
import MeasureReportDetail from './client/MeasureReportDetail';
import ObservationDetail from './client/ObservationDetail';


//==========================================================================================
// Startup

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';
import { get, has } from 'lodash';

Meteor.startup(function(){

  if(Meteor.isClient){
    if(window.navigator){
      window.navigator.geolocation.getCurrentPosition(function(position){
        Session.set('myLatitude', get(position, 'coords.latitude'));  
        Session.set('myLongitude', get(position, 'coords.longitude'));  
  
        let icuCapacityUrl = "https://healthzones.symptomatic.us/icu-capacity-at-my-location?latitude=" + get(position, 'coords.latitude') + "&longitude=" + get(position, 'coords.longitude')
        console.log('icuCapacityUrl', icuCapacityUrl);
      
        HTTP.get(icuCapacityUrl, function(error, result){
          if(error) console.log('error', error)
          if(result) {
            let parsedResults = JSON.parse(result.content); 
            console.log('QrScannerPage.parsedResults', parsedResults)
      
            Session.set('adult_icu_bed_utilization', get(parsedResults, 'adult_icu_bed_utilization'))            
          }
        })    
      })  
    }  
  }
})


//==========================================================================================
// Imports

import { 
  ReportingButtons,
  OrganizationsButtons,
  MeasuresButtons,
  MeasureReportsButtons,
  LeaderboardButtons,
  LocationsButtons,
  HsaMapButtons,
  TestingSitesMapButtons
} from './client/SanerFooterButtons';


var DynamicRoutes = [{
  'name': 'MyHealthServiceAreaPage',
  'path': '/nearest-health-service-area',
  'component': MyHealthServiceAreaPage,
  'requireAuth': true
}, {
  'name': 'ReportingPage',
  'path': '/saner',
  'component': SanerLeaderboard,
  'requireAuth': true
}, {
  'name': 'SanerLeaderboard',
  'path': '/reporting-participation',
  'component': SanerLeaderboard,
  'requireAuth': true
}, {
  'name': 'ReportingPage',
  'path': '/reporting-participation',
  'component': ReportingPage,
  'requireAuth': true
}, {
  'name': 'SanerHealthServiceAreaMap',
  'path': '/saner-hsa-map',
  'component': SanerHealthServiceAreaMap,
  'requireAuth': true
}, {
  'name': 'MainPandemicPositivityMap',
  'path': '/pandemic-positivity-map',
  'component': MainPandemicPositivityMap,
  'requireAuth': true
}, {
  'name': 'IcuCapacityMap',
  'path': '/icu-capacity-map',
  'component': IcuCapacityMap,
  'requireAuth': true
}, {
  'name': 'SanerHealthReferralMap',
  'path': '/saner-hrr-map',
  'component': SanerHealthReferralMap,
  'requireAuth': true
}, {
  'name': 'TestingSitesMap',
  'path': '/testing-sites-map',
  'component': TestingSitesMap,
  'requireAuth': true
}, {
  'name': 'PrivacyPage',
  'path': '/privacy',
  'component': PrivacyPage
}, {
  'name': 'TermsAndConditionsPage',
  'path': '/terms-and-conditions',
  'component': TermsAndConditionsPage
}, {
  'name': 'ScreenScraperMeasureInputPage',
  'path': '/screen-scraper',
  'component': ScreenScraperMeasureInputPage
}];

let DialogComponents = [{
  name: "SanerAboutDialog",
  component: <SanerAboutDialog />
}, {
  name: "SanerFetchDialog",
  component: <SanerFetchDialog />
}, {
  name: 'FilterPreferencesDialog',
  component: <FilterPreferencesDialog />
}, {
  name: 'FetchPreferencesDialog',
  component: <FetchPreferencesDialog />
}, {
  name: 'MapLayersDialog',
  component: <MapLayersDialog />
}, {
  name: 'SanerFetchApisDialog',
  component: <SanerFetchApisDialog />
}, {
  name: 'MyLocationDialog',
  component: <MyLocationDialog />
}, {
  name: 'NearestTestingLocationDialog',
  component: <NearestTestingLocationDialog />
}, {
  name: 'HsaMapLayersContext',
  component: <HsaMapLayersContext />
}, {
  name: 'TestingSitesMapLayersContext',
  component: <TestingSitesMapLayersContext />
}]


let FooterButtons = [{
  pathname: '/reporting-participation',
  component: <LeaderboardButtons />
}, {
  pathname: '/organizations',
  component: <OrganizationsButtons />  
}, {
  pathname: '/locations',
  component: <LocationsButtons />
}, {
  pathname: '/measures',
  component: <MeasuresButtons />
}, {
  pathname: '/measure-reports',
  component: <MeasureReportsButtons />
}, {
  pathname: '/saner',
  component: <LeaderboardButtons />
}, {
  pathname: '/saner-hsa-map',
  component: <HsaMapButtons />
}, {
  pathname: '/foo',
  component: <HsaMapButtons />
}, {
  pathname: '/testing-sites-map',
  component: <TestingSitesMapButtons />
}, {
  pathname: '/icu-capacity-map',
  component: <HsaMapButtons />
}, {
  pathname: '/',
  component: <HsaMapButtons />
}];



let SidebarWorkflows = [{
  primaryText: 'Geocoding',
  to: '/query-fhir-provider',
  iconName: 'location',
  excludeDevice: ['iPhone', 'iPad'],
  requireAuth: true
}, {
  primaryText: 'S.A.N.E.R.',
  to: '/saner',
  iconName: 'mapO',
  excludeDevice: ['iPhone', 'iPad'],
  requireAuth: true
}, {
  primaryText: 'ICU Capacity Map',
  to: '/icu-capacity-map',
  iconName: 'mapO'
},  {
  primaryText: 'Pandemic Positivity',
  to: '/pandemic-positivity-map',
  iconName: 'mapO'
}, {
  primaryText: 'Community Testing',
  to: '/testing-sites-map',
  iconName: 'mapO'
}, {
  primaryText: 'Reporting Participation',
  to: '/reporting-participation',
  iconName: 'dashboard'
}, {
  primaryText: 'Screen Scraper',
  to: '/screen-scraper',
  iconName: 'mapO'
}, ];


let WorkflowTabs = [{
  name: "SanerWorkflowTabs",
  component: <SanerWorkflowTabs />,
  matchingPaths: [
    "/saner",
    "/saner-hrr-map",
    "/saner-hsa-map",
    "/measure-reports",
    "/measures"
  ]
}]

let MainPage = MyHealthServiceAreaPage;

export { 
  SanerHealthServiceAreaMap,
  SanerHealthReferralMap,
  SanerLeaderboard,

  MainPandemicPositivityMap,

  DynamicRoutes,
  FooterButtons,
  SidebarWorkflows,
  WorkflowTabs,
  DialogComponents,

  ReportingPage,

  PatientCard, 
  MeasureReportDetail,
  ObservationDetail,

  MainPage
};
