/*
 * receives a field name and it's value
 * decides what type of field to generate
 */

'use strict'

import FieldLink from './fieldLink.js'

export default function (fieldName, fieldValue, esType, esName) {
  if ((typeof fieldValue === 'string' && fieldValue.slice(0, 7) === 'http://') || (typeof fieldValue === 'string' && fieldValue.slice(0, 8) === 'https://') || (typeof fieldValue === 'string' && fieldValue.slice(0, 2) === '//')) {
    // www-Links als Link darstellen
    return FieldLink(fieldName, fieldValue, esType, esName)
  }
  if (typeof fieldValue === 'string' && fieldValue.length < 45) {
    return FieldInputText(fieldName, fieldValue, 'text', esType, esName)
  }
  if (typeof fieldValue === 'string' && fieldValue.length >= 45) {
    return FieldTextarea(fieldName, fieldValue, esType)
  }
  if (typeof fieldValue === 'number') {
    return FieldInputNumber(fieldName, fieldValue, 'number', esType, esName)
  }
  if (typeof fieldValue === 'boolean') {
    return FieldBoolean(fieldName, fieldValue, esType, esName)
  }
  // fallback ist text input
  return FieldInputText(fieldName, fieldValue, 'text', esType, esName)
}