import { Button, Container, Box, Grid, CardHeader, CardMedia, CardContent, CardActions, Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { Alert } from '@mui/lab';

import { StyledCard, PageCanvas, DynamicSpacer } from 'fhir-starter';

import { Conditions, Procedures, Medications, Patients, Bundles, ExplanationOfBenefits, Locations } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { get, concat } from 'lodash';

import { Session } from 'meteor/session';

import "ace-builds";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

import form8500Response from '../data/QuestionnaireResponse-Form8500-8';
import formFasi from './data/QuestionnaireResponse-FASI';
import formHisHa from './data/QuestionnaireResponse-HIS-HA';
import formHisHd from './data/QuestionnaireResponse-HIS-HD';
import formIrfPai from './data/QuestionnaireResponse-IRF-PAI';
import formLcds from './data/QuestionnaireResponse-LCDS';
import formOasis from './data/QuestionnaireResponse-OASIS';



import { PatientCard } from 'fhir-starter';

import SurveyExpansionPanels from './SurveyExpansionPanels';
import { CollectionManagement } from './CollectionManagement';
import FhirClientProvider from './FhirClientProvider';

import Helpers from './Helpers';



export function CmsPage(props){
  let headerHeight = 84;
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    headerHeight = 148;
  }  

  let [editorText, setEditorText] = useState("");
  let [textNormalForm, setTextNormalForm] = useState("");
  let [ndjsonString, setNdjsonString] = useState("");
  let [llfFriendlyNdjsonString, setLlfFriendlyNdjsonString] = useState("");
  let [patientNarrative, setPatientNarrative] = useState("");


  let data = {
    questionnaires: Questionnaires.find().fetch(),
    questionnairesCount: Questionnaires.find().count(), 
    selectedQuestionnaireId: get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireId', ''),
    selectedQuestionnaire: Questionnaires.findOne({id: get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireId', '')}),
    selectedQuestionnaireResponseId: get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireResponseId', ''),
    selectedQuestionnaireResponse: QuestionnaireResponses.findOne({id: get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireResponseId', '')}),
    selectedPatient: null,
    exportBuffer: '',
    textNormalForm: ''
  };

  data.selectedPatient = useTracker(function(){
    return Session.get('selectedPatient');
  }, [])
  data.selectedQuestionnaireId = useTracker(function(){
    return Session.get('selectedQuestionnaireId');
  }, [])

  data.selectedQuestionnaire = useTracker(function(){
    return Questionnaires.findOne({id: Session.get('selectedQuestionnaireId')});
  }, [])

  data.selectedQuestionnaireResponseId = useTracker(function(){
    return Session.get('selectedQuestionnaireResponseId');
  }, [])

  data.selectedQuestionnaireResponse = useTracker(function(){
    return QuestionnaireResponses.findOne({id: Session.get('selectedQuestionnaireResponseId')}); 
  }, [])

  data.questionnaires = useTracker(function(){
    return Questionnaires.find().fetch();
  }, [])

  data.questionnairesCount = useTracker(function(){
    return Questionnaires.find().count();
  }, [])
  data.exportBuffer = useTracker(function(){
    return Session.get('exportBuffer');
  }, [])


  function openLink(url){
    console.log("openLink", url);
    // browserHistory.push(url);
    props.history.replace(url)
  }

  let selectedPatient = useTracker(function(){
    return Session.get('selectedPatient');
  }, [])

  let dataFetchError = useTracker(function(){
    return Session.get('dataFetchError');
  }, [])


  useTracker(function(){
    let textNormalFormValue = Session.get('textNormalForm')
    if(typeof textNormalFormValue === "string"){
      setTextNormalForm(textNormalFormValue)
    } else if (typeof textNormalFormValue === "object"){
      setTextNormalForm(JSON.stringify(textNormalFormValue, null, 2))
    } 
  }, [])

  useEffect(function(){
    console.log('CmsPage.useEffect()', editorText)
    QuestionnaireResponses._collection.insert(form8500Response, {filter: false, validate: false});

    QuestionnaireResponses._collection.insert(formFasi, {filter: false, validate: false});
    QuestionnaireResponses._collection.insert(formHisHa, {filter: false, validate: false});
    QuestionnaireResponses._collection.insert(formHisHd, {filter: false, validate: false});
    QuestionnaireResponses._collection.insert(formIrfPai, {filter: false, validate: false});
    QuestionnaireResponses._collection.insert(formLcds, {filter: false, validate: false});
    QuestionnaireResponses._collection.insert(formOasis, {filter: false, validate: false});    

    Session.set('QuestionnaireResponsesPage.onePageLayout', false);

    Session.set('selectedQuestionnaireId', get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireId', ''));
    Session.set('selectedQuestionnaire', Questionnaires.findOne({id: get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireId', '')}));
    Session.set('selectedQuestionnaireResponseId', get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireResponseId', ''));
    Session.set('selectedQuestionnaireResponse', QuestionnaireResponses.findOne({id: get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireResponseId', '')}));
  
  }, [])
  
  function selectMedicalHistory(){
    console.log('selectMedicalHistory')

    Helpers.selectMedicalHistory();
    Helpers.parseResourcesIntoStrings(data.exportBuffer)
  }
  function parseResourcesIntoStrings(){
    console.log('parseResourcesIntoStrings');

    Helpers.parseResourcesIntoStrings(data.exportBuffer)
  }

  function createNarrativeSummary(){
    console.log('createNarrativeSummary')

    Helpers.createNarrativeSummary(data.exportBuffer);
  }
  function openFillbotPage(){
    console.log('openFillbotPage');

    openLink('/fillbot')
  }
  function fillbotAnswersQuestionnaire(){
    console.log('fillbotAnswersQuestionnaire');

    
  }

  


  let patientCardElements = [];
  if(data.selectedPatient){
    patientCardElements.push(<DynamicSpacer />)
    patientCardElements.push(
      <PatientCard key={data.selectedPatient.id} fhirVersion="R4" patient={data.selectedPatient} />
    )
    patientCardElements.push(<DynamicSpacer />)
    patientCardElements.push(<StyledCard scrollable margin={20} >
      <CardHeader title="Medical History Summary" />
      <CardContent style={{width: '100%'}}>
        <CollectionManagement
          mode="additive"
          displayImportButton={false}
          displayImportCheckmarks={false}
          displayExportCheckmarks={false}
          displayExportButton={false}
          displayLocalClientCount={true}
          displayClientCount={false}
          displayDropButton={false}
          displayPubSubEnabled={false}
          noDataMessage="Please select a file to import."
          // preview={resourcePreview}
          onSelectionChange={function(selectionState){
            console.log('onSelectionChange', selectionState)
            setCollectionsToExport(selectionState);
          }}
        /> 
      </CardContent>
      <CardActions>
        <Button color="primary" onClick={selectMedicalHistory.bind(this)}>Select medical history</Button>
        <Button color="primary" onClick={parseResourcesIntoStrings.bind(this)}>Resource to string</Button>
        <Button color="primary" onClick={createNarrativeSummary.bind(this)}>Create narrative summary</Button>
        <Button disabled color="primary">Clear</Button>
      </CardActions>
    </StyledCard>)             
  }

  let workflowSelectionElements = [];
  if(!data.selectedPatient){
    workflowSelectionElements.push(              
      <Grid container spacing={3}>
        <Grid item sm={6} md={6}>
          <StyledCard scrollable margin={20} >
            <CardHeader title="Patient" />
            <CardContent style={{textAlign: 'center'}}>
              <img src={Meteor.absoluteUrl() + '/packages/mitre_fhir-side/assets/logo-patients.png'} style={{height: '200px'}} />                    
              <DynamicSpacer />
              <Button fullWidth variant="contained" color="primary" onClick={openLink.bind(this, '/smart-launcher')} disabled={selectedPatient ? true : false}>
                FETCH FROM PATIENT PORTAL
              </Button>
              <DynamicSpacer />
              <Button fullWidth variant="contained" color="default" onClick={openLink.bind(this, '/import-data')} disabled={selectedPatient ? true : false}>
                IMPORT PATIENT FILE
              </Button>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item sm={6} md={6}>
          <StyledCard scrollable margin={20} >
            <CardHeader title="Clinician / Social Worker" />
            <CardContent style={{textAlign: 'center'}}>
              <img src={Meteor.absoluteUrl() + '/packages/mitre_fhir-side/assets/logo-clinician.png'} style={{height: '200px'}} />
              <DynamicSpacer />
              <Button fullWidth variant="contained" color="primary" onClick={openLink.bind(this, '/smart-launcher')} disabled={selectedPatient ? true : false}>
                FETCH FROM EHR
              </Button>
              <DynamicSpacer />
              <Button fullWidth variant="contained" color="default" onClick={openLink.bind(this, '/import-data')} disabled={selectedPatient ? true : false}>
                IMPORT PATIENT FILE
              </Button>
            </CardContent>
          </StyledCard>
        </Grid>
        {/* <Grid item sm={4} md={4}>
          <StyledCard scrollable margin={20} >
            <CardHeader title="Examiner" />
            <CardContent>
              <img src={Meteor.absoluteUrl() + '/packages/mitre_fhir-side/assets/logo-examiner.png'} style={{width: '100%'}} />                                        
              <DynamicSpacer />
              <Button fullWidth variant="contained" color="primary" onClick={openLink.bind(this, '/smart-launcher')} disabled={true}>
                FETCH VIA TEFCA
              </Button>
              <DynamicSpacer />
              <Button fullWidth variant="contained" color="default" onClick={openLink.bind(this, '/import-data')} disabled={selectedPatient ? true : false}>
                IMPORT PATIENT FILE
              </Button>
            </CardContent>
          </StyledCard>
        </Grid> */}
      </Grid>
    )
    workflowSelectionElements.push(<DynamicSpacer />);
  }


  let dataError = [];
  if(dataFetchError){
    dataError.push(<Alert key="alert" severity="error">{get(dataFetchError, 'error')}</Alert>);
    dataError.push(<DynamicSpacer key="alert-spacer" />);
  }

  return (
    <FhirClientProvider location={get(props, 'history.location')}>
      <PageCanvas id='CmsPage' headerHeight={headerHeight} >
        <Container style={{marginBottom: '84px', paddingBottom: '84px'}}>
          <Grid container spacing={3} justify="center" >
          <Grid item md={12}>          
              <StyledCard scrollable margin={20} style={{ display: 'flex' }}>
                <CardMedia
                  component="img"
                  style={{ width: '220px', padding: '20px' }}
                  image={Meteor.hostname() + '/packages/mitre_fhir-side/assets/cms-logo.png'}
                  alt="Welcome to Aviation Medical Exam smart assistant!"
                />              
                <Box style={{ display: 'flex', flexDirection: 'column' }}>
                  <CardHeader title="Burden Reduction Smart Assistant" subheader="A smart assistant for completing clinical surveys." />
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      FillBot leverages large language models (LLMs) using retrieval augmented generation (RAG) to ​1) improve and accelerate the semantic harmonization of clinical data needed for the completion of standardized clinical surveys, and 2) accelerate the process for answering survey questions based on contextual knowledge extracted from structured and unstructured knowledge artifacts.​
                    </Typography>
                  </CardContent>
                </Box>
              </StyledCard>
            </Grid>
            <Grid item md={2}>            
              {/* <Button fullWidth variant="contained" color="primary" onClick={selectMedicalHistory.bind(this)} disabled={selectedPatient ? false : true}>
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
              </Button> */}
              
            </Grid>
            <Grid item md={10}> 
              <StyledCard scrollable margin={20} >
                <h1 className="barcode" style={{marginLeft: '20px', marginBottom: '0px', fontSize: '200%', fontWeight: 100}}>{get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireId') }</h1>
                <CardContent>
                  <CardHeader 
                    style={{paddingTop: '0px'}}
                    title={get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireName') }
                    subheader={Meteor.hostname() + 'fhirR4/Questionnaire/' + get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireId') }
                  />
                  <CardHeader 
                    style={{paddingTop: '0px'}}
                    title={get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireName') + " Response Template"}
                    subheader={Meteor.absoluteUrl() + '/fhirR4/QuestionnaireResponse/' + get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireResponseId') }
                  />
                </CardContent>
                {/* <CardActions>
                  <Button color="primary">Choose another questionnaire</Button>
                </CardActions> */}
              </StyledCard>
              <DynamicSpacer />
          
                { workflowSelectionElements }
                { dataError }
                { patientCardElements }

                
                
                <DynamicSpacer />
                <StyledCard scrollable margin={20} >
                  <CardHeader title="Clinical Summary" />
                  <CardContent style={{width: '100%'}}>                    
                    <AceEditor
                      mode="text"
                      theme="github"
                      wrapEnabled={false}
                      name="vectorDatabaseEditor"
                      editorProps={{ $blockScrolling: true }}
                      value={textNormalForm}
                      style={{width: '100%', position: 'relative', height: '300px', minHeight: '100px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px'}}        
                    /> 
                  </CardContent>
                  <CardActions>
                    <Button color="primary" onClick={fillbotAnswersQuestionnaire}>Have fillbot answer questions</Button>
                    <Button color="default" onClick={openFillbotPage}>Go to Fillbot</Button>
                  </CardActions>
                </StyledCard>
                <DynamicSpacer />                
                <SurveyExpansionPanels 
                  id='questionnaireDetails' 
                  selectedQuestionnaire={ get(data, "selectedQuestionnaire")} 
                  selectedQuestionnaireId={ get(data, "selectedQuestionnaireId")}
                  selectedQuestionnaireResponse={ get(data, "selectedQuestionnaireResponse") } 
                  selectedQuestionnaireResponseId={ get(data, "selectedQuestionnaireResponseId") }
                  autoExpand={true}
                />
                <DynamicSpacer />

              </Grid>
            </Grid>
        </Container>
      </PageCanvas>

    </FhirClientProvider>
  );
}


export default CmsPage;