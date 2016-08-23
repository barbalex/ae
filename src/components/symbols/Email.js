import app from 'ampersand-app'
import React from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Email',

  propTypes: {
    email: React.PropTypes.string
  },

  /**
   * this is needed to close the menu if user clicks outside of the dropdown
   */
  onClickDocument() {
    let { open } = this.state
    if (open) {
      open = !open
      this.setState({ open })
      document.removeEventListener('click', this.onClickDocument)
    }
  },

  refreshRoles() {
    const { email } = this.props
    // TODO: call action to refresh user roles
  },

  abmelden() {
    app.Actions.login({
      logIn: false,
      email: null
    })
    this.setState({ open: false })
    document.removeEventListener('click', this.onClickDocument)
  },

  anmelden() {
    console.log('click')
    const logIn = true
    const email = undefined  // eslint-disable-line
    app.Actions.login({ logIn, email })
    this.setState({ open: false })
    document.removeEventListener('click', this.onClickDocument)
  },

  render() {
    const { email } = this.props

    if (email) {
      return (
        <DropdownButton
          id="emailDropdown"
          title={email}
          pullRight
        >
          <MenuItem
            onSelect={this.abmelden}
          >
            abmelden
          </MenuItem>
          <MenuItem
            onSelect={this.refreshRoles}
          >
            Benutzerrechte aktualisieren
          </MenuItem>
        </DropdownButton>
      )
    }
    return (
      <DropdownButton
        id="dropdownEmail"
        title="nicht angemeldet"
        bsStyle="link"
        pullRight
      >
        <MenuItem
          onSelect={this.anmelden}
        >
          anmelden
        </MenuItem>
      </DropdownButton>
    )
  }
})
