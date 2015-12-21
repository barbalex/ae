'use strict'

/**
 * gets objectsToFilter
 * loops all passed objectsToFilter
 * finds their synonym objectsToFilter
 * adds missing collections
 * returns objectsToFilter
 */

import { pluck } from 'lodash'
import addCollectionsOfSynonym from './addCollectionsOfSynonym.js'

export default (originalObjects, objectsToFilter) => {
  objectsToFilter.forEach((object) => {
    if (object.Beziehungssammlungen && object.Beziehungssammlungen.length > 0) {
      object.Beziehungssammlungen.forEach((rc) => {
        if (rc.Typ && rc.Typ === 'taxonomisch' && rc['Art der Beziehungen'] && rc['Art der Beziehungen'] === 'synonym' && rc.Beziehungen && rc.Beziehungen.length > 0) {
          rc.Beziehungen.forEach((relation) => {
            if (relation.Beziehungspartner && relation.Beziehungspartner.length > 0) {
              const rPartnerGuids = pluck(relation.Beziehungspartner, 'GUID')
              rPartnerGuids.forEach((guid) => object = addCollectionsOfSynonym(originalObjects, object, guid))
            }
          })
        }
      })
    }
  })
  return objectsToFilter
}
