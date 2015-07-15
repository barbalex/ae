/*
 * gets a path
 * returns the object or undefined
 */

'use strict'

import isGuid from './isGuid.js'
import getUrlParameterByName from './getUrlParameterByName.js'

export default function (path) {
  const items = window.objectStore.items

  // check if a guidPath was passed
  const isGuidPath = path.length === 1 && isGuid(path[0])
  if (isGuidPath) return items[path[0]]

  // nope
  // so check if an id was passed as parameter in the path
  const guid = getUrlParameterByName('id')
  return items[guid]
}
