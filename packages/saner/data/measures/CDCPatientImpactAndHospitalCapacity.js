const CDCPatientImpactAndHospitalCapacity = {
  "resourceType" : "Measure",
  "id" : "CDCPatientImpactAndHospitalCapacity",
  "meta" : {
    "profile" : [
      "http://hl7.org/fhir/us/saner/StructureDefinition/PublicHealthMeasure"
    ]
  },
  "text" : {
    "status" : "generated",
    "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: CDCPatientImpactAndHospitalCapacity</p><p><b>meta</b>: </p><p><b>url</b>: <a href=\"http://hl7.org/fhir/us/saner/Measure/CDCPatientImpactAndHospitalCapacity\">http://hl7.org/fhir/us/saner/Measure/CDCPatientImpactAndHospitalCapacity</a></p><p><b>version</b>: 0.1.0</p><p><b>name</b>: CDCPatientImpactAndHospitalCapacity</p><p><b>title</b>: Patient Impact and Hospital Capacity</p><p><b>status</b>: draft</p><p><b>experimental</b>: true</p><p><b>date</b>: May 15, 2020, 2:48:47 PM</p><p><b>publisher</b>: HL7 International</p><p><b>contact</b>: HL7 Patient Administration Workgroup: http://hl7.org/Special/committees/pafm/index.cfm, Audacious Inquiry: http://ainq.com, Keith W. Boone: mailto:kboone@ainq.com</p><p><b>useContext</b>: </p><p><b>jurisdiction</b>: United States of America <span style=\"background: LightGoldenRodYellow\">(Details : {urn:iso:std:iso:3166 code 'US' = 'United States of America)</span></p><p><b>author</b>: Centers for Disease Control/National Healthcare Safety Network (CDC/NHSN): mailto:nhsn@cdc.gov</p><p><b>relatedArtifact</b>: , , , </p><p><b>definition</b>: Ventilator\n: Any device used to support, assist or control respiration (inclusive of the weaning period) through the application of positive\npressure to the airway when delivered via an artificial airway, specifically an oral/nasal endotracheal or tracheostomy tube.\nNote: Ventilation and lung expansion devices that deliver positive pressure to the airway (for example: CPAP, BiPAP, bi-level, IPPB and\nPEEP) via non-invasive means (for example: nasal prongs, nasal mask, full face mask, total mask, etc.) are not considered ventilators\nunless positive pressure is delivered via an artificial airway (oral/nasal endotracheal or tracheostomy tube).\n\nBeds\n: Baby beds in mom's room count as 1 bed, even if there are multiple baby beds\nFollow-up in progress if staffed is less than licensed.\nTotal includes all beds, even if with surge beds it exceeds licensed beds.\n\nICU beds\n: Include NICU (from CDC Webinar 31-Mar-2020) (outstanding question on burn unit)</p><blockquote><p><b>group</b></p><p><b>code</b>: Hospital Bed Reporting <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem code 'Beds' = 'Beds', given as 'Beds'})</span></p><blockquote><p><b>population</b></p><p><b>code</b>: Total number of all Inpatient and outpatient beds, including all staffed,ICU, licensed, and overflow (surge) beds used for inpatients or outpatients <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'numTotBeds' = 'All Hospital Beds', given as 'All Hospital Beds'}; {http://terminology.hl7.org/CodeSystem/measure-population code 'initial-population' = 'Initial Population)</span></p><p><b>description</b>: Enter the total number of all hospital beds, including inpatient and outpatient beds. All staffed, licensed,\nand overflow and surge/expansion beds used for inpatients or outpatients. This includes ICU beds.</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Inpatient beds, including all staffed, licensed, and overflow (surge) beds used for inpatients <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'numBeds' = 'Hospital Inpatient Beds', given as 'Hospital Inpatient Beds'})</span></p><p><b>description</b>: Required. Enter the total number of all inpatient beds, including all staffed, licensed, and overflow and surge/expansion beds created for inpatient care. This includes intensive care unit (ICU) beds.</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Total number of staffed inpatient beds that are occupied <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'numBedsOcc' = 'Hospital Inpatient Bed Occupancy', given as 'Hospital Inpatient Bed Occupancy'})</span></p><p><b>description</b>: Enter the total number of staffed inpatient beds occupied by patients at the time the data is collected, including all staffed, licensed, and overflow and surge/expansion beds created for inpatient care. This includes ICU beds.\n\nCDC Webinar 31-Mar-2020:\nBaby beds in mom's room count as 1 bed, even if there are multiple baby beds\nFollow-up in progress if staffed is less than licensed.\nTotal includes all beds, even if with surge beds it exceeds licensed beds.</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: ICU Bed Occupancy <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'numICUBeds' = 'ICU Beds', given as 'ICU Beds'})</span></p><p><b>description</b>: Enter the total number of staffed Intensive Care Unit (ICU) beds.\n\nCDC Webinar 31-Mar-2020:\nICU beds include NICU</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Total number of staffed inpatient intensive care unit (ICU) beds <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'numICUBedsOcc' = 'ICU Bed Occupancy', given as 'ICU Bed Occupancy'})</span></p><p><b>description</b>: Enter the total number of staffed ICU beds occupied by patients at the time the data is collected.\n\nCDC Webinar 31-Mar-2020:\nICU beds include NICU</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Hospital Ventilators Reporting <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem code 'Ventilators' = 'Ventilators', given as 'Ventilators'})</span></p><blockquote><p><b>population</b></p><p><b>code</b>: Total number of ventilators available <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'numVent' = 'Mechanical Ventilators', given as 'Mechanical Ventilators'}; {http://terminology.hl7.org/CodeSystem/measure-population code 'initial-population' = 'Initial Population)</span></p><p><b>description</b>: Enter the total number of mechanical ventilators, including anesthesia machines and\nportable/transport ventilators available in the facility.\nInclude BiPAP machines if the hospital uses BiPAP to deliver positive pressure ventilation via artificial airways.</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Total number of ventilators in use <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'numVentUse' = 'Mechanical Ventilators in Use', given as 'Mechanical Ventilators in Use'})</span></p><p><b>description</b>: Enter the total number of mechanical ventilators use at the time the data is collected, including anesthesia\nmachines and portable/transport ventilators. Include BiPAP machines if the hospital uses BiPAP to deliver positive pressure ventilation via artificial airways.</p><p><b>criteria</b>: </p></blockquote></blockquote><blockquote><p><b>group</b></p><p><b>code</b>: Hospital COVID-19 Encounters Reporting <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem code 'Encounters' = 'Encounters', given as 'Encounters'})</span></p><blockquote><p><b>population</b></p><p><b>code</b>: Patients currently hospitalized in an inpatient care location who have suspected or confirmed COVID-19 <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'numC19HospPats' = 'Hospitalized COVID-19 Patients', given as 'Hospitalized COVID-19 Patients'})</span></p><p><b>description</b>: Enter the number of patients hospitalized in an inpatient bed at the time the data is collected\n who have suspected or confirmed COVID-19. This includes the patients with laboratory-confirmed or clinically diagnosed COVID-19.\nConfirmed: A patient with a laboratory confirmed COVID-19 diagnosis\nSuspected: A patient without a laboratory confirmed COVID-19 diagnosis who, in accordance with CDC’s Interim Public Health Guidance\nfor Evaluating Persons Under Investigation (PUIs), has signs and symptoms compatible with COVID-19 (most patients with confirmed\nCOVID-19 have developed fever and/or symptoms of acute respiratory illness, such as cough, shortness of breath or myalgia/fatigue).</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Patients currently hospitalized in an inpatient bed who have suspected or confirmed COVID-19 and are on a mechanical ventilator <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'numC19MechVentPats' = 'Hospitalized and Ventilated COVID-19 Patients', given as 'Hospitalized and Ventilated COVID-19 Patients'})</span></p><p><b>description</b>: Enter the number of patients hospitalized in an inpatient bed who have\nsuspected or confirmed COVID-19 and are currently on a mechanical ventilator* at the time the data is collected . This includes the\npatients with laboratory-confirmed or clinically diagnosed COVID-19.</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Patients currently hospitalized in an inpatient bed with onset of suspected or\nconfirmed COVID-19 fourteen or more days after hospital admission due to a condition other than COVID-19 <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'numC19HOPats' = 'Hospital Onset COVID-19 Patients', given as 'Hospital Onset COVID-19 Patients'})</span></p><p><b>description</b>: Enter the number of patients hospitalized in an inpatient bed at the time the data is\ncollected with onset of suspected or confirmed COVID-19 fourteen or more days after hospitalization (admission date = hospital\nday 1). This includes laboratory-confirmed or clinically diagnosed COVID-19 cases.</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Patients with suspected or confirmed COVID-19 who are currently in the Emergency Department (ED) or any overflow location awaiting an inpatient bed <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'numC19OverflowPats' = 'ED/Overflow COVID-19 Patients', given as 'ED/Overflow COVID-19 Patients'})</span></p><p><b>description</b>: Enter the number of patients with suspected or confirmed COVID-19 who are in the\nEmergency Department(ED) or any overflow/expansion location awaiting placement in an inpatient bed at the time the data\nis collected . This includes patients with laboratory-confirmed or clinically diagnosed COVID-19. Overflow locations include any physical\nlocations created to accommodate patients include but not limited to 24-hour observation units, hallways, parking lots, or tents.</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Patients with suspected or confirmed COVID-19 who currently are in the ED or any overflow location awaiting an inpatient bed and on a mechanical ventilator <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'numC19OFMechVentPats' = 'ED/Overflow and Ventilated COVID-19 Patients', given as 'ED/Overflow and Ventilated COVID-19 Patients'})</span></p><p><b>description</b>: Enter the number of patients with suspected or confirmed COVID-19 who are in the ED or any overflow/expansion location on a\nmechanical ventilator* at the time the data is collected . This includes patients with laboratory-confirmed or clinically diagnosed COVID-19.</p><p><b>criteria</b>: </p></blockquote><blockquote><p><b>population</b></p><p><b>code</b>: Patients with suspected or confirmed COVID-19 who died in the hospital, ED or any overflow location on the date for which you are reporting. <span style=\"background: LightGoldenRodYellow\">(Details : {http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem code 'numC19Died' = 'COVID-19 Patient Deaths', given as 'COVID-19 Patient Deaths'})</span></p><p><b>description</b>: Enter the number of patients with suspected or confirmed COVID-19 who died in the hospital, ED, or any overflow location. This\nincludes patients with laboratory-confirmed or clinically diagnosed COVID-19. Please enter the count of deaths newly occurred, at the time\nthe data is collected instead of the cumulated number of deaths.</p><p><b>criteria</b>: </p></blockquote></blockquote></div>"
  },
  "url" : "http://hl7.org/fhir/us/saner/Measure/CDCPatientImpactAndHospitalCapacity",
  "version" : "0.1.0",
  "name" : "CDCPatientImpactAndHospitalCapacity",
  "title" : "Patient Impact and Hospital Capacity",
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
      "label" : "NHSN COVID-19 Reporting",
      "display" : "CDC/NHSN COVID-19 Patient Impact & Hospital Capacity Module Home Page",
      "url" : "https://www.cdc.gov/nhsn/acute-care-hospital/covid19/"
    },
    {
      "type" : "documentation",
      "label" : "How to import COVID-19 Summary Data",
      "display" : "Importing COVID-19 Patient Module Denominator data for Patient Safety Component",
      "url" : "https://www.cdc.gov/nhsn/pdfs/covid19/import-covid19-data-508.pdf"
    },
    {
      "type" : "documentation",
      "label" : "Table of Instructions",
      "display" : "Instructions for Completion of the COVID-19 Patient Impact and Hospital Capacity Module Form (CDC 57.130)",
      "url" : "https://www.cdc.gov/nhsn/pdfs/covid19/57.130-toi-508.pdf"
    },
    {
      "type" : "documentation",
      "label" : "CSV File Template",
      "display" : "CDC/NHSN COVID-19 Reporting CSV File Template",
      "url" : "https://www.cdc.gov/nhsn/pdfs/covid19/covid19-test-csv-import.csv"
    }
  ],
  "definition" : [
    "Ventilator\n: Any device used to support, assist or control respiration (inclusive of the weaning period) through the application of positive\npressure to the airway when delivered via an artificial airway, specifically an oral/nasal endotracheal or tracheostomy tube.\nNote: Ventilation and lung expansion devices that deliver positive pressure to the airway (for example: CPAP, BiPAP, bi-level, IPPB and\nPEEP) via non-invasive means (for example: nasal prongs, nasal mask, full face mask, total mask, etc.) are not considered ventilators\nunless positive pressure is delivered via an artificial airway (oral/nasal endotracheal or tracheostomy tube).\n\nBeds\n: Baby beds in mom's room count as 1 bed, even if there are multiple baby beds\nFollow-up in progress if staffed is less than licensed.\nTotal includes all beds, even if with surge beds it exceeds licensed beds.\n\nICU beds\n: Include NICU (from CDC Webinar 31-Mar-2020) (outstanding question on burn unit)"
  ],
  "group" : [
    {
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
            "code" : "Beds",
            "display" : "Beds"
          }
        ],
        "text" : "Hospital Bed Reporting"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "numTotBeds",
                "display" : "All Hospital Beds"
              },
              {
                "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                "code" : "initial-population"
              }
            ],
            "text" : "Total number of all Inpatient and outpatient beds, including all staffed,ICU, licensed, and overflow (surge) beds used for inpatients or outpatients"
          },
          "description" : "Enter the total number of all hospital beds, including inpatient and outpatient beds. All staffed, licensed,\nand overflow and surge/expansion beds used for inpatients or outpatients. This includes ICU beds.",
          "criteria" : {
            "description" : "A bed in any location",
            "name" : "numTotBeds",
            "language" : "text/fhirpath",
            "expression" : "Device.where(type in %ValueSet-BedDeviceTypes and location.physicalType in %ValueSet-BedLocationTypes)"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "numBeds",
                "display" : "Hospital Inpatient Beds"
              }
            ],
            "text" : "Inpatient beds, including all staffed, licensed, and overflow (surge) beds used for inpatients"
          },
          "description" : "Required. Enter the total number of all inpatient beds, including all staffed, licensed, and overflow and surge/expansion beds created for inpatient care. This includes intensive care unit (ICU) beds.",
          "criteria" : {
            "description" : "A Bed where the location is an inpatient location.",
            "name" : "numBeds",
            "language" : "text/fhirpath",
            "expression" : "%numTotBeds.where(location.type in %ValueSet-InpatientLocations)"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "numBedsOcc",
                "display" : "Hospital Inpatient Bed Occupancy"
              }
            ],
            "text" : "Total number of staffed inpatient beds that are occupied"
          },
          "description" : "Enter the total number of staffed inpatient beds occupied by patients at the time the data is collected, including all staffed, licensed, and overflow and surge/expansion beds created for inpatient care. This includes ICU beds.\n\nCDC Webinar 31-Mar-2020:\nBaby beds in mom's room count as 1 bed, even if there are multiple baby beds\nFollow-up in progress if staffed is less than licensed.\nTotal includes all beds, even if with surge beds it exceeds licensed beds.",
          "criteria" : {
            "description" : "An Inpatient Bed where the Bed is occupied.",
            "name" : "numBedsOcc",
            "language" : "text/fhirpath",
            "expression" : "%numBeds.where(location.operationalStatus = %ValueSet-OccupiedBed)"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "numICUBeds",
                "display" : "ICU Beds"
              }
            ],
            "text" : "ICU Bed Occupancy"
          },
          "description" : "Enter the total number of staffed Intensive Care Unit (ICU) beds.\n\nCDC Webinar 31-Mar-2020:\nICU beds include NICU",
          "criteria" : {
            "description" : "A Bed where the location is an inpatient ICU location.",
            "name" : "numICUBeds",
            "language" : "text/fhirpath",
            "expression" : "%numBeds.where(location.type in %ValueSet-ICULocations)"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "numICUBedsOcc",
                "display" : "ICU Bed Occupancy"
              }
            ],
            "text" : "Total number of staffed inpatient intensive care unit (ICU) beds"
          },
          "description" : "Enter the total number of staffed ICU beds occupied by patients at the time the data is collected.\n\nCDC Webinar 31-Mar-2020:\nICU beds include NICU",
          "criteria" : {
            "description" : "An ICU Bed that is occupied.",
            "name" : "numICUBedsOcc",
            "language" : "text/fhirpath",
            "expression" : "%numICUBeds.where(location.operationalStatus = %ValueSet-OccupiedBed)"
          }
        }
      ]
    },
    {
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
            "code" : "Ventilators",
            "display" : "Ventilators"
          }
        ],
        "text" : "Hospital Ventilators Reporting"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "numVent",
                "display" : "Mechanical Ventilators"
              },
              {
                "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                "code" : "initial-population"
              }
            ],
            "text" : "Total number of ventilators available"
          },
          "description" : "Enter the total number of mechanical ventilators, including anesthesia machines and\nportable/transport ventilators available in the facility.\nInclude BiPAP machines if the hospital uses BiPAP to deliver positive pressure ventilation via artificial airways.",
          "criteria" : {
            "description" : "A Device that is used for ventilation and could be used (e.g., not broken, transferred, etc)",
            "name" : "numVent",
            "language" : "text/fhirpath",
            "expression" : "Device.where(type in %ValueSet-VentilatorDevices and status = active)"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "numVentUse",
                "display" : "Mechanical Ventilators in Use"
              }
            ],
            "text" : "Total number of ventilators in use"
          },
          "description" : "Enter the total number of mechanical ventilators use at the time the data is collected, including anesthesia\nmachines and portable/transport ventilators. Include BiPAP machines if the hospital uses BiPAP to deliver positive pressure ventilation via artificial airways.",
          "criteria" : {
            "description" : "A ventilator that is attached to a patient.",
            "name" : "numVentUse",
            "language" : "text/fhirpath",
            "expression" : "%numVent.where(patient!={})"
          }
        }
      ]
    },
    {
      "code" : {
        "coding" : [
          {
            "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
            "code" : "Encounters",
            "display" : "Encounters"
          }
        ],
        "text" : "Hospital COVID-19 Encounters Reporting"
      },
      "population" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "numC19HospPats",
                "display" : "Hospitalized COVID-19 Patients"
              }
            ],
            "text" : "Patients currently hospitalized in an inpatient care location who have suspected or confirmed COVID-19"
          },
          "description" : "Enter the number of patients hospitalized in an inpatient bed at the time the data is collected\n who have suspected or confirmed COVID-19. This includes the patients with laboratory-confirmed or clinically diagnosed COVID-19.\nConfirmed: A patient with a laboratory confirmed COVID-19 diagnosis\nSuspected: A patient without a laboratory confirmed COVID-19 diagnosis who, in accordance with CDC’s Interim Public Health Guidance\nfor Evaluating Persons Under Investigation (PUIs), has signs and symptoms compatible with COVID-19 (most patients with confirmed\nCOVID-19 have developed fever and/or symptoms of acute respiratory illness, such as cough, shortness of breath or myalgia/fatigue).",
          "criteria" : {
            "description" : "An COVID-19 encounter where the active location is an inpatient location",
            "name" : "numC19HospPats",
            "language" : "text/fhirpath",
            "expression" : "%numC19Pats.where(location.where(status='active' and type in %ValueSet-InpatientLocations))"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "numC19MechVentPats",
                "display" : "Hospitalized and Ventilated COVID-19 Patients"
              }
            ],
            "text" : "Patients currently hospitalized in an inpatient bed who have suspected or confirmed COVID-19 and are on a mechanical ventilator"
          },
          "description" : "Enter the number of patients hospitalized in an inpatient bed who have\nsuspected or confirmed COVID-19 and are currently on a mechanical ventilator* at the time the data is collected . This includes the\npatients with laboratory-confirmed or clinically diagnosed COVID-19.",
          "criteria" : {
            "description" : "An COVID-19 encounter in an inpatient setting on a ventilator",
            "name" : "numC19OFMechVentPats",
            "language" : "text/fhirpath",
            "expression" : "%numC19HospPats.intersect(%numC19VentPats)"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "numC19HOPats",
                "display" : "Hospital Onset COVID-19 Patients"
              }
            ],
            "text" : "Patients currently hospitalized in an inpatient bed with onset of suspected or\nconfirmed COVID-19 fourteen or more days after hospital admission due to a condition other than COVID-19"
          },
          "description" : "Enter the number of patients hospitalized in an inpatient bed at the time the data is\ncollected with onset of suspected or confirmed COVID-19 fourteen or more days after hospitalization (admission date = hospital\nday 1). This includes laboratory-confirmed or clinically diagnosed COVID-19 cases.",
          "criteria" : {
            "description" : "Encounters associated with suspected or confirmed COVID-19 with onset > 14 days after start",
            "name" : "numC19HOPats",
            "language" : "text/fhirpath",
            "expression" : "dition.where(\ncode in %ValueSet-SuspectedOrDiagnosedCOVID19\nand encounter in %numC19HospPats\nand onset + 14 days > encounter.period.start).encounter"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "numC19OverflowPats",
                "display" : "ED/Overflow COVID-19 Patients"
              }
            ],
            "text" : "Patients with suspected or confirmed COVID-19 who are currently in the Emergency Department (ED) or any overflow location awaiting an inpatient bed"
          },
          "description" : "Enter the number of patients with suspected or confirmed COVID-19 who are in the\nEmergency Department(ED) or any overflow/expansion location awaiting placement in an inpatient bed at the time the data\nis collected . This includes patients with laboratory-confirmed or clinically diagnosed COVID-19. Overflow locations include any physical\nlocations created to accommodate patients include but not limited to 24-hour observation units, hallways, parking lots, or tents.",
          "criteria" : {
            "description" : "An COVID-19 encounter where the active location is an ED or Overflow location",
            "name" : "numC19OverflowPats",
            "language" : "text/fhirpath",
            "expression" : "%numC19Pats.where(location.where(status='active' and type in %ValueSet-EDorOverflowLocations))"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "numC19OFMechVentPats",
                "display" : "ED/Overflow and Ventilated COVID-19 Patients"
              }
            ],
            "text" : "Patients with suspected or confirmed COVID-19 who currently are in the ED or any overflow location awaiting an inpatient bed and on a mechanical ventilator"
          },
          "description" : "Enter the number of patients with suspected or confirmed COVID-19 who are in the ED or any overflow/expansion location on a\nmechanical ventilator* at the time the data is collected . This includes patients with laboratory-confirmed or clinically diagnosed COVID-19.",
          "criteria" : {
            "description" : "An COVID-19 encounter where the active location is an ED or Overflow location",
            "name" : "numC19OFMechVentPats",
            "language" : "text/fhirpath",
            "expression" : "%numC19OverflowPats.intersect(%numC19VentPats)"
          }
        },
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                "code" : "numC19Died",
                "display" : "COVID-19 Patient Deaths"
              }
            ],
            "text" : "Patients with suspected or confirmed COVID-19 who died in the hospital, ED or any overflow location on the date for which you are reporting."
          },
          "description" : "Enter the number of patients with suspected or confirmed COVID-19 who died in the hospital, ED, or any overflow location. This\nincludes patients with laboratory-confirmed or clinically diagnosed COVID-19. Please enter the count of deaths newly occurred, at the time\nthe data is collected instead of the cumulated number of deaths.",
          "criteria" : {
            "description" : "All C19 Patients who have died in an encounter during the reporting period.",
            "name" : "numC19Died",
            "language" : "text/fhirpath",
            "expression" : "%numC19Pats.hospitalization.dispostion in %ValueSet-PatientDied"
          }
        }
      ]
    }
  ]
}

export default CDCPatientImpactAndHospitalCapacity;