import { 
  Button,
  CardHeader,
  CardContent,
  TextField
} from '@material-ui/core';

import { get, set } from 'lodash';
import moment from 'moment';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';


const styles = {
  block: {
    maxWidth: 250,
  },
  toggle: {
    marginTop: 16,
  },
  thumbOff: {
    backgroundColor: '#ffcccc',
  },
  trackOff: {
    backgroundColor: '#ff9d9d',
  },
  thumbSwitched: {
    backgroundColor: 'red',
  },
  trackSwitched: {
    backgroundColor: '#ff9d9d',
  },
  labelStyle: {
    color: 'red',
  },
};

export class BundleDetailOld extends React.Component {
  // will need to overhaul this
  shouldComponentUpdate(nextProps){
    process.env.NODE_ENV === "test" && console.log('BundleDetailOld.shouldComponentUpdate()', nextProps, this.state)
    let shouldUpdate = true;

    // both false; don't take any more updates
    if(nextProps.bundle === this.state.bundle){
      shouldUpdate = false;
    }

    // received an bundle from the table; okay lets update again
    if(nextProps.bundleId !== this.state.bundleId){
      this.setState({bundleId: nextProps.bundleId})
      
      if(nextProps.bundle){
        this.setState({bundle: nextProps.bundle})     
        this.setState({form: this.dehydrateFhirResource(nextProps.bundle)})       
      }
      shouldUpdate = true;
    }
 
    return shouldUpdate;
  }
  getMeteorData() {
    let data = {
      bundleId: this.props.bundleId,
      bundle: false,
      bundelContent: '',
      form: this.state.form
    };

    if(this.props.bundle){
      data.bundle = this.props.bundle;
    }
    if(this.props.displayBirthdate){
      data.displayBirthdate = this.props.displayBirthdate;
    }

    data.bundleContent = JSON.stringify(Bundles.findOne(this.props.bundleId), null, 2);

    if(process.env.NODE_ENV === "test") console.log("BundleDetailOld[data]", data);
    return data;
  }

  render() {
    if(process.env.NODE_ENV === "test") console.log('BundleDetailOld.render()', this.state)
    let formData = this.state.form;

    return (
      <div id={this.props.id} className="bundleDetailOld">
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <TextField
                id='identifier'                
                name='identifier'
                floatingLabelText='Identifier'
                value={ get(formData, 'identifier', '')}
                onChange={ this.changeState.bind(this, 'identifier')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Grid>
            <Grid item xs={8}>
              <TextField
                id='title'                  
                name='title'
                floatingLabelText='Title'
                value={ get(formData, 'title', '')}
                onChange={ this.changeState.bind(this, 'title')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <pre style={{maxHeight: '500px', width: '100%', height: '100%'}}>
              {this.data.bundleContent}              
            </pre>
          </Grid>       
        </CardContent>
        <CardActions>
          { this.determineButtons(this.data.bundleId) }
        </CardActions>
      </div>
    );
  }

  determineButtons(bundleId){
    if (bundleId) {
      return (
        <div>
          <Button id='updateBundleButton' className='updateBundleButton' primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}}>Save</Button>
          <Button id='deleteBundleButton' onClick={this.handleDeleteButton.bind(this)}>Delete</Button>
        </div>
      );
    } else {
      return(
        <Button id='saveBundleButton'  className='saveBundleButton' primary={true} onClick={this.handleSaveButton.bind(this)}></Button>
      );
    }
  }

