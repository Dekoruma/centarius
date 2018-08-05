/**
 * Inspired by React Router Config by ReactTraining
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router-config
 *
 * MIT License
 * With some changes by Ray Andrew (@rayandrews) <raydreww@gmail.com>
 */

import matchPath from 'react-router-dom/matchPath';
import Router from 'react-router-dom/Router';

import {
  last,
  isWrappedComponent,
  isLoadableComponent,
  isLoadable,
  isReactLoadable,
  cleanPath,
} from './utils';

// ensure we're using the exact code for default root match
const { computeMatch } = Router.prototype;

export async function getComponent(_component, ctx) {
  let component = null;

  // if loadable components, load first
  if (isLoadableComponent(_component)) {
    const loadedComponent = await _component.load();

    if (isWrappedComponent(loadedComponent)) {
      if (isLoadable(loadedComponent, ctx.staticMethod)) {
        component = loadedComponent;
      }
    } else if (isLoadable(loadedComponent, ctx.staticMethod)) {
      component = loadedComponent;
    }

    return component;
  }

  // if react loadable, preload first
  if (isReactLoadable(_component)) {
    const loadedComponent = await _component.preload();

    if (isLoadable(loadedComponent.default, ctx.staticMethod)) {
      component = loadedComponent.default;
    }

    return component;
  }

  if (isLoadable(_component, ctx.staticMethod)) {
    return _component;
  }

  return component;
}

async function getInitialData(component, ctx) {
  const loadableComponent = await getComponent(component, ctx);

  if (!component || !loadableComponent) return Promise.resolve(null);

  return loadableComponent[ctx.staticMethod](ctx);
}

export const matchRoutes = (
  routes,
  pathname,
  /* not public API */
  basePath = '/',
  branch = []
) => {
  let routePath = basePath;

  routes.some((route) => {
    let match = false;

    /* eslint-disable */
    if (route.path) {
      routePath = cleanPath(`${basePath}/${route.path || ''}`);
      match = matchPath(pathname, {
        ...route,
        path: routePath,
      });
    } else {
      if (branch.length) {
        match = branch[branch.length - 1].match;
      } else {
        match = computeMatch(pathname);
      }
    }
    /* eslint-enable */

    if (match) {
      branch.push({ route, match });

      if (route.routes) {
        matchRoutes(route.routes, pathname, routePath, branch);
      }
    }

    return match;
  });

  return branch;
};

export default async function loadInitialProps(routes, pathname, ctx) {
  const branches = matchRoutes(routes, pathname);

  const promises = branches.map(({ route }) =>
    getInitialData(route.component, ctx)
  );

  const data = await Promise.all(promises);

  return { ...last(branches), data: last(data) };
}
