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
    pcsRemoved: React.PropTypes.bool,
    deletingProgress: React.PropTypes.number,
    onClickRemovePcInstances: React.PropTypes.func
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

  onClickRemove () {
    /**
     * need this extra callback because the modal has to have state showConfirmModal: false
     * otherwise when after deleting is reimported, the modal opens...
     */
    const { onClickRemovePcInstances } = this.props
    this.setState({ showConfirmModal: false })
    onClickRemovePcInstances()
  },

  render () {
    const { name, idsOfAeObjects, pcsRemoved, deletingProgress } = this.props
    const { showConfirmModal } = this.state
    const showConfirmModal_ = showConfirmModal && !deletingProgress
    const divStyle = {
      display: 'inline-block'
    }

    return (
      <div style={divStyle}>
        <Button bsStyle='danger' onClick={this.onClickDeletePcInstances} disabled={pcsRemoved}><Glyphicon glyph='trash'/> Eigenschaftensammlung "{name}" aus den in der geladenen Datei enthaltenen Arten/Lebensräumen entfernen</Button>
        {showConfirmModal_ ? <ModalDeletePcInstances name={name} idsOfAeObjects={idsOfAeObjects} onClickRemovePcInstances={this.onClickRemove} closeModal={this.closeModal} /> : null}
      </div>
    )
  }
})
