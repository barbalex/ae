/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * then returns an object for every taxonomy collection
 *
 * no es6 in ddocs!
 */

import app from 'ampersand-app'
import { uniqBy } from 'lodash'

const ddoc = {
  _id: '_design/tcs',
  views: {
    tcs: {
      map: function(doc) {
        if (
          doc.Typ &&
          doc.Typ === 'Objekt' &&
          doc.Gruppe &&
          doc.Taxonomien
        ) {
          doc.Taxonomien.forEach(function(tc) {
            // add pcZusammenfassend
            var standard = !!tc.Standardtaxonomie
            var felder = {}
            Object.keys(tc).forEach(function(key) {
              if (key !== 'Name' && key !== 'Eigenschaften') {
                felder[key] = tc[key]
              }
            })
            emit(
              [doc.Gruppe, standard, tc.Name, tc['Organisation mit Schreibrecht'], felder],
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
  group_level: 5
}

export default () =>
  new Promise((resolve, reject) => {
    app.remoteDb.query('tcs', queryOptions)
      .then((result) => {
        const rows = result.rows
        const uniqueRows = uniqBy(rows, (row) =>
          [row.key[0], row.key[1], row.key[2]]
        )
        let tcs = uniqueRows.map((row) => ({
          group: row.key[0],
          standard: row.key[1],
          name: row.key[2],
          organization: row.key[3],
          fields: row.key[4],
          count: row.value
        }))
        // sort by pcName
        tcs = tcs.sort((tc) => tc.name)
        resolve(tcs)
      })
      .catch((error) => reject(error))
  })
