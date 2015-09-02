/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * then returns an object for every property collection
 * no es6 in ddocs!
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default () => {
  return new Promise((resolve, reject) => {
    const ddoc = {
      _id: '_design/pcs',
      views: {
        'pcs': {
          map: function (doc) {
            if (doc.Typ && doc.Typ === 'Objekt') {
              if (doc.Eigenschaftensammlungen) {
                doc.Eigenschaftensammlungen.forEach(function (es) {
                  // esZusammenfassend ergänzen
                  const esZusammenfassend = !!es.zusammenfassend
                  let felder = {}
                  let x
                  for (x in es) {
                    if (x !== 'Typ' && x !== 'Name' && x !== 'Eigenschaften') {
                      felder[x] = es[x]
                    }
                  }
                  emit([es.Name, esZusammenfassend, es['importiert von'], felder], null)
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
        // console.log('pcs: response from putting ddoc')
        const options = {
          group_level: 4,
          reduce: '_count'
        }
        return app.localDb.query('pcs', options)
      })
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
        pcs = _.sortBy(pcs, (pc) => pc.name)
        resolve(pcs)
      })
      .catch((error) => reject(error))
  })
}
