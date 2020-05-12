
import { Mongo } from 'meteor/mongo';

// Communications = new Mongo.Collection('Communications');

// MeasureReports = new Mongo.Collection('MeasureReports');


if(Meteor.isClient){
  Meteor.subscribe('measures');
  Meteor.subscribe('measureReports');
  Meteor.subscribe('organizations');
  Meteor.subscribe('locations');
}


if(Meteor.isServer){
  Meteor.publish('measures', function(){
      return Measures.find();
  });    
  Meteor.publish('measureReports', function(){
    return MeasureReports.find();
  });    
  Meteor.publish('organizations', function(){
    return Organizations.find();
  });    
  Meteor.publish('locations', function(){
    return Locations.find();
  });    

}