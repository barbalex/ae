
/*
 * this component presents a button group used to edit collections
 */

'use strict'

import React from 'react'
import { ButtonGroup, Button, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap'

export default React.createClass({
  displayName: 'EditButtonGroup',

  propTypes: {
    editObjects: React.PropTypes.bool,
    toggleEditObjects: React.PropTypes.func,
    showEditButtonOverlay: React.PropTypes.bool,
    showAddButtonOverlay: React.PropTypes.bool,
    showRemoveButtonOverlay: React.PropTypes.bool
  },

  editButton () {
    const { editObjects, toggleEditObjects } = this.props
    const editGlyph = editObjects ? 'ban-circle' : 'pencil'
    const editText = editObjects ? 'schützen' : 'bearbeiten'
    return (
      <OverlayTrigger
        overlay={<Tooltip id='editButtonTooltip'>{editText}</Tooltip>}
        placement='top'>
        <Button
          onClick={toggleEditObjects}>
          <Glyphicon glyph={editGlyph} />
        </Button>
      </OverlayTrigger>
    )
  },

  addButton () {
    const { editObjects } = this.props
    return (
      <OverlayTrigger
        overlay={<Tooltip id='addButtonTooltip'>neu</Tooltip>}
        placement='top'>
        <Button
          disabled={!editObjects}>
          <Glyphicon glyph='plus' />
        </Button>
      </OverlayTrigger>
    )
  },

  removeButton () {
    const { editObjects } = this.props
    return (
      <OverlayTrigger
        overlay={<Tooltip id='editingButtonTooltip'>löschen</Tooltip>}
        placement='top'>
        <Button
          disabled={!editObjects}>
          <Glyphicon glyph='trash' />
        </Button>
      </OverlayTrigger>
    )
  },

  render () {
    const bgStyle = {
      float: 'right',
      marginTop: -55 + 'px'
    }

    return (
      <ButtonGroup style={bgStyle}>
        {this.editButton()}
        {this.addButton()}
        {this.removeButton()}
      </ButtonGroup>
    )
  }
})
