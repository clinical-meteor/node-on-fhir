import React, { Component } from 'react';

function HelloFunctional(props) {
  console.log('HelloFunctional.props', props);

  return (
    <div>
      Hello!
    </div>
  );
}
export default HelloFunctional;