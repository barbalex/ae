'use strict'

import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'
import ModalDeletePc from './modalDeletePc.js'

export default React.createClass({
  displayName: 'ButtonDeletePc',

  propTypes: {
    show: React.PropTypes.bool,
    nameBestehend: React.PropTypes.string,
    onClickDeletePc: React.PropTypes.func,
    enableDeletePcButton: React.PropTypes.bool,
    deletingPcProgress: React.PropTypes.number
  },

  getInitialState () {
    return {
      show: false
    }
  },

  closeModal () {
    this.setState({ show: false })
  },

  onClickDeletePc () {
    this.setState({ show: true })
  },

  onClickDelete () {
    /**
     * need this extra callback because the modal has to have state 'show: false'
     * otherwise when after deleting is reimported, the modal opens
     */
    const { onClickDeletePc } = this.props
    this.setState({ show: false })
    onClickDeletePc()
  },

  render () {
    const { nameBestehend, enableDeletePcButton, deletingPcProgress } = this.props
    const { show } = this.state
    const showConfirmModal = show && deletingPcProgress === null

    return (
      <div>
        {
          nameBestehend
          ? <div className='form-group'>
              <Button
                bsStyle='danger'
                className='feld'
                onClick={this.onClickDeletePc}
                disabled={!enableDeletePcButton}>
                <Glyphicon glyph='trash'/> Eigenschaftensammlung "{nameBestehend}" aus allen Arten/Lebensräumen entfernen
              </Button>
            </div>
          : null
        }
        {
          showConfirmModal
          ? <ModalDeletePc
              nameBestehend={nameBestehend}
              onClickDeletePc={this.onClickDelete}
              closeModal={this.closeModal} />
          : null
        }
      </div>
    )
  }
})
