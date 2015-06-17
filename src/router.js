'use strict'

// import app from 'ampersand-app'
import React from 'react'
import Router from 'react-router'

import Home from './components/home.js'
// import FourOhFour from './components/main/fourOhFour.js'
import FaunaL1Klassen from './components/menu/tree/faunaL1Klassen.js'
import FaunaL2Ordnungen from './components/menu/tree/faunaL2Ordnungen.js'
import FaunaL3Familien from './components/menu/tree/faunaL3Familien.js'
import FaunaL4Arten from './components/menu/tree/faunaL4Arten.js'
import Objekt from './components/main/object/object.js'
import TreeFromHierarchyObject from './components/menu/tree/treeFromHierarchyObject.js'

const DefaultRoute = Router.DefaultRoute
const NotFoundRoute = Router.NotFoundRoute
const Route = Router.Route

export default function () {
  const routes = (
    <Route name='home' path='/' handler={Home}>
      <Route name='fauna' path='Fauna' handler={FaunaL1Klassen}>
        <Route name='FaunaL2Ordnungen' path=':faunaL2Ordnung' handler={FaunaL2Ordnungen}>
          <Route name='faunaL3Familie' path=':faunaL3Familie' handler={FaunaL3Familien}>
            <Route name='faunaL4Art' path=':faunaL4Art' handler={FaunaL4Arten}>
              <Route name='faunaL5Objekt' path=':faunaL5Objekt' handler={Objekt}/>
            </Route>
          </Route>
        </Route>
        /*<Route name='gruppe' path=':gruppe' handler={TreeFromHierarchyObject}>
          <Route name='object' path=':guid' handler={TreeFromHierarchyObject}/>
        </Route>*/
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
  })

  window.router = router
}
