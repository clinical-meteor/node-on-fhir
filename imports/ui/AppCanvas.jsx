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


// export class AppCanvas extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   render(){
//     const { ...otherProps } = this.props;

//     console.log('AppCanvas.this.props', this.props)

//     return (
//       <div {...otherProps} >
//         { this.props.children }
//       </div>
//     );
//   }
// }
// export default AppCanvas;