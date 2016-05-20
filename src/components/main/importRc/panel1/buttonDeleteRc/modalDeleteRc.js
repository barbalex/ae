'use strict'

import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ModalDeleteRc = ({ nameBestehend, onClickDeleteRc, closeModal }) =>
  <div className="static-modal">
    <Modal.Dialog onHide={this.onHide}>
      <Modal.Header>
        <Modal.Title>Beziehungssammlung "{nameBestehend}" löschen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Sie möchten die Beziehungssammlung "{nameBestehend}" und alle ihre Eigenschaften
          endgültig aus allen Arten und/oder Lebensräumen entfernen?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="danger"
          onClick={() => onClickDeleteRc()}
        >
          ja, löschen!
        </Button>
        <Button onClick={() => closeModal()}>schliessen</Button>
      </Modal.Footer>
    </Modal.Dialog>
  </div>

ModalDeleteRc.displayName = 'ModalDeleteRc'

ModalDeleteRc.propTypes = {
  nameBestehend: React.PropTypes.string,
  onClickDeleteRc: React.PropTypes.func,
  closeModal: React.PropTypes.func
}

export default ModalDeleteRc
