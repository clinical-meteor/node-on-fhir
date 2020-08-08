import React from 'react';
import { SnackbarContent, makeStyles } from '@material-ui/core';
import { get } from 'lodash';
import { Meteor } from 'meteor/meteor';

const useStyles = makeStyles(theme => ({
  message: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '150%'
  },
  error: {
    // backgroundColor: theme.palette.error.light,
    backgroundColor: get(Meteor, 'settings.public.theme.palette.primaryColor'),
    width: '100%'
  }
}));




// interface SnackBarContentErrorProps {
//   message?: string;
// }

export const SnackBarContentError = function({ message }){
  const classes = useStyles();

  return (
    <SnackbarContent      
      className={classes.error}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          {message}
        </span>
      }
    />
  );
};