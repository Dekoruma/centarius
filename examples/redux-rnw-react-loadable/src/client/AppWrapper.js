import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { Centarius } from 'centarius/core';
import { getSsrData } from 'centarius/client';

import configureStore from 'store/configureStore';
import routes from 'app/routes';

/* eslint-disable */
const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);
delete window.__PRELOADED_STATE__;

const data = getSsrData();
const options = {
  staticMethod: 'fetchData',
  store,
};
const beforeNavigating = () => {
  window.scrollTo(0, 0);
};

const AppWrapper = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Centarius
        routes={routes}
        data={data}
        options={options}
        beforeNavigating={beforeNavigating}
      />
    </BrowserRouter>
  </Provider>
);
/* eslint-enable */

export default AppWrapper;
