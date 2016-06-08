import myTypeOf from './myTypeOf.js'

export default (fieldValue, filterValue, comparisonOperator) => {
  // always return false for null values - unless null was explicitly filtered (which is not implemented)
  if (filterValue !== null && (fieldValue === null || fieldValue === undefined)) return false
  // prepare values
  if (myTypeOf(fieldValue) === 'string') {
    fieldValue = fieldValue.toLowerCase()
  }
  if (myTypeOf(filterValue) === 'string') {
    filterValue = filterValue.toLowerCase()
  }
  // compare them
  if (!comparisonOperator && fieldValue == filterValue) return true  // eslint-disable-line eqeqeq
  if (
    !comparisonOperator &&
    myTypeOf(fieldValue) === 'string' &&
    fieldValue.indexOf(filterValue) >= 0
  ) {
    return true
  }
  if (comparisonOperator === '=' && fieldValue == filterValue) return true  // eslint-disable-line eqeqeq
  if (comparisonOperator === '>' && fieldValue > filterValue) return true
  if (comparisonOperator === '>=' && fieldValue >= filterValue) return true
  if (comparisonOperator === '<' && fieldValue < filterValue) return true
  if (comparisonOperator === '<=' && fieldValue <= filterValue) return true
  return false
}
