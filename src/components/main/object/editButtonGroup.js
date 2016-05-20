
/*
 * this component presents a button group used to edit collections
 */

'use strict'

import React from 'react'
import {
  ButtonGroup,
  Button,
  Glyphicon,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap'

const editButton = (editObjects, toggleEditObjects) => {
  const editGlyph = editObjects ? 'ban-circle' : 'pencil'
  const editText = editObjects ? 'schützen' : 'bearbeiten'
  return (
    <OverlayTrigger
      overlay={<Tooltip id="editButtonTooltip">{editText}</Tooltip>}
      placement="top"
    >
      <Button onClick={toggleEditObjects}>
        <Glyphicon glyph={editGlyph} />
      </Button>
    </OverlayTrigger>
  )
}

const addButton = (editObjects, addNewObject) =>
  <OverlayTrigger
    overlay={<Tooltip id="addButtonTooltip">neu</Tooltip>}
    placement="top"
  >
    <Button
      onClick={addNewObject}
      disabled={!editObjects}
    >
      <Glyphicon glyph="plus" />
    </Button>
  </OverlayTrigger>

const removeButton = (editObjects, removeObject) =>
  <OverlayTrigger
    overlay={<Tooltip id="editingButtonTooltip">löschen</Tooltip>}
    placement="top"
  >
    <Button
      onClick={removeObject}
      disabled={!editObjects}
    >
      <Glyphicon glyph="trash" />
    </Button>
  </OverlayTrigger>

const bgStyle = {
  float: 'right',
  marginTop: `${-55}px`
}

const EditButtonGroup = ({
  editObjects,
  removeObject,
  toggleEditObjects,
  addNewObject
}) =>
  <ButtonGroup style={bgStyle}>
    {editButton(editObjects, toggleEditObjects)}
    {addButton(editObjects, addNewObject)}
    {removeButton(editObjects, removeObject)}
  </ButtonGroup>

EditButtonGroup.displayName = 'EditButtonGroup'

EditButtonGroup.propTypes = {
  editObjects: React.PropTypes.bool,
  toggleEditObjects: React.PropTypes.func,
  addNewObject: React.PropTypes.func,
  removeObject: React.PropTypes.func,
  showEditButtonOverlay: React.PropTypes.bool,
  showAddButtonOverlay: React.PropTypes.bool,
  showRemoveButtonOverlay: React.PropTypes.bool
}

export default EditButtonGroup
