'use strict'

import React from 'react'
import Router from 'react-router'
import FourOhFour from './components/main/fourOhFour.js'
import Empty from './components/main/empty.js'
import Home from './components/home.js'
import Fauna from './components/menu/treeFauna/fauna.js'
import FaunaKlasse from './components/menu/treeFauna/faunaKlasse.js'
import FaunaOrdnung from './components/menu/treeFauna/faunaOrdnung.js'
import FaunaFamilie from './components/menu/treeFauna/faunaFamilie.js'

import Objekt from './components/main/object/object.js'

const DefaultRoute = Router.DefaultRoute
const NotFoundRoute = Router.NotFoundRoute
const Route = Router.Route
const RouteHandler = Router.RouteHandler

export default function createRouter () {
  const App = React.createClass({
    displayName: 'App',

    render () {
      return (
        <div>
          <RouteHandler/>
        </div>
      )
    }
  })

  const routes = (
    <Route name='start' handler={App}>
      <Route name='home' path='/' handler={Home}/>
      <Route name='fauna' path='/fauna' handler={Fauna}/>
      <Route name='faunaKlasse' path='/fauna/:klasse' handler={FaunaKlasse}/>
      <Route name='faunaOrdnung' path='/fauna/:klasse/:ordnung' handler={FaunaOrdnung}/>
      <Route name='faunaFamilie' path='/fauna/:klasse/:ordnung/:familie' handler={FaunaFamilie}/>
      <Route name='faunaObjekt' path='/fauna/:klasse/:ordnung/:familie/:objekt' handler={Objekt}/>
      <DefaultRoute handler={Empty}/>
      <NotFoundRoute handler={FourOhFour}/>
    </Route>
  )

  const router = Router.create({
    routes: routes,
    location: Router.HistoryLocation
  })

  router.run(function (Handler) {
    React.render(<Handler/>, document.body)
  })

  // make router accessible te enable transitionTo
  // see: http://rackt.github.io/react-router/#Router.create
  window.router = router
}
