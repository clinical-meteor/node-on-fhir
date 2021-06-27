

import { get } from 'lodash';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { Measures, MeasureReports } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import screeningMeasure from '../data/measures/Measure-ScreeningRate-example';
import totalVentilatorsMeasure from '../data/measures/Measure-TotalVentilators';
import cdcMeasure from '../data/measures/Measures-CDC';
import femaMeasure from '../data/measures/Measures-FEMA';

import CDCHealthcareSupplyPathway from '../data/measures/CDCHealthcareSupplyPathway';
import CDCHealthcareWorkerStaffingPathway from '../data/measures/CDCHealthcareWorkerStaffingPathway';
import CDCPatientImpactAndHospitalCapacity from '../data/measures/CDCPatientImpactAndHospitalCapacity';
import ComputableCDCPatientImpactAndHospitalCapacity from '../data/measures/ComputableCDCPatientImpactAndHospitalCapacity';
import ComputableFEMADailyHospitalCOVID19Reporting from '../data/measures/ComputableFEMADailyHospitalCOVID19Reporting';
import FEMADailyHospitalCOVID19Reporting from '../data/measures/FEMADailyHospitalCOVID19Reporting';
import HHSProtectCaresActLabReport from '../data/measure-reports/CaresAct-HHS-LaboratoryReport';

import totalVentilatorsMeasureReport from '../data/measure-reports/MeasureReport-TotalVentilators';

import org1065cdc from '../data/measure-reports/Org-1065-measureReports-CDC';
import org1065fema from '../data/measure-reports/Org-1065-measureReports-FEMA';
import org1107cdc from '../data/measure-reports/Org-1107-measureReports-CDC';
import org1107fema from '../data/measure-reports/Org-1107-measureReports-FEMA';
import org2127cdc from '../data/measure-reports/Org-2127-measureReports-CDC';
import org2127fema from '../data/measure-reports/Org-2127-measureReports-FEMA';
import org2207cdc from '../data/measure-reports/Org-2207-measureReports-CDC';
import org2207fema from '../data/measure-reports/Org-2207-measureReports-FEMA';
import org3046cdc from '../data/measure-reports/Org-3046-measureReports-CDC';
import org3046fema from '../data/measure-reports/Org-3046-measureReports-FEMA';
import org3474cdc from '../data/measure-reports/Org-3474-measureReports-CDC';
import org3474fema from '../data/measure-reports/Org-3474-measureReports-FEMA';
import org3813cdc from '../data/measure-reports/Org-3813-measureReports-CDC';
import org3813fema from '../data/measure-reports/Org-3813-measureReports-FEMA';
import org5259cdc from '../data/measure-reports/Org-5259-measureReports-CDC';
import org5259fema from '../data/measure-reports/Org-5259-measureReports-FEMA';
import org5610cdc from '../data/measure-reports/Org-5610-measureReports-CDC';
import org5610fema from '../data/measure-reports/Org-5610-measureReports-FEMA';
import org5763cdc from '../data/measure-reports/Org-5763-measureReports-CDC';
import org5763fema from '../data/measure-reports/Org-5763-measureReports-FEMA';

