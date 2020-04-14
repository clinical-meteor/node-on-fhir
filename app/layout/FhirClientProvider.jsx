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

  let providerContext = {
    client: internalClient,
    setClient: this.setClient
  }

  contentToRender = <FhirClientContext.Provider value={providerContext}>
    <FhirClientContext.Consumer>
        {({ client }) => {
            if (!client) {  
                SMART.ready()
                    .then(client => setInternalClient(client))
                    .catch(err => setError(err));
                return null;
            }
            return children;
        }}
    </FhirClientContext.Consumer>
  </FhirClientContext.Provider>
  
  return (contentToRender);
}

export default FhirClientProvider;
