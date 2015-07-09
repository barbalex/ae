/*
 * gets object
 * adds the full path to the object
 */

'use strict'

import _ from 'lodash'

export default function (object) {
  let path = []
  const pcName = object.Gruppe === 'Lebensräume' ? 'Lebensräume' : object.Taxonomie.Name
  const metaData = window.objectStore.getTaxMetadata()[pcName]
  path.push(object.Gruppe)

  switch (metaData.HierarchieTyp) {
  case 'Parent':
    if (object && object.Taxonomie && object.Taxonomie.Eigenschaften && object.Taxonomie.Eigenschaften.Hierarchie) {
      path.push(_.pluck(object.Taxonomie.Eigenschaften.Hierarchie, 'Name'))
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
  object.path = path
}
