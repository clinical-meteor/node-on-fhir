import { Button, Container, Box, Grid, CardHeader, CardMedia, CardContent, Typography } from '@material-ui/core';

import { StyledCard, PageCanvas, DynamicSpacer } from 'fhir-starter';


import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { browserHistory } from 'react-router';

import { get, concat } from 'lodash';

import { Session } from 'meteor/session';

import "ace-builds";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

import form8500Response from '../data/QuestionnaireResponse-Form8500-8';


export function FhirSidePage(props){
  let headerHeight = 84;
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    headerHeight = 148;
  }  

  let [editorText, setEditorText] = useState("");
  let [textNormalForm, setTextNormalForm] = useState("");

  function openLink(url){
    console.log("openLink", url);
    // browserHistory.push(url);
    props.history.replace(url)
  }

  let selectedPatient = useTracker(function(){
    return Session.get('selectedPatient');
  }, [])
  useTracker(function(){
    setTextNormalForm(Session.get('textNormalForm'))
  }, [])

  useEffect(function(){
    console.log('FhirSidePage.useEffect()', editorText)
    QuestionnaireResponses._collection.insert(form8500Response, {filter: false, validate: false});

    Session.set('QuestionnaireResponsesPage.onePageLayout', false);
  }, [])
  
  function onEditorChange(newValue){
    console.log('onEditorChange', newValue)
    setEditorText(newValue)
  }

  function selectMedicalHistory(){
    console.log('selectMedicalHistory')

    let medicalHistory = {
      resourceType: "Bundle",
      type: "collection",
      entry: []
    }

    let conditions = Conditions.find().map(function(condition){
      delete condition._id;
      let entry = {
        resource: condition
      }
      return entry;
    });

    let procedures = Procedures.find().map(function(condition){
      delete condition._id;
      let entry = {
        resource: condition
      }
      return entry;
    });
    let medications = Medications.find().map(function(condition){
      delete condition._id;
      let entry = {
        resource: condition
      }
      return entry;
    });
    let patients = Patients.find().map(function(condition){
      delete condition._id;
      let entry = {
        resource: condition
      }
      return entry;
    });

    console.log('conditions.length', conditions.length)
    console.log('procedures.length', procedures.length)
    console.log('medications.length', medications.length)
    console.log('patients.length', patients.length)

    medicalHistory.entry = concat(medicalHistory.entry, patients);
    medicalHistory.entry = concat(medicalHistory.entry, conditions);
    medicalHistory.entry = concat(medicalHistory.entry, procedures);
    medicalHistory.entry = concat(medicalHistory.entry, medications);
    
    // kludgy, but it gets the job done

    console.log('medicalHistory', medicalHistory)
    console.log('medicalHistory.entry.length', medicalHistory.entry.length)
    Session.set('exportBuffer', medicalHistory);
  }


  return (
    <PageCanvas id='FhirSidePage' headerHeight={headerHeight} >
      <Container style={{marginBottom: '84px', paddingBottom: '84px'}}>
        <Grid container spacing={3} justify="center" >
        <Grid item md={12}>          
            <StyledCard scrollable margin={20} style={{ display: 'flex' }}>
              <CardMedia
                component="img"
                style={{ width: 151, padding: '20px' }}
                image={Meteor.hostname() + '/packages/mitre_fhir-side/assets/FillBot_04.gif'}
                alt="Fillbot!"
              />              
              <Box style={{ display: 'flex', flexDirection: 'column' }}>
                <CardHeader title="Fillbot" subheader="A smart assistant for completing clinical surveys." />
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    FillBot leverages large language models (LLMs) using retrieval augmented generation (RAG) to ​1) improve and accelerate the semantic harmonization of clinical data needed for the completion of standardized clinical surveys, and 2) accelerate the process for answering survey questions based on contextual knowledge extracted from structured and unstructured knowledge artifacts.​
                  </Typography>
                </CardContent>
              </Box>
            </StyledCard>
          </Grid>
          <Grid item md={6}>
            <StyledCard scrollable margin={20} >
              <CardHeader title="Workflow" />
              <CardContent>
                <ol style={{fontSize: '100%'}}>
                  <li>Patient clinical data and notes are pre-loaded into a RAG loading platform.​</li>
                  <li>A clinician selects a patient and a standardized survey to complete.​</li>
                  <li>Fillbot will read the survey questions and answers.​</li>
                  <li>Fillbot will perform a semantic search of the patient’s structured data and unstructured notes based on how similar the patient’s data is to the survey question and possible answers.​</li>
                  <li>FillBot will display the suggested answer to the survey question. FillBot will also identify what additional clinical information may be needed to suggest an answer. ​</li>
                  <li>If the answer is accepted, FillBot will transform the survey into the structured and coded format that conforms to the survey author for submission.</li>
                </ol>
              </CardContent>
            </StyledCard>
            <DynamicSpacer />
            {/* <Button onClick={openLink.bind(this, '/fillbot')} fullWidth variant="contained" color="secondary">Try Fillbot</Button> */}

            <Button fullWidth variant="contained" color="primary" onClick={openLink.bind(this, '/smart-launcher')} disabled={selectedPatient ? true : false}>
              FETCH FROM EHR
            </Button>
            <DynamicSpacer />
            <Button fullWidth variant="contained" color="primary" onClick={openLink.bind(this, '/import-data')} disabled={selectedPatient ? true : false}>
              IMPORT PATIENT FILE
            </Button>
            <DynamicSpacer />
            <Button fullWidth variant="contained" color="inherit" onClick={openLink.bind(this, '/patient-chart')} disabled={selectedPatient ? false : true} >
              REVIEW PATIENT CHART
            </Button>
            <DynamicSpacer />
            <Button fullWidth variant="contained" color="inherit" onClick={openLink.bind(this, '/clinical-story')} disabled={selectedPatient ? false : true}>
              REVIEW PATIENT STORY
            </Button>
            <DynamicSpacer />
            <DynamicSpacer />
            <Button fullWidth variant="contained" color="primary" onClick={selectMedicalHistory.bind(this)} disabled={selectedPatient ? false : true}>
              SELECT MEDICAL HISTORY TO USE
            </Button>
            <DynamicSpacer />
            <Button fullWidth variant="contained" color="inherit" onClick={openLink.bind(this, '/questionnaires')} disabled={selectedPatient ? false : true}>
              SELECT QUESTIONNAIRE
            </Button>
            <DynamicSpacer />
            <Button fullWidth variant="contained" color={textNormalForm ? "primary" : "inherit" } onClick={openLink.bind(this, '/fillbot')} disabled={selectedPatient ? false : true}>
              FILLBOT
            </Button>
            <DynamicSpacer />
            <Button fullWidth variant="contained" color="inherit" onClick={openLink.bind(this, '/questionnaire-responses')} disabled={selectedPatient ? false : true}>
              REVIEW COMPLETED DOCUMENTS
            </Button>
            
          </Grid>
          <Grid item md={6}>          
            <StyledCard scrollable margin={20} >
              <CardHeader title="AI Sandbox" />
              <CardContent>
                <img src={Meteor.absoluteUrl() + '/packages/mitre_fhir-side/assets/fillbot-architecture.png'} style={{width: '100%'}} />
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Container>
    </PageCanvas>
  );
}


export default FhirSidePage;