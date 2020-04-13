import React from "react";
import { FhirClientContext } from "../FhirClientContext";

import { get } from 'lodash';

function PatientName({ name = [] }) {
    let elementToRender;
    let entry = name.find(nameRecord => nameRecord.use === "official") || name[0];

    if (!entry) {
        elementToRender = <h1>No Name</h1>;
    } else {
        elementToRender = <h1>{entry.given.join(" ") + " " + entry.family}</h1>;
    }
    return elementToRender;
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

export class PatientDemographics extends React.Component {
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
        this._loader = client.patient.read()
            .then(patient => {
                this.setState({ patient: patient, loading: false, error: null });
            })
            .catch(error => {
                this.setState({ error: error, loading: false });
            });
    }
    render() {
      const { patient } = this.state;
      
      return (
        <PatientBanner {...patient} /> 
      );
    }
}
export default PatientDemographics;