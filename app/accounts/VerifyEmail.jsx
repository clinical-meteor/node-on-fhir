import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Typography, makeStyles, Link } from '@material-ui/core';

import { accountsRest } from './Accounts';

import FormError from './FormError';
import { UnauthenticatedContainer } from './UnauthenticatedContainer';

const useStyles = makeStyles(theme => ({
  link: {
    marginTop: theme.spacing(1),
    display: 'block',
  },
}));

const HomeLink = React.forwardRef(function(props, ref){
  return <RouterLink to="/" {...props} ref={ref} />
});

const VerifyEmail = function(){
  const classes = useStyles();

  const match = useParams();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const verifyEmail = async function(){
    try {
      await accountsRest.verifyEmail(match.token);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(function (){
    return verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UnauthenticatedContainer>
      {error && <FormError error={error} />}
      {success && <Typography color="primary">Your email has been verified</Typography>}
      <Link component={HomeLink} className={classes.link}>
        Go Home
      </Link>
    </UnauthenticatedContainer>
  );
};

export default VerifyEmail;