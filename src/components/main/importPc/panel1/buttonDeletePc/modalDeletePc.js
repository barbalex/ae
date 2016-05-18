/*
 * contains ui for a login/signup modal
 */

'use strict'

import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'ModalDeletePc',

  propTypes: {
    nameBestehend: React.PropTypes.string,
    onClickDeletePc: React.PropTypes.func,
    closeModal: React.PropTypes.func
  },

  onHide() {
    console.log('onHide')
  },

  render() {
    const { nameBestehend, onClickDeletePc, closeModal } = this.props

    return (
      <div
        className="static-modal"
      >
        <Modal.Dialog onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>
              Eigenschaftensammlung "{nameBestehend}" löschen
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Sie möchten die Eigenschaftensammlung "{nameBestehend}" und alle ihre Eigenschaften
              endgültig aus allen Arten und/oder Lebensräumen entfernen?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="danger"
              onClick={() => onClickDeletePc()}
            >
              ja, löschen!
            </Button>
            <Button
              onClick={() => closeModal()}
            >
              schliessen
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    )
  }
})
