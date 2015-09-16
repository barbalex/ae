/**
 * startet die Anwendung, indem der Server gestartet wird
 */

'use strict'

var /*serverOptionsDevelopment = {    // wird nur in Entwicklung genutzt
    debug: {
      log: ['error'],
      request: ['error']
    }
  },*/
  Hapi = require('hapi'),
  Inert = require('inert'),
  server = new Hapi.Server()

server.register(Inert, () => {
  server.connection({
    host: '0.0.0.0',
    port: 8080
  })

  server.start(function (err) {
    if (err) {
      throw err
    }
    console.log('Server running at:', server.info.uri)
  })

  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.file('index.html')
    }
  })

  server.route({
    method: 'GET',
    path: '/index.html',
    handler: function (request, reply) {
      reply.file('index.html')
    }
  })

  // serve all static files in the root directory
  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: './'
      }
    }
  })

  // show 404 page if file not found
  server.ext('onPreResponse', function (request, reply) {
    if (request.response.isBoom) {
      // Inspect the response here, see if it's a 404
      if (request.response.output.statusCode === 404) {
        // let index.html handle this
        return reply.file('index.html')
      } else {
        return reply.redirect('/')
      }
    }
    return reply.continue()
  })
})
