/*
 * receives an array of taxonomic relation collections
 * returns an array of guids of synonyms
 */

'use strict'

import _ from 'lodash'

export default function (taxRcs) {
  let guidsOfSynonyms = []
  _.forEach(taxRcs, function (rc) {
    if (rc['Art der Beziehungen'] && rc['Art der Beziehungen'] === 'synonym' && rc.Beziehungen) {
      _.forEach(rc.Beziehungen, function (relation) {
        if (relation.Beziehungspartner) {
          _.forEach(relation.Beziehungspartner, function (relationPartner) {
            if (relationPartner.GUID) {
              guidsOfSynonyms.push(relationPartner.GUID)
            }
          })
        }
      })
    }
  })
  return guidsOfSynonyms
}
