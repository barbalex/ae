/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * then returns an object for every property collection
 *
 * if offlineIndexes is true: queries from remote and does not create design doc
 *
 * no es6 in ddocs!
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

const ddoc = {
  _id: '_design/pcs',
  views: {
    'pcs': {
      map: function (doc) {
        if (doc.Typ && doc.Typ === 'Objekt' && doc.Eigenschaftensammlungen) {
          doc.Eigenschaftensammlungen.forEach(function (pc) {
            // add pcZusammenfassend
            var pcZusammenfassend = !!pc.zusammenfassend
            var felder = {}
            Object.keys(pc).forEach(function (key) {
              if (key !== 'Typ' && key !== 'Name' && key !== 'Eigenschaften') {
                felder[key] = pc[key]
              }
            })
            window.emit([pc.Name, pcZusammenfassend, pc['importiert von'], felder], null)
          })
        }
      }.toString(),
      reduce: '_count'
    }
  }
}

const queryOptionsPouch = {
  group_level: 4,
  reduce: '_count'
}
// don't understand why but passing reduce
// produces an error in couch
const queryOptionsCouch = {
  group_level: 4
}

const query = {
  local () {
    return new Promise((resolve, reject) => {
      app.localDb.put(ddoc)
        .catch((error) => {
          // ignore if doc already exists
          if (error.status !== 409) reject(error)
        })
        .then((response) => app.localDb.query('pcs', queryOptionsPouch))
        .then((result) => resolve(result))
        .catch((error) => reject(error))
    })
  },
  remote () {
    return new Promise((resolve, reject) => {
      app.remoteDb.query('pcs', queryOptionsCouch)
        .then((result) => resolve(result))
        .catch((error) => reject(error))
    })
  }
}

export default (offlineIndexes) => {
  const db = offlineIndexes ? 'local' : 'remote'
  return new Promise((resolve, reject) => {
    query[db]()
      .then((result) => {
        const rows = result.rows
        const uniqueRows = _.uniq(rows, (row) => row.key[0])
        let pcs = uniqueRows.map((row) => ({
          name: row.key[0],
          combining: row.key[1],
          importedBy: row.key[2],
          fields: row.key[3],
          count: row.value
        }))
        // sort by pcName
        pcs = pcs.sort((pc) => pc.name)
        resolve(pcs)
      })
      .catch((error) => reject(error))
  })
}
