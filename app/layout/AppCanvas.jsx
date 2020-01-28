import React, { Component } from 'react';

function AppCanvas(props) {
  logger.info('Rendering the AppCanvas and associated backgrounds.');
  logger.verbose('client.app.layout.AppCanvas');

  const { children, startAdornment, ...otherProps } = props;

  return (
    <div { ...otherProps } >
      { children }
    </div>
  );
}
export default AppCanvas;

