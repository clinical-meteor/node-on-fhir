import React from 'react';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';

import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import { get, has } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';
import JSON5 from 'json5';

import moment from 'moment';

import {github} from 'react-icons-kit/icomoon/github'
import { Icon } from 'react-icons-kit'

import { PageCanvas, StyledCard, PatientTable } from 'material-fhir-ui';
import { useTracker } from './Tracker';

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
  githubIcon: {
    margin: '0px'
  },
}));

//==============================================================================================
// MAIN COMPONENT

function SanerAboutDialog(props){

  const classes = useStyles();
  

    

  return (
    <DialogContent dividers={scroll === 'paper'} style={{minWidth: '600px', fontSize: '120%', marginBottom: '20px'}}>
      This project implements the <a href="https://github.com/AudaciousInquiry/saner-ig">Situation Awareness for Novel Epidemic Response</a> Implementation Guide from HL7 International, and has been submitted to the <a href="https://datavant.com/pandemic-response-hackathon/">Datavant Pandemic Response Hackathon</a> and the <a href="https://covid19challenge.mit.edu/">MIT Covid19 Challenge</a>.  This demo site is using SYNTHETIC data generated with the Synthea Covid19 module.  It does not store data anywhere.  
      <br /><br />

      <hr />
      <div style={{width: '100%', textAlign: 'center'}}>
        {/* <h2 style={{marginBottom: '0px'}}>Zoom Controls</h2> */}
        <h4>Please use ⌘+ and ⌘- to zoom in and out.</h4>
      </div>
      <hr />
      <div style={{width: '100%', textAlign: 'center', marginBottom: '20px'}}>
        <h4 style={{maring: '0px'}}>Participate / Get the Source Code</h4>
        <a href="https://github.com/symptomatic/covid19-geomapping"><Icon icon={github} className={classes.githubIcon} size={54} /></a>
      </div>

      <hr />
      <h4 style={{marginBottom: '0px'}}>Team / Acknowledgements</h4>
      <br />
      <Table size="small" >
        <TableBody>
          <TableRow>
            <TableCell>Abigail Watson</TableCell>
            <TableCell>Principle Investigator</TableCell>
            <TableCell>Symptomatic, LLC</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jason Walonoski</TableCell>
            <TableCell>Bioinformatics</TableCell>
            <TableCell>Synthea</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>James Agnew</TableCell>
            <TableCell>FHIR Server / Data Hosting</TableCell>
            <TableCell>Smile CDR</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Chris Hafey</TableCell>
            <TableCell>DBA Backup</TableCell>
            <TableCell>Nucleus.io</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Andrei Rusu</TableCell>
            <TableCell>Quality Control Systems</TableCell>
            <TableCell>Nightwatch.js</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Sarah Sims</TableCell>
            <TableCell>Business Sponsorship</TableCell>
            <TableCell>Patient Insight</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Keith Boone</TableCell>
            <TableCell>Sponsor</TableCell>
            <TableCell>Audacious Inquiry</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Michael Donnelley</TableCell>
            <TableCell>Measure Provider</TableCell>
            <TableCell>Epic</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Andrea Pitkus </TableCell>
            <TableCell>Laboratory Informatics</TableCell>
            <TableCell>University of Wisconsin</TableCell>
          </TableRow>     
          <TableRow>
            <TableCell>Gino Canessa</TableCell>
            <TableCell>Measure Provider</TableCell>
            <TableCell>Microsoft</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Reece Adamson </TableCell>
            <TableCell>Conformance Testing</TableCell>
            <TableCell>MITRE</TableCell>
          </TableRow>          
          <TableRow>
            <TableCell>John Moehrke </TableCell>
            <TableCell>Security & Workflow</TableCell>
            <TableCell>HL7 / ByLight</TableCell>
          </TableRow>       
        </TableBody>
      </Table>
    </DialogContent>
  );
}




export default SanerAboutDialog;