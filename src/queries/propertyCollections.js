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
      _id: '_design/propertyCollections',
      views: {
        'propertyCollections': {
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
                  emit(['Datensammlung', es.Name, esZusammenfassend, es['importiert von'], felder], doc._id)
                })
              }
            }
          }.toString()
        }
      }
    }

    app.localDb.put(ddoc)
      .catch(function (error) {
        // ignore if doc already exists
        if (error.status !== 409) reject(error)
      })
      .then(function (response) {
        const options = {
          startkey: ['Datensammlung'],
          endkey: ['Datensammlung', {}, {}, {}, {}],
          group_level: 5,
          reduce: '_count'
        }
        return app.localDb.query('propertyCollections', options)
      })
      .then(function (result) {
        let pcs = result.rows
        // get the keys
        pcs = _.pluck(pcs, 'key')
        // group by name
        pcs = _.uniq(pcs, function (pc) {
          return pc[1]
        })
        // sort by pcName
        pcs = _.sortBy(pcs, function (pc) {
          return pc[1]
        })
        pcs = _.map(pcs, function (pc) {
          return {
            type: pc[0],
            name: pc[1],
            combining: pc[2],
            importedBy: pc[3],
            fields: pc[4]
          }
        })
        resolve(pcs)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
