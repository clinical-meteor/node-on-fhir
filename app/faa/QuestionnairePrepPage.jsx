import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Tabs, Tab, Box, CustomTabPanel, Container, Card, CardContent, Button, Grid, CardHeader, CardActionArea, TextField, Select, MenuItem } from '@mui/material';

import "ace-builds";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

import moment from 'moment';

import { OpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createOpenAIFnRunnable } from "langchain/chains/openai_functions";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { pull } from "langchain/hub";;

import basicQuestionnaire from '../data/Questionnaire-basic.json';
import form8500 from '../data/Questionnaire-FAA-8500-8.R4.json';
import form8500Response from '../data/QuestionnaireResponse-Form8500-8';
import minimumDataSetBrief from '../data/Questionnaire-MDS3-0_NC_Brief';
import minimumDataSet from '../data/Questionnaire-minimum-data-set';
import loinc930255 from '../data/Questionnaire-PRAPARE';

import FasiQuestionnaire from '../data/Questionnaire-FASI-FA-1.1';
import HisHaQuestionnaire from '../data/Questionnaire-HIS-HA-2.00.0';
import HisHdQuestionnaire from '../data/Questionnaire-HIS-HD-2.00.0';
import IrfPaiIaQuestionnaire from '../data/Questionnaire-IRF-PAI-IA-3.0';
import LcdsLaQuestionnaire from '../data/Questionnaire-LCDS-LA-4.00';
import OasisDahQuestionnaire from '../data/Questionnaire-OASIS-DAH-D1-012020';

import Phq9Questionnaire from '../data/Questionnaire-PHQ9';


import { useTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { Random } from 'meteor/random';
import { HTTP } from 'meteor/http';

Session.setDefault('textNormalForm', '');

console.debug("basicQuestionnaire", basicQuestionnaire)
console.debug("form8500", form8500)
console.debug("minimumDataSetBrief", minimumDataSetBrief)
console.debug("minimumDataSet", minimumDataSet)


import { concat, capitalize, difference, find, first, get, last, lowerCase, has, slice, set, split, pullAt, unset } from 'lodash';
import { DynamicSpacer } from 'fhir-starter';
import { use } from 'chai';





export function QuestionnairePrepPage(props){




  let [thesisText, setThesisText] = useState("");
  let [parsedThesisText, setParsedThesisText] = useState("");

  let [antiThesisText, setAntiThesisText] = useState("");
  let [parsedAntiThesisText, setParsedAntiThesisText] = useState("");

  let [synthesisText, setSynthesisText] = useState("");
  let [lastUpdated, setLastUpdated] = useState(new Date());
  let [editorMode, setEditorMode] = useState("text");
  
  let [listOfNamesA, setListOfNamesA] = useState([]);
  let [listOfNamesB, setListOfNamesB] = useState([]);

  let [openAiApiKey, setOpenAiApiKey] = useState("");
  let [showApiError, setShowApiError] = useState(false);
  let [embeddings, setEmbeddings] = useState(null);

  let [docs, setDocs] = useState([]);
  let [ndjsonString, setNdjsonString] = useState("");
  let [llfFriendlyNdjsonString, setLlfFriendlyNdjsonString] = useState("");
  let [patientNarrative, setPatientNarrative] = useState("");
  let [textNormalForm, setTextNormalForm] = useState("");
  let [questionResponse, setQuestionResponse] = useState("");
  let [questionnaire, setQuestionnaire] = useState("");
  let [questionnaireResponse, setQuestionnaireResponse] = useState('');
  let [serializedQuestionnaire, setSerializedQuestionnaire] = useState("");
  let [serializedResponse, setSerializedResponse] = useState("");
  let [serializedAnswers, setSerializedAnswers] = useState("");
  
  let [answers, setAnswers] = useState("");
  let [answerArray, setAnswerArray] = useState([]);
  let [stringifiedQuestionnaire, setStringifiedQuestionnaire] = useState("");
  let [listOfCompletedQuestions, setListOfCompletedQuestions] = useState("");
  let [questionMeanings, setQuestionMeanings] = useState("");
  
  let [questionItemArray, setQuestionItemAraray] = useState([]);
  let [selecedQuestionnaire, setSelectedQuestionnaire] = useState("5770951");
  let [selectedPipeline, setSelectedPipeline] = useState(0);
  let [relayUrl, setRelayUrl] = useState(get(Meteor, 'settings.public.interfaces.fhirServer.channel.endpoint', ""));

  let [value, setValue] = React.useState(0);
  let [globalPrompt, setGlobalPrompt] = useState("You are a helpful assistant. Your task is to read a clinical summary, and then answer a question about it.  Instructions for answering clinical questions:  Be brief and concise when possible.  Full sentance answers are not necessary.  You do not need to mention the patient in the answer; presume the reader knows you are talking about the patient.  If there is any mention of death or a death certificate, that may override answers to other questions, so include that information when appropriate.");
  
  let [orderOfQuestions, setOrderOfQuestions] = useState([]);

  //----------------------------------------------------------------
  // Prompt History
  // Interpret all second person pronouns (you) as referring to the patient described in the clinical summary. 
  //

  let llmFriendlyNdjsonArray = []
  let llmFriendlyNdjsonString = "";

  let [ questionText, setQuestionText ] = useState("");


  let selectedPatient = useTracker(function(){
    return Session.get('selectedPatient');
  }, [])

  useTracker(function(){
    setSelectedQuestionnaire(Session.get('selectedQuestionnaire'))
  }, [])

  useTracker(function(){
    setTextNormalForm(Session.get('textNormalForm'))
  }, [])
  useEffect(function(){
    Meteor.call('fetchOpenApiKey', function(error, result){
      if(result){
        setOpenAiApiKey(result)
      }
    })
    if(typeof Session.get('exportBuffer') === "object"){
      setNdjsonString( JSON.stringify(Session.get('exportBuffer'), null, 2));
    } else {
      setNdjsonString( Session.get('exportBuffer'));
    }


    let defaultQuestionnaireResponseId = get(Meteor, 'settings.public.modules.fillbot.defaultQuestionnaireResponseId', '');
    if(defaultQuestionnaireResponseId){
      let defaultQuestionnaireResponse = QuestionnaireResponses.findOne(defaultQuestionnaireResponseId);  
      if(defaultQuestionnaireResponse){
        setQuestionnaireResponse(JSON.stringify(defaultQuestionnaireResponse, null, 2));
      }
    }
  }, [])

  //------------------------------------------------------------------------------------------------------

  let chain; 
  let narrativeSummaryChain;
  let askQuestionChain;
  let askMultipleChoiceQuestionChain;
  let completeQuestionSentenceChain;


  if(openAiApiKey){
    
    const chatModel = new ChatOpenAI({
      modelName: "gpt-4",
      toolChoice: "auto",
      temperature: 0.9,
      openAIApiKey: openAiApiKey, // In Node.js defaults to process.env.OPENAI_API_KEY
      maxTokens: 1000
    });
  
    let textNormalFormPrompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant. Given the following patient record in JSON format, please summarize in clinical text normal form.  Provide a narrative summary of the patient's health, no line breaks or lists.  Use neutral omniciant narrator tense; do not use third person."],
      ["user", "{jsonInput}"],
    ]);

    let narrativeSummaryPrompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant. Given the following patient clinical statements, please summarize as a coherent narrative summary.  Remove duplications and extraneous information and codings; keep it human readable; no lists."],
      ["user", "{jsonInput}"],
    ]);

    let askQuestionPrompt = ChatPromptTemplate.fromMessages([
      ["system", globalPrompt],
      ["user", "{jsonInput}"],
    ]);

    let completeQuestionSentencePrompt = ChatPromptTemplate.fromMessages([
      ["system", "Please convert the following string fragment into a complete sentence.  Use third person.  Assume the form is for a patient, and the label is referring to the patient.  If the type of question is 'choice', please include the answer choices in the response."],
      // ["system", "You are a helpful assistant who ensures that questions are written as complete sentences.  When text is sent to you, if it is a complete sentence, echo it back verbatim.  If a sentence fragment or label is provided, please convert it into a complete sentence and then return it. Use third person.  When unsure about the voice or tense or subject, assume that you are a clinician filling out the form on behalf of the patient."],
      ["user", "{jsonInput}"],
    ]);

    let askMultipleChoiceQuestionPrompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant. Given the following patient record in JSON format, please answer the following multiple choice question.  Please respond with the text string of the answer choice that best answers the question.  If the medical history doesn't contain the necessary information, feel free to choose 'unknown' or 'choose not to answer' or 'not applicable', as needed."],
      ["user", "{jsonInput}"],
    ]);


    const outputParser = new StringOutputParser();
  
    chain = textNormalFormPrompt.pipe(chatModel).pipe(outputParser);

    narrativeSummaryChain = narrativeSummaryPrompt.pipe(chatModel).pipe(outputParser);

    askQuestionChain = askQuestionPrompt.pipe(chatModel).pipe(outputParser);
    
    askMultipleChoiceQuestionChain = askMultipleChoiceQuestionPrompt.pipe(chatModel).pipe(outputParser);

    completeQuestionSentenceChain = completeQuestionSentencePrompt.pipe(chatModel).pipe(outputParser);
  }


  //------------------------------------------------------------------------------------------------------

  let handleChange = (event, newValue) => {
    setValue(newValue);
  };



  function handleParseContent(){
    console.log('handleButtonClick')

    let differentialArray = difference(listOfNamesA, listOfNamesB);

    setSynthesisText(differentialArray.join('\n'));
  }

  async function parseLastRow(splitData){
    let lastRecord = pullAt(splitData, 0);
    console.log('lastRecord', lastRecord[0])
    console.log('typeof lastRecord', typeof lastRecord[0])
    console.log('splitData new length     ', splitData.length);
    setDocs(splitData);

    setTimeout(async function(){
      if(typeof lastRecord[0] == "string"){
        let parsedLastRecord = JSON.parse(lastRecord[0]);

        let textNormalForm = await chain.invoke({
          jsonInput: lastRecord[0]
        });
        console.log(textNormalForm);
    
        set(parsedLastRecord, 'text.div', textNormalForm)
    
        llmFriendlyNdjsonArray.push(JSON.stringify(parsedLastRecord));
        setLlfFriendlyNdjsonString(llmFriendlyNdjsonArray.join('\n'));
    
        parseLastRow(splitData);          
      }
    }, 1000);
  }

  async function initLangchainPipeline(){
    console.log('initLangchainPipeline', ndjsonString);

    if(openAiApiKey === ""){
      setShowApiError(true);
      return;
    }


    let splitData = [];

    if(typeof ndjsonString === "string"){
      try {
        let parsedJson = JSON.parse(ndjsonString);
        if(get(parsedJson, 'resourceType') === "Bundle"){
          get(parsedJson, 'entry').map(function(entry){
            splitData.push(JSON.stringify(entry.resource) + "\n");
          });
        } else {
          splitData = ndjsonString
        }
      } catch (error) {
        console.log('error', error)
      }
    } else {
      parsedJson = ndjsonString
    }
    
    console.log('splitData', splitData);

    if(Array.isArray(splitData)){
      console.log('splitData original length', splitData.length)
      setDocs(splitData);

      parseLastRow(splitData);
    }
  }
  async function initPythonPipeline(){
    console.log('Initiating Python pipeline', ndjsonString);
    console.log("Relay URL: " + JSON.stringify(relayUrl))
    
    Meteor.call('proxyToString', relayUrl, ndjsonString, function(error, result){
      if(error){
        console.error('error', error)
      }
      if(result){
        console.log('result', result)

        if(get(result, 'data.text')){
          Session.set('textNormalForm', result.data.text);
        } else if(get(result, 'data.text.div')){
          Session.set('textNormalForm', result.data.text.div);
        }
      }
    })

    // let httpHeaders = { headers: {
    //   'Content-Type': 'application/fhir+json',
    //   'Access-Control-Allow-Origin': '*'          
    // }}

    // HTTP.post(relayUrl, {
    //   headers: httpHeaders,
    //   data: JSON.parse(ndjsonString)
    // }, function(error, result){
    //   if(error){console.error(relayUrl + ' error', error)}
    //   if(result){
    //     console.log(relayUrl + ' result', result)
        
    //     // need to refactor the following into a dynamic method
    //     if(result.statusCode === 200){
    //       if(get(result, 'data.text')){
    //         Session.set('textNormalForm', result.data.text);
    //       } else if(get(result, 'data.text.div')){
    //         Session.set('textNormalForm', result.data.text.div);
    //       }
    //     }
    //   }      
    // })
    
  }

  async function handleParseNdjsonFile(){
    console.log('handleParseNdjsonFile', ndjsonString);

    switch (selectedPipeline) {
      case 0:
        initPythonPipeline();
        break;
      case 10:
        initLangchainPipeline();
        break;      
      default:
        break;
    }
    
  }
  async function handleCreateTextNormalForm(){
    
    if(typeof thesisText === "string"){

      

      if(JSON.parse(thesisText)){
        console.log('thesisText', thesisText)
        let currentPatient = JSON.parse(thesisText);
        set(currentPatient, 'text.div', "")
    
        console.log('currentPatient', currentPatient)
    
        if(openAiApiKey === ""){
          setShowApiError(true);
          return;
        }

        
      
        let textNormalForm = await chain.invoke({
          jsonInput: JSON.stringify(currentPatient),
        });
        console.log(textNormalForm);
        setSynthesisText(textNormalForm);
    
        set(currentPatient, 'text.div', textNormalForm)
    
        setAntiThesisText(JSON.stringify(currentPatient, null, 2));

      } else if(thesisText.split('\n').length > 1){
        alert('Please only paste one FHIR resource at a time.  Did you mean to use the NDJSON file tab?')
        return;
      }      
    } else {
      console.log('thesisText is not a string')
    }
  }
  
  function handleGatherClinicalStatements(){
    console.log('handleGatherClinicalStatements', llfFriendlyNdjsonString);
    let llfFriendlyNdjsonArray = split(llfFriendlyNdjsonString, '\n');
    let clinicalStatements = "";

    split(llfFriendlyNdjsonString, '\n').forEach(function(doc){
      // console.log('doc', doc)
      if(doc){
        let parsedDoc = JSON.parse(doc);
        console.log('narrative', get(parsedDoc, 'text.div'))
  
        clinicalStatements = clinicalStatements + get(parsedDoc, 'text.div') + '\n\n';
        setTextNormalForm(clinicalStatements)  
      }
    });
  }

  function handeGenerateNarativeSummary(){
    console.log('handeGenerateNarativeSummary', textNormalForm);

    narrativeSummaryChain.invoke({
      jsonInput: textNormalForm,
    }).then((output) => {
      console.log(output);
      setPatientNarrative(output);
    });
  }

  function handleOpenaiApiKeyChange(event){
    setOpenAiApiKey(event.target.value)

    const newEmbeddings = new OpenAIEmbeddings({
      openAIApiKey: event.target.value, // In Node.js defaults to process.env.OPENAI_API_KEY
      batchSize: 512, // Default value if omitted is 512. Max is 2048
    });

    setEmbeddings(newEmbeddings);
  }

  function onAntiThesisChange(newValue){
    setAntiThesisText(newValue)
  }
  function onThesisChange(newValue){
    setThesisText(newValue)
  }
  function handleUpdateNdjsonString(newValue){
    setNdjsonString(newValue)
  }
  function onUpdateLlmFriendlyNdjsonString(newValue){
    setLlfFriendlyNdjsonString(newValue)
  }
  function onQuestionTextChange(value, event){
    console.log('onQuestionTextChange', value, event)
    setQuestionText(value);
  }
  function onChangeGlobalPrompt(value){
    setGlobalPrompt(value);
  }
  function onQuestionnaireChange(value){
    setQuestionnaire(value)
  }
  function handleChangePipeline(event){
    setSelectedPipeline(event.target.value);    
  }

  function handleChangeQuestionnaire(event){
    setSelectedQuestionnaire(event.target.value);

    switch (event.target.value) {
      case "f201":
        setQuestionnaire(JSON.stringify(basicQuestionnaire, null, 2));
        break;
      case "20":
        setQuestionnaire(JSON.stringify(minimumDataSetBrief, null, 2));        
        break;
      case "30":
        setQuestionnaire(JSON.stringify(minimumDataSet, null, 2));        
        break;
      case "5770951":
        setQuestionnaire(JSON.stringify(form8500, null, 2));
        break;    
      case "loinc930255":
        setQuestionnaire(JSON.stringify(loinc930255, null, 2));
        break;  
        
      case "FASI-FA-1.1":
        setQuestionnaire(JSON.stringify(FasiQuestionnaire, null, 2));
        break;  
      case "HIS-HA-2.00.0":
        setQuestionnaire(JSON.stringify(HisHaQuestionnaire, null, 2));
        break;  
      case "HIS-HD-2.00.0":
        setQuestionnaire(JSON.stringify(HisHdQuestionnaire, null, 2));
        break;  
      case "IRF-PAI-IA-3.0":
        setQuestionnaire(JSON.stringify(IrfPaiIaQuestionnaire, null, 2));
        break;  
      case "LCDS-LA-4.00":
        setQuestionnaire(JSON.stringify(LcdsLaQuestionnaire, null, 2));
        break;  
      case "OASIS-DAH-D1-012020":
        setQuestionnaire(JSON.stringify(OasisDahQuestionnaire, null, 2));
        break;  
      case "PHQ9":
        setQuestionnaire(JSON.stringify(Phq9Questionnaire, null, 2));
        break;    
        
      default:
        setQuestionnaire(JSON.stringify(minimumDataSetBrief, null, 2));        
        break;
    }
  };
  function askQuestion(){
    console.log('Question: ' + questionText);

    let languageModelInput = questionText + "\n\n" + textNormalForm;
    
    askQuestionChain.invoke({
      jsonInput: languageModelInput,
    }).then((output) => {
      console.log(output);
      setQuestionResponse(output);
    });
  }



  function explainMeanings(){
    console.log('Explaining meanings...', questionnaire)

    let parsedQuestionnaire = JSON.parse(questionnaire);
    let questionItemArray = get(parsedQuestionnaire, 'item');
    let newQuestionMeanings = "";

    if(Array.isArray(questionItemArray)){
      questionItemArray.forEach(function(item){
        newQuestionMeanings = newQuestionMeanings + get(item, 'text') + "\n";
      })
    }
  }





  function gatherCompletedQuestions(){
    let parsedQuestionnaireResponse = JSON.parse(questionnaireResponse);
    console.log('QuestionnaireResponse', parsedQuestionnaireResponse)

    let questionItemArray = get(parsedQuestionnaireResponse, 'item');
    let listOfStringifiedQuestions = "";
    let level = 0;


    if(Array.isArray(questionItemArray)){
      console.log('Questionnaire.item (' + questionItemArray.length + ")");
      questionItemArray.forEach(function(item, index){
        if(item){
          if(get(item, 'type') !== "display"){
            listOfStringifiedQuestions = listOfStringifiedQuestions + gatherSubQuestion(item, listOfStringifiedQuestions, level);
          } 
        }
      })
    }

    setListOfCompletedQuestions(listOfStringifiedQuestions);
  }

  function gatherAnswers(){
    console.log("=========================================================================================")
    console.log("GATHERING ANSWERS")
    console.log("")

    console.log('QuestionnaireResponse', questionnaireResponse)

    let parsedQuestionnaireResponse = JSON.parse(questionnaireResponse);
    console.log('QuestionnaireResponse', parsedQuestionnaireResponse)

    let questionResponseItemArray = get(parsedQuestionnaireResponse, 'item');
    let newAnswers = "";
    let level = 0;

    if(Array.isArray(questionResponseItemArray)){
      questionResponseItemArray.forEach(function(item, index){
        if(item){
          if(get(item, 'type') !== "display"){
            listOfStringifiedQuestions = listOfStringifiedQuestions + gatherSubQuestion(item, listOfStringifiedQuestions, level);
          } 
        }
      })
    }

    setAnswers(newAnswers);    
  }
  function gatherQuestions(){
    console.log("=========================================================================================")
    console.log("GATHERING QUESTIONS")
    console.log("")

    let parsedQuestionnaire = JSON.parse(questionnaire);
    console.log('Questionnaire', parsedQuestionnaire)

    let questionItemArray = get(parsedQuestionnaire, 'item');
    let listOfStringifiedQuestions = "";
    let level = 0;


    let questionCodeOrder = [];
    if(Array.isArray(questionItemArray)){
      console.log('Questionnaire.item (' + questionItemArray.length + ")");
      questionItemArray.forEach(function(item, index){

        // for different types of question
        // use the linkId when possible, otherwise fallback to code[0].code ?
        if(get(item, 'linkId')){
          questionCodeOrder.push(get(item, 'linkId'));
        } else {
          questionCodeOrder.push(get(item, 'code[0].code'));
        }
        if(item){
          if(get(item, 'type') !== "display"){
            listOfStringifiedQuestions = listOfStringifiedQuestions + gatherSubQuestion(item, listOfStringifiedQuestions, level, questionCodeOrder);
          } 
        }
      })
      // setOrderOfQuestions(questionCodeOrder);
      // console.log('Order of Questions', questionCodeOrder)
    }

    setStringifiedQuestionnaire(listOfStringifiedQuestions);

    let newQuestionnaireResponse = {
      "responseType": "QuestionnaireResponse",
      "questionnaire": get(parsedQuestionnaire, "id"),
      "title": get(parsedQuestionnaire, "title"),
      "description": get(parsedQuestionnaire, "description"),
      "status": "draft",
      "authored": new Date(),
      "item": []
    }

    console.log('newQuestionnaireResponse', newQuestionnaireResponse)
    setSerializedResponse(JSON.stringify(newQuestionnaireResponse, null, 2));
    setQuestionnaireResponse(JSON.stringify(newQuestionnaireResponse, null, 2));

  }
  function gatherSubQuestion(item, listOfStringifiedQuestions, level, questionCodeOrder){    
    let newLevel = level + 1;

    let nestingIndex = "Questionnaire"
    for (let index = 0; index < newLevel; index++) {
      nestingIndex = nestingIndex + ".item"
    }
    console.log(nestingIndex, item);
    // console.log(nestingIndex + ' Gathering subquestions...', item)
    
    if(questionCodeOrder){
      if(get(item, 'linkId')){
        questionCodeOrder.push(get(item, 'linkId'));
      } else {
        questionCodeOrder.push(get(item, 'code[0].code'));
      }
    }

    let outputString = "";
    let itemsString = "";
    
    if(get(item, 'item')){
      if(Array.isArray(get(item, 'item'))){
        
        get(item, 'item').forEach(function(subItem){
          if(get(subItem, 'type') !== "display"){
            itemsString = itemsString + gatherSubQuestion(subItem, listOfStringifiedQuestions, newLevel)
          } 
        })
      } 
    } 

    if(get(item, 'text')){
      if(get(item, 'type') !== "display"){
        outputString = get(item, 'text') + "\n";
      } 
    }

    outputString = outputString + itemsString
    
    console.log(outputString)

    return outputString;
  }
  function sortSerializedResponse(){
    console.log('sortSerializedResponse', serializedResponse);

    let parsedQuestionnaireResponse = JSON.parse(questionnaireResponse);
    console.log('QuestionnaireResponse', parsedQuestionnaireResponse)

    let serializedResponseArray = serializedResponse.split('\n');
  
    let serializedItems = [];
    
    serializedResponseArray.map(function(item){
      if(item){
        if(typeof item === "string"){
          serializedItems.push(JSON.parse(item));
        } else if (typeof item === "object"){
          serializedItems.push(item);
        }
      }
    });
    console.log('serializedItems', serializedItems)
    console.log('orderOfQuestions', orderOfQuestions)

    // the array of null values gives us a capped array that we can index
    let sortedItems = [];
    for (let index = 0; index < orderOfQuestions.length; index++) {
      sortedItems.push(null);
    }

    // now we are going to go through the serializedItems, and use the orderOfQuestions
    // to determine the index in which to insert into the null array
    serializedItems.forEach(function(item){
      let index = orderOfQuestions.indexOf(get(item, 'linkId'));
      sortedItems[index] = item;
    })
      
    console.log('Sorted Items', sortedItems)

    parsedQuestionnaireResponse.item = sortedItems;
    setQuestionnaireResponse(JSON.stringify(parsedQuestionnaireResponse, null, 2));
  }
  function saveSerializedResponse(){
    console.log('saveSerializedResponse', serializedResponse);

    let serializedResponseArray = serializedResponse.split('\n');
    let parsedResponseArray = [];
    serializedResponseArray.forEach(function(item){
      if(item){
        if(typeof item === "string"){
          parsedResponseArray.push(JSON.parse(item));
        } else if (typeof item === "object"){
          parsedResponseArray.push(item);
        }
      }
    })

    let newQuestionnaireResponse = {
      "id": Random.id(),
      "responseType": "QuestionnaireResponse",
      "questionnaire": get(questionnaire, "id"),
      "title": get(questionnaire, "title"),
      "status": "draft",
      "authored": new Date(),
      "item": parsedResponseArray
    }

    setQuestionnaireResponse(JSON.stringify(newQuestionnaireResponse));
    QuestionnaireResponses._collection.insert(newQuestionnaireResponse, {filter: false, validate: false});
    // props.history.replace('/questionnaire-responses');
  }


  function serializeQuestions(){
    console.log("=========================================================================================")
    console.log("SERIALIZING QUESTIONS")
    console.log("")

    let parsedQuestionnaire = JSON.parse(questionnaire);
    console.log('Questionnaire', parsedQuestionnaire)

    let questionItemArray = get(parsedQuestionnaire, 'item');
    let serializedQuestionnaireArray = []
    let listOfStringifiedQuestions = "";
    let level = 0;


    if(Array.isArray(questionItemArray)){
      console.log('Questionnaire.item (' + questionItemArray.length + ")");
      questionItemArray.forEach(function(item, index){
        if(item){
          if(get(item, 'type') !== "display"){
            serializedQuestionnaireArray = concat(serializedQuestionnaireArray, serializeSubQuestions(item, level));
          } 
        }
      })
    }

    // parsedQuestionnaire.item = serializedQuestionnaireArray;
    // setSerializedQuestionnaire(JSON.stringify(parsedQuestionnaire, null, 2));

    let outputText = "";
    let orderOfQuestions = [];
    console.log('serializedQuestionnaireArray', serializedQuestionnaireArray)
    serializedQuestionnaireArray.forEach(function(item){
      outputText = outputText + JSON.stringify(item) + "\n";
      orderOfQuestions.push(get(item, 'linkId'));
    })

    setSerializedQuestionnaire(outputText);
    setOrderOfQuestions(orderOfQuestions);
  }
  function serializeSubQuestions(item, level){
    console.log(">>>--------------------------------------------------------<<<")
    console.log('Item', item)

    let newLevel = level + 1;

    let nestingIndex = "Questionnaire"
    for (let index = 0; index < newLevel; index++) {
      nestingIndex = nestingIndex + ".item"
    }
    console.log(nestingIndex, item);
    
    let arrayOfSubItems = [];

    // let outputString = "";
    // let itemsString = "";
    
    if(get(item, 'item')){
      if(Array.isArray(get(item, 'item'))){
        
        get(item, 'item').forEach(function(subItem){
          if(get(subItem, 'type') !== "display"){
            arrayOfSubItems = concat(arrayOfSubItems, serializeSubQuestions(subItem));
          } 
        })
      } 
    } 
    if(get(item, 'text')){
      if(!["display", "group"].includes(get(item, 'type'))){
        // outputString = get(item, 'text') + "\n";
        arrayOfSubItems = concat(arrayOfSubItems, item);
      }
    }
    
    console.log('arrayOfSubItems', arrayOfSubItems)
    return arrayOfSubItems;
  }

  
  function makeIntoCompleteSentences(){
    console.log("=========================================================================================")
    console.log("MAKING INTO COMPLETE SENTENCES")
    console.log("")

    // let parsedQuestionnaireResponse = JSON.parse(serializedQuestionnaire);
    // console.log('QuestionnaireResponse', parsedQuestionnaireResponse);
    // let questionResponseItemArray = get(parsedQuestionnaireResponse, 'item');

    let questionResponseItemArray = serializedQuestionnaire.split('\n');

    let parsedResponseItemArray = [];
    questionResponseItemArray.forEach(function(item, index){
      if(item){
        if(typeof item === "string"){
          parsedResponseItemArray.push(JSON.parse(item));
        } else if (typeof item === "object"){
          parsedResponseItemArray.push(item);
        }  
      }
    })
    

    let listOfCompleteSentenceQuestions = "";
    let completedQuestionArray = [];
    let completedQuestionItemArray = [];
    let level = 0;


    if(Array.isArray(parsedResponseItemArray)){
      console.log('QuestionnaireResponse.item (' + parsedResponseItemArray.length + ")");
      let pathIndex = "item";
      parsedResponseItemArray.forEach(async function(item, index){
        console.log('item', item)
        if(item){
          if(get(item, 'type') !== "display"){        
    
            outputString = await completeQuestionSentenceChain.invoke({
              jsonInput: get(item, 'text') ,
            }).then((answerText) => {
              console.log(">>---------------------------------------------<<")
              console.log(answerText);     
              
              completedQuestionArray.push(answerText)

              let newItem = item;
              set(newItem, 'text', answerText);
              completedQuestionItemArray.push(newItem);

              let serializedResponseString = "";
              completedQuestionItemArray.forEach(function(question){
                serializedResponseString = serializedResponseString + JSON.stringify(question) + "\n";
              })
              setSerializedResponse(serializedResponseString);
    
              console.log('completedQuestionArray', completedQuestionArray);
              console.log('completedQuestionArray.tostring', JSON.stringify(completedQuestionArray, null, 2));


              let displayString = "";
              completedQuestionArray.forEach(function(question){
                displayString = displayString + question + "\n";
              })

              setListOfCompletedQuestions(displayString);    
                      
              return answerText;
            }); 
          } 
        }
      })
    }    
  }


  async function makeSubItemsIntoCompleteSentences(item, listOfCompleteSentenceQuestions, level, pathIndex){
    let newLevel = level + 1;
    
    // let pathIndex = pathIndex + ".item";

    let nestingIndex = "QuestionnaireResponse"
    for (let index = 0; index < newLevel; index++) {
      nestingIndex = nestingIndex + ".item"
    }
    console.log(nestingIndex, item);

    let outputString = "";
    let itemsString = "";

    let completedQuestionArray = [];
    let completedQuestionsList = "";

    



    outputString = outputString + itemsString
    
    console.log('outputString', outputString)

    return outputString;


  }


  function answerQuestions(){
    console.log('Answering questions...', serializedResponse)



    let parsedQuestionnaireResponse = serializedResponse.split('\n');
    console.log('typeof parsedQuestionnaireResponse', parsedQuestionnaireResponse)

    console.log("------------------------------------------------------------------")
    console.log('MEDICAL HISTORY');

    console.log(textNormalForm);


    if(Array.isArray(parsedQuestionnaireResponse)){

      parsedQuestionnaireResponse.forEach(function(item, index){
        if(item){
          let nextQuestion = JSON.parse(item);
          console.log('Next Question', nextQuestion)
          if(nextQuestion){

            if(get(nextQuestion, 'type') === "choice"){


                        
              setTimeout(async function(){
          
                if(nextQuestion){      
                    
                  console.log("------------------------------------------------------------------")
          
                  
                  let nextQuestionText = get(nextQuestion, 'text', '');
                  let nextQuestionAnswerOptions = get(nextQuestion, 'answerOptions', []);

                  // need to add multiple choice answer possibilities
                  nextQuestionAnswerOptions.forEach(function(answerOption){
                    nextQuestionText + "\n" + JSON.stringify(answerOption);
                  })
    
                  let questionToAskTheOracle = "";          
                  if (typeof nextQuestionText === "string"){
                    questionToAskTheOracle = nextQuestionText + "\n\n" + textNormalForm;
                  }
  
                  let questionAnswer = await askMultipleChoiceQuestionChain.invoke({
                    jsonInput: questionToAskTheOracle
                  })
  
                  console.log("------------------------------------------------------------------")
                  console.log('QUESTION');
                  console.log(questionToAskTheOracle);
                  console.log("------------------------------------------------------------------")
                  console.log('ANSWER');
                  console.log(questionAnswer);
                  console.log("------------------------------------------------------------------")
          
  
                  if(!newAnswersString){
                    newAnswersString = "";
                  }
  
                  newAnswersString = newAnswersString + nextQuestionText + "\n" + questionAnswer + "\n\n";
                  setAnswers(newAnswersString)
  
   
                  let newItem = nextQuestion;
                  let answerItemArray = questionItemArray;
  
                  if(!get(newItem, 'answer')){
                    set(newItem, 'answer', []);
                  }
                  newItem.answer.push({
                    valueString: questionAnswer
                  })
  
                  answerItemArray[index] = newItem;
  
                  let serializedAnswerString = "";
                  answerItemArray.forEach(function(question){
                    if(question){
                      serializedAnswerString = serializedAnswerString + JSON.stringify(question) + "\n";
                    }
                  })
                  setSerializedAnswers(serializedAnswerString);
  
                  let newQuestionnaireResponse;
  
                  if(questionResponse){
                    newQuestionnaireResponse = JSON.parse(questionResponse);
                    newQuestionnaireResponse.item = answerItemArray
                    console.log('newQuestionnaireResponse', newQuestionnaireResponse)
                    setQuestionnaireResponse(JSON.stringify(newQuestionnaireResponse, null, 2));        
                  } else {
                    console.log('No questionnaireResponse')
                  }
                }
              }, 5000);

            } else if(get(nextQuestion, 'type') !== "display"){
                        
                        
              let nextQuestionText = get(nextQuestion, 'text', '');
              console.log(nextQuestionText)
          
              setTimeout(async function(){
          
                if(nextQuestion){      
                    
                  console.log("------------------------------------------------------------------")
          
                  
                  let questionToAskTheOracle = "";        
  
                  if (typeof nextQuestionText === "string"){
                    questionToAskTheOracle = nextQuestionText + "\n\n" + textNormalForm;
                  }
  


                  let questionAnswer = "";
                  
                  if(get(nextQuestion, 'type') === "choice"){
                    questionAnswer = await askMultipleChoiceQuestionChain.invoke({
                      jsonInput: questionToAskTheOracle,
                    })
                  } else {
                    questionAnswer = await askQuestionChain.invoke({
                      jsonInput: questionToAskTheOracle,
                    })
                  }
  
                  console.log("------------------------------------------------------------------")
                  console.log('QUESTION');
                  console.log(nextQuestionText);
                  console.log("------------------------------------------------------------------")
                  console.log('ANSWER');
                  console.log(questionAnswer);
                  console.log("------------------------------------------------------------------")
          
  
                  if(!newAnswersString){
                    newAnswersString = "";
                  }
  
                  newAnswersString = newAnswersString + nextQuestionText + "\n" + questionAnswer + "\n\n";
                  setAnswers(newAnswersString)
  
   
                  let newItem = nextQuestion;
                  let answerItemArray = questionItemArray;
  
                  if(!get(newItem, 'answer')){
                    set(newItem, 'answer', []);
                  }
                  newItem.answer.push({
                    valueString: questionAnswer
                  })
  
                  answerItemArray[index] = newItem;
  
                  let serializedAnswerString = "";
                  answerItemArray.forEach(function(question){
                    if(question){
                      serializedAnswerString = serializedAnswerString + JSON.stringify(question) + "\n";
                    }
                  })
                  setSerializedAnswers(serializedAnswerString);
  
                  let newQuestionnaireResponse;
  
                  if(questionResponse){
                    newQuestionnaireResponse = JSON.parse(questionResponse);
                    newQuestionnaireResponse.item = answerItemArray
                    console.log('newQuestionnaireResponse', newQuestionnaireResponse)
                    setQuestionnaireResponse(JSON.stringify(newQuestionnaireResponse, null, 2));        
                  } else {
                    console.log('No questionnaireResponse')
                  }
                }
              }, 5000);
            }
          }  
        }
      })

    }
  }
  function prepQuestions(){
    console.log('Preparing questions...', serializedResponse)



  }

  function createQuestionnaireResponse(){
    console.log('createQuestionnaireResponse', questionnaire)

    // get the selected questionnaire
    let parsedQuestionnaire = JSON.parse(questionnaire);
    console.log('Questionnaire', parsedQuestionnaire)

    // create a new questionnaire response
    let newQuestionnaireResponse = {
      "id": Random.id(),
      "responseType": "QuestionnaireResponse",
      "questionnaire": get(parsedQuestionnaire, "id"),
      "title": get(parsedQuestionnaire, "title"),
      "status": "completed",
      "authored": new Date(),
      "item": []
    }

    let answerArray = serializedAnswers.split('\n');
    console.log('answerArray', answerArray);

    let parsedAnswerArray = [];
    answerArray.forEach(function(answer){
      if(answer){
        if(typeof answer === "string"){
          parsedAnswerArray.push(JSON.parse(answer));
        } else if (typeof answer === "object"){
          parsedAnswerArray.push(answer);
        }  
      }
    })
    console.log('parsedAnswerArray', parsedAnswerArray);

    newQuestionnaireResponse.item = parsedAnswerArray;
    setQuestionnaireResponse(JSON.stringify(newQuestionnaireResponse, null, 2));  
  }

  function saveQuestionnaireResponse(){
    console.log('saveQuestionnaireResponse', questionnaireResponse);

    QuestionnaireResponses._collection.insert(JSON.parse(questionnaireResponse), {filter: false, validate: false});
    props.history.replace('/questionnaire-responses');
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }
  function handleChangeDestination(event, value){
    console.log('handleChangeDestination', event.target.value)
    setRelayUrl(event.target.value);
    Session.set('relayUrl', event.target.value);
  }


  function openLink(url){
    console.log("openLink", url);
    props.history.replace(url)
  }
  function selectMedicalHistory(){
    console.log('selectMedicalHistory')

    let medicalHistory = {
      resourceType: "Bundle",
      type: "collection",
      entry: []
    }

    let conditions = Conditions.find().fetch();
    let procedures = Procedures.find().fetch();
    let medications = Medications.find().fetch();
    let patients = Patients.find().fetch();

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


  


  let relayOptions = [];
  let preprocessElements;
  let cardWidth = 4;
  let interfacesObject = get(Meteor, 'settings.public.interfaces');
  if(interfacesObject){
    Object.keys(interfacesObject).forEach(function(key, index){
      let interfaceKey = interfacesObject[key];
      if(has(interfaceKey, 'channel.endpoint') && (get(interfaceKey, 'status') === "active")){
        relayOptions.push(<MenuItem value={get(interfaceKey, 'channel.endpoint')} id={"relay-menu-item-" + index} key={"relay-menu-item-" + index} >{get(interfaceKey, 'name')}</MenuItem>)
      }
    });  
  } else {
    console.log('WARNING:  No interfaces defined!')
  }
  let relaySelection;
  if(selectedPipeline == 0){    
    relaySelection = <Select value={ relayUrl} onChange={ handleChangeDestination } fullWidth style={{marginBottom: '20px'}}>
      { relayOptions }
    </Select>
  } else {
    cardWidth = 3;
    
    preprocessElements = <Grid item md={cardWidth}>
      <Card>
        <CardHeader title="Preprocessed NDJSON"></CardHeader>
        <CardContent>
          <AceEditor
            mode="text"
            theme="github"
            wrapEnabled={false}
            onChange={onUpdateLlmFriendlyNdjsonString}
            name="synthesisEditor"
            editorProps={{ $blockScrolling: true }}
            value={llfFriendlyNdjsonString}
            style={{width: '100%', position: 'relative', height: '600px', minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px', lineHeight: '16px', marginTop: '20px'}}        
          /> 
          <br />
          <br />
          <Button fullWidth variant="contained" color="primary" onClick={handleGatherClinicalStatements} disabled={openAiApiKey ? false : true}>
            Translate to Text
          </Button>
        
        </CardContent>
      </Card>      
      <br/>
    </Grid>
  }

  let patientMedicalHistory;
  if(ndjsonString){
    patientMedicalHistory = <CardContent>
      <AceEditor
        mode="text"
        theme="github"
        wrapEnabled={false}
        onChange={handleUpdateNdjsonString}
        name="synthesisEditor"
        editorProps={{ $blockScrolling: true }}
        value={ndjsonString}
        style={{width: '100%', position: 'relative', height: '445px', minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px', lineHeight: '16px', marginTop: '20px'}}        
      />         
      <br />
      <br />
      <Select
        id="select-fhir-questionnaire"
        value={selectedPipeline}
        label="Age"
        onChange={handleChangePipeline}
        fullWidth
      >
        <MenuItem value={0}>Python</MenuItem>
        <MenuItem value={10}>Langchain.js</MenuItem>
      </Select>
      <br />
      <br />
      { relaySelection }
      <Button fullWidth variant="contained" color={textNormalForm ? "inherit" : "primary"} onClick={handleParseNdjsonFile} disabled={openAiApiKey ? false : true}>
        GENERATE TEXT NORMAL FORM
      </Button>

    </CardContent>  
  } else {
    patientMedicalHistory = <CardContent>
      <Button fullWidth variant="contained" color="primary" onClick={openLink.bind(this, '/import-data')} disabled={selectedPatient ? true : false}>
        LOAD PATIENT
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
      <Button fullWidth variant="contained" color="primary" onClick={selectMedicalHistory} disabled={selectedPatient ? false : true}>
        SELECT MEDICAL HISTORY TO USE
      </Button>
      {/* <DynamicSpacer />
      <Button fullWidth variant="contained" color="inherit" onClick={openLink.bind(this, '/export-data')} disabled={selectedPatient ? false : true}>
        SELECT QUESTIONNAIRE
      </Button>
      <DynamicSpacer />
      <Button fullWidth variant="contained" color={textNormalForm ? "primary" : "inherit"} onClick={openLink.bind(this, '/export-data')} disabled={selectedPatient ? false : true}>
        FILLBOT
      </Button>
      <DynamicSpacer />
      <Button fullWidth variant="contained" color="inherit" onClick={openLink.bind(this, '/export-data')} disabled={selectedPatient ? false : true}>
        REVIEW COMPLETED DOCUMENTS
      </Button>*/}
    </CardContent>
  }

  let returnContents = <Container maxWidth="xxl" style={{paddingTop: '80px', paddingBottom: '80px'}}>
    <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', marginTop: '80px' }}>
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Questionnaire Prep" {...a11yProps(0)} />
      </Tabs>
    </Box>
    <CustomTabPanel value={value} index={0}>
      <Grid container spacing={2} style={{paddingTop: '40px'}}>        
        <Grid item md={2}>
          <Card>
            <CardHeader title="FHIR Questionnaire"></CardHeader>
            <CardContent>
              <Select
                id="select-fhir-questionnaire"
                value={selecedQuestionnaire}
                label="Age"
                onChange={handleChangeQuestionnaire}
                fullWidth
              >
                <MenuItem value={"5770951"}>Form 8500-8</MenuItem>              
                <MenuItem value={"f201"}>Basic</MenuItem>
                <MenuItem value={"20"}>Minimum Data Set (Brief)</MenuItem>
                <MenuItem value={"30"}>Minimum Data Set (Full)</MenuItem>
                <MenuItem value={"loinc930255"}>PRAPARE</MenuItem>    
                
                <MenuItem value={"FASI-FA-1.1"}>Functional Assessment Standardized Items - FASI</MenuItem>
                <MenuItem value={"HIS-HA-2.00.0"}>Hospice Item Set - Hospice Admission Record</MenuItem>
                <MenuItem value={"HIS-HD-2.00.0"}>Hospice Item Set - Hospice Discharge Record</MenuItem>
                <MenuItem value={"IRF-PAI-IA-3.0"}>Inpatient Rehabilitation Facility Patient Assessment Instrument</MenuItem>
                <MenuItem value={"LCDS-LA-4.00"}>Long Term Care Hospital (LTCH) Continuity Assessment Record and Evaluation (CARE) Data Set</MenuItem>
                <MenuItem value={"OASIS-DAH-D1-012020"}>Outcome and Assessment Information Set - Death at Home</MenuItem>             
              </Select>
              <DynamicSpacer />
              <AceEditor
                mode="text"
                theme="github"
                wrapEnabled={true}
                onChange={this.onQuestionnaireChange}
                name="synthesisEditor"
                editorProps={{ $blockScrolling: true }}
                value={questionnaire}
                style={{width: '100%', position: 'relative', height: '400px', minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px', lineHeight: '16px', marginTop: '20px'}}        
              />              
              <DynamicSpacer />
              <Button fullWidth variant="contained" color="primary" onClick={serializeQuestions} disabled={openAiApiKey ? false : true}>
                Serialize Questions
              </Button>
            </CardContent>
          </Card>      
          <br/>
        </Grid>
        <Grid item md={2}>
          <Card>
            <CardHeader title="Serialized Question Array"></CardHeader>
            <CardContent>
              <AceEditor
                mode="text"
                theme="github"
                wrapEnabled={false}
                onChange={this.onQuestionnaireChange}
                name="synthesisEditor"
                editorProps={{ $blockScrolling: true }}
                value={serializedQuestionnaire}
                style={{width: '100%', position: 'relative', height: '400px', minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px', lineHeight: '16px', marginTop: '20px'}}        
              />              
              <DynamicSpacer />
              <Button fullWidth variant="contained" color="primary" onClick={gatherQuestions} disabled={openAiApiKey ? false : true}>
                Gather Questions
              </Button>
            </CardContent>
          </Card>      
          <br/>
        </Grid>
        <Grid item md={2}>
          <Card>
            <CardHeader title="Stringified Questionnaire"></CardHeader>
            <CardContent>
              <AceEditor
                mode="text"
                theme="github"
                wrapEnabled={true}
                // onChange={onAntiThesisChange}
                name="stringifiedQuestionnaire"
                editorProps={{ $blockScrolling: true }}
                value={stringifiedQuestionnaire}
                style={{width: '100%', position: 'relative', height: '600px', minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px', lineHeight: '16px', marginTop: '20px'}}        
              />              
              <DynamicSpacer />
              <Button fullWidth variant="contained" color="primary" onClick={makeIntoCompleteSentences} disabled={openAiApiKey ? false : true}>
                Make into complete sentences
              </Button>

            </CardContent>
          </Card>      
          {/* <DynamicSpacer />
          <Button fullWidth variant="contained" color="primary" onClick={gatherAnswers} disabled={openAiApiKey ? false : true}>
            Gather Answers
          </Button> */}
        </Grid>
        <Grid item md={2}>
          <Card>
            <CardHeader title="Complete Questions"></CardHeader>
            <CardContent>
              <AceEditor
                mode="text"
                theme="github"
                wrapEnabled={false}
                // onChange={onAntiThesisChange}
                name="synthesisEditor"
                editorProps={{ $blockScrolling: true }}
                value={listOfCompletedQuestions}
                style={{width: '100%', position: 'relative', height: '600px', minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px', lineHeight: '16px', marginTop: '20px'}}        
              />              
            </CardContent>
          </Card>      
        </Grid>
        <Grid item md={2}>
          <Card>
            <CardHeader title="Serialized Response"></CardHeader>
            <CardContent>
              <AceEditor
                mode="text"
                theme="github"
                wrapEnabled={true}
                name="synthesisEditor"
                editorProps={{ $blockScrolling: true }}
                value={serializedResponse}
                style={{width: '100%', position: 'relative', height: '600px', minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px', lineHeight: '16px', marginTop: '20px'}}        
              />              
              <DynamicSpacer />
              <Button fullWidth variant="contained" color="primary" onClick={sortSerializedResponse} disabled={openAiApiKey ? false : true}>
                Sort
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={2}>
          <Card>
            <CardHeader title="FHIR Questionnaire Response"></CardHeader>
            <CardContent>
              <AceEditor
                mode="text"
                theme="github"
                wrapEnabled={true}
                // onChange={onAntiThesisChange}
                name="synthesisEditor"
                editorProps={{ $blockScrolling: true }}
                value={questionnaireResponse}
                style={{width: '100%', position: 'relative', height: '600px', minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px', lineHeight: '16px', marginTop: '20px'}}        
              />         
              <DynamicSpacer />
              <Button fullWidth variant="contained" color="primary" onClick={saveSerializedResponse} disabled={openAiApiKey ? false : true}>
                Save Questionnaire Response
              </Button>
     
            </CardContent>
          </Card>
          {/* <Card>
            <CardHeader title="Question Meanings"></CardHeader>
            <CardContent>
              <AceEditor
                mode="text"
                theme="github"
                wrapEnabled={true}
                // onChange={onAntiThesisChange}
                name="synthesisEditor"
                editorProps={{ $blockScrolling: true }}
                value={questionMeanings}
                style={{width: '100%', position: 'relative', height: '600px', minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px', lineHeight: '16px', marginTop: '20px'}}        
              />              
            </CardContent>
          </Card>       */}
        </Grid>
      </Grid>
    </CustomTabPanel>
  </Container>;

  return returnContents
}

export default QuestionnairePrepPage;

