'use strict'

import React from 'react'
import MenuButton from '../src/components/menuButton'
import Menu from '../src/components/menu'

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