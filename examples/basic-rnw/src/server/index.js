import express from 'express';

import React, { Fragment } from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { AppRegistry } from 'react-native';

import { render } from 'centarius/server';

import Html from '../app/Html';

import routes from '../app/routes';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    if (req.url.match(/.map$/)) return;

    try {
      const customRenderer = async (node) => {
        const CustomApp = () => <Fragment>{node}</Fragment>;

        AppRegistry.registerComponent('App', () => CustomApp);

        const { element, getStyleElement } = AppRegistry.getApplication(
          'App',
          {}
        );

        return {
          rnwCss: renderToStaticMarkup(getStyleElement()),
          html: renderToString(element),
        };
      };

      const html = await render({
        req,
        res,
        routes,
        assets,
        document: Html,
        customRenderer,
        customThing: 'thing',
      });

      if (res.finished) return;

      res.send(html);
    } catch (error) {
      res.status(500);
      res.send(error.stack);
    }
  });

export default server;
