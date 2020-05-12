

import { get } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Measures, MeasureReports } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import screeningMeasure from '../data/measures/Measure-ScreeningRate-example';
import totalVentilatorsMeasure from '../data/measures/Measure-TotalVentilators';
import cdcMeasure from '../data/measures/Measures-CDC';
import femaMeasure from '../data/measures/Measures-FEMA';

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

import MedicareHospitals from '../data/organizations/MedicareHospitals';


ReportingMethods = {
  initializeMedicareInpatientFacilities: function(){
    if(MedicareHospitals){
      if(get(MedicareHospitals, 'entry')){
        MedicareHospitals.entry.forEach(function(entry){
          if(get(entry, 'resource.resourceType') === "Organization"){
            if(!Organizations.findOne({id: get(entry, 'resource.id')})){
              Organizations.upsert(get(entry, 'resource'), {filter: false, validate: false})
            }
          }
        })
      }
    } else {
      
    }
  },
  initializeSampleMeasures: function(){
    ReportingMethods.ingestMeasure(screeningMeasure);
    ReportingMethods.ingestMeasure(totalVentilatorsMeasure);

    ReportingMethods.ingestMeasure(cdcMeasure);
    ReportingMethods.ingestMeasure(femaMeasure);
  },
  initializeSampleMeasureReports: function(){
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
  ingestMeasure: function(record){
    if(get(record, 'resourceType') === "Bundle"){
      if(Array.isArray(get(record, 'entry'))){
        record.entry.forEach(function(entry){
          if(get(entry, 'resource.resourceType') === "Measure"){
            if(!Measures.findOne({id: get(entry, 'resource.id')})){
              Measures.insert(get(entry, 'resource'), {filter: false, validate: false});                            
            }
          }
        });
      }

    } else if(get(record, 'resourceType') === "Measure"){
      if(!Measures.findOne({id: get(record, 'id')})){
        Measures.insert(record, {filter: false, validate: false});                            
      }
    }
  },
  ingestMeasureReport: function(record){
    if(get(record, 'resourceType') === "Bundle"){
      if(Array.isArray(get(record, 'entry'))){
        record.entry.forEach(function(entry){
          if(get(entry, 'resource.resourceType') === "MeasureReport"){
            if(!Measures.findOne({id: get(entry, 'resource.id')})){
              MeasureReports.insert(get(entry, 'resource'), {filter: false, validate: false});      
            }
          }
        })
      }

    } else if(get(record, 'resourceType') === "MeasureReport"){
      if(!Measures.findOne({id: get(record, 'id')})){
        MeasureReports.insert(record, {filter: false, validate: false});      
      }
    }
  }
}

export default ReportingMethods;