  updateFormData(formData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("BundleDetailOld.updateFormData", formData, field, textValue);

    switch (field) {
      case "title":
        set(formData, 'title', textValue)
        break;
      case "identifier":
        set(formData, 'identifier', textValue)
        break;
      default:
    }

    if(process.env.NODE_ENV === "test") console.log("formData", formData);
    return formData;
  }
  updateBundle(bundleData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("BundleDetailOld.updateBundle", bundleData, field, textValue);

    switch (field) {
      case "title":
        set(bundleData, 'title', textValue)
        break;
      case "identifier":
        set(bundleData, 'identifier[0].value', textValue)
        break;
    }
    return bundleData;
  }
  changeState(field, event, textValue){
    if(process.env.NODE_ENV === "test") console.log("   ");
    if(process.env.NODE_ENV === "test") console.log("BundleDetailOld.changeState", field, textValue);
    if(process.env.NODE_ENV === "test") console.log("this.state", this.state);

    let formData = Object.assign({}, this.state.form);
    let bundleData = Object.assign({}, this.state.bundle);

    formData = this.updateFormData(formData, field, textValue);
    bundleData = this.updateBundle(bundleData, field, textValue);

    if(process.env.NODE_ENV === "test") console.log("bundleData", bundleData);
    if(process.env.NODE_ENV === "test") console.log("formData", formData);

    this.setState({bundle: bundleData})
    this.setState({form: formData})
  }


  // this could be a mixin
  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new Bundle...', this.state)

    let self = this;
    let fhirBundleData = Object.assign({}, this.state.bundle);

    if(process.env.NODE_ENV === "test") console.log('fhirBundleData', fhirBundleData);


    let bundleValidator = BundleSchema.newContext();
    console.log('bundleValidator', bundleValidator)
    bundleValidator.validate(fhirBundleData)

    console.log('IsValid: ', bundleValidator.isValid())
    // console.log('ValidationErrors: ', bundleValidator.validationErrors());

    if (this.state.bundleId) {
      if(process.env.NODE_ENV === "test") console.log("Updating bundle...");

      delete fhirBundleData._id;

      // not sure why we're having to respecify this; fix for a bug elsewhere
      fhirBundleData.resourceType = 'Bundle';

      Bundles._collection.update({_id: this.state.bundleId}, {$set: fhirBundleData }, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("Bundles.insert[error]", error);
          // Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Bundles", recordId: self.state.bundleId});
          Session.set('selectedBundleId', false);
          Session.set('bundlePageTabIndex', 1);
          // Bert.alert('Bundle added!', 'success');
        }
      });
    } else {
      if(process.env.NODE_ENV === "test") console.log("Creating a new bundle...", fhirBundleData);

      Bundles._collection.insert(fhirBundleData, function(error, result) {
        if (error) {
          if(process.env.NODE_ENV === "test")  console.log('Bundles.insert[error]', error);
          // Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Bundles", recordId: self.state.bundleId});
          Session.set('bundlePageTabIndex', 1);
          Session.set('selectedBundleId', false);
          // Bert.alert('Bundle added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('bundlePageTabIndex', 1);
  }

  handleDeleteButton(){
    let self = this;
    Bundles._collection.animalremove({_id: this.state.bundleId}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Bundles.insert[error]', error);
        // Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Bundles", recordId: self.state.bundleId});
        Session.set('bundlePageTabIndex', 1);
        Session.set('selectedBundleId', false);
        // Bert.alert('Bundle removed!', 'success');
      }
    });
  }
}

BundleDetailOld.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  bundleId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  bundle: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};
ReactMixin(BundleDetailOld.prototype, ReactMeteorData);


function BundleDetail(props){

  // REFACTOR: extract into shared hydration/dehydration library
  function dehydrateFhirResource(bundle) {
    // let formData = Object.assign({}, this.state.form);
    let result = {}

    result.prefix = get(bundle, 'name[0].prefix[0]')
    result.family = get(bundle, 'name[0].family[0]')
    result.given = get(bundle, 'name[0].given[0]')
    result.suffix = get(bundle, 'name[0].suffix[0]')
    result.identifier = get(bundle, 'identifier[0].value')
    result.deceased = get(bundle, 'deceasedBoolean')
    result.gender = get(bundle, 'gender')
    result.multipleBirth = get(bundle, 'multipleBirthBoolean')
    result.maritalStatus = get(bundle, 'maritalStatus.text')
    result.species = get(bundle, 'animal.species.text')
    result.language = get(bundle, 'communication[0].language.text')
    result.birthDate = moment(bundle.birthDate).format("YYYY-MM-DD")

    return result;
  }


  return(<div className="bundleDetail">Details</div>)
}
export default BundleDetail;