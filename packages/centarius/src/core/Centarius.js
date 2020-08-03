/**
 * Inspired by After.js by Jared Palmer
 * https://github.com/jaredpalmer/after.js
 *
 * MIT License
 * With some changes by Ray Andrew (@rayandrews) <raydreww@gmail.com>
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import renderRoutes from './renderRoutes';
import loadInitialProps from './loadInitialProps';
import getOptions from './getOptions';
import { Provider } from './context';
import { noop, emptyObject } from './utils';

class Centarius extends Component {
  static displayName = 'Centarius';

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    routes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    data: PropTypes.shape({}),
    options: PropTypes.shape({}),

    beforeNavigating: PropTypes.func,
    afterNavigating: PropTypes.func,
  };

  static defaultProps = {
    options: emptyObject,
    data: null,

    beforeNavigating: noop,
    afterNavigating: noop,
  };

  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      location: props.location,
      previousLocation: null,
      loading: false,
      error: false,
    };

    this.options = getOptions(props.options);

    this.prefetcherCache = {};
  }

  /* eslint-disable camelcase,react/no-did-update-set-state,react/destructuring-assignment */
  async componentDidUpdate(_, prevState) {
    const navigated = prevState.location !== this.state.location;

    if (navigated) {
      const {
        data,
        match,
        routes,
        history,
        options,
        location,
        beforeNavigating,
        afterNavigating,
        ...restProps
      } = this.props;

      try {

        const { data: dataProps } = await loadInitialProps(
          routes,
          this.state.location.pathname,
          {
            ...restProps,
            ...this.options,
            location,
            history,
          }
        );

        this.setState(
          {
            previousLocation: null,
            data: dataProps,
            loading: false,
          },
          () => afterNavigating(null, this.state)
        );
      } catch (error) {
        this.setState(
          {
            data: null,
            loading: false,
            error: true,
          },
          () => afterNavigating(null, this.state)
        );
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const navigated = nextProps.location !== prevState.location;

    if (navigated) {
      const nextState = {
        location: nextProps.location,
        previousLocation: prevState.location,
        data: undefined,
        loading: true
      }

      nextProps.beforeNavigating(null, { ...prevState, ...nextState });

      return nextState;
    }

    return null;
  }
  /* eslint-enable camelcase,react/no-did-update-set-state,react/destructuring-assignment */

  async prefetch(pathname) {
    const { data, options, routes, ...rest } = this.props;

    try {
      const dataProps = await loadInitialProps(routes, pathname, {
        ...this.options,
        ...rest,
      });

      this.prefetcherCache = Object.assign({}, this.prefetcherCache, {
        [pathname]: dataProps,
      });
    } catch (error) {
      this.setState({
        error: true,
      });
    }
  }

  render() {
    const { previousLocation, data, ...restState } = this.state;
    const { location, routes } = this.props;
    const initialData = this.prefetcherCache[location.pathname] || data;

    return (
      <Provider value={restState}>
        {renderRoutes(routes, {
          ...restState, // loading and error
          ...initialData,
          location: previousLocation || location,
          prefetch: this.prefetch,
        })}
      </Provider>
    );
  }
}

export default withRouter(Centarius);
