
import { SyncedCron } from 'meteor/percolate:synced-cron';

import moment from 'moment';
import { Meteor } from 'meteor/meteor';

import { get, has } from 'lodash';
import { Tasks } from 'meteor/clinical:hl7-fhir-data-infrastructure';


Meteor.startup(function(){
  if(get(Meteor, 'settings.private.enableCronAutomation')){
    console.log("Starting the TaskManager....")
    SyncedCron.start();
  }
  if(get(Meteor, 'settings.private.enableTaskManager')){
    SyncedCron.add({
      name: 'TaskManager Monitor',
      schedule: function(parser) {
        return parser.text('every 1 minute');
      },
      job: function() {
          console.log('TaskManager!  ' + Tasks.find().count() + ' tasks in the Task collection.')     
      }
    });
  }   
})







