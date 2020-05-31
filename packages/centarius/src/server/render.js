/**
 * Inspired by After.js by Jared Palmer
 * https://github.com/jaredpalmer/after.js
 *
 * MIT License
 * With some changes by Ray Andrew (@rayandrews) <raydreww@gmail.com>
 */

import React from 'react';
import { parse } from 'url';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';

import isEmpty from 'lodash/isEmpty';

import { isPromise, initRedirect, isResSent } from '../core/utils';

import getOptions from '../core/getOptions';
import loadInitialProps from '../core/loadInitialProps';

import Centarius from '../core/Centarius';

const pageModifierFunction = (Page) => (props) => <Page {...props} />;

export default async function render(_options) {
  const options = getOptions(_options);
  const {
    req,
    res,
    assets,
    routes,
    document: Document,
    customRenderer,
    staticMethod,
    ...rest
  } = options;

  const context = {};

  const renderPage = async (fn = pageModifierFunction) => {
    const defaultRenderer = (node) => ({
      html: ReactDOMServer.renderToString(node),
    });

    const renderer = customRenderer || defaultRenderer;

    const asyncOrSyncRender = renderer(
      <StaticRouter context={context} location={req.url}>
        {fn(Centarius)({ routes, data, options })}
      </StaticRouter>
    );

    const renderedContent = isPromise(asyncOrSyncRender)
      ? await asyncOrSyncRender
      : asyncOrSyncRender;

    return renderedContent;
  };

  const { match = {}, data } = await loadInitialProps(
    routes,
    parse(req.url).pathname,
    {
      req,
      res,
      staticMethod,
      ...rest,
    }
  );

  if (isEmpty(match) || match.path === '**') {
    res.status(404);
  } else if (match.redirectTo) {
    res.redirect(301, req.originalUrl.replace(match.path, match.redirectTo));
    return;
  }

  const routerMatch = matchPath(req.url, match.path);
  const { html, ...docProps } = await Document[staticMethod]({
    req,
    res,
    assets,
    redirect: initRedirect(res),
    renderPage,
    data,
    ...rest,
    match: routerMatch,
  });

  if (isResSent(res)) return;

  if (!Document.prototype || !Document.prototype.isReactComponent)
    throw new Error('Document is not exporting a React component');

  const doc = ReactDOMServer.renderToStaticMarkup(<Document {...docProps} />);

  /* eslint-disable-next-line consistent-return */
  return `<!doctype html>${doc.replace(
    'DO_NOT_DELETE_THIS_YOU_WILL_BREAK_YOUR_APP',
    html
  )}`;
}
