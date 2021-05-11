import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';


import mongoose from 'mongoose';

import { MongoClient } from 'mongodb';
import { AccountsServer, ServerHooks, AccountsJsError } from '@accounts/server';
import { AccountsPassword, CreateUserErrors } from '@accounts/password';

import accountsExpress, { userLoader } from '@accounts/rest-express';
import { Mongo, MongoDBInterface } from '@accounts/mongo';

import { get, has, pick } from 'lodash';
import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';

import { FhirUtilities, Patients, Practitioners } from 'meteor/clinical:hl7-fhir-data-infrastructure';
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
      familyName: String 
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


      if(get(Meteor, 'settings.private.invitationCode')){
        if (!user.invitationCode) {
          console.error('Must provide an invitation code');
          throw new Error('Must provide an invitation code');
        }  

        if (user.invitationCode !== get(Meteor, 'settings.private.invitationCode')) {
          console.error('Invalid invitation code.');
          throw new Error('Invalid invitation code.');
        }  
      }
      
      console.log('New User: ', user);      
      return pick(user, ['username', 'email', 'password', 'familyName', 'givenName', 'fullLegalName', 'nickname']);
    }
  });

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



  // /**
  //  * Load and expose the accounts-js middleware
  //  */
  // app.use(accountsExpress(accountsServer));

  JsonRoutes.Middleware.use(function (req, res, next) {

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
    console.log('user', user);

    const accountsPassword = get(accountsServer.getServices(), "password");
    // console.log('accountsPassword', accountsPassword)

    let userId = "";
    let dataPayload = {};

    try {
      userId = await accountsPassword.createUser(user);
      console.log('userId', userId)
    } catch (error) {
      console.log('error', error)

      // // If ambiguousErrorMessages is true we obfuscate the email or username already exist error
      // // to prevent user enumeration during user creation
      // if (
      //   accountsServer.options.ambiguousErrorMessages &&
      //   error instanceof AccountsJsError &&
      //   (error.code === CreateUserErrors.EmailAlreadyExists ||
      //     error.code === CreateUserErrors.UsernameAlreadyExists)
      // ) {
      //   return res.json({} as CreateUserResult);
      // }

      if(!accountsServer.options.ambiguousErrorMessages){
        dataPayload = {}
      } 

      JsonRoutes.sendResult(res, {
        code: 500,
        data: dataPayload
      });

      throw error;
    }

    if (has(accountsServer, "options.enableAutologin")) {

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
    console.log('createdUser', createdUser)

    console.log('Great time to create a Patient record.');

    console.log('typeof createdUser._id', typeof createdUser._id)
    console.log('typeof createdUser.id', typeof createdUser.id)

    if(!Patients.findOne({id: get(createdUser, 'id')})){
      let newPatient = {
        _id: '',  
        id: '',
        resourceType: "Patient",
        active: true,
        name: [{
          use: 'usual',
          text: '',
          given: [],
          family: ''
        }]
      }

      if(has(createdUser, '_id')){
        newPatient._id = createdUser._id._str;
      }
      if(has(createdUser, 'id')){
        newPatient.id = createdUser.id;
      }

      if(has(createdUser, 'fullLegalName')){
        let nameArray = createdUser.fullLegalName.split(" ");
        if(Array.isArray(nameArray)){
          nameArray.forEach(function(name){
            newPatient.name[0].given.push(name);
          })
          newPatient.name[0].text = get(createdUser, 'fullLegalName', '')
          newPatient.name[0].family = nameArray[nameArray.length - 1];
        }
      }

      Patients.insert(newPatient)
    }


    console.log('Checking if they provided a physician credential or invite code, and whether we should create a Practitioner object.');

    // If we are here - user must be created successfully
    // Explicitly saying this to Typescript compiler
    const loginResult = await accountsServer.loginWithUser(createdUser, req.infos);
    console.log('loginResult', loginResult)

    dataPayload = {
      userId: userId,
      loginResult: loginResult
    }
    console.log('dataPayload', dataPayload)

    JsonRoutes.sendResult(res, {
      code: 200,
      data: dataPayload
    });
  });
})


