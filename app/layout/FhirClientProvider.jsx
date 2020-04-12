import React, { useState, useEffect } from 'react';

import { oauth2 as SMART } from "fhirclient";
import { FhirClientContext } from "../FhirClientContext";

import { get } from 'lodash';

export function FhirClientProvider(props){

  // ------------------------------------------------------------------
  // Props  

  const { children, ...otherProps } = props;

  // ------------------------------------------------------------------
  // Component State Variables  

  const [internalClient, setInternalClient] = useState(null);
  const [error, setError] = useState(null);

  // ------------------------------------------------------------------
  // Methods

  function setClient(clientUpdate){
    setInternalClient(clientUpdate)
  }

  // ------------------------------------------------------------------
  // Rendering


  let contentToRender;
  if (error) {
    contentToRender = <pre>{get(error, 'message', 'An error occurred, but unable to find a message.')}</pre>;
  } else {
    contentToRender = <FhirClientContext.Provider
        value={{
            client: internalClient,
            setClient: this.setClient
        }}
      >
      <FhirClientContext.Consumer>
          {({ client }) => {
              if (!client) {  
                  SMART.ready()
                      .then(client => setInternalClient(client))
                      .catch(error => setError(error));
                  return null;
              }
              return children;
          }}
      </FhirClientContext.Consumer>
    </FhirClientContext.Provider>
  }
  return (contentToRender);
}

export default FhirClientProvider;

// export default class FhirClientProvider extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             client: null,
//             error: null
//         };
//         this.setClient = client => this.setState({ client });
//     }

//     render() {
//         if (this.state.error) {
//             return <pre>{this.state.error.message}</pre>;
//         }
//         return (
//             <FhirClientContext.Provider
//                 value={{
//                     client: this.state.client,
//                     setClient: this.setClient
//                 }}
//             >
//                 <FhirClientContext.Consumer>
//                     {({ client }) => {
//                         if (!client) {
//                             SMART.ready()
//                                 .then(client => this.setState({ client }))
//                                 .catch(error => this.setState({ error }));
//                             return null;
//                         }
//                         return this.props.children;
//                     }}
//                 </FhirClientContext.Consumer>
//             </FhirClientContext.Provider>
//         );
//     }
// }
