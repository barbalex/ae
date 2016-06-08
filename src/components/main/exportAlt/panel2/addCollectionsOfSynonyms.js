/**
 * gets objectsToFilter
 * loops all passed objectsToFilter
 * finds their synonym objectsToFilter
 * adds missing collections
 * returns objectsToFilter
 */

import { map as _map } from 'lodash'
import addCollectionsOfSynonym from './addCollectionsOfSynonym.js'

export default (originalObjects, objectsToFilter) => {
  objectsToFilter.forEach((object) => {
    if (
      object.Beziehungssammlungen &&
      object.Beziehungssammlungen.length
    ) {
      object.Beziehungssammlungen.forEach((rc) => {
        if (
          rc.Typ && rc.Typ === 'taxonomisch' &&
          rc['Art der Beziehungen'] &&
          rc['Art der Beziehungen'] === 'synonym' &&
          rc.Beziehungen && rc.Beziehungen.length
        ) {
          rc.Beziehungen.forEach((relation) => {
            if (
              relation.Beziehungspartner &&
              relation.Beziehungspartner.length
            ) {
              const rPartnerGuids = _map(relation.Beziehungspartner, 'GUID')
              rPartnerGuids.forEach((guid) => {
                object = addCollectionsOfSynonym(originalObjects, object, guid)
              })
            }
          })
        }
      })
    }
  })
  return objectsToFilter
}
