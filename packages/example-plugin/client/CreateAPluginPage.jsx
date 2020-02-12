import React from 'react';
import { Container, Card, CardMedia, CardContent, CardHeader } from '@material-ui/core';
import { get, has } from 'lodash';

import StyledCard from './StyledCard';

function HelloWorldPage(props){

  let containerStyle = {
    paddingLeft: '100px', 
    paddingRight: '100px'
  };
  if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){
    containerStyle.paddingTop = "64px";
  }

  return (
    <div id='indexPage'>
      <Container style={containerStyle}>
        <StyledCard height='auto'>
          <CardHeader 
            title="Create a Plugin" 
            subheader="MACRA and 21st Century Cures workflows."
            style={{fontSize: '100%'}} />
          <CardContent style={{fontSize: '100%'}}>

            <p>
              Node on FHIR is a distributed application (DApp) framework built using Fast Healthcare Interoperability Resources.  Included in this template is a client/server web application that can compile to mobile devices.  In order to support iOS and Android and Desktop builds, we use a build tool called Meteor and a secondary package management system called Atmosphere.  These technologies are Node/Javascript based, and simply rebsent a particular flavor of building Node apps. However, having two package managers is a bit redundant, and makes it necessary to document how they work together.  
            </p>     


            <h4>Getting Started / Background Resources </h4>
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
            <img src="/packages/symptomatic_example-plugin/assets/NodeOnFhir-DirectoryStructure.png" style={{width: '100%'}} alt="Node on FHIR - Directory Structure Diagram" />

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

            <img src="/packages/symptomatic_example-plugin/assets/NodeOnFhir-Licensing.png" style={{width: '100%'}} alt="Node on FHIR Licensing" />



            <h4>Write Once, Run Anywhere</h4>
            <p>
              So, one of the holy grails of modern Javascript programming is the notion of isomorphic code, which means 'same shaped code'.  It's a fancy way of saying 'Write Once, Run Anywhere'.  For those of you who have worked with legacy Javascript libraries will know the wild-west that the ecosystem has been, with different dialects and idioms being used on the client vs server, and whether it's imported or required, and whether npm or bower is being used.    
            </p>
            <p>
              We've put about 5 years of research and development into finding an isomorphic code pattern that can run the same Javascript on client, server, database, testing utilities, and pretty much anywhere else you can imagine.  The secret sauce?  A technology called Ecmascript 6, commonly known as ES6.  
            </p>
            <img src="/packages/symptomatic_example-plugin/assets/NodeOnFhir-IsomorphicCode.png" style={{width: '100%'}} alt="Node on FHIR - Isomorphic Code" />



            <h4>Build Pipelines for Any Platform</h4>
            <p>
              If you haven't used Meteor, you're missing out on the most sophisticated build pipeline in the Javascript/Node ecosystem.  It's a meta-utility, that includes or matches the functionality of grunt, babel, webpack, rollup, cordova, and other popular build tools.  If you're familiar with one of those compilers, Meteor has probably incorporated it into its ecosystem.  Importantly, Meteor is built with a "Write Once, Run Anywhere" philosophy, and supports mobile and application development pipelines, which many competing tools don't support.  
            </p>
            <p>
              Ironically, the one thing that Meteor doesn't necessarily do well out of the box is build npm libraries, since it's so focused on building great applications.    
            </p>
            <img src="/packages/symptomatic_example-plugin/assets/NodeOnFhir-BuildPipeline.png" style={{width: '100%'}} alt="Node on FHIR - Build Pipeline" />
            <p>
              Please note:  This diagram is meant to be read right-to-left.  We diagram it this way because the files and directories in your code editor are going to be loosely displayed this way
            </p>

            <h4>Refactor Paths</h4>
            <p>
              With consideration of the above discussions on licensing, isomorphic code, and build pipelines, we recommend the following refactor path:  start off editing the <b>app/core/ConstructionZone</b> and adding files to <b>app</b> and <b>server</b> and <b>public</b> directories.  As your functionality grows, refactor the files and new code into an Atmosphere package.  It's ideal for rapid prototyping, and allows you to take advantage of upgrades to the Node on FHIR base platform as it's upgraded and bugs are fixed.  If/when your application grows to the point that you need that functionality in other Node apps, refactor your code from an Atmosphere package into an NPM package using <b>yarn rollup -c</b>
            </p>
            <img src="/packages/symptomatic_example-plugin/assets/NodeOnFhir-RefactorPaths.png" style={{width: '100%'}} alt="Node on FHIR - Refactor Paths" />



            <h4>Customizing</h4>
            <ol style={{lineSpacing: 1.5}}>
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







            <h4>FHIR Data Storage</h4>
            <p>
              One of the great things about the FHIR standard is the use of the JSON data type, which is supported by every web browser and most every modern programming language.  Because interoperability protocols provide us a baseline standard for what kind of data types and data objects are going to be sent around, we can build infrastructure anticipating the need to store JSON documents.  And here we enter the world of NoSQL databases and client side caching technologies.  Node on FHIR ships with the industry standard Mongo document database, and an associated client-side <b>minimongo</b> library.   
            </p>
            <img src="/packages/symptomatic_example-plugin/assets/NodeOnFhir-DataStores.png" style={{width: '100%'}} alt="Node on FHIR - Data Stores" />

            <h4>State Management</h4>
            <p>
              In order to get 60fps rendering performance in our application so it can run on mobile devices and feel responsive, we need to use a component rendering layer like React.  If you're new to React, welcome to a new world of web design.  If you're familiar with React already, you'll find much of the following discussion inspired by Redux.
            </p>
            <p>
              In general, the idea is that we want to use <b>functional components</b> to render our HTML.  Functional componets are a type of <b>pure function</b>, meaning they are deterministic and don't have any side effects.  The inputs into a pure function will always produce the same outputs.  
            </p>
            <p>
              However, these pure components need to attach to a data source which can be updated, and might themselves be deterministic.  These data sources might be our local <b>minimongo</b> data cache, or it might be the local <b>session</b> key/value store, or even something on-the-wire, such as the results of an <b>HTTP.get()</b> call.
            </p>
            <p>
              The general idea is that these data stores are monitored using the <b>useEffect</b> and <b>withTracker</b> hooks, which will cause a Page Component to trigger a cascading update to the components in it's render tree.  Once the Page Component kicks off a render, it passes data from the data store into the render tree via <b>props</b> (short for 'properties').  A unique feature of JSX and the render tree we use is that the props in a higher level component get passed into the lower level components.
            </p>
            <p>
              Once the render tree has finished rendering, method functions are attached to the DOM that can trigger an update to the data store, causing the entire render cycle to happen again.  
            </p>
            <img src="/packages/symptomatic_example-plugin/assets/NodeOnFhir-StateManagement.png" style={{width: '100%'}} alt="Node on FHIR - State Management" />

            <h4>FHIR Components</h4>
            <p>
              One of the great things about the FHIR standard is the use of the JSON data type, which is supported by every web browser and most every modern programming language.  Because interoperability protocols provide us a baseline standard for what kind of data types and data objects are going to be sent around, we can build infrastructure anticipating the need to store JSON documents.  And here we enter the world of NoSQL databases and client side caching technologies.  Node on FHIR ships with the industry standard Mongo document database, and an associated client-side <b>minimongo</b> library.   
            </p>
            <img src="/packages/symptomatic_example-plugin/assets/NodeOnFhir-FhirComponents.png" style={{width: '100%'}} alt="Node on FHIR - Fhir Components"  />

            <h4>Further Assistance</h4>
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