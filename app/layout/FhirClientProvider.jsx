import React, { useState, useEffect } from 'react';

import { oauth2 as SMART } from "fhirclient";
import { FhirClientContext } from "../FhirClientContext";

import { get } from 'lodash';

export function FhirClientProvider(props){

  console.log('FhirClientProvider.SMART', SMART)
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

  let fhirClientContext = {
    client: internalClient,
    setClient: this.setClient
  }

  contentToRender = <FhirClientContext.Provider value={fhirClientContext}>
    <FhirClientContext.Consumer>
        {({ client }) => {
            if (client) {  
              return children;
            } else {
              SMART.ready()
              .then(client => setInternalClient(client))
              .catch(err => setError(err));
              return null;
            }
        }}
    </FhirClientContext.Consumer>
  </FhirClientContext.Provider>
  
  return (contentToRender);
}

export default FhirClientProvider;
