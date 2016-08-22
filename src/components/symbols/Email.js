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

  toggleDropdown() {
    let { open } = this.state
    open = !open
    this.setState({ open })
    // this is needed to close the menu if user clicks outside of the dropdown
    if (open) document.addEventListener('click', this.onClickDocument)
    console.log('click')
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
        <div
          className="dropdown"
          id="emailDropdown"
          className={css(styles.dropdown)}
        >
          <button
            id="emailDropdownButton"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            className={css(styles.emailP)}
            onClick={this.toggleDropdown}
          >
            {email}
            <span className="caret" />
          </button>
          <ul
            className="dropdown-menu dropdown-menu-right"
            aria-labelledby="emailDropdownButton"
          >
            <li
              onSelect={this.abmelden}
            >
              abmelden
            </li>
            <li
              onSelect={this.refreshRoles}
            >
              Benutzerrechte aktualisieren
            </li>
          </ul>
        </div>
      )
    }
    return (
      <div
        className="dropdown"
        id="emailDropdown"
      >
        <a
          id="emailDropdownButton"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          className={css(styles.emailP)}
          onClick={this.toggleDropdown}
          data-target="#"
        >
          nicht angemeldet
          <span className="caret" />
        </a>
        <ul
          className="dropdown-menu"
          aria-labelledby="emailDropdownButton"
        >
          <li
            onClick={this.anmelden}
          >
            <a href="#">anmelden</a>
          </li>
        </ul>
      </div>
    )
  }
})
