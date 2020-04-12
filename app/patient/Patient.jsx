import React from "react";
import { FhirClientContext } from "../FhirClientContext";

import { get } from 'lodash';

function PatientName({ name = [] }) {
    let entry =
        name.find(nameRecord => nameRecord.use === "official") || name[0];
    if (!entry) {
        return <h1>No Name</h1>;
    }
    return <h1>{entry.given.join(" ") + " " + entry.family}</h1>;
}

function PatientBanner(patient) {

  return (
      <div>
          <PatientName name={patient.name} />
          <span>
              Gender: <b>{patient.gender}</b>,{" "}
          </span>
          <span>
              DOB: <b>{patient.birthDate}</b>
          </span>
      </div>
  );
}

export default class Patient extends React.Component {
    static contextType = FhirClientContext;
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            patient: null,
            error: null
        };
    }
    componentDidMount() {
        const client = this.context.client;
        this._loader = client.patient
            .read()
            .then(patient => {
                this.setState({ patient, loading: false, error: null });
            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
    }
    render() {


      
      const { error, loading, patient } = this.state;
      if (loading) {
          return null;
      }
      if (error) {
          return error.message;
      }

      return (
        <PatientBanner {...patient} /> 
      );
    }
}
