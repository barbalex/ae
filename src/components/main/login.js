/*
 * contains ui for a login/signup modal
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Input, Button } from 'react-bootstrap'
import validateEmail from '../../modules/validateEmail.js'

export default React.createClass({
  displayName: 'Login',

  propTypes: {
    invalidEmail: React.PropTypes.bool,
    invalidPassword: React.PropTypes.bool,
    email: React.PropTypes.string,
    password: React.PropTypes.string
  },

  getInitialState () {
    return {
      invalidEmail: false,
      invalidPassword: false,
      email: null,
      password: null
    }
  },

  onClickLogin () {
    console.log('signin is not valid')
    if (this.validSignin()) {
      console.log('signin is valid')
    }
  },

  onBlurEmail (event) {
    const email = event.target.value
    this.setState({email: email})
    console.log('onBlurEmail: email', email)
    this.validEmail(email)
  },

  onBlurPassword (event) {
    const password = event.target.value
    this.setState({password: password})
    // this.validPassword(password)
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
    console.log('validEmail: email', email)
    const validEmail = email && validateEmail(email)
    console.log('validEmail: validEmail', validEmail)
    this.setState({
      invalidEmail: !validEmail
    })
    return validEmail
  },

  validPassword (password) {
    password = password || this.state.password
    const validPassword = !!password
    console.log('validPassword: validPassword', validPassword)
    this.setState({
      invalidPassword: !validPassword
    })
    return validPassword
  },

  validSignin () {
    const validEmail = this.validEmail()
    const validPassword = this.validPassword()
    return validEmail && validPassword
  },

  render () {
    const { invalidEmail, invalidPassword } = this.state
    const emailInputBsStyle = invalidEmail ? 'error' : null
    const passwordInputBsStyle = invalidPassword ? 'error' : null

    return (
      <div className='static-modal'>
        <Modal.Dialog id='login'>
          <Modal.Header>
            <Modal.Title>Anmelden</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form className={'form'} autoComplete='off'>
              <p className='anmelden'>Für diese Funktion müssen Sie angemeldet sein.<br/><a href='mailto:alex@gabriel-software.ch'>Mailen Sie mir</a>, um ein Login zu erhalten.</p>
              <div className='formGroup'>
                <Input type='email' id='emailArt' label={'Email'} bsSize='small' className={'controls'} placeholder='Email' bsStyle={emailInputBsStyle} onBlur={this.onBlurEmail} required autofocus />
                {invalidEmail ? <span className='validateSpan'>Bitte Email prüfen</span> : ''}
              </div>
              <div className='formGroup'>
                <Input type='password' id='passwortArt' label={'Passwort'} className={'controls'} placeholder='Passwort' bsStyle={passwordInputBsStyle} onBlur={this.onBlurPassword} required />
                {invalidPassword ? <span className='validateSpan'>Bitte Passwort prüfen</span> : ''}
              </div>
              <p className='Passwort'>Passwort vergessen?<br/><a href='mailto:alex@gabriel-software.ch'>Mailen Sie mir</a>. Benutzen Sie dazu möglichst dieselbe email-Adresse, die Sie für das Konto verwenden.</p>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button className='btn-primary' onClick={this.onClickLogin}>anmelden</Button>
            <Button onClick={this.schliessen}>schliessen</Button>
          </Modal.Footer>

        </Modal.Dialog>
      </div>
    )
  }
})
