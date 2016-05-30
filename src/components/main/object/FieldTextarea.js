/*
 * gets fieldName, fieldValue, inputType, pcType and pcName
 * returns a component with label and input
 */

'use strict'

import React from 'react'
import { FormGroup, ControlLabel } from 'react-bootstrap'
import Textarea from 'react-textarea-autosize'

const FieldTextarea = ({
  fieldName,
  fieldValue,
  pcType,
  pcName,
  collectionIsEditing,
  onSaveObjectField
}) =>
  <FormGroup controlId={fieldName}>
    <ControlLabel>
      {fieldName}
    </ControlLabel>
    <Textarea
      dsTyp={pcType}
      dsName={pcName}
      id={fieldName}
      name={fieldName}
      readOnly={!collectionIsEditing}
      className="form-control"
      defaultValue={fieldValue}
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

FieldTextarea.displayName = 'FieldTextarea'

FieldTextarea.propTypes = {
  fieldName: React.PropTypes.string,
  fieldValue: React.PropTypes.string,
  pcType: React.PropTypes.string,
  pcName: React.PropTypes.string,
  collectionIsEditing: React.PropTypes.bool,
  onSaveObjectField: React.PropTypes.func
}

export default FieldTextarea
