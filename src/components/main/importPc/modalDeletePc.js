/*
 * contains ui for a login/signup modal
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Button, ProgressBar } from 'react-bootstrap'
import _ from 'lodash'
import objectsByPcsName from '../../../queries/objectsByPcsName.js'
import AlertFirst5Deleted from './alertFirst5Deleted.js'

export default React.createClass({
  displayName: 'ModalDeletePc',

  propTypes: {
    showAlertIndex: React.PropTypes.bool,
    nameBestehend: React.PropTypes.string,
    resetUiAfterDeleting: React.PropTypes.func,
    closeModal: React.PropTypes.func,
    deletingProgress: React.PropTypes.number,
    docsToDelete: React.PropTypes.array
  },

  getInitialState () {
    return {
      showAlertIndex: false,
      deletingProgress: null,
      docsToDelete: []
    }
  },

  onHide () {
    console.log('onHide')
  },

  onClickDelete () {
    const { nameBestehend, resetUiAfterDeleting } = this.props
    this.setState({ showAlertIndex: true }, () => {
      objectsByPcsName(nameBestehend)
        .then((docs) => {
          this.setState({
            showAlertIndex: false,
            docsToDelete: docs
          }, () => {
            docs.forEach((doc, index) => {
              doc.Eigenschaftensammlungen = _.reject(doc.Eigenschaftensammlungen, (es) => es.Name === nameBestehend)
              app.localDb.put(doc)
                .then(() =>
                  this.setState({ deletingProgress: Math.round((index + 1) / docs.length * 100) })
                )
                .catch((error) => app.Actions.showError({title: `Fehler: Das Objekt mit der ID ${doc._id} wurde nicht aktualisiert:`, msg: error}))
            })
          })
          // set nameBestehend back
          resetUiAfterDeleting()
        })
        .catch((error) => app.Actions.showError({title: 'Fehler beim Versuch, die Eigenschaften zu löschen:', msg: error}))
    })
  },

  schliessen () {
    const { closeModal } = this.props
    closeModal()
  },

  render () {
    const { showAlertIndex, deletingProgress, docsToDelete } = this.state
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
            {deletingProgress === 100 ? <AlertFirst5Deleted docsToDelete={docsToDelete} nameBestehend={nameBestehend} /> : null}
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
