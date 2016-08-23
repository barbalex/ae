import app from 'ampersand-app'
import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  emailP: {
    textDecoration: 'underline',
    paddingLeft: 5,
    paddingRight: 5,
    cursor: 'pointer'
  }
})

export default React.createClass({
  displayName: 'Email',

  propTypes: {
    email: React.PropTypes.string,
    open: React.PropTypes.bool
  },

  getInitialState() {
    return {
      open: false
    }
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

  onToggle() {
    // react-bootstrap wants this to exist...
  },

  toggleDropdown() {
    let { open } = this.state
    open = !open
    this.setState({ open })
    // this is needed to close the menu if user clicks outside of the dropdown
    if (open) document.addEventListener('click', this.onClickDocument)
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
    const logIn = true
    const email = undefined  // eslint-disable-line
    app.Actions.login({ logIn, email })
    this.setState({ open: false })
    document.removeEventListener('click', this.onClickDocument)
  },

  render() {
    const { email } = this.props
    const { open } = this.state

    if (email) {
      return (
        <Dropdown
          id="emailDropdown"
          open={open}
          onToggle={this.onToggle}
          className={css(styles.dropdown)}
        >
          <p
            bsRole="toggle"
            className={css(styles.emailP)}
            onClick={this.toggleDropdown}
          >
            {email}
          </p>
          <div
            bsRole="menu"
            className="dropdown-menu dropdown-menu-right"
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
          </div>
        </Dropdown>
      )
    }
    return (
      <Dropdown
        id="emailDropdown"
        open={open}
        onToggle={this.onToggle}
      >
        <p
          bsRole="toggle"
          className={css(styles.emailP)}
          onClick={this.toggleDropdown}
        >
          nicht angemeldet
        </p>
        <div
          bsRole="menu"
          className="dropdown-menu"
        >
          <MenuItem
            onSelect={this.anmelden}
          >
            anmelden
          </MenuItem>
        </div>
      </Dropdown>
    )
  }
})
