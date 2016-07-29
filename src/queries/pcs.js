/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * then returns an object for every property collection
 *
 * no es6 in ddocs!
 */

import app from 'ampersand-app'
import { uniqBy } from 'lodash'

const ddoc = {
  id: '_design/pcs',
  views: {
    pcs: {
      map: function(doc) {
        if (
          doc.Typ &&
          doc.Typ === 'Objekt' &&
          doc.Eigenschaftensammlungen
        ) {
          doc.Eigenschaftensammlungen.forEach(function(pc) {
            // add pcZusammenfassend
            var pcZusammenfassend = !!pc.zusammenfassend
            var felder = {}
            Object.keys(pc).forEach(function(key) {
              if (key !== 'Typ' && key !== 'Name' && key !== 'Eigenschaften') {
                felder[key] = pc[key]
              }
            })
            emit(
              [pc.Name, pcZusammenfassend, pc['Organisation mit Schreibrecht'], felder],
              null
            )
          })
        }
      }.toString(),
      reduce: '_count'
    }
  }
}

// don't understand why but passing reduce
// produces an error in couch
const queryOptions = {
  group_level: 4
}

export default () =>
  new Promise((resolve, reject) => {
    app.remoteDb.query('pcs', queryOptions)
      .then((result) => {
        const rows = result.rows
        const uniqueRows = uniqBy(rows, (row) => row.key[0])
        let pcs = uniqueRows.map((row) => ({
          name: row.key[0],
          combining: row.key[1],
          organization: row.key[2],
          fields: row.key[3],
          count: row.value
        }))
        // sort by pcName
        pcs = pcs.sort((pc) => pc.name)
        resolve(pcs)
      })
      .catch((error) => reject(error))
  })
