/*
 * contains ui for a login/signup modal
 */

'use strict'

import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'ModalDeleteRcInstances',

  propTypes: {
    name: React.PropTypes.string,
    closeModal: React.PropTypes.func,
    onClickRemoveRcInstances: React.PropTypes.func
  },

  onHide () {
    console.log('onHide')
  },

  onClickRemove () {
    const { onClickRemoveRcInstances } = this.props
    onClickRemoveRcInstances()
  },

  schliessen () {
    const { closeModal } = this.props
    closeModal()
  },

  render () {
    const { name } = this.props

    return (
      <div className='static-modal'>
        <Modal.Dialog onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>Beziehungssammlung "{name}" entfernen</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Sie möchten die Beziehungssammlung "{name}" und alle ihre Eigenschaften endgültig aus allen in der geladenen Datei enthaltenen Arten/Lebensräumen entfernen?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle='danger' onClick={this.onClickRemove}>ja, entfernen!</Button>
            <Button onClick={this.schliessen}>schliessen</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    )
  }
})