import React from 'react';

import CovidQueryPage from './client/CovidQueryPage';

// import { GoFlame } from 'react-icons/go';


import { 
  FetchButtons
} from './client/FooterButtons';

import { HeaderNavigation } from './client/HeaderNavigation';

var DynamicRoutes = [{
  'name': 'CovidQueryPage',
  'path': '/query-fhir-provider',
  'component': CovidQueryPage
}];

let FooterButtons = [{
  pathname: '/query-fhir-provider',
  component: <FetchButtons />
}];





SidebarElements = [{
  primaryText: "Query Hospital",
  to: '/query-fhir-provider',
  // icon: <GoFlame />
}];


let MainPage = CovidQueryPage;


export { 
  DynamicRoutes, 

  CovidQueryPage,

  HeaderNavigation,
  SidebarElements,
  FooterButtons,

  MainPage
};
