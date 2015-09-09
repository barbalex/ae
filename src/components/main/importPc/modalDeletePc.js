/*
 * contains ui for a login/signup modal
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Button, ProgressBar } from 'react-bootstrap'
import _ from 'lodash'
import AlertFirst5Deleted from './alertFirst5Deleted.js'

export default React.createClass({
  displayName: 'ModalDeletePc',

  propTypes: {
    showAlertIndex: React.PropTypes.bool,
    nameBestehend: React.PropTypes.string,
    onClickDeletePc: React.PropTypes.func,
    closeModal: React.PropTypes.func,
    deletingPcProgress: React.PropTypes.number
  },

  getInitialState () {
    return {
      showAlertIndex: false
    }
  },

  onHide () {
    console.log('onHide')
  },

  onClickDelete () {
    const { onClickDeletePc } = this.props
    this.setState({ showAlertIndex: true }, () => onClickDeletePc())
  },

  schliessen () {
    const { closeModal } = this.props
    closeModal()
  },

  render () {
    const { showAlertIndex, deletingPcProgress } = this.state
    const { nameBestehend } = this.props
    const showWollenSie = deletingPcProgress === null && !showAlertIndex

    return (
      <div className='static-modal'>
        <Modal.Dialog onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>Eigenschaftensammlung "{nameBestehend}" löschen</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {showWollenSie ? <p>Sie möchten die Eigenschaftensammlung "{nameBestehend}" und alle ihre Eigenschaften endgültig aus allen Arten und/oder Lebensräumen entfernen?</p> : null}
            {showAlertIndex ? <p>Hole Arten/Lebensräume, um die Eigenschaftensammlung daraus zu löschen.<br/>Beim ersten Mal muss der Index aufgebaut werden. Das dauert einige Minuten...</p> : null}
          </Modal.Body>
          <Modal.Footer>
            {deletingPcProgress === null ? <Button className='btn-primary' onClick={this.onClickDelete}>ja, löschen!</Button> : null}
            <Button onClick={this.schliessen}>schliessen</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    )
  }
})
