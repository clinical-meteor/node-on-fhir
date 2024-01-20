import React from 'react';

import { Meteor } from 'meteor/meteor';
import { get, has } from 'lodash';


function AppCanvas(props) {
  console.log('Rendering the AppCanvas and associated backgrounds.');
  console.debug('client.app.layout.AppCanvas');

  const { children, startAdornment, ...otherProps } = props;

  let backgroundImage;
  if(get(Meteor, 'settings.public.theme.backgroundImagePath')){
    backgroundImage = "url(" + get(Meteor, 'settings.public.theme.backgroundImagePath') + ")";
  }

  let styleObject = {overflow: 'hidden'}

  if(backgroundImage){
    styleObject["background-image"] = backgroundImage;
    styleObject.width = '100%';
    styleObject.height = '100%';
    styleObject.backgroundSize = 'cover';
  }

  return (
    <div id="appCanvas" { ...otherProps } style={styleObject}>
      { children }
    </div>
  );
}
export default AppCanvas;

