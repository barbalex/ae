'use strict'

import app from 'ampersand-app'
import React from 'react'
import Router from 'react-router'

import Favicon from 'react-favicon'
import MenuButton from './components/menuButton'
import Menu from './components/menu/menu.js'
import Objekt from './components/main/object/object.js'
import FourOhFour from './components/main/fourOhFour.js'
import Empty from './components/main/empty.js'
import S1 from './components/menu/tree/s1.js'
import S2 from './components/menu/tree/s2.js'
import S3 from './components/menu/tree/s3.js'
import S4 from './components/menu/tree/s4.js'
import FaviconImage from '../img/aster_144.png'

const DefaultRoute = Router.DefaultRoute
const NotFoundRoute = Router.NotFoundRoute
const Route = Router.Route
const RouteHandler = Router.RouteHandler

const Apphandler = React.createClass({
  displayName: 'Apphandler',

  render () {
    return (
      <div>
        <Favicon url={[FaviconImage]}/>
        <MenuButton/>
        <Menu/>
        {/*<Objekt/>*/}
        <RouteHandler/>
      </div>
    )
  }
})

const routes = (
  <Route name='start' path='/' handler={Apphandler}>
    <Route name='s1' path='/:s1' handler={S1}/>
    <Route name='s2' path='/:s1/:s2' handler={S2}/>
    <Route name='s3' path='/:s1/:s2/:s3' handler={S3}/>
    <Route name='s4' path='/:s1/:s2/:s3/:s4' handler={S4}/>
    <Route name='s5' path='/:s1/:s2/:s3/:s4/:s5' handler={Objekt}/>
    <DefaultRoute handler={Empty}/>
    <NotFoundRoute handler={FourOhFour}/>
  </Route>
)

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
  routes: routes,
  location: Router.HistoryLocation
})

router.run(function (Handler, state) {
  React.render(<Handler/>, document.body)
  // app.Actions.transition(state.params)
})
