'use strict'

import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Email',

  propTypes: {
    email: React.PropTypes.string
  },

  onClickAbmelden () {
    console.log('abmelden clicked')
  },

  render () {
    const { email } = this.props

    if (email) {
      return (
        <OverlayTrigger
          trigger='click'
          placement='left'
          overlay={
            <Popover arrowOffsetTop='10' onClick={this.onClickAbmelden}><p>abmelden</p></Popover>
          }>
          <div id='email' className='symbols link'>{email}</div>
        </OverlayTrigger>
      )
    }
    return <div id='email' className='symbols'>nicht angemeldet</div>
  }
})
