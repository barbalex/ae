/*
 * gets a path
 * returns the guid of the lr
 */

'use strict'

import _ from 'lodash'

function checkNextLevel (path, level, lrItems) {
  let object = null
  const taxonomy = path[1]
  console.log('getLrObjectFromPath.js, taxonomy', taxonomy)

  if (level === 2) {
    // on this level the path name = object.Taxonomie.Eigenschaften.Taxonomie AND object.Taxonomie.Eigenschaften.Einheit equal path[1]
    object = _.find(lrItems, function (item) {
      console.log('getLrObjectFromPath.js, item', item)
      const prop = item.Taxonomie.Eigenschaften
      console.log('getLrObjectFromPath.js, prop.Einheit', prop.Einheit)
      console.log('getLrObjectFromPath.js, prop.Einheit === taxonomy', prop.Einheit === taxonomy)
      return prop.Einheit === taxonomy
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
  console.log('getLrObjectFromPath.js, lrItems', lrItems)
  console.log('getLrObjectFromPath.js, lrItems.length', lrItems.length)
  checkNextLevel(path, 2, lrItems)
}
