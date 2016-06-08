import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default React.createClass({
  displayName: 'TooManyFieldsChoosen',

  propTypes: {
    resetTooManyFieldsChoosen: React.PropTypes.func
  },

  onHide() {
    const { resetTooManyFieldsChoosen } = this.props
    const show = false
    this.setState({ show })
    resetTooManyFieldsChoosen()
  },

  close() {
    this.onHide()
  },

  render() {
    return (
      <Modal show onHide={this.close}>
        <Modal.Header>
          <Modal.Title>
            Zuviele Eigenschaften gewählt
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Sie haben mehr als 35 Exportfelder gewählt.
          </p>
          <p>
            Wenn Sie zuviele Daten exportieren, können schlimme Dinge passieren.<br />
            Zum Beispiel:
          </p>
          <ul>
            <li>
              kann der Server explodieren,
            </li>
            <li>
              das Netzwerkkabel schmelzen,
            </li>
            <li>
              der Browser abstürzen
            </li>
            <li>
              ...oder Ihr PC sich in Rauch auflösen!
            </li>
          </ul>
          <p>
            Daher dürfen maximal 35 Felder exportiert werden.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="primary"
            onClick={this.close}
          >
            o.k.
          </Button>
        </Modal.Footer>

      </Modal>
    )
  }
})
