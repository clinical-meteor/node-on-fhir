
import React from 'react';
import PatientCorrectionsPage from './client/PatientCorrectionsPage';


import { 
  TaskButtons
} from './client/PatientCorrectionsFooter';


var DynamicRoutes = [{
  'name': 'PatientCorrectionsPage',
  'path': '/patient-corrections',
  'component': PatientCorrectionsPage
}];

var SidebarWorkflows = [{
  'primaryText': 'Patient Corrections',
  'to': '/patient-corrections',
  'href': '/patient-corrections',
  'iconName': 'addressBook'
}];

let FooterButtons = [{
  pathname: '/tasks',
  component: <TaskButtons />
}];


let MainPage = PatientCorrectionsPage;

export { MainPage, SidebarWorkflows, DynamicRoutes, FooterButtons, PatientCorrectionsPage };
