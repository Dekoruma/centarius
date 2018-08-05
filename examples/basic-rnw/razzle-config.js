module.exports = {
  modify(defaultConfig, { target }) {
    process.env.BABEL_ENV = target;

    return defaultConfig;
  },
};
