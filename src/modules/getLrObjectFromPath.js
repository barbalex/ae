/*
 * gets a path
 * returns the guid of the lr
 */

'use strict'

import _ from 'lodash'

function checkNextLevel (path, level, lrItems) {
  let object = null

  if (level === 2) {
    // on this level the path name = object.Taxonomie.Eigenschaften.Taxonomie AND object.Taxonomie.Eigenschaften.Einheit equal path[1]
    object = _.find(lrItems, function (item) {
      const taxonomy = path[1]
      const prop = item.Taxonomie.Eigenschaften
      console.log('getLrObjectFromPath.js, taxonomy', taxonomy)
      return prop.Einheit === taxonomy && prop.Taxonomie === taxonomy
    })
    console.log('getLrObjectFromPath.js, object', object)
    return object
  }
  // if level > 2
}

export default function (path) {
  console.log('getLrObjectFromPath.js, path', path)
  console.log('getLrObjectFromPath.js, path.length', path.length)
  // path length needs to be at least 2
  // Lebensräume is no object
  if (!path || !path.length || path.length < 2) return null

  const items = window.objectStore.getItems()
  const lrItems = _.filter(items, function (item) {
    return item.Gruppe && item.Gruppe === 'Lebensräume'
  })
  checkNextLevel(path, 2, lrItems)
}
