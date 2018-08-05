/* eslint-disable */

const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  modify(config, { target, dev }) {
    /** @config: SASS Loader Support */
    const isServer = target !== 'web';

    const postCssLoader = {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          autoprefixer({
            browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
          }),
        ],
      },
    };

    const sassLoader = {
      loader: require.resolve('sass-loader'),
      options: {
        includePaths: [path.resolve(__dirname, '../node_modules')],
      },
    };

    config.module.rules.push({
      test: /\.scss$/,
      use: isServer
        ? [require.resolve('css-loader'), sassLoader]
        : dev
          ? [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: { modules: false, sourceMap: true },
              },
              postCssLoader,
              sassLoader,
            ]
          : [
              MiniCssExtractPlugin.loader,
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  modules: false,
                  minimize: true,
                },
              },
              postCssLoader,
              sassLoader,
            ],
    });

    if (!isServer && !dev) {
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash:8].css',
          allChunks: true,
        }),
      );
    }
    /** @endconfig */

    // add ./src to module resolver so you can import modules with absolute path
    config.resolve.modules.push('src');

    config.devtool = dev ? 'eval-source-map' : 'none';

    return config;
  },
};
