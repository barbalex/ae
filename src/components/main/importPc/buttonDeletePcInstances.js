'use strict'

import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'
import ModalDeletePcInstances from './modalDeletePcInstances.js'

export default React.createClass({
  displayName: 'ButtonDeletePcInstances',

  propTypes: {
    showConfirmModal: React.PropTypes.bool,
    name: React.PropTypes.string,
    idsOfAeObjects: React.PropTypes.array,
    resetUiAfterRemoving: React.PropTypes.func,
    pcsRemoved: React.PropTypes.bool
  },

  getInitialState () {
    return {
      showConfirmModal: false
    }
  },

  closeModal () {
    this.setState({ showConfirmModal: false })
  },

  onClickDeletePcInstances () {
    this.setState({ showConfirmModal: true })
  },

  render () {
    const { name, idsOfAeObjects, resetUiAfterRemoving, pcsRemoved } = this.props
    const { showConfirmModal } = this.state
    const divStyle = {
      display: 'inline-block'
    }

    console.log('buttonDeletePcInstances.js, pcsRemoved', pcsRemoved)
    return (
      <div style={divStyle}>
        <Button bsStyle='danger' onClick={this.onClickDeletePcInstances} disabled={pcsRemoved}><Glyphicon glyph='trash'/> Eigenschaftensammlung "{name}" aus den in der geladenen Datei enthaltenen Arten/Lebensräumen entfernen</Button>
        {showConfirmModal ? <ModalDeletePcInstances name={name} idsOfAeObjects={idsOfAeObjects} resetUiAfterRemoving={resetUiAfterRemoving} closeModal={this.closeModal} /> : null}
      </div>
    )
  }
})
