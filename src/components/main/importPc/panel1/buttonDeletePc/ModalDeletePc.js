/*
 * contains ui for a login/signup modal
 */

import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ModalDeletePc = ({
  nameBestehend,
  onClickDeletePc,
  closeModal
}) =>
  <div
    className="static-modal"
  >
    <Modal.Dialog>
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
          onClick={() =>
            onClickDeletePc()
          }
        >
          ja, löschen!
        </Button>
        <Button
          onClick={() =>
            closeModal()
          }
        >
          schliessen
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  </div>

ModalDeletePc.displayName = 'ModalDeletePc'

ModalDeletePc.propTypes = {
  nameBestehend: React.PropTypes.string,
  onClickDeletePc: React.PropTypes.func,
  closeModal: React.PropTypes.func
}

export default ModalDeletePc
