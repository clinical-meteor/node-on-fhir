import React from 'react';
import { renderToString } from 'react-dom/server';
import { onPageLoad } from 'meteor/server-render';

import { Helmet } from 'react-helmet';

import AppContainer from '/app/layout/AppContainer'
// import AppLoadingPage from '/app/core/AppLoadingPage'

import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';

import theme from '/app/theme.js'
// import { createLogger, addColors, format, transports, config } from 'winston';


onPageLoad((sink) => {
  console.log('Application requested from client browser.  Initiating onPageLoad() pre-render.')

  const context = {};

  const sheets = new ServerStyleSheets();

  // console.log("********:  THEME", theme);

  // const initial = todosGetAll.call({});
  // const store = createStore(mainReducer, { todos: initial }, applyMiddleware(thunk));

  const preloadedState = {};

  const htmlString = renderToString(sheets.collect(
    <ThemeProvider theme={theme} >          
      {/* <AppLoadingPage location={sink.request.url} /> */}
      <AppContainer location={sink.request.url} />
    </ThemeProvider>  
  ));

  // console.log("********:  HTML", htmlString);
  // console.log("********:  STYLES", sheets.toString());

  // Grab the CSS from the sheets.
  sink.appendToHead(`<style id="jss-server-side">${sheets.toString()}</style>`);
  sink.renderIntoElementById('reactTarget', htmlString);

  const helmet = Helmet.renderStatic();
  // console.log("********:  HELMET", helmet);
  
  sink.appendToHead(helmet.meta.toString());
  sink.appendToHead(helmet.title.toString());

  sink.appendToBody(`
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>
  `);
});