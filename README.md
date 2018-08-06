<h1 align="center">
  Centarius
  <br />
  <br />
  <a align="center" href="https://nodei.co/npm/centarius/"><img align="center" src="https://nodei.co/npm/centarius.png?downloads=true&downloadRank=true&stars=true" /></a>
</h1>

<h3 align="center">
  <br>
    Like <a href="https://github.com/jaredpalmer/after.js">AfterJS</a> but more customizable
  <br />
  <br />
    Inspired from <a href="https://github.com/jaredpalmer/after.js">AfterJS</a> and <a href="https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config">React Router Config</a>
  <br />
  <br />
</h3>

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

[AfterJS](https://github.com/jaredpalmer/after.js) is awesome library but it has some drawbacks that I found it difficult to modify it in my other projects such as :

* Routes' config only one level depth, and

* Not able to modify routes config as we wish, imagine you are building complex application's routes. Sometimes just map over through your routes' config and get initial props are not enough.

* Some routes are using same logical needs. We need strategy for providing it.

> We need to adopt and a little bit to modify [React Router Config](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config) strategy in our apps, to make more complex and declarative application based on routes config

* Not able to modify static method for get initial props (getInitialProps is good, but you should be able to modify the name based on your content)

* Not able to handle loading or error state while transitioning and getting initial props for other route

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
- [Authors](#authors)
- [Special Thanks](#special-thanks)
- [Inspirations](#inspirations)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## How Centarius Works

__Centarius__ will read through your routes' config to find component that you've already specified.

## Data Fetching

In all components that you want to passed the initial data, you can add a `static async getInitialProps` or `another function's name that exactly does the same`.

This will be called on both initial server render and while transitioning between routes.

<h4>
  Results are made available on the props
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

* `req?: Request object`: (server-only) A Express.js request object
* `res?: Request object`: (server-only) An Express.js response object
* `match: object`: React Router 4's `match` object.
* `history: object`: React Router 4's `history` object.
* `location: object`: (client-only) React Router 4's `location` object.
* `isServer: boolean`: Check whether code is running on server or client
* `query: object`: Parsed query string from url
* `params: object`: Parsed param object from React Router

__You can also add another variable to be passed into static method like Redux Store, etc.__

> If you are using some server only modules inside `getInitialProps` or `anoher function name`, make sure to [import them properly](https://arunoda.me/blog/ssr-and-server-only-modules).
> Otherwise, it'll slow down your app.

_Taken from [Next](https://github.com/zeit/next.js)_

### Injected Page Props

* Whatever you have returned in `getInitialProps`
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
        <div>{this.props.stuff || ''}</div>
      </div>
    );
  }
}

export default Home;
```

## Routing

React Router 4 is used in all over __Centarius__ API.

### Parameterized Routing

```js
// ./src/routes.js
import Home from './Home';
import About from './About';
import Counter from './Counter';

// Internally these will become:
// <Route path={path} exact={exact} render={props => <component {...props} data={data} />} />
const routes = [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/counter/:count',
    component: Counter,
  },
];

export default routes;
```

### Custom Route Component

Sometimes you need to modify the route component for your needs such as Protected Route to handle your  system's authentication. Centarius provides you with a simple solution for this by using attribute routerComponent in your routes config

```js
// ./src/routes.js
import Home from './Home';
import User from './User';
import About from './About';
import Counter from './Counter';

import ProtectedRoute from './ProtectedRoute';

const routes = [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/user/:username',
    routeComponent: ProtectedRoute,
    component: User,
    ...rest

    // Internally these will become:
    // <ProtectedRoute path={path} exact={exact} render={props => <component {...props} data={data} />} {...rest } />
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/counter/:count',
    component: Counter,
  },
];

export default routes;
```

### Nested Route

Sometimes you need to nested your routes to handle so many things.

---

However, you need to make __parent component render children component.__

__TL;DR : path will be concatted recursively from parent routes__

```js
{
  path: '/user',
  exact: true,
  routeComponent: ProtectedRoute,
  component: User,
  routes: [
    {
      path: '/:username',
      component: UserDetail,
      exact: true,
      routes: [
        {
          path: '/edit',
          component: UserEdit,
        }
      ]
    },
  ],
  ...rest
}
```

__That code will make `/user/:username` render `UserDetail` component and `user/:username/edit` will render `UserEdit` component.__

---

```js
// ./src/routes.js
import Home from './Home';

import User from './User';
import UserDetail from './UserDetail';

import About from './About';
import Counter from './Counter';

import ProtectedRoute from './ProtectedRoute';

const routes = [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/user',
    exact: true,
    routeComponent: ProtectedRoute,
    component: User,
    routes: [
      {
        path: '/:username',
        component: UserDetail,
      },
    ],
    ...rest

    // Internally these will become:
    //
    // <ProtectedRoute
    //    path="/user"
    //    exact
    //    render={props =>
    //      <User {...props} data={data}>
    //        <Route
    //          path="/user/:username"
    //          render={childrenProps =>
    //            <UserDetail {...props} data={data} />
    //          }
    //        />
    //      </User>
    //    }
    //    {...rest }
    //  />
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/counter/:count',
    component: Counter,
  },
];

