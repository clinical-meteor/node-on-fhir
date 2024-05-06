import { CardActions, Checkbox, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Button, Container, Box, Grid, CardHeader, CardMedia, CardContent, Typography } from '@material-ui/core';
import { Alert } from '@mui/lab';

import { StyledCard, PageCanvas, DynamicSpacer } from 'fhir-starter';


import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { browserHistory } from 'react-router';

import { get, set, concat } from 'lodash';

import { Session } from 'meteor/session';

import "ace-builds";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";




let specialIssuanceSnomedCodes = [
  { system: 'snomed-ct', code: '49436004', disorder: 'Atrial fibrillation (disorder)' },
  { system: 'snomed-ct', code: '9014002', disorder: 'Psoriasis (disorder)' },
  { system: 'snomed-ct', code: '3723001', disorder: 'Arthritis (disorder)' },
  { system: 'snomed-ct', code: '195967001', disorder: 'Asthma (disorder)' },
  { system: 'snomed-ct', code: '92814006', disorder: 'Chronic lymphoid leukemia, disease (disorder)' },
  { system: 'snomed-ct', code: '64226004', disorder: 'Colitis (disorder)' },
  { system: 'snomed-ct', code: '63406005', disorder: 'Malignant neoplasm of colon (disorder)' },
  { system: 'snomed-ct', code: '13645005', disorder: 'Chronic obstructive pulmonary disease (disorder)' },
  { system: 'snomed-ct', code: '34068001', disorder: 'Heart valve replacement (procedure)' },
  { system: 'snomed-ct', code: '50711007', disorder: 'Viral hepatitis type C (disorder)' },
  { system: 'snomed-ct', code: '34486009', disorder: 'Hyperthyroidism (disorder)' },
  { system: 'snomed-ct', code: '40930008', disorder: 'Hypothyroidism (disorder)' },
  { system: 'snomed-ct', code: '95570007', disorder: 'Kidney stone (disorder)' },
  { system: 'snomed-ct', code: '1163043007', disorder: 'Malignant lymphoma (morphologic abnormality)' },
  { system: 'snomed-ct', code: '37796009', disorder: 'Migraine (disorder)' },
  { system: 'snomed-ct', code: '48724000', disorder: 'Mitral valve regurgitation (disorder)' },
  { system: 'snomed-ct', code: '73430006', disorder: 'Sleep apnea (disorder)' },
  { system: 'snomed-ct', code: '195069001', disorder: 'Paroxysmal atrial tachycardia (disorder)' },
  { system: 'snomed-ct', code: '399068003', disorder: 'Malignant tumor of prostate (disorder)' },
  { system: 'snomed-ct', code: '1258883002', disorder: 'Thromboembolus of vein following surgical procedure' },
  { system: 'snomed-ct', code: '399326009', disorder: 'Malignant neoplasm of urinary bladder (disorder)' },
  { system: 'snomed-ct', code: '254837009', disorder: 'Malignant neoplasm of breast (disorder)' },
  { system: 'snomed-ct', code: '93655004', disorder: 'Malignant melanoma of skin (disorder)' },
  { system: 'snomed-ct', code: '363518003', disorder: 'Malignant tumor of kidney (disorder)' },
  { system: 'snomed-ct', code: '53741008', disorder: 'Coronary arteriosclerosis (disorder)' },
  { system: 'snomed-ct', code: '315272007', disorder: 'Suspected testicular cancer (situation)' },
  { system: 'snomed-ct', code: '38341003', disorder: 'Hypertensive disorder, systemic arterial (disorder)' },
  { system: 'snomed-ct', code: '714153000', disorder: 'Chronic kidney disease stage 5 with transplant (disorder)' },
  { system: 'snomed-ct', code: '302215000', disorder: 'Thrombocytopenic disorder (disorder)' },
  { system: 'snomed-ct', code: '62914000', disorder: 'Cerebrovascular disease (disorder)' },
  { system: 'snomed-ct', code: '92824003', disorder: 'Neurofibromatosis type 1 (disorder)' },
  { system: 'snomed-ct', code: '92814006', disorder: 'Chronic lymphoid leukemia, disease (disorder)' },
  { system: 'snomed-ct', code: '714628002', disorder: 'Prediabetes (finding)' },
  { system: 'snomed-ct', code: '238131007', disorder: 'Overweight (finding)' },
  { system: 'snomed-ct', code: '414916001', disorder: 'Obesity (disorder)' },
  { system: 'snomed-ct', code: '609558009', disorder: 'Essential tremor (disorder)' },
  { system: 'snomed-ct', code: '267024001', disorder: 'Abnormal weight loss (finding)' },
  { system: 'snomed-ct', code: '709044004', disorder: 'Chronic kidney disease (disorder)' },
  { system: 'snomed-ct', code: '47505003', disorder: 'Posttraumatic stress disorder (disorder)' },
  { system: 'snomed-ct', code: '87414006', disorder: 'Reactive depression (situational) (disorder)' },
  { system: 'snomed-ct', code: '2897005', disorder: 'Immune thrombocytopenia (disorder)' },
  { system: 'snomed-ct', code: '399170009', disorder: 'Primary hemochromatosis (disorder)' },
  { system: 'snomed-ct', code: '781067001', disorder: 'Polycystic ovary (disorder)' },
  { system: 'snomed-ct', code: '396275006 ', disorder: 'Osteoarthritis (disorder)' },
  { system: 'snomed-ct', code: '9014002 ', disorder: 'Psoriasis (disorder)' },
  { system: 'snomed-ct', code: '195967001', disorder: 'Asthma (disorder)' },  
  { system: 'snomed-ct', code: '363406005', disorder: 'Malignant neoplasm of colon (disorder)' },
  { system: 'snomed-ct', code: '44054006', disorder: 'Diabetes mellitus type 2 (disorder)' },
  { system: 'snomed-ct', code: '40468003', disorder: 'Viral hepatitis, type A (disorder)' },
  { system: 'snomed-ct', code: '118601006', disorder: "Non-Hodgkin's lymphoma (disorder)" },
  { system: 'snomed-ct', code: '118599009', disorder: "Hodgkin's disease (disorder)" },
  { system: 'snomed-ct', code: '372244006', disorder: 'Malignant melanoma (disorder)' },
  { system: 'snomed-ct', code: '42343007', disorder: 'Congestive heart failure (disorder)' },
  { system: 'snomed-ct', code: '78275009', disorder: 'Obstructive sleep apnea syndrome (disorder)' },
  { system: 'snomed-ct', code: '414915002', disorder: 'Obese (finding)' },
  { system: 'snomed-ct', code: '95570007', disorder: 'Kidney stone (disorder)' },
  { system: 'snomed-ct', code: '363449006', disorder: 'Malignant tumor of testis (disorder)' },
  { system: 'snomed-ct', code: '363443007', disorder: 'Malignant tumor of ovary (disorder)' }
];

