import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './client.css';

import { Centarius } from 'centarius/core';
import { getSsrData } from 'centarius/client';

import routes from './routes';

const data = getSsrData();

hydrate(
  <BrowserRouter>
    <Centarius routes={routes} data={data} />
  </BrowserRouter>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
