
const screeningMeasure = {
    "resourceType": "Measure",
    "id": "erpDBndMnJbDcARBc8hK5iQ3",
    "name": "MR COVID-19 SCREENING RATE",
    "title": "Screening Rate",
    "status": "draft",
    "date": "2020-03-28T16:47:55Z",
    "publisher": "Epic",
    "contact": [
        {
            "name": "Michael Donnelly",
            "telecom": [
                {
                    "system": "url",
                    "value": "https://chat.fhir.org/#narrow/stream/226195-Covid-19-Response/topic/Example.20Measure.20definition",
                    "rank": 1
                },
                {
                    "system": "email",
                    "value": "michael.donnelly@epic.com",
                    "rank": 2
                }
            ]
        }
    ],
    "description": "Percentage of patients with a face-to-face, telehealth, telephone, or admission encounter for whom a COVID-19 communicable disease screening was performed.",
    "useContext": [
        {
            "code": {
                "system": "http://terminology.hl7.org/CodeSystem/usage-context-type",
                "code": "focus"
            },
            "valueCodeableConcept": {
                "coding": [
                    {
                        "system": "http://snomed.info/sct",
                        "code": "840535000",
                        "display": "COVID-19"
                    }
                ],
                "text": "COVID-19"
            }
        }
    ],
    "group": [
        {
            "population": [
                {
                    "code": {
                        "coding": [
                            {
                                "code": "numerator",
                                "display": "Numerator"
                            }
                        ]
                    },
                    "description": "Patients for whom a COVID-19 communicable disease screening was performed."
                },
                {
                    "code": {
                        "coding": [
                            {
                                "code": "denominator",
                                "display": "Denominator"
                            }
                        ]
                    },
                    "description": "Patients with a face-to-face, telehealth, telephone, or admission encounter."
                }
            ]
        }
    ]
}

export default screeningMeasure;