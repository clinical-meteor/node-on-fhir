


import { Meteor } from 'meteor/meteor';
import { get } from 'lodash';

import MedicalRecordImporter from '../lib/MedicalRecordImporter';
import read from 'read-directory';

import {
    CarePlans,
    Conditions,
    Devices,
    DiagnosticReports,
    Encounters,
    ExplanationOfBenefits,
    Medications,
    Observations,
    Patients,
    Procedures
} from 'meteor/clinical:hl7-fhir-data-infrastructure';

Meteor.methods({
    scanDirectory: function(dirPath){
        console.log('Scanning directory: ' + dirPath)

        read(dirPath, Meteor.bindEnvironment(function (err, contents) {
            let count = 0;
            Object.keys(contents).forEach(function(key){
                console.log(count + ":  " + key)

                MedicalRecordImporter.importBundle(contents[key]);
                count++;
            })
        }))  
    },
    dropDatabase: function(){
        console.log("Droping the database.  Clearing everything out.")

        CarePlans.remove({});
        Conditions.remove({});
        Devices.remove({});
        DiagnosticReports.remove({});
        Encounters.remove({});
        ExplanationOfBenefits.remove({});
        Medications.remove({});
        Observations.remove({});
        Patients.remove({});
        Procedures.remove({});
    }
})