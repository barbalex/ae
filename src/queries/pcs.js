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
        console.log('pcs: response from putting ddoc')
        const options = {
          group_level: 4,
          reduce: '_count'
        }
        return app.localDb.query('pcs', options)
      })
      .then(function (result) {
        // TODO: see if count can be extracted
        console.log('pcs.js: result', result)
        let pcs = result.rows
        // get the keys
        pcs = _.pluck(pcs, 'key')
        // group by name
        pcs = _.uniq(pcs, function (pc) {
          return pc[0]
        })
        // sort by pcName
        pcs = _.sortBy(pcs, function (pc) {
          return pc[0]
        })
        pcs = _.map(pcs, function (pc) {
          return {
            name: pc[0],
            combining: pc[1],
            importedBy: pc[2],
            fields: pc[3]
          }
        })
        resolve(pcs)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
