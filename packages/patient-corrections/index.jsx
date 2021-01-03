
import React from 'react';
import PatientCorrectionsPage from './client/PatientCorrectionsPage';
import TasksPage from './client/TasksPage';
import PatientPickList from './client/PatientPickList';
import TasksDeduplicated from './lib/Collections'

import { 
  TaskButtons,
  DocumentReferencesButtons
} from './client/PatientCorrectionsFooter';


var DynamicRoutes = [{
  'name': 'TasksPage',
  'path': '/task-creator',
  'component': TasksPage
}, {
  'name': 'PatientCorrectionsPage',
  'path': '/patient-corrections',
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
}];


let DialogComponents = [{
  name: "PatientPickList",
  component: <PatientPickList />
}]

let MainPage = TasksPage;

export { MainPage, DialogComponents, TasksDeduplicated, SidebarWorkflows, DynamicRoutes, FooterButtons, PatientCorrectionsPage };
