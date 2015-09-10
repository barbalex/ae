'use strict'

import app from 'ampersand-app'
import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Email',

  propTypes: {
    email: React.PropTypes.string
  },

  onClickAbmelden () {
    console.log('abmelden clicked')
    app.Actions.login({
      logIn: false,
      email: null
    })
  },

  onClickAnmelden () {
    const loginVariables = {
      logIn: true,
      email: undefined
    }
    app.Actions.login(loginVariables)
  },

  render () {
    const { email } = this.props
    const popoverStyle = {
      cursor: 'pointer'
    }

    if (email) {
      return (
        <OverlayTrigger
          trigger='click'
          placement='left'
          rootClose={true}
          overlay={<Popover arrowOffsetTop='10' onClick={this.onClickAbmelden}><p style={popoverStyle}>abmelden</p></Popover>}>
          <div id='email' className='symbols link'>{email}</div>
        </OverlayTrigger>
      )
    }
    return (
      <OverlayTrigger
        trigger='click'
        placement='left'
        rootClose={true}
        overlay={<Popover arrowOffsetTop='10' onClick={this.onClickAnmelden}><p style={popoverStyle}>anmelden</p></Popover>}>
        <div id='email' className='symbols link'>nicht angemeldet</div>
      </OverlayTrigger>
    )
  }
})
