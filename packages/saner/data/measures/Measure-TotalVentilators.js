const totalVentilatorsMeasure = {
  "resourceType": "Measure",
  "id": "e8-H2kvdTuFUBWb2RX967fw3",
  "name": "ICU Total Ventilators",
  "title": "Total Ventilators",
  "status": "draft",
  "date": "2020-03-30T23:38:55Z",
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
  "description": "The number of ventilators available for use.",
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
  ]
}

export default totalVentilatorsMeasure;