let specialIssuanceLoincCodes = [
  { system: 'loinc', code: '4547-6', exam: 'Hemoglobin A1c/Hemoglobin.total in Blood' },
  { system: 'loinc', code: '69742-5', exam: 'CBC Auto Differential panel in Blood by Automated count' },
  { system: 'loinc', code: '83073-7', exam: 'Alpha-1-Fetoprotein [Mass/volume] in Serum or Plasma' },
  { system: 'loinc', code: '19180-9', exam: 'Choriogonadotropin.beta subunit [Units/volume] in Serum or Plasma' },
  { system: 'loinc', code: '3016-3', exam: 'Thyrotropin [Units/volume] in Serum or Plasma' },
  { system: 'loinc', code: '3024-7', exam: 'Thyroxine (T4) free [Mass/volume] in Serum or Plasma' },

  { system: 'loinc', code: '42269-1', exam: 'XR Chest and Abdomen Views' },
  { system: 'loinc', code: '44115-4', exam: 'CT Abdomen and Pelvis' },
  { system: 'loinc', code: '36813-4', exam: 'CT Abdomen and Pelvis W contrast IV' },
  { system: 'loinc', code: '36952-0', exam: 'CT Abdomen and Pelvis with WO contrast' },
  { system: 'loinc', code: '24556', exam: 'MR Abdomen' },
  { system: 'loinc', code: '24557-1', exam: 'MR Abdomen WO and W contrast IV' },
  { system: 'loinc', code: '85475-2', exam: 'US Heart Transesophageal' },
  { system: 'loinc', code: 'Ultrasound Kidney', exam: '38036-0' }
]

