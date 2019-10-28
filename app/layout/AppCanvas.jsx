import React, { Component } from 'react';

function AppCanvas(props) {
  console.log('AppCanvas.props', props);
  
  const { children, ...otherProps } = props;

  return (
    <div { ...otherProps } >
      { children }
    </div>
  );
}
export default AppCanvas;

