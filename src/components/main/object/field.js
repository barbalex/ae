/*
 * receives a field name and it's value
 * decides what type of field to generate
 */

'use strict'

import React from 'react'
import FieldLink from './fieldLink.js'
import FieldInput from './fieldInput.js'
import FieldBoolean from './fieldBoolean.js'
import FieldTextarea from './fieldTextarea.js'

const Field = ({
  fieldName,
  pcType,
  pcName,
  collectionIsEditing,
  onSaveObjectField,
  fieldValue
}) => {
  let fieldVal = fieldValue
  // convert german booleans
  if (fieldVal === 'nein') fieldVal = false
  if (fieldVal === 'ja') fieldVal = true

  if (
    (typeof fieldVal === 'string' && fieldVal.slice(0, 7) === 'http://') ||
    (typeof fieldVal === 'string' && fieldVal.slice(0, 8) === 'https://') ||
    (typeof fieldVal === 'string' && fieldVal.slice(0, 2) === '//')
  ) {
    // www-Links als Link darstellen
    return (
      <FieldLink
        fieldName={fieldName}
        fieldValue={fieldVal}
        pcType={pcType}
        pcName={pcName}
        collectionIsEditing={collectionIsEditing}
        onSaveObjectField={onSaveObjectField}
      />
    )
  }
  if (
    typeof fieldVal === 'string' &&
    fieldVal.length < 45
  ) {
    return (
      <FieldInput
        fieldName={fieldName}
        fieldValue={fieldVal}
        inputType="text"
        pcType={pcType}
        pcName={pcName}
        collectionIsEditing={collectionIsEditing}
        onSaveObjectField={onSaveObjectField}
      />
    )
  }
  if (
    typeof fieldVal === 'string' &&
    fieldVal.length >= 45
  ) {
    return (
      <FieldTextarea
        fieldName={fieldName}
        fieldValue={fieldVal}
        pcType={pcType}
        pcName={pcName}
        collectionIsEditing={collectionIsEditing}
        onSaveObjectField={onSaveObjectField}
      />
    )
  }
  if (typeof fieldVal === 'number') {
    return (
      <FieldInput
        fieldName={fieldName}
        fieldValue={fieldVal}
        inputType="number"
        pcType={pcType}
        pcName={pcName}
        collectionIsEditing={collectionIsEditing}
        onSaveObjectField={onSaveObjectField}
      />
    )
  }
  if (typeof fieldVal === 'boolean') {
    return (
      <FieldBoolean
        fieldName={fieldName}
        fieldValue={fieldVal}
        pcType={pcType}
        pcName={pcName}
        collectionIsEditing={collectionIsEditing}
        onSaveObjectField={onSaveObjectField}
      />
    )
  }
  // fallback is text input
  return (
    <FieldInput
      fieldName={fieldName}
      fieldValue={fieldVal}
      inputType="text"
      pcType={pcType}
      pcName={pcName}
      collectionIsEditing={collectionIsEditing}
      onSaveObjectField={onSaveObjectField}
    />
  )
}

Field.displayName = 'Field'

Field.propTypes = {
  fieldName: React.PropTypes.string,
  fieldValue: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.bool
  ]),
  pcType: React.PropTypes.string,
  pcName: React.PropTypes.string,
  collectionIsEditing: React.PropTypes.bool,
  onSaveObjectField: React.PropTypes.func
}

export default Field
