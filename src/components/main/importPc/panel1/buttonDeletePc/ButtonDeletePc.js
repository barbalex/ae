import React from 'react'
import { Button, Glyphicon, FormGroup, ControlLabel } from 'react-bootstrap'
import ModalDeletePc from './ModalDeletePc.js'

export default React.createClass({
  displayName: 'ButtonDeletePc',

  propTypes: {
    show: React.PropTypes.bool,
    nameBestehend: React.PropTypes.string,
    onClickDeletePc: React.PropTypes.func,
    enableDeletePcButton: React.PropTypes.bool,
    deletingPcProgress: React.PropTypes.number
  },

  getInitialState() {
    return {
      show: false
    }
  },

  onClickDeletePc() {
    this.setState({ show: true })
  },

  onClickDelete() {
    /**
     * need this extra callback because the modal has to have state 'show: false'
     * otherwise when after deleting is reimported, the modal opens
     */
    const { onClickDeletePc } = this.props
    this.setState({ show: false })
    onClickDeletePc()
  },

  closeModal() {
    this.setState({ show: false })
  },

  render() {
    const {
      nameBestehend,
      enableDeletePcButton,
      deletingPcProgress
    } = this.props
    const { show } = this.state
    const showConfirmModal = show && deletingPcProgress === null

    return (
      <FormGroup>
        <ControlLabel style={{ display: 'block' }} />
        <div style={{ width: '100%' }}>
          <Button
            bsStyle="danger"
            onClick={this.onClickDeletePc}
            disabled={!enableDeletePcButton}
          >
            <Glyphicon glyph="trash" />
            &nbsp;
            Eigenschaftensammlung "{nameBestehend}" aus allen Arten/Lebensräumen entfernen
          </Button>
          {
            showConfirmModal &&
            <ModalDeletePc
              nameBestehend={nameBestehend}
              onClickDeletePc={this.onClickDelete}
              closeModal={this.closeModal}
            />
          }
        </div>
      </FormGroup>
    )
  }
})
