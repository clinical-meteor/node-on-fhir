import React from 'react';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import { get, has } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';
import JSON5 from 'json5';

import moment from 'moment';

import { PageCanvas, StyledCard, PatientTable } from 'material-fhir-ui';
import { useTracker } from './Tracker';


import { Icon } from 'react-icons-kit';
import { github } from 'react-icons-kit/fa/github';

function DynamicSpacer(props){
  return <br className="dynamicSpacer" style={{height: '40px'}}/>;
}

//==============================================================================================
// THEMING

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1)
  },
  hero_button: {
    width: '100%', 
    marginTop: '20px', 
    marginBottom: '20px',
    textAlign: 'left'
  }
}));

//==============================================================================================
// MAIN COMPONENT


function TermsAndConditionsPage(props){

  const classes = useStyles();
  
  let containerStyle = {
    paddingLeft: '100px',
    paddingRight: '100px',
    marginBottom: '100px'
  };

  let headerHeight = 84;
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    headerHeight = 148;
  }  

  return (
    <PageCanvas id='infoPage' headerHeight={headerHeight} >
      <Container maxWidth="lg" style={{paddingBottom: '80px'}}>
        <StyledCard>
          <CardHeader 
            title="Terms and Conditions" 
            subheader="Copyright 2020, Symptomatic, LLC"
            style={{fontSize: '100%'}} />
          <CardContent style={{fontSize: '120%'}}>
            <h4>End-User License Agreement (EULA) of Pandemic Maps</h4>
                      
            <p>This End-User License Agreement ("EULA") is a legal agreement between you and Symptomatic, LLC. Our EULA was created by EULA Template for Pandemic Maps.</p>

            <p>This EULA agreement governs your acquisition and use of our Pandemic Maps software ("Software") directly from Symptomatic, LLC or indirectly through a Symptomatic, LLC authorized reseller or distributor (a "Reseller"). Our Privacy Policy was created by the Privacy Policy Generator.</p>

            <p>Please read this EULA agreement carefully before completing the installation process and using the Pandemic Maps software. It provides a license to use the Pandemic Maps software and contains warranty information and liability disclaimers.</p>

            <p>If you register for a free trial of the Pandemic Maps software, this EULA agreement will also govern that trial. By clicking "accept" or installing and/or using the Pandemic Maps software, you are confirming your acceptance of the Software and agreeing to become bound by the terms of this EULA agreement.</p>

            <p>If you are entering into this EULA agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity and its affiliates to these terms and conditions. If you do not have such authority or if you do not agree with the terms and conditions of this EULA agreement, do not install or use the Software, and you must not accept this EULA agreement.</p>

            <p>This EULA agreement shall apply only to the Software supplied by Symptomatic, LLC herewith regardless of whether other software is referred to or described herein. The terms also apply to any Symptomatic, LLC updates, supplements, Internet-based services, and support services for the Software, unless other terms accompany those items on delivery. If so, those terms apply.</p>

            <h4>License Grant</h4>
            <p>Symptomatic, LLC hereby grants you a personal, non-transferable, non-exclusive licence to use the Pandemic Maps software on your devices in accordance with the terms of this EULA agreement.</p>

            <p>You are permitted to load the Pandemic Maps software (for example a PC, laptop, mobile or tablet) under your control. You are responsible for ensuring your device meets the minimum requirements of the Pandemic Maps software.</p>

            <p>You are not permitted to:</p>

            <ul>
              <li>Edit, alter, modify, adapt, translate or otherwise change the whole or any part of the Software nor permit the whole or any part of the Software to be combined with or become incorporated in any other software, nor decompile, disassemble or reverse engineer the Software or attempt to do any such things</li>
              <li>Reproduce, copy, distribute, resell or otherwise use the Software for any commercial purpose</li>
              <li>Allow any third party to use the Software on behalf of or for the benefit of any third party</li>
              <li>Use the Software in any way which breaches any applicable local, national or international law</li>
              <li>use the Software for any purpose that Symptomatic, LLC considers is a breach of this EULA agreement</li>
            </ul>

            <h4>Intellectual Property and Ownership</h4>
            <p>Symptomatic, LLC shall at all times retain ownership of the Software as originally downloaded by you and all subsequent downloads of the Software by you. The Software (and the copyright, and other intellectual property rights of whatever nature in the Software, including any modifications made thereto) are and shall remain the property of Symptomatic, LLC.</p>

            <p>Symptomatic, LLC reserves the right to grant licences to use the Software to third parties.</p>

            <h4>Termination</h4>
            <p>This EULA agreement is effective from the date you first use the Software and shall continue until terminated. You may terminate it at any time upon written notice to Symptomatic, LLC.</p>

            <p>It will also terminate immediately if you fail to comply with any term of this EULA agreement. Upon such termination, the licenses granted by this EULA agreement will immediately terminate and you agree to stop all access and use of the Software. The provisions that by their nature continue and survive will survive any termination of this EULA agreement.</p>

            <h4>Governing Law</h4>
            <p>This EULA agreement, and any dispute arising out of or in connection with this EULA agreement, shall be governed by and construed in accordance with the laws of us.</p>


          </CardContent>
        </StyledCard>     

        {/* <Button variant="contained" color="primary" className={classes.hero_button} href="https://github.com/symptomatic/node-on-fhir" >
          <Icon icon={github} size={48} /><CardHeader title="Download the Code" />
        </Button> */}

      </Container>
    </PageCanvas>
  );
}

export default TermsAndConditionsPage;