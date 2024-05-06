import { CardActions, Checkbox, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Button, Container, Box, Grid, CardHeader, CardMedia, CardContent, Typography } from '@material-ui/core';

import { StyledCard, PageCanvas, DynamicSpacer } from 'fhir-starter';


import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { browserHistory } from 'react-router';

import { get, set, uniq } from 'lodash';

import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';

import "ace-builds";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

import { ResponsiveNetwork } from '@nivo/network'

var neo4j = require('neo4j-driver')
var neoDriver = neo4j.driver(
  'neo4j://tiresias:7687',
  neo4j.auth.basic('awatson', 'CBR-KE-password')
)

let defaultGraphData = {
  "nodes": [
    {
      "id": "Node 1",
      "height": 1,
      "size": 24,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "Node 2",
      "height": 1,
      "size": 24,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "Node 3",
      "height": 1,
      "size": 24,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "Node 4",
      "height": 1,
      "size": 24,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "Node 5",
      "height": 1,
      "size": 24,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "Node 6",
      "height": 1,
      "size": 24,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "Node 7",
      "height": 1,
      "size": 24,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "Node 8",
      "height": 1,
      "size": 24,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "Node 9",
      "height": 1,
      "size": 24,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "Node 0",
      "height": 2,
      "size": 32,
      "color": "rgb(244, 117, 96)"
    },
    {
      "id": "Node 1.0",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 1.1",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 1.2",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 1.3",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 1.4",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 2.0",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 2.1",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 2.2",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 2.3",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 3.0",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 3.1",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 3.2",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 3.3",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 3.4",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 3.5",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 3.6",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 3.7",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 3.8",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 4.0",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 4.1",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 4.2",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 4.3",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 4.4",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 4.5",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 4.6",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 4.7",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 4.8",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 5.0",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 5.1",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 5.2",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 5.3",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 5.4",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 5.5",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 5.6",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 6.0",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 6.1",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 6.2",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 6.3",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 6.4",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 6.5",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 6.6",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 7.0",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 7.1",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 7.2",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 7.3",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 7.4",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 7.5",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 7.6",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 7.7",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 7.8",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 8.0",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 8.1",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 8.2",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 9.0",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 9.1",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 9.2",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "Node 9.3",
      "height": 0,
      "size": 12,
      "color": "rgb(232, 193, 160)"
    }
  ],
  "links": [
    {
      "source": "Node 0",
      "target": "Node 1",
      "distance": 80
    },
    {
      "source": "Node 1",
      "target": "Node 6",
      "distance": 80
    },
    {
      "source": "Node 1",
      "target": "Node 1.0",
      "distance": 50
    },
    {
      "source": "Node 1",
      "target": "Node 1.1",
      "distance": 50
    },
    {
      "source": "Node 1",
      "target": "Node 1.2",
      "distance": 50
    },
    {
      "source": "Node 1",
      "target": "Node 1.3",
      "distance": 50
    },
    {
      "source": "Node 1",
      "target": "Node 1.4",
      "distance": 50
    },
    {
      "source": "Node 0",
      "target": "Node 2",
      "distance": 80
    },
    {
      "source": "Node 2",
      "target": "Node 5",
      "distance": 80
    },
    {
      "source": "Node 2",
      "target": "Node 9",
      "distance": 80
    },
    {
      "source": "Node 2",
      "target": "Node 2.0",
      "distance": 50
    },
    {
      "source": "Node 2",
      "target": "Node 2.1",
      "distance": 50
    },
    {
      "source": "Node 2",
      "target": "Node 2.2",
      "distance": 50
    },
    {
      "source": "Node 2",
      "target": "Node 2.3",
      "distance": 50
    },
    {
      "source": "Node 0",
      "target": "Node 3",
      "distance": 80
    },
    {
      "source": "Node 3",
      "target": "Node 3.0",
      "distance": 50
    },
    {
      "source": "Node 3",
      "target": "Node 3.1",
      "distance": 50
    },
    {
      "source": "Node 3",
      "target": "Node 3.2",
      "distance": 50
    },
    {
      "source": "Node 3",
      "target": "Node 3.3",
      "distance": 50
    },
    {
      "source": "Node 3",
      "target": "Node 3.4",
      "distance": 50
    },
    {
      "source": "Node 3",
      "target": "Node 3.5",
      "distance": 50
    },
    {
      "source": "Node 3",
      "target": "Node 3.6",
      "distance": 50
    },
    {
      "source": "Node 3",
      "target": "Node 3.7",
      "distance": 50
    },
    {
      "source": "Node 3",
      "target": "Node 3.8",
      "distance": 50
    },
    {
      "source": "Node 0",
      "target": "Node 4",
      "distance": 80
    },
    {
      "source": "Node 4",
      "target": "Node 4.0",
      "distance": 50
    },
    {
      "source": "Node 4",
      "target": "Node 4.1",
      "distance": 50
    },
    {
      "source": "Node 4",
      "target": "Node 4.2",
      "distance": 50
    },
    {
      "source": "Node 4",
      "target": "Node 4.3",
      "distance": 50
    },
    {
      "source": "Node 4",
      "target": "Node 4.4",
      "distance": 50
    },
    {
      "source": "Node 4",
      "target": "Node 4.5",
      "distance": 50
    },
    {
      "source": "Node 4",
      "target": "Node 4.6",
      "distance": 50
    },
    {
      "source": "Node 4",
      "target": "Node 4.7",
      "distance": 50
    },
    {
      "source": "Node 4",
      "target": "Node 4.8",
      "distance": 50
    },
    {
      "source": "Node 0",
      "target": "Node 5",
      "distance": 80
    },
    {
      "source": "Node 5",
      "target": "Node 2",
      "distance": 80
    },
    {
      "source": "Node 5",
      "target": "Node 5.0",
      "distance": 50
    },
    {
      "source": "Node 5",
      "target": "Node 5.1",
      "distance": 50
    },
    {
      "source": "Node 5",
      "target": "Node 5.2",
      "distance": 50
    },
    {
      "source": "Node 5",
      "target": "Node 5.3",
      "distance": 50
    },
    {
      "source": "Node 5",
      "target": "Node 5.4",
      "distance": 50
    },
    {
      "source": "Node 5",
      "target": "Node 5.5",
      "distance": 50
    },
    {
      "source": "Node 5",
      "target": "Node 5.6",
      "distance": 50
    },
    {
      "source": "Node 0",
      "target": "Node 6",
      "distance": 80
    },
    {
      "source": "Node 6",
      "target": "Node 6.0",
      "distance": 50
    },
    {
      "source": "Node 6",
      "target": "Node 6.1",
      "distance": 50
    },
    {
      "source": "Node 6",
      "target": "Node 6.2",
      "distance": 50
    },
    {
      "source": "Node 6",
      "target": "Node 6.3",
      "distance": 50
    },
    {
      "source": "Node 6",
      "target": "Node 6.4",
      "distance": 50
    },
    {
      "source": "Node 6",
      "target": "Node 6.5",
      "distance": 50
    },
    {
      "source": "Node 6",
      "target": "Node 6.6",
      "distance": 50
    },
    {
      "source": "Node 0",
      "target": "Node 7",
      "distance": 80
    },
    {
      "source": "Node 7",
      "target": "Node 7.0",
      "distance": 50
    },
    {
      "source": "Node 7",
      "target": "Node 7.1",
      "distance": 50
    },
    {
      "source": "Node 7",
      "target": "Node 7.2",
      "distance": 50
    },
    {
      "source": "Node 7",
      "target": "Node 7.3",
      "distance": 50
    },
    {
      "source": "Node 7",
      "target": "Node 7.4",
      "distance": 50
    },
    {
      "source": "Node 7",
      "target": "Node 7.5",
      "distance": 50
    },
    {
      "source": "Node 7",
      "target": "Node 7.6",
      "distance": 50
    },
    {
      "source": "Node 7",
      "target": "Node 7.7",
      "distance": 50
    },
    {
      "source": "Node 7",
      "target": "Node 7.8",
      "distance": 50
    },
    {
      "source": "Node 0",
      "target": "Node 8",
      "distance": 80
    },
    {
      "source": "Node 8",
      "target": "Node 8.0",
      "distance": 50
    },
    {
      "source": "Node 8",
      "target": "Node 8.1",
      "distance": 50
    },
    {
      "source": "Node 8",
      "target": "Node 8.2",
      "distance": 50
    },
    {
      "source": "Node 0",
      "target": "Node 9",
      "distance": 80
    },
    {
      "source": "Node 9",
      "target": "Node 9.0",
      "distance": 50
    },
    {
      "source": "Node 9",
      "target": "Node 9.1",
      "distance": 50
    },
    {
      "source": "Node 9",
      "target": "Node 9.2",
      "distance": 50
    },
    {
      "source": "Node 9",
      "target": "Node 9.3",
      "distance": 50
    }
  ]
};

