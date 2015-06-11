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

export default function createRouter () {
  const Appy = React.createClass({
    displayName: 'Appy',

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
    <Route name='start' path='/' handler={Appy}>
      <Route name='s1' path='/:s1' handler={S1}/>
      <Route name='s2' path='/:s1/:s2' handler={S2}/>
      <Route name='s3' path='/:s1/:s2/:s3' handler={S3}/>
      <Route name='s4' path='/:s1/:s2/:s3/:s4' handler={S4}/>
      <Route name='faunaObjekt' path='/:s1/:s2/:s3/:s4/:s5' handler={Objekt}/>
      <DefaultRoute handler={Empty}/>
      <NotFoundRoute handler={FourOhFour}/>
    </Route>
  )

  const router = Router.create({
    routes: routes,
    location: Router.HistoryLocation
  })

  router.run(function (Handler, state) {
    React.render(<Handler/>, document.body)
    app.Actions.transition(state.params)
  })

  // make router accessible te enable transitionTo
  // see: http://rackt.github.io/react-router/#Router.create
  window.router = router
}
