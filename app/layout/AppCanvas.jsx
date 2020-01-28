import React from 'react';

function AppCanvas(props) {
  logger.info('Rendering the AppCanvas and associated backgrounds.');
  logger.verbose('client.app.layout.AppCanvas');

  const { children, ...otherProps } = props;

  return (
    <div { ...otherProps } >
      { children }
    </div>
  );
}
export default AppCanvas;

