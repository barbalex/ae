'use strict'

import React from 'react'
import Router from 'react-router'
import Favicon from 'react-favicon'
import MenuButton from './components/menuButton'
import Menu from './components/menu/menu.js'
import FourOhFourPage from './components/form/fourOhFour.js'
import EmptyPage from './components/form/empty.js'
import ObjectPage from './components/form/object/object.js'
import FaviconImage from '../img/aster_144.png'

const DefaultRoute = Router.DefaultRoute
const NotFoundRoute = Router.NotFoundRoute
const Route = Router.Route
const RouteHandler = Router.RouteHandler

export default function () {
  const App = React.createClass({
    displayName: 'HomePage',

    render () {
      return (
        <div>
          <Favicon url={[FaviconImage]}/>
          <MenuButton/>
          <Menu/>
          <RouteHandler/>
        </div>
      )
    }
  })

  const routes = (
    <Route handler={App} path='/'>
      <DefaultRoute handler={EmptyPage}/>
      <NotFoundRoute handler={FourOhFourPage}/>
    </Route>
  )

  Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>, document.body)
  })
}