let specialIssuanceRxNormCodes = [
  { system: 'rxnorm', code: '435', medication: 'Albuterol' },
  { system: 'rxnorm', code: '860975', medication: 'Metformin' },
  { system: 'rxnorm', code: '1373458', medication: 'Canagliflozin' },
  { system: 'rxnorm', code: '1545653', medication: 'Empagliflozin' },
  { system: 'rxnorm', code: '1488564', medication: 'Dapagliflozin' },
  { system: 'rxnorm', code: '475968', medication: 'Liraglutide' },
  { system: 'rxnorm', code: '1991302', medication: 'Semaglutide (Oral)' },
  { system: 'rxnorm', code: '1551291', medication: 'Dulaglutide (Injectable)' },
  { system: 'rxnorm', code: '6835', medication: 'Methimazole' },
  { system: 'rxnorm', code: '8794', medication: 'Propylthiouracil' },
  { system: 'rxnorm', code: '10582', medication: 'Levothyroxine' },
  { system: 'rxnorm', code: '37418', medication: 'Sumatriptan' },
  { system: 'rxnorm', code: '8787', medication: 'Propranolol (for prevention)' },
  { system: 'rxnorm', code: '2045613', medication: 'Erenumab (CGRP inhibitor)' },
  { system: 'rxnorm', code: '30125', medication: 'Modafinil (for daytime sleepiness)' },
  { system: 'rxnorm', code: '4441', medication: 'Flecainide' },
  { system: 'rxnorm', code: '1202', medication: 'Atenolol' },
  { system: 'rxnorm', code: '6809', medication: 'Metformin (for Prediabetes)' },
  { system: 'rxnorm', code: '8640', medication: 'Prednisone (for corticosteroids)' }
];

 			 		

let doNotFlyRxNormCodes = [
  { system: 'rxnorm', code: '3498', medication: 'Diphenhydramine (Benadryl)' },
  { system: 'rxnorm', code: '2400', medication: 'Chlorpheniramine (Coricidin; ChlorTrimeton)' },
  { system: 'rxnorm', code: '596', medication: 'Alprazolam (Xanax)' },
  { system: 'rxnorm', code: '6470', medication: 'Lorazepam (Ativan)' },
  { system: 'rxnorm', code: '10355', medication: 'Temazepam (Restoril)' },
  { system: 'rxnorm', code: '10767', medication: 'Triazolam (Halcion)' },
  { system: 'rxnorm', code: '2101', medication: 'Carisoprodol (Soma)' },
  { system: 'rxnorm', code: '21949', medication: 'Cyclobenzaprine (Flexeril)' },
  { system: 'rxnorm', code: '7052', medication: 'Morphine' },
  { system: 'rxnorm', code: '2670', medication: 'Codeine' },
  { system: 'rxnorm', code: '7804', medication: 'Oxycodone (Percodan, Oxycontin)' },
  { system: 'rxnorm', code: '5489', medication: 'Hydrocodone (Lortab, Vicodin, etc.)' },
  { system: 'rxnorm', code: '10689', medication: 'Tramadol (Ultram)' },
  { system: 'rxnorm', code: '3498', medication: 'Diphenhydramine (as a sleep aid)' }
];


