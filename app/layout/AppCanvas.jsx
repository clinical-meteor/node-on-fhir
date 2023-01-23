import React from 'react';

function AppCanvas(props) {
  console.log('Rendering the AppCanvas and associated backgrounds.');
  console.debug('client.app.layout.AppCanvas');

  const { children, startAdornment, ...otherProps } = props;

  return (
    <div id="appCanvas" { ...otherProps } style={{overflow: 'hidden'}}>
      { children }
    </div>
  );
}
export default AppCanvas;

