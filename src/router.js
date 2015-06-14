'use strict'

// import app from 'ampersand-app'
import React from 'react'
import Router from 'react-router'

import Home from './components/home.js'
// import FourOhFour from './components/main/fourOhFour.js'
import FaunaTreeLevel1 from './components/menu/tree/faunaLevel1.js'
import S2 from './components/menu/tree/s2.js'
import S3 from './components/menu/tree/s3.js'
import S4 from './components/menu/tree/s4.js'
import Objekt from './components/main/object/object.js'

const DefaultRoute = Router.DefaultRoute
const NotFoundRoute = Router.NotFoundRoute
const Route = Router.Route

export default function () {
  const routes = (
    <Route name='home' path='/' handler={Home}>
      <Route name='fauna' path='Fauna' handler={FaunaTreeLevel1}>
        <Route name='s2' path=':s2' handler={S2}>
          <Route name='s3' path=':s3' handler={S3}>
            <Route name='s4' path=':s4' handler={S4}>
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
