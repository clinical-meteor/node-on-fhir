import React from 'react';

import SanerHealthServiceAreaMap from './client/SanerHealthServiceAreaMap';
import SanerHealthReferralMap from './client/SanerHealthReferralMap';
import SanerLeaderboard from './client/SanerLeaderboard';
import ReportingPage from './client/ReportingPage';
import SanerWorkflowTabs from './client/SanerWorkflowTabs';
import SanerAboutDialog from './client/SanerAboutDialog';
import SanerFetchDialog from './client/SanerFetchDialog';
import FilterPreferencesDialog from './client/FilterPreferencesDialog';

import { 
  ReportingButtons,
  OrganizationsButtons,
  MeasuresButtons,
  MeasureReportsButtons,
  LeaderboardButtons
} from './client/SanerFooterButtons';


var DynamicRoutes = [{
  'name': 'ReportingPage',
  'path': '/saner',
  'component': SanerLeaderboard,
  'requireAuth': true
}, {
  'name': 'ReportingPage',
  'path': '/reporting',
  'component': ReportingPage,
  'requireAuth': true
}, {
  'name': 'SanerHealthServiceAreaMap',
  'path': '/saner-hsa-map',
  'component': SanerHealthServiceAreaMap,
  'requireAuth': true
}, {
  'name': 'SanerHealthReferralMap',
  'path': '/saner-hrr-map',
  'component': SanerHealthReferralMap,
  'requireAuth': true
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
}]

let FooterButtons = [{
  pathname: '/reporting',
  component: <ReportingButtons />
}, {
  pathname: '/organizations',
  component: <OrganizationsButtons />
}, {
  pathname: '/measures',
  component: <MeasuresButtons />
}, {
  pathname: '/measure-reports',
  component: <MeasureReportsButtons />
}, {
  pathname: '/saner',
  component: <LeaderboardButtons />
}];

let SidebarWorkflows = [{
  primaryText: 'Geocoding',
  to: '/geocoding',
  iconName: 'location'
}, {
  primaryText: 'S.A.N.E.R.',
  to: '/saner',
  iconName: 'mapO'
}];


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


export { 
  SanerHealthServiceAreaMap,
  SanerHealthReferralMap,
  SanerLeaderboard,

  DynamicRoutes,
  FooterButtons,
  SidebarWorkflows,
  WorkflowTabs,
  DialogComponents,

  ReportingPage
};
