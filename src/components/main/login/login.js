/*
 * contains ui for a login/signup modal
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Input, Alert, Button } from 'react-bootstrap'
import validateEmail from '../../../modules/validateEmail.js'

export default React.createClass({
  displayName: 'Login',

  propTypes: {
    invalidEmail: React.PropTypes.bool,
    invalidPassword: React.PropTypes.bool,
    invalidPassword2: React.PropTypes.bool,
    email: React.PropTypes.string,
    password: React.PropTypes.string,
    password2: React.PropTypes.string,
    loginError: React.PropTypes.string,
    signUp: React.PropTypes.bool
  },

  getInitialState () {
    return {
      invalidEmail: false,
      invalidPassword: false,
      invalidPassword2: false,
      email: null,
      password: null,
      password2: null,
      loginError: null,
      signUp: false
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

  onKeyDownPassword2 (event) {
    const enter = 13
    if (event.keyCode === enter) this.onClickSignup()
  },

  logIn (email, password) {
    app.remoteDb.login(email, password)
      .then((response) => app.Actions.login({
        logIn: false,
        email: email,
        roles: response.roles
      }))
      .catch((error) => this.setState({ loginError: error }))
  },

  checkSignin (email, password) {
    if (this.isSigninValid(email, password)) this.logIn(email, password)
  },

  onClickWantToSignup (event) {
    if (event && event.preventDefault) event.preventDefault()
    this.setState({ signUp: true })
  },

  onClickSignup () {
    const { email, password, password2 } = this.state
    if (this.isSigninValid(email, password, password2)) {
      app.remoteDb.signup(email, password)
        .then((response) => this.logIn(email, password))
        .catch((error) => this.setState({ email: null, loginError: error }))
    }
  },

  onClickLogin () {
    const { email, password } = this.state
    this.checkSignin(email, password)
  },

  onChangeEmail (event) {
    const email = event.target.value
    this.setState({ email })
  },

  onBlurEmail (event) {
    const email = event.target.value
    this.isEmailValid(email)
  },

  onChangePassword (event) {
    const password = event.target.value
    this.setState({ password })
  },

  onChangePassword2 (event) {
    const password2 = event.target.value
    this.setState({ password2 })
  },

  onBlurPassword2 (event) {
    const password2 = event.target.value
    this.isPassword2Valid(password2)
  },

  onAlertDismiss () {
    this.setState({ loginError: null })
  },

  schliessen () {
    app.Actions.login({ logIn: false })
  },

  isEmailValid (email) {
    const validEmail = email && validateEmail(email)
    const invalidEmail = !validEmail
    this.setState({ invalidEmail })
    return validEmail
  },

  isPasswordValid (password) {
    const validPassword = !!password
    const invalidPassword = !validPassword
    this.setState({ invalidPassword })
    return validPassword
  },

  isPassword2Valid (password2) {
    const { password } = this.state
    const validPassword2 = password === password2
    const invalidPassword2 = !validPassword2
    this.setState({ invalidPassword2 })
    return validPassword2
  },

  isSigninValid (email, password, password2) {
    const { signUp } = this.state
    const validEmail = this.isEmailValid(email)
    const validPassword = this.isPasswordValid(password)
    let validSignin = validEmail && validPassword
    if (signUp) {
      const password2Valid = this.isPassword2Valid(password2)
      validSignin = validSignin && password2Valid
    }
    return validSignin
  },

  wantToSignupButtonComponent () {
    return (
      <Button
        onClick={this.onClickWantToSignup}>
        neues Konto erstellen
      </Button>
    )
  },

  signupButtonComponent () {
    return (
      <Button
        className='btn-primary'
        onClick={this.onClickSignup}>
        Konto erstellen
      </Button>
    )
  },

  signinButtonComponent () {
    return (
      <Button
        ref='anmeldenButton'
        className='btn-primary'
        onClick={this.onClickLogin}>
        anmelden
      </Button>
    )
  },

  forgotPasswordComponent () {
    return (
      <p
        className='Passwort'
        style={{'marginBottom': -5 + 'px'}}>
        Passwort vergessen?<br/>
        <a href='mailto:alex@gabriel-software.ch'>Mailen Sie mir</a>, möglichst mit derselben email-Adresse, die Sie für das Konto verwenden.
      </p>
    )
  },

  password2Component () {
    const { invalidPassword2, password2 } = this.state
    const password2InputBsStyle = invalidPassword2 ? 'error' : null
    return (
      <div
        className='formGroup'>
        <Input
          type='password'
          id='password2'
          label={'Passwort bestätigen'}
          className={'controls'}
          placeholder='Passwort bestätigen'
          value={password2}
          bsStyle={password2InputBsStyle}
          onChange={this.onChangePassword2}
          onBlur={this.onBlurPassword2}
          onKeyDown={this.onKeyDownPassword2}
          required />
        {
          invalidPassword2
          ? <div
              className='validateDivAfterRBC'>
              Passwort stimmt nicht überein
            </div>
          : null
        }
      </div>
    )
  },

  render () {
    const { invalidEmail, invalidPassword, loginError, signUp, email, password } = this.state
    const emailInputBsStyle = invalidEmail ? 'error' : null
    const passwordInputBsStyle = invalidPassword ? 'error' : null
    const loginErrorMessage = loginError && loginError.message ? loginError.message : null
    const styleAlert = {
      marginBottom: 8
    }

    return (
      <div className='static-modal'>
        <Modal.Dialog
          onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>
              {
                !signUp
                ? 'Anmelden'
                : 'Neues Konto erstellen'
              }
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form
              className={'form'}
              autoComplete='off'>
              {
                !signUp
                ? (
                    <p className='anmelden'>
                      Für diese Funktion müssen Sie angemeldet sein
                    </p>
                  )
                : null
              }
              <div
                className='formGroup'>
                <Input
                  type='email'
                  id='email'
                  label={'Email'}
                  bsSize='small'
                  className={'controls'}
                  placeholder='Email'
                  value={email}
                  bsStyle={emailInputBsStyle}
                  onChange={this.onChangeEmail}
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
                  value={password}
                  bsStyle={passwordInputBsStyle}
                  onChange={this.onChangePassword}
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
                loginErrorMessage && !signUp
                ? <Alert
                    bsStyle='danger'
                    onDismiss={this.onAlertDismiss}
                    style={styleAlert}>
                    Fehler beim Anmelden: {loginErrorMessage}<br/>
                    Müssen Sie <a href='#' onClick={this.onClickWantToSignup}>ein Konto erstellen?</a>
                  </Alert>
                : null
              }
              {
                !signUp
                ? this.forgotPasswordComponent()
                : null
              }
              {
                signUp
                ? this.password2Component()
                : null
              }
            </form>
          </Modal.Body>

          <Modal.Footer>
            {
              !signUp
              ? this.signinButtonComponent()
              : null
            }
            {
              !signUp
              ? this.wantToSignupButtonComponent()
              : null
            }
            {
              signUp
              ? this.signupButtonComponent()
              : null
            }
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
