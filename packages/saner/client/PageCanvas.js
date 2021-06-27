import React from 'react';
import PropTypes from 'prop-types'

import { get } from 'lodash';


function PageCanvas(props){
  // console.log('PageCanvas.props', props);

  const {
    consoleLog,
    children, 
    classes, 
    headerHeight, 
    paddingLeft, 
    paddingRight, 
    marginLeft, 
    marginRight, 
    style, 
    ...otherProps 
  } = props;

  let returnedHeaderHeight = 0;
  let returnedStyle = {};

  if(style){
    returnedStyle = style;
  }

  if(headerHeight > -1){
    returnedStyle.paddingTop = headerHeight + 'px';
  }
  if(paddingLeft > -1){
    returnedStyle.paddingLeft = paddingLeft + 'px';
  }
  if(paddingRight > -1){
    returnedStyle.paddingRight = paddingRight + 'px';
  }

  // if(consoleLog){
  //   console.log('PageCanvas.consoleLog', consoleLog)
  // }

  return(
    <div className="pageCanvas" {...otherProps} style={returnedStyle} >
      { children }
    </div>
  );
}
PageCanvas.propTypes = {
  headerHeight: PropTypes.number,
  paddingLeft: PropTypes.number,
  paddingRight: PropTypes.number,
  marginLeft: PropTypes.number,
  marginRight: PropTypes.number,
  children: PropTypes.any,
  style: PropTypes.object,
  consoleLog: PropTypes.bool
}
PageCanvas.defaultProps = {
  headerHeight: 0,
  paddingLeft: 100,
  paddingRight: 100,
  style: {
    flexGrow: 1,
    paddingLeft: '100px', 
    paddingRight: '100px',
    marginLeft: '0px', 
    marginRight: '0px',
    verticalAlign: 'top',
    display: 'inline-block', 
    height: '100%',
    width: '100%'
  },
  consoleLog: false
}

export default PageCanvas;

