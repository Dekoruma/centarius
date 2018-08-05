import 'cross-fetch/polyfill';

import express from 'express';
import logger from 'morgan';

import React from 'react';
import { AppRegistry } from 'react-native';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';

import qs from 'qs';
import { render } from 'centarius/server';
import { getLoadableState } from 'loadable-components/server';

import Html from 'containers/Html';
import routes from 'app/routes';

import configureStore from 'store/configureStore';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const server = express();

server.use(logger('combined'));

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    if (req.url.match(/.map$/)) return;

    try {
      const params = qs.parse(req.query);
      const counter = parseInt(params.counter, 10) || 5;
      const preloadedState = { counter };

      const store = configureStore(preloadedState);

      const customRenderer = async (node) => {
        const helmet = Helmet.renderStatic();
        const CustomApp = () => <Provider store={store}>{node}</Provider>;

        const loadableState = await getLoadableState(CustomApp);
        const loadable = loadableState.getScriptTag();

        AppRegistry.registerComponent('App', () => CustomApp);

        const { element, getStyleElement } = AppRegistry.getApplication(
          'App',
          {}
        );

        return {
          html: renderToString(element),
          rnwCss: renderToStaticMarkup(getStyleElement()),
          helmet,
          loadable,
          store,
        };
      };

      const html = await render({
        req,
        res,
        assets,
        routes,
        customRenderer,
        document: Html,
        staticMethod: 'fetchData',
        customThing: 'thing',
        store,
      });

      if (res.finished) return;

      res.send(html);
    } catch (error) {
      res.status(500);
      res.send(error.stack);
    }
  });

export default server;
