module.exports.createBabelConfig = ({ modules }) => ({
  comments: false,
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    [
      'transform-react-remove-prop-types',
      {
        mode: 'wrap',
        ignoreFilenames: ['node_modules'],
      },
    ],
  ].concat(modules ? ['babel-plugin-add-module-exports'] : []),
});

module.exports.commonJSOpts = {
  modules: 'commonjs',
  target: 'dist/cjs',
};
