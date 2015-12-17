
/*
 * this component presents a button group used to edit collections
 */

'use strict'

import React from 'react'
import { ButtonGroup, Button, Glyphicon, Overlay, Tooltip } from 'react-bootstrap'

export default React.createClass({
  displayName: 'EditButtonGroup',

  propTypes: {
    editing: React.PropTypes.bool,
    toggleEditing: React.PropTypes.func
  },

  editButtonTooltip () {
    const { editing } = this.props
    const editText = editing ? 'schützen' : 'bearbeiten'
    return (
      <Overlay
        placement='top'>
        <Tooltip>
          {editText}
        </Tooltip>
      </Overlay>
    )
  },

  addButtonTooltip () {
    return (
      <Overlay
        placement='top'>
        <Tooltip>
          'neu'
        </Tooltip>
      </Overlay>
    )
  },

  removeButtonTooltip () {
    return (
      <Overlay
        placement='top'>
        <Tooltip>
          'löschen'
        </Tooltip>
      </Overlay>
    )
  },

  render () {
    const { editing, toggleEditing } = this.props
    const editGlyph = editing ? 'ban-circle' : 'pencil'
    const bgStyle = {
      float: 'right',
      marginTop: -55 + 'px'
    }

    return (
      <ButtonGroup style={bgStyle}>
        <Button
          onClick={toggleEditing}>
          <Glyphicon glyph={editGlyph} />
        </Button>
        <Button
          disabled={!editing}>
          <Glyphicon glyph='plus' />
        </Button>
        <Button
          disabled={!editing}>
          <Glyphicon glyph='trash' />
        </Button>
      </ButtonGroup>
    )
  }
})
