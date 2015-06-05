'use strict'

import React from 'react'
import MenuButton from '../components/menuButton'
import Menu from '../components/menu'

export default React.createClass({
  displayName: 'HomePage',

  render () {
    return (
      <div>
        <MenuButton/>
        <Menu/>
      </div>
    )
  }
})