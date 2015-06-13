'use strict'

// import app from 'ampersand-app'
import React from 'react'
import Router from 'react-router'

import Home from './components/home.js'
import Objekt from './components/main/object/object.js'
import FourOhFour from './components/main/fourOhFour.js'
import FaunaTreeLevel1 from './components/menu/tree/faunaLevel1.js'
import S2 from './components/menu/tree/s2.js'
import S3 from './components/menu/tree/s3.js'
import S4 from './components/menu/tree/s4.js'

const DefaultRoute = Router.DefaultRoute
const NotFoundRoute = Router.NotFoundRoute
const Route = Router.Route
const RouteHandler = Router.RouteHandler

export default function () {

  const routes = (
    <Route name='home' path='/' handler={Home}>
      <Route name='fauna' path='/Fauna' handler={FaunaTreeLevel1}/>
      <Route name='s2' path='/Fauna/:s2' handler={S2}/>
      <Route name='s3' path='/Fauna/:s2/:s3' handler={S3}/>
      <Route name='s4' path='/Fauna/:s2/:s3/:s4' handler={S4}/>
      {/*<Route name='s5' path='/:s1/:s2/:s3/:s4/:s5' handler={Objekt}/>*/}
      <RouteHandler/>
      {/*<DefaultRoute handler={Home}/>*/}
      <NotFoundRoute handler={FourOhFour}/>
    </Route>
  )

  const router = Router.create({
    routes: routes,
    location: Router.HistoryLocation
  })

  router.run(function (Handler, state) {
    React.render(<Handler/>, document.body)
    // app.Actions.transition(state.params)
  })

  window.router = router
}
