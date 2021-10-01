

import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useCallback } from 'react';
// import Promise from 'promise';

import { 
  Button, 
  CardContent, 
  CardHeader, 
  CardActions,
  Grid, 
  Tab, 
  Tabs, 
  Typography,
  FormControl,
  Input,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress
} from '@material-ui/core';
import PropTypes from 'prop-types';

// import AceEditor from "react-ace";
// import "ace-builds/src-noconflict/mode-json";
// import "ace-builds/src-noconflict/theme-tomorrow";


// //====================================================================================
// // Async Hook


//   const useAsync = (asyncFunction, readyToImport) => {
//     const [showProgressBar, setProgressBarVisible] = useState(false);
//     const [progressValue, setProgressBarValue] = useState(0);
//     const [error, setError] = useState(null);

//     // The parseImportQueue function wraps asyncFunction and
//     // handles setting state for showProgressBar, value, and error.
//     // useCallback ensures the below useEffect is not called
//     // on every render, but only if asyncFunction changes.
//     const parseImportQueue = useCallback(() => {
//       logger.debug('Parsing import queue asynchronously.')

//       setProgressBarVisible(true);
//       setProgressBarValue(0);
//       setError(null);
      
//       return asyncFunction()
//         .then(response => setProgressBarValue(++progressValue))
//         .catch(error => setError(error))
//         .finally(() => setProgressBarVisible(false));
//     }, [asyncFunction]);

//     // Call parseImportQueue if we want to fire it right away.
//     // Otherwise parseImportQueue can be called later, such as
//     // in an onClick handler.
//     useEffect(() => {
//       logger.verbose('RawDataCard.useEffect()')
//       if (readyToImport) {
//         logger.verbose('RawDataCard.useEffect().readyToImport')
//         parseImportQueue();
//       }
//     }, [parseImportQueue, readyToImport]);

//     return { parseImportQueue, showProgressBar, progressValue, error };
//   };



//====================================================================================
// Main Application  

