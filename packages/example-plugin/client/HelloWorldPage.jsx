import React from 'react';
import { Container, Card, CardMedia, CardContent, CardHeader } from '@material-ui/core';
import { get, has } from 'lodash';

// import CodeBlock from 'react-highlight-codeblock'

function HelloWorldPage(props){
  return (
    <div id='indexPage'>
      <Container>
        <Card height='auto'>
          <CardHeader 
            title="Create a Plugin" 
            subheader="MACRA and 21st Century Cures workflows."
            style={{fontSize: '100%'}} />
          <CardContent style={{fontSize: '100%'}}>

            <p>
              Node on FHIR is a distributed application (DApp) framework template built using Fast Healthcare Interoperability Resources.  
            </p>
            <p>
              The original idea was to develop a Wordpress style platform that teams could download and develop plugins for.  And then the different Wordpress nodes could all synchronize and talk with each other, because they were all programmed with the same FHIR resources to begin with.  Sort of a mesh network architecture as the base, with a plugin architecture at individual nodes so teams can develop customized workflow based on a common data layer.  
              With it, you can build supply chain blockchains or bit-torrent-like configuration data swarms or municipal IoT infrastructure or personal area networks or medical home appliances or whatever.  
            </p>
            <p>
              It works great, and we're pretty thrilled with it.  
            </p>

            <h4>Use Cases</h4>
            <ul>
              <li>Custom Workflows (clinics, laboratories, etc)</li>
              <li>Telemedicine</li>
              <li>Blockchains and Supply Chains</li>              
              <li>Synchronized Configuration</li>
              <li>Peer-to-Peer Networks</li>
              <li>Municipal Internet of Things</li>
              <li>Personal Area Health Networks</li>
              <li>Medical Home Appliances</li>
              <li>Smart Prosthetics</li>
            </ul>

            <h4>Licensing</h4>
            <ul>
              <li>FHIR related packages are generally MIT licensed</li>              
              <li>Node on FHIR application template is GPL Licensed</li>              
              <li>Plugins can be private & proprietary.</li>
            </ul>

            <h4>Customizing</h4>
            <ol>
              <li>Copy/duplicate the packages/example-plugin directory.</li>              
              <li>Update the metadata in Package.describe().  Be sure to specify a new package name (example: foo:my-first-plugin)</li>              
              <li>Add NPM packages your plugin will depend on with Npm.depends()</li>
              <li>Decide on a name of your new page (example: FooPage)</li>
              <li>Copy/duplicate the client/HelloWorldPage.jsx file </li>
              <li>Search/Replace the term HelloWorld with Foo; update the contents of the JSX (which is like HTML) </li>
              <li>Edit index.jsx.  Add an import for FooPage.  Add a dynamic route and a sidebar element.  </li>
              <li>Run your application with the plugin.</li>
              {/* <CodeBlock
                code="meteor run --extra-packages foo:my-first-plugin"
                editer={false}
                language="bash"
                style="monokai"
                showLineNumbers={false}
            /> */}

            </ol>

            <h4>Getting Started</h4>
            <ul>
              <li>
                <a href="https://guide.meteor.com/" >Meteor Guide (Tutorials)</a>                              
              </li>                              
              <li>
                <a href="https://github.com/symptomatic/node-on-fhir" >Node on FHIR Source Code (Github)</a>                              
              </li>              
              <li>
                <a href="https://github.com/symptomatic/node-on-fhir" >Example Plugin</a>                              
              </li>                                                 
              <li>
                <a href="https://www.hl7.org/fhir/resourcelist.html" >FHIR Resource List (Healthcare API)</a>                              
              </li>              
            </ul> 

            <h4>Getting Help</h4>
            <ul>
              <li>
                <a href="https://github.com/symptomatic/node-on-fhir/issues" >File an Issue or Bug</a>                              
              </li>              
              <li>
                <a href="https://www.meetup.com/Chicago-FHIR-Meetup/" >Chicago FHIR Users Group</a>
              </li>              
              <li>
                <a href="http://forums.meteor.com" >Meteor/Node Support Forums</a>
              </li>              
              <li>
                <a href="http://http://community.fhir.org/" >FHIR Community Forum</a>
              </li>              
              <li>
                <a href="http://chat.fhir.org" >FHIR Chat</a>
              </li>              
            </ul>                            

          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

export default HelloWorldPage;