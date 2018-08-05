import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AppRegistry } from 'react-native';

import { Centarius } from 'centarius/core';
import { getSsrData } from 'centarius/client';

import routes from '../app/routes';

/* eslint-disable */
const data = getSsrData();

const AppWrapper = () => (
  <BrowserRouter>
    <Centarius routes={routes} data={data} />
  </BrowserRouter>
);

AppRegistry.registerComponent('App', () => AppWrapper);
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root'),
});

if (module.hot) {
  module.hot.accept();
}
