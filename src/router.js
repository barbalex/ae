'use strict'

// import app from 'ampersand-app'
import React from 'react'
import Router from 'react-router'

import Home from './components/home.js'
// import FourOhFour from './components/main/fourOhFour.js'
import FaunaL1Klassen from './components/menu/tree/faunaL1Klassen.js'
import FaunaL2Ordnungen from './components/menu/tree/faunaL2Ordnungen.js'
import S3 from './components/menu/tree/faunaL3Familien.js'
import FaunaL4Arten from './components/menu/tree/faunaL4Arten.js'
import Objekt from './components/main/object/object.js'

const DefaultRoute = Router.DefaultRoute
const NotFoundRoute = Router.NotFoundRoute
const Route = Router.Route

export default function () {
  const routes = (
    <Route name='home' path='/' handler={Home}>
      <Route name='fauna' path='Fauna' handler={FaunaL1Klassen}>
        <Route name='FaunaL2Ordnungen' path=':faunaL2Ordnung' handler={FaunaL2Ordnungen}>
          <Route name='faunaL3Familie' path=':faunaL3Familie' handler={S3}>
            <Route name='faunaL4Art' path=':faunaL4Art' handler={FaunaL4Arten}>
              <Route name='s5' path=':s5' handler={Objekt}/>
            </Route>
          </Route>
        </Route>
      </Route>
      {/*<DefaultRoute handler={Home}/>*/}
      {/*<NotFoundRoute handler={FourOhFour}/>*/}
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
