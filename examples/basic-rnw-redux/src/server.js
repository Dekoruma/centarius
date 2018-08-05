import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';

import { AppRegistry } from 'react-native';
import { renderToStaticMarkup } from 'react-dom/server';

import express from 'express';
import { render } from 'centarius/server';

import qs from 'qs';
import configureStore from './store/configureStore';

import urls from './urls';
import Html from './containers/Html';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    try {
      // Read the counter from the request, if provided
      const params = qs.parse(req.query);
      const counter = parseInt(params.counter, 10) || 0;

      // Compile initial state
      const preloadedState = { counter };

      // Create a new Redux store instance
      const store = configureStore(preloadedState);

      // Grab the initial state from our Redux store
      const serverState = store.getState();

      const customRenderer = (node) => {
        const App = () => <Provider store={store}>{node}</Provider>;

        // react-native-web styles integration
        AppRegistry.registerComponent('App', () => App);
        const { element, getStyleElement } = AppRegistry.getApplication(
          'App',
          {},
        );

        // prerender rnw styles
        const rnwCss = renderToStaticMarkup(getStyleElement());

        return {
          html: renderToString(element),
          // Anything else you add here will be made available
          // within document's this.props
          // e.g a redux store...
          rnwCss,
          serverState,
        };
      };

      const html = await render({
        req,
        res,
        routes: urls,
        assets,
        document: Html,
        customRenderer,
      });
      res.send(html);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  });

export default server;
