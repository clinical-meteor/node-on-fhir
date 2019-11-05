import React, { Component } from 'react';

import { 
  CssBaseline,
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  RaisedButton, 
  Tab, 
  Tabs 
} from '@material-ui/core';

export default class MainPage extends Component {
  state = {
    counter: 0,
  }

  increment() {
    this.setState({
      counter: this.state.counter + 1
    });
  }

  render() {
    return (
      <div style={{paddingLeft: '60px'}}>
        <Container>
          <Card>
            <CardHeader title="Node on FHIR" />
            <CardContent>
              Thank you for using Node on FHIR.  


              <h4>FHIR Libraries</h4>
              <ul>
                <li><b>FHIR.js</b></li>
                <li><b>fhirpath</b> - FhirPath</li>
                <li><b>ts-fhir-types</b> - Typescript definitions for FHIR.</li>
                <li><b>node-fhir-server-core</b> - Node FHIR Server</li>
              </ul>

              <h4>Features</h4>
              <ul>
                <li><b>Material Design</b></li>
                <li><b>Modular Reusable Components</b></li>
                <li><b>DevOps Logging</b></li>
                <li><b>Data Models</b></li>
                <li><b>Icons, Fonts & Typography</b></li>
                <li><b>Social Media Metadata</b></li>
                <li><b>Multitenant Design</b></li>
                <li><b>A/B Testing Infrastructure</b></li>
                <li><b>Distributed Mongo</b></li>
                <li><b>Mesh Networking</b></li>
                <li><b>Q/A Testing Examples</b></li>
              </ul>

              <h4>Acknowledgements</h4>
              <ul>
                <li><b>HL7</b></li>
                <li><b>AidBox</b></li>
                <li><b>Asymmetrik</b></li>
              </ul>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }
}
