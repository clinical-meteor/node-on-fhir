// https://www.accountsjs.com/docs/strategies/password/  
// https://www.accountsjs.com/docs/strategies/password-client/  
// https://www.accountsjs.com/docs/handling-errors/  
// https://www.accountsjs.com/docs/strategies/password/  
// https://github.com/accounts-js/accounts/blob/master/packages/rest-express/src/express-middleware.ts  
// https://github.com/accounts-js/accounts/blob/master/packages/rest-express/src/endpoints/password/register.ts  


import React, { useState } from 'react';
import { RouteComponentProps, Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Typography,
  makeStyles,
  CardContent,
  Card,
  Divider,
  Link,
  Grid,
  TextField,
  Snackbar,
} from '@material-ui/core';

import { useFormik, FormikErrors } from 'formik';
import { accountsPassword } from './Accounts';
import { SnackBarContentError } from './SnackBarContentError';
import { UnauthenticatedContainer } from './UnauthenticatedContainer';
import { useAuth } from './AuthContext';
import { AccountsJsError } from '@accounts/server';
import { CreateUserErrors } from '@accounts/password';

import { get, has } from 'lodash';

const useStyles = makeStyles(theme => ({
  cardContent: {
    padding: theme.spacing(3)
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  logo: {
    maxWidth: '100%',
    width: 250
  }
}));

const LogInLink = React.forwardRef(function(props, ref){
  return <RouterLink to="/login" {...props} ref={ref} />;
});

// interface SignupValues {
//   givenName: string;
//   familyName: string;
//   email: string;
//   password: string;
// }

const Signup = function({ history }){
  const classes = useStyles();

  const [error, setError] = useState(null);
  const { loginWithService } = useAuth();

  let selectedPatient;
  let selectedPatientCatch = useState(function(){
    return Session.get('selectedPatient');
  }, [])


  if(Array.isArray(selectedPatientCatch)){
    selectedPatientCatch.forEach(function(internal){
      if(internal.resourceType === "Patient"){
        selectedPatient = internal;
      }
    })
  } else if(selectedPatientCatch.resourceType === "Patient"){
    selectedPatient = selectedPatientCatch;
  }

  let patient = Session.get('selectedPatient');
    

  let familyName = "";
  let givenName = "";
  let fullLegalName = "";

  if(has(selectedPatient, 'name[0].given[0]')){
    fullLegalName = get(selectedPatient, 'name[0].given[0]');
  }

  // suppport DSTU2 and R4
  if(has(selectedPatient, 'name[0].family[0]')){
    familyName = get(selectedPatient, 'name[0].family[0]', '');
  } else {
    familyName = get(selectedPatient, 'name[0].family', '');
  }

  // prefer a provided fullname instead of assembling it ourselves
  if(has(selectedPatient, 'name[0].text')){
    fullLegalName = get(selectedPatient, 'name[0].text')
  } else {
    fullLegalName = fullLegalName + " " + familyName
  }
  

  const formik = useFormik({
    initialValues: {
      givenName: get(selectedPatient, 'name[0].given[0]', ''),
      familyName: familyName,
      firstName: get(selectedPatient, 'name[0].given[0]', ''),
      lastName: familyName,
      fullLegalName: fullLegalName,
      nickname: '',
      username: '',
      email: '',
      password: '',
      invitationCode: '',
      patientId: get(selectedPatient, 'id')
    },
    validate: values => {
      const errors = {};

      if(get(Meteor, 'settings.public.defaults.registration.displayFullLegalName')){
        if (!values.fullLegalName) {
          errors.fullLegalName = 'Required';
        }  
      }
      if(get(Meteor, 'settings.public.defaults.registration.displayNickname')){
        if (!values.nickname) {
          errors.nickname = 'Required';
        }  
      }
      if(get(Meteor, 'settings.public.defaults.registration.displayGivenAndFamily')){
        if (!values.givenName) {
          errors.givenName = 'Required';
        }
        if (!values.familyName) {
          errors.familyName = 'Required';
        }
      }
      if(get(Meteor, 'settings.public.defaults.registration.displayFirstAndLast')){
        if (!values.firstName) {
          errors.firstName = 'Required';
        }
        if (!values.lastName) {
          errors.lastName = 'Required';
        }
      }
      if(get(Meteor, 'settings.public.defaults.registration.displayEmail')){
        if (!values.email) {
          errors.email = 'Required';
        }
      }
      if(get(Meteor, 'settings.public.defaults.registration.displayPassword')){
        if (!values.password) {
          errors.password = 'Required';
        }
      }
      if(get(Meteor, 'settings.public.defaults.registration.displayUsername')){
        if (!values.username) {
          errors.username = 'Required';
        }
      }
      if(get(Meteor, 'settings.public.defaults.registration.displayFullLegalName')){
        if (!values.invitationCode) {
          errors.invitationCode = 'Required';
        }  
      }

      return errors;
    },
    onSubmit: async function(values, { setSubmitting }){
      console.log('Submitting sign-up details and creating a new user.')
      try {
        await accountsPassword.createUser({
          givenName: values.givenName,
          familyName: values.familyName,
          firstName: values.firstName,
          lastName: values.lastName,
          fullLegalName: values.fullLegalName,
          nickname: values.nickname,
          username: values.username,
          email: values.email,
          password: values.password,
          invitationCode: values.invitationCode,
          patientId: values.patientId
        });

        // console.log('userId', userId)

        // let user = await accountsClient.getUser();
        // console.log('SignUp.user', user)

        Session.set('mainAppDialogOpen', false)

        //history.push('/login');
      } catch (err) {
        // console.log('Caught an err', err)
        // console.log('Caught an err (typeof)', typeof err)
        // console.log('Caught an err.code', err.code)
        // console.log('Caught an err.message', err.message)
        // console.log('Caught an err.EmailAlreadyExists', err.EmailAlreadyExists)
        console.log('Caught an err.stringify', JSON.stringify(err))




        if (err.code === "EmailAlreadyExists") {
          console.log("Email already exists.")
          setError("Email already exists.");
        }
        setSubmitting(false);
      }

      console.log('Logging in with the same information.')
      await loginWithService('password', {
        user: {
          email: values.email
        },
        password: values.password
        // code: values.code
      });  
      console.log('loginResult', loginResult)
    }
  });

  function openLoginDialog(){
    Session.set('mainAppDialogTitle', 'Login');
    Session.set('mainAppDialogComponent', 'LoginDialog');    
    Session.set('mainAppDialogMaxWidth', "sm");
  }

  let patientIdElements;
  let fullLegalNameElements;
  let nicknameElements;
  let familyAndGivenElements = [];
  let firstAndLastElements = [];
  let invitationCodeElements;
  let emailElements;
  let passwordElements;
  let usernameElements;


  console.log('SignUp.selectedPatient', selectedPatient)

  // if(get(Meteor, 'settings.public.defaults.registration.displayPatientId')){
  //   if(has(selectedPatient, 'id')){
      patientIdElements = <Grid item xs={12}>
        <TextField
          label="Patient ID"
          variant="outlined"
          fullWidth={true}
          id="patientId"
          type="text"
          disabled
          value={get(selectedPatient, 'id')}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.patientId && formik.touched.patientId)}
          helperText={formik.touched.patientId && formik.errors.patientId}
        />
      </Grid>
  //   }    
  // } 

  if(get(Meteor, 'settings.public.defaults.registration.displayFullLegalName')){
    fullLegalNameElements = <Grid item xs={12}>
        <TextField
          label="Full Legal Name"
          variant="outlined"
          fullWidth={true}
          id="fullLegalName"
          type="text"
          value={formik.values.fullLegalName}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.fullLegalName && formik.touched.fullLegalName)}
          helperText={formik.touched.fullLegalName && formik.errors.fullLegalName}
        />
      </Grid>
  } 

  if(get(Meteor, 'settings.public.defaults.registration.displayNickname')){
    nicknameElements = <Grid item xs={12}>
        <TextField
          label="Nickname"
          variant="outlined"
          fullWidth={true}
          id="nickname"
          type="text"
          value={formik.values.nickname}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.nickname && formik.touched.nickname)}
          helperText={formik.touched.nickname && formik.errors.nickname}
        />
      </Grid>
  } 
  
  if(get(Meteor, 'settings.public.defaults.registration.displayGivenAndFamily')){
    familyAndGivenElementsElements.push(<Grid item xs={12} md={6}>
      <TextField
        label="Given Name"
        variant="outlined"
        fullWidth={true}
        id="givenName"
        value={formik.values.givenName}
        onChange={formik.handleChange}
        error={Boolean(formik.errors.givenName && formik.touched.givenName)}
        helperText={formik.touched.givenName && formik.errors.givenName}
      />
    </Grid>)

    familyAndGivenElementsElements.push(<Grid item xs={12} md={6}>
      <TextField
        label="Family Name"
        variant="outlined"
        fullWidth={true}
        id="familyName"
        value={formik.values.familyName}
        onChange={formik.handleChange}
        error={Boolean(formik.errors.familyName && formik.touched.familyName)}
        helperText={formik.touched.familyName && formik.errors.familyName}
      />
    </Grid>)
  }

  if(get(Meteor, 'settings.public.defaults.registration.displayFirstAndLast')){
    familyAndGivenElementsElements.push(<Grid item xs={12} md={6}>
      <TextField
        label="First Name"
        variant="outlined"
        fullWidth={true}
        id="firstName"
        value={formik.values.firstName}
        onChange={formik.handleChange}
        error={Boolean(formik.errors.firstName && formik.touched.firstName)}
        helperText={formik.touched.firstName && formik.errors.firstName}
      />
    </Grid>)

    familyAndGivenElementsElements.push(<Grid item xs={12} md={6}>
      <TextField
        label="Last Name"
        variant="outlined"
        fullWidth={true}
        id="lastName"
        value={formik.values.lastName}
        onChange={formik.handleChange}
        error={Boolean(formik.errors.lastName && formik.touched.lastName)}
        helperText={formik.touched.lastName && formik.errors.lastName}
      />
    </Grid>)
  }

  if(get(Meteor, 'settings.public.defaults.registration.displayEmail')){
    emailElements = <Grid item xs={12}>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth={true}
        id="email"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={Boolean(formik.errors.email && formik.touched.email)}
        helperText={formik.touched.email && formik.errors.email}
      />
    </Grid>
  }

  if(get(Meteor, 'settings.public.defaults.registration.displayPassword')){
    passwordElements = <Grid item xs={12}>
      <TextField
        label="Password"
        variant="outlined"
        fullWidth={true}
        type="password"
        id="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={Boolean(formik.errors.password && formik.touched.password)}
        helperText={formik.touched.password && formik.errors.password}
      />
    </Grid>
  }

  if(get(Meteor, 'settings.public.defaults.registration.displayUsername')){
    usernameElements = <Grid item xs={12}>
      <TextField
        label="Username"
        variant="outlined"
        fullWidth={true}
        id="username"
        value={formik.values.username}
        onChange={formik.handleChange}
        error={Boolean(formik.errors.username && formik.touched.username)}
        helperText={formik.touched.username && formik.errors.username}
      />
    </Grid>
  }

  if(get(Meteor, 'settings.public.defaults.registration.displayInventationCode')){
    invitationCodeElements = <Grid item xs={12}>
      <TextField
        label="Invitation Code"
        variant="outlined"
        fullWidth={true}
        type="invitationCode"
        id="invitationCode"
        value={formik.values.invitationCode}
        onChange={formik.handleChange}
        error={Boolean(formik.errors.invitationCode && formik.touched.invitationCode)}
        helperText={formik.touched.invitationCode && formik.errors.invitationCode}
      />
    </Grid>
  } 

  return (
    <UnauthenticatedContainer className="unauthenticatedContainer" style={{width: '100%'}}>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={error}
        onClose={() => setError(undefined)}
      >
        <SnackBarContentError message={error} />
      </Snackbar>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>

            { patientIdElements }
            { fullLegalNameElements }
            { nicknameElements }
            { familyAndGivenElements }
            { firstAndLastElements }
            { usernameElements }
            { emailElements }
            { passwordElements }              
            { invitationCodeElements }

            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={formik.isSubmitting}
              >
                Sign Up
              </Button>
            </Grid>
            <Grid item xs={12} md={8} style={{float: 'right'}}>
              <Button
                color="primary"
                onClick={openLoginDialog}
              >
                Already have an account
              </Button>
            </Grid>
          </Grid>
        </form>
    </UnauthenticatedContainer>
  );
};

export default Signup;