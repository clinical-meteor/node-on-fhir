import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Random } from 'meteor/random';
import { get, has, findIndex, toInteger } from 'lodash';
import { FhirUtilities, Locations, Organizations, Measures, MeasureReports, Endpoints } from 'meteor/clinical:hl7-fhir-data-infrastructure';
import moment from 'moment';

import PapaParse from 'papaparse';

import hsaGeoJsonLayer from '../geodata/health_service_areas_template';
import usStatesLayer from '../geodata/us_states_contiguous';

import parser from 'parse-address';

// import { LocationsHistory } from '../lib/Collections'

function parseAddressFromString(addressString){
  console.log('parseAddressFromString', addressString);

  let address = {
    resourceType: 'Address',
    line: [],
    city: '',
    state: '',
    postalCode: '',
    country: ''
  };

  let addressObj = parser.parseLocation(addressString);

  // console.log('addressObj', addressObj);

  let addressLine = "";
  if(addressObj.number){
    addressLine = addressLine + addressObj.number;
  }
  if(addressObj.prefix){
    addressLine = addressLine + " " + addressObj.prefix;
  }
  if(addressObj.street){
    addressLine = addressLine + " " + addressObj.street;
  }
  if(addressObj.type){
    addressLine = addressLine + " " + addressObj.type;
  }

  if(addressLine.length > 0){
    address.line.push(addressLine);
  }

  if(addressObj.city){
    address.city = addressObj.city;
  }
  if(addressObj.state){
    address.state = addressObj.state;
  }
  if(addressObj.zip){
    address.postalCode = addressObj.zip;
  }
  if(addressObj.country){
    address.country = addressObj.country;
  }

  return address;
}




Meteor.startup(function(){
  if(get(Meteor, 'settings.private.ensureIndices')){
    Locations._ensureIndex({ "_location": "2dsphere"});
  }

  if(Package['browser-policy-common']){
    console.log('Configuring content-security-policy.');

    import { BrowserPolicy } from 'meteor/browser-policy-common';

    BrowserPolicy.content.allowSameOriginForAll();
    BrowserPolicy.content.allowDataUrlForAll();
    BrowserPolicy.content.allowOriginForAll('localhost');
    BrowserPolicy.content.allowObjectOrigin('localhost');
    BrowserPolicy.content.allowOriginForAll('192.168.1.66:3000');
    BrowserPolicy.content.allowObjectOrigin('192.168.1.66:3000'); 
    BrowserPolicy.content.allowOriginForAll('saner.symptomatic.io');
    BrowserPolicy.content.allowObjectOrigin('saner.symptomatic.io');
    BrowserPolicy.content.allowOriginForAll('saner.meteorapp.com');
    BrowserPolicy.content.allowObjectOrigin('saner.meteorapp.com');
    BrowserPolicy.content.allowOriginForAll('self');
    BrowserPolicy.content.allowObjectOrigin('self');
    BrowserPolicy.content.allowOriginForAll('font src');
    BrowserPolicy.content.allowOriginForAll('googleapis.com');
    BrowserPolicy.content.allowOriginForAll('gstatic.com');
    BrowserPolicy.content.allowImageOrigin("* data:");
    BrowserPolicy.content.allowOriginForAll('blob:');
    BrowserPolicy.content.allowImageOrigin("blob:");
    BrowserPolicy.content.allowEval();
    BrowserPolicy.content.allowInlineScripts();
    BrowserPolicy.content.allowInlineStyles();  

    BrowserPolicy.content.allowOriginForAll('hb.emrconnect.org');
    BrowserPolicy.content.allowObjectOrigin('hb.emrconnect.org');
    
    BrowserPolicy.content.allowOriginForAll('www.google-analytics.com');
    BrowserPolicy.content.allowObjectOrigin('www.google-analytics.com');
  
    BrowserPolicy.content.allowObjectOrigin(get(Meteor, 'settings.public.saner.iFrameLocation') );
    BrowserPolicy.content.allowFrameOrigin(get(Meteor, 'settings.public.saner.iFrameLocation'));
    BrowserPolicy.content.allowObjectDataUrl(get(Meteor, 'settings.public.saner.iFrameLocation'));
    BrowserPolicy.content.allowOriginForAll(get(Meteor, 'settings.public.saner.iFrameLocation'));
    BrowserPolicy.content.allowConnectOrigin(get(Meteor, 'settings.public.saner.iFrameLocation'));
    BrowserPolicy.content.allowImageOrigin(get(Meteor, 'settings.public.saner.iFrameLocation'));


    // TODO:  
    // https://virusiq.health
    


  }
});




