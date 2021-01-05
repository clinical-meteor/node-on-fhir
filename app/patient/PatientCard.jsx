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
  TextField
} from '@material-ui/core';

import _ from 'lodash';
let get = _.get;
let set = _.set;

import { makeStyles, useTheme } from '@material-ui/styles';

import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import logger from '../Logger';


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
  logger.info('Rendering the PatientCard');
  logger.verbose('app.patientPatientCard');
  logger.data('PatientCard.props', {data: props}, {source: "PatientCard.jsx"});

  let { patient, displayName, ...otherProps } = props;

  let fullName = FhirUtilities.pluckName(patient); 

  let familyName = get(patient, 'name[0].family[0]', '');        
  let givenName = get(patient, 'name[0].given[0]', '');
  let email = FhirUtilities.pluckEmail(get(patient, 'telecom'))
  let phone = FhirUtilities.pluckPhone(get(patient, 'telecom'))
  let birthdate = get(patient, 'birthDate', '');
  let gender = get(patient, 'gender', '');
  let avatar = get(patient, 'photo[0].url', '');
  let identifier = get(patient, 'identifier[0].value', '');
  let address = FhirUtilities.stringifyAddress(get(patient, 'address[0]'));

  const classes = useStyles();
  const theme = useTheme();

  let textFieldStyle = {
    paddingBottom: '20px'
  }

  let cardHeader;
  if(displayName){
    cardHeader = <CardHeader title={fullName} />
  }
  let cardMedia;
  if(avatar){
    cardMedia = <CardMedia
      className={classes.cover}
      image={avatar}
    />
  }


  let cardContent;
  if(patient){
    cardContent = <Card>
        { cardHeader }
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <TextField
              name='Identifier'
              type='text'
              label='Identifier'
              value={ identifier } 
              fullWidth
              style={textFieldStyle}
            />
            <TextField
              name='Birthdate'
              type='text'
              label='Birthdate'
              value={ birthdate } 
              fullWidth
              style={textFieldStyle}
            />
            <TextField
              name='Gender'
              type='text'
              label='Gender'
              value={ gender } 
              fullWidth
              style={textFieldStyle}
            />
            <TextField
              name='Email'
              type='text'
              label='Email'
              value={ email } 
              fullWidth
              style={textFieldStyle}
            />
            <TextField
              name='Phone'
              type='text'
              label='Phone'
              value={ phone } 
              fullWidth
              style={textFieldStyle}
            />
            <TextField
              name='Address'
              type='text'
              label='Address'
              value={ address } 
              fullWidth
              style={textFieldStyle}
            />
          </CardContent>
        </div>
        { cardMedia }
        
    </Card>
  } else {
    cardContent = <Card style={{minHeight: '200px', marginBottom: '40px'}} disabled >
      <CardContent style={{fontSize: '100%', paddingBottom: '28px', paddingTop: '50px', textAlign: 'center'}}>
        <CardHeader 
          title="Patient Demographics Unavailable"       
          subheader="Please select a patient."
          style={{fontSize: '100%', whiteSpace: 'nowrap'}} />            
      </CardContent>
    </Card>
  }

  return(
    <div className='patientCard'>
      { cardContent }
    </div>
  );
}


PatientCard.propTypes = {
  patient: PropTypes.object,
  avatar: PropTypes.string,
  displayName: PropTypes.bool
};
PatientCard.defaultProps = {
  displayName: true
}

export default PatientCard;
