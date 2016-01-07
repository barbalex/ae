'use strict'

import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'
import ModalDeleteRcInstances from './modalDeleteRcInstances.js'

export default React.createClass({
  displayName: 'ButtonDeleteRcInstances',

  propTypes: {
    show: React.PropTypes.bool,
    name: React.PropTypes.string,
    rcsRemoved: React.PropTypes.bool,
    deletingRcInstancesProgress: React.PropTypes.number,
    onClickRemoveRcInstances: React.PropTypes.func
  },

  getInitialState () {
    return {
      show: false
    }
  },

  closeModal () {
    this.setState({ show: false })
  },

  onClickDeleteRcInstances () {
    this.setState({ show: true })
  },

  onClickRemove () {
    /**
     * need this extra callback because the modal has to have state 'show: false'
     * otherwise when after deleting is reimported, the modal opens
     */
    const { onClickRemoveRcInstances } = this.props
    onClickRemoveRcInstances()
    this.setState({ show: false })
  },

  render () {
    const { name, rcsRemoved, deletingRcInstancesProgress } = this.props
    const { show } = this.state
    const showConfirmModal = show && !deletingRcInstancesProgress
    const divStyle = {
      display: 'inline-block'
    }

    return (
      <div
        style={divStyle}>
        <Button
          bsStyle='danger'
          onClick={this.onClickDeleteRcInstances}
          disabled={rcsRemoved}>
          <Glyphicon glyph='trash'/> Beziehungssammlung "{name}" aus den in der geladenen Datei enthaltenen Arten/Lebensräumen entfernen
        </Button>
        {
          showConfirmModal &&
          <ModalDeleteRcInstances
            name={name}
            onClickRemoveRcInstances={this.onClickRemove}
            closeModal={this.closeModal} />
        }
      </div>
    )
  }
})
