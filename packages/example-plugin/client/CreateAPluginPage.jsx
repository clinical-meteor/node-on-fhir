import React from 'react';
import { Container, Card, CardMedia, CardContent, CardHeader } from '@material-ui/core';
import { get, has } from 'lodash';

import StyledCard from './StyledCard';

// import CodeBlock from 'react-highlight-codeblock'

function HelloWorldPage(props){
  return (
    <div id='indexPage'>
      <Container>
        <StyledCard height='auto'>
          <CardHeader 
            title="Create a Plugin" 
            subheader="MACRA and 21st Century Cures workflows."
            style={{fontSize: '100%'}} />
          <CardContent style={{fontSize: '100%'}}>

            <p>
              Node on FHIR is a distributed application (DApp) framework built using Fast Healthcare Interoperability Resources.  Included in this template is a client/server web application that can compile to mobile devices.  In order to support iOS and Android and Desktop builds, we use a build tool called Meteor and a secondary package management system called Atmosphere.  These technologies are Node/Javascript based, and simply rebsent a particular flavor of building Node apps. However, having two package managers is a bit redundant, and makes it necessary to document how they work together.  
            </p>     

            <h4>Directory Structure</h4>
            <p>
              When the application launches, it reads through the <b>package.json</b> file, and finds two <b>mainModule</b> references, which point to files in the <b>client</b> and <b>server</b> directories.  These are the application launch points (yes, there are two) and displayed in yellow in the following diagram.  From these two launch points, it follows <b>import/export</b> statements through the directory structure, linking files, and pulling in the necessary code as needed.  
            </p>
            <p>
              While launching, the application will also read through the <b>package.json</b> file to discover the list of dependencies to pull in from the Node Package Manager (NPM).  These files are shown in green.
            </p>
            <p>
              When bulding your application, the Meteor build pipeline will scan through a second package management system called Atmosphere (shown in purple)  This second package manager was built at a time that NPM didn't support libraries on the browser and was an attempt to combine the NPM and Bower package managers.  NPM has since caught up in features and made Atmosphere somewhat redundant, and we see it's use gradually being phased out.  However, it still has some nice features related to building mobile apps, such as Cordova integration.  And we have good plugin architecture for user interface components based on it, which makes it useful for mixing-and-matching NPM libraries and bundling them up into modules.  So with much effort, we have identified and developed a coding pattern that can work in both Atmosphere and NPM libraries using modern Ecmasscript (ES6) syntax.  
            </p>
            <img src="/packages/symptomatic_example-plugin/assets/NodeOnFhir-DirectoryStructure.png" style={{width: '100%'}} />

{/* 
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
            </ul> */}

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




            <h4>Component Rendering on the Client</h4>
            <img src="/packages/symptomatic_example-plugin/assets/NodeOnFhir-ComponentRendering.png" style={{width: '100%'}} />



          </CardContent>
        </StyledCard>
        <br />
        <br />
        <br />
        <br />
      </Container>
    </div>
  );
}

export default HelloWorldPage;