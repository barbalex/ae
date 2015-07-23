'use strict'

import app from 'ampersand-app'
import _ from 'lodash'
import getGuidsOfSynonymsFromTaxonomicRcs from './getGuidsOfSynonymsFromTaxonomicRcs.js'

export default function (object) {
  return new Promise(function (resolve, reject) {
    if (object.Beziehungssammlungen && object.Beziehungssammlungen.length > 0) {
      const rcs = object.Beziehungssammlungen
      // taxonomic relation collections
      const taxRcs = _.filter(rcs, function (rc) {
        return rc.Typ && rc.Typ === 'taxonomisch'
      })
      // synonym objects
      const guidsOfSynonyms = getGuidsOfSynonymsFromTaxonomicRcs(taxRcs)
      app.localDb.allDocs({include_docs: true, keys: guidsOfSynonyms})
        .then(function (result) {
          const synonymObjects = result.rows.map(function (row) {
            return row.doc
          })
          resolve(synonymObjects)
        })
        .catch(function (error) {
          reject('object.js: error fetching synonym objects:', error)
        })
    } else {
      resolve([])
    }
  })
}
