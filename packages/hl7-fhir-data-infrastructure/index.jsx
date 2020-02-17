

import BundlesPage from './client/bundles/BundlesPage';
import BundleTable from './client/bundles/BundleTable';
import BundleDetail from './client/bundles/BundleDetail';

// import PatientsPage from './client/patients/NewPatientsPage';
import PatientsPage from './client/patients/PatientsPage';

import EncountersPage from './client/encounters/EncountersPage';
import EncountersTable from './client/encounters/EncountersTable';
import EncounterDetail from './client/encounters/EncounterDetail';


var DynamicRoutes = [{
  'name': 'BundlePage',
  'path': '/bundles',
  'component': BundlesPage,
  'requireAuth': true
}, {
  'name': 'PatientPage',
  'path': '/patients',
  'component': PatientsPage,
  'requireAuth': true
}, {
  'name': 'EncountersPage',
  'path': '/encounters',
  'component': EncountersPage,
  'requireAuth': true
}];

var SidebarElements = [{
  'primaryText': 'Bundles',
  'to': '/bundles',
  'href': '/bundles'
}, {
  'primaryText': 'Patients',
  'to': '/patients',
  'href': '/patients'
}, {
  'primaryText': 'Encounters',
  'to': '/encounters',
  'href': '/encounters'
}];
  
var AdminSidebarElements = [{
  'primaryText': 'Bundles',
  'to': '/bundles',
  'href': '/bundles'
}, {
  'primaryText': 'Patients',
  'to': '/patients',
  'href': '/patients'
}];

export { 
  SidebarElements,
  AdminSidebarElements, 
  DynamicRoutes, 

  BundlesPage,
  BundleTable,
  BundleDetail,

  EncountersPage,
  EncounterTable,
  EncounterDetail,

  PatientsPage
};


