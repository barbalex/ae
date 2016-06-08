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
    const hasBeziehungssammlungen = (
      object.Beziehungssammlungen &&
      object.Beziehungssammlungen.length
    )
    if (hasBeziehungssammlungen) {
      object.Beziehungssammlungen.forEach((rc) => {
        const isSynonym = (
          rc.Typ &&
          rc.Typ === 'taxonomisch' &&
          rc['Art der Beziehungen'] &&
          rc['Art der Beziehungen'] === 'synonym' &&
          rc.Beziehungen &&
          rc.Beziehungen.length > 0
        )
        if (isSynonym) {
          rc.Beziehungen.forEach((relation) => {
            if (
              relation.Beziehungspartner &&
              relation.Beziehungspartner.length &&
              relation.Beziehungspartner.length > 0
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
