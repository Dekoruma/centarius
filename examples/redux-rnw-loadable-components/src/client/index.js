import 'cross-fetch/polyfill';

import { AppRegistry } from 'react-native';

import { loadComponents } from 'loadable-components';

import AppWrapper from './AppWrapper';

loadComponents().then(() => {
  AppRegistry.registerComponent('App', () => AppWrapper);
  AppRegistry.runApplication('App', {
    rootTag: document.getElementById('root'),
  });
});

if (module.hot) {
  module.hot.accept();
}
