'use strict'

// import app from 'ampersand-app'
import React from 'react'
import Router from 'react-router'
import routes from './routes.js'

// return all the router methods
// to build an instance in app
export default {
  getCurrentPath () {
    return router.getCurrentPath()
  },

  makePath (to, params, query) {
    return router.makePath(to, params, query)
  },

  makeHref (to, params, query) {
    return router.makeHref(to, params, query)
  },

  transitionTo (to, params, query) {
    router.transitionTo(to, params, query)
  },

  replaceWith (to, params, query) {
    router.replaceWith(to, params, query)
  },

  goBack () {
    router.goBack()
  },

  run (render) {
    router.run((Handler, state) => {
      render(Handler, state)
    })
  }
}

const router = Router.create({
  routes: routes(),
  location: Router.HistoryLocation
})

router.run(function (Handler, state) {
  React.render(<Handler/>, document.body)
  // app.Actions.transition(state.params)
})
