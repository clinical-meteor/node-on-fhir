import React, { Component } from 'react';



function NotFound(props) {

  const classes = useStyles();

  return (
    <div id="notFoundPage" style={{width: '100%', height: '100%'}}>
      <h4 style={{textAlign: "center"}}><strong>Error [404]</strong>: { window.location.pathname } does not exist.</h4>
    </div>
  );
}
export default NotFound;