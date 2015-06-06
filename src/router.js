'use strict'

import React from 'react'
import Router from 'react-router'
// import Favicon from 'react-favicon'
import MenuButton from './components/menuButton'
import Menu from './components/menu'

// const DefaultRoute = Router.DefaultRoute
// const NotFoundRoute = Router.NotFoundRoute
// const Link = Router.Link
const Route = Router.Route
const RouteHandler = Router.RouteHandler

export default function () {
  const App = React.createClass({
    displayName: 'HomePage',

    render () {
      return (
        <div>
          <MenuButton/>
          <Menu/>
          <RouteHandler/>
        </div>
      )
    }
  })

  const routes = (
    <Route handler={App} path='/'>
    </Route>
  )

  Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>, document.body)
  })
}