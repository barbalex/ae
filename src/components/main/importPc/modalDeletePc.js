/*
 * contains ui for a login/signup modal
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'ModalDeletePc',

  propTypes: {
    show: React.PropTypes.bool,
    nameBestehend: React.PropTypes.string,
    setNameBestehend: React.PropTypes.func,
    closeModal: React.PropTypes.func
  },

  getInitialState () {
    return {
      show: true
    }
  },

  onHide () {
    console.log('onHide')
    // this.onClickLogin()
  },

  onClickDelete () {
    const { nameBestehend } = this.props
    const startkey = [{nameBestehend}]
    const endkey = [{nameBestehend}, {}, {}, {}]
    const options = { startkey, endkey }
    console.log('options', options)
    app.localDb.query('pcs')
      .then((result) => {
        const rows = result.rows
        console.log('rows', rows)
      })
      .catch((error) => app.Actions.showError({title: 'Fehler beim Versuch, die Eigenschaften zu löschen:', msg: error}))
  },

  schliessen () {
    const { closeModal } = this.props
    closeModal()
  },

  render () {
    const { show } = this.state
    const { nameBestehend } = this.props

    return (
      <div className='static-modal'>
        <Modal.Dialog show={show} onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>Eigenschaftensammlung löschen</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Sie möchten die Eigenschaftensammlung "{nameBestehend}" und alle ihre Eigenschaften endgültig aus allen Arten und/oder Lebensräumen entfernen?</p>

            // TODO: delete, show progress, then set nameBestehend to null
          </Modal.Body>
          <Modal.Footer>
            <Button className='btn-primary' onClick={this.onClickDelete}>ja, löschen!</Button>
            <Button onClick={this.schliessen}>abbrechen</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    )
  }
})
