var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.config.common.js');
var ngw = require('@ngtools/webpack');

const path = require('path');

const API_ROOT = 'https://api.mynoteswebsite.com';
const STAGE = '/v1';
const METADATA = webpackMerge(commonConfig.metadata, {
  API_ROOT: API_ROOT,
  STAGE: STAGE
});

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    'app': './src/app/main.aot.ts'
  },
  output: {
    path: path.resolve(__dirname, './public/scripts/app'),
    publicPath: '/scripts/app',
    filename: 'bundle.js',
    chunkFilename: '[id].[hash].chunk.js'
  },
  module: {
    rules: [
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loader: '@ngtools/webpack'
      },
      {
        test: /\.ts$/,
        use: [
          { loader: 'awesome-typescript-loader' },
          { loader: 'angular2-template-loader' },
          // {loader: 'angular-router-loader?aot=true'}
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'API_ROOT': JSON.stringify(METADATA.API_ROOT),
      'STAGE': JSON.stringify(METADATA.STAGE)
    }),
    new ngw.AngularCompilerPlugin({
      tsConfigPath: './tsconfig.aot.json',
      entryModule: './src/app/app.module#AppModule'
    })
  ]
});
