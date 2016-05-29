/*
 * gets fieldName, fieldValue, pcType and pcName
 * returns a component with label and checkbox
 */

'use strict'

import React from 'react'
import { FormGroup, Checkbox, ControlLabel } from 'react-bootstrap'

export default React.createClass({
  displayName: 'FieldBoolean',

  propTypes: {
    fieldName: React.PropTypes.string,
    fieldValue: React.PropTypes.bool,
    pcType: React.PropTypes.string,
    pcName: React.PropTypes.string,
    collectionIsEditing: React.PropTypes.bool,
    onSaveObjectField: React.PropTypes.func
  },

  onChange() {
    const {
      fieldName,
      pcType,
      pcName,
      onSaveObjectField
    } = this.props
    const fieldValue = this.myInput.value
    const save = false
    onSaveObjectField(pcType, pcName, fieldName, fieldValue, save)
  },

  onBlur() {
    const {
      fieldName,
      fieldValue,
      pcType,
      pcName,
      onSaveObjectField
    } = this.props
    const newFieldValue = this.myInput.value
    if (newFieldValue !== fieldValue) {
      const save = true
      onSaveObjectField(pcType, pcName, fieldName, newFieldValue, save)
    }
  },

  render() {
    const {
      fieldName,
      fieldValue,
      pcType,
      pcName,
      collectionIsEditing
    } = this.props

    // need to place checkboxes next to labels, not inside
    // makes styling MUCH easier
    return (
      <FormGroup
        controlId={fieldName}
        className="checkboxFormGroup"
      >
        <ControlLabel>
          {`${fieldName}:`}
        </ControlLabel>
        <div className="checkboxDiv">
          <input
            type="checkbox"
            ref={(c) => { this.myInput = c }}
            dsTyp={pcType}
            dsName={pcName}
            id={fieldName}
            name={fieldName}
            checked={fieldValue}
            readOnly={!collectionIsEditing}
            onChange={this.onChange}
            onBlur={this.onBlur}
            style={{ marginTop: 8 }}
          />
        </div>
      </FormGroup>
    )
  }
})
