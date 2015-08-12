/*
 * contains ui for a login/signup modal
 */

'use strict'

import React from 'react'
import { Modal, Well, Input, Alert, Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Login',

  propTypes: {
    email: React.PropTypes.string
  },

  getInitialState () {
    const formClassNames = window.innerWidth > 700 ? 'form form-horizontal' : 'form'
    return {
      formClassNames: formClassNames
    }
  },

  componentDidMount () {
    window.addEventListener('resize', this.onResize)
  },

  componentWillUnmount () {
    window.removeEventListener('resize')
  },

  onResize () {
    const thisWidth = React.findDOMNode(this).offsetWidth
    const formClassNames = thisWidth > 700 ? 'form form-horizontal' : 'form'
    this.setState({
      formClassNames: formClassNames
    })
  },

  render () {
    const { email } = this.props
    const { formClassNames } = this.state

    return (
      <div className='static-modal'>
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Anmelden</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Well className='well-sm anmelden'>Um Daten zu bearbeiten, müssen Sie angemeldet sein. <a href='mailto:alex@gabriel-software.ch'>Mailen Sie mir</a>, um ein Login zu erhalten.</Well>
            <Input type='email' id='emailArt' label={'Email'} bsSize='small' className={'controls'} placeholder='Email' required />
            <Alert id='emailHinweisArt' className='controls emailHinweis hinweis alert-danger feldInFormgroup'>Bitte Email erfassen</Alert>
            <Input type='password' id='passwortArt' label={'Passwort'} className={'controls'} placeholder='Passwort' required />
            <Alert id='passwortHinweisArt' className='controls passwortHinweis hinweis alert-danger feldInFormgroup'>Bitte Passwort erfassen</Alert>
            <div className='controls signup feldInFormgroup'>Vorsicht: Email und Passwort können später nicht mehr geändert werden!</div>
            <div className='controls signup feldInFormgroup'>Es wird eine verschlüsselte Version des Passworts gespeichert. Das Original kennt ausser Ihnen niemand.</div>
            <FormControls.Static className='Passwort'>Passwort vergessen? <a href='mailto:alex@gabriel-software.ch'>Mailen Sie mir</a>, möglichst mit derselben email-Adresse, die Sie für das Konto verwenden.</FormControls.Static>
            <div className='signup'>
              <Input type='password' id='passwort2Art' label={'Passwort bestätigen'} className='controls form-control passwort2' placeholder='Passwort bestätigen' required />
              <Alert id='passwort2HinweisArt' className='controls passwort2Hinweis hinweis alert-danger feldInFormgroup'>Bitte Passwort bestätigen</Alert>
              <Alert id='passwort2HinweisFalschArt' className='controls passwort2HinweisFalsch hinweis alert-danger feldInFormgroup'>Die Passwörter stimmen nicht überein</Alert>
            </div>
            <FormControls.Static style={{'paddingBottom': 6 + 'px'}}>
              <Button className='btn-primary'>anmelden</Button>
              <Button className='btn-primary' style={{'display': 'none'}}>abmelden</Button>
              <Button className='btn-primary'>neues Konto erstellen</Button>
              <Button className='btn-primary' style={{'display': 'none'}}>neues Konto speichern</Button>
            </FormControls.Static>
            <FormControls.Static>
              <Alert className='alert-danger'></Alert>
            </FormControls.Static>
            <FormControls.Static>
              <Alert className='alert-warning'></Alert>
            </FormControls.Static>
          </Modal.Body>

          <Modal.Footer>
            <Button>Close</Button>
            <Button bsStyle='primary'>Save changes</Button>
          </Modal.Footer>

        </Modal.Dialog>
      </div>
    )
  }
})
