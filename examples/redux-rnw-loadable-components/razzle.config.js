const path = require('path');
const fs = require('fs');
const autoprefixer = require('autoprefixer');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PostCssFlexBugFixes = require('postcss-flexbugs-fixes');

const envDefinition = (target) => {
  const env = {
    __SERVER__: true,
    __CLIENT__: true,
    __DEVELOPMENT__: true,
    __DEVTOOLS__: true,
  };

  if (target === 'web') {
    return Object.assign({}, env, {
      __SERVER__: false,
    });
  }

  return Object.assign({}, env, {
    __CLIENT__: false,
  });
};

// const babelrcGenerator = (target) => {
//   const babelrc = fs.readFileSync('./.babelrc');
//   let babelrcObject = {};

//   try {
//     babelrcObject = JSON.parse(babelrc);
//   } catch (err) {
//     // console.error('==>     ERROR: Error parsing your .babelrc.');
//     throw err;
//   }

//   const babelrcObjectTarget =
//     (babelrcObject.env && babelrcObject.env[target]) || {};

//   // merge global and dev-only plugins
//   let combinedPlugins = babelrcObject.plugins || [];
//   combinedPlugins = combinedPlugins
//     .concat(babelrcObjectTarget.plugins)
//     .filter(Boolean);

//   const babelLoaderQuery = Object.assign(
//     {},
//     babelrcObjectTarget,
//     babelrcObject,
//     { plugins: combinedPlugins }
//   );
//   delete babelLoaderQuery.env;

//   return babelLoaderQuery;
// };

module.exports = {
  modify(defaultConfig, { target, dev }, webpack) {
    const config = Object.assign({}, defaultConfig);

    const isServer = target !== 'web';

    config.plugins = [
      ...config.plugins,
      new webpack.DefinePlugin(envDefinition(target)),
    ];

    // config.module.rules[1].use[0].options = {
    //   babelrc: false,
    //   cacheDirectory: true,
    //   ...babelrcGenerator(target),
    // };

    // console.log(JSON.stringify(config.module.rules[1], null, 2));

    const postCssLoader = {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          PostCssFlexBugFixes,
          autoprefixer({
            browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
            flexbox: 'no-2009',
          }),
        ],
      },
    };

    const sassLoader = {
      loader: require.resolve('sass-loader'),
      options: {
        includePaths: [path.resolve(__dirname, 'node_modules')],
      },
    };

    /* eslint-disable */
    config.module.rules = [
      ...config.module.rules,
      {
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
      },
    ];
    /* eslint-enable */

    config.resolve.modules = [...config.resolve.modules, 'src'];

    if (!isServer) {
      if (!dev) {
        config.optimization.minimizer = [
          ...config.optimization.minimizer,
          new OptimizeCSSAssetsPlugin({}),
        ];
      } else {
        config.plugins = [
          ...config.plugins,
          // new BundleAnalyzerPlugin(),
        ];
      }
    }

    if (!dev) {
      config.plugins = [
        ...config.plugins,
        new MiniCssExtractPlugin({
          filename: `styles/[name].css`,
          allChunks: true,
        }),
        new LodashModuleReplacementPlugin({
          collections: true,
          shorthands: true,
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
      ];
    }

    return Object.assign({}, config, {
      devtool: dev ? 'eval-source-map' : 'none',
    });
  },
};
