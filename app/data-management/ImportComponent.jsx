// https://www.npmjs.com/package/react-dropzone-component
// http://www.dropzonejs.com/
 
import React, { useState, useEffect, useCallback } from 'react';
import Promise from 'promise';

import { 
  Button, 
  CardContent, 
  CardHeader, 
  CardActions,
  Checkbox,
  Grid, 
  Typography,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
} from '@material-ui/core';
import PropTypes from 'prop-types';

// import DropzoneComponent from 'react-dropzone-component';

import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { browserHistory } from 'react-router';
import { get, uniq, cloneDeep } from 'lodash';
import moment from 'moment';

import { parseString } from 'xml2js';
import xml2js from 'xml2js';
import XLSX from 'xlsx';

import MedicalRecordImporter from './MedicalRecordImporter';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { StyledCard, PageCanvas } from 'fhir-starter';

import { useTracker } from 'meteor/react-meteor-data';

import { CollectionManagement } from './CollectionManagement';
import PreviewDataCard from './PreviewDataCard';
import RawDataCard from './RawDataCard';


// import AceEditor from "react-ace";

// import "ace-builds/src-noconflict/mode-json";
// import "ace-builds/src-noconflict/theme-tomorrow";

import fileDialog from 'file-dialog'

import PapaParse from 'papaparse';

import { LayoutHelpers, FhirUtilities, DynamicSpacer } from 'meteor/clinical:hl7-fhir-data-infrastructure';

var myDropzone;

function initCallback (dropzone) {
  myDropzone = dropzone;
}





  // //============================================================================
  // //Global Theming 

  // This is necessary for the Material UI component render layer
  let theme = {
    primaryColor: "rgb(108, 183, 110)",
    primaryText: "rgba(255, 255, 255, 1) !important",

    secondaryColor: "rgb(108, 183, 110)",
    secondaryText: "rgba(255, 255, 255, 1) !important",

    cardColor: "rgba(255, 255, 255, 1) !important",
    cardTextColor: "rgba(0, 0, 0, 1) !important",

    errorColor: "rgb(128,20,60) !important",
    errorText: "#ffffff !important",

    appBarColor: "#f5f5f5 !important",
    appBarTextColor: "rgba(0, 0, 0, 1) !important",

    paperColor: "#f5f5f5 !important",
    paperTextColor: "rgba(0, 0, 0, 1) !important",

    backgroundCanvas: "rgba(255, 255, 255, 1) !important",
    background: "linear-gradient(45deg, rgb(108, 183, 110) 30%, rgb(150, 202, 144) 90%)",

    nivoTheme: "greens"
  }

  // if we have a globally defined theme from a settings file
  if(get(Meteor, 'settings.public.theme.palette')){
    theme = Object.assign(theme, get(Meteor, 'settings.public.theme.palette'));
  }

  const muiTheme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        main: theme.primaryColor,
        contrastText: theme.primaryText
      },
      secondary: {
        main: theme.secondaryColor,
        contrastText: theme.errorText
      },
      appBar: {
        main: theme.appBarColor,
        contrastText: theme.appBarTextColor
      },
      cards: {
        main: theme.cardColor,
        contrastText: theme.cardTextColor
      },
      paper: {
        main: theme.paperColor,
        contrastText: theme.paperTextColor
      },
      error: {
        main: theme.errorColor,
        contrastText: theme.secondaryText
      },
      background: {
        default: theme.backgroundCanvas
      },
      contrastThreshold: 3,
      tonalOffset: 0.2
    }
  });

  const styles = theme => ({
    root: {
      flexGrow: 1,
      paddingLeft: '100px', 
      paddingRight: '100px',
      verticalAlign: 'top',
      display: 'inline-block', 
      height: '100%',
      width: '100%'
    }
  });


// //============================================================================
// // DRAG AND DROP

// algorithmCount is the index where we change from default import algorithms to dynamically imported algorithms
// i.e. it's the number of import algorithms included by default + 1
let algorithmCount = 9;

var componentConfig = {
  allowedFiletypes: ['.json', '.jpg', '.png', '.23me', '.geojson', '.fhir', '.ccd', '.bundle'],
  iconFiletypes: ['.json', '.23me', '.geojson', '.fhir', '.ccd'],
  showFiletypeIcon: false,
  postUrl: '/uploadHandler',
  //dropzoneSelector: '#dropzonePreview'
};
var djsConfig = {
  autoProcessQueue: false,
  addRemoveLinks: true,
  createImageThumbnails: true,
};

