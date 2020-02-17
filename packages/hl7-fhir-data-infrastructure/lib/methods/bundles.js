

Meteor.methods({
    'Bundle/initialize': function(){
        console.log('Initializing a default bundle...')
        let newBundle = {
          "resourceType": "Bundle",
          "entry": [
            {
              "fullUrl": "/Composition/" + Random.id(),
              "resource": {
                "resourceType": "Composition",
                "identifier": {
                  "value": Random.id()
                },
                "status": "preliminary",
                "type": {},
                "class": {},
                "subject": {
                  "display": "System Admin",
                  "reference": Random.id()
                },
                "encounter": {
                  "display": "",
                  "reference": ""
                },
                "date": "<dateTime>",
                "author": [
                  {
                    "display": "System Admin",
                    "reference": Random.id()
                  }
                ],
                "title": "Continuity of Care Document",
                "confidentiality": "0",
                "attester": [],
                "custodian": {
                  "display": "",
                  "reference": ""
                },
                "relatesTo": [],
                "event": [],
                "section": []
              }
            }
          ]
        }
          Meteor.call('Bundle/create', newBundle)
    },
    'Bundle/create': function(newBundle){
      console.log('Creating bundle...')
      check(newBundle, Object);

      Bundles.insert(newBundle, {validate: false, filter: false});          
    },
    'Bundle/drop': function(){
      console.log('Dropping bundles...')
      Bundles.remove({});
    }
})