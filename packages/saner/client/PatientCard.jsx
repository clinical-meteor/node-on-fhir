/**
 * Copyright © 2015-2016 Symptomatic, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { 
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  TextField
} from '@material-ui/core';

import _ from 'lodash';
let get = _.get;
let set = _.set;

import moment from 'moment';

import { StyledCard } from 'material-fhir-ui';

import { makeStyles, useTheme } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));



function PatientCard(props){
  console.log('PatientCard v0.7.22')


  //-------------------------------------------------------
  // Effect

  // if(typeof props.useEffect === "function"){
  //   useEffect(props.useEffect(props.patient))
  // }  

  //-------------------------------------------------------
  // Component Props

  let { patient, zDepth, overflowY, className, ...otherProps } = props;

  //-------------------------------------------------------
  // Component State

  let [fullName, setFullName] = useState(props.fullName);
  let [givenName, setGivenName] = useState(props.givenName);
  let [familyName, setFamilyName] = useState(props.familyName);
  let [gender, setGender] = useState(props.gender);
  let [email, setEmail] = useState(props.email);
  let [birthDate, setBirthDate] = useState(props.birthDate);
  let [avatar, setAvatar] = useState(props.avatar);
  let [identifier, setIdentifier] = useState(props.identifier);
  let [active, setActive] = useState(props.active);
  
  if(patient){
    setFullName(get(patient, 'name[0].text', ''));
    setGivenName(get(patient, 'name[0].given[0]', ''));
    setGender(get(patient, 'gender', ''));
    setEmail(get(patient, 'contact[0].value', ''));
    setBirthDate(get(patient, 'birthDate', ''));
    setAvatar(get(patient, 'photo[0].url', ''));
    setIdentifier(get(patient, 'identifier[0].value', ''));
    setActive(get(patient, 'active', ''));

    if(Array.isArray(get(patient, 'name[0].family'))){
      setFamilyName(get(patient, 'name[0].family[0]', ''));        
    } else {
      setFamilyName(get(patient, 'name[0].family', ''));        
    }
  } 

  //-------------------------------------------------------
  // Theming


  const classes = useStyles();
  const theme = useTheme();

  const style = {
    avatar: {
        position: 'absolute',
        zIndex: 10,
        transition: '1s',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    }, 
    photo: {
        position: 'absolute',
        height: '160px',
        width: '160px',
        left: '-20px',
        top: '-10px',       
        zIndex: 10 
    },
    title: {
        left: '160px'
    },
    synopsis: {
        marginLeft: '160px',
        position: 'relative',
        top: '0px'
    },
    content: {
      marginLeft: '0px',
      position: 'relative'
    },
    patientCard: {
      overflowY: 'none'
    },
    patientCardSpace: {
      position: 'relative'
    }
  }

  //-------------------------------------------------------
  // Helper Functions

  function assemblePatient(){
    let newPatient = {
      resourceType: "Patient",
      active: active,
      gender: gender,
      name: [{
        text: fullName,
        given: [givenName],
        family: familyName
      }],
      identifier: [{
        value: identifier
      }],
      contact: [{
        value: email
      }],
      photo: [{
        url: avatar
      }]
    }

    if(birthDate){
      newPatient.birthDate = birthDate;
    }

    return newPatient;
  }
  function emitPatientChange(){
    if(typeof props.onPatientChange === "function"){
      props.onPatientChange(assemblePatient())
    }
  }
  

  function handleSetGivenName(event){
    console.log('Updating given name.', event.target.value)

    setGivenName(event.target.value)
    emitPatientChange();
  }
  
  function handleSetFamilyName(event){
    console.log('Updating family name.', event.target.value);

    setFamilyName(event.target.value)
    emitPatientChange();
  }
  function handleSetBirthDate(event){
    console.log('Updating birthdate name.', event.target.value);

    setBirthDate(event.target.value)
    emitPatientChange();
  }
  function handleSetGender(event){
    console.log('Updating gender name.', event.target.value);

    setGender(event.target.value)
    emitPatientChange();
  }
  function handleSetAvatar(event){
    console.log('Updating avatar name.', event.target.value);

    setAvatar(event.target.value)
    emitPatientChange();
  }
  


  //-------------------------------------------------------
  // Rendering

  console.log('PatientCard.assemblePatient', assemblePatient())


  let cardMedia;
  if(avatar){
    style.synopsis.marginLeft = '160px';
    cardMedia = <CardMedia
      className={classes.cover}
      image={avatar}
    />
  } else {
    style.synopsis.marginLeft = '0px';
  }


  let details;
    if(props.hideDetails){
      details = <Typography color="textSecondary">
        MRN: { identifier } DOB:  { moment(birthDate).format("MMM DD, YYYY") } Gender: { gender } 
      </Typography>
    } else {
      details = <div id='profileDemographicsPane' style={{position: 'relative'}}>
        <Grid container style={ style.synopsis} spacing={3} >
          <Grid item md={6}>
            <TextField
              id='givenNameInput'
              name='given'
              type='text'
              label='Given Name'
              value={ givenName }        
              onChange={ handleSetGivenName.bind(this) }                   
              fullWidth
              /><br/>
          </Grid>
          <Grid item md={6}>
            <TextField
              id='familyNameInput'
              name='family'
              type='text'
              label='Family Name'
              value={ familyName }         
              onChange={ handleSetFamilyName.bind(this) }                   
              fullWidth
              /><br/>
          </Grid>
        </Grid>
        <Grid container style={ style.synopsis } spacing={3}>
          <Grid item md={4}>
            <TextField
              id='birthDateInput'
              name='birthDate'
              type={ birthDate ? 'date' : 'text' }    
              label='Date of Birth'
              value={ moment(birthDate).format('YYYY-MM-DD') }       
              onChange={ handleSetBirthDate.bind(this) }    
              InputLabelProps={{ shrink: true }}                                           
              fullWidth
              /><br/>
          </Grid>
          <Grid item md={2}>
            <TextField
              id='genderInput'
              name='gender'
              type='text'
              label='Gender'
              value={ gender }         
              onChange={ handleSetGender.bind(this) }                   
              fullWidth
              /><br/>

          </Grid>
          <Grid item md={6}>
            <TextField
              id='avatarInput'
              name='avatar'
              type='text'
              label='Avatar'
              value={ avatar }         
              onChange={ handleSetAvatar.bind(this) }                   
              fullWidth
              /><br/>

          </Grid>
        </Grid>
      </div>
    }


  let header;
  let subheaderText = '';
  if(fullName > 0){
    if(birthDate ){
      subheaderText = birthDate;
    }
    if(gender ){
      subheaderText = gender;
    }
    if(fullName & gender){
      subheaderText = birthDate + ', ' + gender;
    }
    header = <CardHeader
      title={ fullName }
      subheader={ subheaderText }
      style={ style.title }
    />
  }

  let titleElements;
  titleElements = <CardHeader title={props.title} />



  return(
    <div className='patientCard'>
      <StyledCard style={{marginTop: '20px'}}>
        { titleElements }
        { header }
        
        <div className={classes.details}>
          <CardContent style={style.content}>
            { details }
            
          </CardContent>
        </div>
        {/* { cardMedia } */}
      </StyledCard>
    </div>
  );
}


PatientCard.propTypes = {
  patient: PropTypes.object,
  multiline: PropTypes.bool,
  fullName: PropTypes.string,
  familyName: PropTypes.string,
  givenName: PropTypes.string,
  identifier: PropTypes.string,
  email: PropTypes.string,
  active: PropTypes.bool,
  title: PropTypes.string,
  birthDate: PropTypes.string,
  gender: PropTypes.string,
  avatar: PropTypes.string,
  hideDetails: PropTypes.bool,
  overflowY: PropTypes.string,
  style: PropTypes.object,
  defaultAvatar: PropTypes.string,
  onPatientChange: PropTypes.func,
  useEffect: PropTypes.func
};
PatientCard.defaultProps = {
  active: true,
  fullName: '',
  givenName: '',
  familyName: '',
  gender: '',
  email: '',
  birthDate: '',
  avatar: '',
  identifier: '',
  title: "New Patient",
  useEffect: null
}

export default PatientCard;
