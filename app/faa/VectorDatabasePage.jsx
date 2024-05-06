import { CardActions, Checkbox, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Button, Container, Box, Grid, CardHeader, CardMedia, CardContent, Typography } from '@material-ui/core';

import { StyledCard, PageCanvas, DynamicSpacer } from 'fhir-starter';


import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { browserHistory } from 'react-router';

import { get, set } from 'lodash';

import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';

import "ace-builds";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";



let defaultFaaSnomedCodes = [
  { code: '49436004', disorder: 'Atrial fibrillation (disorder)' },
  { code: '9014002', disorder: 'Psoriasis (disorder)' },
  { code: '3723001', disorder: 'Arthritis (disorder)' },
  { code: '195967001', disorder: 'Asthma (disorder)' },
  { code: '92814006', disorder: 'Chronic lymphoid leukemia, disease (disorder)' },
  { code: '64226004', disorder: 'Colitis (disorder)' },
  { code: '63406005', disorder: 'Malignant neoplasm of colon (disorder)' },
  { code: '13645005', disorder: 'Chronic obstructive pulmonary disease (disorder)' },
  { code: '23986001', disorder: 'Glaucoma (disorder)' },
  { code: '34068001', disorder: 'Heart valve replacement (procedure)' },
  { code: '50711007', disorder: 'Viral hepatitis type C (disorder)' },
  { code: '34486009', disorder: 'Hyperthyroidism (disorder)' },
  { code: '40930008', disorder: 'Hypothyroidism (disorder)' },
  { code: '95570007', disorder: 'Kidney stone (disorder)' },
  { code: '1163043007', disorder: 'Malignant lymphoma (morphologic abnormality)' },
  { code: '37796009', disorder: 'Migraine (disorder)' },
  { code: '48724000', disorder: 'Mitral valve regurgitation (disorder)' },
  { code: '73430006', disorder: 'Sleep apnea (disorder)' },
  { code: '195069001', disorder: 'Paroxysmal atrial tachycardia (disorder)' },
  { code: '399068003', disorder: 'Malignant tumor of prostate (disorder)' },
  { code: '1258883002', disorder: 'Thromboembolus of vein following surgical procedure' },
  { code: '399326009', disorder: 'Malignant neoplasm of urinary bladder (disorder)' },
  { code: '254837009', disorder: 'Malignant neoplasm of breast (disorder)' },
  { code: '93655004', disorder: 'Malignant melanoma of skin (disorder)' },
  { code: '363518003', disorder: 'Malignant tumor of kidney (disorder)' },
  { code: '53741008', disorder: 'Coronary arteriosclerosis (disorder)' },
  { code: '315272007', disorder: 'Suspected testicular cancer (situation)' },
  { code: '38341003', disorder: 'Hypertensive disorder, systemic arterial (disorder)' },
  { code: '714153000', disorder: 'Chronic kidney disease stage 5 with transplant (disorder)' },
  { code: '302215000', disorder: 'Thrombocytopenic disorder (disorder)' },
  { code: '62914000', disorder: 'Cerebrovascular disease (disorder)' },
  { code: '92824003', disorder: 'Neurofibromatosis type 1 (disorder)' },
  { code: '92814006', disorder: 'Chronic lymphoid leukemia, disease (disorder)' },
  { code: '714628002', disorder: 'Prediabetes (finding)' },
  { code: '238131007', disorder: 'Overweight (finding)' },
  { code: '414916001', disorder: 'Obesity (disorder)' },
  { code: '609558009', disorder: 'Essential tremor (disorder)' },
  { code: '267024001', disorder: 'Abnormal weight loss (finding)' },
  { code: '709044004', disorder: 'Chronic kidney disease (disorder)' },
  { code: '47505003', disorder: 'Posttraumatic stress disorder (disorder)' },
  { code: '87414006', disorder: 'Reactive depression (situational) (disorder)' },
  { code: '2897005', disorder: 'Immune thrombocytopenia (disorder)' },
  { code: '399170009', disorder: 'Primary hemochromatosis (disorder)' },
  { code: '781067001', disorder: 'Polycystic ovary (disorder)' }
];



