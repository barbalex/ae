'use strict'

import myTypeOf from './myTypeOf.js'

export default (fieldValue, filterValue, comparisonOperator) => {
  // prepare values
  if (myTypeOf(fieldValue) === 'string') fieldValue = fieldValue.toLowerCase()
  if (myTypeOf(filterValue) === 'string') filterValue = filterValue.toLowerCase()
  // compare them
  if (!comparisonOperator && fieldValue == filterValue) return true
  if (!comparisonOperator && myTypeOf(fieldValue) === 'string' && fieldValue.indexOf(filterValue) >= 0) return true
  if (comparisonOperator === '=' && fieldValue == filterValue) return true
  if (comparisonOperator === '>' && fieldValue > filterValue) return true
  if (comparisonOperator === '>=' && fieldValue >= filterValue) return true
  if (comparisonOperator === '<' && fieldValue < filterValue) return true
  if (comparisonOperator === '<=' && fieldValue <= filterValue) return true
  return false
}
