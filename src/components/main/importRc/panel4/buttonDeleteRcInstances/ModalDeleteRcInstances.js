/*
 * contains ui for a login/signup modal
 */

import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ModalDeleteRcInstances = ({ name, closeModal, onClickRemoveRcInstances }) =>
  <div className="static-modal">
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>Beziehungssammlung "{name}" entfernen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Sie möchten die Beziehungssammlung "{name}" und alle ihre Eigenschaften
          endgültig aus allen in der geladenen Datei enthaltenen Arten/Lebensräumen entfernen?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="danger"
          onClick={() => onClickRemoveRcInstances()}
        >
          ja, entfernen!
        </Button>
        <Button onClick={() => closeModal()}>
          schliessen
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  </div>

ModalDeleteRcInstances.displayName = 'ModalDeleteRcInstances'

ModalDeleteRcInstances.propTypes = {
  name: React.PropTypes.string,
  closeModal: React.PropTypes.func,
  onClickRemoveRcInstances: React.PropTypes.func
}

export default ModalDeleteRcInstances
