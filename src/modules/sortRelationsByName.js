/*
 * gets an array with the relations
 * returns this array sorted by the relations name
 */

'use strict'

import _ from 'lodash'

export default function (relations) {
  relations.sort(function (a, b) {
    let aName
    let bName

    _.each(a.Beziehungspartner, function (beziehungspartner) {
      if (beziehungspartner.Gruppe === 'Lebensräume') {
        // sortiert werden soll bei Lebensräumen zuerst nach Taxonomie, dann nach Name
        aName = beziehungspartner.Gruppe + beziehungspartner.Taxonomie + beziehungspartner.Name
      } else {
        aName = beziehungspartner.Gruppe + beziehungspartner.Name
      }
    })
    _.each(b.Beziehungspartner, function (beziehungspartner) {
      if (beziehungspartner.Gruppe === 'Lebensräume') {
        bName = beziehungspartner.Gruppe + beziehungspartner.Taxonomie + beziehungspartner.Name
      } else {
        bName = beziehungspartner.Gruppe + beziehungspartner.Name
      }
    })
    if (aName && bName) {
      return (aName.toLowerCase() === bName.toLowerCase()) ? 0 : (aName.toLowerCase() > bName.toLowerCase()) ? 1 : -1
    }
    return (aName === bName) ? 0 : (aName > bName) ? 1 : -1
  })

  return relations
}
