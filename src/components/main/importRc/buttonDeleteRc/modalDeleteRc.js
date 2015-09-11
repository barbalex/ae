'use strict'

import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'ModalDeleteRc',

  propTypes: {
    nameBestehend: React.PropTypes.string,
    onClickDeleteRc: React.PropTypes.func,
    closeModal: React.PropTypes.func
  },

  onHide () {
    console.log('onHide')
  },

  onClickDelete () {
    const { onClickDeleteRc } = this.props
    onClickDeleteRc()
  },

  schliessen () {
    const { closeModal } = this.props
    closeModal()
  },

  render () {
    const { nameBestehend } = this.props

    return (
      <div className='static-modal'>
        <Modal.Dialog onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>Eigenschaftensammlung "{nameBestehend}" löschen</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Sie möchten die Eigenschaftensammlung "{nameBestehend}" und alle ihre Eigenschaften endgültig aus allen Arten und/oder Lebensräumen entfernen?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle='danger' onClick={this.onClickDelete}>ja, löschen!</Button>
            <Button onClick={this.schliessen}>schliessen</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    )
  }
})
