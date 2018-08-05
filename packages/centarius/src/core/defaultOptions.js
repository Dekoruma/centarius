import { Document } from '../document';

import { isServer } from './utils';

import { staticMethod, rootId, dataId, routes } from './constants';

export default {
  document: Document,
  staticMethod,
  rootId,
  dataId,
  isServer,
  routes,
};
