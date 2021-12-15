/**
 * Copyright © 2015-2016 Symptomatic, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */  

import React from 'react';
import PropTypes from 'prop-types';

import { 
  Card,
  CardHeader,  
  CardContent,
  CardMedia,
  Typography, 
  TextField,
  FormControl,
  Input, 
  InputLabel,
  Grid
} from '@material-ui/core';

import _ from 'lodash';
let get = _.get;
let set = _.set;

import moment from 'moment';

// import StyledCard from '../components/StyledCard';
import { StyledCard, PageCanvas, DynamicSpacer } from 'fhir-starter';


function PatientCard(props){

  console.log('PatientCard v0.10.60')


  let { id, identifier, active, familyName, givenName, fullName, email, birthDate, gender, avatar, patient, zDepth, overflowY, showDetails, showSummary, showName, showBarcode, avatarUrlHostname, cardMediaWidth, ...otherProps } = props;



  if(patient){
    id = get(patient, 'id', '');
    fullName = get(patient, 'name[0].text', '');

    if(Array.isArray(get(patient, 'name[0].family'))){
      familyName = get(patient, 'name[0].family[0]', '');        
    } else {
      familyName = get(patient, 'name[0].family', '');        
    }

    givenName = get(patient, 'name[0].given[0]', '');

    email = get(patient, 'contact[0].value', '');
    birthDate = get(patient, 'birthDate', '');
    gender = get(patient, 'gender', '');
    if(avatarUrlHostname){
      avatar = avatarUrlHostname + get(patient, 'photo[0].url', '');
    } else {
      avatar = get(patient, 'photo[0].url', '');
    }
    identifier = get(patient, 'identifier[0].value', '');
    
  } 

  const styles = {
    details: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    },
    content: {
      flex: '1 0 auto',
    },
    cover: {
      width: 151
    },
    patientCardSpace: {
      position: 'relative'
    }
  }

  function handleChange(){ 

  }
     
  let details;
  if(props.showDetails){
      details = <div id='profileDemographicsPane' style={{position: 'relative'}}>
        <Grid container justify="space-evenly" style={ styles.synopsis} spacing={3}>
          <Grid item xs={12} md={6} >
            <TextField
              // id='givenNameInput'
              name='given'
              type='text'
              label='Given Name'
              value={ givenName }   
              InputLabelProps={{ shrink: true }} 
              // helperText="aka First Name"                    
              fullWidth
              /><br/>
          </Grid>
          <Grid item xs={12} md={6} >
            <TextField
              // id='familyNameInput'
              name='family'
              type='text'
              label='Family Name'
              value={ familyName }              
              InputLabelProps={{ shrink: true }}          
              fullWidth
              /><br/>
          </Grid>
        </Grid>
        <Grid container style={ styles.synopsis } spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              // id='birthDateInput'
              name='birthDate'
              type={ birthDate ? 'date' : 'text' }    
              label='Date of Birth' 
              value={ birthDate ? moment(birthDate).format('YYYY-MM-DD') : '' }                                                  
              InputLabelProps={{ shrink: true }}
              InputLabelProps={{ shrink: true }}
              fullWidth
              /><br/>
          </Grid>
          <Grid item xs={12} md={2} >
            <TextField
              // id='genderInput'
              name='gender'
              type='text'
              label='Gender'
              value={ gender }                  
              InputLabelProps={{ shrink: true }}      
              fullWidth
              /><br/>
          </Grid>
          <Grid item xs={12} md={6} >
            <TextField
              // id='avatarInput'
              name='avatar'
              type='text'
              label='Avatar'
              value={ avatar }                  
              InputLabelProps={{ shrink: true }}      
              fullWidth
              /><br/>
          </Grid>
        </Grid>
      </div>

  }

  let styledCardStyle = {
    display: 'flex',
    flexGrow: 1
  }


  let showMedia = false;
  let mediaElements;
  let avatarHeight = 220;
  if(avatar){
    if(!showName){
      avatarHeight = avatarHeight - 64;
    }
    if(!showDetails){
      avatarHeight = avatarHeight - 156;
    }
    mediaElements = <CardMedia      
      image={avatar}      
      style={{height: avatarHeight + 'px', width: cardMediaWidth, backgroundSize: 'cover'}}
    />
  }

  let summaryElements;
  if(showSummary){
    summaryElements = <Typography color="textSecondary">
      MRN: { identifier } DOB:  { moment(birthDate).format("MMM DD, YYYY") } Gender: { gender } 
    </Typography>
  }


  let barcodeElements;
  let titleStyle = {
    paddingBottom: '0px'
  };
  
  let barcodeStyle = {
    paddingLeft: '16px',
    fontSize: '150%',
    marginTop: '0px',
    marginBottom: '0px',
    fontWeight: 200
  }

  if(showBarcode){
    barcodeElements = <h4 className="barcode barcodes" style={barcodeStyle}>{id}</h4>
    titleStyle.paddingTop = '0px';
  }

  let nameElements;
  if(showName){
    nameElements = <CardHeader title={fullName} style={titleStyle} />
  }


  return(
    <div className='patientCard'>
      <StyledCard style={styledCardStyle} >
        { mediaElements }
        <div style={styles.details}>
          { barcodeElements }
          { nameElements }
          <CardContent>
            { showSummary }
            { details }
          </CardContent>
        </div>
      </StyledCard>
    </div>
  );
}


PatientCard.propTypes = {
  patient: PropTypes.object,
  multiline: PropTypes.bool,
  id: PropTypes.string,
  fullName: PropTypes.string,
  familyName: PropTypes.string,
  givenName: PropTypes.string,
  email: PropTypes.string,
  birthDate: PropTypes.string,
  gender: PropTypes.string,
  avatar: PropTypes.string,
  hideDetails: PropTypes.bool,  // deprecated
  showBarcode: PropTypes.bool,
  showDetails: PropTypes.bool,
  showSummary: PropTypes.bool,
  showName: PropTypes.bool,
  overflowY: PropTypes.string,
  style: PropTypes.object,
  defaultAvatar: PropTypes.string,
  avatarUrlHostname: PropTypes.string,
  cardMediaWidth: PropTypes.string
};
PatientCard.defaultProps = {
  showBarcode: false,
  showDetails: true,
  showSummary: false,
  showName: true,
  avatarUrlHostname: '',
  cardMediaWidth: '300px'
}

export default PatientCard;
