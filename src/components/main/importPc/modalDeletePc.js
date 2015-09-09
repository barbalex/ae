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
    resetUiAfterDeleting: React.PropTypes.func,
    closeModal: React.PropTypes.func,
    deletingProgress: React.PropTypes.number,
    idsOfAeObjects: React.PropTypes.array
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
    const { nameBestehend, resetUiAfterDeleting } = this.props
    this.setState({ showAlertIndex: true }, () => app.Actions.deletePcByName(nameBestehend, resetUiAfterDeleting))
  },

  schliessen () {
    const { closeModal } = this.props
    closeModal()
  },

  render () {
    const { showAlertIndex, deletingProgress, idsOfAeObjects } = this.state
    const { nameBestehend } = this.props
    const showWollenSie = deletingProgress === null && !showAlertIndex

    return (
      <div className='static-modal'>
        <Modal.Dialog onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>Eigenschaftensammlung "{nameBestehend}" löschen</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {showWollenSie ? <p>Sie möchten die Eigenschaftensammlung "{nameBestehend}" und alle ihre Eigenschaften endgültig aus allen Arten und/oder Lebensräumen entfernen?</p> : null}
            {showAlertIndex ? <p>Hole Arten/Lebensräume, um die Eigenschaftensammlung daraus zu löschen.<br/>Beim ersten Mal muss der Index aufgebaut werden. Das dauert einige Minuten...</p> : null}
            {deletingProgress !== null ? <ProgressBar bsStyle='success' now={deletingProgress} label={`${deletingProgress}% gelöscht`} /> : null}
            {deletingProgress === 100 ? <AlertFirst5Deleted idsOfAeObjects={idsOfAeObjects} nameBestehend={nameBestehend} /> : null}
          </Modal.Body>
          <Modal.Footer>
            {deletingProgress === null ? <Button className='btn-primary' onClick={this.onClickDelete}>ja, löschen!</Button> : null}
            <Button onClick={this.schliessen}>schliessen</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    )
  }
})
