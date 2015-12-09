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

  onHide () {
    // weird things happen if this is not here ???!!!
    // console.log('onHide')
  },

  onKeyDownEmail (event) {
    const { password } = this.state
    const enter = 13
    if (event.keyCode === enter) {
      // if enter was pressed, update the value first
      const email = event.target.value
      this.setState({ email })
      this.checkSignin(email, password)
    }
  },

  onKeyDownPassword (event) {
    const { email } = this.state
    const enter = 13
    if (event.keyCode === enter) {
      // if enter was pressed, update the value first
      const password = event.target.value
      this.setState({ password })
      this.checkSignin(email, password)
    }
  },

  checkSignin (email, password) {
    if (this.validSignin(email, password)) {
      app.remoteDb.login(email, password)
        .then((response) => app.Actions.login({
          logIn: false,
          email: email
        }))
        .catch((error) => this.setState({ email: null, loginError: error }))
    }
  },

  onClickLogin () {
    const { email, password } = this.state
    this.checkSignin(email, password)
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
    app.Actions.login({ logIn: false })
  },

  validEmail (email) {
    const validEmail = email && validateEmail(email)
    const invalidEmail = !validEmail
    this.setState({ invalidEmail })
    return validEmail
  },

  validPassword (password) {
    const validPassword = !!password
    const invalidPassword = !validPassword
    this.setState({ invalidPassword })
    return validPassword
  },

  validSignin (email, password) {
    const validEmail = this.validEmail(email)
    const validPassword = this.validPassword(password)
    return validEmail && validPassword
  },

  render () {
    const { invalidEmail, invalidPassword, loginError } = this.state
    const emailInputBsStyle = invalidEmail ? 'error' : null
    const passwordInputBsStyle = invalidPassword ? 'error' : null
    const loginErrorMessage = loginError && loginError.message ? loginError.message : null
    const styleAlert = {
      marginBottom: 8
    }

    console.log('loginError', loginError)

    return (
      <div className='static-modal'>
        <Modal.Dialog
          onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>
              Anmelden
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form
              className={'form'}
              autoComplete='off'>
              <p className='anmelden'>
                Für diese Funktion müssen Sie angemeldet sein.<br/>
                <a href='mailto:alex@gabriel-software.ch'>Mailen Sie mir</a>, um ein Login zu erhalten.
              </p>
              <div
                className='formGroup'>
                <Input
                  type='email'
                  id='email'
                  label={'Email'}
                  bsSize='small'
                  className={'controls'}
                  placeholder='Email'
                  bsStyle={emailInputBsStyle}
                  onBlur={this.onBlurEmail}
                  onKeyDown={this.onKeyDownEmail}
                  required
                  autoFocus />
                {
                  invalidEmail
                  ? <div
                      className='validateDivAfterRBC'>
                      Bitte Email prüfen
                    </div>
                  : null
                }
              </div>
              <div
                className='formGroup'>
                <Input
                  type='password'
                  id='password'
                  label={'Passwort'}
                  className={'controls'}
                  placeholder='Passwort'
                  bsStyle={passwordInputBsStyle}
                  onBlur={this.onBlurPassword}
                  onKeyDown={this.onKeyDownPassword}
                  required />
                {
                  invalidPassword
                  ? <div
                      className='validateDivAfterRBC'>
                      Bitte Passwort prüfen
                    </div>
                  : null
                }
              </div>
              {
                loginErrorMessage
                ? <Alert
                    bsStyle='danger'
                    onDismiss={this.onAlertDismiss}
                    style={styleAlert}>
                    Fehler beim Anmelden: {loginErrorMessage}<br/>
                    Müssen Sie ein Konto erstellen?
                  </Alert>
                : null
              }
              <p
                className='Passwort'
                style={{'marginBottom': -5 + 'px'}}>
                Passwort vergessen?<br/>
                <a href='mailto:alex@gabriel-software.ch'>Mailen Sie mir</a>, möglichst mit derselben email-Adresse, die Sie für das Konto verwenden.
              </p>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button
              ref='anmeldenButton'
              className='btn-primary'
              onClick={this.onClickLogin}>
              anmelden
            </Button>
            <Button
              onClick={this.schliessen}>
              schliessen
            </Button>
          </Modal.Footer>

        </Modal.Dialog>
      </div>
    )
  }
})
