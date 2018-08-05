# @centarius/react-loadable [![npm](https://img.shields.io/npm/v/@centarius/react-loadable.svg)](https://npmjs.org/package/@centarius/react-loadable)

> React Loadable plugin for [centarius](https://github.com/rayandrews/centarius).

<h1 align="center">

```diff
- !! THIS IS JUST A STUB, NOT YET IMPLEMENTED !! -
```

</h1>

## Introduction

Centarius React Loadable is just like Centarius State-HOC.

Its own purposes are to reduce boilerplate in your render function __AND__ pass `LoadingComponent` and `ErrorComponent` respectively to React Loadable instances.

_**What does it mean?**_

It means that we can use same `LoadingComponent` and `Error Component` for both fetching initial data / props or loading split files

## Install

```sh
$ npm install --save-dev @centarius/react-loadable
```

OR

```sh
$ yarn add @centarius/react-loadable
```

## API (CAN BE CHANGED IN THE FUTURE)

__TL;DR All static methods will be hoisted__

```js
centariusReactLoadable: (options: ReactLoadableOptions) => ReactLoadableComponent
```

[See this link for more options](https://github.com/jamiebuilds/react-loadable#loadable-and-loadablemap-options)

## Usage

```js
import centariusReactLoadable from '@centarius/react-loadable';
import LoadingComponent from './Loading';
import ErrorComponent from './Error';

export default centariusReactLoadable({
  loader: () => import('./index'),
  ...rest,

  // both this options will be passed onto loading properties in ReactLoadable
  // it means loading will be overriden by these two
  LoadingComponent,
  ErrorComponent,
});
```

## Support

Any issues or questions can be sent to the [centarius monorepo](https://github.com/rayandrews/centarius/issues/new).

Please be sure to specify that you are using `@centarius/react-loadable`.

## License

MIT © [Ray Andrew](https://github.com/rayandrews)