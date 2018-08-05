/* eslint-disable */
import http from 'http';
import Loadable from 'react-loadable';
import config from 'config';
import app from './server';

const server = http.createServer(app);
const port = process.env.PORT || config.get('port');

let currentApp = app;

Loadable.preloadAll().then(() => {
  server.listen(port, () => {
    console.log(`✅  Server is listening on port ${port}`);
  });
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');
    server.removeListener('request', currentApp);
    const newApp = require('./server').default;
    server.on('request', newApp);
    currentApp = newApp;
  });
}
