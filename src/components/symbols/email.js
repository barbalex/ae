'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Email',

  propTypes: {
    email: React.PropTypes.string,
    open: React.PropTypes.bool
  },

  getInitialState () {
    return {
      open: false
    }
  },

  toggleDropdown () {
    let { open } = this.state
    open = !open
    this.setState({ open })
    // this is needed to close the menu if user clicks outside of the dropdown
    if (open) document.addEventListener('click', this.onClickDocument)
  },

  abmelden () {
    app.Actions.login({
      logIn: false,
      email: null
    })
    this.setState({ open: false })
    document.removeEventListener('click', this.onClickDocument)
  },

  anmelden () {
    const loginVariables = {
      logIn: true,
      email: undefined
    }
    app.Actions.login(loginVariables)
    this.setState({ open: false })
    document.removeEventListener('click', this.onClickDocument)
  },

  /**
   * this is needed to close the menu if user clicks outside of the dropdown
   */
  onClickDocument () {
    let { open } = this.state
    if (open) {
      open = !open
      this.setState({ open })
      document.removeEventListener('click', this.onClickDocument)
    }
  },

  onToggle () {
    // react-bootstrap wants this to exist...
  },

  render () {
    const { email } = this.props
    const { open } = this.state

    if (email) {
      return (
        <Dropdown id='emailDropdown' open={open} onToggle={this.onToggle}>
          <p bsRole='toggle' className='symbols link' onClick={this.toggleDropdown}>
            {email}
          </p>
          <div bsRole='menu' className='dropdown-menu'>
            <MenuItem onSelect={this.abmelden}>abmelden</MenuItem>
          </div>
        </Dropdown>
      )
    }
    return (
      <Dropdown id='emailDropdown' open={open} onToggle={this.onToggle}>
        <p bsRole='toggle' className='symbols link' onClick={this.toggleDropdown}>
          nicht angemeldet
        </p>
        <div bsRole='menu' className='dropdown-menu'>
          <MenuItem onSelect={this.anmelden}>anmelden</MenuItem>
        </div>
      </Dropdown>
    )
  }
})
