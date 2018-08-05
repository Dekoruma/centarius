import Home from './containers/HomePage';
import About from './containers/AboutPage';
import Counter from './containers/CounterPage';
import Modal from './containers/ModalPage';

export default [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/about',
    exact: true,
    component: About,
  },
  {
    path: '/counter',
    exact: true,
    component: Counter,
  },
  {
    path: '/modal',
    exact: true,
    component: Modal,
  },
];
