import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';

import { Meteor } from 'meteor/meteor';


const useStyles = makeStyles((theme) => ({
  canvas: {
    backgroundImage: "url(" + Meteor.absoluteUrl() + "packages/awatson1978_watson-home-inspections/assets/photogallery/A.png" + ")", 
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: '100%',
    width: '100%',
    overflow: 'hidden'
  }
}));




function AppCanvas(props) {
  logger.debug('Rendering the AppCanvas and associated backgrounds.');
  logger.verbose('client.app.layout.AppCanvas');

  const classes = useStyles();


  const { children, startAdornment, ...otherProps } = props;

  return (
    <div id="appCanvas" { ...otherProps } className={classes.canvas} >
      { children }
    </div>
  );
}
export default AppCanvas;