export default routes;
```


## Custom Options

<p>
  <details>
    <summary>
      <b>Examples</b>
    </summary>
    <ul>
      <li><a href="./examples/redux-rnw-loadable-components">Redux RNW React Loadable</a></li>
      <li><a href="./examples/redux-rnw-loadable-components">Redux RNW Loadable Components</a></li>
    </ul>
  </details>
</p>

__Centarius__ has default options as follows

```js
{
  document: React.Component<any, any> = DefaultCentariusDocument,
  staticMethod: string = 'getInitialProps',
  rootId: string = 'root',
  dataId: string = 'server-app-state',
  isServer: boolean,

  routes: Array<RouteObject> = [], // override this!
}
```

<h3>If you want to change static method, rootId, and dataId, you must pass it both in client and server</h3>

Example

`Centarius : ({ routes, data, options, beforeNavigating, afterNavigating }) => React.Component<any, any>`

* `routes: array[]`: Routes config
* `data: object`: Initial data for Centarius
* `options: object`: Centarius custom options
* `beforeNavigating: () => void`: (client-only) Function that runs before navigating between route
* `afterNavigating: ()=> void`: (client-only) Function that runs after navigating between route

```js
// client.js

import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './client.css';

import { Centarius } from 'centarius/core';
import { getSsrData } from 'centarius/client';
import routes from './routes';

const data = getSsrData();
const options = {
  staticMethod: 'fetchData', // * change the method to make client can preload data

  // Anything else you add here will be made available
  // within static method in client
  // e.g a redux store, etc.
}

hydrate(
  <BrowserRouter>
    <Centarius routes={routes} data={data} options={options} />
  </BrowserRouter>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
```

`render : (options: object) => html : string`

```js
// server.js

import express from 'express';
import { render } from 'centarius/server';

import routes from './routes';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    const routerContext = {};

    if (req.url.match(/.map$/)) return;

    try {
      const html = await render({
        req,
        res,
        routes,
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

With the right custom routes config, you can implement it with another React code splitting library out there such as

* [React Loadable](https://github.com/jamiebuilds/react-loadable)
* [Loadable Components](https://github.com/smooth-code/loadable-components)

> Currently, Centarius only suppors code splitting library that has static method [load | preload] that return component and also hoisting static method such as getInitialProps after it has been loaded.

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

__Centarius__ does not support React Helmet by default, you must add it on your document and custom render.

It really helps if you want to add CSS or other component with side-effects (React Helmet, etc) that needs custom document structure.

__Example with React Helmet and React Native Web__

```js
// document.js

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { renderToStaticMarkup } from 'react-dom/server';

import { CentariusRoot, CentariusData } from 'centarius/document';

/* eslint-disable */

export default class CustomDocument extends Component {
  static async getInitialProps({ assets, data, renderPage }) {
    const page = await renderPage();

    return { assets, data, ...page };
  }

  render() {
    const {
      rootId,
      dataId,
      data,

      // we passed it via custom renderer
      assets,
      helmet,
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

```js
// server.js

import express from 'express';

import React, { Fragment } from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { AppRegistry } from 'react-native';
import Helmet from 'react-helmet';

import { render } from 'centarius/server';

import document from './document';

import routes from './routes';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    if (req.url.match(/.map$/)) return;

    try {
      const customRenderer = async (node) => {
        const helmet = Helmet.renderStatic();

        const CustomApp = () => <Fragment>{node}</Fragment>;

        AppRegistry.registerComponent('App', () => CustomApp);

        const { element, getStyleElement } = AppRegistry.getApplication(
          'App',
          {}
        );

        return {
          helmet,
          rnwCss: renderToStaticMarkup(getStyleElement()),
          html: renderToString(element),
        };
      };

      const html = await render({
        req,
        res,
        routes,
        assets,
        document,
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

    return (
      <html lang="en">
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {styleTags}
        </head>
        <body>
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

__To use custom document, you need to pass it on server file__

```js
// server.js

import express from 'express';
import { render } from 'centarius/server';

import routes from './routes';
import Doc from './Document';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    if (req.url.match(/.map$/)) return;

    try {
      const html = await render({
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

import routes from './routes';
import Doc from './Document';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
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

      const html = await render({
        req,
        res,
        routes,
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

## Packages / Plugins / Addons / HOCs

| Package | Version | Dependencies | Description |
|--------|:-------:|:------------:|-----------|
| [`centarius`](/packages/centarius) | [![npm](https://img.shields.io/npm/v/centarius.svg?maxAge=86400)](https://www.npmjs.com/package/centarius) | [![Dependency Status](https://david-dm.org/rayandrews/centarius.svg?path=packages/centarius)](https://david-dm.org/rayandrews/centarius?path=packages/centarius) | Core package. _Required_ |
| [`@centarius/state-hoc`](/packages/state-hoc) | [![npm](https://img.shields.io/npm/v/@centarius/state-hoc.svg?maxAge=86400)](https://www.npmjs.com/package/@centarius/state-hoc) | [![Dependency Status](https://david-dm.org/rayandrews/centarius.svg?path=packages/state-hoc)](https://david-dm.org/rayandrews/centarius?path=packages/state-hoc) | State HOC for Centarius |
| [`@centarius/react-loadable`](/packages/react-loadable) | [![npm](https://img.shields.io/npm/v/@centarius/react-loadable.svg?maxAge=86400)](https://www.npmjs.com/package/@centarius/react-loadable) | [![Dependency Status](https://david-dm.org/rayandrews/centarius.svg?path=packages/react-loadable)](https://david-dm.org/rayandrews/centarius?path=packages/react-loadable) | React Loadable HOC for Centarius |

---

## Authors

* Ray Andrew [@rayandrews](https://github.com/rayandrews)
* Natan Elia [@natanelia](https://github.com/natanelia)

---

## Special Thanks

* __Jared Palmer [@jaredpalmer](https://github.com/jaredpalmer) for After.JS__
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