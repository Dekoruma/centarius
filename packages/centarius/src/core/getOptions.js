import defaultOptions from './defaultOptions';

export default function getOptions(_options = {}) {
  const options = Object.assign({}, defaultOptions, _options);

  return options;
}
