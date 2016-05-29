/*
 * gets fieldName, fieldValue, inputType, pcType and pcName
 * returns a component with label and input
 */

'use strict'

import React from 'react'
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'

const FieldInput = ({
  fieldName,
  fieldValue,
  inputType,
  pcType,
  pcName,
  collectionIsEditing,
  onSaveObjectField
}) =>
  <FormGroup
    controlId={fieldName}
  >
    <ControlLabel>
      {`${fieldName}:`}
    </ControlLabel>
    <FormControl
      type={inputType}
      dsTyp={pcType}
      dsName={pcName}
      id={fieldName}
      name={fieldName}
      value={fieldValue}
      readOnly={!collectionIsEditing}
      onChange={(event) => {
        const save = false
        onSaveObjectField(
          pcType,
          pcName,
          fieldName,
          event.target.value,
          save
        )
      }}
      onBlur={(event) => {
        if (event.target.value !== fieldValue) {
          const save = true
          onSaveObjectField(
            pcType,
            pcName,
            fieldName,
            event.target.value,
            save
          )
        }
      }}
    />
  </FormGroup>

FieldInput.displayName = 'FieldInput'

FieldInput.propTypes = {
  fieldName: React.PropTypes.string,
  fieldValue: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.bool
  ]),
  inputType: React.PropTypes.string,
  pcType: React.PropTypes.string,
  pcName: React.PropTypes.string,
  collectionIsEditing: React.PropTypes.bool,
  onSaveObjectField: React.PropTypes.func
}

export default FieldInput
