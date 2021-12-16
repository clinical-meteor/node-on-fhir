import React, { useState } from 'react';
import { RouteComponentProps, Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Typography,
  Snackbar,
  makeStyles,
  Card,
  CardContent,
  Grid,
  TextField,
  Divider,
  Link,
} from '@material-ui/core';

import { useFormik, FormikErrors } from 'formik';
// import { accountsRest } from './accounts';
import { SnackBarContentError } from './SnackBarContentError';
import { SnackBarContentSuccess } from './SnackBarContentSuccess';
import { UnauthenticatedContainer } from './UnauthenticatedContainer';

const useStyles = makeStyles(theme => ({
  cardContent: {
    padding: theme.spacing(3),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const LogInLink = React.forwardRef(function(props, ref){
  return <RouterLink to="/login" {...props} ref={ref} />
});

// interface RouteMatchProps {
//   token: string;
// }

// interface ForgotPasswordValues {
//   email: string;
//   newPassword: string;
//   confirmNewPassword: string;
// }

const ForgotPassword = function({ match }){
  const classes = useStyles();

  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validate: function(values){
      const errors = {};

      if (!values.email) {
        errors.email = 'Required';
      }

      return errors;
    },
    onSubmit: async function(values, { setSubmitting }){
      try {
        if (!match.params.token) {
          // await accountsRest.sendForgotPasswordEmail(values.email);
          // setSuccess('Email sent');
        } else {
          // await accountsRest.ForgotPassword(match.params.token, values.newPassword);
          // setSuccess('Your password has been reset successfully');
        }
      } catch (err) {
        setError(err.message);
      }

      setSubmitting(false);
    },
  });

  return (
    <UnauthenticatedContainer>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={!!error}
        onClose={function(){setError(undefined)}}
      >
        <SnackBarContentError message={error} />
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={!!success}
        onClose={function(){setSuccess(undefined)}}
      >
        <SnackBarContentSuccess message={success} />
      </Snackbar>

      <Card>
        <CardContent className={classes.cardContent}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5">Reset your password</Typography>
                {/* {!match.params.token && (
                  <Typography variant="body2">
                    We will send a confirmation email to this address:
                  </Typography>
                )} */}
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
                <Button variant="contained" color="primary" type="submit">
                  Send email
                </Button>
              </Grid>
            </Grid>
          </form>
          <Divider className={classes.divider} />
          <Link component={LogInLink}>Login</Link>
        </CardContent>
      </Card>
    </UnauthenticatedContainer>
  );
};

export default ForgotPassword;