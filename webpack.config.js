'use strict'

const getConfig = require('hjs-webpack')
const webpack = require('webpack')

const config = getConfig({
  in: 'src/app.js',
  out: 'public',
  isDev: process.env.NODE_ENV !== 'production',
  /*
  // here you can configure you local machine hostname
  // and share it with other devices on your network
  // hm. worked on computer but not on mobile
  hostname: 'alex.local'*/
})

config.module.loaders.push(
  {
    test: /\.jsx?$/,
    exclude: /(node_modules)/,
    loader: 'babel'
  }
)

config.plugins.push(
  new webpack.ProvidePlugin({
    fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
  })
)

// need to add this so request can load
// see: https://github.com/request/request/issues/1529
config.node = {
  console: true,
  fs: 'empty',
  net: 'empty',
  tls: 'empty'
}

module.exports = config
