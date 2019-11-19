

//==========================================================================================
// Global Configs  

var fhirVersion = 'fhir-3.0.0';

if(typeof oAuth2Server === 'object'){
  // TODO:  double check that this is needed; and that the /api/ route is correct
  JsonRoutes.Middleware.use(
    // '/api/*',
    '/fhir-3.0.0/*',
    oAuth2Server.oauthserver.authorise()   // OAUTH FLOW - A7.1
  );
}

JsonRoutes.setResponseHeaders({
  "content-type": "application/fhir+json"
});



//==========================================================================================
// Global Method Overrides

// this is temporary fix until PR 132 can be merged in
// https://github.com/stubailo/meteor-rest/pull/132

JsonRoutes.sendResult = function (res, options) {
  options = options || {};

  // Set status code on response
  res.statusCode = options.code || 200;

  // Set response body
  if (options.data !== undefined) {
    var shouldPrettyPrint = (process.env.NODE_ENV === 'development');
    var spacer = shouldPrettyPrint ? 2 : null;
    res.setHeader('Content-type', 'application/fhir+json');
    res.write(JSON.stringify(options.data, null, spacer));
  }

  // We've already set global headers on response, but if they
  // pass in more here, we set those.
  if (options.headers) {
    //setHeaders(res, options.headers);
    options.headers.forEach(function(value, key){
      res.setHeader(key, value);
    });
  }

  // Send the response
  res.end();
};




//==========================================================================================
// Step 1 - Create New Note  

JsonRoutes.add("put", "/Note/:id", function (req, res, next) {
  process.env.DEBUG && console.log('PUT /fhir-1.6.0/Note/' + req.params.id);
  //process.env.DEBUG && console.log('PUT /fhir-1.6.0/Note/' + req.query._count);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken;

  if(typeof oAuth2Server === 'object'){
    accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});    
  } 
//   else {
//     // no oAuth server installed; Not Implemented
//     JsonRoutes.sendResult(res, {
//       code: 501
//     });
//   }

    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {
      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }


      if (req.body) {
        noteUpdate = req.body;

        // remove id and meta, if we're recycling a resource
        delete req.body.id;
        delete req.body.meta;

        //process.env.TRACE && console.log('req.body', req.body);

        noteUpdate.resourceType = "Note";
        noteUpdate = Notes.toMongo(noteUpdate);

        //process.env.TRACE && console.log('noteUpdate', noteUpdate);


        noteUpdate = Notes.prepForUpdate(noteUpdate);


        process.env.DEBUG && console.log('-----------------------------------------------------------');
        process.env.DEBUG && console.log('noteUpdate', JSON.stringify(noteUpdate, null, 2));
        // process.env.DEBUG && console.log('newNote', newNote);

        var note = Notes.findOne(req.params.id);
        var noteId;

        if(note){
          process.env.DEBUG && console.log('Note found...')
          noteId = Notes.update({_id: req.params.id}, {$set: noteUpdate },  function(error, result){
            if (error) {
              process.env.TRACE && console.log('PUT /fhir/Note/' + req.params.id + "[error]", error);

              // Bad Request
              JsonRoutes.sendResult(res, {
                code: 400
              });
            }
            if (result) {
              process.env.TRACE && console.log('result', result);
              res.setHeader("Location", "fhir/Note/" + result);
              res.setHeader("Last-Modified", new Date());
              res.setHeader("ETag", "1.6.0");

              var notes = Notes.find({_id: req.params.id});
              var payload = [];

              notes.forEach(function(record){
                payload.push(Notes.prepForFhirTransfer(record));
              });

              console.log("payload", payload);

              // success!
              JsonRoutes.sendResult(res, {
                code: 200,
                data: payload
                //data: Bundle.generate(payload)
              });
            }
          });
        } else {        
          process.env.DEBUG && console.log('No note found.  Creating one.');
          noteUpdate._id = req.params.id;
          noteId = Notes.insert(noteUpdate,  function(error, result){
            if (error) {
              process.env.TRACE && console.log('PUT /fhir/Note/' + req.params.id + "[error]", error);

              // Bad Request
              JsonRoutes.sendResult(res, {
                code: 400
              });
            }
            if (result) {
              process.env.TRACE && console.log('result', result);
              res.setHeader("Location", "fhir/Note/" + result);
              res.setHeader("Last-Modified", new Date());
              res.setHeader("ETag", "1.6.0");

              var notes = Notes.find({_id: req.params.id});
              var payload = [];

              notes.forEach(function(record){
                payload.push(Notes.prepForFhirTransfer(record));
              });

              console.log("payload", payload);

              // success!
              JsonRoutes.sendResult(res, {
                code: 200,
                data: payload
                //data: Bundle.generate(payload)
              });
            }
          });        
        }
      } else {
        // no body; Unprocessable Entity
        JsonRoutes.sendResult(res, {
          code: 422
        });

      }


    } else {
      // Unauthorized
      JsonRoutes.sendResult(res, {
        code: 401
      });
    }

});



