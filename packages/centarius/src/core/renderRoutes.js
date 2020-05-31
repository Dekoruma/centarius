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

import isEmpty from 'lodash/isEmpty';

import { cleanPath } from './utils';

const WrapperComponent = (props) => <React.Fragment {...props} />;

const Routes = ({ routes, extraProps, basePath }) => (
  <Switch>
    {routes.map((route, i) => {
      const {
        key,
        path,
        exact,
        strict,
        routerComponent: CustomRoute,

        component: RouteComponent,
        render,

        routes: ChildrenRoutes,

        ...rest
      } = route;

      const routePath = cleanPath(`${basePath}/${path || ''}`);

      const routeKey = key || `route--${i}--${routePath}`;

      const ChildrenComponent = renderRoutes(
        ChildrenRoutes,
        extraProps,
        routePath
      );

      /* eslint-disable no-nested-ternary */
      const renderedComponent = (props) => (
        <WrapperComponent>
          {render ? (
            render({ ...props, ...extraProps, children: ChildrenComponent })
          ) : RouteComponent ? (
            <RouteComponent {...props} {...extraProps}>
              {ChildrenComponent}
            </RouteComponent>
          ) : (
            <React.Fragment>{ChildrenComponent}</React.Fragment>
          )}
        </WrapperComponent>
      );
      /* eslint-enable no-nested-ternary */

      if (CustomRoute) {
        return (
          <CustomRoute
            key={routeKey}
            path={routePath}
            exact={exact}
            strict={strict}
            render={renderedComponent}
            {...rest}
          />
        );
      }

      return (
        <Route
          key={routeKey}
          path={routePath}
          exact={exact}
          strict={strict}
          render={renderedComponent}
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
