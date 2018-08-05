import Home from './Home';
import About from './About/AboutBase';
import Another from './About/Another';

export default [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/home',
    exact: true,
    component: Home,
  },
  {
    path: '/about',
    routes: [
      {
        path: '/',
        exact: true,
        component: About,
      },
      {
        path: '/another',
        exact: true,
        component: Another,
      },
    ],
  },
  {
    path: '/another',
    exact: true,
    component: Another,
  },
];