let dynamicGraphData = {
  "nodes": [],
  "links": []
}

export function KnowledgeGraphPage(props){
  let headerHeight = 84;
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    headerHeight = 148;
  }  

  let [editorText, setEditorText] = useState("");
  let [graphData, setGraphData] = useState(dynamicGraphData);


  useEffect(function(){
    console.log('KnowledgeGraphPage.useEffect()');
    var session = neoDriver.session();
    console.log('session', session);

    session
      .run('MATCH (concept1)-[:CHD]->(concept2) WHERE concept1.CUI = "C0032285" RETURN concept2;')
      .then(result => {
        console.log('result', result)
        let graphDataString = "";
        let graphData = {};

        let rootNode = {
          "id": 'root',
          "height": 1,
          "size": 24,
          "color": "rgb(97, 205, 187)"
        }

        dynamicGraphData.nodes.push(rootNode);

        let uniqRecords = [];

        uniqRecords = result.records.map(function(record){
          return record._fields;
        });

        uniqRecords = uniq(uniqRecords);
        console.log('uniqRecords.length', uniqRecords.length)

        uniqRecords.forEach(record => {
          // console.log(record)
          graphDataString += JSON.stringify(record.get('concept2').properties) + "\n";
          graphData = record.get('concept2').properties;

          let newNode = {
            // "id": record.get('concept2').properties.CUI,
            "id": record.get('concept2').elementId,
            "height": 1,
            "size": 24,
            "color": "rgb(97, 205, 187)"
          }

          let newLink = {
            "source": 'root',
            "target": record.get('concept2').elementId,
            "distance": 80
          } 
          
          dynamicGraphData.nodes.push(newNode);
          dynamicGraphData.links.push(newLink);
        })

        setGraphData(dynamicGraphData);
        setEditorText(graphDataString);
        // setGraphData(graphData);
      })
      .catch(error => {
        console.log(error)
      })
      .then(() => session.close())
  }, []);



  let compositeProcedureUrl = "/Procedure?code=";
  let compositeConditionUrl = "/Condition?code=";

  

  return (
    <PageCanvas id='VectorDatabasePage' headerHeight={headerHeight} >
      <Container style={{marginBottom: '84px', paddingBottom: '84px'}}>
        <Grid container spacing={3} justify="center" >
          <Grid item md={12}>          
            <StyledCard scrollable margin={20} style={{ display: 'flex' }}>
              <CardMedia
                component="img"
                style={{ width: 151, padding: '20px' }}
                image={Meteor.hostname() + '/packages/mitre_fhir-side/assets/knowledge-graph-sidebar.jpg'}
                alt="Fillbot!"
              />              
              <Box style={{ display: 'flex', flexDirection: 'column' }}>
                <CardHeader title="Knowledge Graph" subheader="Let Fillbot gather your Form 8500-8 data elements from the hospital EHR server." />
                <CardContent style={{width: '100%', height: '600px'}}>
                  
                    <ResponsiveNetwork
                      data={graphData}
                      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                      linkDistance={e=>e.distance}
                      centeringStrength={0.3}
                      repulsivity={6}
                      nodeSize={n=>n.size}
                      activeNodeSize={n=>1.5*n.size}
                      nodeColor={e=>e.color}
                      nodeBorderWidth={1}
                      nodeBorderColor={{
                          from: 'color',
                          modifiers: [
                              [
                                  'darker',
                                  0.8
                              ]
                          ]
                      }}
                      linkThickness={n=>2+2*n.target.data.height}
                      linkBlendMode="multiply"
                      motionConfig="wobbly"
                  />
                  
                </CardContent>
              </Box>
            </StyledCard>
            <DynamicSpacer />
            <StyledCard>
              <CardHeader title="Raw Data"  />
              <CardContent>
                <AceEditor
                  mode="text"
                  theme="github"
                  wrapEnabled={false}
                  // onChange={handleUpdateNdjsonString}
                  name="knowledgeGraphEditor"
                  editorProps={{ $blockScrolling: true }}
                  value={editorText}
                  style={{width: '100%', position: 'relative', height: '200px', minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px'}}        
                />   
              </CardContent>
            </StyledCard>
          </Grid>

        </Grid>
      </Container>
    </PageCanvas>
  );
}


export default KnowledgeGraphPage;