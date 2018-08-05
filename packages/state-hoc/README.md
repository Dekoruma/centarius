# @centarius/state-hoc [![npm](https://img.shields.io/npm/v/@centarius/state-hoc.svg)](https://npmjs.org/package/@centarius/state-hoc)

> state-hoc plugin for [centarius](https://github.com/rayandrews/centarius).

## Introduction

Centarius State HOC is created to reduce boilerplate in your render function.

Centarius State HOC is using `CentariusConsumer` from packages `centarius` to get current state from `centarius` component.

You can pass options like `LoadingComponent` and `ErrorComponent` to maximize user experience while fetching data takes lot times.

## Install

```sh
$ npm install --save-dev @centarius/state-hoc
```

OR

```sh
$ yarn add @centarius/state-hoc
```

## API

The API is as same as `Connect` HOC by React-Redux

__TL;DR All static methods will be hoisted__

```js
centariusStateHoc: ({ LoadingComponent = null, ErrorComponent = null }) => (Component: React.Component<any, any>) => WrappedComponent: React.Component<any, any>
```

## Usage

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

export default centariusStateHoc({
  LoadingComponent: () => <div>Loading...</div>,
  ErrorComponent: () => <div>Error!</div>
})(Home);
```

## Support

Any issues or questions can be sent to the [centarius monorepo](https://github.com/rayandrews/centarius/issues/new).

Please be sure to specify that you are using `@centarius/state-hoc`.

## License

MIT © [Ray Andrew](https://github.com/rayandrews)