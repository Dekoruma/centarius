export const emptyObject = Object.freeze({});

export const isResSent = (res) => res.finished || res.headersSent;

export const noop = () => {};

export function cleanPath(_path) {
  let path = _path;
  while (path.indexOf('//') !== -1) {
    path = path.replace('//', '/');
  }
  return path;
}

/**
 * Taken from lodash's has function
 * https://github.com/lodash/lodash/blob/master/last.js
 *
 * MIT License
 */

const { hasOwnProperty } = Object.prototype;

export const hasProperty = (object, key) =>
  object != null && hasOwnProperty.call(object, key);

/**
 * Taken from lodash's last function with some changes
 * https://github.com/lodash/lodash/blob/master/last.js
 *
 * MIT License
 */
export const last = (array) => {
  const length = array == null ? 0 : array.length;
  return length ? array[length - 1] : {};
};

export const isFunction = (obj) => typeof obj === 'function';

export const isObject = (obj) => obj !== null && typeof obj === 'object';

export const isPromise = (value) => isObject(value) && isFunction(value.then);

export const isSwitch = (el) => el.type && el.type.name === 'Switch';

export const isWrappedComponent = (el) => el.WrappedComponent;

export const isLoadableComponent = (component) =>
  component && isFunction(component.load);

export const isReactLoadable = (component) =>
  component && isFunction(component.preload);

export const isLoadable = (el, method) =>
  el && typeof el[method] === 'function';

export const isServer =
  Object.prototype.toString.call(
    typeof process !== 'undefined' ? process : 0
  ) === '[object process]';

export const initRedirect = (res) => (location) => {
  if (isServer) {
    res.writeHead(302, { Location: location });
    res.end();
  } else {
    window.location.replace(location);
  }
};
