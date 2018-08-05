import defaultConfig from './default';
import productionConfig from './production';
import developmentConfig from './development';

const getConfig = (development) => {
  if (typeof development === 'undefined')
    return Object.assign({}, defaultConfig);

  return Object.assign(
    {},
    defaultConfig,
    development ? developmentConfig : productionConfig
  );
};

export default class Config {
  static config = getConfig(process.env.NODE_ENV === 'development');

  static get(key) {
    if (typeof key === 'undefined') return this.config;

    const value = this.config[key];
    return typeof value === 'undefined' ? {} : value;
  }
}
