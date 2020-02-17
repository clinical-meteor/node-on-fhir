
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

convertBirthdateToValidDate = function(document){
  // we need to check if the birthdate is a valid string
  let newDate = moment(document.birthDate).toDate();

  // moment() is a champ for doing this, but will return an Invalid Date object
  // which we have to check for with this wacky function
  if ( Object.prototype.toString.call(newDate) === "[object Date]" ) {
    // it is a date
    if ( isNaN( newDate.getTime() ) ) {  // d.valueOf() could also work
      // date is not valid
      delete document.birthDate;
    }
    else {
      // date is valid
      document.birthDate = newDate;
    }
  }
  else {
    // not a date
    delete document.birthDate;
  }
  return document;
};

export const insertPatient = new ValidatedMethod({
  name: 'patients.insert',
  validate: new SimpleSchema({
    'name.$.text': { type: String },
    'identifier': { type: [ String ], optional: true },
    'gender': { type: String, optional: true },
    'active': { type: Boolean, optional: true },
    'birthDate': { type: String, optional: true },
    'photo.$.url': { type: String, optional: true }
  }).validator(),
  run(document) {

    console.log("insertPatient", document);

    document = convertBirthdateToValidDate(document);
    console.log("convertBirthdateToValidDate", document);

    if (process.env.NODE_ENV === "test") {
      document.test = true;
    } else {
      document.test = false;
    }

    // now that's all done, we can insert the document
    return Patients.insert(document);
  }
});

export const updatePatient = new ValidatedMethod({
  name: 'patients.update',
  validate: new SimpleSchema({
    _id: { type: String },
    'update': { type: Object, blackbox: true, optional: true}
  }).validator(),
  run({ _id, update }) {
    console.log("updatePatient");
    console.log("_id", _id);
    console.log("update", update);

    update = convertBirthdateToValidDate(update);

    let patient = Patients.findOne({_id: _id});

    delete patient._id;
    delete patient._document;
    delete patient._super_;
    delete patient._collection;

    console.log("update.name", update.name);
    update.name[0].resourceType = 'HumanName';



    patient.name = [];
    patient.name.push(update.name[0]);
    patient.gender = update.gender;
    patient.photo = [];

    if (update.birthDate) {
      patient.birthDate = update.birthDate;
    }
    if (update && update.photo && update.photo[0] && update.photo[0].url) {
      patient.photo.push({
        url: update.photo[0].url
      });
    }

    console.log("diffedPatient", patient);
    return Patients.update({_id: _id}, { $set: patient });
  }
});

export const removePatientById = new ValidatedMethod({
  name: 'patients.removeById',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  run({ _id }) {
    console.log("Removing user " + _id);
    return Patients.remove({_id: _id});
  }
});
