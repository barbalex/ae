'use strict'

import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'TooManyRcsChoosen',

  propTypes: {
    resetTooManyRcsChoosen: React.PropTypes.func
  },

  close () {
    this.onHide()
  },

  onHide () {
    const { resetTooManyRcsChoosen } = this.props
    const show = false
    this.setState({ show })
    resetTooManyRcsChoosen()
  },

  render () {
    return (
      <Modal show={true} onHide={this.close}>
        <Modal.Header>
          <Modal.Title>Zuviele Beziehungssammlungen gewählt</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Sie haben Eigenschaften aus zwei Beziehungssammlungen gewählt.</p>
          <p>Wenn Sie pro Beziehung eine Zeile exportieren möchten, können Sie nur Eigenschaften einer Beziehung wählen. </p>
          <p>Sonst würde die Zahl exportierter Zeilen rasch ins Unermessliche steigen:<br/>Zum Beispiel benötigte eine (einzige) Art mit 4 Beziehungen in Beziehungssammlung A und 6 in Beziehungssammlung B dann schon 24 Zeilen...</p>
          <p>Mögliche Lösung:</p>
            <ul>
              <li>Wählen Sie nur Eigenschaften aus einer Beziehungssammlung</li>
              <li>Wählen Sie die Option "Pro Art/Lebensraum eine Zeile und alle Beziehungen kommagetrennt in einem Feld"</li>
            </ul>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle='primary' onClick={this.close}>o.k.</Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
