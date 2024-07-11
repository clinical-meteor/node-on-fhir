import _ from 'lodash';
let get = _.get;
let set = _.set;
let has = _.has;
let uniq = _.uniq;

export const FhirUtilities = {
  addPatientFilterToQuery(patientId, currentQuery, practitionerId){
    
    let returnQuery = {};

    if(typeof currentQuery === "object"){
      Object.assign(returnQuery, currentQuery);
    }

    if(practitionerId){
      returnQuery = {};
    } else {
      if(patientId){
        returnQuery = {$or: [
              {"patient.reference": "Patient/" + patientId},
              {"patient.reference": "urn:uuid:" + patientId},

              {"subject.reference": "Patient/" + patientId},
              {"subject.reference": "urn:uuid:" + patientId},

              {"patient.reference": { $regex: ".*Patient/" + patientId}}, 
              {"subject.reference": { $regex: ".*Patient/" + patientId}},
              
              {"agent.who.reference": "Patient/" + patientId}
          ]}      
      } else {
        returnQuery = {$or: [
              {"patient.reference": "Patient/public"},
              {"patient.reference": "urn:uuid:Patient/public"},
              {"patient.reference": { $regex: ".*Patient/public"}}, 
              {"subject.reference": { $regex: ".*Patient/public"}}
            ]}
      }
    }
  
    return returnQuery
  },
  trimTrailingSlash(url){
    let resultingUrl;
  
    if(url[url.length - 1] === "/"){
      resultingUrl = url.substring(0, url.length - 1);
    } else {
      resultingUrl = url;
    }
    return resultingUrl;
  },
  pluckReferenceId(reference){
    let identifier = ""
    let referenceParts = [];
    
    if(reference){
      if(reference.includes("urn:uuid:")){
        // get the last part of the string
        identifier = reference.substring(9, reference.length)
      }
      // guard against empty strings
      if(reference.includes("/")){

        // split the string apart according to slashes
        referenceParts = reference.split("/");

        // get the last part of the string
        identifier = referenceParts[referenceParts.length - 1];  
      }
    }
    return identifier;
  },
  pluckReferenceBase(reference){
    let identifier = ""
    let referenceParts = [];
    
    if(reference){
      if(reference.includes("urn:uuid:")){
        // get the last part of the string
        identifier = reference.substring(9, reference.length)
      }
      // guard against empty strings
      if(reference.includes("/")){

        // split the string apart according to slashes
        referenceParts = reference.split("/");

        // get the first part of the string
        identifier = referenceParts[0];  
      }
    }
    return identifier;
  },
  stringifyAddress(address){  
    // var assembledAddress = "3928 W. Cornelia Ave, Chicago, IL";
    let assembledAddress = '';
    if(get(address, 'line[0]')){
      assembledAddress = get(address, 'line[0]');
    }
    if(get(address, 'city')){
      // guard in case the other elements weren't set,
      // in which case we don't want to lead with a comma
      if(assembledAddress.length > 0){
        assembledAddress = assembledAddress + ', ';
      }
      assembledAddress = assembledAddress + get(address, 'city');
    }
    if(get(address, 'state')){
      if(assembledAddress.length > 0){
        assembledAddress = assembledAddress + ', ';
      }
      assembledAddress = assembledAddress + get(address, 'state');
    }
    if(get(address, 'postalCode')){
      if(assembledAddress.length > 0){
        assembledAddress = assembledAddress + ', ';
      }
      assembledAddress = assembledAddress + get(address, 'postalCode');
    }
    if(get(address, 'country')){
      if(assembledAddress.length > 0){
        assembledAddress = assembledAddress + ', ';
      }
      assembledAddress = assembledAddress + get(address, 'country');
    }
  
    return assembledAddress;
  },
  assembleName(humanName, options){
    // patient name has gone through a number of revisions, and we need to search a few different spots, and assemble as necessary  
    let resultingNameString = "";

    let nameText = get(humanName, 'text', '');
    if(nameText.length > 0){
      // some systems will store the name as it is to be displayed in the text field
      // if that's present, use it
      resultingNameString = get(humanName, 'text', '');    
    } else {
      // the majority of systems out there are SQL based and make a design choice to store as 'first' and 'last' name
      // critiques of that approach can be saved for a later time
      // but suffice it to say that we need to assemble the parts

      if(!get(options, 'noPrefix')){
        if(get(humanName, 'prefix[0]')){
          resultingNameString = get(humanName, 'prefix[0]')  + ' ';
        }  
      }

      if(get(humanName, 'given[0]')){
        resultingNameString = resultingNameString + get(humanName, 'given[0]')  + ' ';
      }

      if(get(humanName, 'family')){
        // R4 - droped the array of family names; one authoritative family name per humanName
        resultingNameString = resultingNameString + get(humanName, 'family')  + ' ';
      } else if (get(humanName, 'family[0]')){
        // DSTU2 and STU3 - allows an array of family names
        resultingNameString = resultingNameString + get(humanName, 'family[0]')  + ' ';
      }
      
      if(get(humanName, 'suffix[0]')){
        resultingNameString = resultingNameString + ' ' + get(humanName, 'suffix[0]');
      }
    }

    // remove any whitespace from the name
    return resultingNameString.trim();
  },
  pluckName(fhirPatientResource, options){

    if(!options) {
      options = {};
    }

    // we assume the first listed name by default (>95% of the use cases)
    let selectedIndex = 0;
    let resultingNameString = "";

    // assuming the data isnt anonymized
    if(Array.isArray(get(fhirPatientResource, 'name'))){
      
      // we should parse through the available names
      fhirPatientResource.name.forEach(function(name, index){

        // to see if any of them are marked official
        if(get(name, 'use') === "official"){
          selectedIndex = index;
        }
      })

      // assemble the name from the first listed name or whatever is marked official
      if(has(fhirPatientResource, 'name[0].text')){
        resultingNameString = get(fhirPatientResource, 'name[0].text');
      } else {
        resultingNameString = FhirUtilities.assembleName(fhirPatientResource.name[selectedIndex], options)
      }      
    }

    // remove any whitespace from the name
    return resultingNameString.trim();
  },
  pluckPhone(telecomArray){
    let result = "";
    if(Array.isArray(telecomArray)){
      telecomArray.forEach(function(telecomRecord){
        if(get(telecomRecord, 'system') === 'phone'){
          result = get(telecomRecord, 'value');
        }
      })  
    }
    return result;
  },
  pluckEmail(telecomArray){
    let result = "";
    if(Array.isArray(telecomArray)){
      telecomArray.forEach(function(telecomRecord){
        if(get(telecomRecord, 'system') === 'email'){
          result = get(telecomRecord, 'value');
        }
      })  
    }
    return result;
  },
  pluckCodeableConcept(field){
    let result = "";
    if(get(field, 'text')){
      result = get(field, 'text', '');
    } else if(get(field, 'coding[0].display')) {
      result = get(field, 'coding[0].display', '');
    } else {
      result = get(field, 'coding[0].code', '');
    }
    return result;
  },
  pluckReference(field){
    let result = "";
    if(get(field, 'display')){
      result = get(field, 'display');
    } else {
      result = get(field, 'reference', '');
    }
    return result;
  },
  pluckFirstIdentifier(identifiers){
    let result = "";
    if(Array.isArray(identifiers)){
      result = get(identifiers[0], 'value', '')
    }
    return result;
  },
  generatePatientReference(patient){
    let patientReference = {
      display: "",
      reference: ""
    };
    if(has(patient, 'id')){
      patientReference.reference = "Patient/" + get(patient, "id")
    }
    patientReference.display = FhirUtilities.pluckName(patient)

    return patientReference;
  },
  generateDateQuery(chainPrefix, startDate, endDate ){
    let dateQuery = '';

    if(chainPrefix){
      dateQuery = chainPrefix;
    }
    if(startDate){
      dateQuery = dateQuery + 'date=gt' + startDate
    }
    if(startDate && endDate){
      dateQuery = dateQuery + '&';
    }
    if(chainPrefix){
      dateQuery = dateQuery + chainPrefix;
    }

    if(endDate){
      dateQuery = dateQuery + 'date=lt' + endDate
    }
    if(startDate || endDate){
      dateQuery = dateQuery;
    }
 
    return dateQuery;
  },
  pluralizeResourceName(resourceType){
    let pluralized = '';
    switch (resourceType) {
      case 'Binary':          
        pluralized = 'Binaries';
        break;
      case 'Library':      
        pluralized = 'Libraries';
        break;
      case 'SupplyDelivery':      
        pluralized = 'SupplyDeliveries';
        break;
      case 'ImagingStudy':      
        pluralized = 'ImagingStudies';
        break;        
      case 'FamilyMemberHistory':      
        pluralized = 'FamilyMemberHistories';
        break;        
      case 'ResearchStudy':      
        pluralized = 'ResearchStudies';
        break;        
      default:
        pluralized = resourceType + 's';
        break;
    }

    return pluralized;
  },
  singularizeResourceName(resourceTypeString){
    var singularized = '';
    switch (resourceTypeString) {
      case 'Binaries':          
        singularized = 'Binary';
        break;
      case 'Libraries':      
        singularized = 'Library';
        break;
      case 'SupplyDeliveries':      
        singularized = 'SupplyDelivery';
        break;
      case 'ImagingStudies':      
        singularized = 'ImagingStudy';
        break;        
      case 'FamilyMemberHistories':      
        singularized = 'FamilyMemberHistory';
        break;        
      case 'ResearchStudies':      
        singularized = 'ResearchStudy';
        break;        
      default:
        singularized = resourceTypeString.substring(0, resourceTypeString.length - 1)
        break;
    }

    return singularized;
  },
  parseCapabilityStatement(capabilityStatement, canSearch){
    console.log('FhirUtilities.parseCapabilityStatement.', capabilityStatement)
    if(!canSearch){
      canSearch = {};
    }
    if(["CapabilityStatement", "Conformance"].includes(get(capabilityStatement, 'resourceType')) ){
      console.log('Found CapabilityStatement');
      if(get(capabilityStatement, 'rest[0].mode') === "server"){
        console.log('CapabilityStatement claims it is a server.');
        if(Array.isArray(get(capabilityStatement, 'rest[0].resource'))){
          let resourceArray = get(capabilityStatement, 'rest[0].resource');
          console.log('Loading resource array from CapabilityStatement.');

          if(Array.isArray(resourceArray)){
            resourceArray.forEach(function(resource){
              let resourceType = get(resource, 'type');
              canSearch[resourceType] = false;

              let interactionArray = get(resource, 'interaction');
              if(Array.isArray(interactionArray)){
                interactionArray.forEach(function(interaction){
                  if(["read", "search-type"].includes(get(interaction, 'code'))){
                    canSearch[resourceType] = true;
                  }   
                })  
              }
            })  
          }
        }
      }
    }
    console.log("Generated the following ehrServerCapabilities object:", canSearch);
    return canSearch;
  },
  pluralizeResourceName(resourceType){
    var pluralized = '';
    switch (resourceType) {
      case 'Binary':          
        pluralized = 'Binaries';
        break;
      case 'Library':      
        pluralized = 'Libraries';
        break;
      case 'SupplyDelivery':      
        pluralized = 'SupplyDeliveries';
        break;
      case 'ImagingStudy':      
        pluralized = 'ImagingStudies';
        break;        
      case 'FamilyMemberHistory':      
        pluralized = 'FamilyMemberHistories';
        break;        
      case 'ResearchStudy':      
        pluralized = 'ResearchStudies';
        break;        
      default:
        pluralized = resourceType + 's';
        break;
    }

    return pluralized;
  },
  isFhirResource(text){
    let result = false;

    let resourceTypes = [
      "Account",
      "ActivityDefinition",
      "AdverseEvent",
      "AllergyIntolerance",
      "Appointment",
      "AppointmentResponse",
      "AuditEvent",
      "Basic",
      "Binary",
      "BiologicallyDerivedProduct",
      "BodyStructure",
      "Bundle",
      "CapabilityStatement",
      "CarePlan",
      "CareTeam",
      "CatelogEntry",
      "ChargeItem",
      "ChargeItemDefinition",
      "Claim",
      "ClaimResponse",
      "ClinicalImpression",
      "CodeSystem",
      "Communication",
      "CommunicationResponse",
      "CompartmentDefinition",
      "Composition",
      "ConceptMap",
      "Condition",
      "Consent",
      "Contract",
      "Coverage",
      "CoverageEligibilityRequest",
      "CoverageEligibilityResponse",
      "DetectedIssue",      
      "Device",
      "DeviceDefinition",
      "DeviceMetric",
      "DeviceRequest",
      "DeviceUseStatement",
      "DiagnosticReport",
      "DocumentManifest",
      "DocumentReferences",
      "EffectiveEvidenceSynthesis",
      "Encounter",
      "Endpoint",
      "EnrollmentRequest",
      "EnrollmentResponse",
      "EpisodeOfCare",
      "EventDefinition",
      "Evidence",
      "EvidenceVariable",
      "EvidenceScenario",
      "ExplanationOfBenefit",
      "FamilyMemberHistory",
      "Flag",
      "Goal",
      "GraphDefinition",
      "Group",
      "GuidanceResposne",
      "HealthcareService",
      "ImagingStudy",
      "Immunization",
      "ImmunizationEvaluation",
      "ImmunizationRecommendation",
      "ImplementationGuide",
      "InsurancePlan",
      "Invoice",
      "Library",
      "List",
      "Location",
      "Measure",
      "MeasureReport",
      "Media",
      "Medication",
      "MedicationAdministration",
      "MedicationDispense",
      "MedicationKnowledge",
      "MedicationRequest",
      "MedicationStatement",
      "MedicationOrder",
      "MedicinalProduct",
      "MessageDefinition",
      "MessageHeader",
      "MolecularSequence",
      "NamingSystem",
      "NutritionOrder",
      "Observation",
      "OperationDefinition",
      "OperationOutcome",
      "Organization",
      "Parameters",
      "Patient",
      "PaymentNotice",
      "PaymentReconciliation",
      "Person",
      "PlanDefinition",
      "Practitioner",
      "PractitionerRole",
      "Procedure",
      "Provenance",
      "ProcedureRequest",
      "Questionnaire",
      "QuestionnaireResponse",
      "RelatedPerson",
      "RequestGroup",
      "ResearchStudy",
      "ResearchSubject",
      "RiskAssessment",
      "Schedule",
      "SearchParameter",
      "ServiceRequest",
      "Slot",
      "Specimen",
      "StructureDefinition",
      "StructureMap",
      "Subscription",
      "Substance",
      "SupplyDelivery",
      "SupplyRequest",
      "Task",
      "TerminologyCapabilities",
      "TestReport",
      "TestScript",
      "ValueSet",
      "VisionPrescription"
    ]

    if(resourceTypes.includes(text)){
      result = true;
    }
    return result;
  },
  consentIntoAccessControl(consentRecord){

    // https://www.hl7.org/fhir/valueset-consent-action.html
    
    let result = { 
      id: '',
      role: 'unknown', 
      resource: 'Basic', 
      action: 'access',  
      attributes: ['*'],
      securityLevel: ''
    };

    // which resourceType does this Consent record refer to
    if(get(consentRecord, 'id')){
      result.id = get(consentRecord, 'id');
    } 

    // which resourceType does this Consent record refer to
    if(get(consentRecord, 'provision.provision[0].class[0].code')){
      result.resource = get(consentRecord, 'provision.provision[0].class[0].code');
    } else if(get(consentRecord, 'provision[0].provision[0].class[0].code')){
      result.resource = get(consentRecord, 'provision[0].provision[0].class[0].code');
    } 

    
    // // should we base the action on the category coding?  
    // if(get(consentRecord, 'category[0].coding[0].code') === "IDSCL"){
    //   result.action = "read";
    // }
    // should we base the action on the category coding?  
    if(get(consentRecord, 'provision.provision[0].action[0].coding')){
      if(Array.isArray(get(consentRecord, 'provision.provision[0].action[0].coding'))){
        let actionString = "";
        consentRecord.provision.provision[0].action[0].coding.forEach(function(action, index){
          if(index !== 0){
            actionString = actionString + ", ";
          }
          actionString = actionString + get(action, 'code')
        })
        result.action = actionString;
      }
    } else if(get(consentRecord, 'provision[0].provision[0].action[0].coding')){
      if(Array.isArray(get(consentRecord, 'provision[0].provision[0].action[0].coding'))){
        let actionString = "";
        consentRecord.provision[0].provision[0].action[0].coding.forEach(function(action, index){
          if(index !== 0){
            actionString = actionString + ", ";
          }
          actionString = actionString + get(action, 'code')
        })
        result.action = actionString;
      }
    }

    // should we base the action on the category coding?  
    if(get(consentRecord, 'provision.provision[0].actor[0].role.coding[0].display')){
      result.role = get(consentRecord, 'provision.provision[0].actor[0].role.coding[0].display');
    } else if(get(consentRecord, 'provision[0].provision[0].actor[0].role.coding[0].display')){
      result.role = get(consentRecord, 'provision[0].provision[0].actor[0].role.coding[0].display');
    }

    if(get(consentRecord, 'provision.provision[0].securityLevel[0].coding[0].display')){
      result.qualifier = "EQUALS"
      result.args = "securityLevel"
      result.securityLevel = get(consentRecord, 'provision.provision[0].securityLevel[0].coding[0].display');
      result.condition = {
        Fn: "EQUALS", 
        args: { 
          securityLevel: get(consentRecord, 'provision.provision[0].securityLevel[0].coding[0].display')
        }
      }
    } else if(get(consentRecord, 'provision[0].provision[0].securityLevel[0].coding[0].display')){
      result.qualifier = "EQUALS"
      result.args = "securityLevel"
      result.securityLevel = get(consentRecord, 'provision[0].provision[0].securityLevel[0].coding[0].display');
      result.condition = {
        Fn: "EQUALS", 
        args: { 
          securityLevel: get(consentRecord, 'provision[0].provision[0].securityLevel[0].coding[0].display')
        }
      }
    }

    return result;
  }
}

export default FhirUtilities;