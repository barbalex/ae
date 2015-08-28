'use strict'

var getConfig = require('hjs-webpack')
// var webpack = require('webpack')

var config = getConfig({
  in: 'src/app.js',
  out: 'public',
  isDev: process.env.NODE_ENV !== 'production' /*,
  // here you can configure you local machine hostname
  // and share it with other devices on your network
  // hm. worked on computer but not on mobile
  hostname: 'alex.local'*/
})

// need to add this so request can load
// see: https://github.com/request/request/issues/1529
config.node = {
  // console: 'empty',
  fs: 'empty',
  net: 'empty',
  tls: 'empty'
}

/*config.loaders = [
  {
    test: /jquery\..*\.js/,
    loader: 'file-loader?$=jquery,jQuery=jquery,this=>window'
  }
]*/

/*const plugin = new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  'window.jQuery': 'jquery'
})

config.plugins.push(plugin)*/

module.exports = config
