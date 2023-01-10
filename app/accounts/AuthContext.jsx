import React, { useEffect, useState } from 'react';
import { User } from '@accounts/types';
import { accountsClient } from './Accounts';

import { Session } from 'meteor/session';
import { get, has, cloneDeep } from 'lodash';

import { useTracker } from 'meteor/react-meteor-data';

import { AccountsJsError } from '@accounts/server';
import { CreateUserErrors } from '@accounts/password';

const currentUserDep = new Tracker.Dependency();

if(Meteor.isClient){
  Session.setDefault('currentUser', false);

  Meteor.currentUser = function(){
    return Session.get('currentUser');
  }
  Meteor.currentUserId = function(){
    let currentUser = Session.get('currentUser');
    return get(currentUser, '_id');
  }
  Meteor.currentPatient = function(){
    return Session.get('currentPatient');
  }
  Meteor.currentPatientId = function(){
    return Session.get('currentPatientId');
  }
  Meteor.currentPractitioner = function(){
    return Session.get('currentPractitioner');
  }
  Meteor.currentPractitionerId = function(){
    return Session.get('currentPractitionerId');
  }
  Meteor.currentUserReference = function(){
    let user = Session.get('currentUser');

    return {
      display: get(user, 'fullLegalName', ''),
      reference: "Patient/" + get(user, 'patientId')
    }
  }
  Meteor.logoutCurrentUser = function(){
    Session.set('currentUser', null);
    Session.set('selectedPatient', null);
    Session.set('selectedPatientId', null);
    Meteor.logout();
  }
}

async function fetchUser(setAuthContextState){
  console.log('AuthContext.fetchUser', setAuthContextState)

  const accountsUser = await accountsClient.getUser();
  console.log('AuthContext.accountsUser', accountsUser)

  if(Meteor.isClient){
    Session.set('currentUser', Object.assign({}, accountsUser));
    currentUserDep.changed();
  }

  if(typeof setAuthContextState === "function"){
    setAuthContextState({ 
      loading: false, 
      user: Object.assign({}, accountsUser) 
    });
  }
};

async function loginWithService(service, credentials, setError, setSuccess){
  console.log('AuthContext.loginWithService()', service, credentials);

  let loginResponse;

  try {
    loginResponse = await accountsClient.loginWithService(service, credentials);
    console.log('AuthContext.loginResponse', loginResponse)

    if(typeof setSuccess === "function"){
      setSuccess(loginResponse);
    }
  } catch (error) {
    console.log('AuthContext.loginWithService.error.message', error.message) 
    console.log('AuthContext.loginWithService.error.code', error.code) 

    if(typeof setError === "function"){
      if(error.message === "Cannot read properties of undefined (reading 'accessToken')"){
        setError("Invalid Credentials.  That username and password combination was not successful.")

      } else {
        setError(error.message)
      }
    }

    if (error instanceof AccountsJsError) {
      console.log('error.message', error.message)

      // You can access the error message via `error.message`
      // Eg: "Email already exists"
      // You can access the code via `error.code`
      // Eg:

      // setAuthContextState({ 
      //   errorMessage: error.message
      // });

      if (error.code === CreateUserErrors.EmailAlreadyExists) {
        // do some custom logic
      }
    } else {
      console.log(error.message)
      // Else means it's an internal server error so you probably want to obfuscate it and return
      // a generic "Internal server error" to the user.
    }
  }

  if(Meteor.isClient && loginResponse){
    console.log('loginResponse', loginResponse);
    Session.set('currentUser', get(loginResponse, 'user'));
    Session.set('selectedPatientId', get(loginResponse, 'user.patientId'));

    if(Patients.find().count() > 0){
      let matchedPatient;
      if(get(loginResponse, 'user.patientId')){
        matchedPatient = Patients.findOne({id: get(loginResponse, 'user.patientId')});
      } else if(has(loginResponse, 'user.id')){
        matchedPatient = Patients.findOne({id: get(loginResponse, 'user.id')});
      }   
      if(matchedPatient){
        Session.set('selectedPatient', matchedPatient);
      }  
    }
    
    currentUserDep.changed();
  }

  // if(typeof setAuthContextState === "function"){
  //   setAuthContextState({ 
  //     loading: false, 
  //     user: Object.assign({}, accountsUser) 
  //   });
  // }

  // let fetchUserResponse = await fetchUser();
  // console.log('fetchUserResponse', fetchUserResponse)  
};

async function logout(){
  console.log('AuthContext.logout()')
  await accountsClient.logout();
  // setState({ loading: false, user: undefined });

  if(Meteor.isClient){
    Session.set('currentUser', false);
    //Session.set('lastUpdated', new Date())

    currentUserDep.changed();
  }
};

// 
const AuthContext = React.createContext({
  fetchUser: fetchUser,
  loginWithService: loginWithService,
  logout: logout
});

const AuthProvider = function({ children }){
  const [state, setState] = useState({ 
    loading: true,
    user: null,
    errorMessage: ''
  });

  useEffect(() => {
    console.log('AuthContext.useEffect()')
    fetchUser(setState);
  }, []);

  // this is hacky
  setState(useTracker(function(){
    return Session.get('currentUser')
  }, []));

  // If we need to refresh the tokens, it will show a fullscreen loader
  if (state.loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user: state.user, fetchUser, loginWithService, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = function(){
  return React.useContext(AuthContext);
} 


export { AuthProvider, useAuth };