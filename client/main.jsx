import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import ReactDOM from "react-dom";

import { render } from 'react-dom';
import AppContainer from '/app/layout/AppContainer'
import { onPageLoad } from 'meteor/server-render';

// Meteor.startup(function(){
//   render(<AppContainer />, document.getElementById('reactTarget'));
// });

onPageLoad(() => {
  ReactDOM.hydrate(<AppContainer />, document.getElementById('reactTarget'));
});