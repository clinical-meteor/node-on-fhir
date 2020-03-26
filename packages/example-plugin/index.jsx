import React from 'react';

import CreateAPluginPage from './client/CreateAPluginPage.jsx';
import FhirQueryPage from './client/FhirQueryPage.jsx';

import { Icon } from 'react-icons-kit'
import {fire} from 'react-icons-kit/icomoon/fire'
import {puzzlePiece} from 'react-icons-kit/fa/puzzlePiece'


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
  icon: <Icon icon={puzzlePiece} />
}, {
  primaryText: 'Query a FHIR Endpoint',
  to: '/fhir-query',
  icon: <Icon icon={fire} />
}];

export { SidebarElements, DynamicRoutes, CreateAPluginPage };
