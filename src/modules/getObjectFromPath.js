/*
 * gets a path
 * returns the object or undefined
 */

'use strict'

import _ from 'lodash'
import isGuid from './isGuid.js'

export default function (path) {
  const items = window.objectStore.getItems()
  const isGuidPath = path.length === 1 && isGuid(path[0])
  if (isGuidPath) return items[path[0]]

  // if no guidpath, path length needs to be at least 2
  // Lebensräume is no object
  if (!path || !path.length || path.length < 2) return undefined

  const object = _.find(items, { path: path })
  return object
}
