import React, { useState } from 'react';
import PropTypes from 'prop-types';

// import { logger } from 'winston';

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from '@material-ui/core';

import TableNoData from 'material-fhir-ui';

import moment from 'moment-es6'
import _ from 'lodash';
let get = _.get;
let set = _.set;

// import { FaTags, FaCode, FaPuzzlePiece, FaLock  } from 'react-icons/fa';
// import { GoTrashcan } from 'react-icons/go';

import Icon from 'react-icons-kit'
import {tag} from 'react-icons-kit/fa/tag'
import {trashO} from 'react-icons-kit/fa/trashO'



import { ThemeProvider, makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  button: {
    background: theme.background,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: theme.buttonText,
    height: 48,
    padding: '0 30px',
  }
}));

let styles = {
  hideOnPhone: {
    visibility: 'visible',
    display: 'table'
  },
  cellHideOnPhone: {
    visibility: 'visible',
    display: 'table',
    paddingTop: '16px',
    maxWidth: '120px'
  },
  cell: {
    paddingTop: '16px'
  }
}


flattenEncounter = function(encounter, dateFormat){
  let result = {
    _id: '',
    meta: '',
    subject: '',
    subjectId: '',
    status: '',
    statusHistory: 0,
    periodStart: '',
    periodEnd: '',
    reasonCode: '', 
    reasonDisplay: '', 
    typeCode: '',
    typeDisplay: '',
    classCode: '',
    duration: ''
  };

  if(!dateFormat){
    dateFormat = get(Meteor, "settings.public.defaults.dateFormat", "YYYY-MM-DD");
  }

  result._id =  get(encounter, 'id') ? get(encounter, 'id') : get(encounter, '_id');

  if(get(encounter, 'subject')){
    if(get(encounter, 'subject.display', '')){
      result.subject = get(encounter, 'subject.display', '');
    } else {
      result.subject = get(encounter, 'subject.reference', '');
    }
  }  
  if(get(encounter, 'patient')){
    if(get(encounter, 'patient.display', '')){
      result.subject = get(encounter, 'patient.display', '');
    } else {
      result.subject = get(encounter, 'patient.reference', '');
    }
  }  

  result.subjectId = get(encounter, 'subject.reference', '');

  result.status = get(encounter, 'status', '');
  result.reasonCode = get(encounter, 'reason[0].coding[0].code', '');
  result.reasonDisplay = get(encounter, 'reason[0].coding[0].display', '');
  result.typeCode = get(encounter, 'type[0].coding[0].code', '');
  result.typeDisplay = get(encounter, 'type[0].coding[0].display', '');

  if(get(encounter, 'class.code')){
    result.classCode = get(encounter, 'class.code', '');
  } else if(get(encounter, 'class')){
    result.classCode = get(encounter, 'class', '');
  }

  let statusHistory = get(encounter, 'statusHistory', []);

  result.statusHistory = statusHistory.length;

  let momentStart = moment(get(encounter, 'period.start', ''))
  let momentEnd = moment(get(encounter, 'period.end', ''))

  result.periodStart = momentStart.format(dateFormat);
  result.periodEnd = momentEnd.format(dateFormat);

  if(momentStart && momentEnd){
    result.duration = Math.abs(momentStart.diff(momentEnd, 'minutes', true))
  }

  return result;
}




