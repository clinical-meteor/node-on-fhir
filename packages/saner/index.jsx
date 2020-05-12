import React from 'react';

import SanerHealthServiceAreaMap from './client/SanerHealthServiceAreaMap';
import SanerHealthReferralMap from './client/SanerHealthReferralMap';
import SanerLeaderboard from './client/SanerLeaderboard';
import ReportingPage from './client/ReportingPage';
import SanerWorkflowTabs from './client/SanerWorkflowTabs';



import { 
  ReportingButtons,
  OrganizationsButtons,
  MeasuresButtons,
  MeasureReportsButtons
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
  component: <SanerLeaderboard />
// }, {
//   pathname: '/saner-hrr-map',
//   component: <SanerHealthReferralMap />
// }, {
//   pathname: '/saner-hsa-map',
//   component: <SanerHealthServiceAreaMap />
}];

let SidebarWorkflows = [{
  primaryText: 'S.A.N.E.R.',
  to: '/saner',
  iconName: 'location'
}];

let WorkflowTabs = [{
  name: "SanerWorkflowTabs",
  component: <SanerWorkflowTabs />,
  matchingPaths: [
    "/saner",
    "/saner-hrr-map",
    "/saner-hsa-map",
    "/measure-reports"
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

  ReportingPage
};
