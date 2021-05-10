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
  Card,
  CardContent,
  Divider,
  Link,
  TextField,
  Grid,
  Snackbar,
} from '@material-ui/core';

import { useFormik, FormikErrors } from 'formik';
import { SnackBarContentError } from './SnackBarContentError';
import { useAuth } from './AuthContext';
import { UnauthenticatedContainer } from './UnauthenticatedContainer';
import { accountsClient } from './Accounts';


const useStyles = makeStyles(theme => ({
  cardContent: {
    padding: theme.spacing(3),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));

const SignUpLink = React.forwardRef((props, ref) => (
  <RouterLink to="/signup" {...props} ref={ref} />
));
const ResetPasswordLink = React.forwardRef((props, ref) => (
  <RouterLink to="/reset-password" {...props} ref={ref} />
));

// interface LoginValues {
//   email: string;
//   password: string;
//   code: string;
// }



const Login = function({ history }){
  const classes = useStyles();

  const { loginWithService, fetchUser } = useAuth();
  // console.log('loginWithService', loginWithService)
  
  const [error, setError] = useState();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      code: ''
    },
    validate: function(values){
      const errors = {};
      
      if (!values.email) {
        errors.email = 'Required';
      }
      if (!values.password) {
        errors.password = 'Required';
      }
      return errors;
    },
    onSubmit: async function(values, { setSubmitting }){

      console.log('AccountsClient: Submiting username and password for authentication.')

      try {
        await loginWithService('password', {
          user: {
            email: values.email
          },
          password: values.password
          // code: values.code
        }, function(err, result){
          if(err){
            console.log('loginWithService.err', err)
          }
          if(result){
            console.log('loginWithService.result', result)
          }
        });        

        Session.set('mainAppDialogOpen', false);
        Session.set('lastUpdated', new Date());

        // history.push('/');
      } catch (err) {
        setError(err.message);
        setSubmitting(false);
      }
    }
  });

  function openRegisterAccountDialog(){
    Session.set('mainAppDialogTitle', 'Register New Account');
    Session.set('mainAppDialogComponent', 'SignUpDialog');
    Session.set('mainAppDialogMaxWidth', "sm");
  }

  return (
    <UnauthenticatedContainer>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        open={!!error}
        onClose={function(){
          setError(undefined)
        }}
      >
        <SnackBarContentError message={error} />
      </Snackbar>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              {/* <Grid item xs={12}>
                <img src="/logo.png" alt="Logo" className={classes.logo} />
              </Grid> */}
              {/* <Grid item xs={12}>
                <Typography variant="h5">Sign in</Typography>
              </Grid> */}
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
              {/* <Grid item xs={12}>
                <TextField
                  label="2fa code if enabled"
                  variant="outlined"
                  fullWidth={true}
                  id="code"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.code && formik.touched.code)}
                  helperText={formik.touched.code && formik.errors.code}
                />
              </Grid> */}
              <Grid item xs={4} md={3}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Sign in
                </Button>
              </Grid>
              {/* <Grid item xs={8} md={4}>
                <Grid container justify="flex-end" alignContent="center">
                  <Button color="primary" >Reset password</Button>
                </Grid>
              </Grid> */}
              <Grid item xs={8} md={9}>
                <Grid container justify="flex-end" alignContent="center">
                  <Button color="primary" onClick={ openRegisterAccountDialog } >Register new account</Button>
                </Grid>
              </Grid>
            </Grid>
          </form>

    </UnauthenticatedContainer>
  );
};

export default Login;