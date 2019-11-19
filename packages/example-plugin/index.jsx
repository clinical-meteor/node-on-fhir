import React from 'react';

import HelloWorldPage from './client/HelloWorldPage.jsx';
import FhirQueryPage from './client/FhirQueryPage.jsx';

import { IoIosDocument} from 'react-icons/io';
import { GoFlame } from 'react-icons/go';
import { FaPuzzlePiece } from 'react-icons/fa';


var DynamicRoutes = [{
  'name': 'HelloWorldPage',
  'path': '/hello-world',
  'component': HelloWorldPage
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

export { SidebarElements, DynamicRoutes, HelloWorldPage };
