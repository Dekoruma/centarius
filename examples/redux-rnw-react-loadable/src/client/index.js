import 'cross-fetch/polyfill';

import { AppRegistry } from 'react-native';
import Loadable from 'react-loadable';

import AppWrapper from './AppWrapper';

window.main = () => {
  Loadable.preloadReady().then(() => {
    AppRegistry.registerComponent('App', () => AppWrapper);
    AppRegistry.runApplication('App', {
      rootTag: document.getElementById('root'),
    });
  });
};

if (module.hot) {
  module.hot.accept();
}
