'use strict'

import React from 'react'
import { Button, Glyphicon, FormGroup, ControlLabel } from 'react-bootstrap'
import ModalDeleteRc from './ModalDeleteRc.js'

export default React.createClass({
  displayName: 'ButtonDeleteRc',

  propTypes: {
    show: React.PropTypes.bool,
    nameBestehend: React.PropTypes.string,
    onClickDeleteRc: React.PropTypes.func,
    enableDeleteRcButton: React.PropTypes.bool,
    deletingRcProgress: React.PropTypes.number
  },

  getInitialState() {
    return {
      show: false
    }
  },

  onClickDeleteRc() {
    this.setState({ show: true })
  },

  onClickDelete() {
    /**
     * need this extra callback because the modal has to have state 'show: false'
     * otherwise when after deleting is reimported, the modal opens
     */
    const { onClickDeleteRc } = this.props
    this.setState({ show: false })
    onClickDeleteRc()
  },

  closeModal() {
    this.setState({ show: false })
  },

  render() {
    const {
      nameBestehend,
      enableDeleteRcButton,
      deletingRcProgress
    } = this.props
    const { show } = this.state
    const showConfirmModal = show && deletingRcProgress === null

    return (
      <FormGroup>
        <ControlLabel style={{ display: 'block' }} />
        <div style={{ width: '100%' }}>
          <Button
            bsStyle="danger"
            onClick={this.onClickDeleteRc}
            disabled={!enableDeleteRcButton}
          >
            <Glyphicon glyph="trash" />
            &nbsp;
            Beziehungssammlung "{nameBestehend}" aus allen Arten/Lebensräumen entfernen
          </Button>
          {
            showConfirmModal &&
            <ModalDeleteRc
              nameBestehend={nameBestehend}
              onClickDeleteRc={this.onClickDelete}
              closeModal={this.closeModal}
            />
          }
        </div>
      </FormGroup>
    )
  }
})
