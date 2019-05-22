module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV === 'development');

  return {
    comments: false,
    presets: [
      [
        '@babel/preset-env',
        {
          loose: true,
          modules: false,
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
    ],
  };
};
