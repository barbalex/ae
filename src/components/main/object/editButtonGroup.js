
/*
 * this component presents a button group used to edit collections
 */

'use strict'

import React from 'react'
import { ButtonGroup, Button, Glyphicon } from 'react-bootstrap'

export default React.createClass({
  displayName: 'EditButtonGroup',

  propTypes: {
    editing: React.PropTypes.bool,
    toggleEditing: React.PropTypes.func
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
