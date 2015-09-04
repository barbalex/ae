/*
 * contains ui for a login/signup modal
 */

'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Modal, Button, Alert, ProgressBar } from 'react-bootstrap'
import _ from 'lodash'
import objectsByPcsName from '../../../queries/objectsByPcsName.js'

export default React.createClass({
  displayName: 'ModalDeletePc',

  propTypes: {
    show: React.PropTypes.bool,
    showAlertIndex: React.PropTypes.bool,
    nameBestehend: React.PropTypes.string,
    setNameBestehend: React.PropTypes.func,
    closeModal: React.PropTypes.func,
    deletingProgress: React.PropTypes.number
  },

  getInitialState () {
    return {
      show: true,
      showAlertIndex: false,
      deletingProgress: null
    }
  },

  onHide () {
    console.log('onHide')
    // this.onClickLogin()
  },

  onClickDelete () {
    const { nameBestehend } = this.props
    this.setState({ showAlertIndex: true }, () => {
      objectsByPcsName(nameBestehend)
        .then((docs) => {
          this.setState({ showAlertIndex: false }, () => {
            docs.forEach((doc, index) => {
              doc.Eigenschaftensammlungen = _.reject(doc.Eigenschaftensammlungen, (es) => es.Name === nameBestehend)
              app.localDb.put(doc)
                .then(() => {
                  this.setState({ deletingProgress: Math.round((index + 1) / docs.length * 100) })
                })
                .catch((error) => app.Actions.showError({title: `Das Objekt mit der ID ${doc._id} wurde nicht aktualisiert. Fehlermeldung:`, msg: error}))
            })
          })
        })
        .catch((error) => app.Actions.showError({title: 'Fehler beim Versuch, die Eigenschaften zu löschen:', msg: error}))
    })
  },

  schliessen () {
    const { closeModal } = this.props
    closeModal()
  },

  render () {
    const { show, showAlertIndex, deletingProgress } = this.state
    const { nameBestehend } = this.props

    return (
      <div className='static-modal'>
        <Modal.Dialog show={show} onHide={this.onHide}>
          <Modal.Header>
            <Modal.Title>Eigenschaftensammlung löschen</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Sie möchten die Eigenschaftensammlung "{nameBestehend}" und alle ihre Eigenschaften endgültig aus allen Arten und/oder Lebensräumen entfernen?</p>
            {showAlertIndex ? <Alert bsStyle='info'>Hole Arten/Lebensräume, um die Eigenschaftensammlung daraus zu löschen.<br/>Beim ersten Mal muss der Index aufgebaut werden. Das dauert einige Minuten...</Alert> : null}
            {deletingProgress !== null ? <ProgressBar bsStyle='success' now={deletingProgress} label={`${deletingProgress}% gelöscht`} /> : null}
          </Modal.Body>
          <Modal.Footer>
            <Button className='btn-primary' onClick={this.onClickDelete}>ja, löschen!</Button>
            <Button onClick={this.schliessen}>abbrechen</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    )
  }
})
