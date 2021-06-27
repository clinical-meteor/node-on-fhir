const CDCHealthcareSupplyPathway = {
  "resourceType" : "Measure",
  "id" : "CDCHealthcareSupplyPathway",
  "meta" : {
    "profile" : [
      "http://hl7.org/fhir/StructureDefinition/Measure",
      "http://hl7.org/fhir/us/saner/StructureDefinition/PublicHealthMeasure"
    ]
  },
  "text" : {
    "status" : "generated",
    "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: CDCHealthcareSupplyPathway</p><p><b>meta</b>: </p><p><b>url</b>: <a href=\"http://hl7.org/fhir/us/saner/Measure/CDCHealthcareSupplyPathway\">http://hl7.org/fhir/us/saner/Measure/CDCHealthcareSupplyPathway</a></p><p><b>version</b>: 0.1.0</p><p><b>name</b>: CDCHealthcareSupplyPathway</p><p><b>title</b>: COVID-19 Healthcare Supply Pathway</p><p><b>status</b>: draft</p><p><b>experimental</b>: true</p><p><b>date</b>: Apr 27, 2020, 11:08:50 AM</p><p><b>publisher</b>: HL7 International</p><p><b>contact</b>: HL7 Patient Administration Workgroup: http://hl7.org/Special/committees/pafm/index.cfm, Audacious Inquiry: http://ainq.com, Keith W. Boone: mailto:kboone@ainq.com</p><p><b>description</b>: SANER implementation of the CDC COVID-19 Healthcare Supply Pathway</p><p><b>useContext</b>: </p><p><b>jurisdiction</b>: United States of America <span style=\"background: LightGoldenRodYellow\">(Details : {urn:iso:std:iso:3166 code 'US' = 'United States of America)</span></p><p><b>author</b>: Centers for Disease Control/National Healthcare Safety Network (CDC/NHSN): mailto:nhsn@cdc.gov</p><p><b>relatedArtifact</b>: , , , , , </p><p><b>type</b>: Composite <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/measure-type code 'composite' = 'Composite)</span></p><blockquote><p><b>group</b></p><p><b>code</b>: Ventilator Supply Reporting <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem code 'Ventilators' = 'Ventilators)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: any supplies, including flow sensors, tubing, connectors, valves, filters, etc <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'ventsupply' = 'Ventilator supplies (any, including tubing) - On-hand Supply)</span></p><p><b>description</b>: any supplies, including flow sensors, tubing, connectors, valves, filters, etc</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: any supplies, including flow sensors, tubing, connectors, valves, filters, etc <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'ventreuse' = 'Ventilator supplies (any, including tubing) - Reusing or Extending Use)</span></p><p><b>description</b>: any supplies, including flow sensors, tubing, connectors, valves, filters, etc</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: any supplies, including flow sensors, tubing, connectors, valves, filters, etc <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'ventobtain' = 'Ventilator supplies (any, including tubing) - Able to Obtain)</span></p><p><b>description</b>: any supplies, including flow sensors, tubing, connectors, valves, filters, etc</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: N95 Mask Supply Reporting <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem code 'N95Masks' = 'N95 masks)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: N95 masks - On-hand Supply <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'n95masksupply' = 'N95 masks - On-hand Supply)</span></p><p><b>description</b>: N95 masks</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: N95 masks - Reusing or Extending Use <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'n95maskreuse' = 'N95 masks - Reusing or Extending Use)</span></p><p><b>description</b>: N95 masks</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: N95 masks - Able to Obtain <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'n95maskobtain' = 'N95 masks - Able to Obtain)</span></p><p><b>description</b>: N95 masks</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Other Respirator Supply Reporting <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem code 'OtherRespirators' = 'Other respirators including PAPRs)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: Other respirators such as PAPRs or elastomerics <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'othrespsupply' = 'Other respirators including PAPRs - On-hand Supply)</span></p><p><b>description</b>: Other respirators such as PAPRs or elastomerics</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Other respirators such as PAPRs or elastomerics <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'othrespreuse' = 'Other respirators including PAPRs - Reusing or Extending Use)</span></p><p><b>description</b>: Other respirators such as PAPRs or elastomerics</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Other respirators such as PAPRs or elastomerics <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'othrespobtain' = 'Other respirators including PAPRs - Able to Obtain)</span></p><p><b>description</b>: Other respirators such as PAPRs or elastomerics</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Surgical Mask Supply Reporting <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem code 'SurgicalMasks' = 'Surgical masks)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: Surgical masks - On-hand Supply <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'surgmasksupply' = 'Surgical masks - On-hand Supply)</span></p><p><b>description</b>: Surgical masks</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Surgical masks - Reusing or Extending Use <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'surgmaskreuse' = 'Surgical masks - Reusing or Extending Use)</span></p><p><b>description</b>: Surgical masks</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Surgical masks - Able to Obtain <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'surgmaskobtain' = 'Surgical masks - Able to Obtain)</span></p><p><b>description</b>: Surgical masks</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Eye Protection Supply Reporting <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem code 'EyeProtection' = 'Eye protection including face shields or goggles)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: Eye protection including face shields or goggles - On-hand Supply <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'shieldsupply' = 'Eye protection including face shields or goggles - On-hand Supply)</span></p><p><b>description</b>: Eye protection including face shields or goggles</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Eye protection including face shields or goggles - Reusing or Extending Use <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'shieldreuse' = 'Eye protection including face shields or goggles - Reusing or Extending Use)</span></p><p><b>description</b>: Eye protection including face shields or goggles</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Eye protection including face shields or goggles - Able to Obtain <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'shieldobtain' = 'Eye protection including face shields or goggles - Able to Obtain)</span></p><p><b>description</b>: Eye protection including face shields or goggles</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Gown Supply Reporting <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem code 'Gown' = 'Gowns (single use))</span></p><blockquote><p><b>population</b></p><p><b>code</b>: Gowns (single use) - On-hand Supply <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'gownsupply' = 'Gowns (single use) - On-hand Supply)</span></p><p><b>description</b>: Gowns (single use)</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Gowns (single use) - Reusing or Extending Use <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'gownreuse' = 'Gowns (single use) - Reusing or Extending Use)</span></p><p><b>description</b>: Gowns (single use)</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Gowns (single use) - Able to Obtain <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'gownobtain' = 'Gowns (single use) - Able to Obtain)</span></p><p><b>description</b>: Gowns (single use)</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Glove Supply Reporting <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem code 'Glove' = 'Gloves)</span></p><blockquote><p><b>population</b></p><p><b>code</b>: Gloves - On-hand Supply <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'glovesupply' = 'Gloves - On-hand Supply)</span></p><p><b>description</b>: Gloves</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Gloves - Reusing or Extending Use <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'glovereuse' = 'Gloves - Reusing or Extending Use)</span></p><p><b>description</b>: Gloves</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Gloves - Able to Obtain <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'gloveobtain' = 'Gloves - Able to Obtain)</span></p><p><b>description</b>: Gloves</p><p><b>criteria</b>: </p></blockquote></blockquote></div>"
  },
  "url" : "http://hl7.org/fhir/us/saner/Measure/CDCHealthcareSupplyPathway",
  "version" : "0.1.0",
  "name" : "CDCHealthcareSupplyPathway",
  "title" : "COVID-19 Healthcare Supply Pathway",
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
  "description" : "SANER implementation of the CDC COVID-19 Healthcare Supply Pathway",
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
      "display" : "Instructions for Completion of the COVID-19 Healthcare Supply Pathway (CDC 57.132)",
      "citation" : "Centers for Disease Control and Prevention (CDC), National Healthcare Safety Network (NHSN)",
      "url" : "https://www.cdc.gov/nhsn/pdfs/covid19/57.132-toi-508.pdf"
    },
    {
      "type" : "documentation",
      "label" : "PDF Form",
      "display" : "Healthcare Supply Pathway Form",
      "citation" : "Centers for Disease Control and Prevention (CDC), National Healthcare Safety Network (NHSN)",
      "url" : "https://www.cdc.gov/nhsn/pdfs/covid19/57.132-covid19-sup-blank-p.pdf"
    },
    {
      "type" : "documentation",
      "label" : "CSV File Template",
      "display" : "CDC/NHSN COVID-19 Acute Care Healthcare Supply Reporting CSV File Template",
      "citation" : "Centers for Disease Control and Prevention (CDC), National Healthcare Safety Network (NHSN)",
      "url" : "https://www.cdc.gov/nhsn/pdfs/covid19/facility-import-supplies.csv"
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
                    "system" : "http://snomed.info/sct"
                  },
                  {
                    "system" : "http://snomed.info/sct",
                    "code" : "706172005"
                  }
                ],
                "text" : "Mechanical Ventilators"
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
                    "code" : "decrease"
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
            "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
            "code" : "Ventilators"
          }
        ],
        "text" : "Ventilator Supply Reporting"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "ventsupply"
              }
            ],
            "text" : "any supplies, including flow sensors, tubing, connectors, valves, filters, etc"
          },
          "description" : "any supplies, including flow sensors, tubing, connectors, valves, filters, etc",
          "criteria" : {
            "description" : "Ventilator supplies (any, including tubing)",
            "name" : "ventsupply",
            "language" : "text/plain",
            "expression" : "any supplies, including flow sensors, tubing, connectors, valves, filters, etc"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "ventreuse"
              }
            ],
            "text" : "any supplies, including flow sensors, tubing, connectors, valves, filters, etc"
          },
          "description" : "any supplies, including flow sensors, tubing, connectors, valves, filters, etc",
          "criteria" : {
            "description" : "Ventilator supplies (any, including tubing)",
            "name" : "ventreuse",
            "language" : "text/plain",
            "expression" : "any supplies, including flow sensors, tubing, connectors, valves, filters, etc"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "ventobtain"
              }
            ],
            "text" : "any supplies, including flow sensors, tubing, connectors, valves, filters, etc"
          },
          "description" : "any supplies, including flow sensors, tubing, connectors, valves, filters, etc",
          "criteria" : {
            "description" : "Ventilator supplies (any, including tubing)",
            "name" : "ventobtain",
            "language" : "text/plain",
            "expression" : "any supplies, including flow sensors, tubing, connectors, valves, filters, etc"
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
              "url" : "subject"
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
            "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
            "code" : "N95Masks"
          }
        ],
        "text" : "N95 Mask Supply Reporting"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "n95masksupply"
              }
            ]
          },
          "description" : "N95 masks",
          "criteria" : {
            "description" : "N95 masks",
            "name" : "n95masksupply",
            "language" : "text/plain",
            "expression" : "N95 masks"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "n95maskreuse"
              }
            ]
          },
          "description" : "N95 masks",
          "criteria" : {
            "description" : "N95 masks",
            "name" : "n95maskreuse",
            "language" : "text/plain",
            "expression" : "N95 masks"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "n95maskobtain"
              }
            ]
          },
          "description" : "N95 masks",
          "criteria" : {
            "description" : "N95 masks",
            "name" : "n95maskobtain",
            "language" : "text/plain",
            "expression" : "N95 masks"
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
              "url" : "subject"
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
            "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
            "code" : "OtherRespirators"
          }
        ],
        "text" : "Other Respirator Supply Reporting"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "othrespsupply"
              }
            ],
            "text" : "Other respirators such as PAPRs or elastomerics"
          },
          "description" : "Other respirators such as PAPRs or elastomerics",
          "criteria" : {
            "description" : "Other respirators including PAPRs",
            "name" : "othrespsupply",
            "language" : "text/plain",
            "expression" : "Other respirators such as PAPRs or elastomerics"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "othrespreuse"
              }
            ],
            "text" : "Other respirators such as PAPRs or elastomerics"
          },
          "description" : "Other respirators such as PAPRs or elastomerics",
          "criteria" : {
            "description" : "Other respirators including PAPRs",
            "name" : "othrespreuse",
            "language" : "text/plain",
            "expression" : "Other respirators such as PAPRs or elastomerics"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "othrespobtain"
              }
            ],
            "text" : "Other respirators such as PAPRs or elastomerics"
          },
          "description" : "Other respirators such as PAPRs or elastomerics",
          "criteria" : {
            "description" : "Other respirators including PAPRs",
            "name" : "othrespobtain",
            "language" : "text/plain",
            "expression" : "Other respirators such as PAPRs or elastomerics"
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
              "url" : "subject"
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
            "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
            "code" : "SurgicalMasks"
          }
        ],
        "text" : "Surgical Mask Supply Reporting"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "surgmasksupply"
              }
            ]
          },
          "description" : "Surgical masks",
          "criteria" : {
            "description" : "Surgical masks",
            "name" : "surgmasksupply",
            "language" : "text/plain",
            "expression" : "Surgical masks"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "surgmaskreuse"
              }
            ]
          },
          "description" : "Surgical masks",
          "criteria" : {
            "description" : "Surgical masks",
            "name" : "surgmaskreuse",
            "language" : "text/plain",
            "expression" : "Surgical masks"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "surgmaskobtain"
              }
            ]
          },
          "description" : "Surgical masks",
          "criteria" : {
            "description" : "Surgical masks",
            "name" : "surgmaskobtain",
            "language" : "text/plain",
            "expression" : "Surgical masks"
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
              "url" : "subject"
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
            "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
            "code" : "EyeProtection"
          }
        ],
        "text" : "Eye Protection Supply Reporting"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "shieldsupply"
              }
            ]
          },
          "description" : "Eye protection including face shields or goggles",
          "criteria" : {
            "description" : "Eye protection including face shields or goggles",
            "name" : "shieldsupply",
            "language" : "text/plain",
            "expression" : "Eye protection including face shields or goggles"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "shieldreuse"
              }
            ]
          },
          "description" : "Eye protection including face shields or goggles",
          "criteria" : {
            "description" : "Eye protection including face shields or goggles",
            "name" : "shieldreuse",
            "language" : "text/plain",
            "expression" : "Eye protection including face shields or goggles"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "shieldobtain"
              }
            ]
          },
          "description" : "Eye protection including face shields or goggles",
          "criteria" : {
            "description" : "Eye protection including face shields or goggles",
            "name" : "shieldobtain",
            "language" : "text/plain",
            "expression" : "Eye protection including face shields or goggles"
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
              "url" : "subject"
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
            "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
            "code" : "Gown"
          }
        ],
        "text" : "Gown Supply Reporting"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "gownsupply"
              }
            ]
          },
          "description" : "Gowns (single use)",
          "criteria" : {
            "description" : "Gowns (single use)",
            "name" : "gownsupply",
            "language" : "text/plain",
            "expression" : "Gowns (single use)"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "gownreuse"
              }
            ]
          },
          "description" : "Gowns (single use)",
          "criteria" : {
            "description" : "Gowns (single use)",
            "name" : "gownreuse",
            "language" : "text/plain",
            "expression" : "Gowns (single use)"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "gownobtain"
              }
            ]
          },
          "description" : "Gowns (single use)",
          "criteria" : {
            "description" : "Gowns (single use)",
            "name" : "gownobtain",
            "language" : "text/plain",
            "expression" : "Gowns (single use)"
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
              "url" : "subject"
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
            "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
            "code" : "Glove"
          }
        ],
        "text" : "Glove Supply Reporting"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "glovesupply"
              }
            ]
          },
          "description" : "Gloves",
          "criteria" : {
            "description" : "Gloves",
            "name" : "glovesupply",
            "language" : "text/plain",
            "expression" : "Gloves"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "glovereuse"
              }
            ]
          },
          "description" : "Gloves",
          "criteria" : {
            "description" : "Gloves",
            "name" : "glovereuse",
            "language" : "text/plain",
            "expression" : "Gloves"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "gloveobtain"
              }
            ]
          },
          "description" : "Gloves",
          "criteria" : {
            "description" : "Gloves",
            "name" : "gloveobtain",
            "language" : "text/plain",
            "expression" : "Gloves"
          }
        }
      ]
    }
  ]
}

export default CDCHealthcareSupplyPathway;