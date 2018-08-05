import React from 'react';
import { Home, Counter, ModalBasic, ModalEnhanced } from './containers';

export default [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/counter',
    component: Counter,
  },
  {
    path: '/modal',
    render: (props) => <div {...props} />,
    routes: [
      {
        path: '/basic',
        component: ModalBasic,
      },
      {
        path: '/enhanced',
        component: ModalEnhanced,
      },
    ],
  },
  {
    path: '**',
    render: () => <div>404</div>,
  },
];
