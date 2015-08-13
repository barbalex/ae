/*
 * contains ui for a login/signup modal
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Input, Alert, Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Login',

  schliessen () {
    app.Actions.login({logIn: false})
    // TODO: how navigate back? history.back() only backs the url
    // console.log('document.referrer:', document.referrer)
    window.history.back()
    app.router.reload()
    // app.Router.navigate()
  },

  render () {
    return (
      <div className='static-modal'>
        <Modal.Dialog id='login'>
          <Modal.Header>
            <Modal.Title>Anmelden</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form className={'form'} autoComplete='off'>
              <p className='anmelden'>Für diese Funktion müssen Sie angemeldet sein.<br/><a href='mailto:alex@gabriel-software.ch'>Mailen Sie mir</a>, um ein Login zu erhalten.</p>
              <Input type='email' id='emailArt' label={'Email'} bsSize='small' className={'controls'} placeholder='Email' required autofocus />
              <Input type='password' id='passwortArt' label={'Passwort'} className={'controls'} placeholder='Passwort' required />
              <p className='Passwort'>Passwort vergessen?<br/><a href='mailto:alex@gabriel-software.ch'>Mailen Sie mir</a>. Benutzen Sie dazu möglichst dieselbe email-Adresse, die Sie für das Konto verwenden.</p>
              <Alert className='alert-danger'></Alert>
              <Alert className='alert-warning'></Alert>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button className='btn-primary'>anmelden</Button>
            <Button onClick={this.schliessen}>schliessen</Button>
          </Modal.Footer>

        </Modal.Dialog>
      </div>
    )
  }
})
