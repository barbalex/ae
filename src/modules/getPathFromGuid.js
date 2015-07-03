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
  const dsName = object.Gruppe === 'Lebensräume' ? 'Lebensräume_CH_Delarze_(2008)_Allgemeine_Umgebung_(Areale)' : object.Taxonomie.Name
  metaData = metaData || store.getTaxMetadata()[dsName]
  path.push(object.Gruppe)

  switch (metaData.HierarchieTyp) {
  case 'Parent':
    if (object && object.Taxonomie && object.Taxonomie.Hierarchie) path = _.pluck(object.Taxonomie.Hierarchie, 'Name')
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