var eventHandlers;
if(Meteor.isClient){
  eventHandlers = {
    // This one receives the dropzone object as the first parameter
    // and can be used to additional work with the dropzone.js
    // object
    init: initCallback,
    // All of these receive the event as first parameter:
    drop: function(input){
      logger.warn("Drop!", input);
    },
    dragstart: null,
    dragend: null,
    dragenter: null,
    dragover: null,
    dragleave: null,
    // All of these receive the file as first parameter:
    addedfile: function (file) {
      logger.warn("Received a file; sending to server.");
      logger.data('ImportComponent.addedFile', {data: file}, {source: "ImportComponent.jsx"});
  
      // we're going to need the extention to figure out what kind of file parsing we're going to do
      var extension = file.name.split('.').pop().toLowerCase();
  
      // console.log('ImportComponent.file', file)
      // console.log('ImportComponent.file.name', file.name)
      // console.log('ImportComponent.file.name.split', file.name.split('.'))
      // console.log('ImportComponent.file.name.split.pop', file.name.split('.').pop())
      // console.log('ImportComponent.file.name.split.pop.toLowerCase', file.name.split.pop.toLowerCase())
  
      logger.debug('Extension: ' + extension);
  
      Session.set('fileExtension', extension);
  
      // we received a file; lets take a peek inside to figure out what to do with it
      var reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
  
  
      reader.onload = function(e) {
  
        if(reader.result){
          logger.trace('reader.result', reader.result);
  
          var data;
  
          if(extension == "csv"){
            logger.debug('Found an .csv file; loading...');
  
            let csvData = PapaParse.parse(reader.result);
            logger.data('ImportComponent.addedFile.csvData', {data: csvData}, {source: "ImportComponent.jsx"});
  
            logger.trace('Managed to parse csv...', csvData.data)
            Session.set('importBuffer', csvData.data);    
            
          } else if(extension == "xml"){
            logger.debug('Found an .xml file; loading...');
      
            parseString(reader.result, {
              attrkey: "attr",
              mergeAttrs: true,
              explicitRoot: true,
              explicitArray: false,
              ignoreAttrs: false,
              explicitChildren: false,
              valueProcessors: [ xml2js.processors.parseNumbers ]
            }, function (err, rawXmlData) {
              logger.trace('Managed to parse xml...')
              logger.data('ImportComponent.addedFile.xmlData', {data: rawXmlData}, {source: "ImportComponent.jsx"});
  
              let resourceRoot = {};
              let xmlData = {};
              Object.keys(rawXmlData).forEach(async function(key){
                if(FhirUtilities.isFhirResource(key)){
                  logger.trace('It appears we found a ' + key + ' resource in XML format.');
                  logger.trace('Lets try recursively parsing it.')
  
                  resourceRoot.resourceType = key;
  
                  xmlData = rawXmlData[key];
                }
              })
  
  
  
              function recursiveParse(root, treeBranch){
                // console.log('recursiveParse', root, treeBranch)
  
                if(typeof treeBranch === "object"){
                  Object.keys(treeBranch).forEach(function(keyName){
                    if(Array.isArray(treeBranch[keyName])){
                      root[keyName] = [];
                    } else if (typeof treeBranch[keyName] === "object") {                    
                      root[keyName] = {};                    
                    } else {
                      root[keyName] = "";
                    }
                  })  
  
                  Object.keys(treeBranch).forEach(function(keyName){
                    if(treeBranch[keyName].hasOwnProperty('value')){
                      if(!isNaN(Number(treeBranch[keyName].value))){
                        root[keyName] = Number(treeBranch[keyName].value);                      
                      } else {
                        root[keyName] = treeBranch[keyName].value;
                      }                    
                    } else {
                      recursiveParse(root[keyName], treeBranch[keyName])
                    }
                  });
                }
                return root;
              }
  
  
  
              let newResource = recursiveParse(resourceRoot, xmlData)
  
  
              Session.set('importBuffer', newResource);    
            });
  
          } else if(['json', 'fhir', 'ccd', 'bundle', 'txt'].includes(extension)){
  
            logger.debug('Found an .json enconded file; loading...');
            logger.data('ImportComponent.addedFile.jsonData', {data: reader.result}, {source: "ImportComponent.jsx"});
  
            if(['fhir'].includes(extension)){
              logger.trace('.json was found within a .fhir file; decrypting and decoding...');
              var decryptedData = CryptoJS.AES.decrypt(reader.result, Meteor.userId());
              // console.log('decryptedData', decryptedData);
  
              var utf8Data = decryptedData.toString(CryptoJS.enc.Utf8);
              // console.log('utf8Data', utf8Data);
  
              var decodedData = decodeURI(utf8Data);
              logger.data('ImportComponent.addedFile.decodedData', {data: decodedData}, {source: "ImportComponent.jsx"});
  
              Session.set('importBuffer', decodedData);
            } else {
              let dataContent;
              logger.trace('Parsing the .json...');
              //  console.log('Parsing the .json...', reader.result);
  
              if(typeof reader.result === 'string'){
                dataContent = JSON.parse(reader.result)
              } else {
                dataContent = reader.result;
              }
  
              logger.data('ImportComponent.addedFile.dataContent', {data: dataContent}, {source: "ImportComponent.jsx"});
  
              if(dataContent){
                if(dataContent.data){
                  Session.set('importBuffer', dataContent.data);
                } else {
                  Session.set('importBuffer', dataContent);    
                }
              }
            }
        
            
          } else if(extension == "geojson"){
            if(data.type == "FeatureCollection"){
              logger.debug('Found an .geojson file; loading...');
    
              Meteor.call("parseGeojson", data, function (error, result){
                if (error){
                  logger.error("error", error);
                }
                if (result){
                  logger.data('ImportComponent.addedFile.parseGeoJson.result', {data: result}, {source: "ImportComponent.jsx"});
                }
              });
            }
          } else if(["xls", "xlsx"].includes(extension)){
            logger.debug('Found an Excel file.  Parsing....');
            // logger.trace('reader.result', reader.result);
  
            const data = e.target.result;
            const name = file.name;
  
            // console.log('data', data);
            // console.log('name', name);
  
            logger.data('ImportComponent.addedFile.xlsData', {data: data}, {source: "ImportComponent.jsx"});
  
  
            Meteor.call(rABS ? 'uploadS' : 'uploadU', rABS ? data : new Uint8Array(data), name, function(err, wb) {
              if (err) throw err;
              /* load the first worksheet */
              const ws = wb.Sheets[wb.SheetNames[0]];
              console.log('ws', ws)
  
              let a1 = get(ws, 'A1');
              console.log('a1', a1);
  
              Session.set('importBuffer', ws);    
            });
  
  
  
          } else if(extension == "23andme"){
            if(data.type == "FeatureCollection"){
              logger.debug('Found an .23andme file; loading...');
              
              Meteor.call("parseGenome", reader.result, function (error, result){
                if (error){
                  logger.error("error", error);
                }
                if (result){
                  logger.data('ImportComponent.addedFile.parseGenome.result', {data: result}, {source: "ImportComponent.jsx"});
                }
              });
            }
          } else if(["zip"].includes(extension)){
            logger.debug('Found a .zip file; loading...');
  
  
          } else if(extension == ".2fa"){
            // do we encounter a file that needs special file reading access???
            logger.error('Abort!  Found a raw genome sequence; too big to load via the user interface.');
          } else {
            // otherwise, we assume it's some sort of text file
            reader.readAsText(file);      
          }
  
        }
      }
  
      if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
  
    },
    removedfile: function(){
      Session.set('importBuffer', null)
    },
    thumbnail: null,
    error: null,
    processing: null,
    uploadprogress: null,
    sending: null,
    success: null,
    complete: null,
    canceled: null,
    maxfilesreached: null,
    maxfilesexceeded: null,
    // All of these receive a list of files as first parameter
    // and are only called if the uploadMultiple option
    // in djsConfig is true:
    processingmultiple: null,
    sendingmultiple: null,
    successmultiple: null,
    completemultiple: null,
    canceledmultiple: null,
    // Special Events
    totaluploadprogress: null,
    reset: null,
    queuecomplete: null
  };
  
}


