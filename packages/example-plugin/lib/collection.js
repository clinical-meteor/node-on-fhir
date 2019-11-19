
  
  // create the object using our BaseModel
  Note = BaseModel.extend();
  
  //Assign a collection so the object knows how to perform CRUD operations
  Note.prototype._collection = Notes;
  
  // Create a persistent data store for addresses to be stored.
  // HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');
  Notes = new Mongo.Collection('Notes');
  
  //Add the transform to the collection since Meteor.users is pre-defined by the accounts package
  Notes._transform = function (document) {
    return new Note(document);
  };
  
  
  
  NoteSchema = new SimpleSchema([
    {
    "resourceType" : {
      type: String,
      defaultValue: "Note"
    },
    "tags" : {
      optional: true,
      type: [ String ]
    }, 
    "note" : {
      optional: true,
      type: String
    }
  }]);
  Notes.attachSchema(NoteSchema);
  
  




//=================================================================
// FHIR Methods

Notes.fetchBundle = function (query, parameters, callback) {
    var noteArray = Notes.find(query, parameters, callback).map(function(note){
      note.id = note._id;
      delete note._document;
      return note;
    });
  
    // console.log("noteArray", noteArray);
  
    // var result = Bundle.generate(noteArray);
    var result = noteArray;
    
    // console.log("result", result.entry[0]);
  
    return result;
  };
  
  
  /**
   * @summary This function takes a FHIR resource and prepares it for storage in Mongo.
   * @memberOf Notes
   * @name toMongo
   * @version 1.6.0
   * @returns { Note }
   * @example
   * ```js
   *  let notes = Notes.toMongo('12345').fetch();
   * ```
   */
  
  Notes.toMongo = function (originalNote) {
    return originalNote;
  };
  
  
  /**
   * @summary Similar to toMongo(), this function prepares a FHIR record for storage in the Mongo database.  The difference being, that this assumes there is already an existing record.
   * @memberOf Notes
   * @name prepForUpdate
   * @version 1.6.0
   * @returns { Object }
   * @example
   * ```js
   *  let notes = Notes.findMrn('12345').fetch();
   * ```
   */
  
  Notes.prepForUpdate = function (note) {
    return note;
  };
  
  
  /**
   * @summary Scrubbing the note; make sure it conforms to v1.6.0
   * @memberOf Notes
   * @name scrub
   * @version 1.2.3
   * @returns {Boolean}
   * @example
   * ```js
   *  let notes = Notes.findMrn('12345').fetch();
   * ```
   */
  
  Notes.prepForFhirTransfer = function (note) {
    process.env.DEBUG && console.log("Notes.prepForBundle()");
  
    console.log("Notes.prepForBundle()", note);  
    return note;
  };
  