/*
 * contains ui for a login/signup modal
 */

import app from 'ampersand-app'
import React from 'react'
import { Modal, FormGroup, ControlLabel, FormControl, Alert, Button } from 'react-bootstrap'
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

  getInitialState() {
    return {
      invalidEmail: false,
      invalidPassword: false,
      invalidPassword2: false,
      email: '',
      password: '',
      password2: '',
      loginError: null,
      signUp: false
    }
  },

  onKeyDownEmail(event) {
    const { password } = this.state
    const enter = 13
    if (event.keyCode === enter) {
      // if enter was pressed, update the value first
      const email = event.target.value
      this.setState({ email })
      this.checkSignin(email, password)
    }
  },

  onKeyDownPassword(event) {
    const { email } = this.state
    const enter = 13
    if (event.keyCode === enter) {
      // if enter was pressed, update the value first
      const password = event.target.value
      this.setState({ password })
      this.checkSignin(email, password)
    }
  },

  onKeyDownPassword2(event) {
    const enter = 13
    if (event.keyCode === enter) this.onClickSignup()
  },

  onClickWantToSignup(event) {
    if (event && event.preventDefault) event.preventDefault()
    this.setState({ signUp: true })
  },

  onClickSignup() {
    const { email, password, password2 } = this.state
    if (this.isSigninValid(email, password, password2)) {
      app.remoteDb.signup(email, password)
        .then(() => this.logIn(email, password))
        .catch((error) =>
          this.setState({ email: '', loginError: error })
        )
    }
  },

  onClickLogin() {
    const { email, password } = this.state
    this.checkSignin(email, password)
  },

  onChangeEmail(event) {
    const email = event.target.value
    this.setState({ email })
  },

  onBlurEmail(event) {
    const email = event.target.value
    this.isEmailValid(email)
  },

  onChangePassword(event) {
    const password = event.target.value
    this.setState({ password })
  },

  onChangePassword2(event) {
    const password2 = event.target.value
    this.setState({ password2 })
  },

  onBlurPassword2(event) {
    const password2 = event.target.value
    this.isPassword2Valid(password2)
  },

  onAlertDismiss() {
    this.setState({ loginError: null })
  },

  logIn(email, password) {
    app.remoteDb.login(email, password)
      .then((response) =>
        app.Actions.login({
          logIn: false,
          email,
          roles: response.roles
        }))
      .catch((error) =>
        this.setState({ loginError: error })
      )
  },

  checkSignin(email, password) {
    if (this.isSigninValid(email, password)) {
      this.logIn(email, password)
    }
  },

  schliessen() {
    app.Actions.login({ logIn: false })
  },

  isEmailValid(email) {
    const validEmail = email && validateEmail(email)
    const invalidEmail = !validEmail
    this.setState({ invalidEmail })
    return validEmail
  },

  isPasswordValid(password) {
    const validPassword = !!password
    const invalidPassword = !validPassword
    this.setState({ invalidPassword })
    return validPassword
  },

  isPassword2Valid(password2) {
    const { password } = this.state
    const validPassword2 = password === password2
    const invalidPassword2 = !validPassword2
    this.setState({ invalidPassword2 })
    return validPassword2
  },

  isSigninValid(email, password, password2) {
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

  render() {
    const {
      invalidEmail,
      invalidPassword,
      invalidPassword2,
      loginError,
      signUp,
      email,
      password,
      password2
    } = this.state
    const loginErrorMessage = (
      loginError && loginError.message ?
      loginError.message :
      null
    )
    const styleAlert = {
      marginBottom: 8
    }

    return (
      <Modal.Dialog onHide={this.onHide}>
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
            className="form"
            autoComplete="off"
          >
            {
              !signUp &&
              <p className="anmelden">
                Für diese Funktion müssen Sie angemeldet sein
              </p>
            }
            <FormGroup
              id="emailFormGroup"
              validationState={invalidEmail ? 'error' : null}
            >
              <ControlLabel>
                Email
              </ControlLabel>
              <FormControl
                type="email"
                placeholder="Email"
                value={email}
                onChange={this.onChangeEmail}
                onBlur={this.onBlurEmail}
                onKeyDown={this.onKeyDownEmail}
                required
                autoFocus
              />
              {
                invalidEmail &&
                <div style={{ color: '#a94442' }}>
                  Bitte Email prüfen
                </div>
              }
            </FormGroup>
            <FormGroup
              id="passwordFormGroup"
              validationState={invalidPassword ? 'error' : null}
            >
              <ControlLabel>
                Passwort
              </ControlLabel>
              <FormControl
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={this.onChangePassword}
                onBlur={this.onBlurPassword}
                onKeyDown={this.onKeyDownPassword}
                required
              />
              {
                invalidPassword &&
                <div style={{ color: '#a94442' }}>
                  Bitte Passwort prüfen
                </div>
              }
            </FormGroup>
            {
              loginErrorMessage && !signUp &&
              <Alert
                bsStyle="danger"
                onDismiss={this.onAlertDismiss}
                style={styleAlert}
              >
                Fehler beim Anmelden: {loginErrorMessage}<br />
                Müssen Sie <a href="#" onClick={this.onClickWantToSignup}>ein Konto erstellen?</a>
              </Alert>
            }
            {
              !signUp &&
              <p
                className="Passwort"
                style={{ marginBottom: `${-5}px` }}
              >
                Passwort vergessen?<br />
                <a href="mailto:alex@gabriel-software.ch">
                  Mailen Sie mir
                </a>, möglichst mit derselben email-Adresse, die Sie für das Konto verwenden.
              </p>
            }
            {
              signUp &&
              <FormGroup
                id="password2FormGroup"
                validationState={invalidPassword2 ? 'error' : null}
              >
                <ControlLabel>
                  Passwort bestätigen
                </ControlLabel>
                <FormControl
                  type="password"
                  placeholder="Passwort bestätigen"
                  value={password2}
                  onChange={this.onChangePassword2}
                  onBlur={this.onBlurPassword2}
                  onKeyDown={this.onKeyDownPassword2}
                  required
                />
                {
                  invalidPassword2 &&
                  <div style={{ color: '#a94442' }}>
                    Passwort stimmt nicht überein
                  </div>
                }
              </FormGroup>
            }
          </form>
        </Modal.Body>

        <Modal.Footer>
          {
            !signUp &&
            <Button
              ref="anmeldenButton"
              className="btn-primary"
              onClick={this.onClickLogin}
            >
              anmelden
            </Button>
          }
          {
            !signUp &&
            <Button onClick={this.onClickWantToSignup}>
              neues Konto erstellen
            </Button>
          }
          {
            signUp &&
            <Button
              className="btn-primary"
              onClick={this.onClickSignup}
            >
              Konto erstellen
            </Button>
          }
          <Button onClick={this.schliessen}>
            schliessen
          </Button>
        </Modal.Footer>

      </Modal.Dialog>
    )
  }
})
