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

import { Capture } from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';

import Html from 'containers/Html';
import routes from 'app/routes';

import configureStore from 'store/configureStore';
import { fetchCounter } from 'api/counter';

import stats from 'build/react-loadable.json';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const server = express();

server.use(logger('combined'));

server.get('/api/counter', (req, res) => {
  fetchCounter((result) => {
    const params = qs.parse(req.query);
    const counter = parseInt(params.counter, 10) || result || 0;

    res.json({
      counter,
    });
  });
});

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
      const modules = [];

      const customRenderer = async (node) => {
        const helmet = Helmet.renderStatic();

        const CustomApp = () => (
          <Capture
            report={(moduleName) => {
              modules.push(moduleName);
            }}
          >
            <Provider store={store}>{node}</Provider>
          </Capture>
        );

        const bundles = getBundles(stats, modules);
        const chunks = bundles.filter((bundle) => bundle.file.endsWith('.js'));

        AppRegistry.registerComponent('App', () => CustomApp);

        const { element, getStyleElement } = AppRegistry.getApplication(
          'App',
          {}
        );

        return {
          helmet,
          chunks,
          store,
          rnwCss: renderToStaticMarkup(getStyleElement()),
          html: renderToString(element),
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
      res.send(JSON.stringify(error.stack, null, 2));
    }
  });

export default server;
