import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { get, has } from 'lodash';
import { FhirUtilities, Locations, MeasureReports } from 'meteor/clinical:hl7-fhir-data-infrastructure';





Meteor.methods({
  async encodeMeasureScores(measureReportQuery){
    console.log('Encoding measure score...')

    await MeasureReports.find(measureReportQuery).forEach(function(report){
      console.log('report', report)
      let locationId = FhirUtilities.pluckReferenceId(get(report, 'subject.reference'));
      console.log('locationId', locationId)

      let groupPopulationCount = 0;

      if(Array.isArray(report.group)){
        report.group.forEach(function(group){
          //console.log('group', group);
          if(get(group, 'code.coding[0].code') === "Beds"){

            if(has(report, 'group[0].measureScore.value')){
              groupPopulationCount = get(report, 'group[0].measureScore.value', '');
            } else if(Array.isArray(group.population)){
              group.population.forEach(function(pop){
                //console.log('pop', pop)
                if(Array.isArray(get(pop, 'code.coding'))){
                  pop.code.coding.forEach(function(encoding){
                    //console.log('encoding', encoding)

                    // REFACTOR / EXTRACT
                    // This is a CDC code for the SANER implementation
                    if(get(encoding, 'code') === "numBeds"){
                      //console.log('numBeds: ', pop.count)
                      groupPopulationCount = pop.count;
                    }
                  })
                }
              })
            }
          }
        })
      }

      let location = Locations.findOne({id: locationId})
      if(location){
        
        delete location._document;
        location.extension = [{
          url: 'numBeds',
          valueDecimal: groupPopulationCount
        }]

        console.log('Found a location that matches the id', location);

        Locations.update({_id: location._id}, {$set: location}, function(error, result){
          if(result){
            console.log('Success!  Managed to update the Location.', result)            
          }
          if(error){
            console.log('Error when updating the Location record.', error)
            return error;
          }
        }, {filter: false, validate: false})
      } else {
        console.log("Could not find location by id");
      }
    })    

    return 'Completed.';
  },
  lookupOrgsAndLocations(){
    console.log("Received a request to look up orgs and locations...");

    let measureReports = MeasureReports.find({
      measure: get(Meteor, 'settings.public.saner.defaultMeasure')
    }).forEach(function(report){
      console.log('Location:     ' + get(report, 'subject.reference'));
      if(has(report, 'subject.reference')){
        let locationLookupUrl = get(Meteor, 'settings.public.interfaces.default.channel.endpoint') + '/' + get(report, 'subject.reference') + '?_format=json';
        console.log('locationLookupUrl', locationLookupUrl)
        HTTP.get(locationLookupUrl, function(error, result){
          if(get(result, 'statusCode') === 200){
            let parsedResults = JSON.parse(result.content);
            
            //console.log('parsedResults', parsedResults)
            if(get(parsedResults, 'resourceType') === "Location"){
              Locations.insert(parsedResults, {filter: false, validate: false}, function(err){
                if(err){
                  console.log('err', err)
                }
              })
            }
          } else {
            console.log("HTTP Code: " + get(result, 'statusCode'))
          }
          // if(error){
          //   console.log('error', error)
          // }
        });
      }

      console.log('Organization: ' + get(report, 'reporter.reference'));
      if(has(report, 'reporter.reference')){
        let organizationLookupUrl = get(Meteor, 'settings.public.interfaces.default.channel.endpoint') + '/' + get(report, 'reporter.reference') + '?_format=json';
        console.log('organizationLookupUrl', organizationLookupUrl)

        HTTP.get(organizationLookupUrl, function(error, result){
          if(get(result, 'statusCode') === 200){
            let parsedResults = JSON.parse(result.content);
            
            //console.log('parsedResults', parsedResults)
            if(get(parsedResults, 'resourceType') === "Organization"){
              Organizations.insert(parsedResults, {filter: false, validate: false}, function(err){
                if(err){
                  console.log('err', err)
                }
              })
            }
          } else {
            console.log("HTTP Code: " + get(result, 'statusCode'))
          }
          // if(error){
          //   console.log('error', error)
          // }
        })
      }
    });
  }
})