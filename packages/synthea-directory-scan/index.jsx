import React from 'react';

import SyntheaAboutDialog from './client/SyntheaAboutDialog';

import { 
  SyntheaAnalysisFooter
} from './client/SyntheaAnalysisFooter';




let DialogComponents = [ {
  name: "SyntheaAboutDialog",
  component: <SyntheaAboutDialog />
}]


let FooterButtons = [{
  pathname: '/',
  component: <SyntheaAnalysisFooter />
}, {
  pathname: '/synthea-analysis',
  component: <SyntheaAnalysisFooter />
}];


export {  FooterButtons, DialogComponents, SyntheaAboutDialog };