Meteor.methods({
  async fetchCurrentIcuMap(){
    return LocationsHistory.find({'meta.versionId': get(Meteor, 'settings.public.saner.mainMapVersion')}).fetch();
  },
  async ensureValidGeometrics(){
    console.log('====================================================================')
    console.log('Validating Geometries...');

    LocationsHistory.find().forEach(function(location){
      console.log('location', get(location, 'name'));
      if(has(location, '_geometry.coordinates[0][0]')){
        let coordinatesArray = get(location, '_geometry.coordinates[0][0]');
        if(Array.isArray(coordinatesArray)){
          console.log('first coordinate: ' + coordinatesArray[0]);
          console.log('last coordinate:  ' + coordinatesArray[coordinatesArray.length - 1]);
        }
      }
    })
  },
  async generateIcuCapacityMap(){
    console.log('====================================================================')
    console.log('Generating the ICU Capacity Map');

    MeasureReports.remove({date: {$gte: new Date()}});

    let latestReport = MeasureReports.find({}, {limit: 1, sort: {$natural: -1}}).fetch();
    console.log('Step 1.  Finding the latest report', latestReport);
    console.log('Step 2.  Finding the latest report date. ', latestReport.date);

    let latestReportDataSet = MeasureReports.find({date: latestReport.date});
    
    if(latestReportDataSet){

    }
    console.log('Step 3. Find all reports from the most recent report date.', latestReportDataSet);
    console.log('Step 4. Participation total: ' + latestReportDataSet.length);

    let measureReportQuery = {
      measure: get(Meteor, 'settings.public.saner.defaultMeasure', 'adult_icu_bed_utilization'),
      'period.start': {$gte: new Date(latestReport.date).subjtract(1, 'days').format('YYYY-MM-DD')}, 
      'period.end': {$lte: new Date(moment(latestReport.date).format('YYYY-MM-DD'))}, 
    }
    console.log('Step 5.  Generate measureReportQuery', measureReportQuery)

    Meteor.call('encodeMeasureScores', measureReportQuery, measureReportQuery.measure, function(error, result){
      if(result){
        console.log('Step 6.  All measure scores should be converted to Locations.')

        Meteor.call('writeLocationToHistory', function(error, versionId){
          if(versionId){
            console.log('Step 7. All new measure scores should be written to LocationsHistory.  ')        
            console.log('Step 8. ICU Capacity Map should be generated.')               
          }
        });
      }
    });
  },
  async deleteFutureHhsReports(){
    console.log('====================================================================')
    console.log('Deleting MeasureReport records from HHS Feed with timestamps in the future...');

    MeasureReports.remove({date: {$gte: new Date()}});
  },
  async lookupMeasureScores(measureScore, reportingDate){
    console.log('====================================================================')
    console.log('Looking up measure score (pulling from MeasureReport to Location)...', measureScore, reportingDate)

    // look through each location
    await Locations.find().forEach(function(record){
      
        // and pluck the locationID for each one (should correspond to HSA areas)
        let managingOrgId = FhirUtilities.pluckReferenceId(get(record, 'managingOrganization.reference'));
        if(managingOrgId){
          console.log('Managing organization: ' + managingOrgId)

          // is this recursive?
          let reportingLocationsManagedByOrgCount = Locations.find({
            'managingOrganization.reference': 'Organization/' + managingOrgId
          }).count();
          console.log(reportingLocationsManagedByOrgCount + ' locations are managed by this organization.')
          console.log('Reporter reference: ' + 'Organization/' + managingOrgId);

          let cdcReportQuery = {'reporter.reference': 'Organization/' + managingOrgId}
          console.log('Reporter reference query: ', cdcReportQuery);


          // find the previous reports for that HSA area 
          let managingOrgReports = MeasureReports.find(cdcReportQuery).fetch();
          // console.log('managingOrgReports', managingOrgReports)
          
          if(managingOrgReports.length > 0){
            console.log('Found ' + managingOrgReports.length + ' past reports.', )

            // console.log('Found the earliest managing org report', managingOrgReports[0]);
  
            if(managingOrgReports[managingOrgReports.length - 1]){
              console.log('Found the latest managing org report', managingOrgReports[managingOrgReports.length - 1]);
              console.log('Date of last report: ' + managingOrgReports[managingOrgReports.length - 1].date);
            }
  
            let managingOrgReport;
            let managingOrgReportIndex;
  
            // if we have a specific report date
            if(reportingDate){
              // find the index of the matching report
  
              console.log('Searching for an index to match reportingDate: ' + moment(reportingDate).format('YYYY-MM-DD'))
              managingOrgReportIndex = findIndex(managingOrgReports, function(record){
                // by measuring the end of the reporting period
                return moment(get(record, 'period.start')).isSame(moment(reportingDate).format('YYYY-MM-DD'), 'day')
              });
              console.log('Found an index of a report that matches the requested reportingDate.', managingOrgReportIndex);
              managingOrgReport = managingOrgReports[managingOrgReportIndex];
  
            // otherwise, if the most recent report is the same as today
            } else if(moment(get(managingOrgReports[managingOrgReports.length - 1], 'period.end')).isSame(moment().format("YYYY-MM-DD"), 'day')){
              // go ahead and use that report
              console.log('No reportingDate specified.  Using the most recent report the managing org submitted.')
              managingOrgReport = managingOrgReports[managingOrgReports.length - 1];
            }
  
            if(managingOrgReport){
              console.log('Have the latest report submited by the managing org.');
              let extensionDecimalValue = 0;
              if(Array.isArray(managingOrgReport.group)){
                console.log('Extracting measure scores...');
                console.log('Searching for: ' + measureScore);
    
                managingOrgReport.group.forEach(function(group){
                  //console.log('group', group);
                  if(get(group, 'code.coding[0].code') === "Beds"){
                    // console.log('Found the bed section.')
    
                    if(has(managingOrgReport, 'group[0].measureScore.value')){
                      extensionDecimalValue = get(managingOrgReport, 'group[0].measureScore.value', '');
                      console.log('extensionDecimalValue', extensionDecimalValue)
    
                    } else if(Array.isArray(group.population)){
                      // console.log('group.population', group.population)
    
                      group.population.forEach(function(pop){
                        // console.log('pop', pop)
                        if(Array.isArray(get(pop, 'code.coding'))){
                          pop.code.coding.forEach(function(encoding){
                            // console.log('encoding', encoding)
    
                            if(get(encoding, 'code') === measureScore){
                              console.log(measureScore + ' : ' + pop.count)
                              extensionDecimalValue = (pop.count / reportingLocationsManagedByOrgCount);
                            }
                          })
                        }
                      })
                    }
                  }
                })
              }
              record.extension = [{
                url: measureScore,
                valueDecimal: extensionDecimalValue
              }]
            } else {
              console.log("Could not find a valid report from that managing org.")
            }
  
            console.log('Prepared the record for updating', record)
  
            if(get(record, 'extension[0]')){
              Locations.update({_id: record._id}, {$addToSet: {
                'extension': record.extension[0]
              }}, {filter: false, validate: false}, function(error, result){
                if(result){
                  console.log('Success!  Managed to update the Location.')            
                }
                if(error){
                  console.log('Error when updating the Location record.', error)
                  return error;
                }
              })              
            }
          } else {
            console.log('No reports found for this reporter.')
          }
        } else {
          console.log('Location ' + record._id + ' doesnt have a managing Organization.')
        }
      //}
    })

  },
  async encodeMeasureScores(measureReportQuery, measureScoreType){
    console.log('====================================================================')
    console.log('Encoding measure score (pushing from MeasureReport to Location)...')
    console.log('Report Query:       ' + measureReportQuery)
    console.log('Measure Score Type: ' + measureScoreType)

    function parseReportGroups(report, measureScoreType){
      let result;
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
                  if(get(encoding, 'code') === measureScoreType){
                    //console.log('numBeds: ', pop.count)
                    result = pop.count;
                  }
                })
              }
            })
          }
        }
      })
      return result;      
    }
    function addExtensionToLocation(simpleLocation, measureScoreType, groupPopulationCount){
      if(simpleLocation){
        // check whether it has any extensions
        if(Array.isArray(simpleLocation.extension)){
          // if so, grab the array
          extensionArray = simpleLocation.extension;

          // and then look through it for the index of the extension that matches the measure score
          extensionIndex = findIndex(extensionArray, function(extension){
            return get(extension, 'url') === measureScoreType
          }) 
          // if we find it
          if(extensionIndex > -1){
            // update the extension with our latest count
            extensionArray[extensionIndex] = {
              url: measureScoreType,
              valueDecimal: groupPopulationCount
            }
          } else {
            // otherwise, we add it to the other extensions
            simpleLocation.extension.push({
              url: measureScoreType,
              valueDecimal: groupPopulationCount
            })

          }
        } else {
          // if no extensions exist, create the array and assign an initial value
          simpleLocation.extension = [];
          simpleLocation.extension.push({
            url: measureScoreType,
            valueDecimal: groupPopulationCount
          })
        }
      }

      return simpleLocation;
    }
    function updateLocationCollection(updatedLocation){

      Locations.update({_id: updatedLocation._id}, {$set: {
        'extension': get(updatedLocation, 'extension')
      }}, {filter: false, validate: false}, function(error, result){
        if(result){
          console.log('Success!  Managed to update the Location.', result)            
        }
        if(error){
          console.log('Error when updating the Location record.', error)
          return error;
        }
      })      
    }
    // function multiUpdateLocationCollection(stateLocationIds, newExtension){
    //   // Locations.update({id: {$in: stateLocationIds}}, {$addToSet: {
    //     Locations.update({id: {$in: stateLocationIds}}, {$set: {
    //       'extension': newExtension
    //   }}, {filter: false, validate: false, multi: true}, function(error, result){
    //     if(result){
    //       console.log('Success!  Managed to update the Location.', result)            
    //     }
    //     if(error){
    //       console.log('Error when updating the Location record.', error)
    //       return error;
    //     }
    //   })
    // }

    console.log("Beginning parse through measure reports collection....");

    await MeasureReports.find(measureReportQuery).forEach(function(report){
      //console.log('report', report)
      let groupPopulationCount = 0;

      let locationReferenceId = FhirUtilities.pluckReferenceId(get(report, 'subject.reference'));
      console.log("LocationReferenceId: " + locationReferenceId);

      if(Array.isArray(report.group)){
        groupPopulationCount = parseReportGroups(report, measureScoreType);
        console.log(locationReferenceId + ' reports a ' + measureScoreType + ' score of: ' + groupPopulationCount)
      }


      //------------------------------------------------------------------------------

      if(locationReferenceId){
        console.log('Found a measure report referencing the following location: ' + locationReferenceId)

        let simpleLocation = Locations.findOne({id: locationReferenceId})        
        
        let extensionIndex = -1;
        let extensionArray = [];
  
        // if we found the simpleLocation with the correct id
        if(simpleLocation){
          console.log('Location lookup retrieved the following location', simpleLocation)
  
          updateLocationCollection(addExtensionToLocation(simpleLocation, measureScoreType, groupPopulationCount))          
        } else {
          console.log('Couldnt find a Location with that reference id. ')
        }          
      }

      
      //------------------------------------------------------------------------------
      let stateAbbreviation = locationReferenceId.replace(/\s+/g, '');
      let stateId = 'US-State-' + stateAbbreviation;
      console.log('Searching for: ' + stateId);

      let stateLocation = Locations.findOne({id:  stateId})
      if(stateLocation){
        console.log("Found a US state.", stateLocation); 
                
        updateLocationCollection(addExtensionToLocation(stateLocation, measureScoreType, groupPopulationCount))       


        // let stateLocationIdentifiersArray = get(stateLocation, 'identifier');
        // let uspsIndex = -1;

        // uspsIndex = findIndex(stateLocationIdentifiersArray, function(identifier){
        //   return get(identifier, 'system') === "United States Postal Service"
        // }) 

        // if(uspsIndex > -1){
        //   console.log('Found the index of a USPS code: ' + uspsIndex)
          
        //   let stateAbbreviation = stateLocation.identifier[uspsIndex].code;

        //   console.log('stateAbbreviation', stateAbbreviation)
  
        //   let stateHsaIds = Locations.find({'address.state': stateAbbreviation}).map(function(record){
        //     return record.id;
        //   })
        //   console.log('stateHsaIds', stateHsaIds)

        //   let stateLocationCount = stateHsaIds.length;

        //   // if the total count should be averaged 
        //   // stateLocation.extension[0].valueDecimal = Number((Number(stateLocation.extension[0].valueDecimal)).toFixed(0))

        //   // proportional counts don't need to be divided by a denominator
        //   stateLocation.extension[0].valueDecimal = Number(stateLocation.extension[0].valueDecimal);

        //   console.log('stateLocation.extension', stateLocation.extension);

        //   multiUpdateLocationCollection(stateHsaIds, stateLocation)

        // } 
        // else {
        //   console.log('Couldnt find a USPS code.  Trying to use locationReferenceId instead: ' + locationReferenceId);

        //   let stateHsaIds = Locations.find({'address.state': locationReferenceId}).map(function(record){
        //     return record.id;
        //   })
        //   console.log('stateHsaIds', stateHsaIds)

        //   let stateLocationCount = stateHsaIds.length;

        //   // proportional counts don't need to be divided by a denominator
        //   stateLocation.extension[0].valueDecimal = Number(stateLocation.extension[0].valueDecimal);

        //   console.log('stateLocation.extension', stateLocation.extension);

        //   multiUpdateLocationCollection(stateHsaIds, stateLocation)
        // }
      } else {
        console.log("Could't find a state location with that id.");        
      }


      //------------------------------------------------------------------------------
      
      console.log('Searching for locations with an address in the state of: ' + stateAbbreviation);

      let stateHsaIds = Locations.find({'address.state': locationReferenceId}).map(function(record){
        return record.id;
      })
      console.log('Found the following HSA ids: ', stateHsaIds)

      let locationsInStateCount = stateHsaIds.length;
      console.log('Found ' + locationsInStateCount + ' locations in ' + stateAbbreviation);


      let locationsArray = Locations.find({'address.state': locationReferenceId}).fetch();
      
      if(Array.isArray(locationsArray)){
        let updatedSampleLocation = addExtensionToLocation(locationsArray[0], measureScoreType, groupPopulationCount);
        console.log('Creating a sample update: ', updatedSampleLocation);

        locationsArray.forEach(function(record){                
          updateLocationCollection(addExtensionToLocation(record, measureScoreType, groupPopulationCount))       
        })
  
      }
      console.log('Updated all of the locations in ' + stateAbbreviation + ' with new extension.')
    })    

    return 'Completed.';
  },
  generateGeojsonLayer(){
    console.log("Generating geojson layer...");

    console.log('Locations: ' + Locations.find().count());

    // GeojsonLayers.insert({
    //   'type': 'FeatureCollection',
    //   'date': new Date(),
    //   'name': 'BedCount',
    //   'hsa_id': '14023',
    //   "properties": {
    //     "id": "1",
    //     "numBeds": 1000,
    //     "primary_type": "POSITIVE",
    //     "location_zip": "60007",
    //     "location_city": "Chicago",
    //     "location_state": "IL",
    //     "longitude": "-87.629800000",
    //     "latitude": "41.878100000"
    //   },
    //   "geometry": {
    //     "type": "Point",
    //     "coordinates": [
    //       -87.6298,
    //       41.8781
    //     ]
    //   }
    // })

    GeojsonLayers.insert(hsaGeoJsonLayer)

  },
  generateUsStatesLocations(){
    console.log("Generating US State locations...");

    if(usStatesLayer){
      if(Array.isArray(usStatesLayer.features)){
        usStatesLayer.features.forEach(function(feature){
          let location = {
            resourceType: "Location",
            id: 'US-State-' + (get(feature, 'properties.NAME')).replace(/\s+/g, ''),
            name: 'State of ' + get(feature, 'properties.NAME'),
            identifier: [{
              system: 'United States Postal Service',
              value: get(feature, 'properties.GEO_ABBREVIATION')
            }, {
              system: 'United States Census',
              value: get(feature, 'properties.GEO_ID')
            }, {
              system: 'System Index',
              value: get(feature, 'properties.INDEX')
            }],
            address: {
              state: get(feature, 'properties.GEO_ABBREVIATION'),
              country: "USA"           
            },
            _geometry: get(feature, 'geometry')
          }
          // if we didn't find the location specified in the report's subject,
          // then we will assume it's a state or regional measure that references
          // multiple HSA locations; we begin by assuming it's a state report
      
          if(!Locations.findOne({id: location.id})){
            Locations.insert(location, function(error, result){
              if(result){
                console.log('Success!  Managed to insert a new Location.', result)            
              }
              if(error){
                console.log('Error when inserting the Location record.', error)
                return error;
              }
            })  
          }
        })
      }
    }
  },
  generateHsaLocations(){
    console.log("Generating HSA Locations...");


    console.log('hsaGeoJsonLayer', hsaGeoJsonLayer)

    if(Array.isArray(hsaGeoJsonLayer.features)){
      hsaGeoJsonLayer.features.forEach(function(feature){
        console.log('feature', feature.properties);

        if(!Locations.findOne({name: feature.properties.HSANAME})){
          Locations.insert({
            "resourceType": "Location",
            "name": feature.properties.HSANAME.replace(/\s+/g, ''),
            "address": {
              "resourceType": "Address",       
              "city": feature.properties.HSANAME.substring(4),   
              "state": feature.properties.HSANAME.substring(0, 2),
              "country": "US",
            },
            "identifier": [{
              "system": "HSA93",
              "value": feature.properties.HSA93
            }],
            "managingOrganization": {
              "display": "Centers for Medicare and Medicaid Services",
              "reference": "Organization/CDC"
            },
            "status": "active",
            "id": "HSA93-" + feature.properties.HSA93,
            "_geometry": feature.geometry
          }, function(error, result){
            if(error){
              console.log('Error inserting Location', error)
            }
            if(result){
              console.log('Result inserting Location: ' + result)
            }
          })
        }
      })
    }

    console.log('Location Count: ' + Locations.find().count());
  },
  generateLocationMarkers(){
    console.log("Generating location markers...");

    console.log("*** Counts ***")
    console.log('Organizations: ' + Organizations.find().count());
    console.log('Locations: ' + Locations.find().count());


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
  },
  initializePharmacyTestingSites(){
    console.log("Initialize pharmacy testing sites from file.");

    // URLS
    // HHS: https://www.hhs.gov/coronavirus/community-based-testing-sites/index.html#al

    // CVS: https://www.cvs.com/minuteclinic/covid-19-testing
    // Walgreens: https://www.walgreens.com/findcare/covid19/testing
    // Walmart: https://corporate.walmart.com/covid19testing
    // Rite Aid: https://www.riteaid.com/pharmacy/services/covid-19-testing
    // eTrueNorth https://www.doineedacovid19test.com/




    // ------------------------------------------------------------------------------------------------------
    // CVS
    // https://cvshealth.com/covid-19/testing-locations

    let cvsPharmacies = Assets.getText('data/locations/CVS-Covid19-TestingLocations-20200731.csv');
    let parsedCvsResults = PapaParse.parse(cvsPharmacies);
    console.log('parsedCvsResults', parsedCvsResults)

    if(Array.isArray(get(parsedCvsResults, 'data'))){
      parsedCvsResults.data.forEach(function(row){
        let newLocation = {
          "resourceType": "Location",
          "name": 'CVS Pharmacy - ' + row[0],
          "address": {
            "line": row[0],
            "city": row[1],
            "state": row[2],
            "postalCode": row[3]
          },
          "identifier": [{
            "system": "cvs-pharmacy",
            "value": "CVS Pharmacy"
          }],
          "type": [{
            "text": "",
            "coding": [{
              "code": "OUTPHARM",
              "display": "outpatient pharmacy",
              "system": "http://terminology.hl7.org/ValueSet/v3-ServiceDeliveryLocationRoleType"
            }]
          }],
          "status": "active",
          "id": "cvs-pharmacy-" + Random.id()
        }        
        
        if(!Locations.findOne({name: newLocation.name})){
          newLocation._id = Locations.insert(newLocation, function(error, result){
            if(error){
              console.log('Error inserting Location', error)
            }
          })     
          // Meteor.call('geocodeTestingSite', newLocation, function(error, result){
          //   if(error){
          //     console.log('geocodeAddress.error', error)
          //   }
          //   if(result){
          //     console.log('geocodeAddress.result', result) 
          //   }
          // })                       
        }
      })
    }


    // ------------------------------------------------------------------------------------------------------
    // Wallgreens
    // https://www.walgreens.com/findcare/covid19/testing  
    
    let wallgreenPharmacies = Assets.getText('data/locations/Walgreens-Covid19-TestingLocatinos-20200816.csv');
    let parsedWallgreenResults = PapaParse.parse(wallgreenPharmacies);
    console.log('parsedWallgreenResults', parsedWallgreenResults)

    if(Array.isArray(get(parsedWallgreenResults, 'data'))){
      parsedWallgreenResults.data.forEach(function(row){
        let newLocation = {
          "resourceType": "Location",
          "name": 'Walgreens - ' + row[0],
          "address": {
            "city": row[0] ? (row[0]).trim() : '',
            "state": row[1] ? (row[1]).trim() : '',
            "postalCode": row[2] ? (row[2]).trim() : ''
          },
          "identifier": [{
            "system": "wallgreens-pharmacy",
            "value": "Wallgreens - " + row[0]
          }],
          "type": [{
            "text": "",
            "coding": [{
              "code": "OUTPHARM",
              "display": "outpatient pharmacy",
              "system": "http://terminology.hl7.org/ValueSet/v3-ServiceDeliveryLocationRoleType"
            }]
          }],
          "status": "active",
          "id": "wallgreens-pharmacy-" + row[2]
        }        
        
        if(!Locations.findOne({name: newLocation.name})){
          newLocation._id = Locations.insert(newLocation, function(error, result){
            if(error){
              console.log('Error inserting Location', error)
            }
          })                
          // Meteor.call('geocodeTestingSite', newLocation, Locations, function(error, result){
          //   if(error){
          //     console.log('geocodeAddress.error', error)
          //   }
          //   if(result){
          //     console.log('geocodeAddress.result', result) 
          //   }
          // })   
        }
      })
    }

    // ------------------------------------------------------------------------------------------------------
    // Quest / Walmart
    // http://patient.questdiagnostics.com/LP=33

    let walmartPharmacies = Assets.getText('data/locations/QuestWalmart-FreeCovid19-TestingLocations-20200816.csv');
    let parsedWalmartResults = PapaParse.parse(walmartPharmacies);
    console.log('parsedWalmartResults', parsedWalmartResults)

    if(Array.isArray(get(parsedWalmartResults, 'data'))){
      parsedWalmartResults.data.forEach(function(row){
        let newLocation = {
          "resourceType": "Location",
          "name": 'Walmart - ' + row[0],
          "address": {
            "line": ["Walmart"],
            "city": row[0],
            "state": row[1],
            "postalCode": row[2]
          },
          "identifier": [{
            "system": "walmart-pharmacy",
            "value": "Walmart - " + row[0]
          }],
          "type": [{
            "text": "",
            "coding": [{
              "code": "OUTPHARM",
              "display": "outpatient pharmacy",
              "system": "http://terminology.hl7.org/ValueSet/v3-ServiceDeliveryLocationRoleType"
            }]
          }],
          "status": "active",
          "id": "walmart-pharmacy-" + Random.id()
        }        
        
        if(!Locations.findOne({name: newLocation.name})){
          newLocation._id = Locations.insert(newLocation, function(error, result){
            if(error){
              console.log('Error inserting Location', error)
            }
          })                
          // Meteor.call('geocodeLocationAddress', newLocation, Locations, function(error, result){
          //   if(error){
          //     console.log('geocodeAddress.error', error)
          //   }
          //   if(result){
          //     console.log('geocodeAddress.result', result) 
          //   }
          // })   
        }
      })
    }

    // ------------------------------------------------------------------------------------------------------
    // Kroger 
    // https://www.krogerhealth.com/covid-locations

    let krogerPharmacies = Assets.getText('data/locations/Kroger-Covid19-TestingLocations-20200816.csv');
    let parsedKrogerResults = PapaParse.parse(krogerPharmacies);
    console.log('parsedKrogerResults', parsedKrogerResults)

    if(Array.isArray(get(parsedKrogerResults, 'data'))){
      parsedKrogerResults.data.forEach(function(row){
        let newLocation = {
          "resourceType": "Location",
          "name": row[0],
          "address": {
            "line": [row[1]],
            "city": row[2],
            "state": row[3],
            "postalCode": row[4]
          },
          "identifier": [{
            "system": "kroger-pharmacy",
            "value": row[0]
          }],
          "type": [{
            "text": "",
            "coding": [{
              "code": "OUTPHARM",
              "display": "outpatient pharmacy",
              "system": "http://terminology.hl7.org/ValueSet/v3-ServiceDeliveryLocationRoleType"
            }]
          }],
          "status": "active",
          "id": "kroger-pharmacy-" + Random.id()
        }        
        
        if(!Locations.findOne({name: newLocation.name})){
          newLocation._id = Locations.insert(newLocation, function(error, result){
            if(error){
              console.log('Error inserting Location', error)
            }
          })                
          // Meteor.call('geocodeLocationAddress', newLocation, Locations, function(error, result){
          //   if(error){
          //     console.log('geocodeAddress.error', error)
          //   }
          //   if(result){
          //     console.log('geocodeAddress.result', result) 
          //   }
          // })   
        }
      })
    }


    // ------------------------------------------------------------------------------------------------------
    // eTrueNorth 
    // https://www.doineedacovid19test.com/  

    let trueNorthPharmacies = Assets.getText('data/locations/eTrueNorth-Covid19-TestingLocations-20200816.csv');
    let parsedTrueNorthResults = PapaParse.parse(trueNorthPharmacies);
    console.log('parsedTrueNorthResults', parsedTrueNorthResults)

    if(Array.isArray(get(parsedTrueNorthResults, 'data'))){
      parsedTrueNorthResults.data.forEach(function(row){
        let newLocation = {
          "resourceType": "Location",
          "name": "eTrueNorth - " + row[0],
          "address": {
            "line": [row[1], row[2]],
            "city": row[3],
            "state": row[4],
            "postalCode": row[5]
          },
          "identifier": [{
            "system": "etruenorth-pharmacy",
            "value": row[0]
          }],
          "type": [{
            "text": "",
            "coding": [{
              "code": "OUTPHARM",
              "display": "outpatient pharmacy",
              "system": "http://terminology.hl7.org/ValueSet/v3-ServiceDeliveryLocationRoleType"
            }]
          }],
          "status": "active",
          "id": "etruenorth-pharmacy-" + Random.id()
        }        
        
        if(!Locations.findOne({name: newLocation.name})){
          newLocation._id = Locations.insert(newLocation, function(error, result){
            if(error){
              console.log('Error inserting Location', error)
            }
          })                
          // Meteor.call('geocodeLocationAddress', newLocation, Locations, function(error, result){
          //   if(error){
          //     console.log('geocodeAddress.error', error)
          //   }
          //   if(result){
          //     console.log('geocodeAddress.result', result) 
          //   }
          // })   
        }
      })
    }


    // ------------------------------------------------------------------------------------------------------
    // RiteAid
    // https://www.riteaid.com/pharmacy/services/covid-19-testing 

    let riteAidPharmacies = Assets.getText('data/locations/eTrueNorth-Covid19-TestingLocations-20200816.csv');
    let parsedRiteAidResults = PapaParse.parse(riteAidPharmacies);
    console.log('parsedRiteAidResults', parsedRiteAidResults)

    if(Array.isArray(get(parsedRiteAidResults, 'data'))){
      parsedRiteAidResults.data.forEach(function(row){
        let newLocation = {
          "resourceType": "Location",
          "name": 'RiteAid ' + row[0] + " - " + row[3],
          "address": {
            "line": [row[1]],
            "city": row[2],
            "state": row[3]
          },
          "identifier": [{
            "system": "riteaid-pharmacy",
            "value": row[0]
          }],
          "type": [{
            "text": "",
            "coding": [{
              "code": "OUTPHARM",
              "display": "outpatient pharmacy",
              "system": "http://terminology.hl7.org/ValueSet/v3-ServiceDeliveryLocationRoleType"
            }]
          }],
          "status": "active",
          "id": "riteaid-pharmacy-" + row[0]
        }        
        
        if(!Locations.findOne({name: newLocation.name})){
          newLocation._id = Locations.insert(newLocation, function(error, result){
            if(error){
              console.log('Error inserting Location', error)
            }
          })                
          // Meteor.call('geocodeLocationAddress', newLocation, Locations, function(error, result){
          //   if(error){
          //     console.log('geocodeAddress.error', error)
          //   }
          //   if(result){
          //     console.log('geocodeAddress.result', result) 
          //   }
          // })   
        }
      })
    }



  },
  async fetchHhsInpatientBeds(){
    // https://opendata.arcgis.com/datasets/1d5b20ddfada4ef88ae51b35c5c881f7_0.geojson
    console.log('Fetching HHS Protect Percentage of Inpatient Beds Occupied (Estimate)...');

    await HTTP.get('https://opendata.arcgis.com/datasets/1d5b20ddfada4ef88ae51b35c5c881f7_0.geojson', function(error, result){
      console.log('result', result);
      
      if(result){
        if(result.statusCode === 200){

          if(get(result, 'statusCode') === 200){
            if(has(result, 'data')){
              // let parsedResults = PapaParse.parse(get(result, 'content'));
              let parsedResults = get(result, 'data');

              console.log('FeatureCollection: ', get(parsedResults, 'name'));

              let updatedExtension;
              if(Array.isArray(parsedResults.features)){
                parsedResults.features.forEach(function(feature){
                  console.log('Parsing features: ' + get(feature, 'properties.state_name') + ', Capacity: ' + get(feature, 'properties.inpatient_bed_utilization'))
                  if(get(feature, 'properties.state_abbr')){

                    updatedExtension = [{
                      'url': 'adult_icu_bed_utilization',
                      'valueDecimal': get(feature, 'properties.inpatient_bed_utilization')
                    }]

                    console.log(get(feature, 'properties.state_name') + ' HSA zones: ' + Locations.find({'address.state': get(feature, 'properties.state_abbr')}).count())

                    let locationIds = Locations.find({'address.state': get(feature, 'properties.state_abbr')}).map(function(location){
                      return location._id;
                    })

                    console.log('locationIds to update', locationIds)

                    Locations.update({_id: {$in: locationIds}}, {$set: {
                      'extension': updatedExtension
                    }}, {multi: true, validate: false, filter: false}, function(error, result){                      
                      if(result){
                        console.log('Error updating locations.', result)
                      }                  
                      if(error){
                        console.log('Error updating locations.', error)
                      }
                    })
                  }
                })
              }
            }            
          }
        }
      }

      if(error){
        if(error.statusCode === 404){
          console.log('Caught a 404')
        } else {
          console.log('Error fetching HHS Protect Percentage of Inpatient Beds Occupied data.', error)
        }  
      }
    })
  },
  async fetchHhsData(hhsFetchUrl){
    console.log("Fetching data from the Health and Human Services...", hhsFetchUrl);

    // https://healthdata.gov/search/type/dataset?query=covid-19&sort_by=changed&sort_order=DESC
    // https://healthdata.gov/dataset/covid-19-reported-patient-impact-and-hospital-capacity-state
    // https://healthdata.gov/sites/default/files/reported_hospital_utilization_20200821_2312.csv
    // https://healthdata.gov/sites/default/files/reported_hospital_utilization_20200901_0104.csv
    // https://healthdata.gov/sites/default/files/reported_hospital_utilization_20200908_2351.csv

    // https://healthdata.gov/dataset/covid-19-estimated-patient-impact-and-hospital-capacity-state
    // https://protect-public.hhs.gov/pages/hospital-capacity

    // Provisional COVID-19 Death Counts by Week Ending Date and State
    // https://data.cdc.gov/api/views/r8kw-7aab

    // Estimated Inpatient Beds Occupied by State Timeseries
    // https://healthdata.gov/sites/default/files/reported_inpatient_all_20200720_0537.csv

    // Estimated Inpatient Beds Occupied by COVID-19 Patients by State Timeseries
    // https://healthdata.gov/sites/default/files/inpatient_covid_final_20200720_0537.csv

    // GeoJson
    // https://opendata.arcgis.com/datasets/1d5b20ddfada4ef88ae51b35c5c881f7_0.geojson

    // JSON API WORKS!!!!
    // https://healthdata.gov/resource/g62h-syeh.json?$order=date%20DESC

    await HTTP.get(hhsFetchUrl, function(error, result){
      // console.log('result', result)
      
      if(result){
        if(result.statusCode === 200){

          if(get(result, 'statusCode') === 200){
            if(has(result, 'content')){
              // let parsedResults = PapaParse.parse(get(result, 'content'));
              let parsedResults = get(result, 'data')

              console.log('Parsing results received from HHS data portal. ' + parsedResults.length + ' results.')

              if(!Organizations.findOne({id: 'HHS'})){
                Organizations.insert({
                  "resourceType": "Organization",
                  "id": "HHS",              
                  "name": "Department of Health and Human Services",              
                  "address": [{
                    "resourceType": "Address",   
                    "line": ["200 Independence Avenue, S.W."],
                    "city": "Washington",            
                    "state": "DC",
                    "postalCode": "20201",
                    "country": "US",
                  }],
                  "status": "active"
                });  
              }

            

              let featureIndex = -1;
              let featureParams = {};
              let city = "";

              let state = get(Meteor, 'settings.public.saner.dataDictionaryIndices.state', 0);
              let reporting_cutoff_start = get(Meteor, 'settings.public.saner.dataDictionaryIndices.reporting_cutoff_start', 59);
              let inpatient_beds_utilization = get(Meteor, 'settings.public.saner.dataDictionaryIndices.inpatient_beds_utilization', 40);
              let inpatient_bed_covid_utilization = get(Meteor, 'settings.public.saner.dataDictionaryIndices.inpatient_bed_covid_utilization', 48);
              let adult_icu_bed_covid_utilization = get(Meteor, 'settings.public.saner.dataDictionaryIndices.adult_icu_bed_covid_utilization', 52);
              let adult_icu_bed_utilization = get(Meteor, 'settings.public.saner.dataDictionaryIndices.adult_icu_bed_utilization', 56);

              if(Array.isArray(parsedResults)){
                parsedResults.forEach(function(row, rowIndex){
                  // console.log(moment(row.date).format("YYYY-MM-DD") + "-" + row.state)

                    

                      // if(Number(row[5])){                    
                        console.log("Inserting MeasureReport " + rowIndex + " of " + (parsedResults.length - 1) + " - " + row.state + " - " + moment(row.date).format("YYYY-MM-DD") + " - %ICU Beds Occupied: " + row.inpatient_bed_covid_utilization + "%" );                 

                        // do we have a valid date in cell 59?
                        // aka: has the schema changed?
                        if(row.date){
                          // we use a regex in the id to to remove whitespaces and convert to ProperCase
                          let measureReportTemplate = {
                            "resourceType": "MeasureReport",
                            "id": "HHS-ICUBedCapacity-" + row.state + "-" +  moment(row.date).format("YYYYMMDD"),
                            "meta": {
                              "profile": [
                                "http://hl7.org/fhir/us/saner/StructureDefinition/PublicHealthMeasureReport"
                              ]
                            },
                            "text": {
                              "status": "generated",
                              "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"></div>"
                            },
                            "status": "complete",
                            "type": "summary",
                            "measure": "http://hl7.org/fhir/us/saner/Measure/CDCPatientImpactAndHospitalCapacity",
                            "subject": {
                              "reference": "Location/" + row.state,
                              "display": "State of " + row.state
                            },
                            "date": moment(row.date).format("YYYY-MM-DD"),
                            "reporter": {
                              "reference": "Organization/HHS",
                              "display": "U.S. Health and Human Services"
                            },
                            "period": {
                              "start": moment(row.date).format("YYYY-MM-DD"),
                              "end": moment(row.date).add(1, 'day').format("YYYY-MM-DD")
                            },
                            "group": []
                          };

                          let currentMeasure = MeasureReports.findOne({id: measureReportTemplate.id});
                          if(currentMeasure){

                            // let percentICUBedsOccupied = 0;

                            // // assuming we have an array to iterate through
                            // if(Array.isArray(currentMeasure.group)){
                            //   if(Array.isArray(Array.isArray(currentMeasure.group[0].population))){
                            //     // look through each population 
                            //     currentMeasure.group[0].population.forEach(function(pop){

                            //       if(Array.isArray(pop.code.coding)){
                            //         pop.code.coding.forEach(function(coding){
                            //           if(coding.code === "adult_icu_bed_utilization"){
                            //             percentICUBedsOccupied = get(pop, 'count')
                            //           }
                            //         })
                            //       }
                            //     })
                            //   } else {
                            //     console.log('currentMeasure.group[0].population is not an array')
                            //   }
                            // } else {
                            //   console.log('currentMeasure.group is not an array')
                            // }

                            // let inpatient_beds_utilization = 40;
                            // let inpatient_bed_covid_utilization = 48;
                            // let adult_icu_bed_covid_utilization = 52;
                            // let adult_icu_bed_utilization = 56;

                            console.log('--------------------')
                            console.log('inpatient_beds_utilization', row.inpatient_beds_utilization)
                            console.log('inpatient_bed_covid_utilization', row.inpatient_bed_covid_utilization)
                            console.log('adult_icu_bed_covid_utilization', row.adult_icu_bed_covid_utilization)
                            console.log('adult_icu_bed_utilization', row.adult_icu_bed_utilization)

                            measureReportTemplate.group.push({
                              "code": {
                                "coding": [
                                  {
                                    "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
                                    "code": "Beds"
                                  }
                                ]
                              },
                              "population": [                      
                                {
                                  "code": {
                                    "coding": [
                                      {
                                        "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                                        "code": "inpatient_beds_utilization"
                                      },
                                      {
                                        "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                                        "code": "measure-population"
                                      }
                                    ]
                                  },
                                  "count": parseFloat(row.inpatient_beds_utilization)
                                },
                                {
                                  "code": {
                                    "coding": [
                                      {
                                        "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                                        "code": "inpatient_bed_covid_utilization"
                                      },
                                      {
                                        "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                                        "code": "measure-population"
                                      }
                                    ]
                                  },
                                  "count": parseFloat(row.inpatient_bed_covid_utilization)
                                },
                                {
                                  "code": {
                                    "coding": [
                                      {
                                        "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                                        "code": "adult_icu_bed_covid_utilization"
                                      },
                                      {
                                        "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                                        "code": "measure-population"
                                      }
                                    ]
                                  },
                                  "count": parseFloat(row.adult_icu_bed_covid_utilization)
                                },
                                {
                                  "code": {
                                    "coding": [
                                      {
                                        "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                                        "code": "adult_icu_bed_utilization"
                                      },
                                      {
                                        "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                                        "code": "measure-population"
                                      }
                                    ]
                                  },
                                  "count": parseFloat(row.adult_icu_bed_utilization)
                                }                     
                              ]
                            })
                            

                            MeasureReports.update({id: measureReportTemplate.id}, {$set: measureReportTemplate});

                          } else {
                            // console.log("Adding a new MeasureReport: " + measureReportTemplate.id)

                            measureReportTemplate.group.push({
                              "code": {
                                "coding": [
                                  {
                                    "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
                                    "code": "Beds"
                                  }
                                ]
                              },
                              "population": [   
                                {
                                  "code": {
                                    "coding": [
                                      {
                                        "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                                        "code": "percent_of_inpatients_with_covid"
                                      },
                                      {
                                        "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                                        "code": "measure-population"
                                      }
                                    ]
                                  },
                                  "count": parseFloat(row.inpatient_beds_utilization)
                                },
                                {
                                  "code": {
                                    "coding": [
                                      {
                                        "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                                        "code": "adult_icu_bed_covid_utilization"
                                      },
                                      {
                                        "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                                        "code": "measure-population"
                                      }
                                    ]
                                  },
                                  "count": parseFloat(row.inpatient_bed_covid_utilization)
                                },
                                {
                                  "code": {
                                    "coding": [
                                      {
                                        "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                                        "code": "inpatient_beds_utilization"
                                      },
                                      {
                                        "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                                        "code": "measure-population"
                                      }
                                    ]
                                  },
                                  "count": parseFloat(row.inpatient_beds_utilization)
                                },                   
                                {
                                  "code": {
                                    "coding": [
                                      {
                                        "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                                        "code": "adult_icu_bed_utilization"
                                      },
                                      {
                                        "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                                        "code": "measure-population"
                                      }
                                    ]
                                  },
                                  "count": parseFloat(row.adult_icu_bed_utilization)
                                }                                            
                              ]
                            })

                            MeasureReports.insert(measureReportTemplate);
                          }
                        }



                });                
              }

            }            
          }
        }
      }

      if(error){
        if(error.statusCode === 404){
          console.log('Caught a 404')
        } else {
          console.log('Error fetching Covid19 data from Health and Human Services.', error)
        }  
      }
    })

  },
  async fetchCdcData(){
    console.log("Fetching data from the Centers for Disease Control...");
    console.log("https://www.cdc.gov/nhsn/pdfs/covid19/covid19-NatEst.csv");
    console.log("https://www.cdc.gov/nhsn/covid19/report-patient-impact.html");

    // [
    //   'state',
    //   'statename',
    //   'collectionDate',
    //   'InpatBeds_Occ_AnyPat_Est',
    //   'InpatBeds_Occ_AnyPat_LoCI',
    //   'InpatBeds_Occ_AnyPat_UpCI',
    //   'InpatBeds_Occ_AnyPat_Est_Avail',
    //   'InBedsOccAnyPat__Numbeds_Est',
    //   'InBedsOccAnyPat__Numbeds_LoCI',
    //   'InBedsOccAnyPat__Numbeds_UpCI',
    //   'InpatBeds_Occ_COVID_Est',
    //   'InpatBeds_Occ_COVID_LoCI',
    //   'InpatBeds_Occ_COVID_UpCI',
    //   'InBedsOccCOVID__Numbeds_Est',
    //   'InBedsOccCOVID__Numbeds_LoCI',
    //   'InBedsOccCOVID__Numbeds_UpCI',
    //   'ICUBeds_Occ_AnyPat_Est',
    //   'ICUBeds_Occ_AnyPat_LoCI',
    //   'ICUBeds_Occ_AnyPat_UpCI',
    //   'ICUBeds_Occ_AnyPat_Est_Avail',
    //   'ICUBedsOccAnyPat__N_ICUBeds_Est',
    //   'ICUBedsOccAnyPat__N_ICUBeds_LoCI',
    //   'ICUBedsOccAnyPat__N_ICUBeds_UpCI',
    //   'Notes'
    // ], [
    //     'Two-letter state abbreviation',
    //     'State name',
    //     'Day for which estimate is made',
    //     'Hospital inpatient bed occupancy, estimate',
    //     'Hospital inpatient bed occupancy, lower 95% CI',
    //     'Hospital inpatient bed occupancy, upper 95% CI',
    //     'Hospital inpatient beds available, estimate',
    //     'Hospital inpatient bed occupancy, percent estimate (percent of inpatient beds)',
    //     'Hospital inpatient bed occupancy, lower 95% CI (percent of inpatient beds)',
    //     'Hospital inpatient bed occupancy, upper 95% CI (percent of inpatient beds)',
    //     'Number of patients in an inpatient care location who have suspected or confirmed COVID-19,  estimate',
    //     'Number of patients in an inpatient care location who have suspected or confirmed COVID-19, lower 95% CI',
    //     'Number of patients in an inpatient care location who have suspected or confirmed COVID-19, upper 95% CI',
    //     'Number of patients in an inpatient care location who have suspected or confirmed COVID-19, percent estimate (percent of inpatient beds)',
    //     'Number of patients in an inpatient care location who have suspected or confirmed COVID-19, lower 95% CI (percent of inpatient beds)',
    //     'Number of patients in an inpatient care location who have suspected or confirmed COVID-19, upper 95% CI (percent of inpatient beds)',
    //     'ICU bed occupancy, estimate',
    //     'ICU bed occupancy, lower 95% CI',
    //     'ICU bed occupancy, upper 95% CI',
    //     'ICU beds available, estimate',
    //     'ICU bed occupancy, percent estimate (percent of ICU beds)',
    //     'ICU bed occupancy, lower 95% CI (percent of ICU beds)',
    //     'ICU bed occupancy, upper 95% CI (percent of ICU beds)',
    //     'This file contains National and State representative estimates from the CDC National Healthcare Safety Network (NHSN).'
    // ]
      

    await HTTP.get('https://www.cdc.gov/nhsn/pdfs/covid19/covid19-NatEst.csv', function(error, result){
      console.log('result', result)
      
      if(result){
        if(result.statusCode === 200){

          if(get(result, 'statusCode') === 200){
            if(has(result, 'content')){
              let parsedResults = PapaParse.parse(get(result, 'content'));

            console.log('parsedResults', parsedResults)

            if(!Organizations.findOne({id: 'CDC'})){
              Organizations.insert({
                "resourceType": "Organization",
                "id": "CDC",              
                "name": "Centers for Disease Control",              
                "address": [{
                  "resourceType": "Address",   
                  "city": "Atlanta",            
                  "state": "GA",
                  "country": "US",
                }],
                "status": "active"
              });  
            }

            let indianaHsaArray = [15001, 15093];

            let featureIndex = -1;
            let featureParams = {};
            let city = "";

            if(Array.isArray(parsedResults.data)){
              parsedResults.data.forEach(function(row, rowIndex){
                // the first two rows are header rows
                if(rowIndex > 1){
                  console.log('Collection Date: ', row[2], moment(row[2]).format("YYYY-MM-DD"));                 

                  // console.log("row[16]", row[16] )
                  // console.log("row[19]", row[19] )

                  if(Number(row[16]) + Number(row[19])){
                    
                    // we use a regex in the id to to remove whitespaces and convert to ProperCase
                    let measureReportTemplate = {
                      "resourceType": "MeasureReport",
                      "id": "NHSN-ICUBedCount-" + (row[1]).replace(/\s+/g, '') + "-" +  moment(row[2]).format("YYYYMMDD"),
                      "meta": {
                        "profile": [
                          "http://hl7.org/fhir/us/saner/StructureDefinition/PublicHealthMeasureReport"
                        ]
                      },
                      "text": {
                        "status": "generated",
                        "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"></div>"
                      },
                      "status": "complete",
                      "type": "summary",
                      "measure": "http://hl7.org/fhir/us/saner/Measure/CDCPatientImpactAndHospitalCapacity",
                      "subject": {
                        "reference": "Location/" + row[1],
                        "display": "State of " + row[1]
                      },
                      "date": moment(row[2]).format("YYYY-MM-DD"),
                      "reporter": {
                        "reference": "Organization/CDC",
                        "display": "U.S. Centers for Disease Control"
                      },
                      "period": {
                        "start": moment(row[2]).format("YYYY-MM-DD"),
                        "end": moment(row[2]).add(1, 'day').format("YYYY-MM-DD")
                      },
                      "group": []
                    };

                    let currentMeasure = MeasureReports.findOne({id: measureReportTemplate.id});
                    if(currentMeasure){

                      let numICUBeds = 0;
                      let numICUBedsOcc = 0;

                      // assuming we have an array to iterate through
                      if(Array.isArray(currentMeasure.group)){
                        if(Array.isArray(Array.isArray(currentMeasure.group[0].population))){
                          // look through each population 
                          currentMeasure.group[0].population.forEach(function(pop){

                            if(Array.isArray(pop.code.coding)){
                              pop.code.coding.forEach(function(coding){
                                if(coding.code === "numICUBeds"){
                                  numICUBeds = get(pop, 'count')
                                }
                                if(coding.code === "numICUBedsOcc"){
                                  numICUBedsOcc = get(pop, 'count')
                                }
                              })
                            }
                          })
                        } else {
                          console.log('currentMeasure.group[0].population is not an array')
                        }
                      } else {
                        console.log('currentMeasure.group is not an array')
                      }

                      console.log("Found an existing MeasureReport.  numICUBeds: " + numICUBeds + ", numICUBedsOcc: " + numICUBedsOcc)
                      console.log("Wanting to add the following - numICUBeds: " + Number(row[16]) + ", numICUBedsOcc: " + Number(row[19]))

                      measureReportTemplate.group.push({
                        "code": {
                          "coding": [
                            {
                              "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
                              "code": "Beds"
                            }
                          ]
                        },
                        "population": [                      
                          {
                            "code": {
                              "coding": [
                                {
                                  "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                                  "code": "numICUBeds"
                                },
                                {
                                  "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                                  "code": "measure-population"
                                }
                              ]
                            },
                            "count": Number(row[16]) + Number(row[19]) + numICUBeds + numICUBedsOcc
                          },
                          {
                            "code": {
                              "coding": [
                                {
                                  "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                                  "code": "numICUBedsOcc"
                                },
                                {
                                  "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                                  "code": "measure-population"
                                }
                              ]
                            },
                            "count": Number(row[16]) + numICUBedsOcc
                          }
                        ]
                      })
                      

                      MeasureReports.update({id: measureReportTemplate.id}, {$set: measureReportTemplate});

                    } else {
                      console.log("Adding a new MeasureReport: " + measureReportTemplate.id)

                      measureReportTemplate.group.push({
                        "code": {
                          "coding": [
                            {
                              "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
                              "code": "Beds"
                            }
                          ]
                        },
                        "population": [                      
                          {
                            "code": {
                              "coding": [
                                {
                                  "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                                  "code": "numICUBeds"
                                },
                                {
                                  "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                                  "code": "measure-population"
                                }
                              ]
                            },
                            "count": Number(row[16]) + Number(row[19])
                          },
                          {
                            "code": {
                              "coding": [
                                {
                                  "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                                  "code": "numICUBedsOcc"
                                },
                                {
                                  "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                                  "code": "measure-population"
                                }
                              ]
                            },
                            "count": Number(row[16])
                          }
                        ]
                      })

                      MeasureReports.insert(measureReportTemplate);
                    }
                  }                  
                }
              })
            }

            }            
          }
        }
      }

      if(error){
        if(error.statusCode === 404){
          console.log('Caught a 404')
        } else {
          console.log('Error fetching Covid19 data from the CDC National Healthcare Safety Network.', error)
        }  
      }
    })
  },
  async fetchIndianaApiData(){
    console.log("Fetching data from State of Indiana...");
    console.log("https://hub.mph.in.gov/api/3/action/datastore_search?resource_id=0c00f7b6-05b0-4ebe-8722-ccf33e1a314f");
    console.log("https://hub.mph.in.gov/dataset/covid-19-beds-and-vents/resource/882a7426-886f-48cc-bbe0-a8d14e3012e4");

    function registerOrgFromHsaName(hsaName){
      if(!Organizations.findOne({id: hsaName})){
        console.log("Couldnt find municipal organization responsible for HSA.  Registering: " + hsaName);
        city = hsaName.substring(4)
        state = hsaName.substring(0, 2);

        if(!Organizations.findOne({id: hsaName})){
          Organizations.insert({
            "resourceType": "Organization",
            "id": hsaName,              
            "name": city,              
            "address": [{
              "resourceType": "Address",   
              "city": city,            
              "state": state,
              "country": "US",
            }],
            "status": "active"
          });  
        }
      }
    }
    function registerLocationFromHsaName(hsaName, hsa93){
      if(!Locations.findOne({name: hsaName})){
        console.log("Couldnt find HSA.  Registering the following location: " + hsaName);

        Locations.insert({
          "resourceType": "Location",
          "name": hsaName,
          "address": {
            "resourceType": "Address",       
            "city": hsaName.substring(4),   
            "state": hsaName.substring(0, 2),
            "country": "US",
          },
          "identifier": [{
            "system": "HSA93",
            "value": hsa93
          }],
          "managingOrganization": {
            "display": "State of Indiana",
            "reference": "Organization/Indiana"
          },
          "status": "active",
          "id": "HSA93-" + hsa93
        }, function(error, result){
          if(error){
            console.log('Error inserting Location', error)
          }
          // if(result){
          //   console.log('Result inserting Location: ' + result)
          // }
        })
      }
    }
    function registerMeasureReportsFromRecordsArray(measureReportUrl, records){
      console.log('registerMeasureReportsFromRecordsArray().records', records)
      if(Array.isArray(records)){
        records.forEach(function(indianaStateReport){
          console.log('parsing indianaStateReport', indianaStateReport)
  
          let measureReportTemplate = {
            "resourceType": "MeasureReport",
            "id": "IndianaState-CapacityReport-" + moment(indianaStateReport.DATE).format("YYYYMMDD"),
            "meta": {
              "profile": [
                "http://hl7.org/fhir/us/saner/StructureDefinition/PublicHealthMeasureReport"
              ]
            },
            "text": {
              "status": "generated",
              "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"></div>"
            },
            "status": "complete",
            "type": "summary",
            "measure": measureReportUrl,
            "subject": {
              "reference": "Location/Indiana",
              "display": "State of Indiana"
            },
            "date": indianaStateReport.DATE,
            "reporter": {
              "reference": "Organization/Indiana",
              "display": "State of Indiana"
            },
            "period": {
              "start": indianaStateReport.DATE,
              "end": indianaStateReport.DATE
            },
            "group": [
              {
                "code": {
                  "coding": [
                    {
                      "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
                      "code": "Beds"
                    }
                  ]
                },
                "population": [                      
                  {
                    "code": {
                      "coding": [
                        // {
                        //   "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                        //   "code": "numICUBeds"
                        // },
                        {
                          "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                          "code": "numICUBeds_verified"
                        },
                        {
                          "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                          "code": "measure-population"
                        }
                      ]
                    },
                    "count": indianaStateReport.BEDS_ICU_TOTAL
                  },
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                          "code": "numICUBedsOcc"
                        },
                        {
                          "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                          "code": "measure-population"
                        }
                      ]
                    },
                    "count": indianaStateReport.BEDS_ICU_TOTAL - indianaStateReport.BEDS_AVAILABLE_ICU_BEDS_TOTAL
                  }
                ]
              },
              {
                "code": {
                  "coding": [
                    {
                      "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
                      "code": "Ventilators"
                    }
                  ]
                },
                "population": [
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                          "code": "numVent"
                        },
                        {
                          "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                          "code": "initial-population"
                        }
                      ]
                    },
                    "count": indianaStateReport.VENTS_TOTAL
                  },
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                          "code": "numVentUse"
                        },
                        {
                          "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                          "code": "measure-population"
                        }
                      ]
                    },
                    "count": indianaStateReport.VENTS_ALL_USE_COVID_19 + indianaStateReport.VENTS_NON_COVID_PTS_ON_VENTS
                  }
                ]
              }
            ]
          };
  
          let currentMeasure = MeasureReports.findOne({id: measureReportTemplate.id});
          if(currentMeasure){
            console.log("Found an existing MeasureReport.  Updating it." + measureReportTemplate.id)
            MeasureReports.update({id: measureReportTemplate.id}, {$set: measureReportTemplate});
  
          } else {
            console.log("Adding a new MeasureReport: " + measureReportTemplate.id)
            MeasureReports.insert(measureReportTemplate);
          }
  
        })  
      } else {
        console.log('Records not an array.')
      }
    }
    async function hasNext(nextUrl, measureReportUrl){
      await HTTP.get('https://hub.mph.in.gov/' + nextUrl, function(error, result){
        
        if(result){
          if(result.statusCode === 200){
  
            if(get(result, 'statusCode') === 200){
              
              let nextResults = JSON.parse(result.content);
              console.log('Successfully received the next results', nextResults)

              if(Array.isArray(nextResults.result.records)){  
                registerMeasureReportsFromRecordsArray(measureReportUrl, nextResults.result.records);
              }  

              if(Array.isArray(nextResults.records)){
                hasNext(nextResults.result._links.next, measureReportUrl)
              }  
            }
          }
        }
  
        if(error){
          if(error.statusCode === 404){
            console.log('Caught a 404')
          } else {
            console.log('Error fetching State of Indiana Covid19 data.', error)
          }  
        }
      })
    }

    await HTTP.get('https://hub.mph.in.gov/api/3/action/datastore_search?resource_id=0c00f7b6-05b0-4ebe-8722-ccf33e1a314f', function(error, result){
      // console.log('result', result)
      if(result){
        if(result.statusCode === 200){

          if(get(result, 'statusCode') === 200){
            
            let parsedResults = JSON.parse(result.content);
            console.log('Successfully received a result', parsedResults)

            if(!Organizations.findOne({id: 'Indiana'})){
              console.log('Couldnt find the State of Indiana.  Registering it as an Organization.')
              Organizations.insert({
                "resourceType": "Organization",
                "id": "Indiana",              
                "name": "State of Indiana",              
                "address": [{
                  "resourceType": "Address",   
                  "city": "Indianapolis",            
                  "state": "IN",
                  "country": "US",
                }],
                "status": "active"
              });  
            }

            let indianaHsaArray = [15001, 15093];

            let featureIndex = -1;
            let featureParams = {};
            let city = "";

            console.log('Parsing Indiana HSA zones.')
            for(var hsa93 = 15001; hsa93 < 15093; hsa93++){
              //console.log('hsa93', hsa93)

              featureIndex = findIndex(hsaGeoJsonLayer.features, function(feature){
                return (get(feature, 'properties.HSA93')).toString() === hsa93.toString();
              })

              if(featureIndex > -1){
                featureParams = hsaGeoJsonLayer.features[featureIndex];

                if(get(featureParams, 'properties.HSANAME')){
                  registerOrgFromHsaName(featureParams.properties.HSANAME);
                  registerLocationFromHsaName(featureParams.properties.HSANAME, hsa93)

                  
                }
              }
            }
            let measureReportUrl = get(Meteor, 'settings.public.interfaces.symptomaticFhirServer.channel.endpoint') + '/MeasureReport';
            console.log('measureReportUrl', measureReportUrl)

            if(Array.isArray(parsedResults.result.records)){
              registerMeasureReportsFromRecordsArray(measureReportUrl, parsedResults.result.records);
            }  

            if(get(parsedResults, 'result._links.next')){
              if(parsedResults.result.records.length > 0){
                hasNext(parsedResults.result._links.next, measureReportUrl)
              }
            }
          }
        }
      }

      if(error){
        if(error.statusCode === 404){
          console.log('Caught a 404')
        } else {
          console.log('Error fetching State of Indiana Covid19 data.', error)
        }  
      }
    })

  },
  async fetchChicagoCovidData(){
    console.log("Fetching data from City of Chicago...");
    console.log("https://data.cityofchicago.org/resource/f3he-c6sv.json");
    console.log("https://data.cityofchicago.org/Health-Human-Services/COVID-19-Hospital-Capacity-Metrics/f3he-c6sv");
    
    await HTTP.get('https://data.cityofchicago.org/resource/f3he-c6sv.json', function(error, result){
      // console.log('result', result)
      if(result){
        if(result.statusCode === 200){

          if(!Locations.findOne({name: "City of Chicago"})){
            Locations.insert({
              "resourceType": "Location",
              "name": "City of Chicago",
              "address": {
                "resourceType": "Address",                
                "city": "Chicago",
                "state": "IL",
                "postalCode": "60007",
                "country": "US",
              },
              "position": {
                "longitude": -87.6298,
                "latitude": 41.8781,
                "altitude": null
              },
              "_location": {
                "type": "Point",
                "coordinates": [
                  -87.6298,
                  41.8781
                ]
              },
              "identifier": [{
                "system": "HSA93",
                "value": 14023
              }],
              "status": "active",
              "id": "Chicago"
            }, function(error, result){
              if(error){
                console.log('Error inserting Location', error)
              }
              // if(result){
              //   console.log('Result inserting Location: ' + result)
              // }
            })
          }

          if(!Organizations.findOne({name: "City of Chicago"})){
            Organizations.insert({
              "resourceType": "Organization",
              "id": "Chicago",              
              "name": "City of Chicago",              
              "address": [{
                "resourceType": "Address",                
                "city": "Chicago",
                "state": "IL",
                "postalCode": "60007",
                "country": "US",
              }],
              "status": "active"
            }, function(error, result){
              if(error){
                console.log('Error inserting Organization', error)
              }
              if(result){
                console.log('Result inserting Organization: ' + result)
              }
            })
          }
          

          if(Array.isArray(result.data)){
            let measureReportUrl = get(Meteor, 'settings.public.interfaces.symptomaticFhirServer.channel.endpoint') + '/MeasureReport';
            console.log('measureReportUrl', measureReportUrl)
            
            result.data.forEach(function(cityCovidReport){

              let measureReportTemplate = {
                "resourceType": "MeasureReport",
                "id": "CityOfChicago-CapacityReport-" + moment(cityCovidReport.date).format("YYYYMMDD"),
                "meta": {
                  "profile": [
                    "http://hl7.org/fhir/us/saner/StructureDefinition/PublicHealthMeasureReport"
                  ]
                },
                "text": {
                  "status": "generated",
                  "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"></div>"
                },
                "status": "complete",
                "type": "summary",
                "measure": "http://hl7.org/fhir/us/saner/Measure/CDCPatientImpactAndHospitalCapacity",
                "subject": {
                  "reference": "Location/Chicago",
                  "display": "City of Chicago"
                },
                "date": cityCovidReport.date,
                "reporter": {
                  "reference": "Organization/Chicago",
                  "display": "City of Chicago"
                },
                "period": {
                  "start": cityCovidReport.date,
                  "end": cityCovidReport.date
                },
                "group": [
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
                          "code": "Beds"
                        }
                      ]
                    },
                    "population": [
                      {
                        "code": {
                          "coding": [
                            {
                              "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                              "code": "numTotBeds"
                            },
                            {
                              "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                              "code": "initial-population"
                            }
                          ]
                        },
                        "count": cityCovidReport.acute_non_icu_beds_total_capacity
                      },
                      {
                        "code": {
                          "coding": [
                            {
                              "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                              "code": "numBeds"
                            },
                            {
                              "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                              "code": "measure-population"
                            }
                          ]
                        },
                        "count": cityCovidReport.acute_non_icu_beds_in_use_total
                      },
                      {
                        "code": {
                          "coding": [
                            {
                              "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                              "code": "numBedsOcc"
                            },
                            {
                              "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                              "code": "measure-population"
                            }
                          ]
                        },
                        "_count": {
                          "extension": [
                            {
                              "url": "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
                              "valueCode": "unsupported"
                            }
                          ]
                        }
                      },
                      {
                        "code": {
                          "coding": [
                            {
                              "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                              "code": "numICUBeds_verified"
                            },
                            {
                              "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                              "code": "measure-population"
                            }
                          ]
                        },
                        "count": cityCovidReport.icu_beds_total_capacity
                      },
                      {
                        "code": {
                          "coding": [
                            {
                              "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                              "code": "numICUBedsOcc"
                            },
                            {
                              "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                              "code": "measure-population"
                            }
                          ]
                        },
                        "count": cityCovidReport.icu_beds_in_use_total
                      }
                    ]
                  },
                  {
                    "code": {
                      "coding": [
                        {
                          "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasureGroupSystem",
                          "code": "Ventilators"
                        }
                      ]
                    },
                    "population": [
                      {
                        "code": {
                          "coding": [
                            {
                              "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                              "code": "numVent"
                            },
                            {
                              "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                              "code": "initial-population"
                            }
                          ]
                        },
                        "count": cityCovidReport.ventilators_total_capacity
                      },
                      {
                        "code": {
                          "coding": [
                            {
                              "system": "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                              "code": "numVentUse"
                            },
                            {
                              "system": "http://terminology.hl7.org/CodeSystem/measure-population",
                              "code": "measure-population"
                            }
                          ]
                        },
                        "count": cityCovidReport.ventilators_in_use_total
                      }
                    ]
                  }
                ]
              };

              
              // console.log("Attempting to POST a new MeasureReport to the FHIR Server.")
              // HTTP.post(measureReportUrl, {
              //   headers: {},
              //   data: measureReportTemplate
              // }, function(error, result){
              //   if (error) {
              //     console.log("POST /MeasureReport", error);
              //   }
              //   if (result) {
              //     console.log("POST /MeasureReport", result);
              //   }
              // });

              console.log("Adding a new MeasureReport: " + measureReportTemplate.id)
              MeasureReports.upsert({id: measureReportTemplate.id}, {$set: measureReportTemplate});
            })
          }
        }
      }

      if(error){
        if(error.statusCode === 404){
          console.log('Caught a 404')
        } else {
          console.log('Error fetching City of Chicago Covid19 data.', error)
        }  
      }
    })
  },
  async calcPercentUsage(){
    console.log('Calculating percentage usage for ' + numTotalReports + ' reports...')

    let numTotalReports = MeasureReports.find().count();
    await MeasureReports.find().forEach(function(report, reportIndex){

      let numICUBeds = 0;
      let numICUBedsOcc = 0;
      let percentICUBedsOccupied = 0;
      let percentOccupied = 0;

      if(Array.isArray(report.group)){
        report.group.forEach(function(group, groupIndex){
          //console.log('group', group);
          if(get(group, 'code.coding[0].code') === "Beds"){

            if(has(report, 'group[0].measureScore.value')){
              groupPopulationCount = get(report, 'group[0].measureScore.value', '');
            } else if(Array.isArray(group.population)){
              group.population.forEach(function(pop){
                //console.log('pop', pop)
                if(Array.isArray(get(pop, 'code.coding'))){
                  pop.code.coding.forEach(function(encoding){

                    // REFACTOR / EXTRACT
                    // This is a CDC code for the SANER implementation
                    if(get(encoding, 'code') === "numICUBeds"){
                      numICUBeds = pop.count;
                    } else if(get(encoding, 'code') === "numICUBeds_verified"){
                      numICUBeds = pop.count;
                    } else if(get(encoding, 'code') === "adult_icu_bed_utilization"){
                      percentICUBedsOccupied = pop.count;
                    } else if(get(encoding, 'code') === "numICUBedsOcc"){
                      numICUBedsOcc = pop.count;
                    }
                  })
                }
              })

              if(numICUBeds > 0){
                percentOccupied = (numICUBedsOcc / numICUBeds * 100).toFixed(2);
              }

              console.log('MeasureReport ' + reportIndex + ' of ' + numTotalReports + " - ICU Beds Occupied: " + percentOccupied + "%")

              
              let managingOrgReportIndex = findIndex(group.population, function(record){
                // by measuring the end of the reporting period
                let evaluation = false;
                if(Array.isArray(record.code.coding)){
                  record.code.coding.forEach(function(coding){
                    if(get(coding, 'code') === get(Meteor, 'settings.pubic.saner.measureScore', 'numICUBeds')){
                      evaluation = true;
                    }
                  })
                }
                return evaluation;
              });

              // console.log('managingOrgReportIndex', managingOrgReportIndex)

              // replace the existing score
              if(managingOrgReportIndex > -1){
                group.population[managingOrgReportIndex] = {
                  "code" : {
                      "coding" : [ 
                          {
                              "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                              "code" : "adult_icu_bed_utilization"
                          }, 
                          {
                              "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                              "code" : "measure-population"
                          }
                      ]
                  },
                  "count" : percentOccupied
                };
                // console.log('report', report)
                MeasureReports.update({_id: report._id}, {$set: report}); 
              } else {
                // create new
                group.population.push({
                  "code" : {
                      "coding" : [ 
                          {
                              "system" : "http://hl7.org/fhir/us/saner/CodeSystem/MeasurePopulationSystem",
                              "code" : "adult_icu_bed_utilization"
                          }, 
                          {
                              "system" : "http://terminology.hl7.org/CodeSystem/measure-population",
                              "code" : "measure-population"
                          }
                      ]
                  },
                  "count" : percentOccupied
                })
                // console.log('report', report)
                MeasureReports.update({_id: report._id}, {$set: report}); 
              }



                           
            }
          }
        })
      }
    });
  },
  async initChicagoTestingSites(){
    console.log('Initializing Chicago testing sites...')

    HTTP.get('https://data.cityofchicago.org/resource/thdn-3grx.geojson', function(error, result){
      if(result){
        console.log('result', result)

        if(get(result, 'statusCode') === 200){
          let parsedResults = JSON.parse(result.content);
          console.log('Successfully received a result', parsedResults)

          if(Array.isArray(parsedResults.features)){
            parsedResults.features.forEach(function(feature){
              //console.log('feature', feature)

              let endpoint;
              let endpointId;
              
              if(Endpoints.findOne({address: get(feature, 'properties.web_site.url')})){
                endpoint = Endpoints.findOne({address: get(feature, 'properties.web_site.url')});
                endpointId = get(endpoint, '_id');
              } else {
                endpointId = Endpoints.insert({
                  "resourceType": "Endpoint",
                  "status": "active",
                  "address": get(feature, 'properties.web_site.url')
                });  
              }
              // console.log('endpointId', endpointId)

              if(!Locations.findOne({"name": get(feature, 'properties.facility')})){
                let newLocation = {
                  "resourceType": "Location",
                  "name": get(feature, 'properties.facility'),
                  "address": parseAddressFromString(get(feature, 'properties.address'), ''),
                  "identifier": [{
                    "system": "data.cityofchicago.org/resource/thdn-3grx",
                    "value": "City of Chicago - Testing Sites"
                  }],
                  "type": [{
                    "text": "",
                    "coding": [{
                      "code": "OUTLAB",
                      "display": "outpatient laboratory",
                      "system": "http://terminology.hl7.org/ValueSet/v3-ServiceDeliveryLocationRoleType"
                    }]
                  }],
                  "status": "active",
                  "endpoint": [{
                    // "reference": get(feature, 'properties.web_site.url'),
                    "reference": "Endpoint/" + endpointId,
                    "display": get(feature, 'properties.facility')
                  }],
                  "id": "testingsite-" + Random.id()
                }
                // console.log('newLocation', newLocation)
                
                newLocation._id = Locations.insert(newLocation, function(error, result){
                  if(error){
                    console.log('Error inserting Location', error)
                  }
                })                
                Meteor.call('geocodeTestingSite', newLocation, function(error, result){
                  if(error){
                    console.log('geocodeAddress.error', error)
                  }
                  if(result){
                    console.log('geocodeAddress.result', result) 
                  }
                }) 
              }
            })
          }
        }
      }
      if(error){
        console.log('error', error)
      }
    })

  },
  async writeLocationToHistory(){
    console.log("Writing Locations cursor to LocationsHistory");

    console.log('Locations.count:  ', Locations.find().count());
    console.log('LocationsHistory.count: ', LocationsHistory.find().count());

    let latestKnownVersion = 1;
    LocationsHistory.find().forEach(function(locationRecord){
      if(has(locationRecord, 'meta.versionId')){
        if(toInteger(get(locationRecord, 'meta.versionId')) > latestKnownVersion){
          latestKnownVersion = toInteger(get(locationRecord, 'meta.versionId'));
        }
      }
    });

    console.log('Latest known publication version: ' + latestKnownVersion);

    let newPubVersion = latestKnownVersion + 1;
    console.log('New publication version: ' + newPubVersion);

    Locations.find().forEach(function(locationRecord){
      if(!has(locationRecord, 'meta')){
        locationRecord.meta = {}
      }  
      if(!has(locationRecord, 'meta.versionId')){
        locationRecord.meta.versionId = newPubVersion;
      }

      if(!LocationsHistory.findOne({id: locationRecord.id})){
        
        locationRecord._id = Random.id();
        LocationsHistory.insert(locationRecord);
      }
    })

    return newPubVersion;
  },
  async writeLocationToTestingSites(){
    console.log("Writing Locations cursor to TestingSiteLocations");

    console.log('Locations.count:  ', Locations.find().count());
    console.log('TestingSiteLocations.count: ', TestingSiteLocations.find().count());

    let count = 0;

    Locations.find().forEach(function(locationRecord){
      if(!has(locationRecord, 'meta')){
        locationRecord.meta = {}
      }  
      if(!has(locationRecord, 'meta.versionId')){
        locationRecord.meta.versionId = 1;
      }

      if(TestingSiteLocations.find({id: locationRecord.id}).count() === 0){
        TestingSiteLocations.insert(locationRecord);
      } else {
        locationRecord._id = Random.id();
        locationRecord.meta.versionId = TestingSiteLocations.find({id: locationRecord.id}).count() + 1;
        TestingSiteLocations.insert(locationRecord);
      }

      count++;
    })

    return count;
  },
  async geocodeTestingSite(location){

    console.log('Geocoding address for Testing Location ' + location._id)

    await Meteor.call('geocodeAddress', get(location, 'address'), function(error, geocodedResult){
      if(geocodedResult){
        console.log('Success! Geocoded results: ', geocodedResult)
      }

      if(Array.isArray(geocodedResult)){
        let encodedResult = geocodedResult[0];
        let lineAddress = '';
        if(get(encodedResult, 'streetName')){
          lineAddress = get(encodedResult, 'streetNumber') + " " + get(encodedResult, 'streetName');
        }
        Locations.update({_id: location._id}, {$set: {
          address: {
            resourceType: "Address",
            line: [lineAddress.trim()],
            city: get(encodedResult, 'city', ''),
            state: get(encodedResult, 'administrativeLevels.level1short', ''),
            postalCode: get(encodedResult, 'zipcode', ''),
            country: get(encodedResult, 'countryCode', '')
          },
          position: {
            longitude: get(encodedResult, 'longitude'),
            latitude: get(encodedResult, 'latitude')
          },
          _location: {
            type: "Point",
            coordinates: [get(encodedResult, 'longitude'), get(encodedResult, 'latitude')]
          }
        }})  
      }

      // console.log('transactionId', transactionId);
      // console.log('Updated location record', Locations.findOne(transactionId))
    })
  }
})





