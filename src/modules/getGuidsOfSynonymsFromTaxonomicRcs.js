/*
 * receives an array of taxonomic relation collections
 * returns an array of guids of synonyms
 */

export default (taxRcs) => {
  const guidsOfSynonyms = []
  taxRcs.forEach((rc) => {
    if (
      rc['Art der Beziehungen'] &&
      rc['Art der Beziehungen'] === 'synonym' &&
      rc.Beziehungen
    ) {
      rc.Beziehungen.forEach((relation) => {
        if (relation.Beziehungspartner) {
          relation.Beziehungspartner.forEach((relationPartner) => {
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
