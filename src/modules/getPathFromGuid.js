'use strict'

import _ from 'lodash'

export default function (guid) {
  let pathArray = []
  const store = window.objectStore
  const object = store.getItemByGuid(guid)
  const dsName = object.Gruppe === 'Lebensräume' ? 'Lebensräume_CH_Delarze_(2008)_Allgemeine_Umgebung_(Areale)' : object.Taxonomie.Name
  const metaData = store.getDsMetadata()[dsName]

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
