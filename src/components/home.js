'use strict'

import React from 'react'
import Main from './main/main.js'
import Menu from './menu/menu.js'
import FaviconImage from '../../img/aster_144.png'
import Favicon from 'react-favicon'

export default React.createClass({
  displayName: 'Home',

  render () {
    return (
      <div>
        <Favicon url={[FaviconImage]}/>
        <Menu/>
        <Main/>
      </div>
    )
  }
})
