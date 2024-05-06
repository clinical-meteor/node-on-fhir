import { Button, Container, Box, Grid, CardHeader, CardMedia, CardContent, CardActions, Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { Alert } from '@mui/lab';

import { StyledCard, PageCanvas, PatientCard, DynamicSpacer } from 'fhir-starter';

import { Conditions, Procedures, Medications, Patients, Bundles, ExplanationOfBenefits, Locations } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { get, concat } from 'lodash';

import { Session } from 'meteor/session';

import { useLocation } from "react-router-dom";

import "ace-builds";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

import form8500Response from '../data/QuestionnaireResponse-Form8500-8';
import form8500Response1 from '../data/QuestionnaireResponse-Form8500-completed-1';

import SurveyExpansionPanels from './SurveyExpansionPanels';
import { CollectionManagement } from './CollectionManagement';
import FhirClientProvider from './FhirClientProvider';

import Helpers from './Helpers';

let defaultRapidAssesmentCodes = [
  { type: 'special-issuance', system: 'snomed-ct', code: '49436004', description: 'Atrial fibrillation (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '9014002', description: 'Psoriasis (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '3723001', description: 'Arthritis (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '195967001', description: 'Asthma (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '92814006', description: 'Chronic lymphoid leukemia, disease (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '64226004', description: 'Colitis (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '63406005', description: 'Malignant neoplasm of colon (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '13645005', description: 'Chronic obstructive pulmonary disease (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '34068001', description: 'Heart valve replacement (procedure)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '50711007', description: 'Viral hepatitis type C (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '34486009', description: 'Hyperthyroidism (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '40930008', description: 'Hypothyroidism (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '95570007', description: 'Kidney stone (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '1163043007', description: 'Malignant lymphoma (morphologic abnormality)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '37796009', description: 'Migraine (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '48724000', description: 'Mitral valve regurgitation (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '73430006', description: 'Sleep apnea (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '195069001', description: 'Paroxysmal atrial tachycardia (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '399068003', description: 'Malignant tumor of prostate (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '1258883002', description: 'Thromboembolus of vein following surgical procedure' },
  { type: 'special-issuance', system: 'snomed-ct', code: '399326009', description: 'Malignant neoplasm of urinary bladder (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '254837009', description: 'Malignant neoplasm of breast (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '93655004', description: 'Malignant melanoma of skin (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '363518003', description: 'Malignant tumor of kidney (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '53741008', description: 'Coronary arteriosclerosis (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '315272007', description: 'Suspected testicular cancer (situation)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '38341003', description: 'Hypertensive disorder, systemic arterial (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '714153000', description: 'Chronic kidney disease stage 5 with transplant (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '302215000', description: 'Thrombocytopenic disorder (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '62914000', description: 'Cerebrovascular disease (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '92824003', description: 'Neurofibromatosis type 1 (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '92814006', description: 'Chronic lymphoid leukemia, disease (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '714628002', description: 'Prediabetes (finding)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '238131007', description: 'Overweight (finding)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '414916001', description: 'Obesity (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '609558009', description: 'Essential tremor (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '267024001', description: 'Abnormal weight loss (finding)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '709044004', description: 'Chronic kidney disease (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '47505003', description: 'Posttraumatic stress disorder (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '87414006', description: 'Reactive depression (situational) (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '2897005', description: 'Immune thrombocytopenia (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '399170009', description: 'Primary hemochromatosis (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '781067001', description: 'Polycystic ovary (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '396275006 ', description: 'Osteoarthritis (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '9014002 ', description: 'Psoriasis (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '195967001', description: 'Asthma (disorder)' },  
  { type: 'special-issuance', system: 'snomed-ct', code: '363406005', description: 'Malignant neoplasm of colon (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '44054006', description: 'Diabetes mellitus type 2 (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '40468003', description: 'Viral hepatitis, type A (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '118601006', description: "Non-Hodgkin's lymphoma (disorder)" },
  { type: 'special-issuance', system: 'snomed-ct', code: '118599009', description: "Hodgkin's disease (disorder)" },
  { type: 'special-issuance', system: 'snomed-ct', code: '372244006', description: 'Malignant melanoma (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '42343007', description: 'Congestive heart failure (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '78275009', description: 'Obstructive sleep apnea syndrome (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '414915002', description: 'Obese (finding)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '95570007', description: 'Kidney stone (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '363449006', description: 'Malignant tumor of testis (disorder)' },
  { type: 'special-issuance', system: 'snomed-ct', code: '363443007', description: 'Malignant tumor of ovary (disorder)' },
  { type: 'special-issuance', system: 'loinc', code: '4547-6', description: 'Hemoglobin A1c/Hemoglobin.total in Blood' },
  { type: 'special-issuance', system: 'loinc', code: '69742-5', description: 'CBC Auto Differential panel in Blood by Automated count' },
  { type: 'special-issuance', system: 'loinc', code: '83073-7', description: 'Alpha-1-Fetoprotein [Mass/volume] in Serum or Plasma' },
  { type: 'special-issuance', system: 'loinc', code: '19180-9', description: 'Choriogonadotropin.beta subunit [Units/volume] in Serum or Plasma' },
  { type: 'special-issuance', system: 'loinc', code: '3016-3', description: 'Thyrotropin [Units/volume] in Serum or Plasma' },
  { type: 'special-issuance', system: 'loinc', code: '3024-7', description: 'Thyroxine (T4) free [Mass/volume] in Serum or Plasma' },
  { type: 'special-issuance', system: 'loinc', code: '42269-1', description: 'XR Chest and Abdomen Views' },
  { type: 'special-issuance', system: 'loinc', code: '44115-4', description: 'CT Abdomen and Pelvis' },
  { type: 'special-issuance', system: 'loinc', code: '36813-4', description: 'CT Abdomen and Pelvis W contrast IV' },
  { type: 'special-issuance', system: 'loinc', code: '36952-0', description: 'CT Abdomen and Pelvis with WO contrast' },
  { type: 'special-issuance', system: 'loinc', code: '24556', description: 'MR Abdomen' },
  { type: 'special-issuance', system: 'loinc', code: '24557-1', description: 'MR Abdomen WO and W contrast IV' },
  { type: 'special-issuance', system: 'loinc', code: '85475-2', description: 'US Heart Transesophageal' },
  { type: 'special-issuance', system: 'loinc', code: 'Ultrasound Kidney', description: '38036-0' },
  { type: 'special-issuance', system: 'rxnorm', code: '435', description: 'Albuterol' },
  { type: 'special-issuance', system: 'rxnorm', code: '860975', description: 'Metformin' },
  { type: 'special-issuance', system: 'rxnorm', code: '1373458', description: 'Canagliflozin' },
  { type: 'special-issuance', system: 'rxnorm', code: '1545653', description: 'Empagliflozin' },
  { type: 'special-issuance', system: 'rxnorm', code: '1488564', description: 'Dapagliflozin' },
  { type: 'special-issuance', system: 'rxnorm', code: '475968', description: 'Liraglutide' },
  { type: 'special-issuance', system: 'rxnorm', code: '1991302', description: 'Semaglutide (Oral)' },
  { type: 'special-issuance', system: 'rxnorm', code: '1551291', description: 'Dulaglutide (Injectable)' },
  { type: 'special-issuance', system: 'rxnorm', code: '6835', description: 'Methimazole' },
  { type: 'special-issuance', system: 'rxnorm', code: '8794', description: 'Propylthiouracil' },
  { type: 'special-issuance', system: 'rxnorm', code: '10582', description: 'Levothyroxine' },
  { type: 'special-issuance', system: 'rxnorm', code: '37418', description: 'Sumatriptan' },
  { type: 'special-issuance', system: 'rxnorm', code: '8787', description: 'Propranolol (for prevention)' },
  { type: 'special-issuance', system: 'rxnorm', code: '2045613', description: 'Erenumab (CGRP inhibitor)' },
  { type: 'special-issuance', system: 'rxnorm', code: '30125', description: 'Modafinil (for daytime sleepiness)' },
  { type: 'special-issuance', system: 'rxnorm', code: '4441', description: 'Flecainide' },
  { type: 'special-issuance', system: 'rxnorm', code: '1202', description: 'Atenolol' },
  { type: 'special-issuance', system: 'rxnorm', code: '6809', description: 'Metformin (for Prediabetes)' },
  { type: 'special-issuance', system: 'rxnorm', code: '8640', description: 'Prednisone (for corticosteroids)' },
  { type: 'do-not-fly', system: 'rxnorm', code: '3498', description: 'Diphenhydramine (Benadryl)' },
  { type: 'do-not-fly', system: 'rxnorm', code: '2400', description: 'Chlorpheniramine (Coricidin; ChlorTrimeton)' },
  { type: 'do-not-fly', system: 'rxnorm', code: '596', description: 'Alprazolam (Xanax)' },
  { type: 'do-not-fly', system: 'rxnorm', code: '6470', description: 'Lorazepam (Ativan)' },
  { type: 'do-not-fly', system: 'rxnorm', code: '10355', description: 'Temazepam (Restoril)' },
  { type: 'do-not-fly', system: 'rxnorm', code: '10767', description: 'Triazolam (Halcion)' },
  { type: 'do-not-fly', system: 'rxnorm', code: '2101', description: 'Carisoprodol (Soma)' },
  { type: 'do-not-fly', system: 'rxnorm', code: '21949', description: 'Cyclobenzaprine (Flexeril)' },
  { type: 'do-not-fly', system: 'rxnorm', code: '7052', description: 'Morphine' },
  { type: 'do-not-fly', system: 'rxnorm', code: '2670', description: 'Codeine' },
  { type: 'do-not-fly', system: 'rxnorm', code: '7804', description: 'Oxycodone (Percodan, Oxycontin)' },
  { type: 'do-not-fly', system: 'rxnorm', code: '5489', description: 'Hydrocodone (Lortab, Vicodin, etc.)' },
  { type: 'do-not-fly', system: 'rxnorm', code: '10689', description: 'Tramadol (Ultram)' },
  { type: 'do-not-fly', system: 'rxnorm', code: '3498', description: 'Diphenhydramine (as a sleep aid)' },
  { type: 'do-not-issue', system: 'rxnorm', code: '4917', description: 'Nitrates (Nitroglycerin)' },
  { type: 'do-not-issue', system: 'rxnorm', code: '6058', description: 'Isosorbide Dinitrate (Imdur)' },
  { type: 'do-not-issue', system: 'rxnorm', code: '35829', description: 'Ranolazine (Ranexa)' },
  { type: 'do-not-issue', system: 'rxnorm', code: '1223', description: 'Atropine' },
  { type: 'do-not-issue', system: 'rxnorm', code: '119565', description: 'Tolterodine (Detrol)' },
  { type: 'do-not-issue', system: 'rxnorm', code: '32675', description: 'Oxybutynin (Ditropan)' },
  { type: 'do-not-issue', system: 'rxnorm', code: '322167', description: 'Solifenacin (Vesicare)' },
  { type: 'do-not-issue', system: 'rxnorm', code: '1424', description: 'Benztropine (Cogentin)' },
  { type: 'do-not-issue', system: 'rxnorm', code: '139953', description: 'Pramlintide (Symlin)' },
  { type: 'do-not-issue', system: 'rxnorm', code: '1760', description: 'Bromocriptine (Cycloset, Parlodel)' },
  { type: 'do-not-issue', system: 'rxnorm', code: '746741', description: 'Pramipexole (Mirapex)' },
  { type: 'do-not-issue', system: 'rxnorm', code: '72302', description: 'Ropinirole (Requip)' },
  { type: 'do-not-issue', system: 'rxnorm', code: '616739', description: 'Rotigotine (NeuPro)' },
  { type: 'do-not-issue', system: 'rxnorm', code: '2599', description: 'Clonidine' },
  { type: 'do-not-issue', system: 'rxnorm', code: '6876', description: 'Methyldopa' },
  { type: 'do-not-issue', system: 'rxnorm', code: '9260', description: 'Reserpine' },
  { type: 'do-not-issue', system: 'rxnorm', code: '6694', description: 'Mefloquine (Lariam)' },
  { type: 'do-not-issue', system: 'rxnorm', code: '8640', description: 'Prednisone' },
  { type: 'do-not-issue', system: 'rxnorm', code: '8152', description: 'Phentermine (Adipex)' },
  { type: 'do-not-issue', system: 'rxnorm', code: '36437', description: 'Sertraline' },
  { type: 'do-not-issue', system: 'rxnorm', code: '6470', description: 'Lorazepam' },
  { type: 'do-not-issue', system: 'rxnorm', code: '35636', description: 'Risperidone' },
  { type: 'do-not-issue', system: 'rxnorm', code: '6901', description: 'Methylphenidate' },
  { type: 'do-not-issue', system: 'rxnorm', code: '42351', description: 'Lithium Carbonate' },
  { type: 'do-not-issue', system: 'rxnorm', code: '725', description: 'Amphetamine/Dextroamphetamine' },
  { type: 'do-not-issue', system: 'rxnorm', code: '3322', description: 'Diazepam' },
  { type: 'do-not-issue', system: 'rxnorm', code: '114477', description: 'Levetiracetam' },
  { type: 'do-not-issue', system: 'rxnorm', code: '42347', description: 'Bupropion + Naltrexone (Contrave)' }
];

if(Meteor.isClient){
  Session.setDefault('dataFetchError', null);
}

export function FaaPage(props){

  let searchParams = new URLSearchParams(useLocation().search);

  let headerHeight = 84;
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    headerHeight = 148;
  }  

  let [editorText, setEditorText] = useState("");
  let [textNormalForm, setTextNormalForm] = useState("");

  let [wellKnownSmartConfig, setWellKnownSmartConfig] = useState("");
  let [smartAccessToken, setSmartAccessToken] = useState("");
  let [fhirPatient, setFhirPatient] = useState("");
  let [serverCapabilityStatement, setServerCapabilityStatement] = useState("");

  let [ndjsonString, setNdjsonString] = useState("");
  let [llfFriendlyNdjsonString, setLlfFriendlyNdjsonString] = useState("");
  let [patientNarrative, setPatientNarrative] = useState("");
  let [rapidAssesmentCodes, setRapidAssesmentCodes] = useState(defaultRapidAssesmentCodes);

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

  useTracker(function(){
    return setFhirPatient(Session.get('selectedPatient'));
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
    console.log('FaaPage.useEffect()', editorText)

    if(!QuestionnaireResponses.findOne({_id: get(form8500Response, '_id')})){
      QuestionnaireResponses._collection.insert(form8500Response, {filter: false, validate: false});
    }
    if(!QuestionnaireResponses.findOne({_id: get(form8500Response1, '_id')})){
      QuestionnaireResponses._collection.insert(form8500Response1, {filter: false, validate: false});
    }

    Session.set('QuestionnaireResponsesPage.onePageLayout', false);

    Session.set('selectedQuestionnaireId', get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireId', ''));
    Session.set('selectedQuestionnaire', Questionnaires.findOne({id: get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireId', '')}));
    Session.set('selectedQuestionnaireResponseId', get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireResponseId', ''));
    Session.set('selectedQuestionnaireResponse', QuestionnaireResponses.findOne({id: get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireResponseId', '')}));
  
    fetchCapabilityStatement();    
  }, [])
  


  function fetchCapabilityStatement(){
    console.log('fetchCapabilityStatement');

    HTTP.get(get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', '') + "/metadata?_format=json", {}, function(error, result){ 
      if(error){
        console.error('HTTP.get /metadata error', error)
      }
      if(result){
        console.log('HTTP.get /metadata result', result)
        let parsedData;
        if(get(result, 'data')){
          setServerCapabilityStatement(result.data);
          fetchWellKnownSmartConfig();
        } else if (get(result, 'content')) {
          setServerCapabilityStatement(JSON.parse(get(result, 'content')));
          fetchWellKnownSmartConfig();
        }
      }
    });
  }
  function fetchWellKnownSmartConfig(callback){
    console.log('fetchWellKnownSmartConfig');

    HTTP.get(get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', '') + "/.well-known/smart-configuration", {}, function(error, result){
      if(error){
        console.error('HTTP.get /.well-known/smart-configuration error', error)
      }
      if(result){
        console.log('HTTP.get /.well-known/smart-configuration result', result)
        setWellKnownSmartConfig(get(result, 'data'));
        exchangeCodeForAccessToken(get(result, 'data'));
      }
    });
  }
  function exchangeCodeForAccessToken(wellKnownSmartConfig){
    console.log('exchangeCodeForAccessToken')
    console.log('exchangeCodeForAccessToken.url', get(wellKnownSmartConfig, 'token_endpoint'))

    let stringEncodedData = "grant_type=authorization_code&code=" + searchParams.get('code') + '&redirect_uri=' + encodeURIComponent(get(Meteor, 'settings.public.smartOnFhir[0].redirect_uri', '')) + '&client_id=' + get(Meteor, 'settings.public.smartOnFhir[0].client_id', '')
    console.log('exchangeCodeForAccessToken.stringEncodedData', stringEncodedData);
    let payload = {
      code: searchParams.get('code'),
      grant_type: 'authorization_code',
      redirect_uri: encodeURIComponent(get(Meteor, 'settings.public.smartOnFhir[0].redirect_uri', '')),
      client_id: get(Meteor, 'settings.public.smartOnFhir[0].client_id', '')
    }
    console.log('exchangeCodeForAccessToken.code', searchParams.get('code'))
    console.log('exchangeCodeForAccessToken.code', payload)
    
    HTTP.post(get(wellKnownSmartConfig, 'token_endpoint'), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      content: stringEncodedData
    }, function(error, result){
      if(error){
        console.error('HTTP.post /token error', error)
      }
      if(result){
        console.log('HTTP.post /token result', result)
        setSmartAccessToken(get(result, 'data'));

        fetchPatient(get(result, 'data.patient'), get(result, 'data.access_token'));        
      }
    });
  }
  function fetchPatient(patientId, accessToken){
    console.log('fetchPatient')
    console.log('fetchPatient.url', get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', '') + "/Patient")
    console.log('fetchPatient.url', accessToken)

    HTTP.get(get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', '') + "/Patient/" + patientId + "?_format=json", {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }, function(error, result){
      if(error){
        console.error('HTTP.get /Patient error', error)
      }
      if(result){
        console.log('HTTP.get /Patient result', result)
        if(get(result, 'data')){
          setFhirPatient(get(result, 'data'));
        } else if (get(result, 'content')) {
          setFhirPatient(JSON.parse(get(result, 'content')));

          Session.set('selectedPatient', JSON.parse(get(result, 'content')));
        }
      }
    });
  }

  function fetchPatientData(ehrLaunchCapabilities, client, accessToken) {
    console.log("---------------------------------------------------------------------")
    console.log("SMART ON FHIR - FhirClientProvider", ehrLaunchCapabilities);
  
    if(client){
      try {
  
  
  
        if(ehrLaunchCapabilities.Condition === true){
          const conditionQuery = new URLSearchParams();
          conditionQuery.set("patient", get(client, 'patient.id'));
          //console.log('Condition Query', conditionQuery);
  
          // without leading slash seems to work with Cerner, but not with Epic (?)
          let conditionUrl = '/Condition?' + conditionQuery.toString()
          //console.log('conditionUrl', conditionUrl);
  
          //console.log('querying the server for Conditions using client.request()')
          client.request(conditionUrl, { pageLimit: 0, flat: true}).then(conditions => {
            if(conditions){
              //console.log('PatientAutoDashboard.conditions', conditions)
              conditions.forEach(condition => {
                Conditions._collection.upsert({id: condition.id}, {$set: condition}, {validate: false, filter: false});                    
              });
            }
          });
  
          //console.log('querying the server for Conditions using HTTP.get()')
          let conditionUrlAssembled = get(client.getState(), 'serverUrl') + "/Condition?patient=" + client.getPatientId();
          // console.log('FhirClientProvider.conditionUrlAssembled:    ', conditionUrlAssembled);
  
          if(conditionUrlAssembled){        
            var httpHeaders = { headers: {
              'Accept': "application/json,application/fhir+json",
              "Authorization": "Bearer " + accessToken
            }}
  
            //console.log('FhirClientProvider.conditionUrlAssembled.httpHeaders:    ', httpHeaders);
  
            // need to reconcile with client.request() syntax above    
            HTTP.get(conditionUrlAssembled, httpHeaders, function(error, result){
              if(result){
                let parsedConditionBundle = JSON.parse(get(result, "content", {}))
                //console.log('FhirClientProvider.parsedConditionBundle', parsedConditionBundle);       
                
                if(parsedConditionBundle.resourceType === "Condition"){
                  if(!Conditions.findOne({id: parsedConditionBundle.id})){
                    Conditions._collection.upsert({id: parsedConditionBundle.id}, {$set: parsedConditionBundle}, {validate: false, filter: false});     
                  }
                }
              }
              if(error){
                console.log('HTTP.get().conditionUrlAssembled.error', error)
              }   
            })    
          }
        }
  
        if(ehrLaunchCapabilities.Encounter === true){
          const encounterQuery = new URLSearchParams();
          encounterQuery.set("patient", get(client, 'patient.id'));
          // console.log('Encounter Query', encounterQuery);
  
          // without leading slash seems to work with Cerner, but not with Epic (?)
          let encounterUrl = '/Encounter?' + encounterQuery.toString();
          // console.log('encounterUrl', encounterUrl);
  
          client.request(encounterUrl, { pageLimit: 0, flat: true }).then(encounters => {
            if(encounters){
              // console.log('PatientAutoDashboard.encounters', encounters)
              encounters.forEach(encounter => {
                Encounters._collection.upsert({id: encounter.id}, {$set: encounter}, {validate: false, filter: false});                    
              });    
            }
          });
        }
  
        if(ehrLaunchCapabilities.Procedure === true){
          const procedureQuery = new URLSearchParams();
          procedureQuery.set("patient", get(client, 'patient.id'));
          // console.log('Procedure Query', procedureQuery);
  
          // without leading slash seems to work with Cerner, but not with Epic (?)
          let procedureUrl = '/Procedure?' + procedureQuery
          // console.log('procedureUrl', procedureUrl);
  
          client.request(procedureUrl, { pageLimit: 0, flat: true }).then(procedures => {
            if(procedures){
              // console.log('PatientAutoDashboard.procedures', procedures)
              procedures.forEach(procedure => {
                Procedures._collection.upsert({id: procedure.id}, {$set: procedure}, {validate: false, filter: false});                    
              });    
            }
          });
        }
  
        if(ehrLaunchCapabilities.Immunization === true){
          const immunizationQuery = new URLSearchParams();
          immunizationQuery.set("patient", get(client, 'patient.id'));
          // console.log('Immunization Query', immunizationQuery);
  
          // without leading slash seems to work with Cerner, but not with Epic (?)
          let immunizationUrl = '/Immunization?' + immunizationQuery
          // console.log('immunizationUrl', immunizationUrl);
  
          client.request(immunizationUrl, {
            pageLimit: 0,
            flat: true
          }).then(immunizations => {
            if(immunizations){
              // console.log('PatientAutoDashboard.immunizations', immunizations)
              immunizations.forEach(immunization => {
                Immunizations._collection.upsert({id: immunization.id}, {$set: immunization}, {validate: false, filter: false});                    
              });    
            }
          });
        }
  
        if(ehrLaunchCapabilities.MedicationOrder === true){
          const medicationOrderQuery = new URLSearchParams();
          medicationOrderQuery.set("patient", get(client, 'patient.id'));
          // console.log('MedicationOrder Query', medicationOrderQuery);
  
          // without leading slash seems to work with Cerner, but not with Epic (?)
          let medicationOrderUrl = '/MedicationOrder?' + medicationOrderQuery
          // console.log('medicationOrderUrl', medicationOrderUrl);
  
          client.request(medicationOrderUrl, {
              pageLimit: 0,
              flat: true
          }).then(medicationOrders => {
            if(medicationOrders){
              // console.log('PatientAutoDashboard.medicationOrders', medicationOrders)
              medicationOrders.forEach(medOrder => {
                MedicationOrders._collection.upsert({id: medOrder.id}, {$set: medOrder}, {validate: false, filter: false});                    
              });    
            }
          });
        }
  
        if(ehrLaunchCapabilities.MedicationRequest === true){
          const medicationRequestQuery = new URLSearchParams();
          medicationRequestQuery.set("patient", get(client, 'patient.id'));
          // console.log('MedicationRequest Query', medicationRequestQuery);
  
          // without leading slash seems to work with Cerner, but not with Epic (?)
          let medicationRequestUrl = '/MedicationRequest?' + medicationRequestQuery
          // console.log('medicationRequestUrl', medicationRequestUrl);
  
          client.request(medicationRequestUrl, {
            pageLimit: 0,
            flat: true
          }).then(medicationRequests => {
            if(medicationRequests){
              // console.log('PatientAutoDashboard.medicationRequests', medicationRequests)
              medicationRequests.forEach(procedure => {
                  MedicationRequests._collection.upsert({id: procedure.id}, {$set: procedure}, {validate: false, filter: false});                    
              });    
            }
          });
        }
  
        if(ehrLaunchCapabilities.Observation === true){
  
          const observationQuery = new URLSearchParams();
  
          observationQuery.set("patient", get(client, 'patient.id'));
          observationQuery.set("category", "vital-signs");    
  
          // console.log('Vital Signs Query', observationQuery);
      
          // without leading slash seems to work with Cerner, but not with Epic (?)
          let vitalSignsUrl = '/Observation?' + observationQuery.toString();
          // console.log('vitalSignsUrl', vitalSignsUrl);
  
            client.request(vitalSignsUrl, { pageLimit: 0, flat: true }).then(observations => {
            if(observations){
              // console.log('PatientAutoDashboard.observations.vital-signs', observations)
              observations.forEach(observation => {
                Observations._collection.upsert({id: observation.id}, {$set: observation}, {validate: false, filter: false});
              });
            }
          });
  
          observationQuery.delete("category");    
          observationQuery.set("category", "laboratory");    
  
          // console.log('Vital Signs Query', observationQuery);
      
          // without leading slash seems to work with Cerner, but not with Epic (?)
          let laboratoryUrl = '/Observation?' + observationQuery.toString();
          // console.log('laboratoryUrl', laboratoryUrl);
  
            client.request(laboratoryUrl, { pageLimit: 0, flat: true }).then(observations => {
            if(observations){
              // console.log('PatientAutoDashboard.observations.laboratory', observations)
              observations.forEach(observation => {
                Observations._collection.upsert({id: observation.id}, {$set: observation}, {validate: false, filter: false});
              });
            }
          });
        }
  
      } catch (error) {
          alert("We had an error fetching data.", error)
      }
    }
  }
  

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


  function startRapidAssessment(){
    console.log('startRapidAssessment')

    let newSomedCodes = [];
    rapidAssesmentCodes.forEach(function(code){
      console.log('checking if medical history contains the following: ' + get(code, 'code'));
      if(get(code, 'description').includes('procedure')){
        if(Procedures.findOne({'code.coding.code': get(code, 'code')})){
          newSomedCodes.push(code);
        }
      } else {
        if(Conditions.findOne({'code.coding.code': get(code, 'code')})){
          newSomedCodes.push(code);
        } else if(Medications.findOne({'code.coding.code': get(code, 'code')})){
          newSomedCodes.push(code);
        } else if(MedicationRequests.findOne({'code.coding.code': get(code, 'code')})){
          newSomedCodes.push(code);
        }
      }
    });
    setRapidAssesmentCodes(newSomedCodes);
  }

  // TODO:  extract into shared library
  function codeExists(code){
    let status = "Not Found";
    if(get(code, 'disorder', "").includes('procedure')){
      if(Procedures.findOne({'code.coding.code': get(code, 'code')})){
        status = "Exists";
      }
    } else if(get(code, 'disorder', "")){
      if(Conditions.findOne({'code.coding.code': get(code, 'code')})){
        status = "Exists";
      }
    } else if(get(code, 'medication', "")){
      if(Medications.findOne({'code.coding.code': get(code, 'code')})){
        status = "Exists";
      }
    }
    return status;
  }

  let rapidAssessmentTableRows = [];
  rapidAssesmentCodes.map(function(code, index){
    rapidAssessmentTableRows.push(
      <TableRow key={index}>
        <TableCell>{get(code, 'type', '')}</TableCell>
        <TableCell>{get(code, 'code', '')}</TableCell>
        <TableCell>{get(code, 'description', '')}</TableCell>
        <TableCell>{codeExists(code)}</TableCell>
      </TableRow>
    )
  });

  let patientCardElements = [];
  if(fhirPatient){
    patientCardElements.push(<DynamicSpacer key="0" />)
    patientCardElements.push(
      <PatientCard key={fhirPatient.id} fhirVersion="R4" patient={fhirPatient} />
    )
  }

  let workflowSelectionElements = [];
  if(!fhirPatient){
    workflowSelectionElements.push(              
      <Grid container spacing={3} key="0">
        <Grid item sm={4} md={4}>
          <StyledCard scrollable margin={20} >
            <CardHeader title="Pilot" />
            <CardContent>
              <img src={Meteor.absoluteUrl() + '/packages/mitre_fhir-side/assets/logo-pilot.png'} style={{width: '100%'}} />                    
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
        <Grid item sm={4} md={4}>
          <StyledCard scrollable margin={20} >
            <CardHeader title="Clinician" />
            <CardContent>
              <img src={Meteor.absoluteUrl() + '/packages/mitre_fhir-side/assets/logo-clinician.png'} style={{width: '100%'}} />
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
        <Grid item sm={4} md={4}>
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
        </Grid>
      </Grid>
    )
    workflowSelectionElements.push(<DynamicSpacer key="1" />);
  }

  let dataError = [];
  if(dataFetchError){
    dataError.push(<Alert key="alert" severity="error">{get(dataFetchError, 'error')}</Alert>);
    dataError.push(<DynamicSpacer key="alert-spacer" />);
  }

  return (
    
      <PageCanvas id='FaaPage' headerHeight={headerHeight} >
        <Container style={{marginBottom: '84px', paddingBottom: '84px'}}>
          <Grid container spacing={3} justify="center" >
            <Grid item md={12}>          
              <StyledCard scrollable margin={20} style={{ display: 'flex' }}>
                <CardMedia
                  component="img"
                  style={{ width: '220px', padding: '20px' }}
                  image={Meteor.hostname() + '/packages/mitre_fhir-side/assets/faa-logo.png'}
                  alt="Welcome to Aviation Medical Exam smart assistant!"
                />              
                <Box style={{ display: 'flex', flexDirection: 'column' }}>
                  <CardHeader title="Form 8500-8 Smart Assistant" subheader="A smart assistant for completing clinical surveys." />
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      FillBot leverages large language models (LLMs) using retrieval augmented generation (RAG) to ​1) improve and accelerate the semantic harmonization of clinical data needed for the completion of standardized clinical surveys, and 2) accelerate the process for answering survey questions based on contextual knowledge extracted from structured and unstructured knowledge artifacts.​
                    </Typography>
                  </CardContent>
                </Box>
              </StyledCard>
            </Grid>
            <Grid item md={2}></Grid>
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
              </StyledCard>
              <DynamicSpacer />
          
              { workflowSelectionElements }
              { dataError }
              { patientCardElements }

              <DynamicSpacer />
              <StyledCard scrollable margin={20} >
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
                  <Button color="default" onClick={parseResourcesIntoStrings.bind(this)}>Resource to string</Button>
                  <Button disabled color="primary" onClick={createNarrativeSummary.bind(this)}>Create narrative summary</Button>
                  <Button disabled color="primary">Clear</Button>
                </CardActions>
              </StyledCard>
                
              <DynamicSpacer />
              <StyledCard scrollable margin={20} >
                <CardHeader title="Clinical Summary" />
                <CardContent style={{width: '100%'}}>                  
                  <AceEditor
                    mode="text"
                    theme="github"
                    wrapEnabled={true}
                    name="vectorDatabaseEditor"
                    editorProps={{ $blockScrolling: true }}
                    value={typeof textNormalForm === "string" ? textNormalForm : JSON.stringify(textNormalForm, null, 2)}
                    style={{width: '100%', position: 'relative', height: '400px', minHeight: '100px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px'}}        
                  /> 
                </CardContent>
                <CardActions>
                  <Button color="primary" onClick={startRapidAssessment.bind(this)}>Start Rapid Assessment</Button>
                  <Button disabled color="primary">Clear</Button>
                </CardActions>
              </StyledCard>
              <DynamicSpacer />
              <StyledCard scrollable margin={20} >
                <CardHeader title="Rapid Assessment Results" />
                <CardContent style={{height: '300px', overflow: 'scroll'}}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>LOINC Code</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Present</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody >
                      { rapidAssessmentTableRows }
                    </TableBody>
                  </Table>
                </CardContent>
                <CardActions>
                  <Button color="primary" onClick={fillbotAnswersQuestionnaire}>Have fillbot answer questions</Button>
                  <Button color="default" onClick={openFillbotPage}>Go to Fillbot</Button>
                </CardActions>
              </StyledCard>
              <DynamicSpacer />                
              <SurveyExpansionPanels 
                id="questionnaireDetails"
                selectedQuestionnaire={ get(data, "selectedQuestionnaire")} 
                selectedQuestionnaireId={ get(data, "selectedQuestionnaireId")}
                selectedQuestionnaireResponse={ get(data, "selectedQuestionnaireResponse") } 
                selectedQuestionnaireResponseId={ get(data, "selectedQuestionnaireResponseId") }
                autoExpand={true}
              />
            </Grid>
          </Grid>
        </Container>
      </PageCanvas>

    
  );
}


export default FaaPage;