function RawDataCard(props){
  logger.debug('Rendering the RawDataCard');
  logger.verbose('symptomatic:data-management.client.RawDataCard');
  logger.data('RawDataCard.props', {data: props}, {source: "RawDataCard.jsx"});


  
  //---------------------------------------------------------------------
  // Props  

  let { 
    children, 
    initialValue, 
    progressValue,
    progressMax, 
    mappingAlgorithm,
    readyToImport,
    importBuffer, 
    fileExtension,
    onImportFile,
    ...otherProps } = props;

  if(['xml', 'xmlx', 'xlsx', 'json', 'ccd', 'bundle', 'txt', 'application/json', 'application/csv', 'application/json+fhir'].includes(fileExtension)){
    // importBufferContents = JSON.stringify(importBuffer, null, 2);
    importBufferContents = importBuffer;
  } else {
    importBufferContents = importBuffer;
  }

  logger.debug("RawDataCard.importBufferContents", importBufferContents);

  // const { parseImportQueue, isImporting, progressValue, error } = useAsync(autoImport, readyToImport);

  // console.log("RawDataCard.isImporting", isImporting);

  // //---------------------------------------------------------------------

  // async function autoImport(callback){
  //   logger.debug("Auto importing items from import queue.")
  //   // setProgressCount(0);    

  //   if(Array.isArray(importQueue)){
      
  //     importQueue.forEach(async function(queueItem){
  //       logger.verbose('ImportComponent.autoImport().Promise().queueItem', queueItem);
        
  //       // setProgressCount(++progressValue)
          
  //       if(typeof onImportFile === "function"){
  //         await onImportFile(queueItem);
  //       }
  //     });      
      
  //     // Session.set('lastUpdated', new Date())

  //     if(typeof callback === "function"){
  //       callback()
  //     }
  //   }
  // }


  //---------------------------------------------------------------------
  // Methods and Functions  
  
  
  function handleMapData(){
    if(typeof props.onMapData === "function"){
      props.onMapData();
    }
  }
  function handleScanData(){
    if(typeof props.onScanData === "function"){
      props.onScanData();
    }
  }
  function handleChangeMappingAlgorithm(event){
    if(typeof props.onChangeMappingAlgorithm === "function"){
      props.onChangeMappingAlgorithm(event);
    }
  }
  function handleChangeEditor(event){
    if(typeof props.onEditorChange === "function"){
      props.onEditorChange(event);
    }
  }

  function clearPreviewBuffer(){
    Session.set("importBuffer", "")
  }
  function noMapCopyToPreviewBuffer(){
    Session.set('previewBuffer', Session.get('importBuffer'));
  }


  //---------------------------------------------------------------------
  // Render Methods  

  logger.trace('RawDataCard.progress', progressValue, progressMax)

  let percentageComplete = 0;
  let previewComponents;
  if(readyToImport){
    // if(progressMax > 0){
    //   percentageComplete = Number(((progressValue / progressMax) * 100).toFixed(0));
    // } 
    previewComponents = <CardContent disabled>
      <CardContent style={{fontSize: '100%', paddingBottom: '28px', paddingTop: '50px', textAlign: 'center'}}>
        <CardHeader 
          title="Preview Unavailable During Import"       
          subheader={"Please wait."}
          style={{fontSize: '100%', whiteSpace: 'nowrap', marginBottom: '40px'}} />
          {/* <LinearProgress variant="determinate" value={percentageComplete} /> */}
          <LinearProgress />
            
      </CardContent>
    </CardContent>
  } else {
    previewComponents = <CardContent>
      {/* <AceEditor
        placeholder="Select a file to import."
        mode="json"
        theme="tomorrow"
        name="exportBuffer"
        // onLoad={this.onLoad}
        onChange={ handleChangeEditor.bind(this) }
        fontSize={14}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        value={importBuffer}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
        style={{width: '100%', position: 'relative', height: window.innerHeight - 440, minHeight: '200px', backgroundColor: '#f5f5f5', borderColor: '#ccc', borderRadius: '4px', lineHeight: '16px'}}        
      /> */}
      <pre 
        id="dropzonePreview"
        style={{
          width: '100%', 
          position: 'relative', 
          minHeight: '200px', 
          height: window.innerHeight - 480, 
          backgroundColor: '#f5f5f5', 
          borderColor: '#ccc', 
          borderRadius: '4px', 
          lineHeight: '16px', 
          overflow: 'scroll'
        }} 
      >
        { importBufferContents }
      </pre>

      <FormControl style={{width: '100%', paddingBottom: '20px', marginTop: '10px'}}>
        <InputLabel id="import-algorithm-label">Mapping Algorithm</InputLabel>
        <Select
          // labelId="export-algorithm-label"
          id="import-algorithm-selector"
          value={ mappingAlgorithm}
          onChange={handleChangeMappingAlgorithm.bind(this)}
          fullWidth
          >
          <MenuItem value={0} id="import-algorithm-menu-item-0" key="import-algorithm-menu-item-0" >FHIR Bundle (Any)</MenuItem>
          <MenuItem value={1} id="import-algorithm-menu-item-1" key="import-algorithm-menu-item-1" >FHIR Bundle - DSTU2</MenuItem>
          <MenuItem value={2} id="import-algorithm-menu-item-2" key="import-algorithm-menu-item-2" >FHIR Bundle - STU3</MenuItem>
          <MenuItem value={3} id="import-algorithm-menu-item-3" key="import-algorithm-menu-item-3" >FHIR Bundle - R4</MenuItem>
          <MenuItem value={4} id="import-algorithm-menu-item-4" key="import-algorithm-menu-item-4" >Facebook Profile</MenuItem>
          <MenuItem value={5} id="import-algorithm-menu-item-5" key="import-algorithm-menu-item-5" >City of Chicago Data File</MenuItem>
          <MenuItem value={6} id="import-algorithm-menu-item-6" key="import-algorithm-menu-item-6" >Geojson</MenuItem>
          <MenuItem value={7} id="import-algorithm-menu-item-7" key="import-algorithm-menu-item-7" >CDC Reporting Spreadsheet</MenuItem>
          <MenuItem value={8} id="import-algorithm-menu-item-8" key="import-algorithm-menu-item-8" >FEMA Reporting Spreadsheet</MenuItem>
          <MenuItem value={9} id="import-algorithm-menu-item-9" key="import-algorithm-menu-item-9" >Inpatient Prospective Payment System File</MenuItem>
          <MenuItem value={10} id="import-algorithm-menu-item-10" key="import-algorithm-menu-item-10" >SANER Hospital File</MenuItem>
          <MenuItem value={11} id="import-algorithm-menu-item-11" key="import-algorithm-menu-item-11" >LOINC Questionnaire</MenuItem>
        </Select>
      </FormControl>

      <Grid container>
        {/* <Grid item md={4} style={{paddingRight: '10px'}}>
          <Button 
            id='scanFile'
            onClick={ handleScanData.bind(this)}
            color="primary"
            variant="contained"
            fullWidth                
          >Scan</Button>   
        </Grid> */}
        <Grid item md={4} style={{paddingRight: '10px'}}>
          <Button 
            id='mapData'
            onClick={ handleMapData.bind(this)}
            color="primary"
            variant="contained"
            fullWidth                
          >Map</Button>   
        </Grid>
        <Grid item md={4} style={{paddingLeft: '10px'}}>
          <Button id="clearImportQueueBtn" fullWidth variant="contained" onClick={clearPreviewBuffer.bind(this)} >Clear</Button>             
        </Grid>
        <Grid item md={4} style={{paddingLeft: '10px'}}>
          <Button id="skipBtn" fullWidth variant="contained" onClick={noMapCopyToPreviewBuffer.bind(this)} >Skip</Button>             
        </Grid>
      </Grid>
    </CardContent>
  }

  return previewComponents;
}


RawDataCard.propTypes = {
  progressMax: PropTypes.number,
  initialValue: PropTypes.number,
  importBuffer: PropTypes.string,
  fileExtension: PropTypes.string,
  mappingAlgorithm: PropTypes.number,
  readyToImport: PropTypes.bool,
  progressValue: PropTypes.number,

  onScanData: PropTypes.func,
  onEditorChange: PropTypes.func,
  onChangeMappingAlgorithm: PropTypes.func,
  onImportFile: PropTypes.func,
  onMapData: PropTypes.func
}
RawDataCard.defaultProps = {
  mappingAlgorithm: 0,
  initialValue: 0,
  progressValue: 0,
  progressMax: 0,
  importBuffer: "",
  readyToImport: false,
  fileExtension: 'json'
}


export default RawDataCard;