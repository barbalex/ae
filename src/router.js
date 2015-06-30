'use strict'

// import app from 'ampersand-app'
import React from 'react'
import Router from 'react-router'

import Home from './components/home.js'
// import FourOhFour from './components/main/fourOhFour.js'
// import Objekt from './components/main/object/object.js'
import TreeFromHierarchyObject from './components/menu/treeFromHierarchyObject.js'

// const DefaultRoute = Router.DefaultRoute
// const NotFoundRoute = Router.NotFoundRoute
const Route = Router.Route

export default function () {
  const routes = (
    <Route name='home' path='/' handler={Home}>
      <Route name='gruppe' path='/*' handler={TreeFromHierarchyObject}/>
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
