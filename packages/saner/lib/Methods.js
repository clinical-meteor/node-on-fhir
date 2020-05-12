import ReportingMethods from '../lib/ReportingMethods';
import { Meteor } from 'meteor/meteor';

Meteor.methods({
  initializeSampleMeasures: function(){
    console.log('Initializing sample measures....')
    ReportingMethods.initializeSampleMeasures();
  },
  initializeSampleMeasureReports: function(){
    console.log('Initializing sample reports....')
    ReportingMethods.initializeSampleMeasureReports();
  },
  initializeMedicareInpatientFacilities: function(){
    console.log('Initializing medicare inpatient facilities....')
    ReportingMethods.initializeMedicareInpatientFacilities();
  },
  clearMeasures: function(){
    Measures.find().forEach(function(report){
      Measures.remove({_id: report._id});
    });
  },
  clearMeasureReports: function(){
    MeasureReports.find().forEach(function(report){
      MeasureReports.remove({_id: report._id});
    });
  },
  initializeAll: function(){
    console.log('Initializing all SANER data cursors....')
    ReportingMethods.initializeSampleMeasures();
    ReportingMethods.initializeSampleMeasureReports();
    ReportingMethods.initializeMedicareInpatientFacilities();
  }
})

// Meteor.startup(function(){
//   Meteor.call('initializeAll');
// })