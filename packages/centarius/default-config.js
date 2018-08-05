const path = require('path');

module.exports = {
  libraryName: 'centarius',
  watch: process.env.ENV === 'development',
  defaultConfig: {
    context: __dirname,
    mode: 'production',
    entry: {
      index: path.resolve('./src/index.js'),
      client: path.resolve('./src/client/index.js'),
      core: path.resolve('./src/core/index.js'),
      document: path.resolve('./src/document/index.js'),
      server: path.resolve('./src/server/index.js'),
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: [
            path.resolve('./src'),
            path.resolve('./node_modules/react-tree-walker'),
          ],
          exclude: /node_modules\//,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    resolve: {
      modules: ['node_modules', './src'],
      alias: {
        'react-native': 'react-native-web',
      },
      extensions: ['.js', '.jsx'],
    },
    devtool: 'none',
    externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
      ReactDOM: {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
      'react-native': {
        root: 'react-native',
        commonjs2: 'react-native',
        commonjs: 'react-native',
        amd: 'react-native',
      },
      'react-native-web': {
        root: 'react-native-web',
        commonjs2: 'react-native-web',
        commonjs: 'react-native-web',
        amd: 'react-native-web',
      },
    },
  },
};
