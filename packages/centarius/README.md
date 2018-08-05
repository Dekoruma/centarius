<h1 align="center">
  Centarius
  <br />
  <br />
  <a align="center" href="https://nodei.co/npm/centarius/"><img align="center" src="https://nodei.co/npm/centarius.png?downloads=true&downloadRank=true&stars=true" /></a>
</h1>

<h2 align="center">
  <br>
    If <a href="https://github.com/jaredpalmer/after.js">AfterJS</a> and <a href="https://github.com/alidcastano/rogue.js">RogueJS</a> had a baby...
  <br />
  <br />
  <img alt="Crossover Meme" src="https://github.com/rayandrews/centarius/blob/master/assets/crossover.gif">
  <br />
  <br />
  <a href="https://github.com/zeit/next.js">NextJS</a> beloved grandchild..
  <br />
  <br />
</h2>

## Getting started with Centarius

__Centarius__ has same API as After.js.

If you have familiarize yourself with After, then you are not finding it difficult to migrate to __Centarius__.

__Also :__ You can build it on your SSR boilerplate (either it webpack, parcel, etc).

__Centarius__ is just another component wrapper to ease React SSR.

### Quickstart with Razzle

```bash
curl https://codeload.github.com/rayandrews/centarius/tar.gz/master | tar -xz --strip=2 centarius-master/examples/basic
cd basic
```

---

## Background

