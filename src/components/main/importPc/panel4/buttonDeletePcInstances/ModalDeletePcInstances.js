'use strict'

import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ModalDeletePcInstances = ({
  name,
  closeModal,
  onClickRemovePcInstances
}) => (
  <div className="static-modal">
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>
          Eigenschaftensammlung "{name}" entfernen
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Sie möchten die Eigenschaftensammlung "{name}" und alle ihre Eigenschaften
          endgültig aus allen in der geladenen Datei enthaltenen Arten/Lebensräumen entfernen?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="danger"
          onClick={() =>
            onClickRemovePcInstances()
          }
        >
          ja, entfernen!
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
)

ModalDeletePcInstances.displayName = 'ModalDeletePcInstances'

ModalDeletePcInstances.propTypes = {
  name: React.PropTypes.string,
  closeModal: React.PropTypes.func,
  onClickRemovePcInstances: React.PropTypes.func
}

export default ModalDeletePcInstances