// //============================================================================
// // Sorting Collection 

// ImportCursor = new Mongo.Collection('ImportCursor', {connection: null});


//============================================================================
// Helper Components

function TabContainer(props) {
  return (
    <Typography component="div" >
      {props.children}
    </Typography>
  );
}
TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};


if(Meteor.isClient){
  Session.setDefault('fileExtension', 'json');
  Session.setDefault('importBuffer', '');
  Session.setDefault('syncSourceItem', 1);
  Session.setDefault('mappingAlgorithm', 1);  
}




// ===================================================================================================================
// ===================================================================================================================
// MAIN COMPONENT

export function ImportComponent(props){

  if(typeof logger === "undefined"){
    logger = window.logger;
  }

  logger.info('Rendering the ImportComponent');
  logger.verbose('symptomatic:data-management.client.ImportComponent');
  logger.data('ImportComponent.props', {data: props}, {source: "ImportComponent.jsx"});

  let [tabIndex, setTabIndex] = useState(0);
  let [upstreamSync, setUpstreamSync] = useState(get(Meteor, 'settings.public.meshNetwork.upstreamSync', ''));
  let [mappingAlgorithm, setMappingAlgorithm] = useState(0);  
  let [directoryPath, setDirectoryPath] = useState("");  
  let [scannedResourceTypes, setScannedResourceTypes] = useState([]); 
  let [resourcePreview, setResourcePreview] = useState({}); 
  let [readyToImport, setReadyToImport] = useState(false);
  let [isImporting, setIsImporting] = useState(false);
  let [progressValue, setProgressCount] = useState(0); 
  let [progressMax, setProgressMax] = useState(0); 
  let [importBuffer, setImportBuffer] = useState(""); 
  let [previewBuffer, setPreviewBuffer] = useState(""); 

  let [autoSelectFirstPatient, setAutoSelectFirstPatient] = useState(false);

  
  
  const [importQueue, setImportQueue] = useState([]); 
  // const [fileExtension, setFileExtension] = useState("");  
  
  const downloadLabel = 'Download!';

  let dynamicAlgorithmItems = [];
  let fileExtension = "json";
  let strigifiedImportBuffer = "";
  let strigifiedPreviewBuffer = "";
  // let importQueue = [];

  importBuffer = useTracker(function(){
    return Session.get("importBuffer");
  }, []);
  previewBuffer = useTracker(function(){
    return Session.get("previewBuffer");
  }, []);

  fileExtension = useTracker(function(){
    return Session.get("fileExtension");
  }, []);
  // importQueue = useTracker(function(){
  //   return Session.get("importQueue");
  // }, []);

  let importQueueLength = 0;
  if(Array.isArray(importQueue)){
    importQueueLength = importQueue.length;
    logger.debug('ImportComponent.importQueueLength', importQueueLength)
  }

  if(['csv', 'xml', 'xmlx', 'xlsx', 'json', 'ccd', 'bundle', 'txt', 'application/json', 'application/csv', 'application/json+fhir'].includes(fileExtension)){
    strigifiedPreviewBuffer = JSON.stringify(previewBuffer, null, 2);
  }
  if(['csv', 'xml', 'xmlx', 'xlsx', 'json', 'ccd', 'bundle', 'txt', 'application/json', 'application/csv', 'application/json+fhir'].includes(fileExtension)){
    strigifiedImportBuffer = JSON.stringify(importBuffer, null, 2);
  }

  //---------------------------------------------------------------------
  // Queue Runner (Eager, Throttled)  

  
  useEffect(() => {
    logger.verbose('PreviewDataCard.useEffect()')

    const queueMonitor = Meteor.setInterval(function(){
      logger.trace('Queue Monitor:: ' + new Date() + " - Ready to Import: " + readyToImport)
      
      if(readyToImport){        
        importNextFile();
      }
    }, 500);

    return () => Meteor.clearInterval(queueMonitor);
  }, [readyToImport]);




  //---------------------------------------------------------------------
  // Import Queue Pagination


  const [page, setPage] = useState(0);
  const [rowsPerPageToRender, setRowsPerPage] = useState(10);

  let paginationCount = 0;
  if(Array.isArray(importQueue)){
    paginationCount = importQueue.length;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  let paginationFooter;
  if(!props.disablePagination){
    paginationFooter = <TablePagination
      component="div"
      // rowsPerPageOptions={[5, 10, 25, 100]}
      rowsPerPageOptions={['']}
      colSpan={3}
      count={paginationCount}
      rowsPerPage={rowsPerPageToRender}
      page={page}
      onChangePage={handleChangePage}
      style={{float: 'right', border: 'none'}}
    />
  }

  //---------------------------------------------------------------------
  // Helper Functions


  function openFile(variable, event, value){
    logger.debug('Clicking on the drop zone to initiate selecting a file.')
    
    // Select File button simply clicks the hidden dropzone
    document.getElementsByClassName("dz-clickable")[0].click()

    // this.openDialog();
  }
  function selectFiles(variable, event, value){
    logger.debug('ImportComponent: Selecting files.')

    fileDialog({ multiple: true, accept: ['application/json', 'application/json+fhir', 'application/csv', 'text/csv' ] }, function(fileList){
      logger.verbose('ImportComponent.selectFile().fileDialog().fileList', fileList)

      let promises = Object.keys(fileList).map(function(fileIndex){

        return new Promise(function (resolve, reject) {
          var reader = new FileReader();
          reader.onload = function(event){

            let newQueueItem = {
              name: fileList[fileIndex].name,
              lastModifiedDate: fileList[fileIndex].lastModifiedDate,
              size: fileList[fileIndex].size,
              name: fileList[fileIndex].name,
              type: fileList[fileIndex].type,
              status: 'loaded'
            }
            // logger.trace('FileReader.newQueueItem', newQueueItem);
            var content = event.target.result;   
            
            var parsedContent;
            if(fileList[fileIndex].type === "text/csv"){
              parsedContent = PapaParse.parse(content); 
              newQueueItem.content = parsedContent.data;
            } else if(['application/json', 'application/json+fhir'].includes(fileList[fileIndex].type)){
              parsedContent = JSON.parse(content); 
              newQueueItem.content = parsedContent;
            }

            logger.trace('FileReader.newQueueItem', newQueueItem);

            resolve(newQueueItem)
          };

          reader.readAsText(fileList[fileIndex]);             
        });
      })

      Promise.all(promises).then(function(collatedData){
        //do something with all the results
        logger.trace('collatedData', collatedData)

        setImportQueue(collatedData);
        // Session.set('importQueue', collatedData)
        Session.set('lastUpdated', new Date())
      });
    });
  }
  function changeMappingAlgorithm(event){
    logger.debug('changeMappingAlgorithm', event.target.value);
    setMappingAlgorithm(event.target.value);
  }
  function mapData(){
    if(!importBuffer){
      importBuffer = Session.get('importBuffer');
    }
    console.log("Mapping data from the import buffer using mapping algorithm " + mappingAlgorithm + ".")    

    switch (mappingAlgorithm) {
      case 0:  // FHIR Bundle
        Session.set('previewBuffer', importBuffer);
        MedicalRecordImporter.importBundle(importBuffer);
        break;      
      case 4:  // FaceBook
        parseFacebookProfile(importBuffer);
        break;      
      case 5:  // Chicago Grocers File
        parseChicagoGrocersFile(importBuffer);
        break;
      case 7:  // CDC Reporting File (Covid19)
        if(Array.isArray(importBuffer)){
          importBuffer.forEach(function(row, index){
            // console.log('Upserting row ' + index);

            let newReport = {
              resourceType: "MeasureReport",
              id: Random.id(),
              status: "complete",
              type: "summary",
              measure: Meteor.absoluteUrl() + '/baseR4/Measure/' + Session.get('selectedMeasureId'),
              subject: get(Meteor, 'settings.public.saner.location', null),
              date: new Date(),
              reporter: get(Meteor, 'settings.public.saner.reporter', null),
              // period: {
              //   start: "2020-04-07T00:00:00.000Z",
              //   end: "2020-04-07T00:00:00.000Z"
              // },
              group: [{
                "code": {
                  "coding": [
                    {
                      "system": "http://build.fhir.org/ig/AudaciousInquiry/saner-ig",
                      "code": "numTotBeds"
                    }
                  ],
                  "text": "Total number of all Inpatient and outpatient beds, including all staffed, ICU, licensed, and overflow(surge) beds used for inpatients or outpatients."
                },
                "population": [
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                          "code": "initial-population",
                          "display": "Initial Population"
                        }
                      ]
                    },
                    "count": 0
                  }
                ],
                "measureScore": {
                  "value": 0
                }
              },
              {
                "code": {
                  "coding": [
                    {
                      "system": "http://build.fhir.org/ig/AudaciousInquiry/saner-ig",
                      "code": "numbeds"
                    }
                  ],
                  "text": "Inpatient beds, including all staffed, licensed, and overflow(surge) beds used for inpatients."
                },
                "population": [
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                          "code": "initial-population",
                          "display": "Initial Population"
                        }
                      ]
                    },
                    "count": 0
                  }
                ],
                "measureScore": {
                  "value": 0
                }
              },
              {
                "code": {
                  "coding": [
                    {
                      "system": "http://build.fhir.org/ig/AudaciousInquiry/saner-ig",
                      "code": "numBedsOcc"
                    }
                  ],
                  "text": "Total number of staffed inpatient beds that are occupied."
                },
                "population": [
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                          "code": "initial-population",
                          "display": "Initial Population"
                        }
                      ]
                    },
                    "count": 0
                  }
                ],
                "measureScore": {
                  "value": 0
                }
              },
              {
                "code": {
                  "coding": [
                    {
                      "system": "http://build.fhir.org/ig/AudaciousInquiry/saner-ig",
                      "code": "numICUBeds"
                    }
                  ],
                  "text": "Total number of staffed inpatient intensive care unit (ICU) beds."
                },
                "population": [
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                          "code": "initial-population",
                          "display": "Initial Population"
                        }
                      ]
                    },
                    "count": 0
                  }
                ],
                "measureScore": {
                  "value": 0
                }
              },
              {
                "code": {
                  "coding": [
                    {
                      "system": "http://build.fhir.org/ig/AudaciousInquiry/saner-ig",
                      "code": "numICUBedsOcc"
                    }
                  ],
                  "text": "Total number of staffed inpatient ICU beds that are occupied."
                },
                "population": [
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                          "code": "initial-population",
                          "display": "Initial Population"
                        }
                      ]
                    },
                    "count": 0
                  }
                ],
                "measureScore": {
                  "value": 0
                }
              },
              {
                "code": {
                  "coding": [
                    {
                      "system": "http://build.fhir.org/ig/AudaciousInquiry/saner-ig",
                      "code": "numVent"
                    }
                  ],
                  "text": "Total number of ventilators available."
                },
                "population": [
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                          "code": "initial-population",
                          "display": "Initial Population"
                        }
                      ]
                    },
                    "count": 0
                  }
                ],
                "measureScore": {
                  "value": 0
                }
              },
              {
                "code": {
                  "coding": [
                    {
                      "system": "http://build.fhir.org/ig/AudaciousInquiry/saner-ig",
                      "code": "numVentUse"
                    }
                  ],
                  "text": "Total number of ventilators in use."
                },
                "population": [
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                          "code": "initial-population",
                          "display": "Initial Population"
                        }
                      ]
                    },
                    "count": 0
                  }
                ],
                "measureScore": {
                  "value": 0
                }
              },
              {
                "code": {
                  "coding": [
                    {
                      "system": "http://build.fhir.org/ig/AudaciousInquiry/saner-ig",
                      "code": "numC19HospPats"
                    }
                  ],
                  "text": "Patients currently hospitalized in an inpatient care location who have suspected or confirmed COVID-19."
                },
                "population": [
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                          "code": "initial-population",
                          "display": "Initial Population"
                        }
                      ]
                    },
                    "count": 0
                  }
                ],
                "measureScore": {
                  "value": 0
                }
              },
              {
                "code": {
                  "coding": [
                    {
                      "system": "http://build.fhir.org/ig/AudaciousInquiry/saner-ig",
                      "code": "numC19MechVentPats"
                    }
                  ],
                  "text": "Patients hospitalized in an NHSN inpatient care location who have suspected or confirmed COVID - 19 and are on a mechanical ventilator."
                },
                "population": [
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                          "code": "initial-population",
                          "display": "Initial Population"
                        }
                      ]
                    },
                    "count": 0
                  }
                ],
                "measureScore": {
                  "value": 0
                }
              },
              {
                "code": {
                  "coding": [
                    {
                      "system": "http://build.fhir.org/ig/AudaciousInquiry/saner-ig",
                      "code": "numC19HOPats"
                    }
                  ],
                  "text": "Patients hospitalized in an NHSN inpatient care location with onset of suspected or confirmed COVID - 19 14 or more days after hospitalization."
                },
                "population": [
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                          "code": "initial-population",
                          "display": "Initial Population"
                        }
                      ]
                    },
                    "count": 0
                  }
                ],
                "measureScore": {
                  "value": 0
                }
              },
              {
                "code": {
                  "coding": [
                    {
                      "system": "http://build.fhir.org/ig/AudaciousInquiry/saner-ig",
                      "code": "numC19OverflowPats"
                    }
                  ],
                  "text": "Patients with suspected or confirmed COVID-19 who are in the ED or any overflow location awaiting an inpatient bed."
                },
                "population": [
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                          "code": "initial-population",
                          "display": "Initial Population"
                        }
                      ]
                    },
                    "count": 0
                  }
                ],
                "measureScore": {
                  "value": 0
                }
              },
              {
                "code": {
                  "coding": [
                    {
                      "system": "http://build.fhir.org/ig/AudaciousInquiry/saner-ig",
                      "code": "numC19OFMechVentPats"
                    }
                  ],
                  "text": "Patients with suspected or confirmed COVID - 19 who are in the ED or any overflow location awaiting an inpatient bed and on a mechanical ventilator."
                },
                "population": [
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                          "code": "initial-population",
                          "display": "Initial Population"
                        }
                      ]
                    },
                    "count": 0
                  }
                ],
                "measureScore": {
                  "value": 0
                }
              },
              {
                "code": {
                  "coding": [
                    {
                      "system": "http://build.fhir.org/ig/AudaciousInquiry/saner-ig",
                      "code": "numC19Died"
                    }
                  ],
                  "text": "Patients with suspected or confirmed COVID-19 who died in the hospital, ED, or any overflow location."
                },
                "population": [
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                          "code": "initial-population",
                          "display": "Initial Population"
                        }
                      ]
                    },
                    "count": 0
                  }
                ],
                "measureScore": {
                  "value": 0
                }
              }]
            }        

            console.log('newReport', newReport)

            MeasureReports.upsert({_id: newReport._id}, {$set: newReport}, {filter: false, validate: false});
          })
        }
        setScannedResourceTypes(["MeasureReport"]);
      break;
      case 9:  // Inpatient Prospective Payment System File  
        if(Array.isArray(importBuffer)){

          importBuffer.forEach(function(row, index){
            console.log('Upserting row ' + index);

            let newOrganization = {
              id: row[1],
              identifier: [{
                value: row[1],
                type: {
                  text: 'CMS Certification Number (CCN)'
                }
              }, {
                value: row[7],
                type: {
                  text: 'Hospital Referral Region (HRR) Description'
                }
              }],
              active: true,
              type: [{
                text: 'Inpatient Prospective Payment System (IPPS)',
                coding: [{
                  code: 'IPPS',
                  display: 'Inpatient Prospective Payment System'
                }]
              }],
              name: row[2],
              telecom: [],
              address: [{
                line: [row[3]],
                city: row[4],
                state: row[5],
                postalCode: row[6]
              }]            
            }

            Organizations.upsert({id: newOrganization.id}, {$set: newOrganization});
          })
          console.log('Total number of organizations imported: ' + Organizations.find().count())
        }
        setScannedResourceTypes(["Organization"]);
        break;
      case 10:  // Chicago Grocers File
        if(Array.isArray(importBuffer)){

          importBuffer.forEach(function(row, index){
            console.log('Upserting row ' + index);

            let newLocation = {
              resourceType: 'Location',
              id: row[1],
              identifier: {
                  value: row[1],
                  use: 'CCN',
                  // system: 'http://www.oshpd.ca.gov/HID/Facility-Listing.html'
              },
              name: row[1],
              mode: 'instance',
              type: [],
              address: {
                  use: 'work',
                  type: row[8],
                  line: [row[2]],
                  city: row[3],
                  state: row[4],
                  postalCode: row[6]
              },
              managingOrganization: {
                display: row[11]
              },
              position: {
                  longitude: row[9],
                  latitude: row[10]
              }
          };

            Locations.upsert({id: newLocation.id}, {$set: newLocation});
          })
          // console.log('Total number of locations imported: ' + Locations.find().count())
        }

        setScannedResourceTypes(["Location"]);  
        break;
      case 11:  // LOINC Questionnaire
        console.log('Trying to parse the following buffer as a LOINC Questionnaire.', importBuffer)

        let newQuestionnaire = {
          _id: Random.id(),
          id: 'LOINC-' + get(importBuffer, 'code'),
          status: 'draft',
          resourceType: 'Questionnaire',
          title: get(importBuffer, 'name'),
          name: get(importBuffer, 'name'),
          copyright: get(importBuffer, 'copyrightNotice'),
          identifier: [],
          code: [],
          item: []
        }

        if(get(importBuffer, 'identifier')){
          newQuestionnaire.identifier.push({
            system: "LOINC",
            value: get(importBuffer, 'identifier')
          })
        }

        if(get(importBuffer, 'codeList[0].code')){
          newQuestionnaire.code.push({
            system: "LOINC",
            code: get(importBuffer, 'codeList[0].code'),
            display: get(importBuffer, 'codeList[0].display'),
          })
        }

        if(Array.isArray(importBuffer.items)){
          importBuffer.items.forEach(function(sectionItem){
            let transformedItem = {
              linkId: get(sectionItem, 'questionCode'),
              text: get(sectionItem, 'question'),
              type: get(sectionItem, 'dataType'),
              item: []
            }

            if(Array.isArray(sectionItem.items)){
              sectionItem.items.forEach(function(questionItem){
                let newQuestionItem = {
                  linkId: get(sectionItem, 'questionCode'),
                  text: get(questionItem, 'question'),
                  type: get(questionItem, 'dataType'),
                  answerOption: []
                }

                if(Array.isArray(questionItem.answers)){
                  questionItem.answers.forEach(function(answer){
                    newQuestionItem.answerOption.push({
                      valueCoding: {
                        system: 'LOINC',
                        code: get(answer, 'code'),
                        display: get(answer, 'text'),
                      }
                    })
                  })
                }
                transformedItem.item.push(newQuestionItem)
              })
            }

            newQuestionnaire.item.push(transformedItem)
          })
        }      

        Session.set('previewBuffer', newQuestionnaire)
        break;
      default:
        MedicalRecordImporter.importBundle(previewBuffer);
        break;
    }
  }

  function scanData(previewBuffer, cumulative){
    if(!previewBuffer){
      previewBuffer = Session.get('previewBuffer');
    }
    //console.log("Scanning the preview buffer...", previewBuffer)

    let resourceTypes = [];
    let preview = {};

    if(get(previewBuffer, 'resourceType')){
      resourceTypes.push(get(previewBuffer, 'resourceType'));      
      preview[get(previewBuffer, 'resourceType')] = 1;
    }
    if(get(previewBuffer, 'entry') && Array.isArray(get(previewBuffer, 'entry'))){
      previewBuffer.entry.forEach(function(entry){
        if(get(entry, 'resource.resourceType')){
          resourceTypes.push(get(entry, 'resource.resourceType'));    
          if(!preview[get(entry, 'resource.resourceType')]){
            preview[get(entry, 'resource.resourceType')] = 1
          } else {
            preview[get(entry, 'resource.resourceType')] = preview[get(entry, 'resource.resourceType')] + 1;
          }
        }
      })
    }
    logger.trace("Collected the following resources: ", resourceTypes)

    let bundleResourceTypes = uniq(resourceTypes);
    logger.debug("Compacted into the following list: ", bundleResourceTypes)

    if(cumulative){
      bundleResourceTypes.push(scannedResourceTypes);
      logger.trace("Cumulative resources: ", bundleResourceTypes)
    }
    setScannedResourceTypes(bundleResourceTypes);
    setResourcePreview(preview)
  }

  // function handleChangeMappingAlgorithm(event, index, value, foo){
  //   console.log('handleChangeMappingAlgorithm', event, index, value, foo)
  //   setMappingAlgorithm(value);
  // }
  
  // function handleChangeSyncSource(event, index, value){
  //   console.log('handleChangeSyncSource', event, index, value)
  //   Session.set('syncSourceItem', value)
  // }

  // function clearImportBuffer(){
  //   setImportBuffer(false);
  // }

  // function clearLocalCache(){
  //   if(confirm("Are you absolutely sure?")){

  //     var resourceTypes = [
  //       'AllergyIntolerances',
  //       'CarePlans',
  //       'Conditions',
  //       'Consents',
  //       'Contracts',
  //       'Communications',
  //       'ClinicalImpressions',
  //       'Devices',
  //       'DiagnosticReports',
  //       'Goals',
  //       'Immunizations',
  //       'ImagingStudies',
  //       'Locations',
  //       'Medications',
  //       'MedicationOrders',
  //       'MedicationStatements',
  //       'Organizations',
  //       'Observations',
  //       'Patients',
  //       'Practitioners',
  //       'Persons',
  //       'Procedures',
  //       'Questionnaires',
  //       'QuestionnaireResponses',
  //       'RiskAssessments',
  //       'RelatedPersons',
  //       'Substances',
  //       'Sequences'
  //     ];

  //     resourceTypes.forEach(function(resourceType){
  //       if(Mongo.Collection.get(resourceType)){
  //         Mongo.Collection.get(resourceType).find().forEach(function(record){
  //           Mongo.Collection.get(resourceType).remove({_id: record._id})
  //           Mongo.Collection.get(resourceType)._collection.remove({_id: record._id})
  //         })
  //       }
  //     })

  //     Meteor.call('getServerStats', function(error, result){
  //       if(result){
  //         Session.set('datalakeStats', result);
  //       }
  //     });
  //   }
  // }

  function clearImportQueue(){
    logger.debug('Clearing import queue.');

    setImportQueue([])
    setImportBuffer(false)
    setReadyToImport(false);
  }

  function toggleAutoImport(){
    if(!readyToImport){
      setReadyToImport(true);
      setProgressCount(0);  
      if(Array.isArray(importQueue)){
        setProgressMax(importQueue.length);  
      }
    } else {
      setReadyToImport(false);
    }
  }
  function importNextFile(callback){
    logger.debug("Importing next file in queue.")

    if(Array.isArray(importQueue)){
      if(importQueue.length > 0){

        // remove and return the first item in the array 
        importFile(importQueue.shift());
        Session.set('lastUpdated', new Date())
      } else {
        logger.debug("No items in queue.");
        setReadyToImport(false);
      }
    } else {
      logger.debug("Import queue not available.");
      setReadyToImport(false);
    }
  }
  // async function autoImport(callback){
  //   logger.debug("Auto importing items from import queue.")
  //   setProgressCount(0);    

  //   if(Array.isArray(importQueue)){
  //     Promise.all(
  //       importQueue.map(async function(queueItem){
  //         logger.trace('ImportComponent.autoImport().Promise().queueItem', queueItem);
          
  //         // if(progressValue % 10 === 0){
  //         //   setProgressCount(++progressValue)
  //         // }
            
  //         await importFile(queueItem);
  //       })
  //     ).then(function(results){
  //       if(typeof callback === "function"){
  //         callback();
  //       } else {
  //         setReadyToImport(false);    
  //       }
  //     })
  //     Session.set('lastUpdated', new Date())
  //   }
  // }

  function autoSelectPatient(ifAutoSelectPatient, previewBundle){
    if(ifAutoSelectPatient){
      if(get(previewBundle, 'resourceType') === "Patient"){
        Session.set('selectedPatient', previewBundle);
        Session.set('selectedPatientId', get(previewBundle, 'id'));
      }  
    }  
  }

  async function importFile(queueItem, resolve){
    logger.debug("Let's try to import a file...")
    var self = this;


    if(!previewBuffer){
      previewBuffer = Session.get('previewBuffer');
      logger.debug("No preview data exists.  Loading from preview buffer.")
    }
    if(!fileExtension){
      fileExtension = 'json';

      if(Session.get('fileExtension')){
        fileExtension = Session.get('fileExtension');
      }
      logger.trace("No file extension exists.  Best guess:  " + fileExtension)
    }

    // make sure our inputs exist
    if(get(queueItem, 'content')){
      logger.debug("Queue content exists.  Loading preview data from queue.");
      previewBuffer = get(queueItem, 'content');
    }
    if(get(queueItem, 'type')){
      fileExtension = get(queueItem, 'type');
    }
    
    // make sure we're dealing with a json object
    if(typeof previewBuffer === 'string'){
      logger.trace('This appears to be a string.  ', previewBuffer);
      try {
        previewBuffer = JSON.parse(previewBuffer);        
        logger.trace('Converting to object', previewBuffer);          
      } catch (error) {
        logger.error('Error parsing JSON', error);                  
      }
    }

    // do a quick scan to determine which resource types are being used
    scanData(previewBuffer, true);
  

    logger.debug('File extension: ' + fileExtension);

    if(['csv', 'application/csv'].includes(fileExtension)){
      parseCsvFile(previewBuffer);
    } else if(['xls', 'xlsx'].includes(fileExtension)){
      parseExcelWorkbook(previewBuffer);
    } else if(['xml'].includes(fileExtension)){
      logger.debug('XML parser not impleted yet.');

      let document = Session.get('previewBuffer');

      if(document){
        delete document.$;

        logger.debug('Looks like we managed to parse the XML into JSON.', document);
        if(document.resourceType){
          setScannedResourceTypes([document.resourceType]);
          window[document.resourceType].upsert({id: document.id}, {$set: document});          
        }
      } else {
        logger.debug("Doesn't look like we were able to parse the XML.")
      }

    } else if(['json', 'fhir', 'ccd', 'bundle', 'txt', 'application/json', 'applicaotin/json+fhir'].includes(fileExtension)){
      logger.debug("Otherwise, we're going to assume that this is a JSON or FHIR file.  Parsing...")
      logger.debug('File contents: ', previewBuffer);
      logger.debug('ImportComponent.MappingAlgorithm: ' + mappingAlgorithm);

      autoSelectPatient(autoSelectFirstPatient, previewBuffer);

      switch (mappingAlgorithm) {
        case 1:  // FHIR Bundle
          MedicalRecordImporter.importBundle(previewBuffer);
          break;      
        case 2:  // FaceBook
          parseFacebookProfile(previewBuffer);
          break;      
        case 3:  // Chicago Grocers File
          parseChicagoGrocersFile(previewBuffer);
          break;
        default:
          MedicalRecordImporter.importBundle(previewBuffer);
          break;
      }
    } else {
      logger.debug("Otherwise, we're going to assume that this is a JSON or FHIR file.  Parsing...")
      logger.debug('File contents: ', previewBuffer);

      autoSelectPatient(autoSelectFirstPatient, previewBuffer);
      
      switch (mappingAlgorithm) {
        case 1:  // FHIR Bundle
          MedicalRecordImporter.importBundle(previewBuffer);
          break;      
        case 2:  // FaceBook
          parseFacebookProfile(previewBuffer);
          break;      
        case 3:  // Chicago Grocers File
          this.parseChicagoGrocersFile(previewBuffer);
          break;
        default:
          Meteor.call('proxyInsert', previewBuffer, function(error, result){
            if(error){
              console.log('error while proxy inserting', error)
            }
            if(result){
              console.log('proxyInsert/result', result)
            }
          })
          break;
      }
    }

    logger.debug('File imported.')

    // if(['iPad'].includes(window.navigator.platform)){
    //   browserHistory.push('/continuity-of-care')
    // }

    if(typeof resolve === "function"){
      queueItem.status = "completed";
      resolve(queueItem)        
    }
  }


  function openDialog () {
    console.log('openDialog')
    document.getElementById("importDataButton").click()
  }

  function changeInput(variable, event, value){
    Session.set(variable, value);
  }  


  function handleTextareaUpdate(text){
    console.log('handleTextareaUpdate', text)
  }

  function onChange(newValue) {
    console.log("ImportComponent.onChange", newValue);
  }

  function openFileTypeDialog(){

  }
  function selectImportQueueRow(item, event){
    console.log('selectImportvalueQueueRow', item);

    Session.get("fileExtension", get(item, 'type'))
    Session.set('importBuffer', get(item, 'content'));
    Session.set('lastUpdated', new Date())
  }

  function handleSelectFirstPatient(){
    console.log('handleAutoSelectFirstPatient', autoSelectFirstPatient)
    setAutoSelectFirstPatient(!autoSelectFirstPatient);
  }

  let linkStyle = {
    marginLeft: '20px', 
    textDecoration: 'underline', 
    position: 'relative', 
    top: '-8px', 
    cursor: 'pointer', 
    color: theme.primaryColor
  }


  let importQueueRowsToRender = [];
  let importQueueRows = [];
  if(Array.isArray(importQueue)){
    if(importQueue.length > 0){     
      let count = 0;    
      importQueue.forEach(function(queueItem){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          importQueueRowsToRender.push(queueItem);
        }
        count++;
      });  
    }
    
    if(Array.isArray(importQueueRowsToRender)){
      // console.log('ImportQueue is an array.', importQueueRowsToRender)
      importQueueRowsToRender.forEach(function(item, index){
        importQueueRows.push(<TableRow key={"importQueueRow-" + index} hover={true} onClick={selectImportQueueRow.bind(this, item)} style={{cursor: 'pointer'}} >
          {/* <TableCell>{index}</TableCell> */}
          <TableCell>
            {get(item, 'name')}<br />
            {moment(get(item, 'lastModifiedDate')).format('YYYY-MM-DD hh:mm')}
          </TableCell>
          <TableCell>{get(item, 'size')}</TableCell>
          {/* <TableCell style={{minWidth: '160px'}}>{moment(get(item, 'lastModifiedDate')).format('YYYY-MM-DD hh:mm')}</TableCell> */}
        </TableRow>)
      })  
    }  
  }


  let queueToggleText = "Begin importing items from queue";
  let queueButtonColor;
  if(readyToImport){
    queueToggleText = "Stop Processing"
    queueButtonColor = "default";
  } else {
    queueButtonColor = "primary";
  }

  let marginBottom = 84; 
  if(Meteor.isCordova){
    marginBottom = 0;
  }

  

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let cardWidth = window.innerWidth - paddingWidth;

  return(

      <PageCanvas id="ImportCanvas" headerHeight={headerHeight} style={{height: window.innerHeight }} paddingLeft={paddingWidth} paddingRight={paddingWidth} >

        <Grid container spacing={8}>
          <Grid item md={3} style={{width: '100%', marginBottom: marginBottom + 'px'}}>
            <CardHeader title="Step 1a - Quick Import" />

            
            {/* <StyledCard style={{marginBottom: '40px'}} width={cardWidth + 'px'}>
              <CardContent>        
              <Button 
                id='selectFileButton'
                onClick={ openFile.bind(this) }
                color='primary'
                variant="contained"
                style={{marginBottom: '20px'}}
                fullWidth
              >Select File</Button>   
              <DropzoneComponent
                id='dropzoneComponent'
                config={componentConfig}
                eventHandlers={eventHandlers}
                djsConfig={djsConfig}
                style={{height: '185px', marginBottom: '0px', marginTop: '0px', backgroundColor: "#F0F0F0"}}
              />
              </CardContent>
            </StyledCard> */}


            {/* <CardHeader title="Import Queue" /> */}
            <StyledCard width={cardWidth + 'px'}>              
              <CardContent>        
                <Button 
                  id='selectFileButton'
                  onClick={ selectFiles.bind(this) }
                  color='primary'
                  variant="contained"
                  style={{marginBottom: '20px'}}
                  fullWidth
                >Select Files</Button>   

                <Table>
                  <TableHead>
                    <TableRow style={{fontWeight: 'bold'}}>
                      {/* <TableCell>Index</TableCell> */}
                      <TableCell>File Name</TableCell>
                      <TableCell>Size</TableCell>
                      {/* <TableCell>Last Modified</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {importQueueRows}
                  </TableBody>
                </Table>
                { paginationFooter }
              </CardContent>
              <CardActions style={{display: 'inline-flex', width: '100%'}} >
                <Grid item md={9} style={{paddingRight: '10px'}}>
                  <Button id="autoImportBtn" fullWidth variant="contained" color={queueButtonColor} onClick={toggleAutoImport.bind(this)} >{queueToggleText}</Button>                   
                </Grid>
                <Grid item md={3} style={{paddingLeft: '10px'}}>
                  <Button id="clearConditionsBtn" fullWidth variant="contained" onClick={clearImportQueue.bind(this)} >Clear</Button>             
                </Grid>
              </CardActions>
            </StyledCard>

          </Grid>
          <Grid item md={3} style={{width: '100%'}}>
            <CardHeader title="Step 2 - Raw Data" />
            <StyledCard style={{height: window.innerHeight - 300}} width={cardWidth + 'px'}>
              <RawDataCard
                readyToImport={readyToImport}
                progressMax={importQueueLength}
                progressValue={progressValue}
                importBuffer={strigifiedImportBuffer}
                mappingAlgorithm={mappingAlgorithm}
                fileExtension={fileExtension}
                onImportFile={importFile.bind(this)}
                onScanData={scanData}
                onChangeMappingAlgorithm={changeMappingAlgorithm}
                onMapData={mapData}
              />
            </StyledCard>
          </Grid>
          <Grid item md={3} style={{width: '100%'}}>
            <CardHeader title="Step 3 - Preview Data" />
            <StyledCard style={{height: window.innerHeight - 300}} width={cardWidth + 'px'}>
              <PreviewDataCard
                readyToImport={readyToImport}
                progressMax={importQueueLength}
                progressValue={progressValue}
                previewBuffer={strigifiedPreviewBuffer}
                mappingAlgorithm={mappingAlgorithm}
                fileExtension={fileExtension}
                onImportFile={importFile.bind(this)}
                onScanData={scanData}
                onChangeMappingAlgorithm={changeMappingAlgorithm}
                onMapData={mapData}
              />
            </StyledCard>
          </Grid>
          <Grid item md={3} style={{marginBottom: '80px', width: '100%'}}>
            <CardHeader title="Step 4 - Collection Preview" />
            <StyledCard style={{marginBottom: '20px'}} width={cardWidth + 'px'}>
              <CollectionManagement
                mode="additive"
                resourceTypes={scannedResourceTypes}
                displayImportButton={true}
                displayImportCheckmarks={true}
                displayExportCheckmarks={false}
                displayExportButton={false}
                displayDropButton={true}
                displayPubSubEnabled={false}
                noDataMessage="Please select a file to import."
                preview={resourcePreview}
              />
            </StyledCard>
            <DynamicSpacer />
            <StyledCard style={{paddingBottom: '10px', paddingTop: '10px', paddingLeft: '10px', marginBottom: '20px'}} width={cardWidth + 'px'}>
              <Checkbox checked={autoSelectFirstPatient} onClick={handleSelectFirstPatient} />Auto Select First Patient                              
            </StyledCard>
            <Button 
                id='importDataButton'
                onClick={ importFile.bind(this)}
                color="primary"
                variant="contained"
                fullWidth                
              >Import!</Button>   
          </Grid>
        </Grid>   
      </PageCanvas>

  );
}
export default ImportComponent;