[After](https://github.com/jaredpalmer/after.js) is awesome library but it has some drawbacks that I found it difficult to modify it in my other projects such as,

* Not able to modify routes tree
* Not able to modify static method for get initial props (getInitialProps is good, but you should be able to modify the name based on your content)
* Not able to add loading or error component while transitioning and getting initial props for other route
* Code splitting and load inital props based on routes config

---

How about [Rogue](https://github.com/alidcastano/rogue.js)?

> Brilliant Idea to walk into react tree component recursively like Apollo did in their library

But.. something is bothering me..

* Document feature in Next and After is __REALLY__ syntactic sugar
* GetInitialProps method only called on top highest level component (for performance, I know)
* And of course, not be able to modify static method too

<h3 align="center">
  <br />
    tl;dr
  <br />
    I found them not too suitable for my works
  <br />
</h3>

---

**Table of Contents**

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [How Centarius Works](#how-centarius-works)
- [Data Fetching](#data-fetching)
  - [`getInitialProps | { name } : (ctx) => object`](#getinitialprops---name---ctx--object)
  - [Injected Context Data](#injected-context-data)
- [Routing](#routing)
- [Custom Options](#custom-options)
- [Code Splitting](#code-splitting)
- [Custom Document](#custom-document)
- [Custom/Async Rendering](#customasync-rendering)
- [Custom/Async Rendering](#customasync-rendering)
- [Authors](#authors)
- [Special Thanks](#special-thanks)
- [Inspirations](#inspirations)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## How Centarius Works

__Centarius__ will walk through your React Tree to find static method that you've already specified.

If __Centarius__ not found any static method, __Centarius__ will gracefully return your rendered component.

## Data Fetching

For now, in all components that you want to fetch, you can add a `static async getInitialProps` or `another function's name that exactly does the same`.
This will be called on both initial server render, and then client mounts.

<h4>
  Results are made available on the CONTEXT NOT ON PROPS
  <br />
  <br />
  If you want to get data in the props, you must include the centariusHoc to easily passing data from context to props.
  <br />
</h4>

<h5 align="center">
  <br />
  OR
  <br />
</h5>

<h4>
  <br />
  Use CentariusConsumer (React ^16) to consume the data.
  <br />
  <br />
</h4>

```js
// Home.js
import React from 'react';
import { NavLink } from 'react-router-dom';

class Home extends React.Component {
  static async getInitialProps({ req, res, match }) {
    const stuff = await CallMyApi();
    return { stuff }; // returned value from static method not passed on props by default
  }

  render() {
    return (
      <div>
        <NavLink to="/about">About</NavLink>
        <h1>Home</h1>
      </div>
    );
  }
}

export default Home;
```

### `getInitialProps | { name } : (ctx) => object`

Within `getInitialProps` or `another function name`, you will get access to all you need to fetch data on both
the client and the server (same like After)

* `req?: Request`: (server-only) A Express.js request object
* `res?: Request`: (server-only) An Express.js response object
* `match`: React Router 4's `match` object.
* `history`: React Router 4's `history` object.
* `location`: (client-only) React Router 4's `location` object.
* `isServer`: Check whether code is running on server or client

__You can also add another variable to be passed into static method like Redux Store, etc.__

> If you are using some server only modules inside `getInitialProps` or `anoher function name`, make sure to [import them properly](https://arunoda.me/blog/ssr-and-server-only-modules).
> Otherwise, it'll slow down your app.

_Taken from [Next](https://github.com/zeit/next.js)_

### Injected Context Data

* `data: any` - Whatever you have returned in `getInitialProps` or `another function name`
* `loading: boolean` - Loading state while fetching data in client
* `error: boolean` - Error state (but not throwing error) while fetching data in client
* `prefetch: (pathname: string) => void` - Imperatively prefetch _and cache_ data for a path.

```js
// Home.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { CentariusConsumer } from 'centarius/core';

class Home extends React.Component {
  static async getInitialProps({ req, res, match }) {
    const stuff = await CallMyApi();
    return { stuff };
  }

  render() {
    return (
      <div>
        <NavLink to="/about">About</NavLink>
        <h1>Home</h1>
        <CentariusConsumer>
          {({ data, loading }) => (
            if(loading) return <div>'Loading...'</div>;

            return data.stuff;
          )}
        </CentariusConsumer>
      </div>
    );
  }
}

export default Home;
```

<h5 align="center">
  <br />
  OR
  <br />
  <br />
</h5>

Using `centariusHoc` to wrap your context into props, just like Redux `connect`.

You can also pass options like `LoadingComponent` and `ErrorComponent` to reduce boilerplate in your render function.

```
centariusHoc : ({ LoadingComponent?: null, ErrorComponent?: null }) => (Component) => WrappedComponent
```

__TL;DR All static methods will be hoisted__

```js
// Home.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import centariusStateHoc from '@centarius/state-hoc'

class Home extends React.Component {
  static async getInitialProps({ req, res, match }) {
    const stuff = await CallMyApi();
    return { stuff };
  }

  render() {
    return (
      <div>
        <NavLink to="/about">About</NavLink>
        <h1>Home</h1>
        <div>{this.props.data.stuff}</div>
      </div>
    );
  }
}

export default centariusHoc({
  LoadingComponent: () => <div>Loading...</div>,
  ErrorComponent: () => <div>Error!</div>
})(Home);
```

## Routing

React Router 4 is used in all over __Centarius__ API.

## Custom Options

<p>
  <details>
    <summary>
      <b>Examples</b>
    </summary>
    <ul>
      <li><a href="./examples/basic-rnw">Basic with React Native Web</a></li>
    </ul>
  </details>
</p>

__Centarius__ does not need any router config, so just passing React component with React Router 4 in it, and you're done!

__Centarius__ has default options as follows

```js
{
  document = DefaultCentariusDocument,
  staticMethod = 'getInitialProps',
  rootId = 'root',
  dataId = 'server-app-state',
}
```

<h3>If you want to change static method, rootId, and dataId, you must pass it both in client and server</h3>

Example

`Centarius : ({ component, data, options }) => RenderedComponent`

```js
// client.js

import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './client.css';

import { Centarius } from 'centarius/core';
import { getSsrData } from 'centarius/client';
import App from './App';

const data = getSsrData();
const options = {
  staticMethod: 'fetchData', // * change the method to make client can preload data

  // Anything else you add here will be made available
  // within static method in client
  // e.g a redux store, etc.
}

hydrate(
  <BrowserRouter>
    <Centarius component={App} data={data} options={options} />
  </BrowserRouter>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
```

`render : (component = App, routerContext, options) => html : string`

```js
// server.js

import express from 'express';
import { render } from 'centarius/server';

import App from './App';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    const routerContext = {};

    if (req.url.match(/.map$/)) return;

    try {
      const html = await render(App, routerContext, {
        req,
        res,
        assets,
        staticMethod: 'fetchData',
        customThing: 'thing',

        // Anything else you add here will be made available
        // within static method in server
        // e.g a redux store, etc.
      });
      res.send(html);
    } catch (error) {
      res.json(error);
    }
  });

export default server;
```

## Code Splitting

<p>
  <details>
    <summary>
      <b>Examples</b>
    </summary>
    <ul>
      <li><a href="./examples/redux-rnw-loadable-components">Loadable Components with React Native Web and Redux</a></li>
      <li><a href="./examples/redux-rnw-react-loadable">React Loadable with React Native Web and Redux</a></li>
    </ul>
  </details>
</p>

__Centarius__ does not defining any code splitting method like After, Next, or Rogue (with loadable-components) did.

> But __Centarius__ does enforce you to implement code splitting with other libraries

With the right custom render function, you can implement it with another React code splitting library out there such as
* [React Loadable](https://github.com/jamiebuilds/react-loadable)
* [Loadable Components](https://github.com/smooth-code/loadable-components)

## Custom Document

<p>
  <details>
    <summary>
      <b>Examples</b>
    </summary>
    <ul>
      <li><a href="./examples/basic-rnw">Basic with React Native Web</a></li>
      <li><a href="./examples/redux-rnw-loadable-components">Loadable Components with React Native Web and Redux</a></li>
      <li><a href="./examples/redux-rnw-react-loadable">React Loadable with React Native Web and Redux</a></li>
    </ul>
  </details>
</p>

Centarius works like After and Next, you can override any html structure that suitable for your needs.

**_Why we need it?_**

It really helps if you want to add CSS or other component with side-effects (React Helmet, etc) that needs custom document structure.

Example with React Native Web

```js
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { renderToStaticMarkup } from 'react-dom/server';

import { CentariusRoot, CentariusData } from 'centarius/document';

/* eslint-disable */

export default class CustomDocument extends Component {
  static async getInitialProps({ assets, data, renderPage }) {
    const page = await renderPage();

    AppRegistry.registerComponent('CentariusRoot', () => CentariusRoot);
    const { getStyleElement } = AppRegistry.getApplication('CentariusRoot', {});

    const rnwCss = renderToStaticMarkup(getStyleElement());

    return { assets, data, rnwCss, ...page };
  }

  render() {
    const {
      rootId,
      dataId,
      helmet,
      assets,
      data,
      rnwCss,
    } = this.props;

    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();

    return (
      <html lang="en" {...htmlAttrs}>
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {assets.client.css && (
            <link rel="stylesheet" href={assets.client.css} />
          )}
          <style
            id="react-native-stylesheet"
            dangerouslySetInnerHTML={{
              __html: rnwCss
                .replace(/<\/style>/g, '')
                .replace(/<style id="react-native-stylesheet">/g, ''),
            }}
          />
        </head>
        <body {...bodyAttrs}>
          <CentariusRoot id={rootId} />
          <CentariusData id={dataId} data={data} />
          <script
            type="text/javascript"
            src={assets.client.js}
            crossOrigin="anonymous"
          />
        </body>
      </html>
    );
  }
}
```

If you were using something like `styled-components`, and you need to wrap you entire app with some sort of additional provider or function, you can do this with `renderPage()`.

_Taken from [After](https://github.com/jaredpalmer/after.js)_

```js
// Document.js
import React, { Component } from 'react';
import { ServerStyleSheet } from 'styled-components'
import { renderToStaticMarkup } from 'react-dom/server';

import { CentariusRoot, CentariusData } from 'centarius/document';

export default class CustomDocument extends Component {
  static async getInitialProps({ assets, data, renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = await renderPage(App => props => sheet.collectStyles(<App {...props} />));
    const styleTags = sheet.getStyleElement();
    return { assets, data, ...page, styleTags };
  }

  render() {
    const {
      rootId,
      dataId,
      helmet,
      assets,
      data,
      styleTags,
    } = this.props;
    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();

    return (
      <html lang="en" {...htmlAttrs}>
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {styleTags}
        </head>
        <body {...bodyAttrs}>
          <CentariusRoot id={rootId} />
          <CentariusData id={dataId} data={data} />
          <script
            type="text/javascript"
            src={assets.client.js}
            defer
            crossOrigin="anonymous"
          />
        </body>
      </html>
    );
  }
```

To use custom document, you need to pass it on server file

```js
// server.js

import express from 'express';
import { render } from 'centarius/server';

import App from './App';
import Doc from './Document';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    const routerContext = {};

    if (req.url.match(/.map$/)) return;

    try {
      const html = await render(App, routerContext, {
        req,
        res,
        assets,
        staticMethod: 'fetchData',
        customThing: 'thing',
        document: Doc,
        // Anything else you add here will be made available
        // within static method in server
        // e.g a redux store, etc.
      });
      res.send(html);
    } catch (error) {
      res.json(error);
    }
  });

export default server;
```

## Custom/Async Rendering

<p>
  <details>
    <summary>
      <b>Examples</b>
    </summary>
    <ul>
      <li><a href="./examples/redux-rnw-loadable-components">Loadable Components with React Native Web and Redux</a></li>
      <li><a href="./examples/redux-rnw-react-loadable">React Loadable with React Native Web and Redux</a></li>
    </ul>
  </details>
</p>

You can provide a custom (potentially async) rendering function as an option to Centarius `render` function, just like After.js.

If it presents, it will be used instead of the default ReactDOMServer renderToString function.

It has to return an object of shape `{ html : string!, ...otherProps }`, in which `html` will be used as the rendered string.

`otherProps` will be passed as props to the rendered Document.

```js
defaultRenderer = (node) => ({ html: ReactDOMServer.renderToString(node) })
```

Example

```js

// server.js

import express from 'express';
import { render } from 'centarius/server';

import { Capture } from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';

import stats from 'build/react-loadable.json';

import configureStore from 'store/configureStore';

import App from './App';
import Doc from './Document';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    const routerContext = {};

    if (req.url.match(/.map$/)) return;

    try {
      const preloadedState = {};
      const store = configureStore(preloadedState);
      const modules = [];

      const customRenderer = (node) => {
        const CustomApp = (
          <Capture report={(moduleName) => modules.push(moduleName)}>
            <Provider store={store}>{node}</Provider>
          </Capture>
        );

        const bundles = getBundles(stats, modules);
        const chunks = bundles.filter((bundle) => bundle.file.endsWith('.js'));

        return {
          chunks,
          store, // notice that this will passed into document
          html: renderToString(CustomApp),
        };
      };

      const html = await render(App, routerContext, {
        req,
        res,
        assets,
        staticMethod: 'fetchData',
        customThing: 'thing',
        document: Doc,
        store, // this will be passed in static method in server

        // Anything else you add here will be made available
        // within static method in server
        // e.g a redux store, etc.
      });
      res.send(html);
    } catch (error) {
      res.json(error);
    }
  });

export default server;
```

---

## Authors

* Ray Andrew [@rayandrews](https://github.com/rayandrews)
* Natan Elia [@natanelia](https://github.com/natanelia)

---

## Special Thanks

* Ivana Irene [@ivanaairenee](https://github.com/ivanaairenee)
* Reinaldo Ignatius [@nimitz21](https://github.com/nimitz21)

---

## Inspirations

* [Next.js](https://github.com/zeit/next.js)
* [After.js](https://github.com/jaredpalmer/after.js)
* [Rogue.js](https://github.com/alidcastano/rogue.js)
* [Razzle](https://github.com/jaredpalmer/razzle)

---

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details