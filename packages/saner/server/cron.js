
import { SyncedCron } from 'meteor/percolate:synced-cron';

import moment from 'moment';
import { Meteor } from 'meteor/meteor';

import { get, has } from 'lodash';


if(get(Meteor, 'settings.public.saner.proxies.hhs')){
    SyncedCron.add({
        name: 'SyncedCron:  Fetch the latest data from HHS.',
        schedule: function(parser) {
          return parser.text('at 12:00 am');
        //   return parser.text('every 1 day');
        },
        job: function() {
            // Meteor.call('fetchHhsData', Meteor, 'settings.public.saner.proxies.hhs'))
            Meteor.call('fetchHhsData', get(Meteor, 'settings.public.saner.proxies.hhs'))     
        }
    });

    SyncedCron.add({
        name: 'SyncedCron:  Generate the ICU Capacity Map.',
        schedule: function(parser) {
          return parser.text('at 12:00 pm');
        //   return parser.text('every 1 day');
        },
        job: function() {
            Meteor.call('generateIcuCapacityMap')     
        }
    });

    SyncedCron.add({
        name: 'SyncedCron:  Delete future MeasureReport records from HHS feed.',
        schedule: function(parser) {
          return parser.text('at 11:00 pm');
        //   return parser.text('every 1 day');
        },
        job: function() {
            Meteor.call('deleteFutureHhsReports')     
        }
    });
    
}   




Meteor.startup(function(){
    Meteor.call('fetchHhsData', get(Meteor, 'settings.public.saner.proxies.hhs'))     
    SyncedCron.start();
})