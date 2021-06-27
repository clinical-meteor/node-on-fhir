import React from 'react';

export class MapDot extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const { active, ...otherProps } = this.props;
    return (
        <div {...otherProps} style={{backgroundColor: 'darkgray', opacity: '.8', height: '10px', width: '10px', borderRadius: '80%'}}></div>
    );
  }
}
export default MapDot;