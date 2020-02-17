import { 
  Button,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead
} from '@material-ui/core';

import { HTTP } from 'meteor/http';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Session } from 'meteor/session';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import moment from 'moment';


flattenBundle = function(person){
  let result = {
    _id: person._id,
    id: person.id,
    active: true,
    subject: '',
    author: '',
    title: '',
    date: ''
  };

  result.subject = get(person, 'entry[0].resource.subject.display', true).toString();
  result.author = get(person, 'entry[0].resource.author[0].display', true).toString();
  result.title = get(person, 'entry[0].resource.title', true).toString();

  // there's an off-by-1 error between momment() and Date() that we want
  // to account for when converting back to a string
  result.date = moment(person.date).format("YYYY-MM-DD")

  return result;
}

export class BundleTable extends React.Component {
  constructor(props) {
    super(props);
  }
  getMeteorData() {
    let data = {
      style: {
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
        },
        avatar: {
          // color: rgb(255, 255, 255);
          backgroundColor: 'rgb(188, 188, 188)',
          userSelect: 'none',
          borderRadius: '2px',
          height: '40px',
          width: '40px'
        }
      },
      selected: [],
      bundles: []
    };

    let query = {};
    let options = {};

    // number of items in the table should be set globally
    if (get(Meteor, 'settings.public.defaults.paginationLimit')) {
      options.limit = get(Meteor, 'settings.public.defaults.paginationLimit');
    }
    // but can be over-ridden by props being more explicit
    if(this.props.limit){
      options.limit = this.props.limit;      
    }

    if(this.props.data){
      // console.log('this.props.data', this.props.data);

      if(this.props.data.length > 0){              
        this.props.data.forEach(function(bundle){
          data.bundles.push(flattenBundle(bundle));
        });  
      }
    } else {
      data.bundles = Bundles.find().map(function(bundle){
        return flattenBundle(bundle);
      });
    }

    logger.trace("BundleTable[data]", data);
    return data;
  }
  imgError(avatarId) {
    this.refs[avatarId].src = Meteor.absoluteUrl() + 'noAvatar.png';
  }
  rowClick(id){
    Session.set('bundlesUpsert', false);
    Session.set('selectedBundleId', id);
    // Session.set('bundlePageTabIndex', 2);

    logger.debug('BundleTable.rowClick', Bundles.findOne(id));

    // Session.set('dataContent', dataContent);   
  }
  renderRowAvatarHeader(){
    if (get(Meteor, 'settings.public.defaults.avatars') && (this.props.showAvatars === true)) {
      return (
        <TableCell className='avatar'>photo</TableCell>
      );
    }
  }
  renderRowAvatar(bundle, avatarStyle){
    //console.log('renderRowAvatar', bundle, avatarStyle)
    
    if (get(Meteor, 'settings.public.defaults.avatars') && (this.props.showAvatars === true)) {
      return (
        <TableCell className='avatar'>
          <img src={bundle.photo} ref={bundle._id} onError={ this.imgError.bind(this, bundle._id) } style={avatarStyle}/>
        </TableCell>
      );
    }
  }
  renderSpeciesHeader(displaySpecies){
    if(displaySpecies){
      return (
        <TableCell className='species'>Species</TableCell>
      );
    }
  }
  renderSpeciesRow(displaySpecies, bundle){
    if(displaySpecies){
      return (
        <TableCell className='species' style={this.data.style.cellHideOnPhone}>
          {bundle.species}
        </TableCell>
      );
    }

  }
  renderSendButtonHeader(){
    if (this.props.showSendButton === true) {
      return (
        <TableCell className='sendButton' style={this.data.style.hideOnPhone}></TableCell>
      );
    }
  }
  renderSendButton(bundle, avatarStyle){
    if (this.props.showSendButton === true) {
      return (
        <TableCell className='sendButton' style={this.data.style.hideOnPhone}>
          <Button onClick={this.onSend.bind('this', this.data.bundles[i]._id)}>Send</Button>
        </TableCell>
      );
    }
  }
  onSend(id){
    let bundle = Bundles.findOne({_id: id});

    logger.debug("BundleTable.onSend()", bundle);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/Bundle', {
      data: bundle
    }, function(error, result){
      if (error) {
        logger.error("error", error);
      }
      if (result) {
        logger.trace("result", result);
      }
    });
  }
  selectBundleRow(bundleId){
    if(typeof(this.props.onRowClick) === "function"){
      this.props.onRowClick(bundleId);
    }
  }
  render () {
    let tableRows = [];
    let footer;

    if(this.data.bundles.length === 0){
      logger.trace('EncountersTable:  No encounters to render.');
      // footer = <TableNoData noDataPadding={ this.props.noDataMessagePadding } />
    } else {
      for (var i = 0; i < this.data.bundles.length; i++) {
        tableRows.push(
          <TableRow key={i} className="bundleRow" style={{cursor: "pointer"}} onClick={this.selectBundleRow.bind(this, this.data.bundles[i].id )} >
            <TableCell className='identifier' style={this.data.style.cell}>{this.data.bundles[i].identifier}</TableCell>
            <TableCell className='title' onClick={ this.rowClick.bind('this', this.data.bundles[i]._id)} style={this.data.style.cell}>{this.data.bundles[i].title }</TableCell>
            <TableCell className='subject' onClick={ this.rowClick.bind('this', this.data.bundles[i]._id)} style={this.data.style.cell}>{this.data.bundles[i].subject }</TableCell>
            <TableCell className='author' onClick={ this.rowClick.bind('this', this.data.bundles[i]._id)} style={this.data.style.cell}>{this.data.bundles[i].author }</TableCell>
            <TableCell className='birthDate' onClick={ this.rowClick.bind('this', this.data.bundles[i]._id)} style={{minWidth: '100px', paddingTop: '16px'}}>{this.data.bundles[i].birthDate }</TableCell>
          </TableRow>
        );
      }
    }
    
    return(
      <div>
        <Table id='bundlesTable' hover="true" >
          <TableHead>
            <TableRow>
              <TableCell className='identifier'>Identifier</TableCell>
              <TableCell className='author'>Title</TableCell>
              <TableCell className='subject'>Subject</TableCell>
              <TableCell className='author'>Author</TableCell>
              <TableCell className='birthdate' style={{minWidth: '100px'}}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { tableRows }
          </TableBody>
        </Table>        
      </div>
    );
  }
}

BundleTable.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  showSendButton: PropTypes.bool,
  displaySpecies: PropTypes.bool,
  noDataMessagePadding: PropTypes.number
};
BundleTable.defaultProps = {
  fhirVersion: 'R4'
}

ReactMixin(BundleTable.prototype, ReactMeteorData);
export default BundleTable;