import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { FhirUtilities } from 'fhir-starter';

import mongoose from 'mongoose';

import { MongoClient } from 'mongodb';
import { AccountsServer, ServerHooks, AccountsJsError } from '@accounts/server';
import { AccountsPassword, CreateUserErrors } from '@accounts/password';

import accountsExpress, { userLoader } from '@accounts/rest-express';
import { Mongo, MongoDBInterface } from '@accounts/mongo';

import { get, set, has, pick } from 'lodash';
import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Patients, Practitioners } from 'meteor/clinical:hl7-fhir-data-infrastructure';
import { HipaaLogger } from 'meteor/clinical:hipaa-logger';
import moment from 'moment';



console.log('Initializing AccountsServer.')
console.log('MONGO_URL: ' + process.env.MONGO_URL);

Meteor.startup(async function(){
  // If you are using mongodb 3.x
  // const client = await mongodb.MongoClient.connect(process.env.MONGO_URL);
  // const db = client.db('meteor');

  // mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/meteor', {
  mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  const db = mongoose.connection;
  const accountsMongo = new Mongo(db, {
    // options
  });

  // const app = express();

  // app.use(bodyParser.json());
  // app.use(bodyParser.urlencoded({ extended: true }));
  // app.use(cors());

  // interface UserDoc extends mongoose.Document {
  //   givenName: string;
  //   familyName: string;
  // }

  const User = mongoose.model(
    'User',
    new mongoose.Schema({ 
      givenName: String, 
      familyName: String,
      patientId: String,
      id: String,
      nickname: String,
      isClinician: Boolean,
      patient: Object
    })
  );

  const accountsPassword = new AccountsPassword({
    // This option is called when a new user create an account
    // Inside we can apply our logic to validate the user fields
    validateNewUser: function(user){
      console.log("AccountsServer: Validating new user.")

      if(get(Meteor, 'settings.public.defaults.registration.displayFullLegalName')){
        if (!user.fullLegalName) {
          throw new Error('Full legal name is required.');
        }
        if (user.fullLegalName.length < 3) {
          throw new Error('Full legal name too short');
        }        
      }
      if(get(Meteor, 'settings.public.defaults.registration.displayNickname')){
        if (!user.nickname) {
          throw new Error('Nickname name is required');
        }
        if (user.nickname.length < 3) {
          throw new Error('Nickname name too short');
        }        
      }
      if(get(Meteor, 'settings.public.defaults.registration.displayGivenAndFamily')){
        if (!user.givenName) {
          throw new Error('Given name is required');
        }
        if (user.givenName.length < 3) {
          throw new Error('Given name too short');
        }
        // if (!user.familyName) {
        //   throw new Error('First name is required');
        // }
        // if (user.familyName.length < 3) {
        //   throw new Error('First name too short');
        // }     
      }
      if(get(Meteor, 'settings.public.defaults.registration.displayFirstAndLast')){
        if (!user.firstName) {
          throw new Error('First name is required');
        }
        if (user.firstName.length < 3) {
          throw new Error('First name too short');
        }
        if (!user.lastName) {
          throw new Error('Last name is required');
        }
        if (user.lastName.length < 3) {
          throw new Error('Last name too short');
        }     
      }
      if(get(Meteor, 'settings.public.defaults.registration.displayEmail')){
        // For example we can allow only some kind of emails
        if (user.email.endsWith('.xyz')) {
          console.error('Invalid email.');
          throw new Error('Invalid email.');
        }
      }
      if(get(Meteor, 'settings.public.defaults.registration.displayUsername')){
        // For example we can allow only some kind of emails
        if (!user.username) {
          throw new Error('Username is required');
        }
        if (user.username.length < 3) {
          throw new Error('Username too short');
        }  
      }
      if(get(Meteor, 'settings.public.defaults.registration.displayPassword')){
        // For example we can allow only some kind of emails
        if (!user.password) {
          throw new Error('Password is required');
        }
        if (user.password.length < 3) {
          throw new Error('Password too short');
        }  
      }
      if(get(Meteor, 'settings.private.invitationCode')){
        if (!user.invitationCode) {
          console.error('Must provide an invitation code');
          throw new Error('Must provide an invitation code');
        }  

        if (user.invitationCode === get(Meteor, 'settings.private.invitationCode')) {
          console.info('Invitation code matches.  Creating user.');
          return pick(user, ['username', 'email', 'password', 'familyName', 'givenName', 'fullLegalName', 'nickname', 'patientId', 'fhirUser', 'id']);
        } else if (user.invitationCode === get(Meteor, 'settings.private.clinicianInvitationCode')) {
          console.info('Clinician invitation code matches.  Creating clinician.');
          user.isClinician = true;
          console.log('Validated user parameters: ', user);      
          return pick(user, ['username', 'email', 'password', 'familyName', 'givenName', 'fullLegalName', 'nickname', 'patientId', 'fhirUser', 'id', 'isClinician']);
        } else {
          console.error('Invalid invitation code.');
          throw new Error('Invalid invitation code.');
        }
      }

      return user;
    }
  });

  console.log("AccountsServer.accountsPassword", accountsPassword)

  const accountsServer = new AccountsServer(
    {
      db: accountsMongo,
      tokenSecret: Random.secret(),
    },
    {
      password: accountsPassword
    }
  );

  accountsServer.on(ServerHooks.ValidateLogin, function(userLoginRequest){
    // This hook is called every time a user try to login.
    // You can use it to only allow users with verified email to login.
    // If you throw an error here it will be returned to the client.
    console.log('AccountsServer: ServerHooks.ValidateLogin()')
    console.log('AccountsServer: ValidateLogin.userLoginRequest', userLoginRequest)

    return userLoginRequest;
  });


  Meteor.methods({
    deactivateAccount: async function(currentUser, selectedPatientId, selectedPatient){
      check(currentUser, Object);
      check(selectedPatientId, String);
      check(selectedPatient, Object);

      if(currentUser){
        console.log('Deactivating user', currentUser);

        if(Package["clinical:hipaa-logger"]){
          let newAuditEvent = { 
            "resourceType" : "AuditEvent",
            "type" : { 
              'code': 'DeactivateUser',
              'display': 'Deactivate User'
              }, 
            "action" : 'Deactivation',
            "recorded" : new Date(), 
            "outcome" : "Success",
            "outcomeDesc" : 'Deactivating user and deleting all protected health information (PHI).',
            "agent" : [{ 
              "name" : FhirUtilities.pluckName(selectedPatient),
              "who": {
                "display": FhirUtilities.pluckName(selectedPatient),
                "reference": "Patient/" + selectedPatientId
              },
              "requestor" : false
            }],
            "source" : { 
              "site" : Meteor.absoluteUrl(),
              "identifier": {
                "value": Meteor.absoluteUrl()
              }
            },
            "entity": [{
              "reference": {
                "reference": ''
              }
            }]
          };

          console.log('Logging a hipaa event...', newAuditEvent);
          let hipaaEventId = HipaaLogger.logAuditEvent(newAuditEvent);            
        }
        

        Patients.remove({_id: selectedPatientId});

        let myCarePlans = CarePlans.find(FhirUtilities.addPatientFilterToQuery(selectedPatientId)).fetch();
        if(Array.isArray(myCarePlans)){
          myCarePlans.forEach(function(carePlan){
            CarePlans.remove({_id: carePlan._id});
          })
        }
 
        let myCareTeams = CareTeams.find(FhirUtilities.addPatientFilterToQuery(selectedPatientId)).fetch();
        if(Array.isArray(myCareTeams)){
          myCareTeams.forEach(function(careTeam){
            CareTeams.remove({_id: careTeam._id});
          })
        }

        await accountsServer.deactivateUser(get(currentUser, 'id'));

          
      }
    }
  });


  // /**
  //  * Load and expose the accounts-js middleware
  //  */
  // app.use(accountsExpress(accountsServer));

  JsonRoutes.Middleware.use(function (req, res, next) {

    // needed for preflight response
    // res.setHeader('Access-Control-Allow-Origin', Meteor.absoluteUrl());
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Header", "*");
    

    // console.log('JsonRoutes.Middleware using accountsExpress()')
    accountsExpress(accountsServer)
    next();
  });

  // /**
  //  * Return the current logged in user
  //  */
  // app.get('/user', userLoader(accountsServer), function(req, res){
  //   console.log('AccountsServer: GET /user', req);

  //   res.json({ user: get(req, 'user', null) });
  // });

  JsonRoutes.add('get', '/user', function (req, res, next) {
    console.log('AccountsServer: GET /user', req, res);

    res.setHeader("Access-Control-Allow-Origin", "*");
    
    
    next();
  });


  

  // app.post('/accounts/password/register', userLoader(accountsServer), async function (req, res){
  //   let body = get(req, 'body');
  //   console.log('body', 'body')
  //   res.json(true);
  // });

  // JsonRoutes.add('get', '/accounts/password/register', function (req, res, next) {
  //   console.log('AccountsServer: GET /accounts/password/register', req, res);

  //   // userLoader(accountsServer);
  //   // JsonRoutes.sendResult(res, {
  //   //   data: true
  //   // });
  //   next();
  // });

  JsonRoutes.add('post', '/accounts/*', function (req, res, next) {
    console.log('AccountsServer: POST /accounts/*', req, res);

    res.setHeader("Access-Control-Allow-Origin", "*");

    next();
  });
  JsonRoutes.add('post', '/accounts/password', function (req, res, next) {
    console.log('AccountsServer: POST /accounts/password', req, res);

    res.setHeader("Access-Control-Allow-Origin", "*");

    next();
  });
  JsonRoutes.add('post', '/accounts/password/authenticate', async function (req, res, next) {
    console.log('AccountsServer: POST /accounts/password/authenticate', req.body);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Header", "*");

    const loggedInUser = await accountsServer.loginWithService('password', req.body, req.infos);
    console.log('loggedInUser', loggedInUser);
    
    JsonRoutes.sendResult(res, {
      data: loggedInUser
    });
  });



  JsonRoutes.add('post', '/accounts/logout', async function (req, res, next) {
    console.log('AccountsServer: POST /accounts/logout');

    res.setHeader("Access-Control-Allow-Origin", "*");

    let accessToken = req.headers?.Authorization || req.headers?.authorization || req.body?.accessToken || undefined;
    accessToken = accessToken && accessToken.replace('Bearer ', '');
    console.log('accessToken', accessToken)

    const logoutResult = await accountsServer.logout( accessToken );
    console.log('logoutResult', logoutResult)
    
    JsonRoutes.sendResult(res, {
      data: {
        message: 'User logged out.'
      }
    });
  });

  // /**
  //  * Expose a public route to edit user informations
  //  * - route is protected
  //  * - update the current logged in user in the db
  //  */
  // app.put('/user', userLoader(accountsServer), async function (req, res){
  //   console.log('AccountsServer: PUT /user', req);

  //   const userId = get(req, 'userId', null);

  //   if (!userId) {
  //     res.status(401);
  //     res.json({ message: 'Unauthorized' });
  //     return;
  //   }

  //   const user = await User.findById(userId).exec();

  //   user.givenName = req.body.givenName;
  //   user.familyName = req.body.familyName;

  //   await user.save();
  //   res.json(true);
  // });

  JsonRoutes.add('post', '/accounts/user', async function (req, res, next) {
    console.log('AccountsServer: POST /accounts/user', req.body);

    res.setHeader("Access-Control-Allow-Origin", "*");

    let userLoaded = userLoader(accountsServer);
    console.log('userLoaded', userLoaded);

    const userId = get(req, 'userId', null);
    console.log('userId', userId);

    if (!userId) {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          message: 'Unauthorized'
        }
      });
    } else {

      let user = "";

      // is this an update????
      //   const user = await User.findById(userId).exec();

      //   user.givenName = req.body.givenName;
      //   user.familyName = req.body.familyName;

      //   await user.save();
      //   res.json(true);

      
      JsonRoutes.sendResult(res, {
        data: user
      });
    }
  });


  // app.post('/accounts/password/register', userLoader(accountsServer), async function (req, res){
  //   let body = get(req, 'body', false);

  //   if(body){
  //     console.log('AccountsServer: POST /user/password/register', body);

  //     // const userId = get(req, 'userId', null);

  //     // if (!userId) {
  //     //   res.status(401);
  //     //   res.json({ message: 'Unauthorized' });
  //     //   return;
  //     // }

  //     // const user = await User.findById(userId).exec();

  //     // user.givenName = req.body.givenName;
  //     // user.familyName = req.body.familyName;

  //     // await user.save();

  //   } else {
  //     console.log('AccountsServer: POST received, but no body in message.');
  //   }

  //   res.json(true);
  // });

  JsonRoutes.add('post', '/accounts/password/register', async function (req, res, next) {
    console.log('AccountsServer: POST /accounts/password/register', req.body);

    res.setHeader("Access-Control-Allow-Origin", "*");

    const user = get(req, "body.user");

    const accountsPasswordService = get(accountsServer.getServices(), "password");    

    let userId = "";
    let dataPayload = {};

    // Use Case 1: if the user had fetched PHI from Cerner/Epic,
    // there should be a patientId available 
    // which we grab from the URL parameters
    // and feed into the registration form
    // and we will then use as the user id, if possible

    if(!get(user, 'patientId')){
      user.patientId = Random.id();
    }

    console.log('Registering a new user.', user);

    try {
      userId = await accountsPasswordService.createUser(user);
      console.log('AccountsServer.register.createUser.userId', userId)

      if(has(accountsServer, "options.enableAutologin")) {

        if(!accountsServer.options.ambiguousErrorMessages){
          dataPayload = {
            userId: newUserId
          }
        } 

        JsonRoutes.sendResult(res, {
          code: 401,
          data: dataPayload
        });
      }

      // When initializing AccountsServer we check that enableAutologin and ambiguousErrorMessages options
      // are not enabled at the same time
      const createdUser = await accountsServer.findUserById(userId);
      console.log('AccountsServer.createdUser', createdUser)

      console.log('Great time to create a Patient record.');

      console.log('typeof createdUser._id', typeof createdUser._id)
      console.log('typeof createdUser.id', typeof createdUser.id)

      //------------------------------------------------------//------------------------------------------------------------------------------
      // creating the new patient record
      let newPatient = {
        _id: '',  
        id: '',
        resourceType: "Patient",
        active: true,
        name: [{
          use: 'usual',
          text: get(createdUser, 'fullLegalName', ''),
          given: [],
          family: ''
        }],
        photo: [{
          url: 'http://localhost:3000/noAvatar.png'
        }]
      }

      // if we were able to fetch the entire Patient resource from Epic/Cerner
      // and have it available in the registration payload
      // we can assign it as the patient resource
      Object.assign(newPatient, get(user, 'patient'));


      let humanNameArray = get(newPatient, 'name');
      if(Array.isArray(humanNameArray)){
        newPatient.name = [];
        humanNameArray.forEach(function(humanName){
          if(typeof humanName.family === "string"){
            newPatient.name.push(humanName);
          }
        })

      }

      // if(typeof newPatient.name[0].family === "array"){
      //   newPatient.name[0].family = newPatient.name[0].family[0];
      // }

      if(has(createdUser, 'fullLegalName') && !has(newPatient, 'name[0].text')){
        let nameArray = createdUser.fullLegalName.split(" ");
        if(Array.isArray(nameArray)){
          nameArray.forEach(function(name){
            if(!has(newPatient, 'name[0].given')){
              set(newPatient, 'name[0].given', []);
            }
            newPatient.name[0].given.push(name);
          })
          newPatient.name[0].text = get(createdUser, 'fullLegalName', '').trim()
          newPatient.name[0].family = (nameArray[0]).trim();
        }
      }

      if(has(createdUser, 'emails[0].address')){
        if(!has(newPatient, 'telecom')){
          newPatient.telecom = [];
        }
        newPatient.telecom[0] = {
          system: 'email',
          value: get(createdUser, 'emails[0].address')
        }
      }

      // try to align collection _ids, if possible
      if(has(createdUser, '_id')){
        newPatient._id = createdUser._id._str;
      }
      
      console.log('AccountsServer.newPatient', newPatient)


      //------------------------------------------------------------------------------------------------------------------------------------

      // if the patientId from Epic/Cerner is available
      // we are going to make sure that there is a corresponding Patient resource
      // in our system
      if(get(createdUser, 'patientId')){
        if(!Patients.findOne({id: get(createdUser, 'patientId')})){

          newPatient.id = createdUser.patientId;

          let patientInternalId = Patients.insert(newPatient)
          console.log('AccountsServer.newPatientId', patientInternalId)

          if(Package["clinical:hipaa-logger"]){
            let newAuditEvent = { 
              "resourceType" : "AuditEvent",
              "type" : { 
                'code': 'Register User',
                'display': 'Register User'
                }, 
              "action" : 'Registration',
              "recorded" : new Date(), 
              "outcome" : "Success",
              "outcomeDesc" : 'User registered.',
              "agent" : [{ 
                "name" : FhirUtilities.pluckName(newPatient),
                "who": {
                  "display": FhirUtilities.pluckName(newPatient),
                  "reference": "Patient/" + get(newPatient, 'id')
                },
                "requestor" : false
              }],
              "source" : { 
                "site" : Meteor.absoluteUrl(),
                "identifier": {
                  "value": Meteor.absoluteUrl(),

                }
              },
              "entity": [{
                "reference": {
                  "reference": ''
                }
              }]
            };

            console.log('Logging a hipaa event...', newAuditEvent)
            let hipaaEventId = HipaaLogger.logAuditEvent(newAuditEvent)            
          }  
        }
      } else {

        // Use Case 2 - if the user signs up without having logged into Epic/Cerner
        // then they probably don't have a patientId available
        // so we need to attach it to the user account

        // if(!get(createdUser, 'patientId')){
        //   Users.update({id: get(createdUser, 'id')}, {$set: {patientId: patientInternalId}})
        // }
      }




      if(get(createdUser, 'isClinician')){
        if(!Practitioners.findOne({id: get(createdUser, 'id')})){
          let newPractitioner = {
            _id: '',  
            id: get(createdUser, 'id', ''),
            resourceType: "Practitioner",
            active: true,
            name: [{
              use: 'usual',
              text: get(createdUser, 'fullLegalName', ''),
              given: [],
              family: ''
            }],
            photo: [{
              url: 'http://localhost:3000/noAvatar.png'
            }]
          }
  
          if(has(createdUser, '_id')){
            newPractitioner._id = get(createdUser, '_id._str');
          }
          if(has(createdUser, 'id')){
            newPractitioner.id = get(createdUser, 'id');
          }
  
          let humanNameArray = get(newPractitioner, 'name');
          if(Array.isArray(humanNameArray)){
            newPractitioner.name = [];
            humanNameArray.forEach(function(humanName){
              if(typeof humanName.family === "string"){
                newPractitioner.name.push(humanName);
              }
            })
  
          }
  
          // if(typeof newPractitioner.name[0].family === "array"){
          //   newPractitioner.name[0].family = newPractitioner.name[0].family[0];
          // }
  
          if(has(createdUser, 'fullLegalName') && !has(newPractitioner, 'name[0].text')){
            let nameArray = createdUser.fullLegalName.split(" ");
            if(Array.isArray(nameArray)){
              nameArray.forEach(function(name){
                if(!has(newPractitioner, 'name[0].given')){
                  set(newPractitioner, 'name[0].given', []);
                }
                newPractitioner.name[0].given.push(name);
              })
              newPractitioner.name[0].text = get(createdUser, 'fullLegalName', '').trim()
              newPractitioner.name[0].family = (nameArray[0]).trim();
            }
          }
  
          if(has(createdUser, 'emails[0].address')){
            if(!has(newPractitioner, 'telecom')){
              newPractitioner.telecom = [];
            }
            newPractitioner.telecom[0] = {
              system: 'email',
              value: get(createdUser, 'emails[0].address')
            }
          }
  
          console.log('AccountsServer.newPractitioner', newPractitioner)
  
          let practitionerAlreadyExists = Practitioners.findOne({id: newPractitioner.id})
          console.log('AccountsServer.findOne(newPractitioner)', newPractitioner)
  
          if(!practitionerAlreadyExists){
            let patientInternalId = Practitioners.insert(newPractitioner)
            console.log('AccountsServer.newPractitionerId', patientInternalId);

            if(Package["clinical:hipaa-logger"]){
              let newAuditEvent = { 
                "resourceType" : "AuditEvent",
                "type" : { 
                  'code': 'Register User',
                  'display': 'Register User'
                  }, 
                "action" : 'Registration',
                "recorded" : new Date(), 
                "outcome" : "Success",
                "outcomeDesc" : 'User registered.',
                "agent" : [{ 
                  "name" : FhirUtilities.pluckName(newPractitioner),
                  "who": {
                    "display": FhirUtilities.pluckName(newPractitioner),
                    "reference": "Practitioner/" + get(newPractitioner, 'id')
                  },
                  "requestor" : false
                }],
                "source" : { 
                  "site" : Meteor.absoluteUrl(),
                  "identifier": {
                    "value": Meteor.absoluteUrl(),
  
                  }
                },
                "entity": [{
                  "reference": {
                    "reference": ''
                  }
                }]
              };
  
              console.log('Logging a hipaa event...', newAuditEvent)
              let hipaaEventId = HipaaLogger.logAuditEvent(newAuditEvent)            
            }
          }
        }
      }


      console.log('Checking if they provided a physician credential or invite code, and whether we should create a Practitioner object.');

      // If we are here - user must be created successfully
      // Explicitly saying this to Typescript compiler
      const loginResult = await accountsServer.loginWithUser(createdUser, req.infos);
      console.log('AccountsServer.loginResult', loginResult)

      dataPayload = {
        userId: userId,
        loginResult: loginResult
      }
      console.log('dataPayload', dataPayload)

      JsonRoutes.sendResult(res, {
        code: 200,
        data: dataPayload
      });
    } catch (error) {
      console.log('error', error)

      // // // If ambiguousErrorMessages is true we obfuscate the email or username already exist error
      // // // to prevent user enumeration during user creation
      // if (
      //   accountsServer.options.ambiguousErrorMessages &&
      //   error instanceof AccountsJsError &&
      //   (error.code === CreateUserErrors.EmailAlreadyExists ||
      //     error.code === CreateUserErrors.UsernameAlreadyExists)
      // ) 
      
      


      // if(!accountsServer.options.ambiguousErrorMessages){
      //   dataPayload = {
      //     errorMessage: error
      //   }
      // } 
      dataPayload = {
        errorMessage: error
      }

      JsonRoutes.sendResult(res, {
        code: 500,
        data: error
      });

      throw error;
    }
  });
})


