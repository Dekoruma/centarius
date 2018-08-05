/* eslint-disable */

const immutableConfig = (defaultConfig) => {
  const config = Object.assign({}, defaultConfig);

  return config;
};

const injectBabelResolveModules = (includePath, defaultConfig) => {
  const config = immutableConfig(defaultConfig);
  const resolve = config.resolve;

  if (!resolve) {
    console.error('resolve not found');
    return config;
  }
  resolve.modules.push(includePath);
  return config;
};

const injectBabelResolveLoaderModules = (includePath, defaultConfig) => {
  const config = immutableConfig(defaultConfig);
  const resolveLoader = config.resolveLoader;

  if (!resolveLoader) {
    console.error('resolve loader not found');
    return config;
  }

  const previousInclude =
    typeof resolveLoader.modules === 'string'
      ? [resolveLoader.modules]
      : resolveLoader.modules;
  resolveLoader.modules = [includePath].concat(previousInclude || []);
  return config;
};

const injectBabelInclude = (includePath, defaultConfig) => {
  const config = immutableConfig(defaultConfig);
  const modules = config.module;

  if (!modules) {
    console.error('module rules not found');
    return config;
  }

  modules.rules = modules.rules.map((rule) => {
    const previousInclude =
      typeof rulesinclude === 'string' ? [rule.include] : rule.include;
    rule.include = [includePath].concat(previousInclude || []);

    return rule;
  });

  return config;
};

module.exports = {
  immutableConfig,
  injectBabelResolveModules,
  injectBabelResolveLoaderModules,
  injectBabelInclude,
};
