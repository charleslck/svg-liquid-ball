import { dist, resolve, src } from './conf';

import baseConfig from './webpack.config.base';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';

export default webpackMerge(baseConfig, {
  devtool: 'source-map',
  entry: {
    index: resolve(src + '/index.js') // 主网站入口
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEV__: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      }
    })
  ]
});
