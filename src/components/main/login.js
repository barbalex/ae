/*
 * contains ui for a login/signup modal
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Input, Alert, Button } from 'react-bootstrap'
import validateEmail from '../../modules/validateEmail.js'

export default React.createClass({
  displayName: 'Login',

  propTypes: {
    invalidEmail: React.PropTypes.bool,
    invalidPassword: React.PropTypes.bool,
    email: React.PropTypes.string,
    password: React.PropTypes.string,
    loginError: React.PropTypes.string
  },

  getInitialState () {
    return {
      invalidEmail: false,
      invalidPassword: false,
      email: null,
      password: null,
      loginError: null
    }
  },

  componentDidMount () {
    document.body.addEventListener('keydown', this.onKeyDown)
  },

  componentWillUnMount () {
    document.body.removeEventListener('keydown', this.onKeyDown)
  },

  onHide () {
    // weird things happen if this is not here ???!!!
    // console.log('onHide')
  },

  onKeyDown (event) {
    const enter = 13
    if (event.keyCode === enter) {
      // if enter was pressed in one of the fields,
      // update the value first
      const targetId = event.target.id
      const value = event.target.value
      switch (targetId) {
      case 'email':
        const email = value
        this.setState({ email }, this.onClickLogin())
        break
      case 'password':
        const password = value
        this.setState({ password }, this.onClickLogin())
        break
      default:
        this.onClickLogin()
      }
    }
  },

  onClickLogin () {
    const { email, password } = this.state
    if (this.validSignin()) {
      app.remoteDb.login(email, password)
        .then((response) => app.Actions.login({
            logIn: false,
            email: email
          })
        )
        .catch((error) => this.setState({ email: null, loginError: error }))
    }
  },

  onBlurEmail (event) {
    const email = event.target.value
    this.setState({ email })
    this.validEmail(email)
  },

  onBlurPassword (event) {
    const password = event.target.value
    this.setState({ password })
  },

  onAlertDismiss () {
    this.setState({ loginError: null })
  },

  schliessen () {
    app.Actions.login({logIn: false})
    // TODO: how navigate back? history.back() only backs the url
    // console.log('document.referrer:', document.referrer)
    // window.history.back()
    // app.router.reload()
  },

  validEmail (email) {
    email = email || this.state.email
    const validEmail = email && validateEmail(email)
    const invalidEmail = !validEmail
    this.setState({ invalidEmail })
    return validEmail
  },

  validPassword (password) {
    password = password || this.state.password
    const validPassword = !!password
    const invalidPassword = !validPassword
    this.setState({ invalidPassword })
    return validPassword
  },

  validSignin () {
    const validEmail = this.validEmail()
    const validPassword = this.validPassword()
    return validEmail && validPassword
  },

  render () {
    const { invalidEmail, invalidPassword, loginError } = this.state
    const emailInputBsStyle = invalidEmail ? 'error' : null
    const passwordInputBsStyle = invalidPassword ? 'error' : null
    const styleAlert = {
      marginBottom: 8
    }

    return (
      <div className='static-modal'>
        <Modal.Dialog onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>Anmelden</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form className={'form'} autoComplete='off'>
              <p className='anmelden'>Für diese Funktion müssen Sie angemeldet sein.<br/><a href='mailto:alex@gabriel-software.ch'>Mailen Sie mir</a>, um ein Login zu erhalten.</p>
              <div className='formGroup'>
                <Input type='email' id='email' label={'Email'} bsSize='small' className={'controls'} placeholder='Email' bsStyle={emailInputBsStyle} onBlur={this.onBlurEmail} required autoFocus />
                {invalidEmail ? <div className='validateDivAfterRBC'>Bitte Email prüfen</div> : ''}
              </div>
              <div className='formGroup'>
                <Input type='password' id='password' label={'Passwort'} className={'controls'} placeholder='Passwort' bsStyle={passwordInputBsStyle} onBlur={this.onBlurPassword} required />
                {invalidPassword ? <div className='validateDivAfterRBC'>Bitte Passwort prüfen</div> : ''}
              </div>
              {loginError ? <Alert bsStyle='danger' onDismiss={this.onAlertDismiss} style={styleAlert}>Fehler beim Anmelden: {loginError}</Alert> : ''}
              <p className='Passwort' style={{'marginBottom': -5 + 'px'}}>Passwort vergessen?<br/><a href='mailto:alex@gabriel-software.ch'>Mailen Sie mir</a>, möglichst mit derselben email-Adresse, die Sie für das Konto verwenden.</p>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button ref='anmeldenButton' className='btn-primary' onClick={this.onClickLogin}>anmelden</Button>
            <Button onClick={this.schliessen}>schliessen</Button>
          </Modal.Footer>

        </Modal.Dialog>
      </div>
    )
  }
})
