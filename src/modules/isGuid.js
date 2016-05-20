/*
 * tests, if a value is an object GUID
 */
'use strict'

export default (value) =>
  new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$').test(value)
