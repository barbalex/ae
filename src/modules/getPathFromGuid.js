/*
 * gets guid
 * returns the full path
 * if path is requested for an object whose group is not loaded in the store
 * object is passed in too
 * and also medatada
 */

'use strict'

import _ from 'lodash'

export default function (guid, object, metaData) {
  let path = []
  const store = window.objectStore
  object = object || store.getItem(guid)
  const pcName = object.Gruppe === 'Lebensräume' ? 'Lebensräume' : object.Taxonomie.Name
  metaData = metaData || store.getTaxMetadata()[pcName]
  path.push(object.Gruppe)

  switch (metaData.HierarchieTyp) {
  case 'Parent':
    if (object && object.Taxonomie && object.Taxonomie.Eigenschaften && object.Taxonomie.Eigenschaften.Hierarchie) {
      path = _.pluck(object.Taxonomie.Eigenschaften.Hierarchie, 'Name')
      path.unshift('Lebensräume')
    }
    break
  case 'Felder':
    if (metaData.HierarchieFelder && object && object.Taxonomie && object.Taxonomie.Eigenschaften) {
      _.forEach(metaData.HierarchieFelder, function (feld, index) {
        if (object.Taxonomie.Eigenschaften[feld]) {
          if (index + 1 === metaData.HierarchieFelder.length) {
            path.push(object._id)
          } else {
            path.push(object.Taxonomie.Eigenschaften[feld])
          }
        }
      })
    }
    break
  }

  const payload = {
    path: path,
    url: '/' + path.join('/')
  }

  return payload
}
