const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function () {
  const env = process.env;

  const nodeEnv = env.NODE_ENV || 'development';
  const isProduction = nodeEnv === 'production';

  const config = {};

  config.mode = isProduction ? 'production' : 'development';

  config.entry = {
    main: ['./src/index.tsx'],
  };

  config.output = {
    path: path.resolve(__dirname, '../server/public/dist'),
    filename: '[name].js',
    chunkFilename: '[name].bundle.[contenthash].js',
    publicPath: '/dist/',
    pathinfo: !isProduction,
  };

  config.optimization = {
    emitOnErrors: true, // NoEmitOnErrorsPlugin
  };

  if (isProduction) {
    config.optimization.minimizer = [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
          ecma: 6,
          mangle: true,
          format: { comments: false },
        },
      }),
    ];
  } else {
    config.devtool = 'source-map';
  }

  config.module = {};

  config.module.rules = [
    {
      test: [/\.ts?$/, /\.tsx?$/],
      use: ['ts-loader'],
      exclude: /node_modules/,
    },
  ];

  config.resolve = {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  };

  config.devServer = {
    hot: true,
    historyApiFallback: true,
    static: [path.resolve(__dirname, 'public')],
    port: 8080,
  };

  return config;
};
