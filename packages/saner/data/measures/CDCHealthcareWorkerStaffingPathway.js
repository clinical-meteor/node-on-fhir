const CDCHealthcareWorkerStaffingPathway = {
  "resourceType" : "Measure",
  "id" : "CDCHealthcareWorkerStaffingPathway",
  "meta" : {
    "profile" : [
      "http://hl7.org/fhir/StructureDefinition/Measure",
      "http://hl7.org/fhir/us/saner/StructureDefinition/PublicHealthMeasure"
    ]
  },
  "text" : {
    "status" : "generated",
    "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: CDCHealthcareWorkerStaffingPathway</p><p><b>meta</b>: </p><p><b>url</b>: <a href=\"http://hl7.org/fhir/us/saner/Measure/CDCHealthcareWorkerStaffingPathway\">http://hl7.org/fhir/us/saner/Measure/CDCHealthcareWorkerStaffingPathway</a></p><p><b>version</b>: 0.1.0</p><p><b>name</b>: CDCHealthcareWorkerStaffingPathway</p><p><b>title</b>: COVID-19 Healthcare Worker Staffing Pathway</p><p><b>status</b>: draft</p><p><b>experimental</b>: true</p><p><b>date</b>: Apr 27, 2020, 11:08:50 AM</p><p><b>publisher</b>: HL7 International</p><p><b>contact</b>: HL7 Patient Administration Workgroup: http://hl7.org/Special/committees/pafm/index.cfm, Audacious Inquiry: http://ainq.com, Keith W. Boone: mailto:kboone@ainq.com</p><p><b>description</b>: SANER implementation of the CDC COVID-19 Healthcare Worker Staffing Pathway</p><p><b>useContext</b>: </p><p><b>jurisdiction</b>: United States of America <span style=\"background: LightGoldenRodYellow\">(Details : {urn:iso:std:iso:3166 code 'US' = 'United States of America)</span></p><p><b>author</b>: Centers for Disease Control/National Healthcare Safety Network (CDC/NHSN): mailto:nhsn@cdc.gov</p><p><b>relatedArtifact</b>: , , , , , </p><p><b>type</b>: Composite <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/measure-type code 'composite' = 'Composite)</span></p><blockquote><p><b>group</b></p><p><b>code</b>: Front-line persons who clean patient rooms and all areas in a healthcare facility <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'shortenvsvc' = 'shortenvsvc)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: true <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'true' = 'true)</span></p><p><b>description</b>: YES - Front-line persons who clean patient rooms and all areas in a healthcare facility</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: false <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'false' = 'false)</span></p><p><b>description</b>: NO - Front-line persons who clean patient rooms and all areas in a healthcare facility</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Registered nurses and licensed practical nurses <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'shortnurse' = 'shortnurse)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: true <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'true' = 'true)</span></p><p><b>description</b>: YES - Registered nurses and licensed practical nurses</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: false <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'false' = 'false)</span></p><p><b>description</b>: NO - Registered nurses and licensed practical nurses</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Certified medical professionals who specialize in knowledge and use of mechanical ventilation as well as other programs for respiratory care <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'shortrt' = 'shortrt)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: true <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'true' = 'true)</span></p><p><b>description</b>: YES - Certified medical professionals who specialize in knowledge and use of mechanical ventilation as well as other programs for respiratory care</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: false <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'false' = 'false)</span></p><p><b>description</b>: NO - Certified medical professionals who specialize in knowledge and use of mechanical ventilation as well as other programs for respiratory care</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Pharmacists and pharmacy techs <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'shortphar' = 'shortphar)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: true <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'true' = 'true)</span></p><p><b>description</b>: YES - Pharmacists and pharmacy techs</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: false <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'false' = 'false)</span></p><p><b>description</b>: NO - Pharmacists and pharmacy techs</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Attending physicians, fellows <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'shortphys' = 'shortphys)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: true <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'true' = 'true)</span></p><p><b>description</b>: YES - Attending physicians, fellows</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: false <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'false' = 'false)</span></p><p><b>description</b>: NO - Attending physicians, fellows</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: 'per diems', 'travelers', retired, or other seasonal or intermittently contracted persons <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'shorttemp' = 'shorttemp)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: true <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'true' = 'true)</span></p><p><b>description</b>: YES - 'per diems', 'travelers', retired, or other seasonal or intermittently contracted persons</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: false <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'false' = 'false)</span></p><p><b>description</b>: NO - 'per diems', 'travelers', retired, or other seasonal or intermittently contracted persons</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'shortoth' = 'shortoth)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: true <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'true' = 'true)</span></p><p><b>description</b>: YES - Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: false <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'false' = 'false)</span></p><p><b>description</b>: NO - Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Advanced practice nurses, physician assistants <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'shortothlic' = 'shortothlic)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: true <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'true' = 'true)</span></p><p><b>description</b>: YES - Advanced practice nurses, physician assistants</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: false <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'false' = 'false)</span></p><p><b>description</b>: NO - Advanced practice nurses, physician assistants</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'shortothsfy' = 'shortothsfy)</span></p></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Front-line persons who clean patient rooms and all areas in a healthcare facility <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'posshortenvsvc' = 'posshortenvsvc)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: true <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'true' = 'true)</span></p><p><b>description</b>: YES - Front-line persons who clean patient rooms and all areas in a healthcare facility</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: false <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'false' = 'false)</span></p><p><b>description</b>: NO - Front-line persons who clean patient rooms and all areas in a healthcare facility</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Registered nurses and licensed practical nurses <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'posshortnurse' = 'posshortnurse)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: true <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'true' = 'true)</span></p><p><b>description</b>: YES - Registered nurses and licensed practical nurses</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: false <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'false' = 'false)</span></p><p><b>description</b>: NO - Registered nurses and licensed practical nurses</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Certified medical professionals who specialize in knowledge and use of mechanical ventilation as well as other programs for respiratory care <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'posshortrt' = 'posshortrt)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: true <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'true' = 'true)</span></p><p><b>description</b>: YES - Certified medical professionals who specialize in knowledge and use of mechanical ventilation as well as other programs for respiratory care</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: false <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'false' = 'false)</span></p><p><b>description</b>: NO - Certified medical professionals who specialize in knowledge and use of mechanical ventilation as well as other programs for respiratory care</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Pharmacists and pharmacy techs <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'posshortphar' = 'posshortphar)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: true <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'true' = 'true)</span></p><p><b>description</b>: YES - Pharmacists and pharmacy techs</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: false <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'false' = 'false)</span></p><p><b>description</b>: NO - Pharmacists and pharmacy techs</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Attending physicians, fellows <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'posshortphys' = 'posshortphys)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: true <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'true' = 'true)</span></p><p><b>description</b>: YES - Attending physicians, fellows</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: false <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'false' = 'false)</span></p><p><b>description</b>: NO - Attending physicians, fellows</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: 'per diems', 'travelers', retired, or other seasonal or intermittently contracted persons <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'posshorttemp' = 'posshorttemp)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: true <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'true' = 'true)</span></p><p><b>description</b>: YES - 'per diems', 'travelers', retired, or other seasonal or intermittently contracted persons</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: false <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'false' = 'false)</span></p><p><b>description</b>: NO - 'per diems', 'travelers', retired, or other seasonal or intermittently contracted persons</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above. <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'posshortoth' = 'posshortoth)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: true <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'true' = 'true)</span></p><p><b>description</b>: YES - Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above.</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: false <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'false' = 'false)</span></p><p><b>description</b>: NO - Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above.</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Advanced practice nurses, physician assistants <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'posshortothlic' = 'posshortothlic)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: true <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'true' = 'true)</span></p><p><b>description</b>: YES - Advanced practice nurses, physician assistants</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: false <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/special-values code 'false' = 'false)</span></p><p><b>description</b>: NO - Advanced practice nurses, physician assistants</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above. <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner code 'posshortothsfy' = 'posshortothsfy)</span></p></blockquote></div>"
  },
  "url" : "http://hl7.org/fhir/us/saner/Measure/CDCHealthcareWorkerStaffingPathway",
  "version" : "0.1.0",
  "name" : "CDCHealthcareWorkerStaffingPathway",
  "title" : "COVID-19 Healthcare Worker Staffing Pathway",
  "status" : "draft",
  "experimental" : true,
  "date" : "2020-04-27T11:08:50+00:00",
  "publisher" : "HL7 International",
  "contact" : [
    {
      "name" : "HL7 Patient Administration Workgroup",
      "telecom" : [
        {
          "system" : "url",
          "value" : "http://hl7.org/Special/committees/pafm/index.cfm"
        }
      ]
    },
    {
      "name" : "Audacious Inquiry",
      "telecom" : [
        {
          "system" : "url",
          "value" : "http://ainq.com"
        }
      ]
    },
    {
      "name" : "Keith W. Boone",
      "telecom" : [
        {
          "system" : "email",
          "value" : "mailto:kboone@ainq.com"
        }
      ]
    }
  ],
  "description" : "SANER implementation of the CDC COVID-19 Healthcare Worker Staffing Pathway",
  "useContext" : [
    {
      "code" : {
        "system" : "http://terminology.hl7.org/CodeSystem/usage-context-type",
        "code" : "focus"
      },
      "valueCodeableConcept" : {
        "coding" : [
          {
            "system" : "http://snomed.info/sct",
            "code" : "840539006"
          }
        ]
      }
    }
  ],
  "jurisdiction" : [
    {
      "coding" : [
        {
          "system" : "urn:iso:std:iso:3166",
          "code" : "US"
        }
      ]
    }
  ],
  "author" : [
    {
      "name" : "Centers for Disease Control/National Healthcare Safety Network (CDC/NHSN)",
      "telecom" : [
        {
          "system" : "email",
          "value" : "mailto:nhsn@cdc.gov"
        }
      ]
    }
  ],
  "relatedArtifact" : [
    {
      "type" : "documentation",
      "label" : "NHSN COVID-19 Reporting for Acute Care",
      "display" : "CDC/NHSN COVID-19 Acute Care Module Home Page",
      "citation" : "Centers for Disease Control and Prevention (CDC), National Healthcare Safety Network (NHSN)",
      "url" : "https://www.cdc.gov/nhsn/acute-care-hospital/covid19/"
    },
    {
      "type" : "documentation",
      "label" : "How to import COVID-19 Summary Data",
      "display" : "Facility - How to Upload COVID-19 CSV Data Files",
      "citation" : "Centers for Disease Control and Prevention (CDC), National Healthcare Safety Network (NHSN)",
      "url" : "https://www.cdc.gov/nhsn/pdfs/covid19/import-covid19-data-508.pdf"
    },
    {
      "type" : "documentation",
      "label" : "COVID-19 Module Analysis Reports",
      "display" : "NHSN COVID-19 Module Analysis Reports",
      "citation" : "Centers for Disease Control and Prevention (CDC), National Healthcare Safety Network (NHSN)",
      "url" : "https://www.cdc.gov/nhsn/pdfs/covid19/fac-analysis-qrg-508.pdf"
    },
    {
      "type" : "documentation",
      "label" : "Table of Instructions",
      "display" : "Instructions for Completion of the COVID-19 Healthcare Worker Staffing Pathway (CDC 57.131)",
      "citation" : "Centers for Disease Control and Prevention (CDC), National Healthcare Safety Network (NHSN)",
      "url" : "https://www.cdc.gov/nhsn/pdfs/covid19/57.131-toi-508.pdf"
    },
    {
      "type" : "documentation",
      "label" : "PDF Form",
      "display" : "Healthcare Worker Staffing Pathway Form",
      "citation" : "Centers for Disease Control and Prevention (CDC), National Healthcare Safety Network (NHSN)",
      "url" : "https://www.cdc.gov/nhsn/pdfs/covid19/57.131-covid19-hwp-blank-p.pdf"
    },
    {
      "type" : "documentation",
      "label" : "CSV File Template",
      "display" : "CDC/NHSN COVID-19 Acute Care Healthcare Supply Reporting CSV File Template",
      "citation" : "Centers for Disease Control and Prevention (CDC), National Healthcare Safety Network (NHSN)",
      "url" : "https://www.cdc.gov/nhsn/pdfs/covid19/facility-import-hcw.csv"
    }
  ],
  "type" : [
    {
      "coding" : [
        {
          "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
          "code" : "composite"
        }
      ]
    }
  ],
  "group" : [
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  },
                  {
                    "system" : "http://snomed.info/sct",
                    "code" : "45956004",
                    "display" : "Sanitarian"
                  }
                ],
                "text" : "Environmental services"
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "shortenvsvc"
          }
        ],
        "text" : "Front-line persons who clean patient rooms and all areas in a healthcare facility"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "true"
              }
            ]
          },
          "description" : "YES - Front-line persons who clean patient rooms and all areas in a healthcare facility",
          "criteria" : {
            "description" : "Environmental services",
            "name" : "shortenvsvcTrue",
            "language" : "text/plain",
            "expression" : "true"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "false"
              }
            ]
          },
          "description" : "NO - Front-line persons who clean patient rooms and all areas in a healthcare facility",
          "criteria" : {
            "description" : "Environmental services",
            "name" : "shortenvsvcFalse",
            "language" : "text/plain",
            "expression" : "false"
          }
        }
      ]
    },
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  },
                  {
                    "system" : "http://snomed.info/sct",
                    "code" : "106293008",
                    "display" : "Nursing Personell"
                  }
                ],
                "text" : "Nurses"
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "shortnurse"
          }
        ],
        "text" : "Registered nurses and licensed practical nurses"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "true"
              }
            ]
          },
          "description" : "YES - Registered nurses and licensed practical nurses",
          "criteria" : {
            "description" : "Nurses",
            "name" : "shortnurseTrue",
            "language" : "text/plain",
            "expression" : "true"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "false"
              }
            ]
          },
          "description" : "NO - Registered nurses and licensed practical nurses",
          "criteria" : {
            "description" : "Nurses",
            "name" : "shortnurseFalse",
            "language" : "text/plain",
            "expression" : "false"
          }
        }
      ]
    },
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  },
                  {
                    "system" : "http://snomed.info/sct",
                    "code" : "442867008",
                    "display" : "Respiratory therapist"
                  }
                ],
                "text" : "Respiratory therapists"
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "shortrt"
          }
        ],
        "text" : "Certified medical professionals who specialize in knowledge and use of mechanical ventilation as well as other programs for respiratory care"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "true"
              }
            ]
          },
          "description" : "YES - Certified medical professionals who specialize in knowledge and use of mechanical ventilation as well as other programs for respiratory care",
          "criteria" : {
            "description" : "Respiratory therapists",
            "name" : "shortrtTrue",
            "language" : "text/plain",
            "expression" : "true"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "false"
              }
            ]
          },
          "description" : "NO - Certified medical professionals who specialize in knowledge and use of mechanical ventilation as well as other programs for respiratory care",
          "criteria" : {
            "description" : "Respiratory therapists",
            "name" : "shortrtFalse",
            "language" : "text/plain",
            "expression" : "false"
          }
        }
      ]
    },
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  },
                  {
                    "system" : "http://snomed.info/sct",
                    "code" : "46255001",
                    "display" : "Pharmacist"
                  }
                ],
                "text" : "Pharmacists and pharmacy techs"
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "shortphar"
          }
        ],
        "text" : "Pharmacists and pharmacy techs"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "true"
              }
            ]
          },
          "description" : "YES - Pharmacists and pharmacy techs",
          "criteria" : {
            "description" : "Pharmacists and pharmacy techs",
            "name" : "shortpharTrue",
            "language" : "text/plain",
            "expression" : "true"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "false"
              }
            ]
          },
          "description" : "NO - Pharmacists and pharmacy techs",
          "criteria" : {
            "description" : "Pharmacists and pharmacy techs",
            "name" : "shortpharFalse",
            "language" : "text/plain",
            "expression" : "false"
          }
        }
      ]
    },
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  },
                  {
                    "system" : "http://snomed.info/sct",
                    "code" : "309343006",
                    "display" : "Physician"
                  }
                ],
                "text" : "Physicians"
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "shortphys"
          }
        ],
        "text" : "Attending physicians, fellows"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "true"
              }
            ]
          },
          "description" : "YES - Attending physicians, fellows",
          "criteria" : {
            "description" : "Physicians",
            "name" : "shortphysTrue",
            "language" : "text/plain",
            "expression" : "true"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "false"
              }
            ]
          },
          "description" : "NO - Attending physicians, fellows",
          "criteria" : {
            "description" : "Physicians",
            "name" : "shortphysFalse",
            "language" : "text/plain",
            "expression" : "false"
          }
        }
      ]
    },
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  },
                  {
                    "system" : "http://snomed.info/sct",
                    "code" : "405623001",
                    "display" : "Assigned practitioner"
                  }
                ],
                "text" : "Temporary physicians, nurses, respiratory therapists, and pharmacists"
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "shorttemp"
          }
        ],
        "text" : "'per diems', 'travelers', retired, or other seasonal or intermittently contracted persons"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "true"
              }
            ]
          },
          "description" : "YES - 'per diems', 'travelers', retired, or other seasonal or intermittently contracted persons",
          "criteria" : {
            "description" : "Temporary physicians, nurses, respiratory therapists, and pharmacists",
            "name" : "shorttempTrue",
            "language" : "text/plain",
            "expression" : "true"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "false"
              }
            ]
          },
          "description" : "NO - 'per diems', 'travelers', retired, or other seasonal or intermittently contracted persons",
          "criteria" : {
            "description" : "Temporary physicians, nurses, respiratory therapists, and pharmacists",
            "name" : "shorttempFalse",
            "language" : "text/plain",
            "expression" : "false"
          }
        }
      ]
    },
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  },
                  {
                    "system" : "http://snomed.info/sct",
                    "code" : "33738006",
                    "display" : "Other medical/dental/veterinary/related worker"
                  }
                ],
                "text" : "Other HCP"
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "shortoth"
          }
        ],
        "text" : "Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "true"
              }
            ]
          },
          "description" : "YES - Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above",
          "criteria" : {
            "description" : "Other HCP",
            "name" : "shortothTrue",
            "language" : "text/plain",
            "expression" : "true"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "false"
              }
            ]
          },
          "description" : "NO - Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above",
          "criteria" : {
            "description" : "Other HCP",
            "name" : "shortothFalse",
            "language" : "text/plain",
            "expression" : "false"
          }
        }
      ]
    },
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  },
                  {
                    "system" : "http://snomed.info/sct",
                    "code" : "158965000",
                    "display" : "Medical practitioner"
                  }
                ],
                "text" : "Other licensed independent practitioners"
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "shortothlic"
          }
        ],
        "text" : "Advanced practice nurses, physician assistants"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "true"
              }
            ]
          },
          "description" : "YES - Advanced practice nurses, physician assistants",
          "criteria" : {
            "description" : "Other licensed independent practitioners",
            "name" : "shortothlicTrue",
            "language" : "text/plain",
            "expression" : "true"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "false"
              }
            ]
          },
          "description" : "NO - Advanced practice nurses, physician assistants",
          "criteria" : {
            "description" : "Other licensed independent practitioners",
            "name" : "shortothlicFalse",
            "language" : "text/plain",
            "expression" : "false"
          }
        }
      ]
    },
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  }
                ],
                "text" : "Persons who work in the facility"
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "shortothsfy"
          }
        ],
        "text" : "Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above"
      }
    },
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  }
                ]
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "posshortenvsvc"
          }
        ],
        "text" : "Front-line persons who clean patient rooms and all areas in a healthcare facility"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "true"
              }
            ]
          },
          "description" : "YES - Front-line persons who clean patient rooms and all areas in a healthcare facility",
          "criteria" : {
            "description" : "Environmental services",
            "name" : "posshortenvsvcTrue",
            "language" : "text/plain",
            "expression" : "true"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "false"
              }
            ]
          },
          "description" : "NO - Front-line persons who clean patient rooms and all areas in a healthcare facility",
          "criteria" : {
            "description" : "Environmental services",
            "name" : "posshortenvsvcFalse",
            "language" : "text/plain",
            "expression" : "false"
          }
        }
      ]
    },
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  }
                ]
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "posshortnurse"
          }
        ],
        "text" : "Registered nurses and licensed practical nurses"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "true"
              }
            ]
          },
          "description" : "YES - Registered nurses and licensed practical nurses",
          "criteria" : {
            "description" : "Nurses",
            "name" : "posshortnurseTrue",
            "language" : "text/plain",
            "expression" : "true"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "false"
              }
            ]
          },
          "description" : "NO - Registered nurses and licensed practical nurses",
          "criteria" : {
            "description" : "Nurses",
            "name" : "posshortnurseFalse",
            "language" : "text/plain",
            "expression" : "false"
          }
        }
      ]
    },
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  }
                ]
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "posshortrt"
          }
        ],
        "text" : "Certified medical professionals who specialize in knowledge and use of mechanical ventilation as well as other programs for respiratory care"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "true"
              }
            ]
          },
          "description" : "YES - Certified medical professionals who specialize in knowledge and use of mechanical ventilation as well as other programs for respiratory care",
          "criteria" : {
            "description" : "Respiratory therapists",
            "name" : "posshortrtTrue",
            "language" : "text/plain",
            "expression" : "true"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "false"
              }
            ]
          },
          "description" : "NO - Certified medical professionals who specialize in knowledge and use of mechanical ventilation as well as other programs for respiratory care",
          "criteria" : {
            "description" : "Respiratory therapists",
            "name" : "posshortrtFalse",
            "language" : "text/plain",
            "expression" : "false"
          }
        }
      ]
    },
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  }
                ]
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "posshortphar"
          }
        ],
        "text" : "Pharmacists and pharmacy techs"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "true"
              }
            ]
          },
          "description" : "YES - Pharmacists and pharmacy techs",
          "criteria" : {
            "description" : "Pharmacists and pharmacy techs",
            "name" : "posshortpharTrue",
            "language" : "text/plain",
            "expression" : "true"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "false"
              }
            ]
          },
          "description" : "NO - Pharmacists and pharmacy techs",
          "criteria" : {
            "description" : "Pharmacists and pharmacy techs",
            "name" : "posshortpharFalse",
            "language" : "text/plain",
            "expression" : "false"
          }
        }
      ]
    },
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  }
                ]
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "posshortphys"
          }
        ],
        "text" : "Attending physicians, fellows"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "true"
              }
            ]
          },
          "description" : "YES - Attending physicians, fellows",
          "criteria" : {
            "description" : "Physicians",
            "name" : "posshortphysTrue",
            "language" : "text/plain",
            "expression" : "true"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "false"
              }
            ]
          },
          "description" : "NO - Attending physicians, fellows",
          "criteria" : {
            "description" : "Physicians",
            "name" : "posshortphysFalse",
            "language" : "text/plain",
            "expression" : "false"
          }
        }
      ]
    },
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  }
                ]
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "posshorttemp"
          }
        ],
        "text" : "'per diems', 'travelers', retired, or other seasonal or intermittently contracted persons"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "true"
              }
            ]
          },
          "description" : "YES - 'per diems', 'travelers', retired, or other seasonal or intermittently contracted persons",
          "criteria" : {
            "description" : "Temporary physicians, nurses, respiratory therapists, and pharmacists",
            "name" : "posshorttempTrue",
            "language" : "text/plain",
            "expression" : "true"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "false"
              }
            ]
          },
          "description" : "NO - 'per diems', 'travelers', retired, or other seasonal or intermittently contracted persons",
          "criteria" : {
            "description" : "Temporary physicians, nurses, respiratory therapists, and pharmacists",
            "name" : "posshorttempFalse",
            "language" : "text/plain",
            "expression" : "false"
          }
        }
      ]
    },
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  }
                ]
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "posshortoth"
          }
        ],
        "text" : "Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above."
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "true"
              }
            ]
          },
          "description" : "YES - Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above.",
          "criteria" : {
            "description" : "Other HCP",
            "name" : "posshortothTrue",
            "language" : "text/plain",
            "expression" : "true"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "false"
              }
            ]
          },
          "description" : "NO - Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above.",
          "criteria" : {
            "description" : "Other HCP",
            "name" : "posshortothFalse",
            "language" : "text/plain",
            "expression" : "false"
          }
        }
      ]
    },
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  }
                ]
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "posshortothlic"
          }
        ],
        "text" : "Advanced practice nurses, physician assistants"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "true"
              }
            ]
          },
          "description" : "YES - Advanced practice nurses, physician assistants",
          "criteria" : {
            "description" : "Other licensed independent practitioners",
            "name" : "posshortothlicTrue",
            "language" : "text/plain",
            "expression" : "true"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://terminology.hl7.org/CodeSystem/special-values",
                "code" : "false"
              }
            ]
          },
          "description" : "NO - Advanced practice nurses, physician assistants",
          "criteria" : {
            "description" : "Other licensed independent practitioners",
            "name" : "posshortothlicFalse",
            "language" : "text/plain",
            "expression" : "false"
          }
        }
      ]
    },
    {
      "extension" : [
        {
          "extension" : [
            {
              "url" : "scoring",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-scoring",
                    "code" : "continuous-variable"
                  }
                ]
              }
            },
            {
              "url" : "subject",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://hl7.org/fhir/resource-types",
                    "code" : "Practitioner"
                  }
                ]
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "structure"
                  }
                ]
              }
            },
            {
              "url" : "improvementNotation",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-improvement-notation",
                    "code" : "increase"
                  }
                ]
              }
            },
            {
              "url" : "rateAggregation",
              "valueString" : "aggregable-by-period"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner",
            "code" : "posshortothsfy"
          }
        ],
        "text" : "Persons who work in the facility, regardless of clinical responsibility or patient contact not included in categories above."
      }
    }
  ]
}

export default CDCHealthcareWorkerStaffingPathway;