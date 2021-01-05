import React from 'react';
import PropTypes from 'prop-types';
import logger from '../Logger';

function AppCanvas(props) {
  logger.debug('Rendering the AppCanvas and associated backgrounds.');
  logger.verbose('client.app.layout.AppCanvas');

  const { children, id, startAdornment, ...otherProps } = props;

  if(!id){
    id = "appCanvas"
  }

  return (
    <div id={id} { ...otherProps } >
      { children }
    </div>
  );
}

AppCanvas.propTypes = {
  id: PropTypes.string
}
export default AppCanvas;



