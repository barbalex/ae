'use strict'

import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'
import ModalDeletePcInstances from './modalDeletePcInstances.js'

export default React.createClass({
  displayName: 'ButtonDeletePcInstances',

  propTypes: {
    show: React.PropTypes.bool,
    name: React.PropTypes.string,
    pcsRemoved: React.PropTypes.bool,
    deletingPcInstancesProgress: React.PropTypes.number,
    onClickRemovePcInstances: React.PropTypes.func
  },

  getInitialState () {
    return {
      show: false
    }
  },

  closeModal () {
    this.setState({ show: false })
  },

  onClickDeletePcInstances () {
    this.setState({ show: true })
  },

  onClickRemove () {
    /**
     * need this extra callback because the modal has to have state 'show: false'
     * otherwise when after deleting is reimported, the modal opens
     */
    const { onClickRemovePcInstances } = this.props
    this.setState({ show: false })
    onClickRemovePcInstances()
  },

  render () {
    const { name, pcsRemoved, deletingPcInstancesProgress } = this.props
    const { show } = this.state
    const showConfirmModal = show && !deletingPcInstancesProgress
    const divStyle = {
      display: 'inline-block'
    }

    return (
      <div style={divStyle}>
        <Button bsStyle='danger' onClick={this.onClickDeletePcInstances} disabled={pcsRemoved}><Glyphicon glyph='trash'/> Eigenschaftensammlung "{name}" aus den in der geladenen Datei enthaltenen Arten/Lebensräumen entfernen</Button>
        {showConfirmModal ? <ModalDeletePcInstances name={name} onClickRemovePcInstances={this.onClickRemove} closeModal={this.closeModal} /> : null}
      </div>
    )
  }
})
