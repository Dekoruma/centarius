import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Centarius } from 'centarius/core';
import { getSsrData } from 'centarius/client';

import { AppRegistry } from 'react-native';

import configureStore from './store/configureStore';
import urls from './urls';

const store = configureStore(window.__PRELOADED_STATE__);

const data = getSsrData();

const App = () => (
  <BrowserRouter>
    <Provider store={store}>
      <Centarius data={data} routes={urls} />
    </Provider>
  </BrowserRouter>
);

AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root'),
});

if (module.hot) {
  module.hot.accept();
}