//==========================================================================================
// Step 2 - Read Note  

JsonRoutes.add("get", "/Note/:id", function (req, res, next) {
  process.env.DEBUG && console.log('GET /fhir-1.6.0/Note/' + req.params.id);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken;

  if(typeof oAuth2Server === 'object'){
    accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});
  } else {
    // no oAuth server installed; Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }


    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      var noteData = Notes.findOne({_id: req.params.id});
      if (noteData) {
        noteData.id = noteData._id;

        delete noteData._document;
        delete noteData._id;

        process.env.TRACE && console.log('noteData', noteData);

        // Success
        JsonRoutes.sendResult(res, {
          code: 200,
          data: Notes.prepForFhirTransfer(noteData)
        });
      } else {
        // Gone
        JsonRoutes.sendResult(res, {
          code: 410
        });
      }
    } else {
      // Unauthorized
      JsonRoutes.sendResult(res, {
        code: 401
      });
    }
});

//==========================================================================================
// Step 3 - Update Note  

JsonRoutes.add("post", "/Note", function (req, res, next) {
  process.env.DEBUG && console.log('POST /fhir/Note/', JSON.stringify(req.body, null, 2));

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken;

  if(typeof oAuth2Server === 'object'){
    accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});
  } else {
    // Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }

    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      var noteId;
      var newNote;

      if (req.body) {
        newNote = req.body;


        // remove id and meta, if we're recycling a resource
        delete newNote.id;
        delete newNote.meta;


        newNote = Notes.toMongo(newNote);

        process.env.TRACE && console.log('newNote', JSON.stringify(newNote, null, 2));
        // process.env.DEBUG && console.log('newNote', newNote);

        console.log('Cleaning new note...')
        NoteSchema.clean(newNote);

        var practionerContext = NoteSchema.newContext();
        practionerContext.validate(newNote)
        console.log('New note is valid:', practionerContext.isValid());
        console.log('check', check(newNote, NoteSchema))
        


        var noteId = Notes.insert(newNote,  function(error, result){
          if (error) {
            process.env.TRACE && console.log('error', error);

            // Bad Request
            JsonRoutes.sendResult(res, {
              code: 400
            });
          }
          if (result) {
            process.env.TRACE && console.log('result', result);
            res.setHeader("Location", "fhir-1.6.0/Note/" + result);
            res.setHeader("Last-Modified", new Date());
            res.setHeader("ETag", "1.6.0");

            var notes = Notes.find({_id: result});
            var payload = [];

            notes.forEach(function(record){
              payload.push(Notes.prepForFhirTransfer(record));
            });

            //console.log("payload", payload);
            // Created
            JsonRoutes.sendResult(res, {
              code: 201,
              data: Bundle.generate(payload)
            });
          }
        });
        console.log('noteId', noteId);
      } else {
        // Unprocessable Entity
        JsonRoutes.sendResult(res, {
          code: 422
        });
      }

    } else {
      // Unauthorized
      JsonRoutes.sendResult(res, {
        code: 401
      });
    }
});

//==========================================================================================
// Step 4 - NoteHistoryInstance

JsonRoutes.add("get", "/Note/:id/_history", function (req, res, next) {
  process.env.DEBUG && console.log('GET /fhir-1.6.0/Note/', req.params);
  process.env.DEBUG && console.log('GET /fhir-1.6.0/Note/', req.query._count);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken;

  if(typeof oAuth2Server === 'object'){
    accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});
  } else {
    // no oAuth server installed; Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }

    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      var notes = Notes.find({_id: req.params.id});
      var payload = [];

      notes.forEach(function(record){
        payload.push(Notes.prepForFhirTransfer(record));

        // the following is a hack, to conform to the Touchstone Note testscript
        // https://touchstone.aegis.net/touchstone/testscript?id=06313571dea23007a12ec7750a80d98ca91680eca400b5215196cd4ae4dcd6da&name=%2fFHIR1-6-0-Basic%2fP-R%2fNote%2fClient+Assigned+Id%2fNote-client-id-json&version=1&latestVersion=1&itemId=&spec=HL7_FHIR_STU3_C2
        // the _history query expects a different resource in the Bundle for each version of the file in the system
        // since we don't implement record versioning in Meteor on FHIR yet
        // we are simply adding two instances of the record to the payload 
        payload.push(Notes.prepForFhirTransfer(record));
      });
      // Success
      JsonRoutes.sendResult(res, {
        code: 200,
        data: Bundle.generate(payload, 'history')
      });
    } else {
      // Unauthorized
      JsonRoutes.sendResult(res, {
        code: 401
      });
    }
});

//==========================================================================================
// Step 5 - Note Version Read

// NOTE:  We've not implemented _history functionality yet; so this endpoint is mostly a duplicate of Step 2.

