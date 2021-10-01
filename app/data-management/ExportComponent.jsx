// https://www.npmjs.com/package/react-dropzone-component
// http://www.dropzonejs.com/ 

import { 
  Grid, 
  Button, 
  CardContent, 
  CardHeader, 
  CardActions,
  Tab, 
  Tabs, 
  Typography,
  TextField,
  Select,
  MenuItem,
  Toggle,
  Table,
  FormControl,
  InputLabel,
  Input,
  SelectField,
  Checkbox
} from '@material-ui/core';
import PropTypes from 'prop-types';

// import AccountCircle from 'material-ui/svg-icons/action/account-circle';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Random } from 'meteor/random';
import { HTTP } from 'meteor/http';

import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

if(Package["meteor/alanning:roles"]){
  import { Roles } from 'meteor/alanning:roles';
}

// import ReactGA from 'react-ga';
import { parseString } from 'xml2js';

import { browserHistory } from 'react-router';
import { get, has, set, cloneDeep } from 'lodash';
import moment from 'moment';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { StyledCard, PageCanvas } from 'fhir-starter';

import MedicalRecordsExporter from './MedicalRecordsExporter';
import { CollectionManagement } from './CollectionManagement';

import { gofshClient } from 'gofsh';





// import AceEditor from "react-ace";


//============================================================================
// Helper Components 

function DynamicSpacer(props){
  return(
    <div style={{height: '20px'}}></div>
  )
}

//============================================================================
//Global Theming 

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
      useNextvariants: true
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


//===================================================================================================================
// Cordova  

let onDeviceReady;
let writeToFile;
let errorHandler;
if (Meteor.isCordova) {
  console.log('Meteor.isCordova')
  errorHandler = function (fileName, e) {  
    let msg = '';

    switch (e.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
          msg = 'Storage quota exceeded';
          break;
      case FileError.NOT_FOUND_ERR:
          msg = 'File not found';
          break;
      case FileError.SECURITY_ERR:
          msg = 'Security error';
          break;
      case FileError.INVALID_MODIFICATION_ERR:
          msg = 'Invalid modification';
          break;
      case FileError.INVALID_STATE_ERR:
          msg = 'Invalid state';
          break;
      default:
          msg = 'Unknown error';
          break;
    };

    console.log('Error (' + fileName + '): ' + msg);
  }
  onDeviceReady = function() {  
    console.log('Device is ready...')
    writeToFile = function(fileName, data) {
      console.log('writeToFile()', fileName, data)

      data = JSON.stringify(data, null, '\t');
      console.log('data', data)
      console.log('window', window)
      console.log('cordova', cordova)
      console.log('cordova.file', cordova.file)
      console.log('cordova.file.syncedDataDirectory', cordova.file.syncedDataDirectory)
      console.log('WebAppLocalServer.localFileSystemUrl(syncedDataDirectory)', WebAppLocalServer.localFileSystemUrl(cordova.file.syncedDataDirectory))

        window.resolveLocalFileSystemURL(cordova.file.syncedDataDirectory, function (directoryEntry) {
        console.log('local filesystem resolved...', JSON.stringify(directoryEntry))

        // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

          
            directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
              // fs.root.getFile(fileName, { create: true }, function (fileEntry) {
              console.log('got file...', JSON.stringify(fileEntry))
              console.log('WebAppLocalServer.localFileSystemUrl(fileEntry)', WebAppLocalServer.localFileSystemUrl(fileEntry.nativeURL))

              fileEntry.createWriter(function (fileWriter) {
                console.log('writing file...')
                fileWriter.onwriteend = function (e) {
                        // for real-world usage, you might consider passing a success callback
                        console.log('Write of file "' + fileName + '" completed.');
                    };

                    fileWriter.onerror = function (e) {
                        // you could hook this up with our global error handler, or pass in an error callback
                        console.log('Write failed: ' + e.toString());
                    };

                    let blob = new Blob([data], { type: 'text/plain' });
                    //let blob = new Blob([data], { type: 'application/json' });
                    
                    if(blob){
                      console.log('have blob...', blob)
                      fileWriter.write(blob);  
                    }
                }, errorHandler.bind(null, fileName));
            }, errorHandler.bind(null, fileName));
        }, errorHandler.bind(null, fileName));
    }

    // writeToFile('example.json', { foo: 'bar' });
  }

  document.addEventListener('deviceready', onDeviceReady, false);
}



