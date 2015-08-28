/*
 * receives an array of taxonomic relation collections
 * returns an array of guids of synonyms
 */

'use strict'

export default function (taxRcs) {
  let guidsOfSynonyms = []
  taxRcs.forEach(function (rc) {
    if (rc['Art der Beziehungen'] && rc['Art der Beziehungen'] === 'synonym' && rc.Beziehungen) {
      rc.Beziehungen.forEach(function (relation) {
        if (relation.Beziehungspartner) {
          relation.Beziehungspartner.forEach(function (relationPartner) {
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
