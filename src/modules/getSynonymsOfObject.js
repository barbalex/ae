'use strict'

import app from 'ampersand-app'
import _ from 'lodash'
import getGuidsOfSynonymsFromTaxonomicRcs from './getGuidsOfSynonymsFromTaxonomicRcs.js'

export default (object) => {
  return new Promise((resolve, reject) => {
    if (object.Beziehungssammlungen && object.Beziehungssammlungen.length > 0) {
      const rcs = object.Beziehungssammlungen
      // taxonomic relation collections
      const taxRcs = rcs.filter((rc) => rc.Typ && rc.Typ === 'taxonomisch')
      // synonym objects
      const guidsOfSynonyms = getGuidsOfSynonymsFromTaxonomicRcs(taxRcs)
      app.localDb.allDocs({include_docs: true, keys: guidsOfSynonyms})
        .then((result) => {
          const synonymObjects = result.rows.map((row) => row.doc)
          resolve(synonymObjects)
        })
        .catch((error) => reject('object.js: error fetching synonym objects:', error))
    } else {
      resolve([])
    }
  })
}
