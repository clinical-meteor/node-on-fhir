import React, { Component } from 'react';

import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {},
  button: {}
}));


function NotFound(props) {
  const classes = useStyles();

  return (
    <div id="notFoundPage" style={{width: '100%', height: '100%', padding: '200px'}}>
      <h2 className="helveticas" style={{textAlign: "center"}}><strong>Error [404]</strong>: { window.location.pathname } does not exist.</h2>
    </div>
  );
}
export default NotFound;