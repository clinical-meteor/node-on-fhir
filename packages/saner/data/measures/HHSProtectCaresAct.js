const HHSProtectCaresActReport = {
  "resourceType" : "Measure",
  "id" : "HHSProtectCaresActReport",
  "meta" : {
    "profile" : [
      "http://hl7.org/fhir/us/saner/StructureDefinition/PublicHealthMeasure"
    ]
  },
  "text" : {
    "status" : "generated",
    "div" : "<div></div>"
  },
  "url" : "http://hl7.org/fhir/us/saner/Measure/HHSProtectCaresActReport",
  "version" : "0.1.0",
  "name" : "HHSProtectCaresActReport",
  "title" : "HHS Protect - Cares Act Report",
  "status" : "draft",
  "experimental" : true,
  "date" : "2020-05-15T14:48:47+00:00",
  "publisher" : "US Department of Health and Human Services",
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
      "name" : "Symptomatic, LLC",
      "telecom" : [
        {
          "system" : "url",
          "value" : "https://www.symptomatic.healthcare"
        }
      ]
    },
    {
      "name" : "Abigail Watson",
      "telecom" : [
        {
          "system" : "email",
          "value" : "mailto:abigail@symptomatic.healthcare"
        }
      ]
    }
  ],
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
            "code" : "840539006",
            "display" : "COVID-19"
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
      "name" : "Health and Human Services",
      "telecom" : [
        {
          "system" : "email",
          "value" : "mailto:????@hhs.gov"
        }
      ]
    }
  ],
  "relatedArtifact" : [
    {
      "type" : "documentation",
      "label" : "CARES Act Section 18115",
      "display" : "COVID-19 Pandemic Response, Laboratory Data Reporting",
      "url" : "https://www.hhs.gov/sites/default/files/covid-19-laboratory-data-reporting-guidance.pdf"
    },
    {
      "type" : "documentation",
      "label" : "CARES Act Section 18115 - Specifications",
      "display" : "COVID-19 Lab Data Reporting Implementation Specifications",
      "url" : "https://www.hhs.gov/sites/default/files/hhs-guidance-implementation.pdf"
    }
  ],
  "definition" : [],
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
                    "code" : "Location"
                  },
                  {
                    "system" : "http://snomed.info/sct",
                    "code" : "91537007",
                    "display" : "Hospital bed, device (physical object)"
                  }
                ],
                "text" : "Hospital Beds"
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
            "system" : "http://hl7.org/fhir/us/saner/CodeSystem/CaresAct",
            "code" : "18115",
            "display" : "Section 18115"
          }
        ],
        "text" : "18115"
      },
      "description": "Laboratory Data Reporting",
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/CaresActDataElements",
                "code" : "1",
                "display" : "Test ordered"
              },
              {
                "system" : "http://hl7.org/v2",
                "code" : "OBR-4"
              },
              {
                "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                "code" : "initial-population"
              }
            ],
            "text" : "1"
          },
          "description" : "Test ordered"
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/CaresActDataElements",
                "code" : "2",
                "display" : "Test result (performed)"
              },
              {
                "system" : "http://hl7.org/v2",
                "code" : "OBX-3"
              },
              {
                "system" : "http://hl7.org/v2",
                "code" : "OBX-5"
              },
              {
                "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                "code" : "initial-population"
              }
            ],
            "text" : "2"
          },
          "description" : "Test result (performed)"
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/CaresActDataElements",
                "code" : "3",
                "display" : "Test result date"
              },
              {
                "system" : "http://hl7.org/v2",
                "code" : "OBX-9"
              },
              {
                "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                "code" : "initial-population"
              }
            ],
            "text" : "3"
          },
          "description" : "Test result date"
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/CaresActDataElements",
                "code" : "4",
                "display" : "Test report date"
              },
              {
                "system" : "http://hl7.org/v2",
                "code" : "OBR-22"
              },
              {
                "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                "code" : "initial-population"
              }
            ],
            "text" : "4"
          },
          "description" : "Test report date"
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/CaresActDataElements",
                "code" : "5",
                "display" : "Test ordered date"
              },
              {
                "system" : "http://hl7.org/v2",
                "code" : "ORC-15"
              },
              {
                "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                "code" : "initial-population"
              }
            ],
            "text" : "5"
          },
          "description" : "Test ordered date"
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/CaresActDataElements",
                "code" : "6",
                "display" : "Specimen collected date"
              },
              {
                "system" : "http://hl7.org/v2",
                "code" : "OBR-7.1"
              },
              {
                "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                "code" : "initial-population"
              }
            ],
            "text" : "6"
          },
          "description" : "Specimen collected date"
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/CaresActDataElements",
                "code" : "7",
                "display" : "Device Identifier"
              },
              {
                "system" : "http://hl7.org/v2",
                "code" : "OBX-17"
              },
              {
                "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                "code" : "initial-population"
              }
            ],
            "text" : "7"
          },
          "description" : "Device Identifier"
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/CaresActDataElements",
                "code" : "8",
                "display" : "Accession # / Specimen ID"
              },
              {
                "system" : "http://hl7.org/v2",
                "code" : "OBX-17"
              },
              {
                "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                "code" : "initial-population"
              }
            ],
            "text" : "8"
          },
          "description" : "Accession # / Specimen ID"
        },
      ]
    }
  ]
}

export default HHSProtectCaresActReport;