let doNotIssueRxNormCodes = [
  { system: 'rxnorm', code: '4917', medication: 'Nitrates (Nitroglycerin)' },
  { system: 'rxnorm', code: '6058', medication: 'Isosorbide Dinitrate (Imdur)' },
  { system: 'rxnorm', code: '35829', medication: 'Ranolazine (Ranexa)' },
  { system: 'rxnorm', code: '1223', medication: 'Atropine' },
  { system: 'rxnorm', code: '119565', medication: 'Tolterodine (Detrol)' },
  { system: 'rxnorm', code: '32675', medication: 'Oxybutynin (Ditropan)' },
  { system: 'rxnorm', code: '322167', medication: 'Solifenacin (Vesicare)' },
  { system: 'rxnorm', code: '1424', medication: 'Benztropine (Cogentin)' },
  { system: 'rxnorm', code: '139953', medication: 'Pramlintide (Symlin)' },
  { system: 'rxnorm', code: '1760', medication: 'Bromocriptine (Cycloset, Parlodel)' },
  { system: 'rxnorm', code: '746741', medication: 'Pramipexole (Mirapex)' },
  { system: 'rxnorm', code: '72302', medication: 'Ropinirole (Requip)' },
  { system: 'rxnorm', code: '616739', medication: 'Rotigotine (NeuPro)' },
  { system: 'rxnorm', code: '2599', medication: 'Clonidine' },
  { system: 'rxnorm', code: '6876', medication: 'Methyldopa' },
  { system: 'rxnorm', code: '9260', medication: 'Reserpine' },
  { system: 'rxnorm', code: '6694', medication: 'Mefloquine (Lariam)' },
  { system: 'rxnorm', code: '8640', medication: 'Prednisone' },
  { system: 'rxnorm', code: '8152', medication: 'Phentermine (Adipex)' },
  { system: 'rxnorm', code: '36437', medication: 'Sertraline' },
  { system: 'rxnorm', code: '6470', medication: 'Lorazepam' },
  { system: 'rxnorm', code: '35636', medication: 'Risperidone' },
  { system: 'rxnorm', code: '6901', medication: 'Methylphenidate' },
  { system: 'rxnorm', code: '42351', medication: 'Lithium Carbonate' },
  { system: 'rxnorm', code: '725', medication: 'Amphetamine/Dextroamphetamine' },
  { system: 'rxnorm', code: '3322', medication: 'Diazepam' },
  { system: 'rxnorm', code: '114477', medication: 'Levetiracetam' },
  { system: 'rxnorm', code: '42347', medication: 'Bupropion + Naltrexone (Contrave)' }
];




