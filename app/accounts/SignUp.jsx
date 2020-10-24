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

const useStyles = makeStyles(theme => ({
  cardContent: {
    padding: theme.spacing(3),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  logo: {
    maxWidth: '100%',
    width: 250,
  },
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

  const [error, setError] = useState();
  const { loginWithService } = useAuth();

  const formik = useFormik({
    initialValues: {
      givenName: '',
      familyName: '',
      email: '',
      password: '',
      invitationCode: ''
    },
    validate: values => {
      const errors = {};

      if (!values.givenName) {
        errors.givenName = 'Required';
      }
      if (!values.familyName) {
        errors.familyName = 'Required';
      }
      if (!values.email) {
        errors.email = 'Required';
      }
      if (!values.password) {
        errors.password = 'Required';
      }
      if (!values.invitationCode) {
        errors.invitationCode = 'Required';
      }
      return errors;
    },
    onSubmit: async function(values, { setSubmitting }){
      console.log('Submitting sign-up details and creating a new user.')
      try {
        let createUserResult = await accountsPassword.createUser({
          givenName: values.givenName,
          familyName: values.familyName,
          email: values.email,
          password: values.password,
          invitationCode: values.invitationCode,
        });

        console.log('createUserResult', createUserResult)

        // let user = await accountsClient.getUser();
        // console.log('SignUp.user', user)

        Session.set('mainAppDialogOpen', false)

        //history.push('/login');
      } catch (err) {
        setError(err.message);
        setSubmitting(false);

        if (err instanceof AccountsJsError) {
          // You can access the error message via `error.message`
          // Eg: "Email already exists"
          // You can access the code via `error.code`
          // Eg:
          if (err.code === CreateUserErrors.EmailAlreadyExists) {
            // do some custom logic
            console.log("Email already exists.")
          }
        } else {
          // Else means it's an internal server error so you probably want to obfuscate it and return
          // a generic "Internal server error" to the user.
        }
      }

      console.log('Logging in with the same information.')
      await loginWithService('password', {
        user: {
          email: values.email
        },
        password: values.password
        // code: values.code
      });  
    }
  });

  function openLoginDialog(){
    Session.set('mainAppDialogTitle', 'Login');
    Session.set('mainAppDialogComponent', 'LoginDialog');    
  }

  return (
    <UnauthenticatedContainer>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={!!error}
        onClose={() => setError(undefined)}
      >
        <SnackBarContentError message={error} />
      </Snackbar>


          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
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
              </Grid>
              <Grid item xs={12} md={6}>
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
              </Grid>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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