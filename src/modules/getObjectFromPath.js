/*
 * gets a path
 * returns the object or undefined
 */

'use strict'

import app from 'ampersand-app'
import isGuid from './isGuid.js'
import replaceProblematicPathCharactersFromArray from './replaceProblematicPathCharactersFromArray.js'

export default function (path) {
  // check if a guidPath was passed
  const isGuidPath = path.length === 1 && isGuid(path[0])
  if (isGuidPath) return app.objectStore.getItem(path[0])

  // check if the pathname equals an object's path
  path = replaceProblematicPathCharactersFromArray(path)
  const guid = app.objectStore.paths[path.join('/')]
  if (guid) return app.objectStore.getItem(guid)
  return null
}