export function VectorDatabasePage(props){
  let headerHeight = 84;
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    headerHeight = 148;
  }  

  let [editorText, setEditorText] = useState("");
  let [smartOnFhirFetchMedicalHistory, setSmartOnFhirFetchMedicalHistory] = useState("");
  let [conditionQueryUrl, setConditionQueryUrl] = useState("");
  let [procedureQueryUrl, setProcedureQueryUrl] = useState("");

  useEffect(function(){
    Meteor.call('http://tiresias:8085', null, function(error, result){
      if(result){
        console.log('http://tiresias:8085', result)
      }
      setEditorText(JSON.stringify(result))
    });
  }, []);

  function openLink(url){
    console.log("openLink", url);
    // browserHistory.push(url);
    props.history.replace(url)
  }

  
  function onEditorChange(newValue){
    console.log('onEditorChange', newValue)
    setEditorText(newValue)
  }
  function codeExists(code){
    let status = "Not Found";
    if(get(code, 'disorder').includes('procedure')){
      if(Procedures.findOne({'code.coding.code': get(code, 'code')})){
        status = "Exists";
      }
    } else {
      if(Conditions.findOne({'code.coding.code': get(code, 'code')})){
        status = "Exists";
      }
    }
    return status;
  }

  let [snomedCodes, setSnomedCodes] = useState(defaultFaaSnomedCodes);


  function assembleUrl(code){
    
    let returnUrl = "/";
    
    if(get(code, 'disorder').includes('procedure')){
      returnUrl = returnUrl + "Procedure?code=" + get(code, 'code');
    } else {
      returnUrl = returnUrl + "Condition?code=" + get(code, 'code');
    }

    return returnUrl;
  }

  function scanCurrentPatient(){
    console.log('scanCurrentPatient', snomedCodes);
    
    let newCodes = [];
    snomedCodes.forEach(function(code){
      if(get(code, 'disorder').includes('procedure')){
        if(Procedures.findOne({'code.coding.code': get(code, 'code')})){
          newCodes.push(code);
        }
      } else {
        if(Conditions.findOne({'code.coding.code': get(code, 'code')})){
          newCodes.push(code);
        }
      }
    });
    setSnomedCodes(newCodes);
  }


  let compositeProcedureUrl = "/Procedure?code=";
  let compositeConditionUrl = "/Condition?code=";

  snomedCodes.map(function(code){
    if(get(code, 'disorder').includes('procedure')){
      compositeProcedureUrl = compositeProcedureUrl + get(code, 'code') + ",";
    } else if(get(code, 'disorder').includes('disorder')){
      compositeConditionUrl = compositeConditionUrl + get(code, 'code') + ",";
    }
  });

  let tableRows = [];
  snomedCodes.map(function(code, index){
    tableRows.push(
      <TableRow key={index}>
        {/* <TableCell>{ get(code, 'status') }</TableCell> */}
        <TableCell>{ get(code, 'code') }</TableCell>
        <TableCell>{ get(code, 'disorder') }</TableCell>
        <TableCell>{ codeExists(code) }</TableCell>
        {/* <TableCell><Button onClick={openLink.bind(this, assembleUrl(code))}>Query</Button></TableCell> */}
      </TableRow>
    )
  })

  return (
    <PageCanvas id='VectorDatabasePage' headerHeight={headerHeight} >
      <Container style={{marginBottom: '84px', paddingBottom: '84px'}}>
        <Grid container spacing={3} justify="center" >
          <Grid item md={12}>          
            <StyledCard>
              <CardHeader title="Augmented Knowledge" subheader="Terminology codes (in CVS format)" />
              <CardContent style={{width: '100%'}} >
                <AceEditor
                    mode="text"
                    theme="github"
                    wrapEnabled={false}
                    // onChange={handleUpdateNdjsonString}
                    name="vectorDatabaseEditor"
                    editorProps={{ $blockScrolling: true }}
                    // value={ndjsonString}
                    style={{width: '100%', position: 'relative', height: '100px', minHeight: '100px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px'}}        
                  />                   
              </CardContent>
            </StyledCard>
            <DynamicSpacer />
            <StyledCard>
              <CardContent style={{width: '100%'}} >
                <CardHeader title="Blank Document" />
                <AceEditor
                    mode="text"
                    theme="github"
                    wrapEnabled={false}
                    // onChange={handleUpdateNdjsonString}
                    name="vectorDatabaseEditor"
                    editorProps={{ $blockScrolling: true }}
                    // value={ndjsonString}
                    style={{width: '100%', position: 'relative', height: '100px', minHeight: '100px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px'}}        
                  /> 
                  <DynamicSpacer />
                  <CardHeader title="No Embeddings" />
                  <AceEditor
                    mode="text"
                    theme="github"
                    wrapEnabled={false}
                    // onChange={handleUpdateNdjsonString}
                    name="vectorDatabaseEditor"
                    editorProps={{ $blockScrolling: true }}
                    // value={ndjsonString}
                    style={{width: '100%', position: 'relative', height: '100px', minHeight: '100px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px'}}        
                  /> 
                  <DynamicSpacer />
                  <CardHeader title="Embeddings" />
                  <AceEditor
                    mode="text"
                    theme="github"
                    wrapEnabled={false}
                    // onChange={handleUpdateNdjsonString}
                    name="vectorDatabaseEditor"
                    editorProps={{ $blockScrolling: true }}
                    // value={ndjsonString}
                    style={{width: '100%', position: 'relative', height: '100px', minHeight: '100px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px'}}        
                  /> 
                  <DynamicSpacer />
                  <CardHeader title="Added Triples" />
                  <AceEditor
                    mode="text"
                    theme="github"
                    wrapEnabled={false}
                    // onChange={handleUpdateNdjsonString}
                    name="vectorDatabaseEditor"
                    editorProps={{ $blockScrolling: true }}
                    // value={ndjsonString}
                    style={{width: '100%', position: 'relative', height: '100px', minHeight: '100px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px'}}        
                  /> 
              </CardContent>
            </StyledCard>
          </Grid>

        </Grid>
      </Container>
    </PageCanvas>
  );
}


export default VectorDatabasePage;