function EncountersTable(props){
  logger.info('Rendering the EncountersTable');
  logger.verbose('clinical:hl7-resource-encounter.client.EncountersTable');
  logger.data('EncountersTable.props', {data: props}, {source: "EncountersTable.jsx"});

  let rows = [];
  let rowsPerPageToRender = 5;

  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  if(props.rowsPerPage){
    // if we receive an override as a prop, render that many rows
    // best to use rowsPerPage with disablePagination
    rowsPerPageToRender = props.rowsPerPage;
  } else {
    // otherwise default to the user selection
    rowsPerPageToRender = rowsPerPage;
  }

  let paginationCount = 101;
  if(props.count){
    paginationCount = props.count;
  } else {
    paginationCount = rows.length;
  }


  function handleChange(row, key, value) {
    const source = this.state.source;
    source[row][key] = value;
    this.setState({source});
  }
  function displayOnMobile(width){
    let style = {};
    if(['iPhone'].includes(window.navigator.platform)){
      style.display = "none";
    }
    if(width){
      style.width = width;
    }
    return style;
  }
  function handleSelect(selected) {
    this.setState({selected});
  }
  function getDate(){
    return "YYYY/MM/DD";
  }
  function noChange(){
    return "";
  }
  function rowClick(id){
    // console.log('EncountersTable.rowClick', id);

    Session.set("selectedEncounterId", id);
    Session.set('encounterPageTabIndex', 1);
    Session.set('encounterDetailState', false);

    if(props && (typeof props.onRowClick === "function")){
      props.onRowClick(id);
    }
  }
  function renderActionIconsHeader(){
    if (!props.hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(encounter ){
    if (!props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          <Icon icon={tag} style={iconStyle} onClick={ onMetaClick.bind(encounter)}  />
          <Icon icon={trashO} style={iconStyle} onClick={ removeRecord.bind(encounter._id)} />
        </TableCell>
      );
    }
  } 


  function removeRecord(_id){
    console.log('Remove encounter ', _id)
    if(props.onRemoveRecord){
      props.onRemoveRecord(_id);
    }
  }
  function onActionButtonClick(id){
    if(typeof props.onActionButtonClick === "function"){
      props.onActionButtonClick(id);
    }
  }
  function cellClick(id){
    if(typeof props.onCellClick === "function"){
      props.onCellClick(id);
    }
  }

  function onMetaClick(patient){
    let self = this;
    if(props.onMetaClick){
      props.onMetaClick(self, patient);
    }
  }
  function renderBarcode(id){
    if (!props.hideBarcode) {
      return (
        <TableCell><span className="barcode helvetica">{id}</span></TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (!props.hideBarcode) {
      return (
        <TableCell>System ID</TableCell>
      );
    }
  }
  function renderSubject(name, type){
    if (!props.hideSubjects) {
      let result;
      if(props.multiline){
        result = <TableCell className='name'>
          <span style={{color: 'grey', fontSize: '80%'}}>{ name }</span><br/>
          <span style={{fontSize: '120%'}}>{ type }</span>
        </TableCell>;
      } else {
        result = <TableCell className='name'>{ name }</TableCell>;
      }
      return (result);
    }
  }
  function renderSubjectHeader(){
    if (!props.hideSubjects) {
      return (
        <TableCell className='name'>Subject</TableCell>
      );
    }
  }
  function renderStatus(valueString){
    if (!props.hideStatus) {
      return (
        <TableCell className='value'>{ valueString }</TableCell>
      );
    }
  }
  function renderStatusHeader(){
    if (!props.hideStatus) {
      return (
        <TableCell className='value'>Status</TableCell>
      );
    }
  }

  function renderHistory(valueString){
    if (!props.hideHistory) {
      return (
        <TableCell className='history'>{ valueString }</TableCell>
      );
    }
  }
  function renderHistoryHeader(){
    if (!props.hideHistory) {
      return (
        <TableCell className='history'>History</TableCell>
      );
    }
  }

  function renderTypeCodeHeader(){
    if (!props.hideTypeCode) {
      return (
        <TableCell className='typecode'>TypeCode</TableCell>
      );
    }
  }
  function renderTypeCode(code){
    if (!props.hideTypeCode) {
      return (
        <TableCell className='typecode'>{ code }</TableCell>
      );  
    }
  }
  function renderTypeHeader(){
    if (!props.hideType) {
      return (
        <TableCell className='typeDisplay'>Type</TableCell>
      );
    }
  }
  function renderType(type){
    if (!props.hideType) {
      return (
        <TableCell className='typeDisplay'>{ type }</TableCell>
      );  
    }
  }
  function renderClassCodeHeader(){
    if (!props.hideClassCode) {
      return (
        <TableCell className='classcode'>Class</TableCell>
      );
    }
  }
  function renderClassCode(code){
    if (!props.hideClassCode) {
      return (
        <TableCell className='classcode'>{ code }</TableCell>
      );  
    }
  }
  function renderReasonCodeHeader(){
    if (!props.hideReasonCode) {
      return (
        <TableCell className='reasoncode'>ReasonCode</TableCell>
      );
    }
  }
  function renderReasonCode(code){
    if (!props.hideReasonCode) {
      return (
        <TableCell className='reasoncode'>{ code }</TableCell>
      );  
    }
  }
  function renderReasonHeader(){
    if (!props.hideReason) {
      return (
        <TableCell className='reason'>Reason</TableCell>
      );
    }
  }
  function renderReason(code){
    if (!props.hideReason) {
      return (
        <TableCell className='reason'>{ code }</TableCell>
      );  
    }
  }
  function renderCategoryHeader(){
    if (!props.hideCategory) {
      return (
        <TableCell className='category'>Category</TableCell>
      );
    }
  }
  function renderCategory(category){
    if (!props.hideCategory) {
      return (
        <TableCell className='category'>{ category }</TableCell>
      );
    }
  }
  function renderToggleHeader(){
    if (!props.hideCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Toggle</TableCell>
      );
    }
  }
  function renderToggle(){
    if (!props.hideCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}}>
            {/* <Checkbox
              defaultChecked={true}
            /> */}
        </TableCell>
      );
    }
  }
  function renderStartDateHeader(){
    if (!props.hideStartDateTime) {
      return (
        <TableCell className='start' style={{minWidth: '140px'}}>Start</TableCell>
      );
    }
  }
  function renderStartDate(periodStart){
    if (!props.hideStartDateTime) {
      return (
        <TableCell className='periodStart' style={{minWidth: '140px'}}>{ periodStart }</TableCell>
      );
    }
  }
  function renderEndDateHeader(){
    if (!props.hideEndDateTime) {
      return (
        <TableCell className='end' style={{minWidth: '140px'}}>End</TableCell>
      );
    }
  }
  function renderEndDate(periodEnd){
    if (!props.hideEndDateTime) {
      return (
        <TableCell className='periodEnd' style={{minWidth: '140px'}}>{ periodEnd }</TableCell>
      );
    }
  }
  function renderDurationHeader(){
    if (!props.calculateDuration) {
      return (
        <TableCell className='duration'>Duration</TableCell>
      );
    }
  }
  function renderDuration(duration){
    if (!props.calculateDuration) {
      return (
        <TableCell className='duration'>{ duration }</TableCell>
      );  
    }
  }
  function onActionButtonClick(id){
    console.log('onActionButtonClick', id, props);

    if(typeof props.onActionButtonClick === "function"){
      props.onActionButtonClick(id);
    }
  }
  function renderActionButtonHeader(){
    if (props.showActionButton === true) {
      return (
        <TableCell className='ActionButton' >Action</TableCell>
      );
    }
  }
  function renderActionButton(patient){
    if (props.showActionButton === true) {
      return (
        <TableCell className='ActionButton' >
          <Button onClick={ onActionButtonClick.bind(this, patient[i]._id)}>{ get(props, "actionButtonLabel", "") }</Button>
        </TableCell>
      );
    }
  }

  let tableRows = [];
  let encountersToRender = [];
  let proceduresToRender = [];
  let dateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    dateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.dateFormat){
    dateFormat = props.dateFormat;
  }

  if(props.encounters){
    if(props.encounters.length > 0){     
      let count = 0;    
      props.encounters.forEach(function(encounter){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          encountersToRender.push(flattenEncounter(encounter, dateFormat));
        }
        count++;
      });  
    }
  }

  if(encountersToRender.length === 0){
    logger.trace('EncountersTable:  No encounters to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < encountersToRender.length; i++) {
      if(props.multiline){
        tableRows.push(
          <TableRow className="encounterRow" key={i} onClick={ rowClick.bind(this, encountersToRender[i]._id)} style={{cursor: 'pointer'}} hover={true} >
            { renderToggle() }
            { renderActionIcons(encountersToRender[i]) }
            { renderSubject(encountersToRender[i].subject, encountersToRender[i].typeDisplay)}
            { renderClassCode(encountersToRender[i].classCode) }
            { renderTypeCode(encountersToRender[i].typeCode) }
            { renderType(encountersToRender[i].typeDisplay)}
            { renderReasonCode(encountersToRender[i].reasonCode)}
            { renderReason(encountersToRender[i].reasonDisplay)}
            { renderStatus(encountersToRender[i].status)}
            { renderHistory(encountersToRender[i].statusHistory)}
            { renderStartDate(encountersToRender[i].periodStart)}
            { renderEndDate(encountersToRender[i].periodEnd)}
            { renderDuration(encountersToRender[i].duration)}
            { renderBarcode(encountersToRender[i]._id)}
            { renderActionButton(encountersToRender[i]) }
          </TableRow>
        );    
      } else {
        tableRows.push(
          <TableRow className="encounterRow" key={i} onClick={ rowClick.bind(this, encountersToRender[i]._id)} style={{cursor: 'pointer'}} hover={true} >            
            { renderToggle() }
            { renderActionIcons(encountersToRender[i]) }
            { renderSubject(encountersToRender[i].subject)}
            { renderClassCode(encountersToRender[i].classCode) }
            { renderTypeCode(encountersToRender[i].typeCode) }
            { renderType(encountersToRender[i].typeDisplay)}
            { renderReasonCode(encountersToRender[i].reasonCode)}
            { renderReason(encountersToRender[i].reasonDisplay)}
            { renderStatus(encountersToRender[i].status)}
            { renderHistory(encountersToRender[i].statusHistory)}
            { renderStartDate(encountersToRender[i].periodStart)}
            { renderEndDate(encountersToRender[i].periodEnd)}
            { renderDuration(encountersToRender[i].duration)}
            { renderBarcode(encountersToRender[i]._id)}
            { renderActionButton(encountersToRender[i]) }
          </TableRow>
        );    
      }
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  let paginationFooter;
  if(!props.disablePagination){
    paginationFooter = <TablePagination
      component="div"
      rowsPerPageOptions={[5, 10, 25, 100]}
      colSpan={3}
      count={paginationCount}
      rowsPerPage={rowsPerPageToRender}
      page={page}
      // SelectProps={{
      //   inputProps: { 'aria-label': 'rows per page' },
      //   native: true
      // }}
      onChangePage={handleChangePage}
      //onChangeRowsPerPage={handleChangeRowsPerPage}
      // ActionsComponent={TablePaginationActions}
      style={{float: 'right', border: 'none'}}
    />
  }

  return(
    <div>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            { renderToggleHeader() }
            { renderActionIconsHeader() }
            { renderSubjectHeader() }
            { renderClassCodeHeader() }
            { renderTypeCodeHeader() }
            { renderTypeHeader() } 
            { renderReasonCodeHeader() }
            { renderReasonHeader() }
            { renderStatusHeader() }
            { renderHistoryHeader() }
            { renderStartDateHeader() }
            { renderEndDateHeader() }
            { renderDurationHeader() }
            { renderBarcodeHeader() }
            { renderActionButtonHeader() }
          </TableRow>
        </TableHead>
        <TableBody>
          { tableRows }
        </TableBody>
      </Table>
      { paginationFooter }
    </div>
  );
}

EncountersTable.propTypes = {
  barcodes: PropTypes.bool,
  encounters: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  hideCategory: PropTypes.bool,
  hideClassCode: PropTypes.bool,
  hideType: PropTypes.bool,
  hideTypeCode: PropTypes.bool,
  hideReason: PropTypes.bool,
  hideReasonCode: PropTypes.bool,
  hideSubjects: PropTypes.bool,
  hideCheckboxes: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideHistory: PropTypes.bool,
  hideBarcode: PropTypes.bool,
  calculateDuration: PropTypes.bool,
  enteredInError: PropTypes.bool,
  multiline: PropTypes.bool,
  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,
  hideEndDateTime: PropTypes.bool,
  hideStartDateTime: PropTypes.bool,

  onActionButtonClick: PropTypes.func,
  showActionButton: PropTypes.bool,
  actionButtonLabel: PropTypes.string,

  rowsPerPage: PropTypes.number,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool
};

EncountersTable.defaultProps = {
  hideBarcode: true
}


export default EncountersTable; 