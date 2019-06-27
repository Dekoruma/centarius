/**
 * Inspired by React Router Config by ReactTraining
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router-config
 *
 * MIT License
 * With some changes by Ray Andrew (@rayandrews) <raydreww@gmail.com>
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import isEmpty from 'lodash.isempty';

import { cleanPath } from './utils';

const WrapperComponent = (props) => <React.Fragment {...props} />;

const getRoutePaths = (routes) =>
  routes.reduce((paths, route) => {
    if (typeof route.path !== 'undefined') {
      return paths.concat(route.path);
    }
    return paths;
  }, []);

const Routes = ({ routes, extraProps, basePath }) => (
  <Switch>
    {routes.map((route, i) => {
      const {
        key,
        path,
        matchChildrenPathsOnly,
        exact,
        strict,
        routerComponent: CustomRoute,

        component: RouteComponent,
        render,

        routes: ChildrenRoutes,

        ...rest
      } = route;

      const paths = matchChildrenPathsOnly
        ? getRoutePaths(ChildrenRoutes)
        : [].concat(path);
      const routePaths = paths.map((p) => cleanPath(`${basePath}/${p || ''}`));

      const routeKey = key || `route--${i}--${routePaths[0] || ''}`;

      const childrenBasePath = matchChildrenPathsOnly
        ? basePath
        : routePaths[0];
      const ChildrenComponent = renderRoutes(
        ChildrenRoutes,
        extraProps,
        childrenBasePath
      );

      const renderComponent = (props) => {
        if (render) {
          return render({
            ...props,
            ...extraProps,
            children: ChildrenComponent,
          });
        }
        if (RouteComponent) {
          return (
            <RouteComponent {...props} {...extraProps}>
              {ChildrenComponent}
            </RouteComponent>
          );
        }
        return <React.Fragment>{ChildrenComponent}</React.Fragment>;
      };

      const renderWrappedComponent = (props) => (
        <WrapperComponent>{renderComponent(props)}</WrapperComponent>
      );

      if (CustomRoute) {
        return (
          <CustomRoute
            key={routeKey}
            path={routePaths}
            exact={exact}
            strict={strict}
            render={renderWrappedComponent}
            {...rest}
          />
        );
      }

      return (
        <Route
          key={routeKey}
          path={routePaths}
          exact={exact}
          strict={strict}
          render={renderWrappedComponent}
          {...rest}
        />
      );
    })}
  </Switch>
);

Routes.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  extraProps: PropTypes.shape().isRequired,
  basePath: PropTypes.string.isRequired,
};

const renderRoutes = (
  routes = [],
  extraProps = {},
  /* this is not public API */ basePath = '/'
) => {
  if (isEmpty(routes)) return () => {};
  return <Routes routes={routes} extraProps={extraProps} basePath={basePath} />;
};

export default renderRoutes;
