'use strict'

import React from 'react'
import { RouteHandler } from 'react-router'

import MenuButton from './menuButton'
import Menu from './menu/menu.js'
import FaviconImage from '../../img/aster_144.png'
import Favicon from 'react-favicon'

export default React.createClass({
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
