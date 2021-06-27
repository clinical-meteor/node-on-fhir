import React from "react";

export const FhirClientContext = React.createContext({
    client: null,
    setClient: function(client) {
        context.client = client;
    },
    patientId: null,
    setPatientId: function(client) {
        context.client = client;
    }
});

export default FhirClientContext;


