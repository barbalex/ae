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

// need to add this so request can load
// see: https://github.com/request/request/issues/1529
config.node = {
  // console: 'empty',
  fs: 'empty',
  net: 'empty',
  tls: 'empty'
}

module.exports = config
