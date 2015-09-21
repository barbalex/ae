/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * then returns an object for every relation collection
 * no es6 in ddocs!
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

const ddoc = {
  _id: '_design/rcs',
  views: {
    'rcs': {
      map: function (doc) {
        if (doc.Typ && doc.Typ === 'Objekt') {
          if (doc.Beziehungssammlungen) {
            doc.Beziehungssammlungen.forEach(function (rc) {
              // add bsZusammenfassend
              const bsZusammenfassend = !!rc.zusammenfassend
              var felder = {}
              Object.keys(rc).forEach(function (key) {
                if (key !== 'Typ' && key !== 'Name' && key !== 'Eigenschaften') {
                  felder[key] = rc[key]
                }
              })
              emit([rc.Name, bsZusammenfassend, rc['importiert von'], felder], null)
            })
          }
        }
      }.toString(),
      reduce: '_count'
    }
  }
}

const queryOptions = {
  group_level: 4,
  reduce: '_count'
}

const query = {
  local () {
    return new Promise((resolve, reject) => {
      app.localDb.put(ddoc)
        .catch((error) => {
          // ignore if doc already exists
          if (error.status !== 409) reject(error)
        })
        .then((response) => app.localDb.query('rcs', queryOptions))
        .then((result) => resolve(result))
        .catch((error) => reject(error))
    })
  },
  remote () {
    return new Promise((resolve, reject) => {
      app.remoteDb.query('artendb/aeRcs', queryOptions)
        .then((result) => resolve(result))
        .catch((error) => reject(error))
    })
  }
}

export default (offlineIndexes) => {
  const db = offlineIndexes ? 'local' : 'remote'
  return new Promise((resolve, reject) => {
    query[db]
      .then((result) => {
        const rows = result.rows
        const uniqueRows = _.uniq(rows, (row) => row.key[0])
        let rcs = uniqueRows.map((row) => ({
          name: row.key[0],
          combining: row.key[1],
          importedBy: row.key[2],
          fields: row.key[3],
          count: row.value
        }))
        // sort by rcName
        rcs = _.sortBy(rcs, (rc) => rc.name)
        resolve(rcs)
      })
      .catch((error) => reject(error))
  })
}
