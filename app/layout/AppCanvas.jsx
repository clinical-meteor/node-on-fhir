import React from 'react';

function AppCanvas(props) {
  logger.debug('Rendering the AppCanvas and associated backgrounds.');
  logger.verbose('client.app.layout.AppCanvas');

  const { children, startAdornment, ...otherProps } = props;

  return (
    <div id="appCanvas" { ...otherProps } >
      { children }
    </div>
  );
}
export default AppCanvas;