import mr1 from '../data/measure-reports/ExampleNJ-20200404-CDCPatientImpactAndHospitalCapacity';
import mr2 from '../data/measure-reports/ExampleNJ-20200404-FEMADailyHospitalCOVID19Reporting';
import mr3 from '../data/measure-reports/ExampleNJ-20200405-CDCPatientImpactAndHospitalCapacity';
import mr4 from '../data/measure-reports/ExampleNJ-20200405-FEMADailyHospitalCOVID19Reporting';
import mr5 from '../data/measure-reports/ExampleNJ-20200406-CDCPatientImpactAndHospitalCapacity';
import mr6 from '../data/measure-reports/ExampleNJ-20200406-FEMADailyHospitalCOVID19Reporting';
import mr7 from '../data/measure-reports/ExampleNJ-20200407-CDCPatientImpactAndHospitalCapacity';
import mr8 from '../data/measure-reports/ExampleNJ-20200407-FEMADailyHospitalCOVID19Reporting';
import mr9 from '../data/measure-reports/ExampleNJ-20200408-CDCPatientImpactAndHospitalCapacity';
import mr10 from '../data/measure-reports/ExampleNJ-20200408-FEMADailyHospitalCOVID19Reporting';
import mr11 from '../data/measure-reports/ExampleNJ-20200409-CDCPatientImpactAndHospitalCapacity';
import mr12 from '../data/measure-reports/ExampleNJ-20200409-FEMADailyHospitalCOVID19Reporting';
import mr13 from '../data/measure-reports/ExampleNJ-20200410-CDCPatientImpactAndHospitalCapacity';
import mr14 from '../data/measure-reports/ExampleNJ-20200410-FEMADailyHospitalCOVID19Reporting';
import mr15 from '../data/measure-reports/ExampleNJ-20200411-CDCPatientImpactAndHospitalCapacity';
import mr16 from '../data/measure-reports/ExampleNJ-20200411-FEMADailyHospitalCOVID19Reporting';
import mr17 from '../data/measure-reports/ExampleNJ-20200412-CDCPatientImpactAndHospitalCapacity';
import mr18 from '../data/measure-reports/ExampleNJ-20200412-FEMADailyHospitalCOVID19Reporting';
import mr19 from '../data/measure-reports/ExampleNJ-20200413-CDCPatientImpactAndHospitalCapacity';
import mr20 from '../data/measure-reports/ExampleNJ-20200413-FEMADailyHospitalCOVID19Reporting';
import mr21 from '../data/measure-reports/ExampleNJ-20200414-CDCPatientImpactAndHospitalCapacity';
import mr22 from '../data/measure-reports/ExampleNJ-20200414-FEMADailyHospitalCOVID19Reporting';
import mr23 from '../data/measure-reports/ExampleNJ-20200415-CDCPatientImpactAndHospitalCapacity';
import mr24 from '../data/measure-reports/ExampleNJ-20200415-FEMADailyHospitalCOVID19Reporting';
import mr25 from '../data/measure-reports/ExampleNJ-20200416-CDCPatientImpactAndHospitalCapacity';
import mr26 from '../data/measure-reports/ExampleNJ-20200416-FEMADailyHospitalCOVID19Reporting';
import mr27 from '../data/measure-reports/ExampleNJ-20200417-CDCPatientImpactAndHospitalCapacity';
import mr28 from '../data/measure-reports/ExampleNJ-20200417-FEMADailyHospitalCOVID19Reporting';
import mr29 from '../data/measure-reports/ExampleNJ-20200418-CDCPatientImpactAndHospitalCapacity';
import mr30 from '../data/measure-reports/ExampleNJ-20200418-FEMADailyHospitalCOVID19Reporting';
import mr31 from '../data/measure-reports/ExampleNJ-20200419-CDCPatientImpactAndHospitalCapacity';
import mr32 from '../data/measure-reports/ExampleNJ-20200419-FEMADailyHospitalCOVID19Reporting';
import mr33 from '../data/measure-reports/ExampleNJ-20200420-CDCPatientImpactAndHospitalCapacity';
import mr34 from '../data/measure-reports/ExampleNJ-20200420-FEMADailyHospitalCOVID19Reporting';
import mr35 from '../data/measure-reports/ExampleNJ-20200421-CDCPatientImpactAndHospitalCapacity';
import mr36 from '../data/measure-reports/ExampleNJ-20200421-FEMADailyHospitalCOVID19Reporting';
import mr37 from '../data/measure-reports/ExampleNJ-20200422-CDCPatientImpactAndHospitalCapacity';
import mr38 from '../data/measure-reports/ExampleNJ-20200422-FEMADailyHospitalCOVID19Reporting';
import mr39 from '../data/measure-reports/ExampleNJ-20200423-CDCPatientImpactAndHospitalCapacity';
import mr40 from '../data/measure-reports/ExampleNJ-20200423-FEMADailyHospitalCOVID19Reporting';
import mr41 from '../data/measure-reports/ExampleNJ-20200424-CDCPatientImpactAndHospitalCapacity';
import mr42 from '../data/measure-reports/ExampleNJ-20200424-FEMADailyHospitalCOVID19Reporting';
import mr43 from '../data/measure-reports/ExampleNJ-20200425-CDCPatientImpactAndHospitalCapacity';
import mr44 from '../data/measure-reports/ExampleNJ-20200425-FEMADailyHospitalCOVID19Reporting';




import MedicareHospitals from '../data/organizations/MedicareHospitals';

