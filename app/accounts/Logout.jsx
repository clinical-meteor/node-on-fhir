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

import { get, has } from 'lodash';
import { useTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';


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

// interface LogoutValues {
//   email: string;
//   password: string;
//   code: string;
// }

const Logout = function({ history }){
  const classes = useStyles();
  const { loginWithService, logout } = useAuth();


  //-----------------------------------------------------------
  // State Management

  const [error, setError] = useState();
  

  //-----------------------------------------------------------
  // Trackers 

  let currentUser = useTracker(function(){
    return Session.get('currentUser');
  }, [])

  //-----------------------------------------------------------
  // Helper Functions

  function openRegisterAccountDialog(){
    Session.set('mainAppDialogTitle', 'Register New Account');
    Session.set('mainAppDialogComponent', 'SignUpDialog');
    Session.set('mainAppDialogMaxWidth', "sm");
  }

  async function logoutUser(){
    console.log('Logging out user session: ' + Session.get('sessionAccessToken'))
    
    // let result = await accountsClient.logout();    
    // console.log('logout result', result);

    Meteor.call('jsaccounts/validateLogout', Session.get('sessionAccessToken'));

    Session.set('currentUser', false);
    Session.set('selectedPatientId', false);
    Session.set('mainAppDialogOpen', false);

  }


  let username = get(currentUser, 'givenName') + ' ' + get(currentUser, 'familyName');

  if(has(currentUser, 'username')){
    username = get(currentUser, 'username');
  } 
  
  if(has(currentUser, 'fullLegalName')){
    username = get(currentUser, 'fullLegalName');
  } 
  

  return (
    <UnauthenticatedContainer>


      <Grid container spacing={3} style={{marginTop: '0px', paddingTop: '0px'}}>
        <Grid item md={12}>
          <h1 className="barcode" style={{marginBottom: '20px', marginTop: '0px', fontWeight: 200}}>{ get(Session.get('currentUser'), '_id')}</h1>

          <TextField
            label="User Name"
            // variant="outlined"
            fullWidth={true}
            type="username"
            id="username"
            defaultValue={ username }
            // disabled
            style={{marginBottom: '20px'}}
          />
          <TextField
            label="Email"
            // variant="outlined"
            fullWidth={true}
            type="email"
            id="email"
            defaultValue={ get(Session.get('currentUser'), 'emails[0].address') }
            // disabled
            style={{marginBottom: '20px'}}
          />

        </Grid>
        <Grid item md={12}>
          <Button
            variant="contained"
            color="primary"                  
            fullWidth={true}                  
            onClick={logoutUser}
          >
            End User Session
          </Button>
        </Grid>
      </Grid>

    </UnauthenticatedContainer>
  );
};

export default Logout;