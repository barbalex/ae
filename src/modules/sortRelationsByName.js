/*
 * gets an array with the relations
 * returns this array sorted by the relations name
 * TODO: catch if a relation does not have Beziehungspartner
 */

'use strict'

export default (relations) => {
  if (relations && relations.length > 0) {
    relations.sort((a, b) => {
      let aName
      let bName

      a.Beziehungspartner.forEach((partner) => {
        if (partner.Gruppe === 'Lebensräume') {
          // sortiert werden soll bei Lebensräumen zuerst nach Taxonomie, dann nach Name
          aName = partner.Gruppe + partner.Taxonomie + partner.Name
        } else {
          aName = partner.Gruppe + partner.Name
        }
      })
      b.Beziehungspartner.forEach((partner) => {
        if (partner.Gruppe === 'Lebensräume') {
          bName = partner.Gruppe + partner.Taxonomie + partner.Name
        } else {
          bName = partner.Gruppe + partner.Name
        }
      })
      if (aName && bName) {
        return aName.toLowerCase() === bName.toLowerCase() ? 0 : (aName.toLowerCase() > bName.toLowerCase() ? 1 : -1)
      }
      return aName === bName ? 0 : (aName > bName ? 1 : -1)
    })

    return relations
  }
  return null
}
