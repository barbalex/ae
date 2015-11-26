/*
 * gets a value
 * converts it to what it probably should be
 */

'use strict'

export default (value) => {
  /* eslint-disable eqeqeq */
  if (value == -1) return true
  if (value == 'true') return true
  if (value == 'false') return false
  if (value == parseInt(value, 10)) return parseInt(value, 10)
  if (value == parseFloat(value, 10)) return parseFloat(value, 10)
  /* eslint-enable */
  return value
}
