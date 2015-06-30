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

  console.log('getPathFromGuid.js callec with guid:', guid)
  console.log('getPathFromGuid.js callec with object:', object)
  console.log('getPathFromGuid.js callec with metaData:', metaData)

  let pathArray = []
  const store = window.objectStore
  object = object || store.getItemByGuid(guid)
  const dsName = object.Gruppe === 'Lebensräume' ? 'Lebensräume_CH_Delarze_(2008)_Allgemeine_Umgebung_(Areale)' : object.Taxonomie.Name
  metaData = metaData || store.getDsMetadata()[dsName]

  pathArray.push(object.Gruppe)

  switch (metaData.HierarchieTyp) {
  case 'Parent':
    if (object && object.Taxonomie && object.Taxonomie.Hierarchie) pathArray = _.pluck(object.Taxonomie.Hierarchie, 'Name')
    break
  case 'Felder':
    if (metaData.HierarchieFelder && object && object.Taxonomie && object.Taxonomie.Eigenschaften) {
      _.forEach(metaData.HierarchieFelder, function (feld, index) {
        if (object.Taxonomie.Eigenschaften[feld]) {
          if (index + 1 === metaData.HierarchieFelder.length) {
            pathArray.push(object._id)
          } else {
            pathArray.push(object.Taxonomie.Eigenschaften[feld])
          }
        }
      })
    }
    break
  }

  return '/' + pathArray.join('/')
}
