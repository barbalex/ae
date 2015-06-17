/*
 * tests, if a value is a GUID
 * source: http://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
 */
'use strict'

export default function (value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}
