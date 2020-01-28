import React from 'react';

import CreateAPluginPage from './client/CreateAPluginPage.jsx';
import FhirQueryPage from './client/FhirQueryPage.jsx';

import { GoFlame } from 'react-icons/go';
import { FaPuzzlePiece } from 'react-icons/fa';


var DynamicRoutes = [{
  'name': 'CreateAPluginPage',
  'path': '/hello-world',
  'component': CreateAPluginPage
}, {
  'name': 'FhirQueryPage',
  'path': '/fhir-query',
  'component': FhirQueryPage
}];

var SidebarElements = [{
  primaryText: 'Create a Plugin',
  to: '/hello-world',
  icon: <FaPuzzlePiece />
}, {
  primaryText: 'Query a FHIR Endpoint',
  to: '/fhir-query',
  icon: <GoFlame />
}];

export { SidebarElements, DynamicRoutes, CreateAPluginPage };
