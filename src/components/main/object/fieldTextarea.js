/*
 * gets fieldName, fieldValue, inputType, pcType and pcName
 * returns a component with label and input
 */

'use strict'

import React from 'react'
import Textarea from 'react-textarea-autosize'

const FieldTextarea = ({
  fieldName,
  fieldValue,
  pcType,
  pcName,
  collectionIsEditing,
  onSaveObjectField
}) =>
  <div className="form-group form-group-sm">
    <label
      htmlFor={fieldName}
      className="control-label"
    >
      <span>
        {`${fieldName}:`}
      </span>
    </label>
    <Textarea
      dsTyp={pcType}
      dsName={pcName}
      id={fieldName}
      name={fieldName}
      readOnly={!collectionIsEditing}
      className="controls form-control"
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
  </div>

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
