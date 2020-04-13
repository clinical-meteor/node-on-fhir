import React from "react";

export default const FhirClientContext = React.createContext({
    client: null,
    setClient: function(client) {
        context.client = client;
    }
});
