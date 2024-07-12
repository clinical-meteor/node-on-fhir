
import { createLogger, addColors, format, transports } from 'winston';
import { get } from 'lodash';
import { Meteor } from 'meteor/meteor';

import "setimmediate";


// some functions that do log level filtering
const LEVEL = Symbol.for('level');
function filterOnly(level) {
  return format(function (info) {
    if (info[LEVEL] === level) {
      return info;
    }
  })();
}

function hideDataLogLevel() {
  return format(function (info) {
    if (info[LEVEL] !== 'data') {
      return info;
    }
  })();
}

function onlyDisplayDataLogLevel() {
  return format(function (info) {
    if (info[LEVEL] === 'data') {
      return info;
    }
  })();
}


// lets create a global logger
export const logger = createLogger({
  level: get(Meteor, 'settings.public.loggingThreshold') ,
  levels: {
    error: 0, 
    warn: 1, 
    info: 2, 
    verbose: 3, 
    debug: 4, 
    trace: 5, 
    data: 6 
  },
  // defaultMeta: {tags: ['client_app']},
  // defaultMeta: { app: get(Meteor, 'settings.public.title') },
  transports: [
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' }),

    new transports.Console({
      colorize: true,
      format: format.combine(
        hideDataLogLevel(),
        format.colorize(),
        format.simple(),
        format.splat(),
        format.timestamp()
      )
    }),

    new transports.Console({
      colorize: true,
      format: format.combine(
        onlyDisplayDataLogLevel(),
        format.simple(),
        format.splat(),
        format.prettyPrint()
      )
    })
  ],
  exitOnError: false
});

addColors({
  error: "red", 
  warn: "yellow", 
  info: "white bold", 
  verbose: "green", 
  debug: "cyan", 
  trace: 'cyan',
  data: "grey" 
});
  
// what is the logging threshold set in the Meteor.settings file?
console.info('Setting the logging threshold to: ' + get(Meteor, 'settings.public.loggingThreshold'))


// introspection for the win
// logger.info('Starting the Winston Logging Service');
// logger.data('Winston Logging Service', {data: logger}, {source: "AppContainer.jsx"});

// attaching to the global scope is not recommending
// logging is one debatable exception to the general rule, however
if(typeof window === "object"){
  window.logger = global.logger = logger;
}

// ironically telling the logger where to write the error message when it fails
logger.on('error', function (error) { 
  console.error('Winston just blew up.', error)
});

if(Meteor.isClient){
  window.logger = logger;
}


export function log() { 
  console.log('biz')

  /* jshint -W021 */
  //if(typeof window !== "undefined"){

    // let log;
    if (window.console) {

      // Only run on the first time through - reset this function to the appropriate console.log helper
      if (Function.prototype.bind) {
        log = Function.prototype.bind.call(console.log, console);
      } else {
        log = function() { Function.prototype.apply.call(console.log, console, arguments); };
      }
  
      // console.info('log.log', log);
      console.log('log.arguments[0]', arguments[0]);
      log.apply(this, arguments);
    }
  //}
}


//Then redefine the old console
if(typeof window === "object"){
  window.console = console;
  window.log = log;
}


export const message = {
  log: function(text){
    if(['everything'].includes(get(Meteor, 'settings.public.loggingThreshold'))){
      console.log('message.log', log)
      console.log('log.arguments[0]', arguments[0])
    }
    if(['everything', 'debug', 'info', 'warn', 'verbose'].includes(get(Meteor, 'settings.public.loggingThreshold'))){
      if (Function.prototype.bind) {
        log = Function.prototype.bind.call(console.log, console);
      }
      else {
        log = function() { 
          Function.prototype.apply.call(console.log, console, arguments);
        };
      }
      log.apply(this, arguments);
    }
    // Your code
  },
  info: function (text) {
    if(['everything'].includes(get(Meteor, 'settings.public.loggingThreshold'))){
      console.log('info.arguments[0]', arguments[0])
    }
    if(['everything', 'debug', 'info', 'warn', 'verbose'].includes(get(Meteor, 'settings.public.loggingThreshold'))){
      if (Function.prototype.bind) {
        log = Function.prototype.bind.call(console.log, console);
      }
      else {
        log = function() { 
          Function.prototype.apply.call(console.log, console, arguments);
        };
      }
      log.apply(this, arguments);
    }
  },
  debug: function (text) {
    if(['everything'].includes(get(Meteor, 'settings.public.loggingThreshold'))){
      console.log('debug.arguments[0]', arguments[0])
    }
    if(['everything', 'debug', 'info', 'warn', 'verbose'].includes(get(Meteor, 'settings.public.loggingThreshold'))){
      if (Function.prototype.bind) {
        log = Function.prototype.bind.call(console.log, console);
      }
      else {
        log = function() { 
          Function.prototype.apply.call(console.log, console, arguments);
        };
      }
      log.apply(this, arguments);
    }
  },
  warn: function (text) {
    if(['everything'].includes(get(Meteor, 'settings.public.loggingThreshold'))){
      console.log('warn.arguments[0]', arguments[0])
    }
    if(['everything', 'debug', 'info', 'warn', 'verbose'].includes(get(Meteor, 'settings.public.loggingThreshold'))){
      if (Function.prototype.bind) {
        log = Function.prototype.bind.call(console.log, console);
      }
      else {
        log = function() { 
          Function.prototype.apply.call(console.log, console, arguments);
        };
      }
      log.apply(this, arguments);
    }
  },
  error: function (text) {
    if(['everything'].includes(get(Meteor, 'settings.public.loggingThreshold'))){
      console.error('error.arguments[0]', arguments[0])
    }
    if(['everything', 'debug', 'info', 'warn', 'verbose'].includes(get(Meteor, 'settings.public.loggingThreshold'))){
      if (Function.prototype.bind) {
        log = Function.prototype.bind.call(console.log, console);
      }
      else {
        log = function() { 
          Function.prototype.apply.call(console.log, console, arguments);
        };
      }
      log.apply(this, arguments);
    }
  }
}
// //Then redefine the old console
// if(typeof window === "object"){
//   window.console = message;
// }


export default { logger, log, message };