//===================================================================================================================
// Session Variables

if(Meteor.isClient){
  Session.setDefault('fileExtension', 'json');
  Session.setDefault('dataContent', '');
  Session.setDefault('syncSourceItem', 1);
  Session.setDefault('exportFileType', 1);
  Session.setDefault('relayUrl', 1);  
}




//===================================================================================================================
// Tabs  

function TabContainer(props) {
  return (
    <Typography component="div">
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};


//===================================================================================================================
// Main Component  

export function ExportComponent(props){
  if(!logger && window.logger){
    logger = window.logger;
  }

  logger.info('Rendering the ExportComponent');
  logger.verbose('symptomatic:continuity-of-care.client.ExportComponent');
  logger.data('ExportComponent.props', {data: props}, {source: "ExportComponent.jsx"});

  //----------------------------------------------------------------------------------------------------
  // Internal variables

  const [tabIndex, setTabIndex] = useState(1);
  const [exportFileType, setExportFileType] = useState(1);
  const [relayUrl, setRelayUrl] = useState("");
  const [encryptExport, setEncryptExport] = useState(false);
  const [downloadFileName, setDownloadFileName ] = useState(get(Meteor, 'settings.public.defaults.exportFile.fileName', ""));
  const [downloadFileExtension, setDownloadFileExtension ] = useState(get(Meteor, 'settings.public.defaults.exportFile.downloadFileExtension', ""));
  const [appendDate, setAppendDate ] = useState(get(Meteor, 'settings.public.defaults.exportFile.appendDate', false));
  const [patientFilter, setPatientFilter] = useState("");
  const [errorFilter, setToggleErrorFilter] = useState(false);

  
  //----------------------------------------------------------------------------------------------------
  // Trackers
  
  let exportBuffer = "";
  exportBuffer = useTracker(function(){
    return Session.get('exportBuffer')
  }, []);

  //----------------------------------------------------------------------------------------------------
  // Methods

  function handleTabChange(event, value){
    console.log('handleTabChange', event, value)
    setTabIndex(value);
  }
  function handleChangeExportFileType(event){
    setExportFileType(event.target.value)
  }
  function handleChangePatientFilter(event){
    setPatientFilter(event.target.value)
  }  
  function handleToggleErrorFilter(event, isChecked){
    console.log('handleToggleErrorFilter', isChecked)
    setToggleErrorFilter(isChecked)
  }
  function exportFile(event, value){
    console.log("Let's try to export a file...")
    let self = this;

    let dataContent = Session.get('exportBuffer');

    switch (Session.get('exportFileType')) {
      case 1:  // FHIR Bundle
        exportContinuityOfCareDoc();
      break;      
      case 4:  // Geojson
        exportGeojson();
        break;      
      default:
        exportContinuityOfCareDoc();
        break;
    }
  }
  function clearExportBuffer(){
    Session.set('exportBuffer', null);
  }
  function exportGeojson(){
    console.log('Exporting Geojson file.')
    console.log('Number of Locations:  ', Locations.find().count())

    let newFeatureCollection = {
      "type": "FeatureCollection",
      "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      "features": []
    }

    Locations.find().forEach(function(location){
      let newFeature = { 
        "type": "Feature", 
        "properties": location, 
        "geometry": { 
          "type": "Point", 
          "coordinates": [ get(location, 'position.longitude', null), get(location, 'position.latitude', null) ] 
        } 
      }
      newFeatureCollection.features.push(newFeature);
    });

    Session.set('exportBuffer', newFeatureCollection);
  }
  function exportContinuityOfCareDoc(){
    console.log('Export a Continuity Of Care Document');

    MedicalRecordsExporter.exportContinuityOfCareDoc(patientFilter, errorFilter);
  }

  function handleEditorUpdate(newExportBuffer){
    console.log('handleEditorUpdate', JSON.parse(newExportBuffer))
    Session.set('exportBuffer', JSON.parse(newExportBuffer))
  }
  function downloadExportFile(){
    console.log('downloadExportFile')
    let jsonFile;
    let csvFile;



    // on iPhone we're going to default to copying the buffer contents
    // until we can add file management
    // TODO:  add cordova-plugin-file
    // https://cordova.apache.org/docs/en/10.x/reference/cordova-plugin-file/
    if(['iPhone'].includes(window.navigator.platform)){

      // copy to clipboard
      console.log('Running on iPhone...')
      let exportBuffer = document.getElementById("exportBuffer");
      console.log('exportBuffer', exportBuffer)

      exportBuffer.focus();
      exportBuffer.select();
      
      document.execCommand('Copy');

    } else {

      // assuming we're on a browser that supports HTML5 File API, etc
      // first we determine the file type
      // the two we use most commonly are CVS or JSON
      let blob;
      switch (exportFileType) {
        case 5:  // CSV
          csvFile = CSV.unparse(Encounters.find().fetch());
          blob = new Blob([csvFile], { type: 'application/csv;charset=utf-8;' })
          break;      
        // case 6:  // FSH
        //   jsonFile = JSON.stringify(exportBuffer, null, 2);
        //   console.log('Exporting JSON to FSH...', jsonFile)

        //   if(typeof jsonFile === "object"){
        //     if(Array.isArray(jsonFile.entry)){
        //       let fshFile = gofshClient.fhirToFsh(jsonFile.entry);
        //       blob = new Blob([fshFile], { type: 'application/json;charset=utf-8;' })
        //     }
        //   }
        //   break;      
        default:
          if(encryptExport){
            // https://atmospherejs.com/jparker/crypto-aes
            jsonFile = CryptoJS.AES.encrypt(JSON.stringify(exportBuffer), Meteor.userId());
          } else {
            jsonFile = JSON.stringify(exportBuffer, null, 2);
          }
          blob = new Blob([jsonFile], { type: 'application/json;charset=utf-8;' })
          break;
      }
      console.log('Generated downloadable blob: ', blob)

      let downloadUrl = URL.createObjectURL(blob);
      console.log('Generated download url: ', downloadUrl)

      // then we figure out the file name
      let downloadFilenameString = '';
      if(fileName.length > 0){
        downloadFilenameString = downloadFileName + ".Bundle";
      } else {
        if(appendDate){
          downloadFilenameString = downloadFileName + '-' + moment().format("YYYY-MM-DD-hh-mm")  + '.' + downloadFileExtension;
        } else {
          downloadFilenameString = downloadFileName + '.' + downloadFileExtension;
        }
      }

      // now we decide what kind of JSON file we're going to write
      switch (exportFileType) {
        case 2:  // Geojson
          downloadFilenameString = downloadFileName + '.geojson';
          break;      
        case 6:  // FSH
          downloadFilenameString = downloadFileName + '.fsh';
          break;      
        default:
          if(encryptExport){
            downloadFilenameString = downloadFileName + '.fhir';
          } else {
            downloadFilenameString = downloadFileName + '.json';
          }
          break;
      }
      
      // desktop 
      //let dataString = 'data:text/csv;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportBuffer, null, 2));  

      //let patientName = Meteor.user().displayName();
      //console.log('Generating CCD for ', patientName)
      console.log('downloadFilenameString', downloadFilenameString)

      let downloadAnchorElement = document.getElementById('downloadAnchorElement');

      downloadAnchorElement.setAttribute("href", downloadUrl);
      downloadAnchorElement.setAttribute("download", downloadFilenameString);
      downloadAnchorElement.style.visibility = 'hidden';
      document.body.appendChild(downloadAnchorElement);
      downloadAnchorElement.click();
    }
  }

  function changeFileName(event){
    console.log('changeFileName', event.target.value);

    setDownloadFileName(event.target.value);
  }
  function sendToBundleService(){
    console.log('Sending to Bundle Service...')
    process.env.NODE_ENV === "verbose" && console.log('exportBuffer', Session.get('exportBuffer'))


    switch (Session.get('relayUrl')) {
      case 1:
        console.log('Sending to bundle service...')
        Bundles.insert(Session.get('exportBuffer'), {validation: false, filter: false}, function(error, result){
          console.log('error', error)
          if(result){
            browserHistory.push('/bundles')
          }
        })
        break;
      case 2:
        console.log('Sending to warehouse...')
        Meteor.call('storeBundleToWarehouse', Session.get('exportBuffer'), function(error, result){
          if(error){console.log('error', error);}
          Meteor.call('getServerStats', function(error, result){
            if(result){
              Session.set('datalakeStats', result);
            }
          });  
        })

        // if(!Questionnaire.findOne(record._id)){
        //   let questionnaireId = Questionnaire.insert(record, collectionConfig);    
        //   console.log('Questionnaire created: ' + questionnaireId);
        // }    

      break;
      case 3:
        console.log('Trying to send to relay endpoint...')
        break;
    
      default:
        break;
    }

  }
  function toggleEncryptExport(){
    this.setState({encryptExport: !this.state.encryptExport})
  }

  function handleChangeRelayAlgorithm(event, value){
    // console.log('handleChangeRelayAlgorithm', event, value)
    setRelayUrl(event.target.value)
  }
  function handleRelay(){
    alert(JSON.stringify(relayUrl))

    let testBundle = {
      "resourceType": "Bundle",
      "type": "searchset",
      "total": 0,
      "entry": [
        {
          "fullUrl": "Composition/5pju5QqNCuMvJRJvw",
          "resource": {
            "resourceType": "Composition",
            "identifier": {},
            "status": "preliminary",
            "type": {},
            "class": {},
            "subject": {
              "display": "",
              "reference": ""
            },
            "encounter": {
              "display": "",
              "reference": ""
            },
            "date": "2021-07-22",
            "author": [
              {
                "display": "",
                "reference": ""
              }
            ],
            "title": "Test Bundle Foo",
            "confidentiality": "0",
            "attester": [],
            "custodian": {
              "display": "",
              "reference": ""
            },
            "relatesTo": [],
            "event": [],
            "section": []
          }
        }
      ]
    }
    let httpHeaders = { headers: {
      'Content-Type': 'application/fhir+json',
      'Access-Control-Allow-Origin': '*'          
  }}

    HTTP.post(relayUrl, {
      headers: httpHeaders,
      data: testBundle
    }, function(error, result){
      if(error){console.log('error', error)}
      if(result){console.log('result', result)}
    })

  }


  let relayTab;
  let downloadLabel = 'Download!';
  let downloadDisabled = false;
  let fileNameInput;

  let downloadAnchor = <Button 
    onClick={ downloadExportFile.bind(this)}
    style={{position: 'sticky', bottom: '20px', marginBottom: '20px'}}
    disabled={downloadDisabled}
    fullWidth
    color='primary'
    variant='contained'
  >{downloadLabel}</Button> 


  if(['iPhone'].includes(window.navigator.platform)){
    // downloadLabel = 'Copy to Clipboard'
    downloadLabel = 'Select All > Share > Save to Files > iCloud';
    downloadDisabled = true;
    downloadAnchor = <h4 style={{textAlign: 'center', width: '100%', margin: '10px', marginBottom: '20px'}}>Select All > Share > Save to Files > iCloud</h4>
  } else {    
    fileNameInput = <FormControl style={{width: '100%', marginTop: '20px', marginBottom: '20px'}}>
      <InputLabel>File Name</InputLabel>
      <Input
        id='fileName'
        name='fileName'
        type='text'
        value={downloadFileName}
        // hintText='PatientName.YYYYMMDD.fhir'
        // floatingLabelFixed={true}
        onChange={ changeFileName.bind(this) }
        // hintText={ Meteor.user() ? Meteor.user().fullName() + '.fhir' : ''}
        // onKeyPress={this.handleKeyPress.bind(this)}
        // value={ get(formData, 'fileName') }
        fullWidth
      />
    </FormControl>
  }

  let editCardHeight = window.innerHeight - 128 - 64 - 40 - 64 - 80;
  let editorHeight = editCardHeight;

  let relayOptions = [];
  let interfacesObject = get(Meteor, 'settings.public.interfaces');
  Object.keys(interfacesObject).forEach(function(key, index){
    let interface = interfacesObject[key];
    if(has(interface, 'channel.endpoint') && (get(interface, 'status') === "active")){
      relayOptions.push(<MenuItem value={get(interface, 'channel.endpoint')} id={"relay-menu-item-" + index} key={"relay-menu-item-" + index} >{get(interface, 'name')}</MenuItem>)
    }
  });

  let rightColumnStyle = {width: '100%', marginBottom: '84px', position: 'relative'};
  if(window.innerWidth < 920){
    rightColumnStyle.marginTop = '250px';
  }

  let relayElements;
  if(get(Meteor, 'settings.public.modules.dataRelay') === true){
    relayElements = <div>
    <CardHeader 
      title="Step 3b - Relay to Other Server" />
    <StyledCard scrollable={true} disabled>
      <CardContent>
        <FormControl style={{width: '100%'}}>
          <InputLabel id="export-algorithm-label">Export Relay</InputLabel>
          <Select                  
            value={ relayUrl}
            onChange={ handleChangeRelayAlgorithm.bind(this) }
            fullWidth
          >
            { relayOptions }
            {/* <MenuItem value={1} id="relay-menu-item-1" key="relay-menu-item-1" >Symptomatic - Bundle Service</MenuItem>
            <MenuItem value={2} id="relay-menu-item-2" key="relay-menu-item-2" >Symptomatic - Warehouse</MenuItem>
            <MenuItem value={3} id="relay-menu-item-3" key="relay-menu-item-3" >Other Relay Endpoint</MenuItem> */}
          </Select>
        </FormControl>



        <Input
          id='relayEndpointName'
          name='relayEndpointName'
          type='text'
          fullWidth
          /><br/>

        <Button
          color="primary"
          variant="contained" 
          fullWidth
          onClick={handleRelay.bind(this)}
        >Send to Bundle Service</Button> 

      </CardContent>
    </StyledCard>
  </div>
  }


  return(
    <div>          
      <Grid container spacing={3} >        
        <Grid item lg={4} style={{width: '100%', marginBottom: '84px'}}>
          <CardHeader 
            title="Step 1 - Select Data To Export" />
          <StyledCard scrollable={true} >
            <CardContent>
              <CollectionManagement
                displayImportCheckmarks={false}
                displayExportCheckmarks={true}
                displayClientCount={true}
                displayExportButton={true}
                displayPreview={false}
                mode="export"
              />

              
            </CardContent>
          </StyledCard>
          <DynamicSpacer />
          <StyledCard scrollable={true} >
            <CardContent>
              <FormControl style={{width: '100%', marginTop: '20px', marginBottom: '20px'}}>
                <InputLabel id="patient-filter-label">Patient Filter</InputLabel>
                <Input
                  id="patient-filter-selector"
                  name='patientFilter'
                  placeholder={"Patient/" + Random.id()}
                  type='text'
                  value={patientFilter}
                  onChange={ handleChangePatientFilter.bind(this) }
                  fullWidth
                />
              </FormControl>
              <Checkbox 
                defaultChecked={false} 
                onChange={ handleToggleErrorFilter.bind(this)} 
              />Filter Entered-in-Error records
            </CardContent>
          </StyledCard>
          <DynamicSpacer />
          <Button 
            id='exportCcdBtn' 
            color='primary'
            variant='contained'
            onClick={ exportContinuityOfCareDoc.bind(this) }
            fullWidth
          >Prepare Continuity of Care Document</Button>   
        </Grid>  
        <Grid item lg={4} style={{width: '100%', height: editCardHeight + 'px', marginBottom: '84px'}}>
          <CardHeader 
            title="Step 2 - Review and Edit" />

          <StyledCard scrollable={true} >
            <CardContent>
            
              {/* <AceEditor
                placeholder="Placeholder Text"
                mode="json"
                theme="tomorrow"
                name="exportBuffer"
                onChange={ handleEditorUpdate.bind(this) }
                fontSize={14}
                showPrintMargin={false}
                showGutter={true}
                highlightActiveLine={true}
                value={ JSON.stringify(exportBuffer, null, 2) }
                setOptions={{
                  enableBasicAutocompletion: false,
                  enableLiveAutocompletion: false,
                  enableSnippets: false,
                  showLineNumbers: true,
                  tabSize: 2
                }}
                style={{width: '100%', position: 'relative', height: editorHeight + 'px', minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px', lineHeight: '16px'}}        
              /> */}

              <pre 
                id="dropzonePreview"
                style={{width: '100%', position: 'relative', height: (Session.get('appHeight') - 240).toString() + 'px', borderRadius: '4px', lineHeight: '16px', overflow: 'scroll'}} 
              >
                { JSON.stringify(exportBuffer, null, 2) }
              </pre>

            </CardContent>
            <CardActions>
              <Button id="clearExportBuffer" color="primary" onClick={clearExportBuffer.bind(this)} >Clear</Button>            
            </CardActions>
          </StyledCard>


          
        </Grid>
        <Grid item lg={4} style={rightColumnStyle}>
          <CardHeader 
            title="Step 3a - Select File Type and Export" />
          <StyledCard scrollable={true} >
            <CardContent>
              { fileNameInput }

              <FormControl style={{width: '100%', paddingBottom: '20px'}}>
                <InputLabel id="export-algorithm-label">Export Algorithm</InputLabel>
                <Select
                  // labelId="export-algorithm-label"
                  id="export-algorithm-selector"
                  value={ exportFileType }
                  onChange={ handleChangeExportFileType }
                  fullWidth
                  >
                  <MenuItem value={1} >FHIR Bundle - Mixed Mode</MenuItem>
                  <MenuItem value={2} disabled >FHIR Bundle - R4</MenuItem>
                  <MenuItem value={3} disabled >FHIR Bundle - DSTU2</MenuItem>
                  <MenuItem value={4} >Geojson</MenuItem>
                  <MenuItem value={5} >Comma Separated Values (CSV)</MenuItem>
                  <MenuItem value={6} >FHIR Shorthand (FSH)</MenuItem>
                </Select>
              </FormControl>

              {/* <br/> */}
              {/* <Toggle onToggle={this.toggleEncryptExport.bind(this) } toggled={get(this, 'data.encryptExport')} label="Encrypt" labelPosition='right' /><br /> */}

                

              { downloadAnchor }             
              <a id="downloadAnchorElement" style={{display: "none"}} ></a>   
            </CardContent>
          </StyledCard>
          <DynamicSpacer />
          { relayElements}
          
        </Grid>
      </Grid>
    </div>
  );
}
export default ExportComponent;