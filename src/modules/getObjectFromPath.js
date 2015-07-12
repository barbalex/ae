/*
 * gets a path
 * returns the object or undefined
 */

'use strict'

import _ from 'lodash'

export default function (path) {
  // path length needs to be at least 2
  // Lebensräume is no object
  if (!path || !path.length || path.length < 2) return undefined

  const items = window.objectStore.getItems()
  const object = _.find(items, { path: path })
  return object
}
