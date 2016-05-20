/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * then returns an object for every taxonomy collection
 *
 * if offlineIndexes is true: queries from remote and does not create design doc
 *
 * no es6 in ddocs!
 */

'use strict'

import app from 'ampersand-app'
import { uniqBy } from 'lodash'

const ddoc = {
  _id: '_design/tcs',
  views: {
    tcs: {
      map: function(doc) {
        if (doc.Typ && doc.Typ === 'Objekt' && doc.Gruppe && doc.Taxonomien) {
          doc.Taxonomien.forEach(function(tc) {
            // add pcZusammenfassend
            var standard = !!tc.Standardtaxonomie
            var felder = {}
            Object.keys(tc).forEach(function(key) {
              if (key !== 'Name' && key !== 'Eigenschaften') {
                felder[key] = tc[key]
              }
            })
            emit([doc.Gruppe, standard, tc.Name, tc['Organisation mit Schreibrecht'], felder], null)
          })
        }
      }.toString(),
      reduce: '_count'
    }
  }
}

const queryOptionsPouch = {
  group_level: 5,
  reduce: '_count'
}
// don't understand why but passing reduce
// produces an error in couch
const queryOptionsCouch = {
  group_level: 5
}

const query = {
  local() {
    return new Promise((resolve, reject) => {
      app.localDb.put(ddoc)
        .catch((error) => {
          // ignore if doc already exists
          if (error.status !== 409) reject(error)
        })
        .then(() => app.localDb.query('tcs', queryOptionsPouch))
        .then((result) => resolve(result))
        .catch((error) => reject(error))
    })
  },
  remote() {
    return new Promise((resolve, reject) => {
      app.remoteDb.query('tcs', queryOptionsCouch)
        .then((result) => resolve(result))
        .catch((error) => reject(error))
    })
  }
}

export default (offlineIndexes) => new Promise((resolve, reject) => {
  const db = offlineIndexes ? 'local' : 'remote'
  query[db]()
    .then((result) => {
      const rows = result.rows
      const uniqueRows = uniqBy(rows, (row) => [row.key[0], row.key[1], row.key[2]])
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
