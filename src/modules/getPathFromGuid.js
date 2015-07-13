/*
 * gets guid
 * returns the full path
 * if path is requested for an object whose group is not loaded in the store
 * object is passed in too
 */

'use strict'

import _ from 'lodash'

export default function (guid, object) {
  let path = []
  object = object || window.objectStore.getItem(guid)
  if (object && object.Taxonomien && object.Taxonomien[0] && object.Taxonomien[0].Eigenschaften && object.Taxonomien[0].Eigenschaften.Hierarchie && object.Taxonomien[0].Eigenschaften.Hierarchie) {
    path = _.pluck(object.Taxonomien[0].Eigenschaften.Hierarchie, 'Name')
    path.unshift(object.Gruppe)
  }

  const payload = {
    path: path,
    url: '/' + path.join('/')
  }

  return payload
}
