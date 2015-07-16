/*
 * gets a path
 * returns the object or undefined
 */

'use strict'

import _ from 'lodash'
import isGuid from './isGuid.js'
import replaceProblematicPathCharactersFromArray from './replaceProblematicPathCharactersFromArray.js'

export default function (path) {
  const items = window.objectStore.items

  // check if a guidPath was passed
  const isGuidPath = path.length === 1 && isGuid(path[0])
  if (isGuidPath) return items[path[0]]

  // check if the pathname equals an object's path
  path = replaceProblematicPathCharactersFromArray(path)
  const object = _.find(items, function (item) {
    return _.isEqual(item.path, path)
  })
  return _.keys(object).length > 0 ? object : null
}
