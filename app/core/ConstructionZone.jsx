import React, { memo, useState, useEffect, useCallback } from 'react';
import { CardHeader, CardContent, Typography, Box } from '@material-ui/core';

import { get } from 'lodash';
import { PageCanvas, StyledCard } from 'material-fhir-ui';
import { useTracker } from '../layout/Tracker';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box>{children}</Box>
    </Typography>
  );
}


let JaneDoe = {
  resourceType: "Patient",
  name: [
    {
      text: "Amelia Doe",
      family: ["Doe"],
      given: ["Amelia"]
    }
  ],
  birthDate: "Jan 31st, 1990",
  gender: "female",
  photo: [
    {
      url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Amelia-in-evening-clothes_%28cropped%29.jpg/220px-Amelia-in-evening-clothes_%28cropped%29.jpg"
    }
  ],
  contact: [
    {
      value: "janedoe@symptomatic.io",
      system: "email"
    }
  ],
  identifier: [
    {
      system: "MRN",
      value: "UC-387437483"
    }
  ]
};

function ConstructionZone(props) {
  logger.info('Rendering the ConstructionZone and associated backgrounds.');
  logger.verbose('client.app.layout.ConstructionZone');

  const { children, staticContext, ...otherProps } = props;

  const [tabIndex, setTabIndex] = useState(0);
  let [patients, setPatients] = useState([]);

  patientsCursor = useTracker(function(){
    console.log('Patients.find()', Patients.find().fetch())
    return Patients.find();
  }, []);  

  if(patientsCursor){
    patients = patientsCursor.fetch();
  }

  function handleChange(event, newValue) {
    setTabIndex(newValue);
  }

  let containerStyle = {
    paddingLeft: '100px', 
    paddingRight: '100px'
  };

  let headerHeight = 64;
  if(get(Meteor, 'settings.public.defaults.prominantHeader')){
    headerHeight = 128;
  }

  let dataCursors = [];
  if(patientsCursor){
    patients = patientsCursor.fetch();

    patients.forEach(function(patient){
      dataCursors.push({
        Patients: (typeof Patients !== "undefined") ? Patients.find({id: patient.id}).count() : 0,
        AllergyIntolerances: (typeof AllergyIntolerances !== "undefined") ? AllergyIntolerances.find({id: patient.id}).count() : 0,
        Conditions: (typeof Conditions !== "undefined") ? Conditions.find({id: patient.id}).count() : 0,
        CarePlans: (typeof CarePlans !== "undefined") ? CarePlans.find({id: patient.id}).count() : 0,
        Devices: (typeof Devices !== "undefined") ? Devices.find({id: patient.id}).count() : 0,
        Encounters: (typeof Encounters !== "undefined") ? Encounters.find({'patient.reference': 'Patient/' + patient.id}).count() : 0,
        Immunizations: (typeof Immunizations !== "undefined") ? Immunizations.find({id: patient.id}).count() : 0,
        Medications: (typeof Medications !== "undefined") ? Medications.find({id: patient.id}).count() : 0,
        MedicationOrders: (typeof MedicationOrders !== "undefined") ? MedicationOrders.find({id: patient.id}).count() : 0,
        MedicationStatements: (typeof MedicationStatements !== "undefined") ? MedicationStatements.find({id: patient.id}).count() : 0,
        Observations: (typeof Observations !== "undefined") ? Observations.find({'subject.reference': 'Patient/' + patient.id}).count() : 0,
        Organizations: (typeof Organizations !== "undefined") ? Organizations.find({id: patient.id}).count() : 0,
        Persons: (typeof Persons !== "undefined") ? Persons.find({id: patient.id}).count() : 0,
        Practitioners: (typeof Practitioners !== "undefined") ? Practitioners.find({id: patient.id}).count() : 0,
        RelatedPersons: (typeof RelatedPersons !== "undefined") ? RelatedPersons.find({id: patient.id}).count() : 0,
        Procedures: (typeof Procedures !== "undefined") ? Procedures.find({'subject.reference': 'Patient/' + patient.id}).count() : 0
      })
    })
  }

  console.log('dataCursors', dataCursors)

  return (
    // <PageCanvas id='constructionZone' headerHeight={headerHeight} >
      <StyledCard height="auto" scrollable margin={20} >
        <CardHeader title="Patients" />
        <CardContent>
          {/* <PatientTable 
            patients={patients}
            rowsPerPage={10}
            showCounts
            hideActive
            cursors={dataCursors}
          />             */}
        </CardContent>
      </StyledCard>
    // </PageCanvas>
  );
}
export default ConstructionZone;

