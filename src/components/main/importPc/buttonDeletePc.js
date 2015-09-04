'use strict'

import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'
import ModalDeletePc from './modalDeletePc.js'

export default React.createClass({
  displayName: 'ButtonDeletePc',

  propTypes: {
    showConfirmModal: React.PropTypes.bool,
    nameBestehend: React.PropTypes.string,
    setNameBestehend: React.PropTypes.func
  },

  getInitialState () {
    return {
      showConfirmModal: false
    }
  },

  closeModal () {
    this.setState({ showConfirmModal: false })
  },

  onClickDeletePc () {
    this.setState({ showConfirmModal: true })
  },

  render () {
    const { setNameBestehend, nameBestehend } = this.props
    const { showConfirmModal } = this.state
    return (
      <div>
        <Button className='btn-primary feld' onClick={this.onClickDeletePc}><Glyphicon glyph='trash'/> Diese Eigenschaftensammlung aus allen Arten bzw. Lebensräumen entfernen</Button>
        {showConfirmModal ? <ModalDeletePc nameBestehend={nameBestehend} setNameBestehend={setNameBestehend} closeModal={this.closeModal} /> : null}
      </div>
    )
  }
})
