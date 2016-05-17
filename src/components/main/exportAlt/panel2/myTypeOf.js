'use strict'

export default (value) => {
  if (typeof value === 'boolean') return 'boolean'
  if (
    parseInt(value, 10) &&
    parseFloat(value) &&
    parseInt(value, 10) !== parseFloat(value) &&
    parseInt(value, 10) == value  // eslint-disable-line eqeqeq
  ) {
    return 'float'
  }
  // verhindern, dass führende Nullen abgeschnitten werden
  if (
    (
      parseInt(value, 10) == value &&  // eslint-disable-line eqeqeq
      value.toString().length === Math.ceil(parseInt(value, 10) / 10)
    ) ||
    value == '0') {  // eslint-disable-line eqeqeq
    return 'integer'
  }
  if (typeof value === 'object') return 'object'
  if (typeof value === 'string') return 'string'
  if (value === undefined) return 'undefined'
  if (typeof value === 'function') return 'function'
}
