import { get, has } from 'lodash';
import { Meteor } from 'meteor/meteor'

import { AuditEventSchema } from 'meteor/clinical:hl7-fhir-data-infrastructure';

Meteor.methods({
  logEvent: function(payload){
    check(payload, Object);

    process.env.DEBUG && console.log('HipaaLogger.logEvent()', payload)
    return Meteor.call('logHipaaEvent', payload)
  },
  logHipaaEvent:function(hipaaEvent){
    check(hipaaEvent, Object);

    if(process.env.DEBUG){
      console.log("Received an event to log: ", hipaaEvent);
    }

    // let auditEventValidator = AuditEventSchema.newContext();
    // auditEventValidator.validate(hipaaEvent)

    var newAuditEvent = { 
      "resourceType" : "AuditEvent",
      "type" : { 
        'code': get(hipaaEvent, 'collectionName', ''),
        'display': get(hipaaEvent, 'collectionName', '')
        }, 
      "action" : get(hipaaEvent, 'action', get(hipaaEvent, 'eventType', '')),
      "recorded" : new Date(), 
      "outcome" : get(hipaaEvent, 'outcome', "Success"),
      "outcomeDesc" : get(hipaaEvent, 'outcomeDesc'),
      "agent" : [get(hipaaEvent, 'agent[0]', null)],
      "source" : { 
        "site" : Meteor.absoluteUrl(),
        "identifier": {
          "value": get(hipaaEvent, 'collectionName', '')
        }
      },
      "entity": [{
        "reference": {
          "reference": get(hipaaEvent, 'recordId', ''),
        }
      }]
    }

    // console.log('IsValid: ', auditEventValidator.isValid())
    // console.log('ValidationErrors: ', auditEventValidator.validationErrors());

    let newAuditId = false;
    newAuditId = Meteor.call('logAuditEvent', newAuditEvent)

    if(process.env.DEBUG){
      console.log("Just logged an event: ", newAuditId);
    }
    return newAuditId;
  },
  logAuditEvent:function(fhirAuditEvent){
    check(fhirAuditEvent, Object);

    if(process.env.DEBUG){
      console.log("Logging a FHIR Audit Event: ", fhirAuditEvent);
    }

    let newAuditId = false;

    let auditEventValidator = AuditEventSchema.newContext();
    auditEventValidator.validate(fhirAuditEvent)

    if(process.env.DEBUG){
      console.log('IsValid: ', auditEventValidator.isValid())
      console.log('ValidationErrors: ', auditEventValidator.validationErrors());
      console.log('Meteor.settings.public.modules.fhir.AuditEvents.enabled: ', get(Meteor, 'settings.public.modules.fhir.AuditEvents.enabled'));  
    }

    if(auditEventValidator.isValid() && get(Meteor, 'settings.public.modules.fhir.AuditEvents.enabled')){

      console.log('Adding event to AuditLog.');
      newAuditId = AuditEvents.insert(fhirAuditEvent, function(error, result){
        if (error) {
          console.log("error", error);        
        }
      });  
    }

    return newAuditId;
  }  
})