'use strict'

import React from 'react'

import Favicon from 'react-favicon'
import MenuButton from './menuButton'
import Menu from './menu/menu.js'
import Objekt from './main/object/object.js'

import FaviconImage from '../../img/aster_144.png'

export default React.createClass({
  displayName: 'Home',

  render () {
    return (
      <div>
        <Favicon url={[FaviconImage]}/>
        <MenuButton/>
        <Menu/>
        <Objekt/>
      </div>
    )
  }
})
