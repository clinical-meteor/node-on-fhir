
import React from 'react';
import PatientCorrectionsPage from './client/PatientCorrectionsPage';
import PatientPickList from './client/PatientPickList';
import TasksDeduplicated from './lib/Collections'

import { 
  TaskButtons,
  DocumentReferencesButtons,
  CompositionsButtons
} from './client/PatientCorrectionsFooter';


var DynamicRoutes = [{
  'name': 'PatientCorrectionsPage',
  'path': '/task-creator',
  'component': PatientCorrectionsPage
}];

var SidebarWorkflows = [{
  'primaryText': 'Patient Corrections',
  'to': '/task-creator',
  'href': '/task-creator',
  'iconName': 'ic_format_list_bulleted'
}];

let FooterButtons = [{
  pathname: '/task-creator',
  component: <TaskButtons />
}, {
  pathname: '/document-references',
  component: <DocumentReferencesButtons />
}, {
  pathname: '/compositions',
  component: <CompositionsButtons />
}];


let DialogComponents = [{
  name: "PatientPickList",
  component: <PatientPickList />
}]

let MainPage = PatientCorrectionsPage;

export { MainPage, DialogComponents, TasksDeduplicated, SidebarWorkflows, DynamicRoutes, FooterButtons, PatientCorrectionsPage };