export function MedicalHistoryPage(props){
  let headerHeight = 84;
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    headerHeight = 148;
  }  

  let [editorText, setEditorText] = useState("");
  let [smartOnFhirFetchMedicalHistory, setSmartOnFhirFetchMedicalHistory] = useState("");
  let [conditionQueryUrl, setConditionQueryUrl] = useState("");
  let [procedureQueryUrl, setProcedureQueryUrl] = useState("");
  let [medicationRequestQueryUrl, setMedicationRequestQueryUrl] = useState("");
  let [medicationStatementQueryUrl, setMedicationStatementQueryUrl] = useState("");

  useEffect(function(){
    let conditionQueryUrl = "/Condition?code=";
    let procedureQueryUrl = "/Procedure?code=";
    let medicationRequestQueryUrl = "/MedicationRequest?code=";
    let medicationStatementQueryUrl = "/MedicationStatement?code=";
    

    let conditions = [];
    let procedures = [];
    let medications = [];

    specialIssuanceSnomedCodes.forEach(function(snomedCode, index){
      if(get(snomedCode, 'code')){
        if(get(snomedCode, 'disorder').includes('procedure')){
          procedures.push(snomedCode);
        } else {
          conditions.push(snomedCode);
        }
      }
    })

    specialIssuanceLoincCodes.forEach(function(loincCode, index){
      if(get(loincCode, 'code')){
        procedures.push(loincCode);
      }
    })

    specialIssuanceRxNormCodes.forEach(function(rxNormCode, index){
      if(get(rxNormCode, 'code')){
        medications.push(rxNormCode);
      }
    })

    doNotFlyRxNormCodes.forEach(function(rxNormCode, index){
      if(get(rxNormCode, 'code')){
        medications.push(rxNormCode);
      }
    })

    doNotIssueRxNormCodes.forEach(function(rxNormCode, index){
      if(get(rxNormCode, 'code')){
        medications.push(rxNormCode);
      }
    })

    procedures.forEach(function(snomedCode, index){
      if(index > 0){
        procedureQueryUrl = procedureQueryUrl + ",";
      }
      procedureQueryUrl = procedureQueryUrl + get(snomedCode, 'code');
    })

    conditions.forEach(function(snomedCode, index){
      if(index > 0){
        conditionQueryUrl = conditionQueryUrl + ",";
      }
      conditionQueryUrl = conditionQueryUrl + get(snomedCode, 'code');
    })

    medications.forEach(function(rxNormCode, index){
      if(index > 0){
        medicationRequestQueryUrl = medicationRequestQueryUrl + ",";
        medicationStatementQueryUrl = medicationStatementQueryUrl + ",";
      }
      medicationRequestQueryUrl = medicationRequestQueryUrl + get(rxNormCode, 'code');
      medicationStatementQueryUrl = medicationStatementQueryUrl + get(rxNormCode, 'code');
    })

    setConditionQueryUrl(conditionQueryUrl);
    setProcedureQueryUrl(procedureQueryUrl);
    setMedicationRequestQueryUrl(medicationRequestQueryUrl);
    setMedicationStatementQueryUrl(medicationStatementQueryUrl);

    // let queryUrl = conditionQueryUrl + "\n\n" + procedureQueryUrl;
    // setSmartOnFhirFetchMedicalHistory(queryUrl);
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

  let [snomedCodes, setSnomedCodes] = useState(specialIssuanceSnomedCodes);
  let [loincCodes, setLoincCodes] = useState(specialIssuanceLoincCodes);
  let [rxNormCodes, setRxNormCodes] = useState(concat(specialIssuanceRxNormCodes, doNotFlyRxNormCodes, doNotIssueRxNormCodes));


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
    
    let newSomedCodes = [];
    snomedCodes.forEach(function(code){
      if(get(code, 'disorder').includes('procedure')){
        if(Procedures.findOne({'code.coding.code': get(code, 'code')})){
          newSomedCodes.push(code);
        }
      } else {
        if(Conditions.findOne({'code.coding.code': get(code, 'code')})){
          newSomedCodes.push(code);
        }
      }
    });
    setSnomedCodes(newSomedCodes);

    let newLoincCodes = [];
    loincCodes.forEach(function(code){
      if(Medications.findOne({'code.coding.code': get(code, 'code')})){
        newLoincCodes.push(code);
      }
    });
    setLoincCodes(newLoincCodes);

    let newRxNormCodes = [];
    rxNormCodes.forEach(function(code){
      if(Medications.findOne({'code.coding.code': get(code, 'code')})){
        newRxNormCodes.push(code);
      }
    });
    setRxNormCodes(newRxNormCodes);
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

  let snomedTableRows = [];
  snomedCodes.map(function(code, index){
    snomedTableRows.push(
      <TableRow key={index}>
        {/* <TableCell>{ get(code, 'status') }</TableCell> */}
        <TableCell>{ get(code, 'code') }</TableCell>
        <TableCell>{ get(code, 'disorder') }</TableCell>
        <TableCell>{ codeExists(code) }</TableCell>
        {/* <TableCell><Button onClick={openLink.bind(this, assembleUrl(code))}>Query</Button></TableCell> */}
      </TableRow>
    )
  })
  
  let loincTableRows = [];
  loincCodes.map(function(code, index){
    loincTableRows.push(
      <TableRow key={index}>
        {/* <TableCell>{ get(code, 'status') }</TableCell> */}
        <TableCell>{ get(code, 'code') }</TableCell>
        <TableCell>{ get(code, 'exam') }</TableCell>
        <TableCell>{ codeExists(code) }</TableCell>
        {/* <TableCell><Button onClick={openLink.bind(this, assembleUrl(code))}>Query</Button></TableCell> */}
      </TableRow>
    )
  })

  let rxcuiTableRows = [];
  rxNormCodes.map(function(code, index){
    rxcuiTableRows.push(
      <TableRow key={index}>
        {/* <TableCell>{ get(code, 'status') }</TableCell> */}
        <TableCell>{ get(code, 'code') }</TableCell>
        <TableCell>{ get(code, 'medication') }</TableCell>
        <TableCell>{ codeExists(code) }</TableCell>
        {/* <TableCell><Button onClick={openLink.bind(this, assembleUrl(code))}>Query</Button></TableCell> */}
      </TableRow>
    )
  })

  return (
    <PageCanvas id='MedicalHistoryPage' headerHeight={headerHeight} >
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
                <CardHeader title="Certification Screening" subheader="Let Fillbot gather your Form 8500-8 data elements from the hospital EHR server." />
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    FillBot leverages large language models (LLMs) using retrieval augmented generation (RAG) to ​1) improve and accelerate the semantic harmonization of clinical data needed for the completion of standardized clinical surveys, and 2) accelerate the process for answering survey questions based on contextual knowledge extracted from structured and unstructured knowledge artifacts.​
                  </Typography>
                </CardContent>
              </Box>
            </StyledCard>
          </Grid>
          
          <Grid item md={12}>
            <StyledCard >
              <CardHeader title="Rapid Assessment - Conditions and Disorders" subheader="The following conditions, procedures, and disorders are likely to material affect your ability to pilot an aircraft." />
              <CardContent style={{height: '400px', overflow: 'scroll', marginBottom: '20px'}}>
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      {/* <TableCell>Status</TableCell> */}
                      <TableCell>SNOMED Code</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Present</TableCell>
                      {/* <TableCell>Query URL</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { snomedTableRows }
                  </TableBody>
                </Table>
              </CardContent>

              <CardHeader title="Rapid Assessment - Exams of Interest" subheader="The following exam types are expected to be in specific ranges for good health and may require further documentation." />
              <CardContent style={{height: '400px', overflow: 'scroll', marginBottom: '20px'}}>
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      {/* <TableCell>Status</TableCell> */}
                      <TableCell>LOINC Code</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Present</TableCell>
                      {/* <TableCell>Query URL</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { loincTableRows }
                  </TableBody>
                </Table>
              </CardContent>

              <CardHeader title="Rapid Assessment - Medications" subheader="The use of the following medications is disallowed while piloting." />
              <CardContent style={{height: '400px', overflow: 'scroll', marginBottom: '20px'}}>
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      {/* <TableCell>Status</TableCell> */}
                      <TableCell>RXCUI Code</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Present</TableCell>
                      {/* <TableCell>Query URL</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { rxcuiTableRows }
                  </TableBody>
                </Table>
              </CardContent>

              <CardActions>
                <Button variant="contained" color="primary" onClick={scanCurrentPatient}>Scan Current Patient</Button>                
                <Button disabled variant="contained" color="primary">Add/Edit</Button>
              </CardActions>
            </StyledCard>
            {/* <DynamicSpacer />
            <Button disabled fullWidth variant="contained" color="primary" >Fetch data from hospital EHR</Button>             */}
          </Grid>
          <Grid item md={12}>          
            <StyledCard>  
              <CardHeader title="Recertification Scan" subheader={"Use the following URL to query the hospital EHR server. \n" + get(Meteor, 'settings.public.smartOnFhir[0].fhirServiceUrl', '')} />
              <CardContent>
                <Alert severity="info">{ conditionQueryUrl }</Alert>
                <DynamicSpacer />
                <Alert severity="info">{ procedureQueryUrl }</Alert>
                <DynamicSpacer />
                <Alert severity="info">{ medicationRequestQueryUrl }</Alert>
                <DynamicSpacer />
                <Alert severity="info">{ medicationStatementQueryUrl }</Alert>
                {/* <AceEditor
                  mode="text"
                  theme="github"
                  wrapEnabled={true}
                  // onChange={onUpdateLlmFriendlyNdjsonString}
                  name="synthesisEditor"
                  editorProps={{ $blockScrolling: true }}
                  value={smartOnFhirFetchMedicalHistory}
                  style={{width: '100%', position: 'relative', height: '100px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px'}}        
                />  */}
              </CardContent>   
              <CardActions>
                <Button disabled variant="contained" color="primary">Fetch Data From EHR</Button>
              </CardActions>         
            </StyledCard>
          </Grid>
        </Grid>
      </Container>
    </PageCanvas>
  );
}


export default MedicalHistoryPage;