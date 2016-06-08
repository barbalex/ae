/*
 * gets fieldName, fieldValue, pcType and pcName
 * returns a component with label and link
 */

import React from 'react'
import {
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap'

const FieldLink = ({
  fieldName,
  fieldValue,
  pcType,
  pcName,
  collectionIsEditing,
  onSaveObjectField
}) => {
  if (collectionIsEditing) {
    return (
      <FormGroup
        controlId={fieldName}
      >
        <ControlLabel>
          {fieldName}
        </ControlLabel>
        <FormControl
          type="text"
          dsTyp={pcType}
          dsName={pcName}
          id={fieldName}
          name={fieldName}
          value={fieldValue}
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
    )
  }

  return (
    <FormGroup
      controlId={fieldName}
    >
      <ControlLabel>
        {fieldName}
      </ControlLabel>
      <a href={fieldValue}>
        <FormControl
          dsTyp={pcType}
          dsName={pcName}
          id={fieldName}
          name={fieldName}
          type="text"
          value={fieldValue}
          readOnly={!collectionIsEditing}
          style={{ cursor: 'pointer' }}
        />
      </a>
    </FormGroup>
  )
}

FieldLink.displayName = 'FieldLink'

FieldLink.propTypes = {
  fieldName: React.PropTypes.string,
  fieldValue: React.PropTypes.string,
  pcType: React.PropTypes.string,
  pcName: React.PropTypes.string,
  collectionIsEditing: React.PropTypes.bool,
  onSaveObjectField: React.PropTypes.func
}

export default FieldLink
