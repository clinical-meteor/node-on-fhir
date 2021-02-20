import React from 'react';
import { useLocation, useParams, useHistory } from "react-router-dom";

import { renderToString } from 'react-dom/server';
import { onPageLoad } from 'meteor/server-render';

import { Helmet } from 'react-helmet';

import AppContainer from '/app/layout/AppContainer'
// import AppLoadingPage from '/app/core/AppLoadingPage'

import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';
import { get } from 'lodash';

import theme from '/app/Theme.js'
import logger from '../app/Logger';

// import { createLogger, addColors, format, transports, config } from 'winston';
import ReactDOMServer from 'react-dom/server';

onPageLoad((sink) => {
  if(process.env.DEBUG){
    console.log('Application requested from client browser.  Initiating onPageLoad() pre-render.')
  }

  const context = {};

  const sheets = new ServerStyleSheets();

  // console.log("********:  THEME", theme);

  // const initial = todosGetAll.call({});
  // const store = createStore(mainReducer, { todos: initial }, applyMiddleware(thunk));

  let preloadedState = {};
  if(sink.request){
    preloadedState = sink.request;
  }


  const htmlString = renderToString(sheets.collect(
    <ThemeProvider theme={theme} >          
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