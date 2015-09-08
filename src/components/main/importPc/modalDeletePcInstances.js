/*
 * contains ui for a login/signup modal
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Button, ProgressBar } from 'react-bootstrap'
import _ from 'lodash'
import AlertFirst5Deleted from './alertFirst5Deleted.js'
import getGuidsById from '../../../modules/getGuidsById.js'

export default React.createClass({
  displayName: 'ModalDeletePcInstances',

  propTypes: {
    name: React.PropTypes.string,
    idsOfAeObjects: React.PropTypes.array,
    resetUiAfterRemoving: React.PropTypes.func,
    closeModal: React.PropTypes.func,
    deletingProgress: React.PropTypes.number
  },

  getInitialState () {
    return {
      deletingProgress: null
    }
  },

  onHide () {
    console.log('onHide')
  },

  onClickRemove () {
    const { name, idsOfAeObjects, resetUiAfterRemoving } = this.props
    idsOfAeObjects.forEach((guid, index) => {
      app.objectStore.getItem(guid)
        .then((doc) => {
          doc.Eigenschaftensammlungen = _.reject(doc.Eigenschaftensammlungen, (es) => es.Name === name)
          return app.localDb.put(doc)
        })
        .then(() => {
          const deletingProgress = Math.round((index + 1) / idsOfAeObjects.length * 100)
          this.setState({ deletingProgress }, () => true)
          if (deletingProgress === 100) resetUiAfterRemoving()
        })
        .catch((error) => app.Actions.showError({title: `Fehler: Das Objekt mit der GUID ${guid} wurde nicht aktualisiert:`, msg: error}))
    })
  },

  schliessen () {
    const { closeModal } = this.props
    closeModal()
  },

  render () {
    const { deletingProgress, idsOfAeObjects } = this.state
    const { name } = this.props
    const showWollenSie = deletingProgress === null

    return (
      <div className='static-modal'>
        <Modal.Dialog onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>Eigenschaftensammlung "{name}" entfernen</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {showWollenSie ? <p>Sie möchten die Eigenschaftensammlung "{name}" und alle ihre Eigenschaften endgültig aus allen in der geladenen Datei enthaltenen Arten/Lebensräumen entfernen?</p> : null}
            {deletingProgress !== null ? <ProgressBar bsStyle='success' now={deletingProgress} label={`${deletingProgress}% entfernt`} /> : null}
            {deletingProgress === 100 ? <AlertFirst5Deleted docsToDelete={idsOfAeObjects} nameBestehend={name} /> : null}
          </Modal.Body>
          <Modal.Footer>
            {deletingProgress === null ? <Button className='btn-primary' onClick={this.onClickRemove}>ja, entfernen!</Button> : null}
            <Button onClick={this.schliessen}>schliessen</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    )
  }
})
