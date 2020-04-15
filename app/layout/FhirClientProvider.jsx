import React, { useState, useEffect } from 'react';

import { oauth2 as SMART } from "fhirclient";
import { FhirClientContext } from "../FhirClientContext";

import { 
  CardHeader,
  CardContent,
  Grid
} from '@material-ui/core';
import { PageCanvas, StyledCard } from 'material-fhir-ui';
import { get } from 'lodash';

import { Icon } from 'react-icons-kit'
import { warning } from 'react-icons-kit/fa/warning'


export class FhirClientProvider extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          client: null,
          error: null
      };
      this.setClient = client => this.setState({ client });
  }

  render() {

    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader')){
      headerHeight = 128;
    }

      
    let styles = {
      warningIcon: {
        marginTop: '32px',
        width: '48px',
        height: '48px',
        marginBottom: '32px'
      }
    }

    if (get(this, 'state.error')) {
      return <PageCanvas id='constructionZone' headerHeight={headerHeight} >
        <Grid container justify="center">
          <Grid item md={6}>
            <StyledCard scrollable margin={20} >
              <CardHeader title="Unable to Connect" 
                subheader="Covid19 Patient Chart Analysis requires the app to be launched from an Electronic Health Record (EHR)."
              />
              <CardContent style={{textAlign: 'center'}}>
                <Icon icon={warning} className="warningIcon" style={styles.warningIcon} size={48} />
                <h4 style={{margin: '0px', padding: '0px'}}>Warning Message</h4>
                <p style={{margin: '0px', padding: '0px'}}>{get(this, 'state.error.message')}</p>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </PageCanvas>
        
    }
      return (
          <FhirClientContext.Provider
              value={{
                  client: this.state.client,
                  setClient: this.setClient
              }}
          >
              <FhirClientContext.Consumer>
                  {({ client }) => {
                      if (!client) {
                          SMART.ready()
                              .then(client => this.setState({ client }))
                              .catch(error => this.setState({ error }));
                          return null;
                      }
                      return this.props.children;
                  }}
              </FhirClientContext.Consumer>
          </FhirClientContext.Provider>
      );
  }
}


// export function FhirClientProvider(props){

//   console.log('FhirClientProvider.SMART', SMART)

//   // ------------------------------------------------------------------
//   // Props  

//   const { children, ...otherProps } = props;

//   // ------------------------------------------------------------------
//   // Component State Variables  

//   const [internalClient, setInternalClient] = useState(null);
//   const [error, setError] = useState(null);


//   useEffect(function(){
//     SMART.ready()
//       .then(client => setInternalClient(client))
//       .catch(err => setError(err));
//   });


//   // ------------------------------------------------------------------
//   // Methods

//   function setClient(clientUpdate){
//     setInternalClient(clientUpdate)
//   }

//   // ------------------------------------------------------------------
//   // Rendering

//   let contentToRender;

//   let fhirClientContext = {
//     client: internalClient,
//     setClient: this.setClient
//   }

//   contentToRender = <FhirClientContext.Provider value={fhirClientContext}>
//     <FhirClientContext.Consumer>
//         {function({ client }){
//             if (client) {  
//               return children;
//             } else {
//               SMART.ready()
//                 .then(client => setInternalClient(client))
//                 .catch(err => setError(err));

//                 return null;
//               // return <div style={{padding:'200px', textAlign: 'center'}}>SMART client unable to connect to EHR launch context.</div>;
//             }
//         }}
//     </FhirClientContext.Consumer>
//   </FhirClientContext.Provider>
  
//   return (contentToRender);
// }



export default FhirClientProvider;
