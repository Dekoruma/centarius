/**
 * Inspired by React Router Config by ReactTraining
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router-config
 *
 * MIT License
 * With some changes by Ray Andrew (@rayandrews) <raydreww@gmail.com>
 */

import isEmpty from 'lodash.isempty';

import { matchPath, Router } from 'react-router-dom';
import { parse } from 'qs';

import {
  last,
  isWrappedComponent,
  isLoadableComponent,
  isLoadable,
  isReactLoadable,
  cleanPath,
  emptyObject,
  hasProperty,
} from './utils';

// ensure we're using the exact code for default root match
const computeRootMatch =
  Router.computeRootMatch || Router.prototype.computeMatch;

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
  routes.some((route) => {
    let routePath = basePath;
    let match = false;

    /* eslint-disable */
    if (route.matchChildrenPathsOnly) {
      const childrenRoutesBranch = matchRoutes(
        route.routes,
        pathname,
        routePath
      );
      const lastBranch = last(childrenRoutesBranch);
      if (lastBranch.match) {
        branch.push(lastBranch);
      }
      return lastBranch.match;
    }

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
        match = computeRootMatch(pathname);
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

  const lastBranch = last(branches);

  const ctxModified = {
    ...ctx,
    // eslint-disable-next-line
    query: ctx.isServer
      ? ctx.req.query
      : isEmpty(ctx.location)
      ? emptyObject
      : parse(ctx.location.search, { ignoreQueryPrefix: true }),
    params: hasProperty(lastBranch.match, 'params')
      ? lastBranch.match.params
      : emptyObject,
  };

  const promises = branches.map(({ route }) =>
    getInitialData(route.component, ctxModified)
  );

  const data = await Promise.all(promises);

  return { ...last(branches), data: last(data) };
}