JsonRoutes.add("get", "/Note/:id/_history/:versionId", function (req, res, next) {
  process.env.DEBUG && console.log('GET /fhir-1.6.0/Note/:id/_history/:versionId', req.params);
  //process.env.DEBUG && console.log('GET /fhir-1.6.0/Note/:id/_history/:versionId', req.query._count);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken;

  if(typeof oAuth2Server === 'object'){
    accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});  
  } else {
    // no oAuth server installed; Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }


  if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

    if (accessToken) {
      process.env.TRACE && console.log('accessToken', accessToken);
      process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
    }

    var noteData = Notes.findOne({_id: req.params.id});
    if (noteData) {
      
      noteData.id = noteData._id;

      delete noteData._document;
      delete noteData._id;

      process.env.TRACE && console.log('noteData', noteData);

      JsonRoutes.sendResult(res, {
        code: 200,
        data: Notes.prepForFhirTransfer(noteData)
      });
    } else {
      JsonRoutes.sendResult(res, {
        code: 410
      });
    }

  } else {
    JsonRoutes.sendResult(res, {
      code: 401
    });
  }
});



//==========================================================================================
// Step 6 - Note Search Type  



generateDatabaseQuery = function(query){
  process.env.DEBUG && console.log("generateDatabaseQuery", query);

  var databaseQuery = {};

   if (query.name) {
    databaseQuery['name'] = {
      $regex: query.name,
      $options: 'i'
    };
  }
  if (query.identifier) {
    var paramsArray = query.identifier.split('|');
    process.env.DEBUG && console.log('paramsArray', paramsArray);
    
    databaseQuery['identifier.value'] = paramsArray[1]};

    process.env.DEBUG && console.log('databaseQuery', databaseQuery);
    return databaseQuery;
  }



JsonRoutes.add("get", "/Note", function (req, res, next) {
  process.env.DEBUG && console.log('GET /fhir-1.6.0/Note', req.query);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken;
  if(typeof oAuth2Server === 'object'){
    accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});
  } else {
    // no oAuth server installed; Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }


    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      var databaseQuery = generateDatabaseQuery(req.query);

      var payload = [];
      var notes = Notes.find(databaseQuery).fetch();
      process.env.DEBUG && console.log('notes', notes);

      notes.forEach(function(record){
        payload.push(Notes.prepForFhirTransfer(record));
      });
      process.env.TRACE && console.log('payload', payload);

      // Success
      JsonRoutes.sendResult(res, {
        code: 200,
        data: Bundle.generate(payload)
      });
    } else {
      // Unauthorized
      JsonRoutes.sendResult(res, {
        code: 401
      });
    }
});


JsonRoutes.add("post", "/Note/:param", function (req, res, next) {
  process.env.DEBUG && console.log('POST /fhir-1.6.0/Note/' + JSON.stringify(req.query));

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken;
  if(typeof oAuth2Server === 'object'){
    accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});
  } else {
    // no oAuth server installed; Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }


    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      var notes = [];

      if (req.params.param.includes('_search')) {
        var searchLimit = 1;
        if (req && req.query && req.query._count) {
          searchLimit = parseInt(req.query._count);
        }

        var databaseQuery = generateDatabaseQuery(req.query);
        process.env.DEBUG && console.log('databaseQuery', databaseQuery);

        notes = Notes.find(databaseQuery, {limit: searchLimit}).fetch();

        process.env.DEBUG && console.log('notes', notes);

        var payload = [];

        notes.forEach(function(record){
          payload.push(Notes.prepForFhirTransfer(record));
        });
      }

      process.env.TRACE && console.log('payload', payload);

      // Success
      JsonRoutes.sendResult(res, {
        code: 200,
        data: Bundle.generate(payload)
      });
    } else {
      // Unauthorized
      JsonRoutes.sendResult(res, {
        code: 401
      });
    }
});




//==========================================================================================
// Step 7 - Note Delete    

JsonRoutes.add("delete", "/Note/:id", function (req, res, next) {
  process.env.DEBUG && console.log('DELETE /fhir-1.6.0/Note/' + req.params.id);

  res.setHeader("Access-Control-Allow-Origin", "*");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  var accessToken;
  if(typeof oAuth2Server === 'object'){
    accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});
  } else {
    // no oAuth server installed; Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }


    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      if (Notes.find({_id: req.params.id}).count() === 0) {
        // No Content
        JsonRoutes.sendResult(res, {
          code: 204
        });
      } else {
        Notes.remove({_id: req.params.id}, function(error, result){
          if (result) {
            // No Content
            JsonRoutes.sendResult(res, {
              code: 204
            });
          }
          if (error) {
            // Conflict
            JsonRoutes.sendResult(res, {
              code: 409
            });
          }
        });
      }


    } else {
      // Unauthorized
      JsonRoutes.sendResult(res, {
        code: 401
      });
    }  
  
});





// WebApp.connectHandlers.use("/fhir/Note", function(req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   return next();
// });
