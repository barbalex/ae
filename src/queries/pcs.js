/*
 * creates a design doc and puts it into the localDb
 * then queries it with the provided options
 * then returns an object for every property collection
 */

'use strict'

import app from 'ampersand-app'
import _ from 'lodash'

export default function () {
  return new Promise(function (resolve, reject) {
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
      .catch(function (error) {
        // ignore if doc already exists
        if (error.status !== 409) reject(error)
      })
      .then(function (response) {
        // console.log('pcs: response from putting ddoc')
        const options = {
          group_level: 4,
          reduce: '_count'
        }
        return app.localDb.query('pcs', options)
      })
      .then(function (result) {
        const rows = result.rows
        const uniqueRows = _.uniq(rows, function (row) {
          return row.key[0]
        })
        let pcs = uniqueRows.map(function (row) {
          return {
            name: row.key[0],
            combining: row.key[1],
            importedBy: row.key[2],
            fields: row.key[3],
            count: row.value
          }
        })
        // sort by pcName
        pcs = _.sortBy(pcs, function (pc) {
          return pc.name
        })
        resolve(pcs)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
