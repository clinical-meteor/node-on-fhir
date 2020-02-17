import React from 'react';

import { 
  CssBaseline,
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Button,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';
import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import { get } from 'lodash';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

// import { Bundles } from '../lib/Bundles.js';

import BundleDetail from './BundleDetail';
import BundleTable from './BundleTable';



//=============================================================================================================================================
// GLOBAL THEMING

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// This is necessary for the Material UI component render layer
let theme = {
  primaryColor: "rgb(108, 183, 110)",
  primaryText: "rgba(255, 255, 255, 1) !important",

  secondaryColor: "rgb(108, 183, 110)",
  secondaryText: "rgba(255, 255, 255, 1) !important",

  cardColor: "rgba(255, 255, 255, 1) !important",
  cardTextColor: "rgba(0, 0, 0, 1) !important",

  errorColor: "rgb(128,20,60) !important",
  errorText: "#ffffff !important",

  appBarColor: "#f5f5f5 !important",
  appBarTextColor: "rgba(0, 0, 0, 1) !important",

  paperColor: "#f5f5f5 !important",
  paperTextColor: "rgba(0, 0, 0, 1) !important",

  backgroundCanvas: "rgba(255, 255, 255, 1) !important",
  background: "linear-gradient(45deg, rgb(108, 183, 110) 30%, rgb(150, 202, 144) 90%)",

  nivoTheme: "greens"
}

// if we have a globally defined theme from a settings file
if(get(Meteor, 'settings.public.theme.palette')){
  theme = Object.assign(theme, get(Meteor, 'settings.public.theme.palette'));
}

const muiTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: theme.primaryColor,
      contrastText: theme.primaryText
    },
    secondary: {
      main: theme.secondaryColor,
      contrastText: theme.errorText
    },
    appBar: {
      main: theme.appBarColor,
      contrastText: theme.appBarTextColor
    },
    cards: {
      main: theme.cardColor,
      contrastText: theme.cardTextColor
    },
    paper: {
      main: theme.paperColor,
      contrastText: theme.paperTextColor
    },
    error: {
      main: theme.errorColor,
      contrastText: theme.secondaryText
    },
    background: {
      default: theme.backgroundCanvas
    },
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
});


//=============================================================================================================================================
// Session Variables  


let defaultBundle = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};
Session.setDefault('bundleFormData', defaultBundle);
Session.setDefault('bundleSearchFilter', '');
Session.setDefault('selectedBundleId', false);
Session.setDefault('fhirVersion', 'v1.0.2');


//=============================================================================================================================================


// export class BundlesPage extends React.Component {
//   getMeteorData() {
//     let data = {
//       style: {
//         opacity: Session.get('globalOpacity'),
//         tab: {
//           borderBottom: '1px solid lightgray',
//           borderRight: 'none'
//         }
//       },
//       tabIndex: Session.get('bundlePageTabIndex'),
//       bundleSearchFilter: Session.get('bundleSearchFilter'),
//       fhirVersion: Session.get('fhirVersion'),
//       selectedBundleId: Session.get("selectedBundleId"),
//       selectedBundle: false
//     };

    
//     if (Session.get('selectedBundleId')){
//       data.selectedBundle = Bundles.findOne({_id: Session.get('selectedBundleId')});
//     } else {
//       data.selectedBundle = false;
//     }

//     // data.style = Glass.blur(data.style);
//     // data.style.appbar = Glass.darkroom(data.style.appbar);
//     // data.style.tab = Glass.darkroom(data.style.tab);

//     if(process.env.NODE_ENV === "test") console.log("BundlesPage[data]", data);
//     return data;
//   }

//   handleTabChange(index){
//     Session.set('bundlePageTabIndex', index);
//   }

//   onNewTab(){
//     Session.set('selectedBundleId', false);
//     Session.set('bundleUpsert', false);
//   }


//   render() {
//     // console.log('React.version: ' + React.version);


//     let headerHeight = 64;
//     if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){
//       headerHeight = 128;
//     }

//     return (
//       <PageCanvas id="bundlesPage" headerHeight={headerHeight} >
//         <MuiThemeProvider theme={muiTheme} >
//           <Grid container spacing={24}>
//             <Grid item md={6}>
//               <StyledCard height="auto" scrollable={true} margin={20} headerHeight={headerHeight}>
//                 <CardHeader
//                   title="Bundles"
//                 />
//                 <CardContent>
//                   <BundleTable 
//                     showBarcodes={true} 
//                     showAvatars={true} 
//                     noDataMessagePadding={100}
//                     />
//                 </CardContent>
//               </StyledCard>
//             </Grid>
//             <Grid item md={6}>
//               <StyledCard height="auto" scrollable={true} margin={20} headerHeight={headerHeight}>
//                 <CardContent>
//                   {/* <BundleDetail 
//                     id='bundleDetails' 
//                     fhirVersion={ this.data.fhirVersion }
//                     bundle={ this.data.selectedBundle }
//                     bundleId={ this.data.selectedBundleId }
//                   /> */}
//                 </CardContent>
//               </StyledCard>
//             </Grid>
//           </Grid>
//         </MuiThemeProvider>
//       </PageCanvas >
//     );
//   }
// }

// ReactMixin(BundlesPage.prototype, ReactMeteorData);

function BundlesPage(props){

  let headerHeight = 64;
  if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){
    headerHeight = 128;
  }

  return(
    <PageCanvas id="bundlesPage" headerHeight={headerHeight} >
      <MuiThemeProvider theme={muiTheme} >
        <Grid container spacing={3}>
          <Grid item md={6}>
            <StyledCard height="auto" scrollable={true} margin={20} headerHeight={headerHeight}>
              <CardHeader
                title="Bundles"
              />
              <CardContent>
                <BundleTable 
                  showBarcodes={true} 
                  showAvatars={true} 
                  noDataMessagePadding={100}
                  />
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item md={6}>
            <StyledCard height="auto" scrollable={true} margin={20} headerHeight={headerHeight}>
              <CardHeader
                title="Bundle Contents"
              />
              <CardContent>
                <BundleDetail 
                  id='bundleDetails' 
                  // fhirVersion={ this.data.fhirVersion }
                  // bundle={ this.data.selectedBundle }
                  // bundleId={ this.data.selectedBundleId }
                />
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
       
      </MuiThemeProvider> 
    </PageCanvas >
  )
}
export default BundlesPage;