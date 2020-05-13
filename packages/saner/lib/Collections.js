
import { Mongo } from 'meteor/mongo';

if(Meteor.isClient){
  Meteor.subscribe('Measures');
  Meteor.subscribe('MeasureReports');
  Meteor.subscribe('Organizations');
  Meteor.subscribe('Locations');
}


if(Meteor.isServer){
  Meteor.publish('Measures', function(){
      return Measures.find();
  });    
  Meteor.publish('MeasureReports', function(){
    return MeasureReports.find();
  });    
  Meteor.publish('Organizations', function(){
    return Organizations.find();
  });    
  Meteor.publish('Locations', function(){
    return Locations.find();
  });    

}