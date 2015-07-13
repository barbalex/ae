/*
 * gets object
 * adds the full path to the object
 */

'use strict'

import getPathFromGuid from './getPathFromGuid.js'

export default function (object) {
  object.path = getPathFromGuid(object._id, object).path
}
