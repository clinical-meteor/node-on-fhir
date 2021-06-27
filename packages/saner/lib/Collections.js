
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import moment from 'moment';
import { get, has } from 'lodash';

import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';

if(Meteor.isClient){

  let defaultDate = get(Meteor, 'settings.public.saner.defaultDate', moment().format("YYYY-MM-DD"));

  Meteor.subscribe('Measures');
  Meteor.subscribe('MeasureReports');
  Meteor.subscribe('Organizations');
  Meteor.subscribe('Locations');
  Meteor.subscribe('GeojsonLayers');

  Meteor.subscribe('ReportingLocations', defaultDate);
  Meteor.subscribe('ReportingOrganizations', defaultDate);

  Meteor.subscribe('LocationsHistory', function(){
    Session.set('locationsHistoryIsReady', true);
  });
  Meteor.subscribe('TestingSiteLocations', function(){
    Session.set('testingSitesAreReady', true);
  });

  Meteor.subscribe('HospitalLocations');

  LeaderboardLocations = new Mongo.Collection('LeaderboardLocations', {connection: null});
}

ReportingLocations = new Mongo.Collection('ReportingLocations');
ReportingOrganizations = new Mongo.Collection('ReportingOrganizations');
GeojsonLayers = new Mongo.Collection('GeojsonLayers');
TestingSiteLocations = new Mongo.Collection('TestingSiteLocations');
TestingSiteLocations_Quickload = new Mongo.Collection('TestingSiteLocations_Quickload');
LocationsHistory = new Mongo.Collection('LocationsHistory');
LocationsHistoryLastWeek = new Mongo.Collection('LocationsHistoryLastWeek');
CurrentIcuCapacityData = new Mongo.Collection('CurrentIcuCapacityData');



if(Meteor.isServer){  
  Meteor.startup(function(){
    if(get(Meteor, 'settings.private.ensureIndices')){
      LocationsHistory._ensureIndex({ "_geometry": "2dsphere"});
      LocationsHistoryLastWeek._ensureIndex({ "_geometry": "2dsphere"});  
    }
  })

  Meteor.publish('HospitalLocations', function(){
    return HospitalLocations.find();
});  
  Meteor.publish('Measures', function(){
      return Measures.find();
  });    
  Meteor.publish('MeasureReports', function(){
    return MeasureReports.find({
      date: {$gte: moment().subtract(1, 'month').toDate() }
    });
  });    
  Meteor.publish('Organizations', function(){
    return Organizations.find();
  });    
  Meteor.publish('Locations', function(){
    return Locations.find();
  });    
  Meteor.publish('LocationsHistory', function(){
    let latestKnownVersion = 1;
    LocationsHistory.find().forEach(function(locationRecord){
      if(has(locationRecord, 'meta.versionId')){
        if(Number.parseInt(get(locationRecord, 'meta.versionId')) > latestKnownVersion){
          latestKnownVersion = Number.parseInt(get(locationRecord, 'meta.versionId'));
        }
      }
    });

    return LocationsHistory.find({
      'meta.versionId': get(Meteor, 'settings.public.saner.mainMapVersion')
    });
  }); 
  
  
  Meteor.publish('GeojsonLayers', function(){
    return GeojsonLayers.find({$and: [
      {'date': {$gte: new Date(moment().format('YYYY-MM-DD'))}},
      {'date': {$lte: new Date(moment().add(1, 'days').format('YYYY-MM-DD'))}}      
    ]});
  });    
  Meteor.publish('TestingSiteLocations', function(){
    return TestingSiteLocations.find();
  });   

  Meteor.publish('ReportingOrganizations', function(queryDate){
    // Organization.meta.tag[0].code

    let reportingOrganizationsQuery = {$and: [
      {'date': {$gte: new Date(queryDate)}},
      {'date': {$lte: new Date(moment(queryDate).add(1, 'days').format('YYYY-MM-DD'))}}      
    ]}

    // console.log('ReportingOrganizations.publish()', reportingOrganizationsQuery)

    let receivedReportIds = MeasureReports.find(reportingOrganizationsQuery).map(function(record){
      return FhirUtilities.pluckReferenceId(get(record, 'subject.reference'));
    })
    // console.log('ReportingOrganizations.publish().receivedReportIds', receivedReportIds)
      
    let organizationsPayload = Organizations.find({
      active: true,
      id: {$in: receivedReportIds}
    }).fetch();

    // console.log('organizationsPayload', organizationsPayload)

    // return Organizations.find({
    //   active: true,
    //   id: {$in: receivedReportIds}
    // });
    return Organizations.find();
  });    
  Meteor.publish('ReportingLocations', function(queryDate){
    
    let reportingLocationQuery = {$and: [
      {'date': {$gte: new Date(queryDate)}},
      {'date': {$lte: new Date(moment(queryDate).add(1, 'days').format('YYYY-MM-DD'))}}      
    ]}

    console.log('ReportingLocations.publish()', reportingLocationQuery)

    let receivedReportIds = MeasureReports.find(reportingLocationQuery).map(function(record){
      return FhirUtilities.pluckReferenceId(get(record, 'subject.reference'));
    })
    console.log('ReportingLocations.publish().receivedReportIds', receivedReportIds)

    let locationPayload = Locations.find({
      status: 'active',
      id: {$in: receivedReportIds}
    }).fetch();

    console.log('locationPayload', locationPayload)

    // return Locations.find({
    //   status: 'active',
    //   id: {$in: receivedReportIds}
    // });
    return Locations.find({
      status: 'active',
      id: {$in: receivedReportIds}
    });

  });    

}


export default { ReportingLocations, ReportingOrganizations, CurrentIcuCapacityData, LocationsHistory, GeojsonLayers, TestingSiteLocations, TestingSiteLocations_Quickload }