let validationConfig = get(Meteor, 'settings.private.fhir.schemaValidation', {validate: false, filter: false});
ReportingMethods = {
  initializeMedicareInpatientFacilities: function(){
    if(MedicareHospitals){
      if(get(MedicareHospitals, 'entry')){
        MedicareHospitals.entry.forEach(function(entry){
          if(get(entry, 'resource.resourceType') === "Organization"){
            // Organizations.upsert({id: get(entry, 'resource.id')}, {$set: get(entry, 'resource')}, validationConfig)
                  
            if(Organizations.findOne({id: get(entry, 'resource.id')})){
              delete entry.resource._id;
              Organizations.update({id: get(entry, 'resource.id')}, {$set: get(entry, 'resource')}, validationConfig);                                            
            } else {
              delete entry.resource._id;
              Organizations.insert(get(entry, 'resource'), validationConfig);                              
            }

          }
        })
      }
    } 
  },
  initializeSampleMeasures: function(){
    console.log('Initializing sample measures...');

    ReportingMethods.ingestMeasure(screeningMeasure);
    ReportingMethods.ingestMeasure(totalVentilatorsMeasure);

    ReportingMethods.ingestMeasure(cdcMeasure);
    ReportingMethods.ingestMeasure(femaMeasure);

    ReportingMethods.ingestMeasure(CDCHealthcareSupplyPathway);
    ReportingMethods.ingestMeasure(CDCHealthcareWorkerStaffingPathway);
    ReportingMethods.ingestMeasure(CDCPatientImpactAndHospitalCapacity);
    ReportingMethods.ingestMeasure(ComputableCDCPatientImpactAndHospitalCapacity);
    ReportingMethods.ingestMeasure(ComputableFEMADailyHospitalCOVID19Reporting);
    ReportingMethods.ingestMeasure(FEMADailyHospitalCOVID19Reporting);

    // ReportingMethods.ingestMeasure(HHSProtectCaresActLabReport);
    
  },
  initializeSampleMeasureReports: function(){
    ReportingMethods.ingestMeasureReport(mr1);
    ReportingMethods.ingestMeasureReport(mr2);
    ReportingMethods.ingestMeasureReport(mr3);
    ReportingMethods.ingestMeasureReport(mr4);
    ReportingMethods.ingestMeasureReport(mr5);
    ReportingMethods.ingestMeasureReport(mr6);
    ReportingMethods.ingestMeasureReport(mr7);
    ReportingMethods.ingestMeasureReport(mr8);
    ReportingMethods.ingestMeasureReport(mr9);
    ReportingMethods.ingestMeasureReport(mr10);
    ReportingMethods.ingestMeasureReport(mr11);
    ReportingMethods.ingestMeasureReport(mr12);
    ReportingMethods.ingestMeasureReport(mr13);
    ReportingMethods.ingestMeasureReport(mr14);
    ReportingMethods.ingestMeasureReport(mr15);
    ReportingMethods.ingestMeasureReport(mr16);
    ReportingMethods.ingestMeasureReport(mr17);
    ReportingMethods.ingestMeasureReport(mr18);
    ReportingMethods.ingestMeasureReport(mr19);
    ReportingMethods.ingestMeasureReport(mr20);
    ReportingMethods.ingestMeasureReport(mr21);
    ReportingMethods.ingestMeasureReport(mr22);
    ReportingMethods.ingestMeasureReport(mr23);
    ReportingMethods.ingestMeasureReport(mr24);
    ReportingMethods.ingestMeasureReport(mr25);
    ReportingMethods.ingestMeasureReport(mr26);
    ReportingMethods.ingestMeasureReport(mr27);
    ReportingMethods.ingestMeasureReport(mr28);
    ReportingMethods.ingestMeasureReport(mr29);
    ReportingMethods.ingestMeasureReport(mr30);
    ReportingMethods.ingestMeasureReport(mr31);
    ReportingMethods.ingestMeasureReport(mr32);
    ReportingMethods.ingestMeasureReport(mr33);
    ReportingMethods.ingestMeasureReport(mr34);
    ReportingMethods.ingestMeasureReport(mr35);
    ReportingMethods.ingestMeasureReport(mr36);
    ReportingMethods.ingestMeasureReport(mr37);
    ReportingMethods.ingestMeasureReport(mr38);
    ReportingMethods.ingestMeasureReport(mr39);
    ReportingMethods.ingestMeasureReport(mr40);
    ReportingMethods.ingestMeasureReport(mr41);
    ReportingMethods.ingestMeasureReport(mr42);
    ReportingMethods.ingestMeasureReport(mr43);
    ReportingMethods.ingestMeasureReport(mr44);

    ReportingMethods.ingestMeasureReport(totalVentilatorsMeasureReport);

    ReportingMethods.ingestMeasureReport(org1065cdc);
    ReportingMethods.ingestMeasureReport(org1065fema);
    ReportingMethods.ingestMeasureReport(org1107cdc);
    ReportingMethods.ingestMeasureReport(org1107fema);
    ReportingMethods.ingestMeasureReport(org2127cdc);
    ReportingMethods.ingestMeasureReport(org2127fema);
    ReportingMethods.ingestMeasureReport(org2207cdc);
    ReportingMethods.ingestMeasureReport(org2207fema);
    ReportingMethods.ingestMeasureReport(org3046cdc);
    ReportingMethods.ingestMeasureReport(org3046fema);
    ReportingMethods.ingestMeasureReport(org3474cdc);
    ReportingMethods.ingestMeasureReport(org3813cdc);
    ReportingMethods.ingestMeasureReport(org3813fema);
    ReportingMethods.ingestMeasureReport(org5259cdc);
    ReportingMethods.ingestMeasureReport(org5259fema);
    ReportingMethods.ingestMeasureReport(org5610cdc);
    ReportingMethods.ingestMeasureReport(org5610fema);
    ReportingMethods.ingestMeasureReport(org5763cdc);
    ReportingMethods.ingestMeasureReport(org5763cdc);
  },
  initializeHhsSampleMeasureReports: function(){
    console.log('Initializing HHS sample measures...');

    let numReportsToCreate = 10;
    for (let index = 0; index < numReportsToCreate; index++) {
      
      let newReport = HHSProtectCaresActLabReport;
      newReport.id = get(HHSProtectCaresActLabReport, 'id') + "-" + index;
      newReport.date = moment().subtract(index, 'days').format("YYYY-MM-DD")
      newReport.period.end = moment().subtract(index, 'days').format("YYYY-MM-DD")
      newReport.period.start = moment().subtract(index + 1, 'days').format("YYYY-MM-DD")
      
      ReportingMethods.ingestMeasureReport(newReport);
    }
  },
  ingestMeasure: function(record){
    console.log('Ingesting file...')
    if(get(record, 'resourceType') === "Bundle"){
      console.log('Found a Bundle...')
      if(Array.isArray(get(record, 'entry'))){
        record.entry.forEach(function(entry){
          if(get(entry, 'resource.resourceType') === "Measure"){
            if(Measures.findOne({id: get(entry, 'resource.id')})){
              delete entry.resource._id;
              Measures.update({id: get(entry, 'resource.id')}, {$set: get(entry, 'resource')}, validationConfig);                                            
            } else {
              delete entry.resource._id;
              Measures.insert(get(entry, 'resource'), validationConfig);                              
            }
          }
        });
      }

    } else if(get(record, 'resourceType') === "Measure"){
      console.log('Found a Measure...')
      
      if(Measures.findOne({id: get(record, 'id')})){
        delete record._id;
        Measures.update({id: get(record, 'id')}, {$set: record}, validationConfig);                                            
      } else {
        delete record._id;
        Measures.insert(record, validationConfig);                              
      }
      // Measures.upsert({id: get(record, 'id')}, {$set: record}, validationConfig);                            
    }
  },
  ingestMeasureReport: function(record){
    console.log('Ingesting measure report file...')

    if(get(record, 'resourceType') === "Bundle"){
      console.log('Found a Bundle...')
      if(Array.isArray(get(record, 'entry'))){
        record.entry.forEach(function(entry){
          if(get(entry, 'resource.resourceType') === "MeasureReport"){
            if(Measures.findOne({id: get(entry, 'resource.id')})){
              delete entry.resource._id;
              Measures.update({id: get(entry, 'resource.id')}, {$set: get(entry, 'resource')}, validationConfig);                                            
            } else {
              delete entry.resource._id;
              Measures.insert(get(entry, 'resource'), validationConfig);                              
            }
            // delete entry.resource._id;
            // MeasureReports.upsert({id: get(entry, 'resource.id')}, {$set: get(entry, 'resource')}, validationConfig);      
          }
        })
      }

    } else if(get(record, 'resourceType') === "MeasureReport"){
      console.log('Found a MeasureReport...')
      if(MeasureReports.findOne({id: get(record, 'id')})){
        delete record._id;
        MeasureReports.update({id: get(record, 'id')}, {$set: record}, validationConfig);                                            
      } else {
        delete record._id;
        MeasureReports.insert(record, validationConfig);                              
      }
      // delete record._id;
      // MeasureReports.upsert({id: get(record, 'id')}, {$set: record}, validationConfig);      
    }
  }
}

export default ReportingMethods;