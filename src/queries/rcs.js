/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * then returns an object for every relation collection
 * no es6 in ddocs!
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default () => {
  return new Promise((resolve, reject) => {
    const ddoc = {
      _id: '_design/rcs',
      views: {
        'rcs': {
          map: function (doc) {
            if (doc.Typ && doc.Typ === 'Objekt') {
              if (doc.Beziehungssammlungen) {
                doc.Beziehungssammlungen.forEach(function (rc) {
                  // bsZusammenfassend ergänzen
                  const bsZusammenfassend = !!rc.zusammenfassend
                  let felder = {}
                  let x
                  for (x in rc) {
                    if (x !== 'Typ' && x !== 'Name' && x !== 'Eigenschaften') {
                      felder[x] = rc[x]
                    }
                  }
                  emit([rc.Name, bsZusammenfassend, rc['importiert von'], felder], null)
                })
              }
            }
          }.toString(),
          reduce: '_count'
        }
      }
    }

    app.localDb.put(ddoc)
      .catch((error) => {
        // ignore if doc already exists
        if (error.status !== 409) reject(error)
      })
      .then((response) => {
        // console.log('rcs: response from putting ddoc')
        const options = {
          group_level: 4,
          reduce: '_count'
        }
        return app.localDb.query('rcs', options)
      })
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
