/*
 * receives a field name and it's value
 * decides what type of field to generate
 */

'use strict'

import FieldLink from './fieldLink.js'
import FieldInput from './fieldInput.js'
import FieldTextarea from './fieldTextarea.js'
import FieldBoolean from './fieldBoolean.js'

export default function (fieldName, fieldValue, pcType, pcName) {
  if ((typeof fieldValue === 'string' && fieldValue.slice(0, 7) === 'http://') || (typeof fieldValue === 'string' && fieldValue.slice(0, 8) === 'https://') || (typeof fieldValue === 'string' && fieldValue.slice(0, 2) === '//')) {
    // www-Links als Link darstellen
    return FieldLink(fieldName, fieldValue, pcType, pcName)
  }
  if (typeof fieldValue === 'string' && fieldValue.length < 45) {
    return FieldInput(fieldName, fieldValue, 'text', pcType, pcName)
  }
  if (typeof fieldValue === 'string' && fieldValue.length >= 45) {
    return FieldTextarea(fieldName, fieldValue, pcType)
  }
  if (typeof fieldValue === 'number') {
    return FieldInput(fieldName, fieldValue, 'number', pcType, pcName)
  }
  if (typeof fieldValue === 'boolean') {
    return FieldBoolean(fieldName, fieldValue, pcType, pcName)
  }
  // fallback ist text input
  return FieldInput(fieldName, fieldValue, 'text', pcType, pcName)
}
