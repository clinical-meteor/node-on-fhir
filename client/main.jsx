import React from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from "react-dom";

import { render } from 'react-dom';
import AppContainer from '/app/layout/AppContainer'

Meteor.startup(() => {
  render(<AppContainer />, document.getElementById('reactTarget'));
});
