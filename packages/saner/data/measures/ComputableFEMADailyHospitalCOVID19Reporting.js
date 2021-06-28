const ComputableFEMADailyHospitalCOVID19Reporting = {
  "resourceType" : "Measure",
  "id" : "ComputableFEMADailyHospitalCOVID19Reporting",
  "meta" : {
    "profile" : [
      "http://hl7.org/fhir/us/saner/StructureDefinition/PublicHealthMeasure"
    ]
  },
  "text" : {
    "status" : "generated",
    "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: ComputableFEMADailyHospitalCOVID19Reporting</p><p><b>meta</b>: </p><p><b>url</b>: <a href=\"http://hl7.org/fhir/us/saner/Measure/ComputableFEMADailyHospitalCOVID19Reporting\">http://hl7.org/fhir/us/saner/Measure/ComputableFEMADailyHospitalCOVID19Reporting</a></p><p><b>version</b>: 0.1.0</p><p><b>name</b>: ComputableFEMADailyHospitalCOVID19Reporting</p><p><b>status</b>: draft</p><p><b>experimental</b>: true</p><p><b>date</b>: May 15, 2020, 2:48:47 PM</p><p><b>publisher</b>: HL7 International</p><p><b>contact</b>: HL7 Patient Administration Workgroup: http://hl7.org/Special/committees/pafm/index.cfm, Audacious Inquiry: http://ainq.com, Keith W. Boone: mailto:kboone@ainq.com</p><p><b>useContext</b>: </p><p><b>jurisdiction</b>: United States of America <span style=\"background: LightGoldenRodYellow\">(Details : {urn:iso:std:iso:3166 code 'US' = 'United States of America)</span></p><p><b>topic</b>: Immunology laboratory test (procedure) <span style=\"background: LightGoldenRodYellow\">(Details : {SNOMED CT code '252318005' = 'Immunology laboratory test', given as 'Immunology laboratory test (procedure)'})</span></p><p><b>author</b>: FEMA: mailto:fema-hhs-covid-diagnostics-tf@fema.dhs.gov&nbsp;</p><p><b>relatedArtifact</b>: , , , </p><p><b>type</b>: Outcome <span style=\"background: LightGoldenRodYellow\">(Details : {http://terminology.hl7.org/CodeSystem/measure-type code 'outcome' = 'Outcome)</span></p><p><b>rateAggregation</b>: aggregable-by-period</p><blockquote><p><b>group</b></p><p><b>code</b>: # of new positive test results released / # of total new tests released for previous date queried <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem code 'positiveIncreasePercent' = 'Percent Positive among Newly Resulted Tests', given as 'Percent Positive among Newly Resulted Tests'})</span></p><blockquote><p><b>population</b></p><p><b>code</b>: Midnight to midnight cutoff, tests ordered on previous date queried <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'totalOrdersIncrease' = 'New Diagnostic Tests Ordered/Received', given as 'New Diagnostic Tests Ordered/Received'}; {http://terminology.hl7.org/CodeSystem/measure-population code 'initial-population' = 'Initial Population)</span></p><p><b>description</b>: Enter the number of new Diagnostic Tests Ordered/Received during the reporting period.</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Midnight to midnight cutoff, test results released on previous date queried <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'totalTestResultsIncrease' = 'New Tests Resulted', given as 'New Tests Resulted'}; {http://terminology.hl7.org/CodeSystem/measure-population code 'denominator' = 'Denominator)</span></p><p><b>description</b>: nter the number of results recieved/generated during the reporting period.\nDo not include results where the test could not be completed because the specimen\nwas rejected or a positive/negative result could not be established</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Midnight to midnight cutoff, positive test results released on previous date queried <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'positiveIncrease' = 'New Positive COVID-19 Tests', given as 'New Positive COVID-19 Tests'}; {http://terminology.hl7.org/CodeSystem/measure-population code 'numerator' = 'Numerator)</span></p><p><b>description</b>: Enter the number of positive test results released during the reporting period.</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: # of total positive results to released date / # of total tests results released to date <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem code 'positivePercent' = 'Cumulative Percent Positive among Resulted Tests', given as 'Cumulative Percent Positive among Resulted Tests'})</span></p><blockquote><p><b>population</b></p><p><b>code</b>: All tests ordered to date. <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'totalOrders' = 'Cumulative Diagnostic Tests Ordered/Received', given as 'Cumulative Diagnostic Tests Ordered/Received'}; {http://terminology.hl7.org/CodeSystem/measure-population code 'initial-population' = 'Initial Population)</span></p><p><b>description</b>: Enter the cumulative number of tests ordered to date.</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: All specimens rejected for testing to date <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'rejected' = 'Cumulative Specimens Rejected', given as 'Cumulative Specimens Rejected'}; {http://terminology.hl7.org/CodeSystem/measure-population code 'denominator-exclusion' = 'Denominator Exclusion)</span></p><p><b>description</b>: Enter the cumulative number of specimens rejected for testing to date.</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: All tests with results released to date <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'totalTestResults' = 'Cumulative Tests Performed', given as 'Cumulative Tests Performed'}; {http://terminology.hl7.org/CodeSystem/measure-population code 'denominator' = 'Denominator)</span></p><p><b>description</b>: nter the total number tests with results released to date. Do not include tests where a\npositive/negative result could not be determined (e.g., because the specimen was inadequate).</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: All positive test results released to date <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'positive' = 'Cumulative Positive COVID-19 Tests', given as 'Cumulative Positive COVID-19 Tests'}; {http://terminology.hl7.org/CodeSystem/measure-population code 'numerator' = 'Numerator)</span></p><p><b>description</b>: Enter the total number of positive test results release to date.</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Reports to date including corrected, amended and canceled reports <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'allReports' = 'All Laboratory Reports for any Order', given as 'All Laboratory Reports for any Order'})</span></p><p><b>description</b>: This is in intermediate population used to simplify calculations</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Latest Reports to date for each order <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'latestReports' = 'Most Recent Laboratory Reports for any Order', given as 'Most Recent Laboratory Reports for any Order'})</span></p><p><b>description</b>: This is in intermediate population used to simplify calculations</p><p><b>criteria</b>: </p></blockquote></blockquote></div>"
  },
  "url" : "http://hl7.org/fhir/us/saner/Measure/ComputableFEMADailyHospitalCOVID19Reporting",
  "version" : "0.1.0",
  "name" : "ComputableFEMADailyHospitalCOVID19Reporting",
  "status" : "draft",
  "experimental" : true,
  "date" : "2020-05-15T14:48:47+00:00",
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
  "topic" : [
    {
      "coding" : [
        {
          "system" : "http://snomed.info/sct",
          "code" : "252318005",
          "display" : "Immunology laboratory test (procedure)"
        }
      ]
    }
  ],
  "author" : [
    {
      "name" : "FEMA",
      "telecom" : [
        {
          "system" : "email",
          "value" : "mailto:fema-hhs-covid-diagnostics-tf@fema.dhs.gov "
        }
      ]
    }
  ],
  "relatedArtifact" : [
    {
      "type" : "documentation",
      "label" : "CMS Press Release",
      "display" : "Trump Administration Engages America’s Hospitals in Unprecedented Data Sharing",
      "url" : "https://www.cms.gov/newsroom/press-releases/trump-administration-engages-americas-hospitals-unprecedented-data-sharing"
    },
    {
      "type" : "documentation",
      "label" : "Vice President Pence Letter to Hospital Administrators",
      "display" : "Text of a Letter from the Vice President to Hospital Administrators",
      "url" : "https://www.whitehouse.gov/briefings-statements/text-letter-vice-president-hospital-administrators/"
    },
    {
      "type" : "documentation",
      "label" : "AHA Advisory on COVID-19 Reporting",
      "display" : "Administration Requests Hospitals Report Daily on COVID-19 Testing Results, Bed and Ventilator",
      "url" : "https://www.aha.org/advisory/2020-03-30-coronavirus-update-administration-requests-hospitals-report-daily-covid-19"
    },
    {
      "type" : "documentation",
      "label" : "Excel Spreadsheet template for reporting to FEMA",
      "display" : "Template for Daily Hospital COVID-19 Reporting.xlsx",
      "url" : "https://images.magnetmail.net/images/clients/AHA_MCHF/attach/2020/March/0330/Template_for_Daily_Hospital_COVID19_Reporting.xlsx"
    }
  ],
  "type" : [
    {
      "coding" : [
        {
          "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
          "code" : "outcome"
        }
      ]
    }
  ],
  "rateAggregation" : "aggregable-by-period",
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
                    "code" : "ServiceRequest"
                  },
                  {
                    "system" : "http://snomed.info/sct",
                    "code" : "252318005",
                    "display" : "Immunology laboratory test (procedure)"
                  }
                ],
                "text" : "COVID-19 Diagnostic Testing"
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "outcome"
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
            "code" : "positiveIncreasePercent",
            "display" : "Percent Positive among Newly Resulted Tests"
          }
        ],
        "text" : "# of new positive test results released / # of total new tests released for previous date queried"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "totalOrdersIncrease",
                "display" : "New Diagnostic Tests Ordered/Received"
              },
              {
                "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                "code" : "initial-population"
              }
            ],
            "text" : "Midnight to midnight cutoff, tests ordered on previous date queried"
          },
          "description" : "Enter the number of new Diagnostic Tests Ordered/Received during the reporting period.",
          "criteria" : {
            "description" : "Orders initiated during %reportingPeriod",
            "name" : "totalOrdersIncrease",
            "language" : "text/fhirpath",
            "expression" : "ServiceRequest.where(\n    authoredOn.toDate() = %reportingPeriod /* May need to change logic to support ranges for reportingPeriod */\n    and status in ('active', 'completed')\n    and intent in ('order', 'orginal-order', 'reflex-order', 'filler-order', 'instance-order')\n)"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "totalTestResultsIncrease",
                "display" : "New Tests Resulted"
              },
              {
                "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                "code" : "denominator"
              }
            ],
            "text" : "Midnight to midnight cutoff, test results released on previous date queried"
          },
          "description" : "nter the number of results recieved/generated during the reporting period.\nDo not include results where the test could not be completed because the specimen\nwas rejected or a positive/negative result could not be established",
          "criteria" : {
            "description" : "Results recieved during reporting period",
            "name" : "totalTestResultsIncrease",
            "language" : "text/fhirpath",
            "expression" : "DiagnosticReport.where(\n    issued.toDate() = %reportingPeriod /* May need to change logic to support ranges for reportingPeriod */\n    and status in ('final, 'amended', 'corrected', 'appended')\n)"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "positiveIncrease",
                "display" : "New Positive COVID-19 Tests"
              },
              {
                "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                "code" : "numerator"
              }
            ],
            "text" : "Midnight to midnight cutoff, positive test results released on previous date queried"
          },
          "description" : "Enter the number of positive test results released during the reporting period.",
          "criteria" : {
            "description" : "Result is positive with respect to COVID-19",
            "name" : "positiveIncrease",
            "language" : "text/fhirpath",
            "expression" : "DiagnosticReport.where($this in %totalTestResultsIncrease and conclusionCode in %ValueSet-ConfirmedCOVID19Diagnosis)"
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
                    "code" : "ServiceRequest"
                  },
                  {
                    "system" : "http://snomed.info/sct",
                    "code" : "252318005",
                    "display" : "Immunology laboratory test (procedure)"
                  }
                ],
                "text" : "COVID-19 Cumulative Diagnostic Testing"
              }
            },
            {
              "url" : "type",
              "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://terminology.hl7.org/CodeSystem/measure-type",
                    "code" : "outcome"
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
              "valueString" : "cumulative"
            }
          ],
          "url" : "http://hl7.org/fhir/us/saner/StructureDefinition/MeasureGroupAttributes"
        }
      ],
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
            "code" : "positivePercent",
            "display" : "Cumulative Percent Positive among Resulted Tests"
          }
        ],
        "text" : "# of total positive results to released date / # of total tests results released to date"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "totalOrders",
                "display" : "Cumulative Diagnostic Tests Ordered/Received"
              },
              {
                "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                "code" : "initial-population"
              }
            ],
            "text" : "All tests ordered to date."
          },
          "description" : "Enter the cumulative number of tests ordered to date.",
          "criteria" : {
            "description" : "Report all active or completed test orders for a COVID-19 test authored during the reporting period",
            "name" : "totalOrders",
            "language" : "text/fhirpath",
            "expression" : "ServiceRequest.where(\n    authoredOn.toDate() <= %reportingPeriod /* May need to change logic to support ranges for reportingPeriod */\n    and status in ('active', 'completed')\n    and code in %ValueSet-COVID19DiagnosticTest\n    and intent in ('order', 'orginal-order', 'reflex-order', 'filler-order', 'instance-order')\n)"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "rejected",
                "display" : "Cumulative Specimens Rejected"
              },
              {
                "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                "code" : "denominator-exclusion"
              }
            ],
            "text" : "All specimens rejected for testing to date"
          },
          "description" : "Enter the cumulative number of specimens rejected for testing to date.",
          "criteria" : {
            "description" : "DiagnosticReport for COVID-19 where the report is unavailable because the measurement was not started or not completed.",
            "name" : "rejected",
            "language" : "text/fhirpath",
            "expression" : "DiagnosticReport.where(status = 'cancelled' and code in %ValueSet-COVID19DiagnosticTest)"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "totalTestResults",
                "display" : "Cumulative Tests Performed"
              },
              {
                "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                "code" : "denominator"
              }
            ],
            "text" : "All tests with results released to date"
          },
          "description" : "nter the total number tests with results released to date. Do not include tests where a\npositive/negative result could not be determined (e.g., because the specimen was inadequate).",
          "criteria" : {
            "description" : "Report all active or completed test orders for a COVID-19 test authored during or prior to the end of the reporting period that have had results released.",
            "name" : "totalTestResults",
            "language" : "text/fhirpath",
            "expression" : "ServiceRequest.where(\n    status in ('active', 'completed')\n    and intent in ('order', 'orginal-order', 'reflex-order', 'filler-order', 'instance-order')\n)"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "positive",
                "display" : "Cumulative Positive COVID-19 Tests"
              },
              {
                "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                "code" : "numerator"
              }
            ],
            "text" : "All positive test results released to date"
          },
          "description" : "Enter the total number of positive test results release to date.",
          "criteria" : {
            "description" : "The result is positive for COVID-19",
            "name" : "positive",
            "language" : "text/fhirpath",
            "expression" : "DiagnosticReport.where($this in %totalTestResults and conclusionCode in %ValueSet-ConfirmedCOVID19Diagnosis)"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "allReports",
                "display" : "All Laboratory Reports for any Order"
              }
            ],
            "text" : "Reports to date including corrected, amended and canceled reports"
          },
          "description" : "This is in intermediate population used to simplify calculations",
          "criteria" : {
            "description" : "Diagnostic Reports provided in response to totalOrders",
            "name" : "allReports",
            "language" : "text/fhirpath",
            "expression" : "DiagnosticReport.where(basedOn in %totalOrders)"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "latestReports",
                "display" : "Most Recent Laboratory Reports for any Order"
              }
            ],
            "text" : "Latest Reports to date for each order"
          },
          "description" : "This is in intermediate population used to simplify calculations",
          "criteria" : {
            "description" : "Most recent diagnostic reports provided in response to totalOrders",
            "name" : "latestReports",
            "language" : "text/fhirpath",
            "expression" : "TBD"
          }
        }
      ]
    }
  ]
};

export default ComputableFEMADailyHospitalCOVID19Reporting;