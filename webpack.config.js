'use strict'

var getConfig = require('hjs-webpack')

var config = getConfig({
  in: 'src/app.js',
  out: 'public',
  isDev: process.env.NODE_ENV !== 'production' /*,
  // here you can configure you local machine hostname
  // and share it with other devices on your network
  // hm. worked on computer but not on mobile
  hostname: 'alex.local'*/
})

config.module.loaders.push(
  // bootstraps font-awesome files need this to load in webpack
  // the url-loader uses DataUrls.
  // the file-loader emits files.
  {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
  {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
  {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
  {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml'},
  {
    test: /\.jsx?$/,
    exclude: /(node_modules)/,
    loader: 'babel',
    query: {
      presets: ['es2015', 'react', 'stage-2']
    }
  }
)

// need to add this so request can load
// see: https://github.com/request/request/issues/1529
config.node = {
  fs: 'empty',
  net: 'empty',
  tls: 'empty'
}

module.exports = config
